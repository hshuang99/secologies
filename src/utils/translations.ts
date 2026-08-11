import { getCollection, type CollectionEntry } from 'astro:content';
import { siteConfig } from '@/config';

export type TranslatableType = 'posts' | 'pages' | 'podcasts' | 'projects';

// Display names for language codes. Add more as needed.
export const LANGUAGE_NAMES: Record<string, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

export function languageName(code: string): string {
  return LANGUAGE_NAMES[code] || code.toUpperCase();
}

/** The language a given entry is written in — its own `lang` field, or the site default. */
export function getEntryLang(entry: { data: { lang?: string | null } }): string {
  return entry.data.lang || siteConfig.language;
}

/** URL prefix for each translatable collection type. Pages live at the site root. */
function baseUrlFor(type: TranslatableType): string {
  switch (type) {
    case 'posts':
      return '/posts/';
    case 'podcasts':
      return '/podcasts/';
    case 'projects':
      return '/projects/';
    case 'pages':
      return '/';
  }
}

export interface ResolvedTranslation {
  id: string;
  title: string;
  lang: string;
  url: string;
}

/**
 * Resolves the `translations: [slug, ...]` frontmatter field on an entry into
 * full { title, lang, url } records, by looking each slug up in the same collection.
 * Missing/typo'd slugs are silently skipped (logged in dev) rather than breaking the build.
 */
export async function getTranslationsFor(
  entry: CollectionEntry<TranslatableType>,
  type: TranslatableType
): Promise<ResolvedTranslation[]> {
  const slugs: string[] = (entry.data as any).translations || [];
  if (slugs.length === 0) return [];

  const all = await getCollection(type as any);
  const byId = new Map(all.map((e: any) => [e.id, e]));

  const resolved: ResolvedTranslation[] = [];
  for (const slug of slugs) {
    const match: any = byId.get(slug);
    if (!match) {
      if (import.meta.env.DEV) {
        console.warn(
          `[translations] "${entry.id}" links to "${slug}" in ${type}, but no entry with that id exists.`
        );
      }
      continue;
    }
    resolved.push({
      id: match.id,
      title: match.data.title,
      lang: getEntryLang(match),
      url: `${baseUrlFor(type)}${match.id}`,
    });
  }
  return resolved;
}
