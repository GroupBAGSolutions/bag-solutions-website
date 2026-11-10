"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { ERP_BASE, ERP_BASE_TERMS, ERP_MODULES, ERP_PACKAGES, type ErpModuleId } from "@/content/erp";
import type { Locale } from "@/i18n/config";
import { fill, type Dict } from "@/i18n/dictionaries";

type Props = { lang: Locale; t: Dict["demos"]["erp"]; title: string; contactHref: string };

/* Cotizador del ERP: Base fija + módulos adicionales + personalización total.
   Sin precios ni plazos: la selección viaja al formulario de contacto (?s=erp&m=…&x=1). */
export function ErpBuilder({ lang, t, title, contactHref }: Props) {
  const [sel, setSel] = useState<ErpModuleId[]>([]);
  const [custom, setCustom] = useState(false);
  const [msg, setMsg] = useState("");

  // Siempre en el orden del catálogo
  const order = (ids: ErpModuleId[]) => ERP_MODULES.filter((m) => ids.includes(m.id)).map((m) => m.id);
  const apply = (next: ErpModuleId[]) => {
    setSel(order(next));
    setMsg(fill(t.live, { n: next.length }));
  };
  const toggle = (id: ErpModuleId) =>
    setSel((cur) => {
      const next = order(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
      setMsg(fill(t.live, { n: next.length }));
      return next;
    });
  const same = (ids: ErpModuleId[]) => ids.length === sel.length && ids.every((id) => sel.includes(id));
  const chosen = ERP_MODULES.filter((m) => sel.includes(m.id));
  const quoteHref = `${contactHref}?s=erp&m=${sel.join(",")}${custom ? "&x=1" : ""}`;

  return (
    <div className="eq">
      <h2 className="h2 eq-title">{title}</h2>
      <div className="eq-grid">
        <div className="eq-main">
          <section className="eq-block" aria-labelledby="eq-base">
            <div className="eq-bh">
              <h3 className="h3" id="eq-base">{t.base}</h3>
              <span className="eq-inc"><Check className="ic" strokeWidth={2.2} aria-hidden /> {t.included}</span>
            </div>
            <p className="eq-lead">{t.baseLead}</p>
            <ul className="eq-base">
              {ERP_BASE.map((m) => (
                <li key={m.name.es}>
                  <Check className="ic" strokeWidth={2} aria-hidden />
                  <span>
                    <b>{m.name[lang]}</b>
                    <span>{m.desc[lang]}</span>
                  </span>
                </li>
              ))}
            </ul>
            <ul className="eq-terms">
              {ERP_BASE_TERMS[lang].map((x) => <li key={x}>{x}</li>)}
            </ul>
          </section>

          <section className="eq-block" aria-labelledby="eq-pk">
            <h3 className="h3" id="eq-pk">{t.packages}</h3>
            <div className="eq-pkgs">
              {ERP_PACKAGES.map((p) => (
                <button key={p.id} type="button" className="eq-pkg" aria-pressed={same(p.modules)} onClick={() => apply(same(p.modules) ? [] : p.modules)}>
                  <b>{p.name[lang]}</b>
                  <span>{p.audience[lang]}</span>
                  <span className="m">
                    {fill(t.packageMods, { m: p.modules.map((id) => ERP_MODULES.find((m) => m.id === id)!.name[lang]).join(" + ") })}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="eq-block" aria-labelledby="eq-mods">
            <h3 className="h3" id="eq-mods">{t.modules}</h3>
            <p className="eq-lead">{t.modulesLead}</p>
            <div className="eq-mods">
              {ERP_MODULES.map((m) => {
                const on = sel.includes(m.id);
                return (
                  <button key={m.id} type="button" className="eq-mod" aria-pressed={on} onClick={() => toggle(m.id)}>
                    <span className="eq-tick" aria-hidden>{on ? <Check className="ic" strokeWidth={2.4} /> : <Plus className="ic" strokeWidth={2} />}</span>
                    <b>{m.name[lang]}</b>
                    <span>{m.desc[lang]}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="eq-custom">
            <button type="button" className="eq-mod eq-custom" aria-pressed={custom} onClick={() => setCustom(!custom)}>
              <span className="eq-tick" aria-hidden>{custom ? <Check className="ic" strokeWidth={2.4} /> : <Plus className="ic" strokeWidth={2} />}</span>
              <b id="eq-custom">{t.custom}</b>
              <span>{t.customLead}</span>
            </button>
          </section>
        </div>

        <aside className="eq-sum" aria-labelledby="eq-sum">
          <h3 className="h3" id="eq-sum">{t.summary}</h3>
          <ul className="eq-lines">
            <li className="base"><Check className="ic" strokeWidth={2.2} aria-hidden /> {t.baseLine}</li>
            {chosen.map((m) => (
              <li key={m.id}>
                <span>{m.name[lang]}</span>
                <button type="button" aria-label={`${t.clear}: ${m.name[lang]}`} onClick={() => toggle(m.id)}>
                  <X className="ic" strokeWidth={2} aria-hidden />
                </button>
              </li>
            ))}
            {custom && (
              <li>
                <span>{t.custom}</span>
                <button type="button" aria-label={`${t.clear}: ${t.custom}`} onClick={() => setCustom(false)}>
                  <X className="ic" strokeWidth={2} aria-hidden />
                </button>
              </li>
            )}
          </ul>
          <p className="eq-count">{sel.length ? fill(t.count, { n: sel.length }) : t.none}</p>
          <Link className="btn btn-primary" href={quoteHref}>{t.request}</Link>
          {(sel.length > 0 || custom) && (
            <button type="button" className="eq-clear" onClick={() => { apply([]); setCustom(false); }}>{t.clear}</button>
          )}
          <p className="eq-note">{t.note}</p>
          <p className="sr-only" aria-live="polite">{msg}</p>
        </aside>
      </div>
    </div>
  );
}
