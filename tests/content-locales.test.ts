import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

import { describe, expect, it } from "vitest"

import { LOCALES } from "@/config/locales"

const root = resolve(__dirname, "..")

describe("localized content coverage", () => {
  it("has the default author for every configured locale", () => {
    for (const locale of LOCALES) {
      const file = resolve(root, "src/content/authors", locale, "default.md")

      expect(existsSync(file), `${locale} author is missing`).toBe(true)
      expect(readFileSync(file, "utf8")).toContain(`locale: ${locale}`)
    }
  })

  it("has the about page for every configured locale", () => {
    for (const locale of LOCALES) {
      const file = resolve(root, "src/content/pages", locale, "about.md")

      expect(existsSync(file), `${locale} about page is missing`).toBe(true)
      expect(readFileSync(file, "utf8")).toContain(`locale: ${locale}`)
    }
  })
})
