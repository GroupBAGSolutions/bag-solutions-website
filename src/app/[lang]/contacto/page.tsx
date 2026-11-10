import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";
import { BrandIcon } from "@/components/BrandIcon";
import { SERVICES } from "@/content/services";
import { SITE, whatsappLink } from "@/content/site";
import { isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { href } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang as Locale);
  return pageMetadata({ lang: lang as Locale, key: "contact", title: t.contact.metaTitle, description: t.contact.metaDescription });
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const t = getDict(lang);
  const c = t.contact;
  return (
    <section className="wrap ct">
      <div className="ct-intro">
        <Breadcrumbs
          label={t.a11y.breadcrumb}
          items={[
            { name: t.nav.home, path: href(lang, "home") },
            { name: t.nav.contact, path: href(lang, "contact") },
          ]}
        />
        <h1 className="h1">{c.title}</h1>
        <p className="lead">{c.lead}</p>
        <dl className="ct-direct">
          <dt>{c.email}</dt>
          <dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd>
          <dt>{c.phone}</dt>
          <dd><a className="wa-link" href={whatsappLink(c.waText)} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp" brandColor /> {SITE.phoneDisplay}</a></dd>
          <dt>{c.location}</dt>
          <dd>{c.locationValue}</dd>
          <dt>RIF</dt>
          <dd>{SITE.rif}</dd>
        </dl>
      </div>
      <ContactForm
        lang={lang}
        t={c}
        services={SERVICES.map((s) => ({ id: s.id, name: s.name[lang], tiers: s.tiers?.[lang].map(([name]) => name) }))}
        thanksHref={href(lang, "thanks")}
        privacyHref={href(lang, "privacy")}
      />
    </section>
  );
}
