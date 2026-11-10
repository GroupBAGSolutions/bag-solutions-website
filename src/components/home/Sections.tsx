import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { HeroArt } from "./HeroArt";
import { ProcessSteps } from "./ProcessSteps";
import { Ill } from "@/components/ill/Ill";
import { SERVICES } from "@/content/services";
import { href, serviceHref } from "@/i18n/paths";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";

const css = (i: number) => ({ "--i": i }) as React.CSSProperties;

export function Hero({ lang, t }: { lang: Locale; t: Dict }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <h1 className="display" id="hero-title">
          <span className="line"><span style={css(0)}>{t.hero.l1}</span></span>{" "}
          <span className="line">
            <span style={css(1)}>
              <em className="hl">{t.hero.l2hl}</em>
              {t.hero.l2rest}
            </span>
          </span>
        </h1>
        <div className="hero-row">
          <p className="lead" data-hero="" style={css(0)}>{t.hero.lead}</p>
          <div className="ctas" data-hero="" style={css(1)}>
            <Link className="btn btn-primary" href={href(lang, "contact")}>
              {t.cta.primary}
            </Link>
            <Link className="btn btn-secondary" href={href(lang, "services")}>
              {t.cta.secondary}
            </Link>
          </div>
        </div>
        <HeroArt label={t.hero.artLabel} />
      </div>
    </section>
  );
}

export function ServiceCards({ lang, t, as: H = "h3" }: { lang: Locale; t: Dict; as?: "h2" | "h3" }) {
  return (
    <div className="cards">
      {SERVICES.map((s, i) => (
        <Link key={s.id} className="card" href={serviceHref(lang, s.id)} data-reveal={i % 3}>
          <div className="card-art">
            <Ill kind={s.id} labels={t.ill} />
          </div>
          <div className="card-body">
            <H className="h3">{s.name[lang]}</H>
            <p>{s.short[lang]}</p>
            <span className="card-go">
              {t.services.more} <ArrowUpRight className="ic" strokeWidth={1.8} aria-hidden />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ServicesSection({ lang, t }: { lang: Locale; t: Dict }) {
  return (
    <section className="services" id="services" aria-labelledby="svc-title">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="h2" id="svc-title" data-reveal="">{t.services.title}</h2>
          <p className="lead" data-reveal="1">{t.services.lead}</p>
        </div>
        <ServiceCards lang={lang} t={t} />
      </div>
    </section>
  );
}

export function ProcessSection({ t, id = "process" }: { t: Dict; id?: string }) {
  return (
    <section className="process" id={id} aria-labelledby="pr-title">
      <div className="wrap process-grid">
        <div className="process-head">
          <h2 className="h2" id="pr-title" data-reveal="">{t.process.title}</h2>
          <p className="lead" data-reveal="1">{t.process.lead}</p>
        </div>
        <ProcessSteps steps={t.process.steps} receives={t.process.receives} />
      </div>
    </section>
  );
}

export function AboutSection({ t, withValues = true, headingLevel = 2 }: { t: Dict; withValues?: boolean; headingLevel?: 1 | 2 }) {
  const H = headingLevel === 1 ? "h1" : "h2";
  return (
    <section className="about" id="about" aria-labelledby="ab-title">
      <div className="wrap">
        <div className="about-grid">
          <H className="h2" id="ab-title" data-reveal="">{t.about.title}</H>
          {/* Cada palabra se ilumina con el scroll (CSS scroll-driven, sin JS) */}
          <p className="stmt">
            {t.about.stmt.split(/\s+/).map((w, i) => (
              <span key={i} className="w">{w} </span>
            ))}
          </p>
        </div>
        {withValues && (
          <ul className="values">
            {t.about.values.map(([h, p], i) => (
              <li key={h} data-reveal={i}>
                <h3>{h}</h3>
                <p>{p}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function FaqSection({ title, lead, items, id = "faq" }: { title: string; lead?: string; items: readonly (readonly [string, string])[] | string[][]; id?: string }) {
  return (
    <section className="faq" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap faq-grid">
        <div className="faq-head">
          <h2 className="h2" id={`${id}-title`} data-reveal="">{title}</h2>
          {lead && <p className="lead" data-reveal="1">{lead}</p>}
        </div>
        <div className="faq-list">
          {items.map(([q, a]) => (
            <details key={q} className="faq-item">
              <summary>
                {q}
                <Plus className="ic" strokeWidth={1.8} aria-hidden />
              </summary>
              <p className="faq-a">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClosingCta({ lang, t, title, lead }: { lang: Locale; t: Dict; title?: string; lead?: string }) {
  return (
    <section className="cta-final" aria-labelledby="cta-title">
      <div className="wrap">
        <h2 className="giant" id="cta-title" data-reveal="">{title ?? t.closing.title}</h2>
        <div className="cta-row" data-reveal="1">
          <p className="lead">{lead ?? t.closing.lead}</p>
          <Link className="btn btn-primary" href={href(lang, "contact")}>
            {t.cta.primary} <ArrowUpRight className="ic ic-go" strokeWidth={1.8} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
