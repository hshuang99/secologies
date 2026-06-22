export const LOCALES = [
  "zh",
  "en",
] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "zh"

export type LocaleMeta = {
  code: Locale
  nativeName: string
  label: string
  hreflang: string
  ogLocale: string
  dir: "ltr" | "rtl"
  searchHint: string
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  zh: {
    code: "zh",
    nativeName: "繁體中文",
    label: "Chinese",
    hreflang: "zh-TW",
    ogLocale: "zh_TW",
    dir: "ltr",
    searchHint: "使用空白分隔關鍵字可提升搜尋效果。",
  },
  en: {
    code: "en",
    nativeName: "English",
    label: "English",
    hreflang: "en-US",
    ogLocale: "en_US",
    dir: "ltr",
    searchHint: "Search across posts and pages.",
  },
}

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale)
}

export function getLocaleMeta(locale: Locale): LocaleMeta {
  return LOCALE_META[locale]
}
