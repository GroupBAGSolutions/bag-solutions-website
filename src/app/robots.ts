import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

/* Se publica como /robots.txt. En entornos de vista previa (VERCEL_ENV=preview) se bloquea todo.
   Gracias se excluye con noindex (no con disallow) para que Google pueda leer la directiva. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
