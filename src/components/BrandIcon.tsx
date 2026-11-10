import { siFacebook, siInstagram, siTiktok, siWhatsapp, siX, siYoutube } from "simple-icons";

/* Logotipos oficiales de marcas (Simple Icons, CC0). Nunca sustituir por íconos genéricos. */
const ICONS = {
  whatsapp: siWhatsapp,
  instagram: siInstagram,
  facebook: siFacebook,
  x: siX,
  tiktok: siTiktok,
  youtube: siYoutube,
} as const;

export type Brand = keyof typeof ICONS;

export function BrandIcon({ name, className = "ic", brandColor = false }: { name: Brand; className?: string; brandColor?: boolean }) {
  const icon = ICONS[name];
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill={brandColor ? `#${icon.hex}` : "currentColor"}>
      <path d={icon.path} />
    </svg>
  );
}

export const brandTitle = (name: Brand) => ICONS[name].title;
