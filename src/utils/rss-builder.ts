import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "../config";
import { shouldShowPost, sortPostsByDate } from "./markdown";
import { optimizePostImagePath } from "./images";
import { getEntryLang } from "./translations";

// Helper function to extract image path from Obsidian bracket syntax
function extractImagePath(image: string): string {
  if (!image || typeof image !== "string") return "";

  if (image.startsWith("[[") && image.endsWith("]]")) {
    return image.slice(2, -2);
  }

  if (image.startsWith('"[[') && image.endsWith(']]"')) {
    return image.slice(3, -3);
  }

  return image;
}

function getMimeTypeFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    default:
      return "image/webp";
  }
}

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, '') + '/';
}

/** Builds the RSS 2.0 feed Response for posts written in the given language. */
export async function buildRssFeed(lang: string) {
  const posts = await getCollection("posts");

  const isDev = import.meta.env.DEV;
  const visiblePosts = posts.filter(
    (post) => shouldShowPost(post, isDev) && getEntryLang(post) === lang
  );
  const sortedPosts = sortPostsByDate(visiblePosts);

  const siteUrl = normalizeSiteUrl(import.meta.env.SITE || siteConfig.site);

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteUrl,
    items: sortedPosts.map((post) => {
      const postUrl = `${siteUrl}posts/${(post as any).id}/`;

      return {
        title: post.data.title,
        description: post.data.description || "",
        pubDate: post.data.date,
        link: postUrl,
        categories: post.data.tags || [],
        author: siteConfig.author,
        enclosure:
          post.data.image && post.data.imageOG
            ? {
                url: (() => {
                  const imagePath = extractImagePath(post.data.image);
                  if (typeof imagePath === "string" && imagePath.startsWith("http")) {
                    return imagePath;
                  }
                  const optimizedPath = optimizePostImagePath(imagePath, (post as any).id, (post as any).id);
                  return `${siteUrl}${optimizedPath.startsWith('/') ? optimizedPath.slice(1) : optimizedPath}`;
                })(),
                type: getMimeTypeFromPath(extractImagePath(post.data.image)),
                length: 0,
              }
            : undefined,
        customData: [
          post.data.targetKeyword &&
            `<keyword>${post.data.targetKeyword}</keyword>`,
          post.data.image &&
            `<image>${(() => {
              const imagePath = extractImagePath(post.data.image);
              if (typeof imagePath === "string" && imagePath.startsWith("http")) {
                return imagePath;
              }
              const optimizedPath = optimizePostImagePath(imagePath, (post as any).id, (post as any).id);
              return `${siteUrl}${optimizedPath.startsWith('/') ? optimizedPath.slice(1) : optimizedPath}`;
            })()}</image>`,
        ]
          .filter(Boolean)
          .join(""),
      };
    }),

    customData: `
      <language>${lang}</language>
      <copyright>Copyright © ${new Date().getFullYear()} ${
      siteConfig.author
    }</copyright>
      <managingEditor>${siteConfig.author}</managingEditor>
      <webMaster>${siteConfig.author}</webMaster>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <generator>Astro RSS</generator>
      <docs>https://www.rssboard.org/rss-specification</docs>
      <ttl>60</ttl>
    `,

    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
      content: "http://purl.org/rss/1.0/modules/content/",
      dc: "http://purl.org/dc/elements/1.1/",
    },
  });
}
