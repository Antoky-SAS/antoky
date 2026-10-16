"use client";

import { useEffect, useRef } from "react";

const EASE = "cubic-bezier(.2,.7,.2,1)";

/** Barra de progreso de scroll, aparición al hacer scroll de los [data-reveal] y ocultamiento del menú del header si no cabe. */
export function PageEffects() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Barra de progreso
    const onScroll = () => {
      const el = bar.current;
      if (!el) return;
      const h = document.documentElement.scrollHeight - innerHeight;
      el.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Menú del header: se oculta si no cabe en una línea.
    const nav = document.querySelector<HTMLElement>("[data-hnav]");
    let navRO: ResizeObserver | undefined;
    if (nav?.parentElement) {
      const fit = () => {
        nav.removeAttribute("data-hide");
        if (getComputedStyle(nav).display === "none") return;
        if (nav.scrollWidth > nav.clientWidth + 1) nav.setAttribute("data-hide", "1");
      };
      navRO = new ResizeObserver(fit);
      navRO.observe(nav.parentElement);
      fit();
      document.fonts?.ready.then(fit);
    }

    // Aparición al hacer scroll (solo lo que está debajo del primer pantallazo).
    let io: IntersectionObserver | undefined;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "none";
            io!.unobserve(el);
          }),
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
      );
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.getBoundingClientRect().top < innerHeight) return;
        const sib = el.parentElement ? [...el.parentElement.children].filter((c) => c.hasAttribute("data-reveal")).indexOf(el) : 0;
        const delay = Math.max(0, sib) * 80;
        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
        const prev = getComputedStyle(el).transitionProperty !== "all" ? getComputedStyle(el).transition : "";
        el.style.transition = (prev ? prev + "," : "") + `opacity .8s ${EASE} ${delay}ms, transform .8s ${EASE} ${delay}ms`;
        io!.observe(el);
      });
    }

    return () => {
      removeEventListener("scroll", onScroll);
      navRO?.disconnect();
      io?.disconnect();
    };
  }, []);

  return <div ref={bar} className="progress" aria-hidden="true" />;
}
