import type { Metadata } from "next";
import { AboutSection, ClosingCta, FaqSection, Hero, ProcessSection, ServicesSection } from "@/components/home/Sections";
import { JsonLd } from "@/components/JsonLd";
import { isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { faqLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({ lang: lang as Locale, key: "home" });
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const t = getDict(lang);
  return (
    <>
      <Hero lang={lang} t={t} />
      <ServicesSection lang={lang} t={t} />
      <ProcessSection t={t} />
      <AboutSection t={t} />
      <FaqSection title={t.faq.title} lead={t.faq.lead} items={t.faq.items} />
      <ClosingCta lang={lang} t={t} />
      <JsonLd data={faqLd(t.faq.items)} />
    </>
  );
}
