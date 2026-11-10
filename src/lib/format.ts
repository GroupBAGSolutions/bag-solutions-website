import { numberLocale, type Locale } from "@/i18n/config";

export const formatDate = (iso: string, lang: Locale) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString(numberLocale[lang], { day: "numeric", month: "long", year: "numeric" });
