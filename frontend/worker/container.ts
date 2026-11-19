/**
 * One Cloudflare Worker that serves the staff CRM screens AND runs the backend (FastAPI) in a
 * Cloudflare Container, so a single `wrangler deploy` ships both. Needs the Workers Paid plan and Docker.
 * Config: wrangler.containers.jsonc. The database stays on Neon (DATABASE_URL secret).
 *
 * The Container instance sleeps after SLEEP_AFTER without traffic and starts again on the next request
 * (a cold start takes a few seconds). Its disk is wiped on restart, like Render's free plan.
 */
import { Container, getContainer } from "@cloudflare/containers";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  BACKEND: DurableObjectNamespace<CrmBackend>;
  // Secrets (wrangler secret put) and vars handed to the backend container.
  DATABASE_URL: string;
  SECRET_KEY: string;
  STOREFRONT_INTEGRATION_TOKEN?: string;
  DEFAULT_ADMIN_EMAIL?: string;
  DEFAULT_ADMIN_PASSWORD?: string;
  ALLOWED_ORIGINS?: string;
}

const BACKEND_PATHS = ["/api/", "/uploads/", "/health", "/livez"];

export class CrmBackend extends Container<Env> {
  defaultPort = 8001;
  sleepAfter = "30m";

  constructor(ctx: DurableObject["ctx"], env: Env) {
    super(ctx, env);
    const optional = {
      STOREFRONT_INTEGRATION_TOKEN: env.STOREFRONT_INTEGRATION_TOKEN,
      DEFAULT_ADMIN_EMAIL: env.DEFAULT_ADMIN_EMAIL,
      DEFAULT_ADMIN_PASSWORD: env.DEFAULT_ADMIN_PASSWORD,
      ALLOWED_ORIGINS: env.ALLOWED_ORIGINS,
    };
    this.envVars = {
      ENVIRONMENT: "production",
      PORT: "8001",
      DB_POOL_SIZE: "3",
      DATABASE_URL: env.DATABASE_URL,
      SECRET_KEY: env.SECRET_KEY,
      ...Object.fromEntries(Object.entries(optional).filter(([, v]) => v)),
    } as Record<string, string>;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (!BACKEND_PATHS.some((p) => pathname.startsWith(p))) return env.ASSETS.fetch(request);
    try {
      const headers = new Headers(request.headers);
      const clientIp = request.headers.get("cf-connecting-ip");
      if (clientIp) headers.set("x-forwarded-for", clientIp); // read by the backend's activity log
      headers.set("x-forwarded-proto", "https");
      return await getContainer(env.BACKEND).fetch(new Request(request, { headers }));
    } catch (error) {
      console.error("Backend container unavailable:", error);
      return Response.json({ detail: "The CRM server is starting or unreachable. Try again in a minute." }, { status: 502 });
    }
  },

  // Keeps the container warm; /livez does not touch the database, so Neon can still suspend.
  async scheduled(_event: unknown, env: Env, ctx: { waitUntil(p: Promise<unknown>): void }): Promise<void> {
    ctx.waitUntil(
      getContainer(env.BACKEND)
        .fetch("http://container/livez")
        .then((res) => { if (!res.ok) console.error("Keep-awake ping:", res.status); })
        .catch((error) => console.error("Keep-awake ping failed:", error)),
    );
  },
};
