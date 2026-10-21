/**
 * Cloudflare Worker for the staff CRM screens: the same job nginx.conf does in Docker.
 * Static files and SPA routes come from the built app (assets); /api, /uploads and /health go to
 * the backend, so the browser stays on one origin and needs no CORS.
 *
 * The cron trigger pings the backend's /livez every 10 minutes. A free Render service sleeps after
 * 15 idle minutes, which stops the nightly jobs and makes the first visitor wait about a minute.
 * /livez does not touch the database, so a free Neon database can still suspend between visits.
 */

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  BACKEND_URL: string; // e.g. https://dk-crm-api.onrender.com
}

const BACKEND_PATHS = ["/api/", "/uploads/", "/health", "/livez"];

function backendOrigin(env: Env): string {
  return env.BACKEND_URL.trim().replace(/\/+$/, "");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!BACKEND_PATHS.some((p) => url.pathname.startsWith(p))) {
      return env.ASSETS.fetch(request);
    }
    if (!env.BACKEND_URL) {
      return Response.json({ detail: "BACKEND_URL is not set on this Worker" }, { status: 503 });
    }

    const headers = new Headers(request.headers);
    headers.delete("host");
    const clientIp = request.headers.get("cf-connecting-ip");
    if (clientIp) headers.set("x-forwarded-for", clientIp); // read by the backend's activity log
    headers.set("x-forwarded-proto", "https");

    try {
      const res = await fetch(backendOrigin(env) + url.pathname + url.search, {
        method: request.method,
        headers,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
        redirect: "manual",
      });
      // 530 is Cloudflare's own "origin DNS error" page: BACKEND_URL points at a host that no longer
      // resolves (typically an expired trycloudflare.com quick tunnel). Say so instead of showing HTML.
      if (res.status === 530) {
        console.error("BACKEND_URL does not resolve:", backendOrigin(env));
        return Response.json({ detail: "The CRM server address (BACKEND_URL) no longer resolves." }, { status: 502 });
      }
      return res;
    } catch (error) {
      console.error("Backend unreachable:", error);
      return Response.json({ detail: "The CRM server is starting or unreachable. Try again in a minute." }, { status: 502 });
    }
  },

  async scheduled(_event: unknown, env: Env, ctx: { waitUntil(p: Promise<unknown>): void }): Promise<void> {
    if (!env.BACKEND_URL) return;
    ctx.waitUntil(
      fetch(`${backendOrigin(env)}/livez`, { signal: AbortSignal.timeout(60_000) })
        .then((res) => { if (!res.ok) console.error("Keep-awake ping:", res.status); })
        .catch((error) => console.error("Keep-awake ping failed:", error)),
    );
  },
};
