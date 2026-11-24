# ASTRO TERMINAL — multilingual, green phosphor

## Run
    npm install
    npm run dev       # http://localhost:4321
    npm run build

You also need the font (and optional sound) from your original project in
`public/` — see `public/fonts/README.txt`.

## Languages (English + Traditional Chinese included)
- Traditional Chinese (zh-TW) is the default and lives at `/`; English is at `/en/` (`prefixDefaultLocale: false`). To change the default, edit `DEFAULT_LOCALE` in `src/i18n/config.ts` and `defaultLocale` in `astro.config.mjs`.
- UI strings: `src/i18n/ui.ts`. Posts: `src/content/blog/<lang>/<slug>.md` (`en`, `zh-tw`).
  Same file name in two languages = translation of one post; the language
  switcher (header, or `L` key) jumps between them. Without a translation it
  goes to the other language's home page.
- Add a language: `astro.config.mjs` (`i18n.locales`), `src/i18n/config.ts`,
  a new dictionary in `src/i18n/ui.ts`, and `src/content/blog/<code>/`.
- Each language gets its own RSS feed (`/rss.xml`, `/en/rss.xml`) and
  `hreflang` links on translated pages. Set `site` in `astro.config.mjs`.
- Static hosts serve one 404 page: `404.html` is Chinese; `/en/404/` exists
  for hosts that can route per language.

## Sections
Four content sections, each a nav item, a collection and a folder:
`blog`, `jotting`, `project`, `podcast` -> `src/content/<section>/<lang>/<slug>.md`
(URLs `/<section>/` and `/<section>/<slug>/`, tags at `/<section>/tag/<tag>/`).
- `project` extra frontmatter: `status` (active|wip|done|archived), `stack`, `url`, `repo`.
- `podcast` extra frontmatter: `episode`, `duration`, `audio` (file in `public/` or URL), `links`.
- The home page lists the 10 newest entries across all sections (`src/pages/[...lang]/index.astro`).
- `/rss.xml` carries all sections. Add a section: `src/sections.ts`, `src/content.config.ts`,
  and `nav.<name>` + `section.<name>.description` in `src/i18n/ui.ts`.

## Color
Fixed green phosphor. Tune it in the `:root` block at the top of
`src/styles/terminal.css` (`--fg`, `--bg`, `--glow`, ...). The theme toggle,
`T` hotkey and amber palette were removed.
# secologies
# secologies
