"use client";

import { useEffect, useRef } from "react";
import { animate, createDrawable, createMotionPath, createScope, createTimeline, stagger, utils, type Timeline } from "animejs";
import type { ServiceId } from "@/content/services";

type Labels = { crm: string[]; erp: string[]; auto: string[]; ai: string[]; dash: string[] };

// Dashboards: avance por área frente a su meta, en tres periodos
const DASH_V = [[0.62, 0.48, 0.71], [0.84, 0.66, 0.58], [0.76, 0.9, 0.68]];
const DASH_GOAL = [0.8, 0.7, 0.75];
const DASH_Y = [92, 134, 176];
const pct = (v: number) => `${Math.round(v * 100)}%`;

/* Ciclos cortos que explican cada servicio. Terminan en el mismo estado en que empiezan
   y se pausan fuera de pantalla. */
const BUILD: Record<ServiceId, (s: SVGSVGElement) => Timeline> = {
  web(s) {
    const blk = [...s.querySelectorAll(".blk")], cur = s.querySelector(".cursor")!, btn = s.querySelector(".w-btn")!;
    utils.set(blk, { opacity: 0, y: 10 });
    return createTimeline({ loop: true, loopDelay: 500 })
      .add(blk, { opacity: [0, 1], y: [10, 0], duration: 600, delay: stagger(80), ease: "outExpo" }, 300)
      .add(cur, { opacity: [0, 1], x: [340, 340], y: [236, 236], duration: 200 }, 1000)
      .add(cur, { x: [340, 104], y: [236, 150], duration: 1000, ease: "inOutQuad" }, 1200)
      .add(btn, { scale: 0.9, duration: 140, ease: "outQuad" }, 2200)
      .add(btn, { scale: 1, duration: 260, ease: "outBack(2)" }, 2340)
      .add(blk, { opacity: [1, 0], y: [0, -6], duration: 400, delay: stagger(30), ease: "inQuad" }, 3800)
      .add(cur, { opacity: [1, 0], duration: 300 }, 3800);
  },
  ai(s) {
    const q = (sel: string) => [...s.querySelectorAll(sel)];
    const [b1, b2, b3] = q(".ai-b"), vals = q(".ai-v"), typing = q(".ai-typing"), dots = q(".ai-dot"), ok = q(".ai-ok"), pk = q(".ai-pk");
    const { translateX, translateY } = createMotionPath(s.querySelector<SVGPathElement>(".ai-path")!);
    utils.set([b1, b2, b3, ...typing, ...ok], { opacity: 0 });
    utils.set(vals, { scaleX: 0 });
    const tl = createTimeline({ loop: true, loopDelay: 400 })
      .add(b1, { opacity: [0, 1], y: [8, 0], duration: 450, ease: "outExpo" }, 300)
      .add(b2, { opacity: [0, 1], y: [8, 0], duration: 450, ease: "outExpo" }, 1000)
      .add(b3, { opacity: [0, 1], y: [8, 0], duration: 450, ease: "outExpo" }, 1700)
      .add(typing, { opacity: [0, 1], duration: 250 }, 2200)
      .add(dots, { y: [0, -3, 0], duration: 500, delay: stagger(120), ease: "inOutSine" }, 2300)
      .add(dots, { y: [0, -3, 0], duration: 500, delay: stagger(120), ease: "inOutSine" }, 2950);
    // Cada respuesta del cliente alimenta la ficha del prospecto
    [600, 2000].forEach((t0) => {
      tl.add(pk, { opacity: [0, 1], duration: 120 }, t0)
        .add(pk, { translateX, translateY, duration: 500, ease: "inOutSine" }, t0)
        .add(pk, { opacity: [1, 0], duration: 120 }, t0 + 420);
    });
    return tl
      .add(vals[0], { scaleX: [0, 1], duration: 600, ease: "outExpo" }, 1100)
      .add(vals.slice(1), { scaleX: [0, 1], duration: 600, delay: stagger(140), ease: "outExpo" }, 2500)
      .add(ok, { opacity: [0, 1], scale: [0.85, 1], duration: 450, ease: "outBack(2)" }, 3000)
      .add([b1, b2, b3, ...typing, ...ok], { opacity: 0, duration: 400, ease: "inQuad" }, 5000)
      .add(vals, { scaleX: 0, duration: 400, ease: "inQuad" }, 5000);
  },
  dash(s) {
    const bars = [...s.querySelectorAll(".dh-bar")], vals = [...s.querySelectorAll(".dh-val")], tab = s.querySelector(".dh-tab")!;
    bars.forEach((b, i) => utils.set(b, { scaleX: DASH_V[0][i] }));
    const tl = createTimeline({ loop: true, loopDelay: 1600 });
    [1, 2, 0].forEach((p, k) => {
      const t0 = 1600 + k * 2000;
      tl.add(tab, { translateX: p * 40, duration: 450, ease: "outExpo" }, t0);
      bars.forEach((b, i) => tl.add(b, { scaleX: DASH_V[p][i], duration: 800, ease: "inOutQuad" }, t0 + 80 + i * 90));
      tl.call(() => vals.forEach((v, i) => (v.textContent = pct(DASH_V[p][i]))), t0 + 300);
    });
    return tl;
  },
  crm(s) {
    const mv = s.querySelector(".crm-mv")!, won = s.querySelector(".crm-won")!, prog = s.querySelector(".crm-prog")!;
    utils.set(mv, { opacity: 0 });
    utils.set(prog, { scaleX: 0.45 });
    return createTimeline({ loop: true, loopDelay: 300 })
      .add(mv, { opacity: [0, 1], x: [0, 0], duration: 300 }, 200)
      .add(mv, { x: [0, 94], duration: 650, ease: "outExpo" }, 700)
      .add(mv, { x: [94, 188], duration: 650, ease: "outExpo" }, 1500)
      .add(mv, { x: [188, 282], duration: 650, ease: "outExpo" }, 2300)
      .add(won, { opacity: [0, 1], duration: 300 }, 2500)
      .add(prog, { scaleX: [0.45, 0.8], duration: 900, ease: "outExpo" }, 2500)
      .add(mv, { opacity: [1, 0], duration: 300 }, 4300)
      .add(prog, { scaleX: [0.8, 0.45], duration: 600, ease: "inOutQuad" }, 4300)
      .add(won, { opacity: [1, 0], duration: 50 }, 4600);
  },
  erp(s) {
    const paths = [...s.querySelectorAll<SVGPathElement>(".erp-c")], ps = [...s.querySelectorAll(".erp-p")];
    const ring = s.querySelector(".erp-ring")!, hub = s.querySelector(".erp-hub")!;
    const tl = createTimeline({ loop: true, loopDelay: 500 });
    ps.forEach((p, i) => {
      const { translateX, translateY } = createMotionPath(paths[i]);
      const t0 = 300 + i * 260;
      tl.add(p, { opacity: [0, 1], duration: 150 }, t0)
        .add(p, { translateX, translateY, duration: 900, ease: "inOutSine" }, t0)
        .add(p, { opacity: [1, 0], duration: 150 }, t0 + 800);
    });
    const end = 300 + 3 * 260 + 900;
    return tl
      .add(ring, { opacity: [0.9, 0], scale: [1, 1.4], duration: 800, ease: "outExpo" }, end)
      .add(hub, { scale: 0.93, duration: 150, ease: "outQuad" }, end)
      .add(hub, { scale: 1, duration: 400, ease: "outBack(2)" }, end + 150);
  },
  auto(s) {
    const pk = s.querySelector(".au-pk")!;
    const hl = (k: string) => s.querySelector(`[data-hl="${k}"]`)!;
    const tl = createTimeline({ loop: true, loopDelay: 300 });
    const run = (path: string, end: string, t: number) => {
      const { translateX, translateY } = createMotionPath(s.querySelector<SVGPathElement>(path)!);
      tl.add(hl("n1"), { opacity: [0, 1], duration: 250 }, t)
        .add(pk, { opacity: [0, 1], duration: 150 }, t + 200)
        .add(pk, { translateX, translateY, duration: 1800, ease: "inOutSine" }, t + 200)
        .add(hl("n2"), { opacity: [0, 1], duration: 250 }, t + 840)
        .add(hl("dm"), { opacity: [0, 1], duration: 250 }, t + 1190)
        .add(hl(end), { opacity: [0, 1], duration: 250 }, t + 1950)
        .add(pk, { opacity: [1, 0], duration: 200 }, t + 2000)
        .add([hl("n1"), hl("n2"), hl("dm"), hl(end)], { opacity: [1, 0], duration: 400 }, t + 2900);
    };
    run(".au-up", "n4", 0);
    run(".au-dn", "n5", 3500);
    return tl;
  },
};

