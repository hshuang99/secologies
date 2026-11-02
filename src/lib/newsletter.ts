/**
 * MailerLite newsletter form endpoints, one per locale.
 *
 * The value is the path after `https://assets.mailerlite.com/jsonp/`, i.e. `<account id>/forms/<form id>/subscribe`.
 * A locale without an entry has no newsletter page and no navigation link.
 */
const endpoints: Record<string, string> = {
	"zh-tw": "262261/forms/74815544807654556/subscribe",
	en: "262261/forms/190490287319025016/subscribe"
};

/** Get the MailerLite subscribe URL for a locale, or `undefined` if the locale has no form. */
export function newsletterAction(locale: string): string | undefined {
	const path = endpoints[locale];
	return path ? `https://assets.mailerlite.com/jsonp/${path}` : undefined;
}
