import rss from "@astrojs/rss"

import { SITE_CONFIG } from "@/config/site"
import { LOCALES, getLocaleMeta, type Locale } from "@/config/locales"
import { getPostsForLocale, postUrl } from "@/utils/posts"

const localeModules = import.meta.glob("/src/i18n/*.json", { eager: true })

function getLocaleSite(lang: Locale) {
  const mod = localeModules[`/src/i18n/${lang}.json`] as { site: { name: string; description: string } }
  return mod.site
}

export async function getStaticPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }))
}

export async function GET(context: { params: { lang?: string } }) {
  const lang = context.params.lang as Locale
  const posts = await getPostsForLocale(lang)
  const localeMeta = getLocaleMeta(lang)
  const site = getLocaleSite(lang)

  return rss({
    title: `${site.name} ${localeMeta.label}`,
    description: site.description,
    site: SITE_CONFIG.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
    })),
  })
}
