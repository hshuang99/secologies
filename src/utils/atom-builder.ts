import { getCollection } from "astro:content";
import { siteConfig } from "../config";
import { getEntryLang } from "./translations";

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, '') + '/';
}

/** Builds the Atom feed Response for posts written in the given language. */
export async function buildAtomFeed(lang: string, feedFileName: string) {
  const siteUrl = normalizeSiteUrl(import.meta.env.SITE || siteConfig.site);
  const posts = await getCollection("posts", ({ data }) => {
    return !data.draft;
  });

  const filteredPosts = posts.filter((post) => getEntryLang(post) === lang);

  const sortedPosts = filteredPosts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${siteConfig.title}</title>
  <subtitle>${siteConfig.description}</subtitle>
  <link href="${siteUrl}"/>
  <link href="${siteUrl}${feedFileName}" rel="self"/>
  <id>${siteUrl}${feedFileName}</id>
  <author>
    <name>${siteConfig.author}</name>
  </author>
  <updated>${new Date().toISOString()}</updated>

  ${sortedPosts
    .map(
      (post) => `
  <entry>
    <title>${post.data.title}</title>
    <link href="${siteUrl}posts/${(post as any).id}/"/>
    <id>${siteUrl}posts/${(post as any).id}/</id>
    <published>${new Date(post.data.date).toISOString()}</published>
    <updated>${new Date(post.data.date).toISOString()}</updated>
    <summary>${post.data.description || ""}</summary>
    ${
      post.data.tags
        ? post.data.tags.map((tag) => `<category term="${tag}"/>`).join("")
        : ""
    }
  </entry>`
    )
    .join("")}
</feed>`;

  return new Response(atomFeed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
