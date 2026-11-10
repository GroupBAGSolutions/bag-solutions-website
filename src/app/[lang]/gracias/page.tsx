import type { Metadata } from "next";
import Link from "next/link";
import { BrandIcon } from "@/components/BrandIcon";
import { whatsappLink } from "@/content/site";
import { isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { href } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang as Locale);
  return pageMetadata({ lang: lang as Locale, key: "thanks", title: t.thanks.metaTitle, noindex: true });
}

export default async function ThanksPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const t = getDict(lang).thanks;
  return (
    <section className="wrap gr">
      <h1 className="display">{t.title}</h1>
      <p className="lead">{t.lead}</p>
      <div className="ctas">
        <a className="btn btn-primary" href={whatsappLink(t.waText)} target="_blank" rel="noopener noreferrer">
          <BrandIcon name="whatsapp" /> {t.whatsapp}
        </a>
        <Link className="btn btn-secondary" href={href(lang, "home")}>{t.back}</Link>
      </div>
      <h2>{t.next}</h2>
      <ol className="tl-v">
        {t.steps.map(([h, p]) => (
          <li key={h}>
            <h3>{h}</h3>
            <p>{p}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
