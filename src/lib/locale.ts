const LOCALE_KEY = "zyrox.locale";

export type AppLocale = "pt" | "es" | "en" | "fr" | "de";
const DEFAULT_LOCALE: AppLocale = "pt";

export const SUPPORTED_LOCALES: Array<{
  code: AppLocale;
  label: string;
  nativeLabel: string;
  countryLabel: string;
  flag: string;
  flagSrc: string;
}> = [
  { code: "pt", label: "Portuguese", nativeLabel: "Portugu\u00EAs (Brasil)", countryLabel: "Brasil", flag: "BR", flagSrc: "https://flagcdn.com/w40/br.png" },
  { code: "es", label: "Spanish", nativeLabel: "Espa\u00F1ol", countryLabel: "Espa\u00F1a", flag: "ES", flagSrc: "https://flagcdn.com/w40/es.png" },
  { code: "en", label: "English", nativeLabel: "English", countryLabel: "United States", flag: "US", flagSrc: "https://flagcdn.com/w40/us.png" },
  { code: "fr", label: "French", nativeLabel: "Fran\u00E7ais", countryLabel: "France", flag: "FR", flagSrc: "https://flagcdn.com/w40/fr.png" },
  { code: "de", label: "German", nativeLabel: "Deutsch", countryLabel: "Deutschland", flag: "DE", flagSrc: "https://flagcdn.com/w40/de.png" },
];

const localeToHtmlLang: Record<AppLocale, string> = {
  pt: "pt-BR",
  es: "es",
  en: "en",
  fr: "fr",
  de: "de",
};

function normalizeLocaleTag(value: string) {
  return value.trim().toLowerCase();
}

function inferLocaleFromTag(value: string): AppLocale {
  const tag = normalizeLocaleTag(value);

  if (tag.startsWith("pt")) return "pt";
  if (tag.startsWith("es")) return "es";
  if (tag.startsWith("fr")) return "fr";
  if (tag.startsWith("de")) return "de";
  if (tag.startsWith("en")) return "en";

  return DEFAULT_LOCALE;
}

function applyLocaleToDocument(locale: AppLocale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = localeToHtmlLang[locale] ?? localeToHtmlLang[DEFAULT_LOCALE];
}

export function getDefaultLocale() {
  return DEFAULT_LOCALE;
}

export function detectBrowserLocale(): AppLocale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const candidates = Array.isArray(window.navigator.languages) && window.navigator.languages.length > 0
    ? window.navigator.languages
    : [window.navigator.language];

  for (const candidate of candidates) {
    if (!candidate) continue;
    return inferLocaleFromTag(candidate);
  }

  return DEFAULT_LOCALE;
}

export function getStoredLocale(): AppLocale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const value = window.localStorage.getItem(LOCALE_KEY);
  const locale = SUPPORTED_LOCALES.some((item) => item.code === value)
    ? (value as AppLocale)
    : detectBrowserLocale();

  applyLocaleToDocument(locale);
  return locale;
}

export function setStoredLocale(locale: AppLocale) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCALE_KEY, locale);
  applyLocaleToDocument(locale);
}
