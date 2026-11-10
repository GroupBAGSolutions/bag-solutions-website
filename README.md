<div align="center">

# BAG Solutions · Sitio web

Sitio corporativo bilingüe (ES/EN) de **Group BAG Solutions**: tecnología a la medida para vender en línea, atender más rápido y ordenar la operación.

[groupbagsolutions.com](https://groupbagsolutions.com)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## Contenido

- [Qué incluye](#qué-incluye)
- [Stack](#stack)
- [Puesta en marcha](#puesta-en-marcha)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Rutas e idiomas](#rutas-e-idiomas)
- [Cómo editar el contenido](#cómo-editar-el-contenido)
- [Formulario de contacto](#formulario-de-contacto)
- [SEO](#seo)
- [Analítica y consentimiento](#analítica-y-consentimiento)
- [Flujo de trabajo con Git](#flujo-de-trabajo-con-git)
- [Calidad y despliegue](#calidad-y-despliegue)
- [Pendientes](#pendientes)

## Qué incluye

- **Seis servicios del catálogo 2026** en tres pilares, cada uno con su página, demo interactiva, niveles (Esencial · Profesional · Empresarial) y preguntas frecuentes.
- **Cotizador del ERP por módulos**: ERP Base, 10 módulos adicionales, 3 paquetes sugeridos y personalización total. La selección viaja al formulario de contacto, sin precios publicados.
- **Demos interactivas** con datos de ejemplo: tienda en línea, agente de IA, CRM, automatización de procesos y tablero gerencial.
- **Bilingüe desde el lanzamiento**, con rutas traducidas, `hreflang` y selector de idioma.
- **Blog y páginas legales en MDX**.
- **Tema claro/oscuro**, animaciones con Anime.js y scroll suave con Lenis. Todo respeta `prefers-reduced-motion`.
- **Todo estático (SSG)**: cada página se genera al compilar.

| Serie | Pilar | Servicios |
|---|---|---|
| 100 | Presencia digital | Ecosistemas web |
| 200 | Ventas inteligentes | Agentes de comercialización con IA · CRM |
| 300 | Operación y datos | ERP · Automatización de procesos internos · Dashboards interactivos |

## Stack

| Área | Herramientas |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, React Compiler) · React 19 |
| Estilos | Tailwind CSS 4 · `@tailwindcss/typography` · tokens propios para tema claro/oscuro |
| Animación | Anime.js 4 · Lenis |
| Contenido | MDX (`@next/mdx` + `remark-gfm`) |
| Formularios | React Hook Form · Zod 4 · Server Actions · Resend · Cloudflare Turnstile |
| UI | lucide-react · simple-icons (logos oficiales de WhatsApp y redes) · next-themes |
| SEO | Metadata API · `schema-dts` (JSON-LD tipado) · `ImageResponse` (imágenes OG) |

## Puesta en marcha

**Requisitos:** Node.js 20.9 o superior (probado con Node 24) y npm.

```bash
git clone https://github.com/GroupBAGSolutions/bag-solutions-website.git
cd bag-solutions-website
npm ci
cp .env.example .env.local
npm run dev
```

El sitio queda en <http://localhost:3000>, y `/` redirige a `/es` o `/en` según el idioma del navegador.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con Turbopack |
| `npm run build` | Compilación de producción y generación estática |
| `npm run start` | Sirve la compilación de producción |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Comprobación de tipos |

## Variables de entorno

Copia `.env.example` a `.env.local`. **Ninguna es obligatoria para desarrollar**: si falta alguna, la función correspondiente queda desactivada sin romper el sitio.

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio. La usan los canonical, el sitemap y Open Graph. Por defecto: `https://groupbagsolutions.com` |
| `RESEND_API_KEY` | Clave de [Resend](https://resend.com) para enviar el formulario por correo |
| `RESEND_FROM` | Remitente de los correos, con un dominio verificado en Resend |
| `CONTACT_TO` | Buzón que recibe las solicitudes |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Captcha de Cloudflare Turnstile (opcional) |
| `NEXT_PUBLIC_GA_ID` | ID de Google Analytics 4 (opcional) |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID del Meta Pixel (opcional) |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Verificación de Google Search Console por meta tag (opcional) |

> [!IMPORTANT]
> Sin `RESEND_API_KEY`, en desarrollo el formulario muestra la solicitud en la consola y responde como enviada. En producción devuelve un error y ofrece WhatsApp como alternativa.

## Estructura del proyecto

```text
src/
├── app/
│   ├── [lang]/                 # Todas las páginas, con el idioma como primer segmento
│   │   ├── servicios/[slug]/   # Página de cada servicio (demo, niveles, FAQ)
│   │   ├── blog/[slug]/        # Artículos MDX
│   │   ├── contacto/ gracias/ nosotros/ privacidad/ terminos/ cookies/
│   │   ├── opengraph-image.tsx # Imagen para compartir, por idioma
│   │   └── layout.tsx          # Layout raíz: fuentes, encabezado, pie y JSON-LD
│   ├── actions/contact.ts      # Server Action del formulario (Resend + Turnstile)
│   ├── sitemap.ts  robots.ts  manifest.ts  llms.txt/  icon.svg  apple-icon.tsx
│   └── globals.css             # Sistema de diseño: tokens, componentes y demos
├── components/                 # Layout, secciones del inicio, ilustraciones, demos, formulario
├── content/
│   ├── services.ts             # Los 6 servicios: textos ES/EN, niveles y FAQ
│   ├── erp.ts                  # Cotizador: módulos base, adicionales y paquetes
│   ├── site.ts                 # Marca, RIF, contacto y redes sociales
│   ├── posts.ts                # Metadatos del blog
│   └── blog/ legal/            # Cuerpos MDX por idioma
├── i18n/                       # Idiomas, rutas traducidas y textos de la interfaz
├── lib/                        # SEO, validación del formulario y utilidades
└── proxy.ts                    # Redirección por idioma y reescritura de rutas en inglés
```

## Rutas e idiomas

Cada URL lleva el prefijo del idioma. En inglés, los segmentos traducidos se reescriben en `src/proxy.ts` hacia las mismas páginas, así que no hay código duplicado.

| Página | Español | Inglés |
|---|---|---|
| Inicio | `/es` | `/en` |
| Servicios | `/es/servicios` | `/en/services` |
| Servicio | `/es/servicios/erp-a-medida` | `/en/services/custom-erp` |
| Nosotros | `/es/nosotros` | `/en/about` |
| Blog | `/es/blog` | `/en/blog` |
| Contacto | `/es/contacto` | `/en/contact` |
| Legales | `/es/privacidad` · `/es/terminos` · `/es/cookies` | `/en/privacy` · `/en/terms` · `/en/cookies` |

Una ruta sin idioma redirige según `Accept-Language`, y un segmento en el idioma equivocado redirige (308) al correcto. El selector de idioma conserva la página actual, incluidos los slugs traducidos de servicios y artículos.

## Cómo editar el contenido

| Quiero cambiar… | Archivo |
|---|---|
| Nombre, frase, descripción, niveles o FAQ de un servicio | `src/content/services.ts` |
| Módulos y paquetes del ERP | `src/content/erp.ts` |
| Textos de la interfaz (menú, botones, secciones, demos) | `src/i18n/messages/es.ts` y `en.ts` |
| Correo, teléfono, RIF o redes sociales | `src/content/site.ts` |
| Páginas legales | `src/content/legal/{es,en}/*.mdx` |

`en.ts` tiene el tipo de `es.ts`, así que TypeScript avisa si falta una traducción. Las redes sociales se agregan en `SITE.social`: aparecen en el pie con su logo oficial y en el `sameAs` del JSON-LD.

**Para publicar un artículo:**

1. Escribe el cuerpo en `src/content/blog/es/<id>.mdx` y `src/content/blog/en/<id>.mdx`.
2. Agrega los metadatos (slugs, título, descripción, fecha y servicio relacionado) en `src/content/posts.ts`.
3. Registra los dos imports en `src/content/post-loaders.ts`.

El sitemap, el `hreflang` y el JSON-LD `BlogPosting` se generan solos.

## Formulario de contacto

- Validación compartida entre cliente y servidor con Zod. Los mensajes de error están traducidos y el foco salta al primer campo con error.
- Envío con una Server Action a través de Resend, con `replyTo` del visitante.
- Protección anti-spam con un campo trampa (honeypot) y Turnstile opcional.
- Tras enviar, lleva a `/gracias` (`noindex`), con un botón para continuar por WhatsApp.
- Las páginas de servicio rellenan el formulario mediante la URL:

| Parámetro | Ejemplo | Resultado |
|---|---|---|
| `s` | `?s=crm` | Marca el servicio |
| `n` | `?s=ai&n=1` | Escribe «Me interesa el nivel Profesional de…» |
| `m`, `x` | `?s=erp&m=pos,cobranza&x=1` | Escribe la cotización del ERP con sus módulos y la personalización total |

## SEO

- Metadata por página con canonical, `hreflang` (incluido `x-default`), Open Graph y Twitter Cards.
- Imagen Open Graph generada por idioma, con favicon, `apple-icon` y manifest.
- JSON-LD: `Organization` (con `taxID`), `WebSite`, `Service`, `FAQPage`, `BreadcrumbList` y `BlogPosting`.
- `sitemap.xml` con alternativas por idioma, `robots.txt` y `llms.txt` para asistentes de IA.
- En las vistas previas de Vercel (`VERCEL_ENV=preview`), `robots.txt` bloquea la indexación.
- Encabezados de seguridad (HSTS, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) definidos en `next.config.ts`.

## Analítica y consentimiento

GA4 y el Meta Pixel se cargan **solo después de que el visitante acepta** el banner, con Consent Mode v2 en modo básico. Si no hay IDs configurados, no se muestra el banner ni se carga ningún script. Las preferencias se pueden cambiar desde el pie de página.

## Flujo de trabajo con Git

| Rama | Rol | Cómo recibe cambios |
|---|---|---|
| `main` | Producción | **Solo mediante PR desde `dev`** |
| `dev` | Integración | **Solo mediante PR** desde ramas de trabajo |

1. Crea tu rama desde `dev`, por ejemplo `feat/…`, `fix/…`, `docs/…` o `chore/…`.
2. Abre un PR hacia `dev`.
3. Para publicar, abre un PR de `dev` hacia `main`.

No se hace push directo a `main` ni a `dev`, ni se fuerza su historial. El check **«PR a main solo desde dev»** (`.github/workflows/main-desde-dev.yml`) marca en rojo cualquier PR hacia `main` que no venga de `dev`.

## Calidad y despliegue

Antes de publicar, ejecuta:

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Lo recomendado es desplegar en **Vercel**:

1. Importa el repositorio en Vercel. Detecta Next.js automáticamente.
2. Carga las variables de entorno de producción (como mínimo `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `RESEND_FROM` y `CONTACT_TO`).
3. Conecta el dominio `groupbagsolutions.com` y verifica ese dominio en Resend (SPF/DKIM).
4. Envía `https://groupbagsolutions.com/sitemap.xml` a Google Search Console.

## Pendientes

- [ ] Tiempos de desarrollo por nivel y por módulo del ERP
- [ ] Logo oficial en SVG (el sitio usa una marca provisional)
- [ ] API key de Resend y verificación del dominio
- [ ] IDs de GA4 y Meta Pixel
- [ ] Revisión legal de privacidad, términos y cookies
- [ ] Redes sociales oficiales

---

© Group BAG Solutions · RIF J-508918630. Todos los derechos reservados. Código privado: no se permite su uso, copia ni distribución sin autorización.
