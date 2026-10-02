import { Resend } from "resend";
import { TIEMPO_MIN_MS, validar } from "@/lib/contacto";
import { ipDe, limiteExcedido } from "@/lib/ratelimit";

// Remitente y destinatario de los mensajes del formulario de contacto.
const FROM = process.env.CONTACT_FROM ?? "Antoky Web <web@antoky.com>";
const TO = process.env.CONTACT_TO ?? "contacto@antoky.com";

// Tamaño máximo del cuerpo (los límites de campos suman ~1.3 KB).
const MAX_BYTES = 10 * 1024;

const error = (mensaje: string, status: number, headers?: HeadersInit) =>
  Response.json({ error: mensaje }, { status, headers });

// Solo se aceptan envíos desde el propio sitio (si el navegador manda Origin).
function origenPermitido(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  const permitidos = [req.headers.get("x-forwarded-host"), req.headers.get("host")];
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const sitio = new URL(process.env.NEXT_PUBLIC_SITE_URL).host;
    permitidos.push(sitio, sitio.startsWith("www.") ? sitio.slice(4) : `www.${sitio}`);
  }
  return permitidos.includes(host);
}

export async function POST(req: Request) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return error("Tipo de contenido no soportado", 415);
  }
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BYTES) {
    return error("Solicitud demasiado grande", 413);
  }
  if (!origenPermitido(req)) return error("Origen no permitido", 403);

  const raw = await req.text();
  if (raw.length > MAX_BYTES) return error("Solicitud demasiado grande", 413);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return error("JSON inválido", 400);
  }

  // Honeypot lleno o envío demasiado rápido → bot. Responder OK sin enviar.
  if (body.empresa_web) return Response.json({ ok: true });
  const ts = Number(body.ts);
  const transcurrido = Date.now() - ts;
  if (!Number.isFinite(ts) || transcurrido < TIEMPO_MIN_MS || transcurrido > 24 * 60 * 60 * 1000) {
    return Response.json({ ok: true });
  }

  const v = validar(body);
  if (!v.ok) return error(v.error, 400);
  const { nombre, correo, telefono, tipo, mensaje } = v.datos;

  // Se limita después de validar para que corregir un error de escritura no gaste intentos.
  const espera = await limiteExcedido(ipDe(req), correo);
  if (espera) {
    return error("Demasiados mensajes. Inténtelo más tarde.", 429, { "Retry-After": String(espera) });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY no está definida");
    return error("Servicio de correo no configurado", 500);
  }

  const { error: errEnvio } = await new Resend(apiKey).emails.send({
    from: FROM,
    to: TO,
    replyTo: correo,
    subject: `Nuevo contacto: ${nombre} (${tipo})`,
    text: [
      `Nombre: ${nombre}`,
      `Correo: ${correo}`,
      `Teléfono: ${telefono}`,
      `Tipo de organización: ${tipo}`,
      "",
      "Mensaje:",
      mensaje || "(sin mensaje)",
    ].join("\n"),
  });

  if (errEnvio) {
    console.error("Error enviando correo de contacto", errEnvio);
    return error("No se pudo enviar el mensaje", 502);
  }

  return Response.json({ ok: true });
}
