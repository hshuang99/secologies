import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Files live in src/content/<collection>/<language>/<slug>.md
const source = (name: string) =>
  glob({ base: `./src/content/${name}`, pattern: '**/*.{md,mdx}' });

// Fields shared by every section.
const common = (image: () => z.ZodType) => ({
  title: z.string(),
  description: z.string().default(''),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: (image() as any).optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const link = z.object({ label: z.string(), url: z.string() });

// Long-form articles.
const blog = defineCollection({
  loader: source('blog'),
  schema: ({ image }) => z.object(common(image)),
});

// Short notes: a thought, a link, an observation. Body is often one paragraph.
const jotting = defineCollection({
  loader: source('jotting'),
  schema: ({ image }) => z.object(common(image)),
});

// Things you built. pubDate = when it started or last shipped.
const project = defineCollection({
  loader: source('project'),
  schema: ({ image }) =>
    z.object({
      ...common(image),
      status: z.enum(['active', 'wip', 'done', 'archived']).default('active'),
      stack: z.array(z.string()).default([]),
      url: z.string().optional(), // live site / demo
      repo: z.string().optional(), // source code
    }),
});

// Podcast episodes. `audio` is a file in /public (e.g. '/audio/ep1.mp3') or a
// full URL; `links` are listening platforms.
const podcast = defineCollection({
  loader: source('podcast'),
  schema: ({ image }) =>
    z.object({
      ...common(image),
      episode: z.number().int().optional(),
      duration: z.string().optional(), // e.g. '42:10'
      audio: z.string().optional(),
      links: z.array(link).default([]),
    }),
});

// Standalone pages (about, author, privacy...). Everything on the page comes
// from the markdown file: src/content/page/<language>/<slug>.md
const page = defineCollection({
  loader: source('page'),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { blog, jotting, project, podcast, page };
