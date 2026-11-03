import type { APIRoute } from "astro";

// Crawlers that may fetch the site: search engines, the web archive, and the bots that build link previews (cards) when a page is shared
const allowed = [
	"Googlebot",
	"Bingbot",
	"DuckDuckBot",
	"Applebot",
	"archive.org_bot",
	"Twitterbot",
	"facebookexternalhit",
	"LinkedInBot",
	"Slackbot",
	"Discordbot",
	"TelegramBot",
	"WhatsApp"
];

export const GET: APIRoute = ({ site }) => {
	const text = `
${allowed.map(bot => `User-agent: ${bot}`).join("\n")}
Allow: /
Disallow: /api/
Disallow: /cdn-cgi

User-agent: *
Disallow: /

Sitemap: ${new URL("sitemap-index.xml", site)}
`;

	return new Response(text);
};
