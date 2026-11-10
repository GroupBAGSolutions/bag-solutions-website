import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClosingCta, ProcessSection, ServiceCards } from "@/components/home/Sections";
import { isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { href } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang as Locale);
  return pageMetadata({ lang: lang as Locale, key: "services", title: t.services.indexMetaTitle, description: t.services.indexMetaDescription });
}

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const t = getDict(lang);
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs
            label={t.a11y.breadcrumb}
            items={[
              { name: t.nav.home, path: href(lang, "home") },
              { name: t.nav.services, path: href(lang, "services") },
            ]}
          />
          <div className="sec-head" style={{ marginTop: 28 }}>
            <h1 className="h1">{t.services.indexTitle}</h1>
            <p className="lead">{t.services.indexLead}</p>
          </div>
          <ServiceCards lang={lang} t={t} as="h2" />
        </div>
      </section>
      <ProcessSection t={t} />
      <ClosingCta lang={lang} t={t} />
    </>
  );
}
