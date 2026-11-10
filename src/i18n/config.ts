export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);
export const otherLocale = (lang: Locale): Locale => (lang === "es" ? "en" : "es");

export const ogLocale: Record<Locale, string> = { es: "es_VE", en: "en_US" };
export const numberLocale: Record<Locale, string> = { es: "es-VE", en: "en-US" };
export const localeName: Record<Locale, string> = { es: "Español", en: "English" };
