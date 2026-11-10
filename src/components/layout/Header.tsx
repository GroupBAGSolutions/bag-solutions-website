"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Logo } from "./Logo";
import { href, translatePath } from "@/i18n/paths";
import { otherLocale, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";

const noop = () => () => {};

export function Header({ lang, t }: { lang: Locale; t: Pick<Dict, "nav" | "a11y"> }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();
  const dark = mounted && resolvedTheme === "dark";
  const other = otherLocale(lang);

  // Fondo de vidrio al hacer scroll
  useEffect(() => {
    const nav = navRef.current;
    const onScroll = () => nav?.classList.toggle("scrolled", scrollY > 8);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  // Menú móvil: bloquea el resto de la página y cierra con Escape
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("menu-open", open);
    document.querySelectorAll<HTMLElement>("main, footer").forEach((el) => (el.inert = open));
    if (open) menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: href(lang, "services"), label: t.nav.services },
    { href: `${href(lang, "home")}#process`, label: t.nav.process },
    { href: href(lang, "about"), label: t.nav.about },
    { href: href(lang, "blog"), label: t.nav.blog },
  ];
  const close = () => setOpen(false);
  const current = (h: string) => (pathname === h || pathname.startsWith(h + "/") ? "page" : undefined);

  return (
    <>
      <header className="nav" ref={navRef}>
        <div className="wrap nav-in">
          <Logo href={href(lang, "home")} label={t.a11y.home} />
          <nav className="nav-links" aria-label={t.a11y.main}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={current(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Link
              className="icon-btn lang-btn"
              href={translatePath(pathname, other)}
              hrefLang={other}
              aria-label={t.a11y.lang}
              prefetch={false}
            >
              {other.toUpperCase()}
            </Link>
            <button
              className="icon-btn"
              type="button"
              aria-label={dark ? t.a11y.toLight : t.a11y.toDark}
              onClick={() => setTheme(dark ? "light" : "dark")}
            >
              {dark ? <Sun className="ic" strokeWidth={1.8} aria-hidden /> : <Moon className="ic" strokeWidth={1.8} aria-hidden />}
            </button>
            <Link className="btn btn-primary nav-cta" href={href(lang, "contact")}>
              {t.nav.cta}
            </Link>
            <button
              ref={btnRef}
              className="icon-btn menu-btn"
              type="button"
              aria-label={open ? t.a11y.menuClose : t.a11y.menuOpen}
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="ic" strokeWidth={1.8} aria-hidden /> : <Menu className="ic" strokeWidth={1.8} aria-hidden />}
            </button>
          </div>
        </div>
      </header>
      <div className="menu" id="menu" ref={menuRef} role="dialog" aria-modal="true" aria-label={t.a11y.menu} inert={!open}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={close}>
            {l.label}
          </Link>
        ))}
        <Link href={href(lang, "contact")} onClick={close}>
          {t.nav.contact}
        </Link>
        <Link className="btn btn-primary" href={href(lang, "contact")} onClick={close}>
          {t.nav.cta}
        </Link>
      </div>
    </>
  );
}
