"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { analyticsEnabled, readConsent, subscribeConsent, writeConsent } from "./store";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Fbq = (...args: unknown[]) => void;
declare global {
  interface Window {
    fbq?: Fbq;
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Consent Mode v2 en modo básico: GA4 y Meta Pixel solo se cargan después de aceptar.
 * Sin IDs configurados no se muestra banner ni se carga nada.
 */
export function Analytics({ t, cookiesHref }: { t: { text: string; more: string; accept: string; reject: string }; cookiesHref: string }) {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => "denied" as const);
  const pathname = usePathname();
  const first = useRef(true);

  // Meta Pixel: PageView en cada navegación del cliente (GA4 lo hace solo con la medición mejorada)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (consent === "granted") window.fbq?.("track", "PageView");
  }, [pathname, consent]);

  if (!analyticsEnabled) return null;

  return (
    <>
      {consent === null && (
        <div className="consent" role="region" aria-label="Cookies">
          <p>
            {t.text} <Link href={cookiesHref}>{t.more}</Link>
          </p>
          <div className="consent-actions">
            <button type="button" className="btn btn-primary" onClick={() => writeConsent("granted")}>
              {t.accept}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => writeConsent("denied")}>
              {t.reject}
            </button>
          </div>
        </div>
      )}
      {consent === "granted" && GA_ID && (
        <>
          <Script id="ga-consent" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
gtag('consent','default',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'denied'});
gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        </>
      )}
      {consent === "granted" && PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
