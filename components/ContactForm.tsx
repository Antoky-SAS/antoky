"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "./Button";
import { LIMITES, TIPOS, limpiarTelefono } from "../lib/contacto";

// Endpoint que recibe el formulario como JSON. Por defecto la API route propia (/api/contacto, envía con Resend).
// Un endpoint vacío ("") simula el envío como en el prototipo.
const ENDPOINT = (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_FORM_ENDPOINT : undefined) ?? "/api/contacto";

const ERROR_GENERICO = "No pudimos enviar su mensaje. Inténtelo de nuevo o escríbanos a contacto@antoky.com.";

export interface ContactFormProps {
  /** URL que recibe el formulario como JSON. Por defecto NEXT_PUBLIC_FORM_ENDPOINT o /api/contacto; con "" el envío se simula. */
  endpoint?: string;
}

/** Formulario de contacto (nombre, correo, teléfono, tipo de organización, mensaje) con campos oscuros y botón amarillo en píldora; muestra confirmación tras enviar. Va dentro de una tarjeta negra (.form-card). */
export function ContactForm({ endpoint = ENDPOINT }: ContactFormProps) {
  const [enviado, setEnviado] = useState(false);
  const [nombre, setNombre] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
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
      if (fallo) {
        setError(fallo);
        setEnviando(false);
        return;
      }
      setEnviando(false);
    }
    setNombre(String(data.get("nombre") || "").split(" ")[0]);
    setTelefono("");
    setMensaje("");
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="ok">
        <span className="ok-check">✓</span>
        <h3 className="m">Mensaje recibido.</h3>
        <p>Gracias, {nombre}. Le escribiremos muy pronto.</p>
        <button
          type="button"
          onClick={() => {
            setEnviado(false);
            setNombre("");
            abierto.current = Date.now();
          }}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={enviar}>
      <label>
        Nombre
        <input className="field" name="nombre" required minLength={2} maxLength={LIMITES.nombre} placeholder="Su nombre" autoComplete="name" />
      </label>
      <label>
        Correo electrónico
        <input className="field" name="correo" type="email" required maxLength={LIMITES.correo} placeholder="nombre@empresa.com" autoComplete="email" />
      </label>
      <label>
        Teléfono de contacto
        <input
          className="field"
          name="telefono"
          type="tel"
          inputMode="tel"
          required
          minLength={7}
          maxLength={LIMITES.telefono}
          pattern="\+?[0-9\s\-]{7,19}"
          title="Solo números, espacios, guiones y + al inicio"
          placeholder="+57 300 000 0000"
          autoComplete="tel"
          value={telefono}
          onChange={(e) => setTelefono(limpiarTelefono(e.target.value))}
        />
      </label>
      <label>
        Tipo de organización
        <select className="field" name="tipo">
          {TIPOS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      {/* Honeypot anti-spam: invisible para personas, los bots lo llenan. */}
      <input name="empresa_web" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
      <label>
        Mensaje
        <textarea
          className="field"
          name="mensaje"
          rows={4}
          maxLength={LIMITES.mensaje}
          placeholder="Cuéntenos brevemente su proyecto"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />
        <span className="form-count" aria-live="polite">
          {mensaje.length}/{LIMITES.mensaje}
        </span>
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="form-submit" disabled={enviando}>
        {enviando ? "Enviando…" : "Enviar mensaje →"}
      </Button>
    </form>
  );
}
