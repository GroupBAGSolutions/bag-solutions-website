import type { MetadataRoute } from "next";
import { SERVICES } from "@/content/services";
import { POSTS } from "@/content/posts";
import { LEGAL_UPDATED } from "@/content/legal";
import { locales, type Locale } from "@/i18n/config";
import { href, type PageKey } from "@/i18n/paths";
import { abs } from "@/lib/seo";

const BUILT = new Date().toISOString().slice(0, 10);

function entry(key: PageKey, priority: number, opts: { slugs?: Record<Locale, string>; lastModified?: string; changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"] } = {}) {
  const languages = Object.fromEntries(locales.map((l) => [l, abs(href(l, key, opts.slugs?.[l]))]));
  return locales.map((l) => ({
    url: abs(href(l, key, opts.slugs?.[l])),
    lastModified: opts.lastModified ?? BUILT,
    changeFrequency: opts.changeFrequency ?? "monthly",
    priority,
    alternates: { languages: { ...languages, "x-default": languages.es } },
  }));
}

/* Gracias (noindex) queda fuera del sitemap a propósito. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entry("home", 1, { changeFrequency: "weekly" }),
    ...entry("services", 0.9),
    ...SERVICES.flatMap((s) => entry("services", 0.9, { slugs: s.slug })),
    ...entry("about", 0.6),
    ...entry("contact", 0.8),
    ...entry("blog", 0.7, { changeFrequency: "weekly" }),
    ...POSTS.flatMap((p) => entry("blog", 0.6, { slugs: p.slug, lastModified: p.updated ?? p.published })),
    ...entry("privacy", 0.2, { lastModified: LEGAL_UPDATED, changeFrequency: "yearly" }),
    ...entry("terms", 0.2, { lastModified: LEGAL_UPDATED, changeFrequency: "yearly" }),
    ...entry("cookies", 0.2, { lastModified: LEGAL_UPDATED, changeFrequency: "yearly" }),
  ];
}
