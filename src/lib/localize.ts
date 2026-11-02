import config from "$config";
import type { Localized } from "$lib/config";

/**
 * Pick the text for a locale from a `Localized` value.
 * Falls back to the default locale, then to the first available text.
 * @param value A plain string, or an object keyed by locale
 * @param locale The locale to read, e.g. "en"
 */
export default function localize(value: Localized, locale: string): string;
export default function localize(value: Localized | undefined, locale: string): string | undefined;
export default function localize(value: Localized | undefined, locale: string) {
	if (value === undefined || typeof value === "string") return value;

	return value[locale] ?? value[config.i18n.defaultLocale] ?? Object.values(value)[0];
}
