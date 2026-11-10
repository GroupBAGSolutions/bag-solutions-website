"use client";

import { useEffect, useRef } from "react";
import { createDrawable, createMotionPath, createScope, createTimeline, stagger, utils } from "animejs";

/* Ilustración del hero, sin textos: una planilla con errores pasa a un dashboard profesional.
   Escritorio: planilla a la izquierda y dashboard a la derecha. Móvil: uno sobre otro.
   El HTML del servidor muestra el estado final (útil sin JS y con reduced-motion). */

const ROWS = 7, COLS = 5, CW = 74, CH = 36, X0 = 28, Y0 = 48;
const BAD: [number, number][] = [[1, 2], [2, 0], [2, 1], [2, 3], [3, 4], [5, 0], [5, 1], [5, 3]];
const LINE = [[104, 280], [147, 262], [191, 268], [234, 236], [277, 222], [321, 196], [364, 170]];
const BARS = [34, 48, 40, 62, 54];
// El origen de transformación global de .ill (centro) desplazaría el scale() de la variante móvil
const PLACE = { transformBox: "view-box", transformOrigin: "0 0" } as const;

function Sheet() {
  return (
    <g>
      <rect className="fl ln" x="0" y="0" width="400" height="300" rx="10" />
      <circle className="mut" cx="16" cy="14" r="3.5" />
      <circle className="mut" cx="28" cy="14" r="3.5" />
      <circle className="mut" cx="40" cy="14" r="3.5" />
      <rect className="mut" x="62" y="10" width="120" height="8" rx="4" opacity=".6" />
      <rect className="fl2" x="1" y="28" width="398" height="20" />
      {Array.from({ length: COLS }, (_, c) => (
        <rect key={`h${c}`} className="mut" x={X0 + c * CW + 30} y="35" width="14" height="6" rx="3" opacity=".7" />
      ))}
      {Array.from({ length: ROWS }, (_, r) => (
        <rect key={`n${r}`} className="mut" x="11" y={Y0 + r * CH + 15} width="6" height="6" rx="1.5" opacity=".7" />
      ))}
      {Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => (
          <rect
            key={`c${r}-${c}`}
            className={r === 0 ? "ink" : "mut"}
            x={X0 + c * CW + 10}
            y={Y0 + r * CH + 15}
            width={18 + ((r * 37 + c * 53) % 36)}
            height="6"
            rx="3"
            opacity={r === 0 ? 0.8 : 1}
          />
        )),
      )}
      {BAD.map(([r, c]) => (
        <g key={`b${r}-${c}`} className="fx-badg">
          <rect className="fx-bad" x={X0 + c * CW + 1} y={Y0 + r * CH + 1} width={CW - 2} height={CH - 2} />
          <rect className="fx-badbar" x={X0 + c * CW + 10} y={Y0 + r * CH + 15} width={22 + ((r * 29 + c * 17) % 30)} height="6" rx="3" />
        </g>
      ))}
      {Array.from({ length: COLS + 1 }, (_, c) => (
        <path key={`v${c}`} className="fx-grid" d={`M${X0 + c * CW} 28V300`} />
      ))}
      <path className="fx-grid" d="M0 28H400" />
      {Array.from({ length: ROWS }, (_, r) => (
        <path key={`g${r}`} className="fx-grid" d={`M0 ${Y0 + r * CH}H400`} />
      ))}
      <rect className="glow fx-scan" x={X0} y={Y0} width={400 - X0} height={CH} />
    </g>
  );
}

function Dashboard() {
  const line = LINE.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <g>
      <rect className="fx-bg ln" x="0" y="0" width="560" height="340" rx="10" />
      <path className="fl2" d="M10 0H64V340H10A10 10 0 0 1 0 330V10A10 10 0 0 1 10 0Z" />
      <rect className="acc" x="24" y="24" width="16" height="16" rx="4" />
      {[60, 96, 132].map((y) => (
        <rect key={y} className="mut" x="24" y={y} width="16" height="16" rx="4" opacity=".7" />
      ))}
      {[0, 1, 2].map((i) => {
        const x = 84 + i * 160;
        return (
          <g key={i}>
            <rect className="fl ln" x={x} y="20" width="140" height="72" rx="8" />
            <rect className="mut" x={x + 14} y="36" width={44 + i * 8} height="6" rx="3" />
            <rect className="ink fx-kv" x={x + 14} y="54" width={64 - i * 6} height="16" rx="3" />
            <path className="ln-acc fx-spark" d={`M${x + 94} 70l8-6 8 3 8-10 8-5`} />
          </g>
        );
      })}
      <rect className="fl ln" x="84" y="112" width="300" height="208" rx="8" />
      <rect className="mut" x="100" y="128" width="70" height="6" rx="3" />
      {[170, 220, 270].map((y) => (
        <path key={y} className="dash" d={`M104 ${y}H364`} />
      ))}
      <path className="soft fx-area" d={`${line} L364 300 L104 300 Z`} opacity=".7" />
      <path className="ln-acc fx-line" d={line} />
      {LINE.map(([x, y]) => (
        <circle key={x} className="acc fx-dot" cx={x} cy={y} r="3.5" />
      ))}
      <rect className="fl ln" x="404" y="112" width="140" height="100" rx="8" />
      <circle className="fx-track" cx="474" cy="162" r="30" />
      <path className="fx-arc" d="M474 132a30 30 0 1 1 0 60a30 30 0 1 1 0-60" />
      <rect className="fl ln" x="404" y="222" width="140" height="98" rx="8" />
      {BARS.map((h, i) => (
        <rect key={i} className={`fx-bar ${i === 3 ? "acc" : "soft"}`} x={424 + i * 22} y={304 - h} width="12" height={h} rx="2" />
      ))}
    </g>
  );
}

