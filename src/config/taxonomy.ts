import type { Locale } from "./locales"

type LocalizedText = Record<Locale, string>

export type TaxonomyItem = {
  slug: string
  order: number
  labelByLocale: LocalizedText
  descriptionByLocale: LocalizedText
}

const localized = (text: LocalizedText): LocalizedText => text

export const TAXONOMY = {
  categories: [
    {
      slug: "cryptology",
      order: 0,
      labelByLocale: localized({
        zh: "密碼理論",
        en: "Cryptology",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
    {
      slug: "applied_cryptography",
      order: 1,
      labelByLocale: localized({
        zh: "應用密碼學",
        en: "Applied Cryptography",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
    {
      slug: "cybersecurity",
      order: 2,
      labelByLocale: localized({
        zh: "網路安全",
        en: "Cybersecurity",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
    {
      slug: "events",
      order: 3,
      labelByLocale: localized({
        zh: "活動",
        en: "Events",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
  ],
  tags: [
    {
      slug: "number-theory",
      order: 1,
      labelByLocale: localized({
        zh: "數論",
        en: "Number Theory",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
    {
      slug: "information-theory",
      order: 2,
      labelByLocale: localized({
        zh: "消息理論",
        en: "Information Theory",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
    {
      slug: "coding-theory",
      order: 3,
      labelByLocale: localized({
        zh: "編碼理論",
        en: "Coding Theory",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
    {
      slug: "computation-theory",
      order: 4,
      labelByLocale: localized({
        zh: "計算理論",
        en: "Computation Theory",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
    {
      slug: "computational-complexity-theory",
      order: 5,
      labelByLocale: localized({
        zh: "計算複雜度理論",
        en: "Computational Complexity Theory",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
    {
      slug: "cryptographic-engineering",
      order: 6,
      labelByLocale: localized({
        zh: "密碼工程",
        en: "Cryptographic Engineering",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
    {
      slug: "hardware-security",
      order: 7,
      labelByLocale: localized({
        zh: "硬體安全",
        en: "Hardware Security",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
    {
      slug: "quantum-security",
      order: 8,
      labelByLocale: localized({
        zh: "量子安全",
        en: "Quantum Security",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
    {
      slug: "penetration-test",
      order: 9,
      labelByLocale: localized({
        zh: "滲透測試",
        en: "Penetration Test",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
    {
      slug: "anomaly-detection",
      order: 10,
      labelByLocale: localized({
        zh: "異常檢測",
        en: "Anomaly Detection",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
    {
      slug: "cybersecurity-law-regulation-and-framework",
      order: 11,
      labelByLocale: localized({
        zh: "資通安全法規與框架",
        en: "Cybersecurity Law Regulation and Framework",
      }),
      descriptionByLocale: localized({
        zh: "",
        en: "",
      }),
    },
  ],
} as const

const PRIMARY_CATEGORY_SLUGS = ["cryptology", "applied_cryptography", "cybersecurity", "events"] as const

const TAGS_BY_CATEGORY: Record<
  (typeof PRIMARY_CATEGORY_SLUGS)[number],
  string[]
> = {
  cryptology: ["number-theory", "information-theory", "coding-theory", "computation-theory", "computational-complexity-theory"],
  applied_cryptography: ["cryptographic-engineering", "hardware-security", "quantum-security"],
  cybersecurity: ["penetration-test", "anomaly-detection", "cybersecurity-law-regulation-and-framework"],
  events: [],
}

export function getCategory(slug: string): TaxonomyItem | undefined {
  return TAXONOMY.categories.find((item) => item.slug === slug)
}

export function getTag(slug: string): TaxonomyItem | undefined {
  return TAXONOMY.tags.find((item) => item.slug === slug)
}

const normalizeKey = (value: string): string =>
  value.trim().toLowerCase().replace(/[\s_]+/g, "-")

const categoryAliases: Record<string, string> = {
  investment: "invest",
}

const tagAliases: Record<string, string> = {}

function buildTaxonomyLookup(
  items: readonly TaxonomyItem[],
  aliases: Record<string, string>
): Map<string, string> {
  const lookup = new Map<string, string>()

  for (const item of items) {
    lookup.set(normalizeKey(item.slug), item.slug)
    lookup.set(normalizeKey(item.labelByLocale.en), item.slug)
  }

  for (const [alias, slug] of Object.entries(aliases)) {
    lookup.set(normalizeKey(alias), slug)
  }

  return lookup
}

const categoryLookup = buildTaxonomyLookup(TAXONOMY.categories, categoryAliases)
const tagLookup = buildTaxonomyLookup(TAXONOMY.tags, tagAliases)

export function normalizeCategorySlug(value: string): string {
  return categoryLookup.get(normalizeKey(value)) ?? normalizeKey(value)
}

export function normalizeTagSlug(value: string): string {
  return tagLookup.get(normalizeKey(value)) ?? normalizeKey(value)
}

export function getPrimaryCategories(): TaxonomyItem[] {
  return PRIMARY_CATEGORY_SLUGS.map((slug) => getCategory(slug)).filter(
    (item): item is TaxonomyItem => Boolean(item)
  )
}

export function getTagsForCategory(slug: string): TaxonomyItem[] {
  const tagSlugs =
    TAGS_BY_CATEGORY[slug as (typeof PRIMARY_CATEGORY_SLUGS)[number]] ?? []
  return tagSlugs
    .map((tagSlug) => getTag(tagSlug))
    .filter((item): item is TaxonomyItem => Boolean(item))
}
