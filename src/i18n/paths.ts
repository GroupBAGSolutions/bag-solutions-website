import { SERVICES } from "@/content/services";
import { POSTS } from "@/content/posts";
import { locales, type Locale } from "./config";

/* Segmentos de URL por idioma. Las carpetas del App Router usan la versión en español;
   proxy.ts reescribe las URLs en inglés hacia ellas. */
export const SEG = {
  services: { es: "servicios", en: "services" },
  about: { es: "nosotros", en: "about" },
  contact: { es: "contacto", en: "contact" },
  thanks: { es: "gracias", en: "thank-you" },
  privacy: { es: "privacidad", en: "privacy" },
  terms: { es: "terminos", en: "terms" },
  cookies: { es: "cookies", en: "cookies" },
  blog: { es: "blog", en: "blog" },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = "home" | keyof typeof SEG;

export function href(lang: Locale, key: PageKey, slug?: string) {
  if (key === "home") return `/${lang}`;
  return `/${lang}/${SEG[key][lang]}${slug ? `/${slug}` : ""}`;
}

export const serviceHref = (lang: Locale, id: string) => {
  const s = SERVICES.find((x) => x.id === id)!;
  return href(lang, "services", s.slug[lang]);
};

export const postHref = (lang: Locale, id: string) => {
  const p = POSTS.find((x) => x.id === id)!;
  return href(lang, "blog", p.slug[lang]);
};

/** Traduce una URL visible al otro idioma (selector de idioma). */
export function translatePath(pathname: string, to: Locale): string {
  const [, from, section, slug] = pathname.split("/");
  if (!locales.includes(from as Locale)) return `/${to}`;
  const src = from as Locale;
  if (!section) return `/${to}`;
  const key = (Object.keys(SEG) as (keyof typeof SEG)[]).find((k) => SEG[k][src] === section || SEG[k].es === section);
  if (!key) return `/${to}`;
  if (!slug) return href(to, key);
  if (key === "services") {
    const s = SERVICES.find((x) => x.slug[src] === slug || x.slug.es === slug);
    return s ? href(to, key, s.slug[to]) : href(to, key);
  }
  if (key === "blog") {
    const p = POSTS.find((x) => x.slug[src] === slug);
    return p ? href(to, key, p.slug[to]) : href(to, key);
  }
  return href(to, key);
}

/** URLs alternas (hreflang) de una página para el Metadata API. */
export function alternates(lang: Locale, key: PageKey, slugs?: Record<Locale, string>) {
  const languages = Object.fromEntries(locales.map((l) => [l, href(l, key, slugs?.[l])])) as Record<Locale, string>;
  return {
    canonical: href(lang, key, slugs?.[lang]),
    languages: { ...languages, "x-default": languages.es },
  };
}
