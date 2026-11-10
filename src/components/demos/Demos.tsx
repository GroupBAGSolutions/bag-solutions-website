"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Globe, TrendingUp } from "lucide-react";
import { BrandIcon } from "@/components/BrandIcon";
import type { ServiceId } from "@/content/services";
import { numberLocale, type Locale } from "@/i18n/config";
import { fill, type Dict } from "@/i18n/dictionaries";

type D = Dict["demos"];
type Fmt = (n: number, decimals?: number) => string;

const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const makeFmt = (lang: Locale): Fmt => (n, decimals = 0) =>
  "$" + n.toLocaleString(numberLocale[lang], { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/* ---------- Utilidades ---------- */
function Shell({ title, ctrl, children }: { title: string; ctrl?: ReactNode; children: ReactNode }) {
  return (
    <div className="demo">
      <div className="demo-bar">
        <span className="demo-title">{title}</span>
        <div className="demo-ctrl">{ctrl}</div>
      </div>
      <div className="demo-body">{children}</div>
    </div>
  );
}

function Seg({ labels, value, onChange, label }: { labels: string[]; value: number; onChange: (i: number) => void; label: string }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {labels.map((l, i) => (
        <button key={l} type="button" aria-pressed={i === value} onClick={() => onChange(i)}>
          {l}
        </button>
      ))}
    </div>
  );
}

/** Número que se anima hasta su nuevo valor. */
function Tween({ value, format, dur = 450 }: { value: number; format: (n: number) => string; dur?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(value);
  useEffect(() => {
    const el = ref.current!;
    const a = from.current, b = value;
    from.current = value;
    if (reduced() || a === b) {
      el.textContent = format(b);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = format(a + (b - a) * e);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, format, dur]);
  return <span ref={ref} className="tnum">{format(value)}</span>;
}

function useLive() {
  const [msg, setMsg] = useState("");
  const node = <p className="sr-only" aria-live="polite">{msg}</p>;
  return [node, setMsg] as const;
}

/** En pantallas chicas la vista previa arranca en Móvil para que se lea. */
function useDevice() {
  const [size, setSize] = useState(0);
  useEffect(() => {
    if (matchMedia("(max-width: 767px)").matches) setSize(2); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  return [size, setSize] as const;
}

/* ---------- Ecosistemas web: sitio con tienda, por dispositivo ---------- */
function DemoShop({ t, title, fmt }: { t: D; title: string; fmt: Fmt }) {
  const [size, setSize] = useDevice();
  const [n, setN] = useState(0);
  const [sum, setSum] = useState(0);
  const [order, setOrder] = useState(1042);
  const [msg, setMsg] = useState("");
  const [bump, setBump] = useState(0);
  const [live, say] = useLive();
  return (
    <Shell title={title} ctrl={<Seg labels={t.device} value={size} onChange={setSize} label={t.deviceLabel} />}>
      <div className="dw-stage">
        <div className="dw-site" data-size={"dtm"[size]}>
          <div className="dw-nav">
            <strong>{t.shop.brand}</strong>
            <span className="dw-links">{t.shop.links.map((l) => <span key={l}>{l}</span>)}</span>
            <button className="dw-cart" type="button" tabIndex={-1}>
              {t.shop.cart} <b key={bump} className={bump ? "bump" : undefined}>{n}</b>
            </button>
          </div>
          <div className="dw-hero">
            <div>
              <p className="dw-h">{t.shop.head}</p>
              <span className="dw-cta">{t.shop.cta}</span>
            </div>
            <div className="dw-img" />
          </div>
          <div className="dw-grid">
            {t.shop.items.map(([name, price]) => (
              <div key={name}>
                <div className="dw-ph" />
                <div className="dw-row"><span>{name}</span><span>{fmt(price)}</span></div>
                <button
                  className="dw-add"
                  type="button"
                  aria-label={`${t.shop.add} ${name}`}
                  onClick={() => {
                    setN(n + 1);
                    setSum(sum + price);
                    setBump((b) => b + 1);
                    setMsg("");
                    say(fill(t.shop.live, { n: n + 1 }));
                  }}
                >
                  {t.shop.add}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="erp-foot">
        <p>{t.shop.total} <Tween value={sum} format={(v) => fmt(v)} /></p>
        <button
          className="dbtn pri"
          type="button"
          disabled={!n}
          onClick={() => {
            setMsg(fill(t.shop.paid, { o: order + 1, s: fmt(sum) }));
            setOrder(order + 1);
            setN(0);
            setSum(0);
          }}
        >
          {t.shop.pay}
        </button>
      </div>
      <p className="erp-msg" aria-live="polite">{msg}</p>
      {live}
    </Shell>
  );
}

/* ---------- CRM: mover prospectos por el embudo ---------- */
type Lead = { n: string; v: number; s: number };
const seedLeads = (): Lead[] => [
  { n: "Ferretería Lumen", v: 1200, s: 0 },
  { n: "Clínica Norte", v: 3400, s: 0 },
  { n: "Colegio Andes", v: 2150, s: 1 },
  { n: "Distribuidora Sur", v: 5800, s: 2 },
  { n: "Óptica Visión", v: 900, s: 1 },
];

function DemoCrm({ t, title, fmt }: { t: D; title: string; fmt: Fmt }) {
  const [leads, setLeads] = useState(seedLeads);
  const [moved, setMoved] = useState<string | null>(null);
  const [live, say] = useLive();
  const board = useRef<HTMLDivElement>(null);
  const S = t.crm.stages;
  const open = leads.filter((l) => l.s < S.length - 1).reduce((a, l) => a + l.v, 0);

  useEffect(() => {
    if (moved) board.current?.querySelector<HTMLElement>(`[data-n="${moved}"]`)?.focus({ preventScroll: true });
  }, [moved, leads]);

  return (
    <Shell
      title={title}
      ctrl={
        <>
          <span className="crm-sum">{t.crm.open} <span>{fmt(open)}</span></span>
          <button className="dbtn" type="button" onClick={() => { setLeads(seedLeads()); setMoved(null); }}>{t.crm.reset}</button>
        </>
      }
    >
      <div className="crm" ref={board}>
        {S.map((stage, i) => {
          const col = leads.filter((l) => l.s === i);
          const last = i === S.length - 1;
          return (
            <div className="crm-col" key={stage}>
              <div className="crm-head">{stage}<span>{col.length} · {fmt(col.reduce((a, l) => a + l.v, 0))}</span></div>
              {col.map((l) => (
                <button
                  key={l.n}
                  type="button"
                  className={`crm-card${l.n === moved ? " in" : ""}`}
                  data-n={l.n}
                  disabled={last}
                  aria-label={`${l.n}, ${fmt(l.v)}${last ? `, ${t.crm.won}` : `, ${t.crm.moveTo} ${S[i + 1]}`}`}
                  onClick={() => {
                    setLeads(leads.map((x) => (x.n === l.n ? { ...x, s: x.s + 1 } : x)));
                    setMoved(l.n);
                    say(fill(t.crm.moved, { n: l.n, s: S[i + 1] }));
                  }}
                >
                  <span className="n">{l.n}</span>
                  <span className="v">{fmt(l.v)}</span>
                  <span className="go">{last ? t.crm.closed : `${t.crm.moveTo} ${S[i + 1]} →`}</span>
                </button>
              ))}
            </div>
          );
        })}
      </div>
      {live}
    </Shell>
  );
}

/* ---------- Agentes con IA: conversación que califica al prospecto ---------- */
const CHANNEL_ICON = [
  <BrandIcon key="wa" name="whatsapp" brandColor />,
  <Globe key="web" className="ic" strokeWidth={1.8} aria-hidden />,
  <BrandIcon key="ig" name="instagram" brandColor />,
];

function DemoAi({ t, title }: { t: D; title: string }) {
  const a = t.ai;
  const [ch, setCh] = useState(0);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [live, say] = useLive();
  const log = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(undefined);
  const total = a.script.length;

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced() ? "auto" : "smooth" });
  }, [shown, typing]);

  // El cliente escribe en los turnos pares; el agente responde al momento
  const send = () => {
    if (typing || shown >= total) return;
    const reply = a.script[shown + 1];
    setShown(shown + 1);
    setTyping(true);
    timer.current = window.setTimeout(() => {
      setShown((n) => n + 1);
      setTyping(false);
      say(reply);
    }, reduced() ? 0 : 1100);
  };
  const reset = () => {
    clearTimeout(timer.current);
    setShown(0);
    setTyping(false);
  };

  const facts = [a.channels[ch], shown >= 1 && a.facts[0], shown >= 3 && a.facts[1], shown >= 3 && a.facts[2], shown >= 5 && a.facts[3]];
  const state = shown >= total ? 2 : shown >= 4 ? 1 : 0;
  const done = shown >= total && !typing;

  return (
    <Shell title={title} ctrl={<Seg labels={a.channels} value={ch} onChange={setCh} label={a.channelLabel} />}>
      <div className="ai-demo">
        <div className="ai-chat">
          <div className="ai-head">
            <span className="ai-ch">{CHANNEL_ICON[ch]}</span>
            <span>
              <strong>{a.brand}</strong>
              <span>{a.status}</span>
            </span>
          </div>
          <div className="ai-log" ref={log}>
            {a.script.slice(0, shown).map((m, i) => (
              <p key={i} className={`ai-msg ${i % 2 ? "out" : "in"}`}>{m}</p>
            ))}
            {typing && (
              <p className="ai-msg out ai-typing" role="status">
                <span className="sr-only">{a.typing}</span>
                <i /><i /><i />
              </p>
            )}
          </div>
          <div className="ai-compose">
            {done ? (
              <button className="dbtn" type="button" onClick={reset}>{a.reset}</button>
            ) : (
              <>
                <p className="ai-next" aria-label={a.composer}>{typing ? "…" : a.script[shown]}</p>
                <button className="dbtn pri" type="button" disabled={typing} onClick={send}>{a.send}</button>
              </>
            )}
          </div>
        </div>
        <div className="ai-lead">
          <p className="ai-lead-h">{a.lead}</p>
          <dl>
            {a.fields.map((f, i) => (
              <div key={f}>
                <dt>{f}</dt>
                <dd className={facts[i] ? "on" : undefined}>{facts[i] || "—"}</dd>
              </div>
            ))}
          </dl>
          <p className={`ai-state s${state}`}>
            {state > 0 && <Check className="ic" strokeWidth={2.2} aria-hidden />}
            {a.states[state]}
          </p>
          {state === 2 && <p className="ai-handed">{a.handed}</p>}
        </div>
      </div>
      {live}
    </Shell>
  );
}

/* ---------- Dashboards: indicadores por periodo ---------- */
const DASH = [
  { sales: [1840, 2210, 1960, 2480, 2930, 3320, 1450], orders: 214, goal: 2400, delta: [8.4, 5.1, 3.1], mix: [46, 34, 20] },
  { sales: [15200, 16900, 14800, 18350], orders: 871, goal: 16000, delta: [6.2, 4.0, 2.1], mix: [44, 35, 21] },
  { sales: [52, 48, 57, 61, 59, 66, 63, 70, 68, 74, 79, 92].map((k) => k * 1000), orders: 10480, goal: 65000, delta: [18.5, 11.2, 6.6], mix: [41, 37, 22] },
];

function DemoDash({ t, title, fmt, lang }: { t: D; title: string; fmt: Fmt; lang: Locale }) {
  const d = t.dash;
  const [p, setP] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const data = DASH[p];
  const total = data.sales.reduce((s, v) => s + v, 0);
  const ticket = total / data.orders;
  const max = Math.max(...data.sales, data.goal) * 1.1;
  const kpis = [total, data.orders, ticket];
  const pctFmt = (n: number) => n.toLocaleString(numberLocale[lang], { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " %";
  const fmts = [(v: number) => fmt(v), (v: number) => Math.round(v).toLocaleString(numberLocale[lang]), (v: number) => fmt(v, 2)];

  return (
    <Shell title={title} ctrl={<Seg labels={d.periods} value={p} onChange={(i) => { setP(i); setHover(null); }} label={d.periodLabel} />}>
      <div className="db">
        <div className="db-kpis">
          {d.kpis.map((k, i) => (
            <div className="db-kpi" key={k}>
              <span className="k">{k}</span>
              <b><Tween value={kpis[i]} format={fmts[i]} /></b>
              <span className="d"><TrendingUp className="ic" strokeWidth={2} aria-hidden /> +{pctFmt(data.delta[i])} <span>{d.vs}</span></span>
            </div>
          ))}
        </div>
        <div className="db-row">
          <figure className="db-card db-chart">
            <figcaption>{d.chart}</figcaption>
            <div className="db-plot">
              <div className="db-area" onPointerLeave={() => setHover(null)}>
                <div className="db-goal" style={{ bottom: `${(data.goal / max) * 100}%` }}>
                  <span>{d.goal} {fmt(data.goal)}</span>
                </div>
                {data.sales.map((v, i) => {
                  const h = (v / max) * 100;
                  return (
                    <div
                      key={`${p}-${i}`}
                      className={`db-col${hover === i ? " on" : ""}`}
                      onPointerEnter={() => setHover(i)}
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      {hover === i && <span className="db-tip" style={{ bottom: `calc(${h}% + 6px)` }}>{d.axis[p][i]} · {fmt(v)}</span>}
                      <span className="db-bar" style={{ height: `${h}%` }} />
                      <span className="db-x">{d.axis[p][i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="sr-only">{fill(d.summary, { p: d.periods[p], v: fmt(total), o: data.orders.toLocaleString(numberLocale[lang]), t: fmt(ticket, 2) })}</p>
          </figure>
          <figure className="db-card db-mix">
            <figcaption>{d.mix}</figcaption>
            <ul>
              {d.channels.map((c, i) => (
                <li key={c}>
                  <span className="l">{c}</span>
                  <span className="v tnum">{data.mix[i]} %</span>
                  <span className="track"><span style={{ width: `${data.mix[i]}%` }} /></span>
                </li>
              ))}
            </ul>
          </figure>
        </div>
        <p className="demo-note db-upd">{d.updated}</p>
      </div>
    </Shell>
  );
}

/* ---------- Automatización: flujo de aprobación de facturas ---------- */
type StepState = { cls: "" | "run" | "done" | "wait"; k: string };

function DemoAuto({ t, title, fmt }: { t: D; title: string; fmt: Fmt }) {
  const a = t.auto;
  const [autoOn, setAutoOn] = useState(true);
  const [busy, setBusy] = useState(false);
  const [steps, setSteps] = useState<StepState[]>(() => a.steps.map(() => ({ cls: "", k: a.waiting })));
  const [log, setLog] = useState<{ id: number; time: string; text: string }[]>([]);
  const [approve, setApprove] = useState<(() => void) | null>(null);
  const st = useRef({ k: 0, n: 2291, sec: 0, id: 0 });
  const approveBtn = useRef<HTMLButtonElement>(null);
  const amounts = [320, 780, 145, 1260, 460];

  useEffect(() => {
    if (approve) approveBtn.current?.focus({ preventScroll: true });
  }, [approve]);

  const stamp = () => {
    const s = st.current;
    s.sec += 3 + Math.floor(Math.random() * 5);
    const total = 41 * 60 + s.sec;
    return `09:${String(Math.floor(total / 60) % 60).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  };
  const add = (text: string) => setLog((l) => [...l, { id: ++st.current.id, time: stamp(), text }].slice(-3));
  const set = (i: number, cls: StepState["cls"], k: string) => setSteps((s) => s.map((x, j) => (j === i ? { cls, k } : x)));
  const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced() ? 0 : ms));

  const run = async () => {
    if (busy) return;
    setBusy(true);
    const s = st.current;
    const amt = amounts[s.k++ % amounts.length], id = `F-${++s.n}`;
    setSteps(a.steps.map(() => ({ cls: "", k: a.waiting })));
    setLog([]);
    for (let i = 0; i < a.steps.length; i++) {
      set(i, "run", a.running);
      await wait(650);
      if (i === 0) add(fill(a.received, { id, amt: fmt(amt) }));
      if (i === 1) add(a.read);
      if (i === 2) {
        if (autoOn && amt < 500) add(a.autoOk);
        else {
          set(i, "wait", a.needsApproval);
          add(a.over);
          await new Promise<void>((r) => setApprove(() => r));
          setApprove(null);
          add(a.approved);
        }
      }
      if (i === 3) add(a.posted);
      set(i, "done", a.done);
    }
    setBusy(false);
  };

  return (
    <Shell
      title={title}
      ctrl={
        <>
          <button className="dbtn" type="button" aria-pressed={autoOn} onClick={() => setAutoOn(!autoOn)}>{a.autoApprove}</button>
          <button className="dbtn pri" type="button" disabled={busy} onClick={run}>{a.run}</button>
        </>
      }
    >
      <div className="au-steps">
        {a.steps.map((label, i) => (
          <div key={label} className={`au-step ${steps[i].cls}`}>
            <span className="k">{steps[i].k}</span>
            <span className="t">{label}</span>
            {i === 2 && approve && (
              <button ref={approveBtn} className="dbtn" type="button" onClick={approve}>{a.approve}</button>
            )}
          </div>
        ))}
      </div>
      <div className="au-log" aria-live="polite">
        {log.length === 0 ? (
          <p><time>--:--:--</time>{a.start}</p>
        ) : (
          log.map((l) => <p key={l.id} className="new"><time>{l.time}</time>{l.text}</p>)
        )}
      </div>
    </Shell>
  );
}

/** El ERP no usa demo: su página muestra el cotizador por módulos (ErpBuilder). */
export function ServiceDemo({ id, lang, t, title }: { id: Exclude<ServiceId, "erp">; lang: Locale; t: D; title: string }) {
  const fmt = makeFmt(lang);
  switch (id) {
    case "web":
      return <DemoShop t={t} title={title} fmt={fmt} />;
    case "ai":
      return <DemoAi t={t} title={title} />;
    case "crm":
      return <DemoCrm t={t} title={title} fmt={fmt} />;
    case "auto":
      return <DemoAuto t={t} title={title} fmt={fmt} />;
    case "dash":
      return <DemoDash t={t} title={title} fmt={fmt} lang={lang} />;
  }
}
