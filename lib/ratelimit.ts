import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Límites de envío del formulario de contacto, guardados en Upstash Redis (Vercel Marketplace).
// La integración puede exponer KV_REST_API_* o UPSTASH_REDIS_REST_*; se aceptan ambas.
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

const crear = (prefijo: string, limiter: ReturnType<typeof Ratelimit.slidingWindow>) =>
  redis ? new Ratelimit({ redis, limiter, prefix: `antoky:contacto:${prefijo}` }) : null;

const porIpCorto = crear("ip-10m", Ratelimit.slidingWindow(3, "10 m"));
const porIpDia = crear("ip-1d", Ratelimit.slidingWindow(10, "1 d"));
const porCorreoDia = crear("correo-1d", Ratelimit.slidingWindow(5, "1 d"));

/** IP del cliente. En Vercel, x-forwarded-for lo fija la plataforma (no lo controla el cliente). */
export function ipDe(req: Request) {
  const xff = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return xff || req.headers.get("x-real-ip") || "anon";
}

/**
 * Devuelve los segundos a esperar si se superó algún límite, o 0 si puede enviar.
 * Sin Redis configurado (o si falla) no bloquea: el formulario sigue funcionando.
 */
export async function limiteExcedido(ip: string, correo: string): Promise<number> {
  if (!porIpCorto || !porIpDia || !porCorreoDia) {
    console.warn("Rate limit desactivado: faltan variables de Upstash Redis");
    return 0;
  }
  try {
    const res = await Promise.all([porIpCorto.limit(ip), porIpDia.limit(ip), porCorreoDia.limit(correo)]);
    const bloqueado = res.filter((r) => !r.success);
    if (!bloqueado.length) return 0;
    const reset = Math.max(...bloqueado.map((r) => r.reset));
    return Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  } catch (err) {
    console.error("Error consultando rate limit", err);
    return 0;
  }
}
