"use client";

import { useRef, useState, type FormEvent } from "react";
import { EnvioCarro } from "./EnvioCarro";
import { LIMITES } from "../lib/contacto";

// Endpoint que recibe el formulario como JSON. Por defecto la API route propia (/api/contacto, envía con Resend).
// Un endpoint vacío ("") simula el envío como en el prototipo.
const ENDPOINT = (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_FORM_ENDPOINT : undefined) ?? "/api/contacto";

const ERROR_GENERICO = "No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos a contacto@antoky.com.";

export interface ContactFormProps {
  /** URL que recibe el formulario como JSON. Por defecto NEXT_PUBLIC_FORM_ENDPOINT o /api/contacto; con "" el envío se simula. */
  endpoint?: string;
}

/** Formulario de diagnóstico (nombre, empresa, correo, problema operativo); tras enviar muestra la confirmación con la animación del carro. */
export function ContactForm({ endpoint = ENDPOINT }: ContactFormProps) {
  const [enviado, setEnviado] = useState(false);
  const [nombre, setNombre] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [problema, setProblema] = useState("");
  // Momento en que se abrió el formulario; el servidor descarta envíos hechos en menos de 3 s (bots).
  const abierto = useRef(Date.now());

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setError(null);
    if (endpoint) {
      setEnviando(true);
      let fallo: string | null = null;
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...Object.fromEntries(data), ts: abierto.current }),
        });
        if (!res.ok) {
          // 400 (validación) y 429 (límite de envíos) traen un mensaje para mostrar.
          const msg = res.status === 400 || res.status === 429 ? (await res.json().catch(() => null))?.error : null;
          fallo = typeof msg === "string" ? msg : ERROR_GENERICO;
        }
      } catch {
        fallo = ERROR_GENERICO;
      }
      setEnviando(false);
      if (fallo) {
        setError(fallo);
        return;
      }
    }
    setNombre(String(data.get("nombre") || "").trim().split(" ")[0]);
    setProblema("");
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="ok" role="status">
        <div className="ok-badge" aria-hidden="true">
          <span className="ok-ring" />
          <span className="ok-ring ok-ring-2" />
          <span className="ok-dot">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
        </div>
        <div className="ok-text">
          <span className="mono ok-eyebrow">SOLICITUD ENVIADA</span>
          <h3>
            Recibimos tu solicitud, <span className="serif">{nombre}.</span>
          </h3>
          <p>Revisaremos lo que nos contaste y te contactaremos por correo para acordar la fecha de la conversación inicial.</p>
        </div>
        <EnvioCarro className="ok-envio" />
        <button
          type="button"
          className="btn-ghost ok-again"
          onClick={() => {
            setEnviado(false);
            setNombre("");
            abierto.current = Date.now();
          }}
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={enviar}>
      <div className="form-row">
        <label>
          Nombre
          <input className="field" name="nombre" required minLength={2} maxLength={LIMITES.nombre} autoComplete="name" />
        </label>
        <label>
          Empresa
          <input className="field" name="empresa" required minLength={2} maxLength={LIMITES.empresa} autoComplete="organization" />
        </label>
      </div>
      <label>
        Correo corporativo
        <input className="field" name="correo" type="email" required maxLength={LIMITES.correo} placeholder="nombre@tuempresa.com" autoComplete="email" />
      </label>
      {/* Honeypot anti-spam: invisible para personas, los bots lo llenan. */}
      <input name="empresa_web" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
      <label>
        <span className="form-q">
          ¿Cuál es el principal problema operativo que quieres resolver?
          <span className="mono" aria-live="polite">
            {problema.length}/{LIMITES.problema}
          </span>
        </span>
        <textarea
          className="field"
          name="problema"
          required
          maxLength={LIMITES.problema}
          placeholder="Cuéntanos con tus palabras qué está pasando hoy en tu operación."
          value={problema}
          onChange={(e) => setProblema(e.target.value)}
        />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="form-submit" disabled={enviando}>
        {enviando ? "Enviando…" : "Agendar una conversación inicial →"}
      </button>
      <span className="form-note">Primera conversación sin costo y sin compromiso de contratación.</span>
    </form>
  );
}
