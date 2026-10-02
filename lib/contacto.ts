// Reglas del formulario de contacto, compartidas por el cliente (components/ContactForm.tsx)
// y la API route (app/api/contacto/route.ts).

export const LIMITES = { nombre: 80, correo: 120, telefono: 20, mensaje: 1000 } as const;
export const TIPOS = ["Empresa", "Microempresa", "Colegio", "Otro"] as const;

// Dígitos, espacios y guiones; "+" opcional solo al inicio.
export const TEL_RE = /^\+?[0-9\s-]{7,19}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const NOMBRE_RE = /^[\p{L}\s'.-]{2,80}$/u;

/** Tiempo mínimo entre abrir el formulario y enviarlo; más rápido = bot. */
export const TIEMPO_MIN_MS = 3000;

/** Deja solo caracteres válidos de teléfono mientras se escribe o pega. */
export function limpiarTelefono(v: string) {
  const limpio = v.replace(/[^\d+\s-]/g, "");
  return (limpio.startsWith("+") ? "+" : "") + limpio.replace(/\+/g, "");
}

export interface DatosContacto {
  nombre: string;
  correo: string;
  telefono: string;
  tipo: (typeof TIPOS)[number];
  mensaje: string;
}

type Resultado = { ok: true; datos: DatosContacto } | { ok: false; error: string };

// Quita caracteres de control (incluidos saltos de línea) de campos de una línea.
const unaLinea = (v: string) => v.replace(/[\u0000-\u001F\u007F]+/g, " ").replace(/\s+/g, " ").trim();
// En el mensaje se permiten saltos de línea y tabulaciones.
const multilinea = (v: string) => v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

const texto = (body: Record<string, unknown>, key: string) => (typeof body[key] === "string" ? (body[key] as string) : "");

/** Valida estrictamente: rechaza en vez de recortar. */
export function validar(body: Record<string, unknown>): Resultado {
  const nombre = unaLinea(texto(body, "nombre"));
  const correo = unaLinea(texto(body, "correo")).toLowerCase();
  const telefono = unaLinea(texto(body, "telefono"));
  const tipo = unaLinea(texto(body, "tipo"));
  const mensaje = multilinea(texto(body, "mensaje"));

  if (nombre.length > LIMITES.nombre || !NOMBRE_RE.test(nombre)) return { ok: false, error: "Nombre inválido." };
  if (correo.length > LIMITES.correo || !EMAIL_RE.test(correo)) return { ok: false, error: "Correo electrónico inválido." };
  if (telefono.length > LIMITES.telefono || !TEL_RE.test(telefono)) return { ok: false, error: "Teléfono inválido." };
  if (!(TIPOS as readonly string[]).includes(tipo)) return { ok: false, error: "Tipo de organización inválido." };
  if (mensaje.length > LIMITES.mensaje) return { ok: false, error: `El mensaje supera los ${LIMITES.mensaje} caracteres.` };

  return { ok: true, datos: { nombre, correo, telefono, tipo: tipo as DatosContacto["tipo"], mensaje } };
}
