export const supportedLocales = ["pt", "es", "en", "fr", "de"] as const;

export type AppLocale = (typeof supportedLocales)[number];

export type LocalizedText = Record<AppLocale, string>;

export function createLocalizedText(base: string): LocalizedText {
  return {
    pt: base,
    es: base,
    en: base,
    fr: base,
    de: base,
  };
}
