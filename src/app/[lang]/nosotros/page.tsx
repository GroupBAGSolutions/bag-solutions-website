import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AboutSection, ClosingCta, FaqSection, ProcessSection } from "@/components/home/Sections";
import { JsonLd } from "@/components/JsonLd";
import { isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { href } from "@/i18n/paths";
import { faqLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang as Locale);
  return pageMetadata({ lang: lang as Locale, key: "about", title: t.about.metaTitle, description: t.about.metaDescription });
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const t = getDict(lang);
  const faq = t.faq.items.slice(2, 6);
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs
            label={t.a11y.breadcrumb}
            items={[
              { name: t.nav.home, path: href(lang, "home") },
              { name: t.nav.about, path: href(lang, "about") },
            ]}
          />
          <h1 className="h1 sv-title">{t.nav.about}</h1>
          <p className="lead" style={{ marginTop: 28 }}>{t.about.pageLead}</p>
        </div>
      </section>
      <AboutSection t={t} />
      <section className="sv-sec" aria-labelledby="no-title">
        <div className="wrap">
          <h2 className="h2" id="no-title" data-reveal="">{t.about.noTitle}</h2>
          <ul className="incl-grid">
            {t.about.no.map((p, i) => (
              <li key={i} data-reveal={i}><p>{p}</p></li>
            ))}
          </ul>
        </div>
      </section>
      <ProcessSection t={t} id="process" />
      <FaqSection title={t.faq.title} items={faq} />
      <ClosingCta lang={lang} t={t} />
      <JsonLd data={faqLd(faq)} />
    </>
  );
}
