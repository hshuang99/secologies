// Content sections. Each one is a content collection in src/content/<name>/
// (see content.config.ts), a nav item, and the URLs /<name>/ and
// /<name>/<slug>/. To add a section: add it here, define its collection in
// content.config.ts, and add `nav.<name>` and `section.<name>.description`
// to src/i18n/ui.ts.
export const SECTIONS = ['blog', 'jotting', 'project', 'podcast'] as const;

export type Section = (typeof SECTIONS)[number];

export const isSection = (value: unknown): value is Section =>
  typeof value === 'string' && (SECTIONS as readonly string[]).includes(value);
