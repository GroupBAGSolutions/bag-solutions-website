import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LEGAL, LEGAL_UPDATED, type LegalKey } from "@/content/legal";
import { isLocale, type Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format";
import { getDict } from "@/i18n/dictionaries";
import { href } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo";

export async function legalMetadata(key: LegalKey, lang: string): Promise<Metadata> {
  const l = lang as Locale;
  return pageMetadata({ lang: l, key, title: LEGAL[key].title[l], description: LEGAL[key].description[l] });
}

export async function LegalPage({ k, lang }: { k: LegalKey; lang: string }) {
  if (!isLocale(lang)) return null;
  const t = getDict(lang);
  const doc = LEGAL[k];
  const { default: Content } = await doc.load[lang]();
  const date = formatDate(LEGAL_UPDATED, lang);
  return (
    <article className="wrap page-hero article">
      <Breadcrumbs
        label={t.a11y.breadcrumb}
        items={[
          { name: t.nav.home, path: href(lang, "home") },
          { name: doc.title[lang], path: href(lang, k) },
        ]}
      />
      <header className="article-head">
        <h1 className="h1">{doc.title[lang]}</h1>
        <p className="post-meta">
          <span>{t.legal.updated}: <time dateTime={LEGAL_UPDATED}>{date}</time></span>
          <span>{t.legal.draft}</span>
        </p>
      </header>
      <div className="article-body prose prose-bag">
        <Content />
      </div>
    </article>
  );
}
