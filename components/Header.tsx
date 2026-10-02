"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { assets } from "./assets";
import { Button } from "./Button";

export interface HeaderProps {
  /** Enlaces de navegación; el activo se resalta en amarillo con una barra deslizante según el scroll. */
  links?: { /** id de la sección destino (sin #). */ id: string; label: string }[];
  /** id de la sección del CTA "Hablemos →". */
  ctaId?: string;
  ctaLabel?: string;
  /** Correo que aparece al pie del menú móvil. */
  email?: string;
}

const LINKS: NonNullable<HeaderProps["links"]> = [
  { id: "proyectos", label: "Productos" },
  { id: "proceso", label: "Cómo trabajamos" },
  { id: "nosotros", label: "Nosotros" },
];
const MOBILE_MAX = 860;

/** Header fijo translúcido con logotipo, navegación con scroll spy y CTA amarillo; en móvil, hamburguesa que abre un menú a pantalla completa. */
export function Header({ links = LINKS, ctaId = "contacto", ctaLabel = "Hablemos →", email = "contacto@antoky.com" }: HeaderProps) {
  const [active, setActive] = useState("");
  const [menu, setMenu] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  const moveBar = useCallback(() => {
    const b = barRef.current;
    const nav = navRef.current;
    if (!b || !nav) return;
    const el = active ? nav.querySelector<HTMLElement>(`[data-nav-id="${active}"]`) : null;
    if (!el) {
      b.style.opacity = "0";
      return;
    }
    b.style.width = el.offsetWidth + "px";
    b.style.transform = "translateX(" + el.offsetLeft + "px)";
    b.style.top = el.offsetTop + el.offsetHeight - 2 + "px";
    b.style.bottom = "auto";
    b.style.opacity = "1";
  }, [active]);

  useLayoutEffect(moveBar, [moveBar]);

  useEffect(() => {
    const spy = () => {
      const line = window.innerHeight * 0.35;
      let cur = "";
      [...links.map((l) => l.id), ctaId].forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      });
      setActive(cur);
    };
    const resize = () => {
      spy();
      moveBar();
      if (window.innerWidth >= MOBILE_MAX) setMenu(false);
    };
    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", resize);
    document.fonts?.ready.then(moveBar);
    spy();
    return () => {
      window.removeEventListener("scroll", spy);
      window.removeEventListener("resize", resize);
    };
  }, [moveBar, links, ctaId]);

  useEffect(() => {
    document.body.style.overflow = menu && window.innerWidth < MOBILE_MAX ? "hidden" : "";
  }, [menu]);

  const close = () => setMenu(false);

  return (
    <>
      <header className="header">
        <div className="wrap header-in">
          <a href="#inicio" className="header-logo">
            <img src={assets.logoBlanco} alt="Antoky" width={1383} height={209} fetchPriority="high" />
          </a>
          <nav ref={navRef} className="nav m only-desktop">
            {links.map((l) => (
              <a
                key={l.id}
                href={"#" + l.id}
                data-nav-id={l.id}
                className={`nav-link${active === l.id ? " on" : ""}`}
              >
                {l.label}
              </a>
            ))}
            <span ref={barRef} className="nav-bar" aria-hidden="true" />
            <Button size="pill" href={"#" + ctaId} className="nav-cta">
              {ctaLabel}
            </Button>
          </nav>
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-label="Menú"
            aria-expanded={menu}
            className={`burger only-mobile${menu ? " open" : ""}`}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`mmenu${menu ? " open" : ""}`} aria-hidden={!menu}>
        <div className="mmenu-deco" />
        <div className="mmenu-body">
          <div className="eyebrow m">Menú</div>
          {links.map((l, idx) => (
            <a
              key={l.id}
              href={"#" + l.id}
              onClick={close}
              tabIndex={menu ? 0 : -1}
              className={`mlink m${active === l.id ? " on" : ""}`}
            >
              <span className="mlink-num m">{"0" + (idx + 1)}</span>
              {l.label}
            </a>
          ))}
        </div>
        <div className="mmenu-foot">
          <a href={"#" + ctaId} onClick={close} tabIndex={menu ? 0 : -1} className="mmenu-cta m">
            {ctaLabel}
          </a>
          <div className="mmenu-info">
            <a href={"mailto:" + email} tabIndex={menu ? 0 : -1}>
              {email}
            </a>
            <span>Colombia</span>
          </div>
        </div>
      </div>
    </>
  );
}
