import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

// Comments API, backed by the D1 database bound as DB in wrangler.jsonc
// (table: see schema.sql). Everything else on the site is prerendered; this
// route runs on demand.
export const prerender = false;

const MAX_AUTHOR = 50;
const MAX_CONTENT = 2000;
// New comments wait for approval (is_approved = 0). If a page already has this
// many waiting, stop accepting more until some are approved or deleted.
const MAX_PENDING_PER_PAGE = 50;

// Just the part of D1 this file uses, so it type-checks without extra packages.
interface D1 {
  prepare(sql: string): {
    bind(...values: unknown[]): {
      all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
      first<T = Record<string, unknown>>(): Promise<T | null>;
      run(): Promise<unknown>;
    };
  };
}
const db = () => (env as unknown as { DB: D1 }).DB;

const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });

// post_slug is the page's path, e.g. "/blog/group-theory/" or "/en/blog/...".
const isSlug = (v: unknown): v is string =>
  typeof v === 'string' && v.length <= 200 && /^\/[^\s?#\u0000-\u001f]*$/u.test(v);

// Control characters out, whitespace trimmed (newlines inside comments stay).
const clean = (v: unknown) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim() : '';

// Only approved comments are ever returned.
export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get('slug');
  if (!isSlug(slug)) return json({ error: 'bad_slug' }, 400);

  const { results } = await db()
    .prepare(
      `SELECT id, author, content, created_at FROM comments
       WHERE post_slug = ? AND is_approved = 1 ORDER BY id ASC LIMIT 200`,
    )
    .bind(slug)
    .all();
  return json({ comments: results }, 200, { 'Cache-Control': 'public, max-age=60' });
};

// New comments are stored unapproved; they show up once you approve them.
export const POST: APIRoute = async ({ request }) => {
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) {
    return json({ error: 'bad_type' }, 415);
  }
  // Only accept posts coming from this site's own pages.
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ error: 'forbidden' }, 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad_json' }, 400);
  }

  // Hidden "website" field: people never fill it in, bots usually do. Answer
  // like it worked, store nothing.
  if (clean(body.website)) return json({ status: 'pending' }, 202);

  const slug = body.slug;
  const author = clean(body.author).replace(/\s+/g, ' ');
  const content = clean(body.content);
  if (!isSlug(slug) || !author || !content || author.length > MAX_AUTHOR || content.length > MAX_CONTENT) {
    return json({ error: 'invalid' }, 400);
  }

  const waiting = await db()
    .prepare('SELECT COUNT(*) AS n FROM comments WHERE post_slug = ? AND is_approved = 0')
    .bind(slug)
    .first<{ n: number }>();
  if ((waiting?.n ?? 0) >= MAX_PENDING_PER_PAGE) return json({ error: 'too_many' }, 429);

  await db()
    .prepare('INSERT INTO comments (post_slug, author, content, is_approved) VALUES (?, ?, ?, 0)')
    .bind(slug, author, content)
    .run();
  return json({ status: 'pending' }, 202);
};
