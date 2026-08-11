// Languages that get their own filtered listing page + RSS feed.
// This is deliberately separate from full URL-prefixed i18n routing (which
// this project isn't using) — it only drives the /lang/{code}/ listing
// routes and the language filter tabs.
export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];
