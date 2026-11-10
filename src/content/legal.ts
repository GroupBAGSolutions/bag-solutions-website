import type { ComponentType } from "react";
import type { Locale } from "@/i18n/config";

export type LegalKey = "privacy" | "terms" | "cookies";

export const LEGAL_UPDATED = "2026-11-09";

export const LEGAL: Record<LegalKey, { title: Record<Locale, string>; description: Record<Locale, string>; load: Record<Locale, () => Promise<{ default: ComponentType }>> }> = {
  privacy: {
    title: { es: "Política de privacidad", en: "Privacy policy" },
    description: {
      es: "Cómo Group BAG Solutions recoge, usa y protege los datos personales de quienes visitan el sitio o nos contactan.",
      en: "How Group BAG Solutions collects, uses and protects the personal data of site visitors and people who contact us.",
    },
    load: { es: () => import("./legal/es/privacidad.mdx"), en: () => import("./legal/en/privacy.mdx") },
  },
  terms: {
    title: { es: "Términos de uso", en: "Terms of use" },
    description: {
      es: "Condiciones de uso del sitio web de BAG Solutions.",
      en: "Terms governing the use of the BAG Solutions website.",
    },
    load: { es: () => import("./legal/es/terminos.mdx"), en: () => import("./legal/en/terms.mdx") },
  },
  cookies: {
    title: { es: "Política de cookies", en: "Cookie policy" },
    description: {
      es: "Qué cookies y almacenamiento local usa el sitio de BAG Solutions y cómo gestionarlos.",
      en: "Which cookies and local storage the BAG Solutions site uses and how to manage them.",
    },
    load: { es: () => import("./legal/es/cookies.mdx"), en: () => import("./legal/en/cookies.mdx") },
  },
};