export function Ill({ kind, labels }: { kind: ServiceId; labels: Labels }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scope = createScope({ root: svg }).add(() => {
      const drawables = createDrawable([...svg.querySelectorAll<SVGGeometryElement>("[data-draw]")]);
      utils.set(drawables, { draw: "0 0" });
      let tl: Timeline | null = null;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            if (!tl) {
              animate(drawables, { draw: ["0 0", "0 1"], duration: 1100, delay: stagger(70), ease: "inOutQuad" });
              tl = BUILD[kind](svg);
            } else tl.play();
          } else tl?.pause();
        },
        { threshold: 0.25 },
      );
      io.observe(svg);
      return () => io.disconnect();
    });
    return () => scope.revert();
  }, [kind]);

  const common = { ref, className: "ill", viewBox: "0 0 400 250", "aria-hidden": true, focusable: false } as const;

  if (kind === "crm") {
    const [c1, c2, c3, c4, goal] = labels.crm;
    return (
      <svg {...common}>
        {[22, 116, 210, 304].map((x) => (
          <rect key={x} className="fl ln" data-draw="" x={x} y="26" width="74" height="180" rx="8" />
        ))}
        <text className="lbl lbl-s" x="31" y="45">{c1}</text>
        <text className="lbl lbl-s" x="125" y="45">{c2}</text>
        <text className="lbl lbl-s" x="219" y="45">{c3}</text>
        <text className="lbl lbl-s" x="313" y="45">{c4}</text>
        {[
          [30, 58, 28], [30, 94, 22], [124, 58, 26], [124, 94, 20], [218, 58, 28],
        ].map(([x, y, w]) => (
          <g key={`${x}-${y}`}>
            <rect className="fl2 ln" x={x} y={y} width="58" height="28" rx="5" />
            <circle className="mut" cx={x + 12} cy={y + 14} r="5" />
            <rect className="mut" x={x + 22} y={y + 11} width={w} height="6" rx="3" />
          </g>
        ))}
        {[[312, 58, 24], [312, 94, 28]].map(([x, y, w]) => (
          <g key={`${x}-${y}`}>
            <rect className="fl2 ln-acc" x={x} y={y} width="58" height="28" rx="5" />
            <circle className="acc" cx={x + 12} cy={y + 14} r="5" />
            <rect className="mut" x={x + 22} y={y + 11} width={w} height="6" rx="3" />
          </g>
        ))}
        <g className="crm-mv">
          <rect className="fl2 ln-acc" x="30" y="130" width="58" height="28" rx="5" />
          <rect className="soft crm-won" x="30" y="130" width="58" height="28" rx="5" opacity="0" />
          <circle className="acc" cx="42" cy="144" r="5" />
          <rect className="ink" x="52" y="141" width="28" height="6" rx="3" />
        </g>
        <rect className="mut" x="22" y="222" width="356" height="6" rx="3" opacity=".6" />
        <rect className="acc crm-prog" x="22" y="222" width="356" height="6" rx="3" style={{ transform: "scaleX(.62)" }} />
        <text className="lbl" x="22" y="244">{goal}</text>
      </svg>
    );
  }

  if (kind === "erp") {
    const boxes: [number, number, string, number][] = [
      [24, 26, labels.erp[0], 52], [276, 26, labels.erp[1], 44], [24, 172, labels.erp[2], 48], [276, 172, labels.erp[3], 56],
    ];
    return (
      <svg {...common}>
        <path className="ln erp-c" data-draw="" d="M124 52H148V112H170" />
        <path className="ln erp-c" data-draw="" d="M276 52H252V112H230" />
        <path className="ln erp-c" data-draw="" d="M124 198H148V138H170" />
        <path className="ln erp-c" data-draw="" d="M276 198H252V138H230" />
        {boxes.map(([x, y, label, w]) => (
          <g key={label}>
            <rect className="fl ln" data-draw="" x={x} y={y} width="100" height="52" rx="8" />
            <text className="lbl-in" x={x + 14} y={y + 22}>{label}</text>
            <rect className="mut" x={x + 14} y={y + 32} width={w} height="6" rx="3" />
            <rect className="acc" x={x + 80} y={y + 12} width="7" height="7" rx="1.5" />
          </g>
        ))}
        <rect className="erp-ring ln-acc" x="170" y="95" width="60" height="60" rx="12" fill="none" opacity="0" />
        <g className="erp-hub">
          <rect className="soft" x="170" y="95" width="60" height="60" rx="12" />
          <rect className="ln-acc" x="170" y="95" width="60" height="60" rx="12" fill="none" />
          <g transform="translate(187 115.5)" className="acc">
            <rect x="7" y="0" width="5" height="5" rx="1" />
            <rect x="14" y="0" width="5" height="5" rx="1" opacity=".7" />
            <rect x="0" y="7" width="5" height="5" rx="1" opacity=".55" />
            <rect x="7" y="7" width="5" height="5" rx="1" opacity=".85" />
            <rect x="21" y="7" width="5" height="5" rx="1" />
            <rect x="14" y="14" width="5" height="5" rx="1" opacity=".7" />
            <rect x="21" y="14" width="5" height="5" rx="1" opacity=".9" />
          </g>
        </g>
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} className="acc mv erp-p" r="3.5" />
        ))}
      </svg>
    );
  }

  if (kind === "web") {
    return (
      <svg {...common}>
        <rect className="fl ln" data-draw="" x="44" y="26" width="312" height="198" rx="10" />
        <path className="ln" data-draw="" d="M44 54h312" />
        <circle className="mut" cx="62" cy="40" r="3.5" />
        <circle className="mut" cx="75" cy="40" r="3.5" />
        <circle className="mut" cx="88" cy="40" r="3.5" />
        <rect className="mut" x="118" y="34" width="164" height="12" rx="6" opacity=".6" />
        <g className="blk"><rect className="ink" x="70" y="80" width="138" height="13" rx="3" /></g>
        <g className="blk"><rect className="ink" x="70" y="100" width="98" height="13" rx="3" /></g>
        <g className="blk"><rect className="mut" x="70" y="124" width="120" height="6" rx="3" /></g>
        <g className="blk w-btn"><rect className="acc" x="70" y="142" width="66" height="20" rx="5" /></g>
        <g className="blk">
          <rect className="soft" x="226" y="74" width="104" height="88" rx="6" />
          <path className="ln-acc" d="M236 150l22-26 15 17 12-11 35 20" />
          <circle className="acc" cx="306" cy="96" r="7" />
        </g>
        {[70, 162, 254].map((x) => (
          <g key={x} className="blk"><rect className="fl2" x={x} y="178" width="76" height="30" rx="5" /></g>
        ))}
        <path className="cursor mv" d="M0 0v17l4.6-4.2 3.1 6.6 2.7-1.2-3-6.4h6.3z" />
      </svg>
    );
  }

  if (kind === "ai") {
    // Conversación que alimenta la ficha del prospecto hasta dejarlo calificado
    return (
      <svg {...common}>
        <rect className="fl ln" data-draw="" x="24" y="20" width="206" height="210" rx="12" />
        <circle className="acc" cx="46" cy="42" r="9" />
        <rect className="ink" x="62" y="35" width="64" height="6" rx="3" />
        <rect className="mut" x="62" y="46" width="40" height="5" rx="2.5" />
        <path className="ln" d="M24 62H230" />
        <g className="ai-b">
          <rect className="fl2 ln" x="38" y="76" width="118" height="28" rx="10" />
          <rect className="mut" x="50" y="87" width="88" height="6" rx="3" />
        </g>
        <g className="ai-b">
          <rect className="soft" x="92" y="114" width="124" height="38" rx="10" />
          <rect className="ink" x="104" y="124" width="96" height="6" rx="3" />
          <rect className="ink" x="104" y="136" width="66" height="6" rx="3" opacity=".7" />
        </g>
        <g className="ai-b">
          <rect className="fl2 ln" x="38" y="162" width="98" height="28" rx="10" />
          <rect className="mut" x="50" y="173" width="70" height="6" rx="3" />
        </g>
        <g className="ai-typing">
          <rect className="soft" x="164" y="196" width="52" height="22" rx="10" />
          {[178, 190, 202].map((cx) => <circle key={cx} className="acc ai-dot" cx={cx} cy="207" r="2.5" />)}
        </g>
        <path className="dash ai-path" d="M230 125H262" />
        <rect className="fl ln" data-draw="" x="262" y="40" width="118" height="170" rx="10" />
        <circle className="mut" cx="284" cy="66" r="10" />
        <rect className="ink" x="300" y="59" width="58" height="6" rx="3" />
        <rect className="mut" x="300" y="70" width="38" height="5" rx="2.5" />
        {[98, 120, 142].map((y, i) => (
          <g key={y}>
            <rect className="mut" x="276" y={y} width="24" height="5" rx="2.5" opacity=".7" />
            <rect className="ink ai-v" x="308" y={y} width={[52, 38, 46][i]} height="5" rx="2.5" />
          </g>
        ))}
        <g className="ai-ok">
          <rect className="soft" x="274" y="168" width="94" height="24" rx="12" />
          <path className="ln-acc" d="M285 180l4 4 8-8" />
          <text className="lbl-in" x="302" y="184">{labels.ai[0]}</text>
        </g>
        <rect className="acc mv ai-pk" x="-4" y="-4" width="8" height="8" rx="2" />
      </svg>
    );
  }

  if (kind === "dash") {
    // Avance de cada área frente a su meta; el periodo cambia solo
    return (
      <svg {...common}>
        <rect className="fl ln" data-draw="" x="24" y="20" width="352" height="210" rx="12" />
        <rect className="ink" x="44" y="38" width="88" height="8" rx="3" />
        <rect className="mut" x="44" y="52" width="58" height="5" rx="2.5" />
        <rect className="fl2" x="238" y="34" width="124" height="26" rx="8" />
        <rect className="soft dh-tab" x="242" y="37" width="36" height="20" rx="6" />
        {["7d", "30d", "12m"].map((p, i) => (
          <text key={p} className="lbl" x={260 + i * 40} y="51" textAnchor="middle">{p}</text>
        ))}
        {DASH_Y.map((y, i) => (
          <g key={y}>
            <text className="lbl-in" x="44" y={y - 8}>{labels.dash[i]}</text>
            <text className="lbl dh-val" x="356" y={y - 8} textAnchor="end">{pct(DASH_V[0][i])}</text>
            <rect className="mut" x="44" y={y} width="312" height="12" rx="6" opacity=".5" />
            <rect className="acc dh-bar" x="44" y={y} width="312" height="12" rx="6" style={{ transform: `scaleX(${DASH_V[0][i]})` }} />
            <path className="ln-ink" d={`M${44 + 312 * DASH_GOAL[i]} ${y - 4}V${y + 16}`} />
          </g>
        ))}
        <path className="ln-ink" d="M44 206V218" />
        <text className="lbl" x="52" y="216">{labels.dash[3]}</text>
      </svg>
    );
  }

  const [mail, parse, auto, manager] = labels.auto;
  return (
    <svg {...common}>
      <path className="ln" data-draw="" d="M80 125H116" />
      <path className="ln" data-draw="" d="M176 125H218" />
      <path className="ln" data-draw="" d="M274 125H287V66H300" />
      <path className="ln" data-draw="" d="M274 125H287V184H300" />
      <path className="au-up nope" d="M50 125H287V66H342" />
      <path className="au-dn nope" d="M50 125H287V184H342" />
      <rect className="fl ln" data-draw="" x="20" y="102" width="60" height="46" rx="10" />
      <rect className="hl" data-hl="n1" x="20" y="102" width="60" height="46" rx="10" />
      <rect className="ln-ink" x="37" y="116" width="26" height="18" rx="2" fill="none" />
      <path className="ln-ink" d="M37 118l13 9 13-9" />
      <text className="lbl" x="50" y="168" textAnchor="middle">{mail}</text>
      <rect className="fl ln" data-draw="" x="116" y="102" width="60" height="46" rx="10" />
      <rect className="hl" data-hl="n2" x="116" y="102" width="60" height="46" rx="10" />
      <path className="ln-ink" d="M139 113h10l6 6v18h-16z" />
      <path className="ln-ink" d="M143 124h8M143 129h8" />
      <text className="lbl" x="146" y="168" textAnchor="middle">{parse}</text>
      <path className="fl ln" data-draw="" d="M246 97L274 125L246 153L218 125Z" />
      <path className="hl" data-hl="dm" d="M246 97L274 125L246 153L218 125Z" />
      <text className="lbl" x="246" y="129" textAnchor="middle">$500</text>
      <rect className="fl ln" data-draw="" x="300" y="44" width="84" height="44" rx="10" />
      <rect className="hl" data-hl="n4" x="300" y="44" width="84" height="44" rx="10" />
      <path className="ln-acc" d="M314 66l5 5 9-10" />
      <text className="lbl-in" x="336" y="70">{auto}</text>
      <rect className="fl ln" data-draw="" x="300" y="162" width="84" height="44" rx="10" />
      <rect className="hl" data-hl="n5" x="300" y="162" width="84" height="44" rx="10" />
      <circle className="ln-ink" cx="321" cy="179" r="4" fill="none" />
      <path className="ln-ink" d="M313 192c1.5-4 4.5-6 8-6s6.5 2 8 6" />
      <text className="lbl-in" x="335" y="188">{manager}</text>
      <g className="mv au-pk">
        <circle className="glow" r="9" />
        <circle className="acc" r="4.5" />
      </g>
    </svg>
  );
}
