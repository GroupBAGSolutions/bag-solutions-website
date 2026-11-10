import { NextResponse, type NextRequest } from "next/server";

/* Rutas en inglés → carpetas internas (en español) del App Router.
   /en/services/crm se sirve desde app/[lang]/servicios/[slug] sin cambiar la URL. */
const EN_TO_INTERNAL: Record<string, string> = {
  services: "servicios",
  about: "nosotros",
  contact: "contacto",
  "thank-you": "gracias",
  privacy: "privacidad",
  terms: "terminos",
};
const INTERNAL_TO_EN = Object.fromEntries(Object.entries(EN_TO_INTERNAL).map(([en, es]) => [es, en]));

function detectLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase();
    if (tag.startsWith("es")) return "es";
    if (tag.startsWith("en")) return "en";
  }
  return "es";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/");
  const lang = segments[1];
  const first = segments[2];

  // Sin prefijo de idioma: redirige según el navegador (español por defecto)
  if (lang !== "es" && lang !== "en") {
    const url = request.nextUrl.clone();
    url.pathname = `/${detectLocale(request)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, pathname === "/" ? 307 : 308);
  }

  if (!first) return;

  if (lang === "en") {
    // URL canónica en inglés: /en/servicios → /en/services
    if (first in INTERNAL_TO_EN) {
      const url = request.nextUrl.clone();
      segments[2] = INTERNAL_TO_EN[first];
      url.pathname = segments.join("/");
      return NextResponse.redirect(url, 308);
    }
    if (first in EN_TO_INTERNAL) {
      const url = request.nextUrl.clone();
      segments[2] = EN_TO_INTERNAL[first];
      url.pathname = segments.join("/");
      return NextResponse.rewrite(url);
    }
  }

  // URL canónica en español: /es/services → /es/servicios
  if (lang === "es" && first in EN_TO_INTERNAL) {
    const url = request.nextUrl.clone();
    segments[2] = EN_TO_INTERNAL[first];
    url.pathname = segments.join("/");
    return NextResponse.redirect(url, 308);
  }
}

export const config = {
  matcher: ["/((?!_next|api|apple-icon|.*\\..*).*)"],
};
