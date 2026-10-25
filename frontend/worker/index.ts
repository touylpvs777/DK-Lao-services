/**
 * The CRM (screens + API) now runs as one Render service, see Dockerfile.render. A Worker cannot call
 * *.onrender.com (Cloudflare answers 530 "origin DNS error"), so it no longer proxies. This Worker only
 * keeps the old address working by redirecting every request to the Render service.
 */

interface Env {
  BACKEND_URL: string; // e.g. https://dk-crm-web.onrender.com
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const target = env.BACKEND_URL.trim().replace(/\/+$/, "") + url.pathname + url.search;
    // 307 keeps the method and body for any non-GET request.
    return Response.redirect(target, 307);
  },
};
