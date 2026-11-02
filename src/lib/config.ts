/**
 * Creative Commons 4.0 License Type
 */
type CCLicenseType = "CC0 1.0" | "CC BY 4.0" | "CC BY-SA 4.0" | "CC BY-NC 4.0" | "CC BY-NC-SA 4.0" | "CC BY-ND 4.0" | "CC BY-NC-ND 4.0";

/**
 * A text that is either the same for every locale, or given per locale, e.g. `{ "zh-tw": "…", en: "…" }`
 */
export type Localized = string | { [locale: string]: string };

/**
 * Content Section Type
 */
export type Section = "note" | "jotting";

interface SiteConfigOptions<Locales extends readonly string[] = readonly string[]> {
	/** Site Title */
	title: Localized;

	/** Site Prologue */
	prologue?: Localized;

	/** Author Information */
	author: {
		/** Author Name */
		name: Localized;

		/** Author Email */
		email?: string;

		/** Author Homepage Link */
		link?: Localized;
	};

	/** Site Description */
	description: Localized;

	/** Creative Commons License Configuration */
	copyright: {
		/** Creative Commons 4.0 License Type */
		type: CCLicenseType;

		/** License Year */
		year: string;
	};

	/** Timezone Configuration */
	timezone?: string;

	/** Internationalization Configuration */
	i18n: {
		/** Supported Locales */
		locales: Locales;

		/** Default Locale (must be one of the locales) */
		defaultLocale: Locales[number];
	};

	/** Pagination Configuration */
	pagination?: Partial<Record<Section, number>>;

	/** Heatmap Configuration */
	heatmap?:
		| {
				/**
				 * Each cell represents a single day.
				 *
				 * Cells are organized vertically into columns of 7 days (one column per week).
				 */
				unit: "day";

				/** Number of weeks to display in the heatmap. */
				weeks?: number;
		  }
		| {
				/**
				 * Each cell represents a single week.
				 *
				 * Displays data using a fixed 52-week sliding window.
				 */
				unit: "week";
		  }
		| {
				/**
				 * Each cell represents a single month.
				 *
				 * Cells are organized horizontally into rows of 12 months (one row per year).
				 */
				unit: "month";

				/** Number of years to display in the heatmap. */
				years?: number;
		  };

	/** Feed Configuration */
	feed?: {
		/** Feed Sections */
		section?: "*" | Section[];

		/** Feed Item Limit */
		limit?: number;
	};

	/** Latest Content Display */
	latest?: "*" | Section[];
}

/**
 * Define site configuration with type-safe locale settings.
 *
 * This function is intentionally a pass-through to leverage TypeScript's type inference and validation at compile time.
 * If runtime validation is needed, add checks for required fields and value correctness here.
 * @param config - Site configuration options
 * @returns The validated site configuration
 */
export default function siteConfig<const Locales extends string[]>(config: SiteConfigOptions<Locales>): SiteConfigOptions<Locales> {
	return config;
}
