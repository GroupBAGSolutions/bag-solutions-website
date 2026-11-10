import Link from "next/link";
import { SITE } from "@/content/site";

/* Marca provisional de píxeles: reemplazar por el SVG oficial cuando exista */
export function LogoMark({ className = "logo-mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 26 19" aria-hidden="true" focusable="false">
      <rect x="7" y="0" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="14" y="0" width="5" height="5" rx="1" fill="currentColor" opacity=".7" />
      <rect x="0" y="7" width="5" height="5" rx="1" fill="currentColor" opacity=".55" />
      <rect x="7" y="7" width="5" height="5" rx="1" fill="currentColor" opacity=".85" />
      <rect x="21" y="7" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="14" y="14" width="5" height="5" rx="1" fill="currentColor" opacity=".7" />
      <rect x="21" y="14" width="5" height="5" rx="1" fill="currentColor" opacity=".9" />
    </svg>
  );
}

/** Logo con el RIF debajo (encabezado y footer). */
export function Logo({ href, label }: { href?: string; label?: string }) {
  const inner = (
    <>
      <span className="logo-row">
        <LogoMark />
        <span className="logo-word" translate="no">
          B<span>A</span>G
        </span>
      </span>
      <span className="logo-rif" translate="no">
        RIF: {SITE.rif}
      </span>
    </>
  );
  return href ? (
    <Link href={href} className="logo" aria-label={label}>
      {inner}
    </Link>
  ) : (
    <span className="logo">{inner}</span>
  );
}
