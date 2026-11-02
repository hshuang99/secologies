import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import config, { monolocale } from "$config";
import localize from "$lib/localize";
import graph from "$graph/content";
import i18nit from "$i18n";

export async function getStaticPaths() {
	const notes = await getCollection("note", note => !note.data.draft);

	return notes.map(note => {
		let locale: string | undefined;
		let id: string;

		if (monolocale) {
			locale = undefined;
			id = note.id;
		} else {
			const [language, ...ids] = note.id.split("/");
			locale = config.i18n.defaultLocale === language ? undefined : language;
			id = ids.join("/");
		}

		return {
			params: { locale, id },
			props: {
				type: i18nit(locale || config.i18n.defaultLocale)(`navigation.note`),
				title: note.data.title,
				time: note.data.timestamp.toISOString().split("T")[0].replace(/-/g, "/"),
				series: note.data.series,
				tags: note.data.tags
			}
		};
	});
}

/**
 * GET handler that generates and returns the Open Graph image for a note.
 */
export const GET: APIRoute = async ({ params, props }) => {
	const locale = params.locale || config.i18n.defaultLocale;
	const image = await graph({
		locale,
		type: props.type,
		site: localize(config.title, locale),
		author: localize(config.author.name, locale),
		title: props.title,
		time: props.time,
		series: props.series,
		tags: props.tags
	});

	return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/png" } });
};
