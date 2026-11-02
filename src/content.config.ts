import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

/**
 * Note collection configuration
 * Represents main blog articles with comprehensive metadata
 */
const note = defineCollection({
	// Load all markdown files except those starting with underscore (private/draft files)
	loader: glob({ pattern: ["**/*.md", "!**/_*.md", "!**/_*/*.md"], base: "./src/content/note" }),
	schema: z.object({
		title: z.string(), // Post title (required)
		timestamp: z.date(), // Publication date (required)
		series: z.string().optional(), // Series name for grouped posts
		tags: z.array(z.string()).optional(), // Array of topic tags
		description: z.string().optional(), // Post description/excerpt
		sensitive: z.boolean().default(false), // Marks content as sensitive
		toc: z.boolean().default(false), // Whether to show table of contents
		top: z.number().int().nonnegative().default(0), // Top priority for sorting (higher is more important)
		draft: z.boolean().default(false) // Draft status (excludes from public listing)
	})
});

/**
 * Jotting collection configuration
 * Represents shorter posts, quick thoughts, or micro-blog entries
 */
const jotting = defineCollection({
	// Load all markdown files except those starting with underscore
	loader: glob({ pattern: ["**/*.md", "!**/_*.md", "!**/_*/*.md"], base: "./src/content/jotting" }),
	schema: z.object({
		title: z.string(), // Jotting title (required)
		timestamp: z.date(), // Publication date (required)
		tags: z.array(z.string()).optional(), // Array of topic tags
		description: z.string().optional(), // Brief description
		sensitive: z.boolean().default(false), // Marks content as sensitive
		top: z.number().int().nonnegative().default(0), // Top priority for sorting (higher is more important)
		draft: z.boolean().default(false) // Draft status
	})
});

/**
 * Preface collection configuration
 * Represents introductory content, site announcements, or special pages
 */
const preface = defineCollection({
	// Load all markdown files
	loader: glob({ pattern: "**/*.md", base: "./src/content/preface" }),
	schema: z.object({
		timestamp: z.date() // Creation timestamp
	})
});

/**
 * Information collection configuration
 * Represents static content like about pages, policies, or site information
 */
const information = defineCollection({
	// Load both markdown and YAML files for mixed content types
	loader: glob({ pattern: "**/*.{md,mdx,yaml}", base: "./src/content/information" })
});

/**
 * Project collection configuration
 * Represents write-ups that record the procedure of a project
 */
const project = defineCollection({
	// Load all markdown files except those starting with underscore (templates/drafts)
	loader: glob({ pattern: ["**/*.md", "!**/_*.md", "!**/_*/*.md"], base: "./src/content/project" }),
	schema: z.object({
		title: z.string(), // Project title (required)
		timestamp: z.date(), // Publication date (required)
		description: z.string().optional(), // Short summary shown in lists
		tags: z.array(z.string()).optional(), // Array of topic tags
		toc: z.boolean().default(false), // Whether to show table of contents
		draft: z.boolean().default(false) // Draft status (excludes from public listing)
	})
});

/**
 * Podcast collection configuration
 * Represents podcast episodes: show notes and material, with an optional audio file
 */
const podcast = defineCollection({
	// Load all markdown files except those starting with underscore (templates/drafts)
	loader: glob({ pattern: ["**/*.md", "!**/_*.md", "!**/_*/*.md"], base: "./src/content/podcast" }),
	schema: z.object({
		title: z.string(), // Episode title (required)
		timestamp: z.date(), // Publication date (required)
		description: z.string().optional(), // Short summary shown in lists
		tags: z.array(z.string()).optional(), // Array of topic tags
		episode: z.number().int().positive().optional(), // Episode number
		audio: z.string().optional(), // Audio file URL (e.g. an .mp3); shows a player when set
		duration: z.string().optional(), // Display duration, e.g. "42:10"
		toc: z.boolean().default(false), // Whether to show table of contents
		draft: z.boolean().default(false) // Draft status (excludes from public listing)
	})
});

export const collections = { note, jotting, preface, information, project, podcast };
