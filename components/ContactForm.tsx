"use client";

import { useState, type FormEvent } from "react";

// Endpoint que recibe el formulario como JSON (p. ej. Formspree: https://formspree.io/f/xxxx).
// Sin definir, el envío se simula como en el prototipo.
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export default function ContactForm() {
  const [enviado, setEnviado] = useState(false);
  const [nombre, setNombre] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(false);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setError(false);
    if (ENDPOINT) {
      setEnviando(true);
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(Object.fromEntries(data)),
        });
        if (!res.ok) throw new Error(String(res.status));
      } catch {
        setError(true);
        setEnviando(false);
        return;
      }
      setEnviando(false);
    }
    setNombre(String(data.get("nombre") || "").split(" ")[0]);
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
        <input className="field" name="nombre" required placeholder="Su nombre" autoComplete="name" />
      </label>
      <label>
        Correo electrónico
        <input className="field" name="correo" type="email" required placeholder="nombre@empresa.com" autoComplete="email" />
      </label>
      <label>
        Teléfono de contacto
        <input className="field" name="telefono" type="tel" required placeholder="+57 300 000 0000" autoComplete="tel" />
      </label>
      <label>
        Tipo de organización
        <select className="field" name="tipo">
          <option>Empresa</option>
          <option>Microempresa</option>
          <option>Colegio</option>
          <option>Otro</option>
        </select>
      </label>
      <label>
        Mensaje
        <textarea className="field" name="mensaje" rows={4} placeholder="Cuéntenos brevemente su proyecto" />
      </label>
      {error && (
        <p className="form-error" role="alert">
          No pudimos enviar su mensaje. Inténtelo de nuevo o escríbanos a Ceau922@gmail.com.
        </p>
      )}
      <button type="submit" className="btn btn-y form-submit m" disabled={enviando}>
        {enviando ? "Enviando…" : "Enviar mensaje →"}
      </button>
    </form>
  );
}
