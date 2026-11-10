import type { ComponentType } from "react";
import type { Locale } from "@/i18n/config";

/* Imports explícitos para que el bundler incluya cada MDX (sin rutas dinámicas). */
export const POST_BODY: Record<string, Record<Locale, () => Promise<{ default: ComponentType }>>> = {
  "crm-a-medida": {
    es: () => import("./blog/es/crm-a-medida.mdx"),
    en: () => import("./blog/en/crm-a-medida.mdx"),
  },
  "senales-erp": {
    es: () => import("./blog/es/senales-erp.mdx"),
    en: () => import("./blog/en/senales-erp.mdx"),
  },
  "automatizar-primero": {
    es: () => import("./blog/es/automatizar-primero.mdx"),
    en: () => import("./blog/en/automatizar-primero.mdx"),
  },
};
