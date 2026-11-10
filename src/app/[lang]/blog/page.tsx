import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClosingCta } from "@/components/home/Sections";
import { POSTS } from "@/content/posts";
import { isLocale, type Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format";
import { getDict } from "@/i18n/dictionaries";
import { href, postHref } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang as Locale);
  return pageMetadata({ lang: lang as Locale, key: "blog", title: t.blog.metaTitle, description: t.blog.metaDescription });
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const t = getDict(lang);
  const posts = [...POSTS].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs
            label={t.a11y.breadcrumb}
            items={[
              { name: t.nav.home, path: href(lang, "home") },
              { name: t.blog.title, path: href(lang, "blog") },
            ]}
          />
          <div className="sec-head" style={{ marginTop: 28 }}>
            <h1 className="h1">{t.blog.title}</h1>
            <p className="lead">{t.blog.lead}</p>
          </div>
          <div className="posts">
            {posts.map((p, i) => (
              <Link key={p.id} className="post-card" href={postHref(lang, p.id)} data-reveal={i % 3}>
                <p className="post-meta">
                  <time dateTime={p.published}>{formatDate(p.published, lang)}</time>
                  <span>{p.minutes[lang]} {t.blog.minutes}</span>
                </p>
                <h2>{p.title[lang]}</h2>
                <p>{p.description[lang]}</p>
                <span className="card-go">
                  {t.blog.read} <ArrowUpRight className="ic" strokeWidth={1.8} aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ClosingCta lang={lang} t={t} title={t.blog.ctaTitle} lead={t.blog.ctaLead} />
    </>
  );
}