function Art({ variant }: { variant: "d" | "m" }) {
  const desk = variant === "d";
  const paths = desk
    ? ["M440 150C484 150 480 110 524 110", "M440 230H524", "M440 310C484 310 480 350 524 350"]
    : ["M120 320C120 358 100 354 100 392", "M240 320V392", "M360 320C360 358 380 354 380 392"];
  return (
    <svg className={`ill fx fx-${variant}`} viewBox={desk ? "0 0 1120 460" : "0 0 480 680"} aria-hidden="true" focusable="false">
      <g style={PLACE} transform={desk ? "translate(40 80)" : "translate(40 20)"}>
        <Sheet />
      </g>
      {paths.map((d, i) => (
        <path key={i} className="dash fx-path" d={d} />
      ))}
      <g style={PLACE} transform={desk ? "translate(520 60)" : "translate(20 392) scale(.7857)"}>
        <Dashboard />
      </g>
      {paths.map((_, i) => (
        <rect key={i} className="acc mv fx-pk" x="-5" y="-5" width="10" height="10" rx="2" />
      ))}
    </svg>
  );
}

function build(svg: SVGSVGElement) {
  const q = <T extends Element>(s: string) => [...svg.querySelectorAll<T>(s)];
  const bad = q(".fx-badg"), scan = q(".fx-scan"), kv = q(".fx-kv"), dots = q(".fx-dot");
  const area = q(".fx-area"), bars = q(".fx-bar"), pk = q(".fx-pk"), paths = q<SVGPathElement>(".fx-path");
  const line = createDrawable(q<SVGPathElement>(".fx-line"));
  const sparks = createDrawable(q<SVGPathElement>(".fx-spark"));
  const arc = createDrawable(q<SVGPathElement>(".fx-arc"));

  // Estado inicial: planilla con errores y dashboard vacío
  utils.set(kv, { scaleX: 0 });
  utils.set(dots, { scale: 0 });
  utils.set(bars, { scaleY: 0 });
  utils.set(area, { opacity: 0 });
  utils.set([...line, ...sparks, ...arc], { draw: "0 0" });

  const tl = createTimeline({ loop: true, loopDelay: 600 })
    .add(bad, { opacity: [1, 0.35], duration: 300, ease: "inOutSine" }, 200)
    .add(bad, { opacity: [0.35, 1], duration: 300, ease: "inOutSine" }, 500)
    .add(scan, { opacity: [0, 1], duration: 150 }, 800)
    .add(scan, { y: [0, (7 - 1) * 36], duration: 1500, ease: "inOutSine" }, 800)
    .add(scan, { opacity: [1, 0], duration: 250 }, 2300)
    .add(bad, { opacity: [1, 0], duration: 350, delay: stagger(150), ease: "outQuad" }, 950);

  pk.forEach((p, i) => {
    const { translateX, translateY } = createMotionPath(paths[i]);
    const t0 = 1000 + i * 320;
    tl.add(p, { opacity: [0, 1], duration: 120 }, t0)
      .add(p, { translateX, translateY, duration: 700, ease: "inOutSine" }, t0)
      .add(p, { opacity: [1, 0], duration: 150 }, t0 + 600);
  });

  return tl
    .add(kv, { scaleX: [0, 1], duration: 700, delay: stagger(120), ease: "outExpo" }, 1700)
    .add(sparks, { draw: ["0 0", "0 1"], duration: 600, delay: stagger(120), ease: "inOutQuad" }, 1900)
    .add(line, { draw: ["0 0", "0 1"], duration: 1200, ease: "inOutQuad" }, 2000)
    .add(area, { opacity: [0, 0.7], duration: 700, ease: "outQuad" }, 2600)
    .add(dots, { scale: [0, 1], duration: 400, delay: stagger(110), ease: "outBack(2)" }, 2100)
    .add(arc, { draw: ["0 0", "0 .72"], duration: 1100, ease: "inOutQuad" }, 2200)
    .add(bars, { scaleY: [0, 1], duration: 700, delay: stagger(80), ease: "outExpo" }, 2300)
    // Vuelta al estado inicial para que el ciclo empalme sin saltos
    .add([...kv], { scaleX: [1, 0], duration: 400, ease: "inQuad" }, 5600)
    .add([...line, ...sparks, ...arc], { draw: "0 0", duration: 400, ease: "inQuad" }, 5600)
    .add(area, { opacity: [0.7, 0], duration: 400 }, 5600)
    .add(dots, { scale: [1, 0], duration: 300 }, 5600)
    .add(bars, { scaleY: [1, 0], duration: 400, ease: "inQuad" }, 5600)
    .add(bad, { opacity: [0, 1], duration: 400 }, 5700);
}

export function HeroArt({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scope = createScope({ root }).add(() => {
      const timelines = new Map<Element, ReturnType<typeof build>>();
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            const svg = e.target as SVGSVGElement;
            const tl = timelines.get(svg);
            if (e.isIntersecting) {
              if (tl) tl.play();
              else timelines.set(svg, build(svg));
            } else tl?.pause();
          }),
        { threshold: 0.2 },
      );
      // Solo la variante visible (la otra está en display:none y nunca intersecta)
      root.querySelectorAll("svg.fx").forEach((s) => io.observe(s));
      return () => io.disconnect();
    });
    return () => scope.revert();
  }, []);

  return (
    <div className="hero-art" ref={ref} role="img" aria-label={label} data-hero="" style={{ "--i": 4 } as React.CSSProperties}>
      <Art variant="d" />
      <Art variant="m" />
    </div>
  );
}
