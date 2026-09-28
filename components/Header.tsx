"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const LINKS = [
  { id: "proyectos", label: "Productos" },
  { id: "proceso", label: "Cómo trabajamos" },
  { id: "nosotros", label: "Nosotros" },
];
const SPY_IDS = ["proyectos", "proceso", "nosotros", "contacto"];
const MOBILE_MAX = 860;

export default function Header() {
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
      SPY_IDS.forEach((id) => {
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
  }, [moveBar]);

  useEffect(() => {
    document.body.style.overflow = menu && window.innerWidth < MOBILE_MAX ? "hidden" : "";
  }, [menu]);

  const close = () => setMenu(false);

  return (
    <>
      <header className="header">
        <div className="wrap header-in">
          <a href="#inicio" className="header-logo">
            <img src="/assets/antoky-logo-blanco.png" alt="Antoky" />
          </a>
          <nav ref={navRef} className="nav m only-desktop">
            {LINKS.map((l) => (
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
            <a href="#contacto" className="btn btn-y nav-cta">
              Hablemos →
            </a>
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
          {LINKS.map((l, idx) => (
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
          <a href="#contacto" onClick={close} tabIndex={menu ? 0 : -1} className="mmenu-cta m">
            Hablemos →
          </a>
          <div className="mmenu-info">
            <a href="mailto:Ceau922@gmail.com" tabIndex={menu ? 0 : -1}>
              Ceau922@gmail.com
            </a>
            <span>Colombia</span>
          </div>
        </div>
      </div>
    </>
  );
}
