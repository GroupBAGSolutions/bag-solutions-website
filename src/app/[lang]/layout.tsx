import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Figtree, Martian_Mono, Michroma } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { Analytics } from "@/components/consent/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { isLocale, locales } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { href } from "@/i18n/paths";
import { SITE } from "@/content/site";
import { organizationLd, websiteLd } from "@/lib/seo";

const figtree = Figtree({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--font-figtree", display: "swap" });
const martian = Martian_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-martian", display: "swap" });
const michroma = Michroma({ subsets: ["latin"], weight: "400", variable: "--font-michroma", display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F6F9" },
    { media: "(prefers-color-scheme: dark)", color: "#020A1A" },
  ],
  colorScheme: "light dark",
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDict(lang);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t.meta.title, template: `%s · ${SITE.name}` },
    description: t.meta.description,
    applicationName: SITE.name,
    authors: [{ name: SITE.legalName, url: SITE.url }],
    creator: SITE.legalName,
    publisher: SITE.legalName,
    formatDetection: { telephone: false, email: false, address: false },
    category: "technology",
    verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);

  return (
    <html lang={lang} suppressHydrationWarning className={`${figtree.variable} ${martian.variable} ${michroma.variable}`}>
      <body>
        <Providers>
          <a className="skip" href="#contenido">
            {t.a11y.skip}
          </a>
          <Header lang={lang} t={{ nav: t.nav, a11y: t.a11y }} />
          <main id="contenido" tabIndex={-1}>
            {children}
          </main>
          <Footer lang={lang} t={t} />
          <MotionRoot />
          <Analytics t={t.consent} cookiesHref={href(lang, "cookies")} />
        </Providers>
        <JsonLd data={[organizationLd(lang), websiteLd(lang)]} />
      </body>
    </html>
  );
}
