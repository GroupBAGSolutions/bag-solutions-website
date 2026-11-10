"use client";

import { useEffect, useRef } from "react";
import { animate, utils } from "animejs";

/* Punto de lectura al 65 % del alto de la ventana: la línea llega a cada etapa justo cuando aparece. */
const READ = 0.65;

export function ProcessSteps({ steps, receives }: { steps: string[][]; receives: string }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrap.current!;
    const line = root.querySelector<HTMLElement>(".steps-line")!;
    const fill = root.querySelector<HTMLElement>(".steps-fill")!;
    const items = [...root.querySelectorAll<HTMLElement>(".step")];
    const fit = () => (line.style.bottom = `${items.at(-1)!.offsetHeight - 14}px`);

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fit();
      fill.style.transform = "scaleY(1)";
      items.forEach((s) => s.classList.add("on"));
      return;
    }

    const paint = () => {
      const r = line.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * READ - r.top) / r.height));
      fill.style.transform = `scaleY(${p})`;
    };
    const ro = new ResizeObserver(() => {
      fit();
      paint();
    });
    ro.observe(root);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        paint();
      });
    };
    addEventListener("scroll", onScroll, { passive: true });

    // Las etapas que aún no alcanza la línea se ocultan y aparecen (fade) al llegar a ella
    const pending = items.filter((s) => s.getBoundingClientRect().top > innerHeight * READ);
    items.filter((s) => !pending.includes(s)).forEach((s) => s.classList.add("on"));
    utils.set(pending, { opacity: 0, y: 28 });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          e.target.classList.add("on");
          animate(e.target, { opacity: 1, y: 0, duration: 1000, ease: "outExpo" });
        }),
      { rootMargin: `0px 0px -${Math.round((1 - READ) * 100)}% 0px` },
    );
    pending.forEach((s) => io.observe(s));

    return () => {
      ro.disconnect();
      io.disconnect();
      removeEventListener("scroll", onScroll);
      utils.set(items, { opacity: 1, y: 0 });
    };
  }, []);

  return (
    <div className="steps-wrap" ref={wrap}>
      <span className="steps-line" aria-hidden="true">
        <span className="steps-fill" style={{ transform: "scaleY(0)" }} />
      </span>
      <ol className="steps">
        {steps.map(([h, p, d]) => (
          <li className="step" key={h}>
            <h3>{h}</h3>
            <p>{p}</p>
            <p className="deliv">
              <span className="mono">{receives}</span>
              <strong>{d}</strong>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
