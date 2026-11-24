// Locale registry. To add a language:
//   1. add it here AND to `i18n.locales` in astro.config.mjs,
//   2. add a dictionary for it in ui.ts (TypeScript will list missing keys),
//   3. add posts in src/content/blog/<code>/.

export const LOCALES = {
  // key = URL prefix and content folder; htmlLang = value for <html lang>.
  'zh-tw': { label: '繁中', name: '繁體中文', htmlLang: 'zh-TW', dateLocale: 'zh-TW' },
  en: { label: 'EN', name: 'English', htmlLang: 'en', dateLocale: 'en-US' },
} as const;

export type Locale = keyof typeof LOCALES;

export const LOCALE_CODES = Object.keys(LOCALES) as Locale[];

// Served without a URL prefix: "/" and "/blog/". Others get "/en/", "/en/blog/".
// Must match `i18n.defaultLocale` in astro.config.mjs.
export const DEFAULT_LOCALE: Locale = 'zh-tw';

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && value in LOCALES;
