import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getCollection, render } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import { Feed } from "feed";
import config, { monolocale } from "$config";
import localize from "$lib/localize";
import i18nit from "$i18n";

export async function getStaticPaths() {
	// Create path for each locale, omitting default locale from URL
	return config.i18n.locales.map(locale => ({ params: { locale: config.i18n.defaultLocale === locale ? undefined : locale } }));
}

// Characters that are not allowed in XML 1.0: control characters (except tab, line feed, carriage return and the C1 range), lone surrogates, U+FFFE and U+FFFF
const ILLEGAL_XML_CHARACTERS = /[\p{Cc}\p{Cs}\uFFFE\uFFFF]/gu;

/**
 * Remove characters that are illegal in XML 1.0 (control characters and lone surrogates),
 * which make feed readers reject the whole feed, and keep "]]>" from ending a CDATA section early.
 */
function clean(text?: string) {
	return text
		?.replace(ILLEGAL_XML_CHARACTERS, character => {
			const code = character.charCodeAt(0);

			// Tab, line feed, carriage return and the C1 range are legal in XML 1.0
			return code === 0x9 || code === 0xa || code === 0xd || (code >= 0x7f && code <= 0x9f) ? character : "";
		})
		.replaceAll("]]>", "]]]]><![CDATA[>");
}

/**
 * GET endpoint for generating feeds
 * Supports filtering by language, series, and tags
 */
export const GET: APIRoute = async ({ site, params }) => {
	const { locale: language = config.i18n.defaultLocale } = params;
	const t = i18nit(language);
	const author = { ...config.author, name: localize(config.author.name, language), link: localize(config.author.link, language) };

	// Initialize feed with site metadata and configuration
	const feed = new Feed({
		title: localize(config.title, language),
		description: localize(config.description, language),
		author,
		// Handle copyright based on license type - CC0 has special formatting
		copyright:
			config.copyright.type === "CC0 1.0"
				? "CC0 1.0 – No Rights Reserved"
				: `${config.copyright.type} © ${config.copyright.year} ${author.name}`,
		image: new URL("favicon-96x96.png", site).toString(), // Feed image/logo
		favicon: new URL("favicon.ico", site).toString(), // Feed favicon
		id: site!.toString(), // Unique feed identifier
		link: site!.toString() // Feed's associated website
	});

	// Aggregate items from specified sections
	let items = [];

	// Determine which sections to include
	const sections = config.feed?.section || "*";

	if (sections === "*" || sections.includes("note")) {
		const notes = await getCollection("note", note => {
			// Apply filtering criteria
			const published = !note.data.draft; // Exclude draft posts
			const localed = monolocale || note.id.split("/")[0] === language; // Language filter

			// Include note only if it passes all filters
			return published && localed;
		});

		// Attach locale and link for each note
		notes.forEach(note => {
			const id = monolocale ? note.id : note.id.split("/").slice(1).join("/");
			Reflect.set(note, "link", new URL(getRelativeLocaleUrl(language, `/note/${id}`), site).toString());
		});

		items.push(...notes);
	}

	if (sections === "*" || sections.includes("jotting")) {
		const jottings = await getCollection("jotting", jotting => {
			// Apply filtering criteria
			const published = !jotting.data.draft; // Exclude draft posts
			const localed = monolocale || jotting.id.split("/")[0] === language; // Language filter

			// Include jotting only if it passes all filters
			return published && localed;
		});

		// Attach locale and link for each jotting
		jottings.forEach(jotting => {
			const id = monolocale ? jotting.id : jotting.id.split("/").slice(1).join("/");
			Reflect.set(jotting, "link", new URL(getRelativeLocaleUrl(language, `/jotting/${id}`), site).toString());
		});

		items.push(...jottings);
	}

	// Sort all items by timestamp and limit to configured number
	items = items
		.sort((a, b) => b.data.timestamp.getTime() - a.data.timestamp.getTime()) // Sort by newest first
		.slice(0, config.feed?.limit || items.length); // Limit to number of items

	// Create an Astro container for rendering content
	const container = await AstroContainer.create();
	await Promise.all(
		items.map(async item => {
			if (item.rendered) {
				// Render content for each item
				const content = await container.renderToString((await render(item)).Content);

				// Rewrite relative paths to absolute URLs for media assets
				item.rendered.html = content.replace(/(?<=src=")\/(?!\/)([^"]+)/g, `${site?.origin}/$1`);
			}
		})
	);

	// Add each filtered note as a feed item
	items.forEach(item => {
		feed.addItem({
			id: item.id, // Unique item identifier
			title: clean(item.data.title)!, // Post title
			link: (<any>item).link, // URL to the post
			date: item.data.timestamp, // Publication date
			content: clean(item.data.sensitive ? t("sensitive.feed", { link: (<any>item).link }) : item.rendered?.html), // Rendered content
			description: clean(item.data.description), // Summary of the post
			category: item.data.tags?.map((tag: any) => ({ term: tag })) // Tags as categories
		});
	});

	// Generate Atom 1.0 XML feed
	const xml = feed.atom1();

	return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
