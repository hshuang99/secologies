import rss from '@astrojs/rss';
import { LOCALES } from '../../i18n/config';
import { getAllEntries, localeParams, postUrl, useTranslations } from '../../i18n/utils';

// One feed per language: /rss.xml and /zh-tw/rss.xml.
export const getStaticPaths = () => localeParams();

export async function GET(context) {
  const { lang } = context.props;
  const t = useTranslations(lang);
  const posts = await getAllEntries(lang);

  return rss({
    title: t('site.title'),
    description: t('site.description'),
    site: context.site,
    customData: `<language>${LOCALES[lang].htmlLang}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
    })),
  });
}
