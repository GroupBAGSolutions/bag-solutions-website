import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbLd } from "@/lib/seo";

/** Migas de pan visibles + BreadcrumbList en JSON-LD. El último elemento es la página actual. */
export function Breadcrumbs({ items, label }: { items: { name: string; path: string }[]; label: string }) {
  return (
    <nav className="crumbs" aria-label={label}>
      <ol>
        {items.map((it, i) =>
          i < items.length - 1 ? (
            <li key={it.path}><Link href={it.path}>{it.name}</Link></li>
          ) : (
            <li key={it.path} aria-current="page">{it.name}</li>
          ),
        )}
      </ol>
      <JsonLd data={breadcrumbLd(items)} />
    </nav>
  );
}
