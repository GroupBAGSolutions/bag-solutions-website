import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} · Software a la medida`,
    short_name: "BAG",
    description: "CRM, ERP, sitios web, ecommerce y automatización de procesos a medida.",
    start_url: "/es",
    scope: "/",
    display: "standalone",
    background_color: "#F4F6F9",
    theme_color: "#0E74E1",
    lang: "es",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
