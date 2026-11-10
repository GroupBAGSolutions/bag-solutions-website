"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { SERVICES } from "@/content/services";
import { SITE } from "@/content/site";

export type ContactResult = { ok: true } | { ok: false; error: "invalid" | "captcha" | "failed" };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function verifyTurnstile(token: string | undefined) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile opcional: sin clave no se exige
  if (!token) return false;
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
  const body = new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) });
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export async function sendContact(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const d = parsed.data;
  // Bot detectado por la trampa: respondemos ok sin enviar nada
  if (d.website) return { ok: true };
  if (!(await verifyTurnstile(d.token))) return { ok: false, error: "captcha" };

  const services = d.services.map((id) => SERVICES.find((s) => s.id === id)?.name.es ?? id).join(", ") || "—";
  const subject = `Nueva solicitud de diagnóstico · ${d.company}`;
  const rows: [string, string][] = [
    ["Nombre", d.name],
    ["Empresa", d.company],
    ["Correo", d.email],
    ["Teléfono", d.phone || "—"],
    ["Servicios", services],
    ["Idioma", d.lang.toUpperCase()],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMensaje:\n${d.message}`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#0A1428">
<h2 style="margin:0 0 16px;font-weight:600">Nueva solicitud de diagnóstico</h2>
<table style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#5E6D86">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join("")}</table>
<p style="margin:20px 0 6px;color:#5E6D86">Mensaje</p>
<p style="margin:0;white-space:pre-wrap">${esc(d.message)}</p></div>`;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Desarrollo sin API key: se registra en consola para poder probar el flujo completo
    if (process.env.NODE_ENV !== "production") {
      console.info(`[contacto] RESEND_API_KEY no configurada. Solicitud recibida:\n${text}`);
      return { ok: true };
    }
    console.error("[contacto] Falta RESEND_API_KEY en producción");
    return { ok: false, error: "failed" };
  }

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || `${SITE.name} <no-reply@groupbagsolutions.com>`,
      to: (process.env.CONTACT_TO || SITE.email).split(",").map((s) => s.trim()),
      replyTo: d.email,
      subject,
      text,
      html,
    });
    if (error) {
      console.error("[contacto] Resend:", error);
      return { ok: false, error: "failed" };
    }
    return { ok: true };
  } catch (e) {
    console.error("[contacto]", e);
    return { ok: false, error: "failed" };
  }
}
