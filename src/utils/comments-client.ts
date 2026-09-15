// Shared browser-side helpers for the comments system.
// Used by both CommentsSystem.astro (per-post/project/podcast threads) and
// GuestbookWidget.astro (the site-wide Guestbook feed), so formatting,
// markdown rendering, and admin-key storage stay identical everywhere.

export function escapeHtml(str: unknown): string {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

export function formatRelativeDate(iso: string): string {
  try {
    const then = new Date(iso).getTime();
    const now = Date.now();
    const diffSec = Math.max(1, Math.floor((now - then) / 1000));
    const units: [string, number][] = [
      ['year', 31536000],
      ['month', 2592000],
      ['day', 86400],
      ['hour', 3600],
      ['minute', 60],
    ];
    for (const [name, secs] of units) {
      const val = Math.floor(diffSec / secs);
      if (val >= 1) {
        return `${val} ${name}${val > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  } catch {
    return '';
  }
}

export function normalizeWebsite(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

// A small, safe Markdown subset - no library, no dependencies.
// Everything is HTML-escaped FIRST, so raw markup a commenter types
// (<script>, <img onerror>, etc.) can never survive into the DOM.
// Only the whitelisted patterns below are turned back into real tags.
export function renderMarkdown(raw: string): string {
  let html = escapeHtml(raw);

  // Inline code: `code`
  html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

  // Links: [text](https://example.com) - http(s) only
  html = html.replace(
    /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_m, text, url) =>
      `<a href="${url}" target="_blank" rel="nofollow ugc noopener noreferrer">${text}</a>`
  );

  // Bold: **text** or __text__
  html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_ (run after bold so ** isn't eaten by *)
  html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  html = html.replace(/\b_([^_\n]+)_\b/g, '<em>$1</em>');

  // Line-by-line block structure: lists (- / *) and blockquotes (>)
  const lines = html.split('\n');
  const out: string[] = [];
  let inList = false;
  let inQuote = false;

  const closeList = () => {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  };
  const closeQuote = () => {
    if (inQuote) {
      out.push('</blockquote>');
      inQuote = false;
    }
  };

  for (const line of lines) {
    const listMatch = line.match(/^[-*]\s+(.*)/);
    const quoteMatch = line.match(/^&gt;\s?(.*)/);

    if (listMatch) {
      closeQuote();
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${listMatch[1]}</li>`);
      continue;
    }
    closeList();

    if (quoteMatch) {
      if (!inQuote) {
        out.push('<blockquote>');
        inQuote = true;
      }
      out.push(quoteMatch[1]);
      continue;
    }
    closeQuote();

    out.push(line);
  }
  closeList();
  closeQuote();
  html = out.join('\n');

  // Paragraphs: blank-line-separated blocks become <p>, single
  // newlines inside a block become <br>. Already-block-level chunks
  // (lists/blockquotes) pass through untouched.
  return html
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(ul|blockquote)>/.test(trimmed)) return trimmed;
      return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    })
    .filter(Boolean)
    .join('');
}

// Admin key is stored under one shared localStorage key, so unlocking admin
// mode anywhere on the site (a post's comments, the Guestbook, etc.) unlocks
// it everywhere else too.
const ADMIN_KEY_STORAGE_KEY = 'cs_admin_key';

export function getAdminKey(): string {
  try {
    return localStorage.getItem(ADMIN_KEY_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setAdminKey(key: string): void {
  try {
    if (key) localStorage.setItem(ADMIN_KEY_STORAGE_KEY, key);
    else localStorage.removeItem(ADMIN_KEY_STORAGE_KEY);
  } catch {
    // localStorage unavailable (private mode, etc.) - admin mode just won't persist
  }
}

export interface PublicComment {
  id: number;
  content_type: 'post' | 'project' | 'podcast' | 'guestbook';
  slug: string;
  page_title: string | null;
  author_name: string;
  author_website: string | null;
  content: string;
  admin_reply: string | null;
  admin_reply_at: string | null;
  created_at: string;
}

// Maps a comment's content_type to the URL prefix for its source page, so
// the Guestbook feed can link back to "the post/project/podcast this was
// said on." Guestbook messages themselves have no source page.
const SOURCE_URL_PREFIX: Record<string, string> = {
  post: '/posts/',
  project: '/projects/',
  podcast: '/podcasts/',
};

export function sourceUrlFor(comment: PublicComment): string | null {
  const prefix = SOURCE_URL_PREFIX[comment.content_type];
  if (!prefix) return null;
  return `${prefix}${comment.slug}`;
}
