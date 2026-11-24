import type { Locale } from './i18n/config';

// Site-wide settings — edit these to make the template your own.
// Site title, tagline and description are translated: see src/i18n/ui.ts.
export const SITE_VERSION = '1.0.0';

// Fictional terminal manufacturer, shown on the boot screen, the 404 page
// and the private-mode gate.
export const SITE_VENDOR = 'ORBITEC SYSTEMS';
export const SITE_SYSTEM = 'DATALINK';
export const SITE_MODEL = 'OTX-1200';

// Sound files, one per signal. Anything left out is synthesized instead
// (see scripts/sfx.ts), so this map can be empty. Only use audio you have
// the rights to.
export const SFX_SAMPLES: Partial<
  Record<'hover' | 'select' | 'deny' | 'grant' | 'key' | 'power', string>
> = {
  deny: '/sounds/deny.ogg',
};

// Decorative only — shown in the header next to VER.
export const SITE_BUILD_ID = '52656448616972426C61636B';

// When true, a hacking minigame gates the site on the first visit of a
// session. The site is static, so this is a cosmetic lock rather than real
// protection: the content ships in the HTML either way.
export const PRIVATE_MODE = false;

// MailerLite embedded forms, one per language. Take the three values from the
// embed code: the account is the number in .../jsonp/<account>/forms/...,
// formId the long number after /forms/, and uid the number in id="mlb2-<uid>".
export const NEWSLETTER: Record<Locale, { account: string; formId: string; uid: string }> = {
  'zh-tw': { account: '262261', formId: '74815544807654556', uid: '2655223' },
  en: { account: '262261', formId: '190490287319025016', uid: '42703204' },
};
