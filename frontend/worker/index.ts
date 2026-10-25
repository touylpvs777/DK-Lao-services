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
    // Browsers that opened the old app still run its PWA service worker, which serves the cached screens
    // and never reaches this redirect. Replace it with one that removes itself and sends open tabs over.
    if (url.pathname === "/sw.js") {
      const home = env.BACKEND_URL.trim().replace(/\/+$/, "") + "/login";
      const script = `self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil((async () => {
  await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
  await self.registration.unregister();
  for (const client of await self.clients.matchAll({ type: "window" })) client.navigate(${JSON.stringify(home)});
})()));`;
      return new Response(script, {
        headers: { "content-type": "text/javascript", "cache-control": "no-store" },
      });
    }
    const target = env.BACKEND_URL.trim().replace(/\/+$/, "") + url.pathname + url.search;
    // 307 keeps the method and body for any non-GET request.
    return Response.redirect(target, 307);
  },
};
