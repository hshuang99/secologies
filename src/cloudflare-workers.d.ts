// Types for `import { env } from 'cloudflare:workers'` (used by
// src/pages/api/comments.ts), declared by hand on purpose.
//
// Do NOT load Cloudflare's generated worker-configuration.d.ts into this
// project: it ships a full set of Workers runtime types, including an
// `Element` interface for HTMLRewriter that merges into the browser's DOM
// `Element` and breaks every `el.append(a, b)` call in client scripts.
declare module 'cloudflare:workers' {
  export const env: Record<string, unknown>;
}
