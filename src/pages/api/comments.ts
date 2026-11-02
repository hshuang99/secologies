import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

// This endpoint runs on demand (Cloudflare Worker); every other page stays static.
export const prerender = false;

interface Comment {
	id: number;
	author: string;
	content: string;
	createdAt: string;
}

// Minimal D1 typing, so no extra type package is required
interface Statement {
	bind(...values: unknown[]): Statement;
	all<T>(): Promise<{ results: T[] }>;
	first<T>(): Promise<T | null>;
}
interface Database {
	prepare(sql: string): Statement;
}

const MAX_AUTHOR = 40;
const MAX_CONTENT = 2000;
const FLOOD_LIMIT = 5; // max comments per post per minute

// Slug format: `<collection>/<content id>`, e.g. `note/en/my-post`
const SLUG = /^(note|jotting|project|podcast)\/[^\s\p{Cc}]{1,180}$/u;

// Return the creation time as an ISO 8601 UTC string (`createdAt`)
const COLUMNS = "id, author, content, strftime('%Y-%m-%dT%H:%M:%SZ', created_at) AS createdAt";

const json = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

// biome-ignore lint/style/useNamingConvention: must match the `DB` binding name in wrangler.jsonc
const getDb = () => (env as unknown as { DB: Database }).DB;

const length = (text: string) => [...text].length;

/**
 * GET /api/comments?slug=note/en/my-post
 */
export const GET: APIRoute = async ({ url }) => {
	const slug = url.searchParams.get("slug") ?? "";
	if (!SLUG.test(slug)) return json({ error: "invalid_slug" }, 400);

	try {
		const db = getDb();
		const { results } = await db
			.prepare(`SELECT ${COLUMNS} FROM comments WHERE post_slug = ? ORDER BY id ASC LIMIT 500`)
			.bind(slug)
			.all<Comment>();

		return json({ comments: results });
	} catch (error) {
		console.error("Failed to load comments:", error);
		return json({ error: "server_error" }, 500);
	}
};

/**
 * POST /api/comments
 * Body: { slug, author, content, website } (`website` is a honeypot field and must stay empty)
 */
export const POST: APIRoute = async ({ request, url }) => {
	// Only accept submissions coming from this site
	const origin = request.headers.get("origin");
	if (origin) {
		try {
			if (new URL(origin).origin !== url.origin) return json({ error: "forbidden" }, 403);
		} catch {
			return json({ error: "forbidden" }, 403);
		}
	}

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: "invalid_body" }, 400);
	}

	const slug = typeof body.slug === "string" ? body.slug : "";
	const author = typeof body.author === "string" ? body.author.replace(/\s+/g, " ").trim() : "";
	const content =
		typeof body.content === "string"
			? body.content
					.replace(/\r\n?/g, "\n")
					.replace(/\n{3,}/g, "\n\n")
					.trim()
			: "";

	// Bots tend to fill every field: pretend success, store nothing
	if (typeof body.website === "string" && body.website.trim()) return json({ comment: null });

	if (!SLUG.test(slug)) return json({ error: "invalid_slug" }, 400);
	if (!author || length(author) > MAX_AUTHOR) return json({ error: "invalid_author" }, 400);
	if (!content || length(content) > MAX_CONTENT) return json({ error: "invalid_content" }, 400);

	try {
		const db = getDb();

		// Simple flood protection per post
		const recent = await db
			.prepare("SELECT COUNT(*) AS n FROM comments WHERE post_slug = ? AND created_at >= datetime('now', '-60 seconds')")
			.bind(slug)
			.first<{ n: number }>();
		if ((recent?.n ?? 0) >= FLOOD_LIMIT) return json({ error: "rate_limited" }, 429);

		// Reject exact duplicates (double clicks, replays)
		const duplicate = await db
			.prepare("SELECT 1 AS found FROM comments WHERE post_slug = ? AND author = ? AND content = ? LIMIT 1")
			.bind(slug, author, content)
			.first();
		if (duplicate) return json({ error: "duplicate" }, 409);

		const comment = await db
			.prepare(`INSERT INTO comments (post_slug, author, content) VALUES (?, ?, ?) RETURNING ${COLUMNS}`)
			.bind(slug, author, content)
			.first<Comment>();

		return json({ comment }, 201);
	} catch (error) {
		console.error("Failed to save comment:", error);
		return json({ error: "server_error" }, 500);
	}
};
