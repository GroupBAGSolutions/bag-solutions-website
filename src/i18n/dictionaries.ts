import es, { type Dict } from "./messages/es";
import en from "./messages/en";
import type { Locale } from "./config";

const DICTS: Record<Locale, Dict> = { es, en };

export const getDict = (lang: Locale): Dict => DICTS[lang];
export type { Dict };

/** Reemplaza {clave} por su valor: fill("Hola {n}", { n: "Ana" }) */
export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
