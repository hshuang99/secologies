import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LOCALE, LOCALES, LOCALE_CODES, isLocale, type Locale } from './config';
import { ui, type UiKey } from './ui';
import { SECTIONS, type Section } from '../sections';


/** Locale of a URL: "/zh-tw/blog/" -> "zh-tw", "/blog/" -> default. */
export function getLangFromUrl(url: URL): Locale {
  const first = url.pathname.split('/')[1];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/** Translator for one locale. Falls back to the default locale's string. */
export function useTranslations(lang: Locale) {
  return (key: UiKey, vars: Record<string, string | number> = {}): string => {
    let text: string = ui[lang][key] ?? ui[DEFAULT_LOCALE][key];
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
    return text;
  };
}

/** Prefix a site path with the locale: localePath('zh-tw', '/blog/') -> '/zh-tw/blog/'. */
export function localePath(lang: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === DEFAULT_LOCALE) return clean;
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
}

/** `getStaticPaths` helper: one entry per locale, with `lang` as the route param. */
export function localeParams() {
  // The default locale has no prefix, so its param is undefined (the empty
  // match of the `[...lang]` rest parameter).
  return LOCALE_CODES.map((lang) => ({
    params: { lang: lang === DEFAULT_LOCALE ? undefined : lang },
    props: { lang },
  }));
}

// ---------- Entries (blog posts, jottings, projects, episodes) ----------
// Files live in src/content/<section>/<locale>/<slug>.md. The same slug in
// two locales means "translation of the same entry".

export type Entry = CollectionEntry<Section>;
export type Post = Entry; // old name

const idParts = (entry: Entry) => {
  const i = entry.id.indexOf('/');
  return { lang: entry.id.slice(0, i), slug: entry.id.slice(i + 1) };
};

export const postLang = (entry: Entry) => idParts(entry).lang as Locale;
export const postSlug = (entry: Entry) => idParts(entry).slug;
export const entrySection = (entry: Entry) => entry.collection as Section;
export const postUrl = (entry: Entry) =>
  localePath(postLang(entry), `/${entry.collection}/${postSlug(entry)}/`);

const newestFirst = (a: Entry, b: Entry) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/** Entries of one section in one language, newest first. */
export async function getEntries(section: Section, lang: Locale): Promise<Entry[]> {
  const all = (await getCollection(section as 'blog')) as Entry[];
  return all
    .filter((e) => !e.data.draft && postLang(e) === lang)
    .sort(newestFirst);
}

/** Entries of every section in one language, newest first. */
export async function getAllEntries(lang: Locale): Promise<Entry[]> {
  const lists = await Promise.all(SECTIONS.map((s) => getEntries(s, lang)));
  return lists.flat().sort(newestFirst);
}

export const getPosts = (lang: Locale) => getEntries('blog', lang);

/** `getStaticPaths` helper for /<section>/ routes: every locale x section. */
export function sectionParams() {
  return LOCALE_CODES.flatMap((lang) =>
    SECTIONS.map((section) => ({
      params: { lang: lang === DEFAULT_LOCALE ? undefined : lang, section },
      props: { lang, section },
    })),
  );
}

// ---------- Language switcher ----------

/**
 * Where the switcher should send the reader. By default: the same page in
 * the other language. Pages whose counterpart might not exist (a post that is
 * not translated, a tag nobody used in that language) pass `alternates`
 * explicitly; the switcher falls back to that language's home page for the rest.
 */
export interface SwitcherItem {
  code: Locale;
  label: string;
  name: string;
  href: string;
  current: boolean;
}

export function buildSwitcher(
  current: Locale,
  url: URL,
  alternates?: Partial<Record<Locale, string>>,
): SwitcherItem[] {
  const path = url.pathname;
  const unprefixed =
    current === DEFAULT_LOCALE ? path : path.replace(new RegExp(`^/${current}(?=/|$)`), '') || '/';
  return LOCALE_CODES.map((code) => ({
    code,
    label: LOCALES[code].label,
    name: LOCALES[code].name,
    href: alternates ? (alternates[code] ?? localePath(code, '/')) : localePath(code, unprefixed),
    current: code === current,
  }));
}
