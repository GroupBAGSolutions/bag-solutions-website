"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { animate, utils } from "animejs";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Movimiento global:
 *  - Scroll suave con Lenis (solo puntero fino y sin reduced-motion).
 *  - Aparición de [data-reveal] al entrar en pantalla (Anime.js). El HTML llega visible desde
 *    el servidor; solo se ocultan los elementos que aún están bajo el borde de la ventana.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (reduced() || !matchMedia("(pointer: fine)").matches) return;
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -(navH + 24) }, lerp: 0.12 });
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    if (reduced()) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
      (el) => el.getBoundingClientRect().top > innerHeight * 0.92,
    );
    utils.set(els, { opacity: 0, y: 18 });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const el = e.target as HTMLElement;
          animate(el, { opacity: 1, y: 0, duration: 900, delay: (Number(el.dataset.reveal) || 0) * 90, ease: "outExpo" });
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      utils.set(els, { opacity: 1, y: 0 });
    };
  }, [pathname]);

  return null;
}
