import siteConfig from "./src/lib/config";

const config = siteConfig({
	title: { "zh-tw": "Secologies", en: "Secologies" },
	prologue: "",
	author: {
		name: { "zh-tw": "黃宏勝", en: "Hong-Sheng Huang" },
		email: "hshuang@secologies.com",
		link: { "zh-tw": "https://secologies.com/hong-sheng-huang", en: "https://secologies.com/en/hong-sheng-huang" }
	},
	description: {
		"zh-tw": "Secologies 是一個以研究為導向的獨立資安平台，致力於系統性地理解與分析資訊安全。",
		en: "Secologies is an independent, research-oriented security platform dedicated to systematically understanding and analyzing information security."
	},
	copyright: {
		type: "CC BY-NC-ND 4.0",
		year: "2026"
	},
	timezone: "UTC",
	i18n: {
		locales: ["zh-tw", "en"],
		defaultLocale: "zh-tw"
	},
	pagination: {
		note: 60,
		jotting: 24
	},
	heatmap: {
		unit: "day",
		weeks: 20
	},
	feed: {
		section: "*",
		limit: 20
	},
	latest: "*"
});

export const monolocale = Number(config.i18n.locales.length) === 1;

export default config;
