import type { APIRoute } from 'astro';
import type { Locale } from '../../i18n/config';
import type { UiKey } from '../../i18n/ui';
import {
  entrySection,
  getAllEntries,
  localeParams,
  postUrl,
  useTranslations,
} from '../../i18n/utils';

// One search index per language: /search.json and /en/search.json.
// It is only downloaded when the search page is opened.
export const getStaticPaths = () => localeParams();

// Markdown -> plain text: enough to search in and show snippets from.
const plain = (md: string) =>
  md
    .replace(/^```.*$/gm, ' ') // fence lines (the code itself stays searchable)
    .replace(/\$\$[\s\S]*?\$\$/g, ' ') // display math
    .replace(/\$[^$\n]+\$/g, ' ') // inline math
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> their text
    .replace(/<[^>]+>/g, ' ') // inline HTML
    .replace(/^[\s#>*+-]+/gm, '') // heading / quote / list markers
    .replace(/[*_`~|]/g, '') // emphasis, code ticks, table pipes
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFKC');

export const GET: APIRoute = async ({ props }) => {
  const lang = props.lang as Locale;
  const t = useTranslations(lang);
  const entries = await getAllEntries(lang);

  const docs = entries.map((e) => ({
    t: e.data.title,
    u: postUrl(e),
    k: t(`nav.${entrySection(e)}` as UiKey),
    d: e.data.pubDate.toISOString().slice(0, 10),
    g: e.data.tags,
    x: e.data.description,
    b: plain(e.body ?? ''),
  }));

  return new Response(JSON.stringify(docs), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
