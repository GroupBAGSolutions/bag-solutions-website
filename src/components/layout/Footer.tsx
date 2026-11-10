import Link from "next/link";
import { Logo } from "./Logo";
import { SITE, whatsappLink } from "@/content/site";
import { SERVICES } from "@/content/services";
import { href, serviceHref } from "@/i18n/paths";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";
import { BrandIcon, brandTitle } from "@/components/BrandIcon";

export function Footer({ lang, t }: { lang: Locale; t: Dict }) {
  const year = new Date().getFullYear();
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft-grid">
          <div className="ft-brand">
            <Logo />
            <p>{t.footer.tagline}</p>
          </div>
          <nav className="ft-col" aria-label={t.footer.services}>
            <h2>{t.footer.services}</h2>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link href={serviceHref(lang, s.id)}>{s.name[lang]}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="ft-col" aria-label={t.footer.company}>
            <h2>{t.footer.company}</h2>
            <ul>
              <li><Link href={`${href(lang, "home")}#process`}>{t.nav.process}</Link></li>
              <li><Link href={href(lang, "about")}>{t.nav.about}</Link></li>
              <li><Link href={href(lang, "blog")}>{t.nav.blog}</Link></li>
              <li><Link href={href(lang, "contact")}>{t.cta.primary}</Link></li>
            </ul>
          </nav>
          <div className="ft-col">
            <h2>{t.footer.contact}</h2>
            <ul>
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li>
                <a className="wa-link" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <BrandIcon name="whatsapp" brandColor /> {SITE.phoneDisplay}
                </a>
              </li>
              <li><span>{t.footer.location}</span></li>
              {SITE.social.length > 0 && (
                <li className="ft-social">
                  {SITE.social.map((s) => (
                    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={brandTitle(s.network)}>
                      <BrandIcon name={s.network} />
                    </a>
                  ))}
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="ft-base">
          <span>© {year} {SITE.legalName} · RIF {SITE.rif}</span>
          <nav className="ft-legal" aria-label="Legal">
            <Link href={href(lang, "privacy")}>{t.footer.privacy}</Link>
            <Link href={href(lang, "terms")}>{t.footer.terms}</Link>
            <Link href={href(lang, "cookies")}>{t.footer.cookies}</Link>
            <CookieSettingsButton label={t.footer.cookieSettings} />
          </nav>
        </div>
      </div>
    </footer>
  );
}
