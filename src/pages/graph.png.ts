import type { APIRoute } from "astro";
import config from "$config";
import localize from "$lib/localize";
import graph from "$graph/default";

/**
 * GET handler that generates and returns the Open Graph image for most general pages.
 */
export const GET: APIRoute = async () => {
	const image = await graph({
		locale: config.i18n.defaultLocale,
		title: localize(config.title, config.i18n.defaultLocale),
		author: localize(config.author.name, config.i18n.defaultLocale),
		description: localize(config.description, config.i18n.defaultLocale)
	});

	return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/png" } });
};
