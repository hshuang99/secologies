import { getCollection, type CollectionEntry } from "astro:content"

import type { Locale } from "@/config/locales"
import { normalizeContentSlug } from "@/utils/content-slug"

// Maps routing locales (zh-TW, en) to content frontmatter locales (zh, en)
export const CONTENT_LOCALE: Record<Locale, string> = {
  "zh": "zh",
  en: "en",
}

export async function getPage(locale: Locale, slug: string): Promise<CollectionEntry<"page"> | undefined> {
  const contentLocale = CONTENT_LOCALE[locale]
  return (await getCollection("page", (entry) => !entry.data.draft)).find((page) => page.data.locale === contentLocale && normalizeContentSlug(page.id, page.data.locale) === slug)
}

export async function getAuthor(locale: Locale, slug = "hong-sheng-huang"): Promise<CollectionEntry<"author"> | undefined> {
  const contentLocale = CONTENT_LOCALE[locale]
  return (await getCollection("author", (entry) => !entry.data.draft)).find((author) => author.data.locale === contentLocale && author.data.slug === slug)
}
