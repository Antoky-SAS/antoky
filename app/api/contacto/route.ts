import { Resend } from "resend";

// Remitente y destinatario de los mensajes del formulario de contacto.
const FROM = process.env.CONTACT_FROM ?? "Antoky Web <web@antoky.com>";
const TO = process.env.CONTACT_TO ?? "contacto@antoky.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function campo(body: Record<string, unknown>, key: string, max: number) {
  const v = body[key];
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Honeypot lleno → bot. Responder OK sin enviar.
  if (campo(body, "empresa_web", 200)) return Response.json({ ok: true });

  const nombre = campo(body, "nombre", 120);
  const correo = campo(body, "correo", 200);
  const telefono = campo(body, "telefono", 40);
  const tipo = campo(body, "tipo", 40) || "Sin especificar";
  const mensaje = campo(body, "mensaje", 5000);

  if (!nombre || !EMAIL_RE.test(correo) || !telefono) {
    return Response.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY no está definida");
    return Response.json({ error: "Servicio de correo no configurado" }, { status: 500 });
  }

  const { error } = await new Resend(apiKey).emails.send({
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

  if (error) {
    console.error("Error enviando correo de contacto", error);
    return Response.json({ error: "No se pudo enviar el mensaje" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
