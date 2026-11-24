// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  // поменяйте на адрес вашего сайта (нужно для RSS и hreflang)
  site: 'https://secologies.com',

  // Pages are prerendered (static); only src/pages/api/comments.ts runs on
  // demand, on Cloudflare Workers, to read and write the D1 comments table.
  output: 'static',
  adapter: cloudflare(),

  // Languages. Keep in sync with LOCALES in src/i18n/config.ts.
  // zh-TW lives at "/", the others under a prefix: "/en/", "/en/blog/".
  i18n: {
    defaultLocale: 'zh-tw',
    locales: [{ path: 'zh-tw', codes: ['zh-TW'] }, 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  markdown: {
    // подсветка кода отключена: весь код рисуется одним «фосфорным» цветом,
    // как на настоящем терминале
    syntaxHighlight: false,

    // LaTeX: $inline$ and $$display$$ math, rendered to HTML by KaTeX at
    // build time (the stylesheet is imported in src/layouts/Layout.astro).
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { throwOnError: false, strict: 'ignore' }]],
    }),
  },
});
