import type { Metadata } from "next";
import type { BreadcrumbList, FAQPage, Organization, WebSite, WithContext } from "schema-dts";
import { SITE } from "@/content/site";
import { SERVICES } from "@/content/services";
import { ogLocale, otherLocale, type Locale } from "@/i18n/config";
import { alternates, href, type PageKey } from "@/i18n/paths";
import { getDict } from "@/i18n/dictionaries";

export const abs = (path: string) => `${SITE.url}${path}`;

type PageMetaInput = {
  lang: Locale;
  key: PageKey;
  slugs?: Record<Locale, string>;
  title?: string;
  description?: string;
  keywords?: string[];
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
};

/** Metadata por página: canonical, hreflang, Open Graph y Twitter coherentes. */
export function pageMetadata({ lang, key, slugs, title, description, keywords, noindex, type = "website", publishedTime }: PageMetaInput): Metadata {
  const t = getDict(lang);
  const alt = alternates(lang, key, slugs);
  const desc = description ?? t.meta.description;
  // Definir openGraph en una página reemplaza el heredado: la imagen del idioma se declara explícita
  const image = { url: `/${lang}/opengraph-image`, width: 1200, height: 630, alt: t.meta.ogAlt, type: "image/png" };
  return {
    title: title ?? { absolute: t.meta.title },
    description: desc,
    keywords: keywords ?? t.meta.keywords,
    alternates: alt,
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url: alt.canonical,
      siteName: SITE.name,
      title: title ? `${title} · ${SITE.name}` : t.meta.title,
      description: desc,
      locale: ogLocale[lang],
      alternateLocale: [ogLocale[otherLocale(lang)]],
      images: [image],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} · ${SITE.name}` : t.meta.title,
      description: desc,
      images: [image],
    },
  };
}

/* ---------- JSON-LD ---------- */
export function organizationLd(lang: Locale): WithContext<Organization> {
  const t = getDict(lang);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    taxID: SITE.rif,
    url: SITE.url,
    logo: abs("/icon.svg"),
    email: SITE.email,
    telephone: SITE.phone,
    description: t.meta.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    areaServed: ["VE", "Latin America", "Spain", "United States"],
    knowsLanguage: ["es", "en"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: SITE.email,
      telephone: SITE.phone,
      availableLanguage: ["Spanish", "English"],
    },
    makesOffer: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.seoTitle[lang], url: abs(href(lang, "services", s.slug[lang])) },
    })),
    ...(SITE.social.length ? { sameAs: SITE.social.map((s) => s.url) } : {}),
  };
}

export function websiteLd(lang: Locale): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: abs(href(lang, "home")),
    name: SITE.name,
    inLanguage: lang,
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqLd(items: readonly (readonly [string, string])[] | string[][]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}
