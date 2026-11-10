"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDict } from "@/i18n/dictionaries";
import { href } from "@/i18n/paths";

export default function NotFound() {
  const lang = usePathname().startsWith("/en") ? "en" : "es";
  const t = getDict(lang);
  return (
    <section className="wrap nf">
      <p className="mono">404</p>
      <h1 className="display">{t.notFound.title}</h1>
      <p className="lead">{t.notFound.lead}</p>
      <div className="ctas">
        <Link className="btn btn-primary" href={href(lang, "home")}>{t.notFound.home}</Link>
        <Link className="btn btn-secondary" href={href(lang, "contact")}>{t.cta.primary}</Link>
      </div>
    </section>
  );
}
