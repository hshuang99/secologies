import fs from "node:fs";
import path from "node:path";

// Directory to cache downloaded fonts
const CACHE_DIR = path.resolve(process.cwd(), "node_modules", ".cache", "og-fonts");

// Locale-specific font URLs
const fonts: Record<string, string> = {
	en: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSerif/unhinted/otf/NotoSerif-Bold.otf",
	"zh-cn": "https://raw.githubusercontent.com/adobe-fonts/source-han-serif/release/OTF/SimplifiedChinese/SourceHanSerifSC-Bold.otf",
	// Must be a raw file URL (raw.githubusercontent.com), not a github.com/.../blob/... page, which returns HTML
	"zh-tw": "https://raw.githubusercontent.com/adobe-fonts/source-han-serif/release/OTF/TraditionalChinese/SourceHanSerifTC-Bold.otf",
	ja: "https://raw.githubusercontent.com/adobe-fonts/source-han-serif/release/OTF/Japanese/SourceHanSerif-Bold.otf"
};

/**
 * Check the file signature so an HTML error page is never mistaken for a font.
 * Satori reads OpenType/TrueType: "OTTO" (CFF), 0x00010000 or "true" (TrueType), "ttcf" (collection).
 */
function isFont(buffer: Uint8Array) {
	const signature = Buffer.from(buffer.subarray(0, 4)).toString("latin1");
	return signature === "OTTO" || signature === "true" || signature === "ttcf" || signature === "\x00\x01\x00\x00";
}

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

/**
 * Load font for the specified locale, downloading and caching it if necessary.
 * @param locale locale code
 * @returns ArrayBuffer of the font data
 */
export async function loadFont(locale: string) {
	const url = fonts[locale];
	if (!url) throw new Error(`No font URL found for locale: ${locale}`);

	const fileName = path.basename(url);
	const filePath = path.join(CACHE_DIR, fileName);

	if (fs.existsSync(filePath)) {
		const cached = await fs.promises.readFile(filePath);

		// Slice to the exact bytes, since a Node Buffer may share a larger pooled ArrayBuffer
		if (isFont(cached)) return cached.buffer.slice(cached.byteOffset, cached.byteOffset + cached.byteLength) as ArrayBuffer;

		// A previously cached file is not a font (e.g. a failed download), so discard it and download again
		await fs.promises.rm(filePath);
	}

	const response = await fetch(url);
	if (!response.ok) throw new Error(`Failed to load font from ${url}: ${response.status} ${response.statusText}`);

	const buffer = await response.arrayBuffer();
	if (!isFont(new Uint8Array(buffer))) throw new Error(`The response from ${url} is not an OpenType font (check that the URL points to the raw file)`);

	await fs.promises.writeFile(filePath, new Uint8Array(buffer));

	return buffer;
}
