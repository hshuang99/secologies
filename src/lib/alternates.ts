import { getCollection } from "astro:content";
import config, { monolocale } from "$config";

const sections = ["note", "jotting", "project", "podcast"] as const;

let index: Promise<Map<string, Set<string>>> | undefined;

/**
 * Look up the published entry IDs of every content section (loaded once per build)
 */
function load() {
	index ??= Promise.all(
		sections.map(async section => [section, new Set((await getCollection(section, entry => !entry.data.draft)).map(entry => entry.id))] as const)
	).then(entries => new Map<string, Set<string>>(entries));

	return index;
}

/**
 * Get the locales in which the page at `route` exists.
 * A page that is not an entry of a content section (home, lists, about, ...) exists in every locale.
 * @param route The page path without its locale prefix, e.g. "note/my-post"
 */
export default async function alternates(route: string): Promise<string[]> {
	const locales = [...config.i18n.locales];
	if (monolocale) return locales;

	const [section, ...rest] = route.replace(/^\/+|\/+$/g, "").split("/");
	if (!rest.length || !(sections as readonly string[]).includes(section)) return locales;

	let id: string;
	try {
		id = decodeURIComponent(rest.join("/"));
	} catch {
		return locales;
	}

	const ids = (await load()).get(section);

	return locales.filter(locale => ids?.has(`${locale}/${id}`));
}
