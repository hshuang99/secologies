import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import config, { monolocale } from "$config";
import Time from "$lib/time";

export async function getStaticPaths() {
	// Create path for each locale, omitting default locale from URL
	return config.i18n.locales.map(locale => ({ params: { locale: config.i18n.defaultLocale === locale ? undefined : locale } }));
}

/** Maximum characters of body text indexed per entry, which bounds the size of the index */
const LIMIT = 6000;

/** Reduce markdown source to searchable plain text */
function plain(markdown: string) {
	return markdown
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
		.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1") // [[wiki|links]]
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // [links](url)
		.replace(/<[^>]+>/g, " ") // html tags
		.replace(/^```.*$/gm, " ") // code fence lines
		.replace(/[#>*`|~]+/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.slice(0, LIMIT);
}

/**
 * GET endpoint for the client-side search index
 * Contains every published note, jotting, project and podcast episode of the locale
 */
export const GET: APIRoute = async ({ params }) => {
	const { locale = config.i18n.defaultLocale } = params;

	const sections = ["note", "jotting", "project", "podcast"] as const;

	const index = (
		await Promise.all(
			sections.map(async section => {
				const entries = await getCollection(section, (entry: any) => !entry.data.draft && (monolocale || entry.id.split("/")[0] === locale));

				return entries.map((entry: any) => ({
					t: entry.data.title as string, // title
					u: getRelativeLocaleUrl(locale, `/${section}/${monolocale ? entry.id : entry.id.split("/").slice(1).join("/")}`), // url
					k: section, // kind
					d: Time.toDateString(entry.data.timestamp), // date
					ts: entry.data.timestamp.getTime() as number, // sort key
					g: (entry.data.tags ?? []) as string[], // tags
					s: (entry.data.description ?? "") as string, // description
					b: entry.data.sensitive ? "" : plain(entry.body ?? "") // body (never indexed for sensitive content)
				}));
			})
		)
	)
		.flat()
		.sort((a, b) => b.ts - a.ts)
		.map(({ ts, ...rest }) => rest);

	return new Response(JSON.stringify(index), { headers: { "Content-Type": "application/json" } });
};
