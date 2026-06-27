import rss from "@astrojs/rss"
import type { APIContext } from "astro"

import { SITE_CONFIG } from "@/config/site"
import { LOCALES, type Locale } from "@/config/locales"
import { getPostsForLocale, postUrl } from "@/utils/posts"

export function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { locale } }))
}

export async function GET(context: APIContext) {
  const locale = context.params.locale as Locale
  const { site } = await import(`@/locales/${locale}.json`)
  const posts = await getPostsForLocale(locale)

  return rss({
    title: site.name,
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
