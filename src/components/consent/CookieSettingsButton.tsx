"use client";

import { analyticsEnabled, writeConsent } from "./store";

/** Vuelve a mostrar el banner de consentimiento (solo si hay analítica configurada). */
export function CookieSettingsButton({ label }: { label: string }) {
  if (!analyticsEnabled) return null;
  return (
    <button type="button" onClick={() => writeConsent(null)}>
      {label}
    </button>
  );
}
