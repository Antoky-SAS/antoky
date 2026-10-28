"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a,button,[role=button],label,summary,select,[data-pearl]";

/** Cursor de punto: reemplaza el puntero nativo (solo con mouse) y crece sobre enlaces y botones. */
export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dot = ref.current!;
    const root = document.documentElement;
    root.classList.add("has-dot");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dot.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      const t = e.target as Element | null;
      dot.classList.add("on");
      dot.classList.toggle("big", !!t?.closest?.(INTERACTIVE));
      // En campos de texto vuelve el cursor nativo para ver dónde se escribe.
      dot.classList.toggle("hide", !!t?.closest?.("input,textarea,[contenteditable=true]"));
    };
    const leave = () => dot.classList.remove("on");
    const down = () => dot.classList.add("press");
    const up = () => dot.classList.remove("press");

    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", down);
    addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    return () => {
      root.classList.remove("has-dot");
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className="cdot" aria-hidden="true">
      <span />
    </div>
  );
}
