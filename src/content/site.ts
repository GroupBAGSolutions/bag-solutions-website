import type { Brand } from "@/components/BrandIcon";

export const SITE = {
  name: "BAG Solutions",
  legalName: "Group BAG Solutions",
  rif: "J-508918630",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://groupbagsolutions.com").replace(/\/$/, ""),
  email: "info@groupbagsolutions.com",
  phone: "+584121596626",
  phoneDisplay: "+58 412 159 6626",
  city: "Valencia",
  region: "Carabobo",
  country: "VE",
  countryName: { es: "Venezuela", en: "Venezuela" },
  foundingLocation: "Valencia, Carabobo, Venezuela",
  /* Redes: vacías hasta que existan; al completarlas aparecen en el footer con su logo oficial
     y en sameAs del JSON-LD. Ej.: { network: "instagram", url: "https://instagram.com/..." } */
  social: [] as { network: Brand; url: string }[],
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${SITE.phone.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
