import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import type { Service as ServiceLd, WithContext } from "schema-dts";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ServiceDemo } from "@/components/demos/Demos";
import { ErpBuilder } from "@/components/demos/ErpBuilder";
import { ClosingCta, FaqSection } from "@/components/home/Sections";
import { ERP_MODULES } from "@/content/erp";
import { SERVICES, serviceBySlug } from "@/content/services";
import { SITE } from "@/content/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { href, serviceHref } from "@/i18n/paths";
import { abs, faqLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => SERVICES.map((s) => ({ lang, slug: s.slug[lang] })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const s = isLocale(lang) ? serviceBySlug(lang, slug) : undefined;
  if (!s || !isLocale(lang)) return {};
  return pageMetadata({
    lang,
    key: "services",
    slugs: s.slug,
    title: s.seoTitle[lang],
    description: s.seoDescription[lang],
    keywords: s.keywords[lang],
  });
}

export default async function ServicePage({ params }: Props) {
  const { lang: l, slug } = await params;
  if (!isLocale(l)) notFound();
  const lang: Locale = l;
  const s = serviceBySlug(lang, slug);
  if (!s) notFound();
  const t = getDict(lang);
  const i = SERVICES.indexOf(s);
  const next = SERVICES[(i + 1) % SERVICES.length];
  const faq = s.faq[lang];

  const ld: WithContext<ServiceLd> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.seoTitle[lang],
    serviceType: s.name[lang],
    description: s.seoDescription[lang],
    url: abs(serviceHref(lang, s.id)),
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: ["VE", "Latin America"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: s.tiers ? t.service.tiers : t.demos.erp.modules,
      itemListElement: (s.tiers ? s.tiers[lang] : ERP_MODULES.map((m) => [m.name[lang], m.desc[lang]] as const)).map(([name, description]) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: `${s.name[lang]} ${name}`, description },
      })),
    },
  };
  const contact = href(lang, "contact");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs
            label={t.a11y.breadcrumb}
            items={[
              { name: t.nav.home, path: href(lang, "home") },
              { name: t.nav.services, path: href(lang, "services") },
              { name: s.name[lang], path: serviceHref(lang, s.id) },
            ]}
          />
          <h1 className="h1 sv-title">{s.seoTitle[lang]}</h1>
          <div className="sv-meta">
            <p className="lead">{s.lead[lang]}</p>
            <div className="sv-aside">
              <span className="mono">{t.service.free}</span>
              <strong>{t.service.freeValue}</strong>
              <p>{t.service.ownership}</p>
              <Link className="btn btn-primary" href={`${contact}?s=${s.id}`}>
                {t.cta.primary}
              </Link>
            </div>
          </div>
          <div className="sv-demo">
            {s.id === "erp" ? (
              <ErpBuilder lang={lang} t={t.demos.erp} title={s.demoTitle[lang]} contactHref={contact} />
            ) : (
              <ServiceDemo id={s.id} lang={lang} t={t.demos} title={s.demoTitle[lang]} />
            )}
          </div>
          <p className="sv-demo-cap demo-note">{s.id === "erp" ? t.service.builderNote : t.service.demoNote}</p>
        </div>
      </section>

      <section className="sv-sec" aria-labelledby="inc-title">
        <div className="wrap">
          <h2 className="h2" id="inc-title" data-reveal="">{t.service.includes}</h2>
          <ul className="incl-grid">
            {s.incl[lang].map((x, k) => (
              <li key={x} data-reveal={k % 2}>
                <Check className="ic" strokeWidth={2} aria-hidden />
                <p>{x}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {s.tiers && (
        <section className="sv-sec" aria-labelledby="tiers-title">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h2" id="tiers-title" data-reveal="">{t.service.tiers}</h2>
              <p className="lead" data-reveal="1">{t.service.tiersLead}</p>
            </div>
            <ol className="tiers">
              {s.tiers[lang].map(([name, desc], k) => (
                <li key={name} data-reveal={k}>
                  <span className="mono">0{k + 1}</span>
                  <h3 className="h3">{name}</h3>
                  <p>{desc}</p>
                  <Link className="tier-go" href={`${contact}?s=${s.id}&n=${k}`}>
                    {t.service.tierCta} <ArrowUpRight className="ic" strokeWidth={1.8} aria-hidden />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <FaqSection id="service-faq" title={`${t.service.faq} ${s.name[lang]}`} items={faq} />

      <section className="wrap">
        <div className="sv-next">
          <Link href={serviceHref(lang, next.id)}>
            <span>
              <span className="mono">{t.service.next}</span>
              <span className="h2" style={{ display: "block" }}>{next.name[lang]}</span>
            </span>
            <ArrowUpRight className="ic" strokeWidth={1.6} aria-hidden />
          </Link>
        </div>
      </section>

      <ClosingCta lang={lang} t={t} />
      <JsonLd data={[ld, faqLd(faq)]} />
    </>
  );
}
