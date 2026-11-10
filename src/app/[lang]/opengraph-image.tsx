import { ImageResponse } from "next/og";
import { getDict } from "@/i18n/dictionaries";
import { isLocale, locales } from "@/i18n/config";
import { SITE } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "BAG Solutions";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const PX: [number, number, number][] = [
  [7, 0, 1], [14, 0, 0.7], [0, 7, 0.55], [7, 7, 0.85], [21, 7, 1], [14, 14, 0.7], [21, 14, 0.9],
];

/* Imagen Open Graph por idioma (se hereda en todas las páginas de /es y /en). */
export default async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  const lang = isLocale(l) ? l : "es";
  const t = getDict(lang);
  const k = 3;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#020A1A", color: "#DCDFE2", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative", width: 26 * k, height: 19 * k, display: "flex" }}>
            {PX.map(([x, y, o], i) => (
              <div key={i} style={{ position: "absolute", left: x * k, top: y * k, width: 5 * k, height: 5 * k, borderRadius: k, background: "#0E74E1", opacity: o }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 34, letterSpacing: 4, fontWeight: 600 }}>{SITE.name.toUpperCase()}</div>
            <div style={{ fontSize: 18, color: "#8392AD", letterSpacing: 1 }}>{`RIF: ${SITE.rif}`}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 76, lineHeight: 1.02, letterSpacing: -2.5, fontWeight: 600, maxWidth: 1000 }}>
            {t.hero.l1}&nbsp;<span style={{ color: "#3E92FF" }}>{t.hero.l2hl}</span>
            {t.hero.l2rest}
          </div>
          <div style={{ display: "flex", fontSize: 30, lineHeight: 1.35, color: "#A3AFC4", maxWidth: 940 }}>{t.hero.lead}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#8392AD" }}>
          <span>{t.hero.free}</span>
          <span>groupbagsolutions.com</span>
        </div>
      </div>
    ),
    size,
  );
}
