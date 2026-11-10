"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { contactSchema, SERVICE_IDS, type ContactInput } from "@/lib/contact-schema";
import { sendContact } from "@/app/actions/contact";
import { whatsappLink } from "@/content/site";
import { ERP_MODULES, isErpModule } from "@/content/erp";
import { BrandIcon } from "@/components/BrandIcon";
import type { Locale } from "@/i18n/config";
import { fill, type Dict } from "@/i18n/dictionaries";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Props = {
  lang: Locale;
  t: Dict["contact"];
  services: { id: (typeof SERVICE_IDS)[number]; name: string; tiers?: string[] }[];
  thanksHref: string;
  privacyHref: string;
};

export function ContactForm({ lang, t, services, thanksHref, privacyHref }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [failure, setFailure] = useState<string | null>(null);
  const [token, setToken] = useState<string>();
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", company: "", email: "", phone: "", services: [], message: "", lang, website: "" },
    shouldFocusError: true,
  });

  /* Selección que llega desde una página de servicio:
     ?s=crm · ?s=crm&n=1 (nivel) · ?s=erp&m=pos,cobranza&x=1 (cotizador del ERP) */
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const s = services.find((x) => x.id === q.get("s"));
    if (!s) return;
    setValue("services", [s.id]);
    const n = q.get("n");
    const tier = n === null ? undefined : s.tiers?.[Number(n)];
    let msg = "";
    if (s.id === "erp" && q.has("m")) {
      const mods = (q.get("m") ?? "").split(",").filter(isErpModule).map((id) => ERP_MODULES.find((m) => m.id === id)!.name[lang]);
      msg = t.erpMsg + (mods.length ? fill(t.erpMods, { m: mods.join(", ") }) : "") + "." + (q.get("x") === "1" ? t.erpCustom : "");
    } else if (tier) msg = fill(t.tierMsg, { t: tier, s: s.name });
    if (msg) setValue("message", msg);
  }, [setValue, services, t, lang]);

  const msg = (key?: string) => (key ? (t.errors as Record<string, string>)[key] ?? key : "");

  const onSubmit = (data: ContactInput) => {
    setFailure(null);
    if (SITE_KEY && !token) {
      setFailure(t.errors.captcha);
      return;
    }
    startTransition(async () => {
      const res = await sendContact({ ...data, token });
      if (res.ok) router.push(thanksHref);
      else {
        setFailure(res.error === "captcha" ? t.errors.captcha : t.errors.failed);
        if (res.error === "invalid") setFocus("name");
      }
    });
  };

  const field = (name: "name" | "company" | "email" | "message") => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": `e-${name}`,
  });

  return (
    <form className="ct-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="row2">
        <div className="field">
          <label htmlFor="f-name">{t.name}</label>
          <input id="f-name" autoComplete="name" placeholder={t.namePh} {...register("name")} {...field("name")} />
          <p className="err" id="e-name">{msg(errors.name?.message)}</p>
        </div>
        <div className="field">
          <label htmlFor="f-company">{t.company}</label>
          <input id="f-company" autoComplete="organization" placeholder={t.companyPh} {...register("company")} {...field("company")} />
          <p className="err" id="e-company">{msg(errors.company?.message)}</p>
        </div>
      </div>
      <div className="row2">
        <div className="field">
          <label htmlFor="f-email">{t.mail}</label>
          <input id="f-email" type="email" autoComplete="email" inputMode="email" spellCheck={false} placeholder={t.mailPh} {...register("email")} {...field("email")} />
          <p className="err" id="e-email">{msg(errors.email?.message)}</p>
        </div>
        <div className="field">
          <label htmlFor="f-phone">{t.tel} <span>{t.optional}</span></label>
          <input id="f-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder={t.telPh} {...register("phone")} />
        </div>
      </div>
      <fieldset className="field">
        <legend>{t.interests}</legend>
        <div className="chips">
          {services.map((s) => (
            <label className="chip" key={s.id}>
              <input type="checkbox" value={s.id} {...register("services")} />
              <span>{s.name}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="field">
        <label htmlFor="f-message">{t.message}</label>
        <textarea id="f-message" placeholder={t.messagePh} {...register("message")} {...field("message")} />
        <p className="err" id="e-message">{msg(errors.message?.message)}</p>
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      {SITE_KEY && (
        <Turnstile siteKey={SITE_KEY} onSuccess={setToken} onExpire={() => setToken(undefined)} options={{ language: lang, theme: "auto", size: "flexible" }} />
      )}
      {failure && (
        <p className="form-alert" role="alert">
          {failure}{" "}
          <a className="wa-link" href={whatsappLink(t.waText)} target="_blank" rel="noopener noreferrer"><BrandIcon name="whatsapp" brandColor /> WhatsApp</a>
        </p>
      )}
      <button className="btn btn-primary" type="submit" aria-busy={pending || undefined} disabled={pending}>
        {pending ? t.sending : t.send}
      </button>
      <p className="form-note">
        {t.note} <Link href={privacyHref}>{t.noteLink}</Link>.
      </p>
    </form>
  );
}
