import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import config, { monolocale } from "$config";

// Charged per request by x402 (see the `x402()` integration in astro.config.ts). Runs on demand.
export const prerender = false;

const sections = ["note", "jotting", "project", "podcast"] as const;
type Section = (typeof sections)[number];

const reply = (body: string, status = 200, type = "text/plain") =>
	new Response(body, { status, headers: { "Content-Type": `${type}; charset=utf-8` } });

/**
 * GET /api/content?path=/en/note/my-post
 * Returns the full article as Markdown. `path` is the page path on this site.
 */
export const GET: APIRoute = async ({ url }) => {
	let segments: string[];
	try {
		segments = (url.searchParams.get("path") ?? "").split("/").filter(Boolean).map(decodeURIComponent);
	} catch {
		return reply("Invalid path", 400);
	}

	// A leading locale segment selects the language, otherwise the default locale is used
	let locale = config.i18n.defaultLocale;
	if (segments.length > 1 && (config.i18n.locales as string[]).includes(segments[0])) locale = segments.shift() as string;

	const [section, ...rest] = segments;
	if (!sections.includes(section as Section) || !rest.length) return reply("Unknown content path", 404);

	const id = monolocale ? rest.join("/") : `${locale}/${rest.join("/")}`;
	const entry = (await getCollection(section as Section, item => !item.data.draft)).find(item => item.id === id);
	if (!entry) return reply("Not found", 404);

	const title = "title" in entry.data ? entry.data.title : undefined;

	return reply(`${title ? `# ${title}\n\n` : ""}${entry.body ?? ""}`, 200, "text/markdown");
};
