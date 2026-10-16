// Reglas del formulario de contacto, compartidas por el cliente (components/ContactForm.tsx)
// y la API route (app/api/contacto/route.ts).

export const LIMITES = { nombre: 80, empresa: 120, correo: 120, problema: 1000 } as const;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const NOMBRE_RE = /^[\p{L}\s'.-]{2,80}$/u;

/** Tiempo mínimo entre abrir el formulario y enviarlo; más rápido = bot. */
export const TIEMPO_MIN_MS = 3000;

export interface DatosContacto {
  nombre: string;
  empresa: string;
  correo: string;
  problema: string;
}

type Resultado = { ok: true; datos: DatosContacto } | { ok: false; error: string };

// Quita caracteres de control (incluidos saltos de línea) de campos de una línea.
const unaLinea = (v: string) => v.replace(/[\u0000-\u001F\u007F]+/g, " ").replace(/\s+/g, " ").trim();
// En el problema se permiten saltos de línea y tabulaciones.
const multilinea = (v: string) => v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

const texto = (body: Record<string, unknown>, key: string) => (typeof body[key] === "string" ? (body[key] as string) : "");

/** Valida estrictamente: rechaza en vez de recortar. */
export function validar(body: Record<string, unknown>): Resultado {
  const nombre = unaLinea(texto(body, "nombre"));
  const empresa = unaLinea(texto(body, "empresa"));
  const correo = unaLinea(texto(body, "correo")).toLowerCase();
  const problema = multilinea(texto(body, "problema"));

  if (nombre.length > LIMITES.nombre || !NOMBRE_RE.test(nombre)) return { ok: false, error: "Nombre inválido." };
  if (empresa.length < 2 || empresa.length > LIMITES.empresa) return { ok: false, error: "Nombre de empresa inválido." };
  if (correo.length > LIMITES.correo || !EMAIL_RE.test(correo)) return { ok: false, error: "Correo electrónico inválido." };
  if (!problema) return { ok: false, error: "Cuéntanos cuál es el problema que quieres resolver." };
  if (problema.length > LIMITES.problema) return { ok: false, error: `El texto supera los ${LIMITES.problema} caracteres.` };

  return { ok: true, datos: { nombre, empresa, correo, problema } };
}
