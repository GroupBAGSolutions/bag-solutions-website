"use client";

export type Consent = "granted" | "denied" | null;
const KEY = "bag-consent";
const EVT = "bag-consent";

export const analyticsEnabled = Boolean(process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID);

export function readConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(v: Consent) {
  try {
    if (v) localStorage.setItem(KEY, v);
    else localStorage.removeItem(KEY);
  } catch {}
  dispatchEvent(new Event(EVT));
}

export function subscribeConsent(cb: () => void) {
  addEventListener(EVT, cb);
  addEventListener("storage", cb);
  return () => {
    removeEventListener(EVT, cb);
    removeEventListener("storage", cb);
  };
}
