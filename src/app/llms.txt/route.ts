import { SERVICES } from "@/content/services";
import { POSTS } from "@/content/posts";
import { SITE } from "@/content/site";
import es from "@/i18n/messages/es";
import { href, postHref, serviceHref } from "@/i18n/paths";
import { abs } from "@/lib/seo";

export const dynamic = "force-static";

/* Resumen del sitio para asistentes de IA (formato llms.txt). */
export function GET() {
  const body = `# ${SITE.name}

> ${es.meta.description}

${SITE.legalName} (RIF ${SITE.rif}) es una empresa de desarrollo de software a medida con sede en ${SITE.foundingLocation}. Trabaja de forma remota con empresas de habla hispana. Todo se desarrolla desde cero: no hace módulos para Odoo o Profit, no integra software con licencias o accesos limitados (A2, Stellar, SAP, Saint, Kommon, CRM Hub, Fina Partners) y no da mantenimiento a software de terceros. El código de cada proyecto pertenece al cliente. El diagnóstico inicial es gratuito.

## Servicios
${SERVICES.map((s) => `- [${s.seoTitle.es}](${abs(serviceHref("es", s.id))}): ${s.short.es}`).join("\n")}

## Empresa
- [Nosotros](${abs(href("es", "about"))})
- [Contacto y diagnóstico gratuito](${abs(href("es", "contact"))}): ${SITE.email} · WhatsApp ${SITE.phoneDisplay}

## Blog
${POSTS.map((p) => `- [${p.title.es}](${abs(postHref("es", p.id))}): ${p.description.es}`).join("\n")}

## English
- [Home](${abs(href("en", "home"))})
${SERVICES.map((s) => `- [${s.seoTitle.en}](${abs(serviceHref("en", s.id))})`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
