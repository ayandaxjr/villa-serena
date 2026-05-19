/**
 * Simple in-memory rate limiter.
 * Works per-serverless-instance on Vercel (good enough for a small villa site —
 * protects against naive bots / repeated form submissions from the same IP).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Returns true if the request should be blocked.
 * @param ip         Requestor IP (from x-forwarded-for or x-real-ip header)
 * @param limit      Max requests allowed in the window
 * @param windowMs   Window size in milliseconds
 */
export function isRateLimited(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();

  // Inline cleanup: purge expired entries to keep Map small
  if (store.size > 500) {
    store.forEach((entry, key) => {
      if (now > entry.resetAt) store.delete(key);
    });
  }

  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  if (entry.count > limit) return true;
  return false;
}

/** Extract the real IP from Next.js request headers */
export function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Sanitize a string field: trim, strip HTML tags, limit length */
export function sanitize(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/<[^>]*>/g, "") // strip HTML
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // strip control chars
    .slice(0, maxLength);
}
