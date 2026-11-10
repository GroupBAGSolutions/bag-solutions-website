import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ClosingCta } from "@/components/home/Sections";
import { POSTS, postBySlug } from "@/content/posts";
import { POST_BODY } from "@/content/post-loaders";
import { serviceById } from "@/content/services";
import { SITE } from "@/content/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { href, postHref, serviceHref } from "@/i18n/paths";
import { abs, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => POSTS.map((p) => ({ lang, slug: p.slug[lang] })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const p = postBySlug(lang, slug);
  if (!p) return {};
  return pageMetadata({
    lang,
    key: "blog",
    slugs: p.slug,
    title: p.title[lang],
    description: p.description[lang],
    type: "article",
    publishedTime: p.published,
  });
}

export default async function PostPage({ params }: Props) {
  const { lang: l, slug } = await params;
  if (!isLocale(l)) notFound();
  const lang: Locale = l;
  const p = postBySlug(lang, slug);
  if (!p) notFound();
  const t = getDict(lang);
  const { default: Body } = await POST_BODY[p.id][lang]();
  const svc = serviceById(p.service);

  const ld: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title[lang],
    description: p.description[lang],
    datePublished: p.published,
    dateModified: p.updated ?? p.published,
    inLanguage: lang,
    mainEntityOfPage: abs(postHref(lang, p.id)),
    image: abs(`/${lang}/opengraph-image`),
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: { "@id": `${SITE.url}/#organization` },
  };

  return (
    <>
      <article className="wrap page-hero article">
        <Breadcrumbs
          label={t.a11y.breadcrumb}
          items={[
            { name: t.nav.home, path: href(lang, "home") },
            { name: t.blog.title, path: href(lang, "blog") },
            { name: p.title[lang], path: postHref(lang, p.id) },
          ]}
        />
        <header className="article-head">
          <h1 className="h1">{p.title[lang]}</h1>
          <p className="lead">{p.description[lang]}</p>
          <p className="post-meta">
            <span>{t.blog.published} <time dateTime={p.published}>{formatDate(p.published, lang)}</time></span>
            <span>{p.minutes[lang]} {t.blog.minutes}</span>
            <span>
              {t.blog.relatedService}: <Link href={serviceHref(lang, svc.id)} style={{ color: "var(--accent-ink)" }}>{svc.name[lang]}</Link>
            </span>
          </p>
        </header>
        <div className="article-body prose prose-bag">
          <Body />
        </div>
      </article>
      <ClosingCta lang={lang} t={t} title={t.blog.ctaTitle} lead={t.blog.ctaLead} />
      <JsonLd data={ld} />
    </>
  );
}
