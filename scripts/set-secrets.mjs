// Sets the backend secrets on the Worker for `npm run deploy:all`, reading backend/.env.
// Usage: node scripts/set-secrets.mjs   (DATABASE_URL must be the Neon string in backend/.env or the environment)
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const env = { ...process.env };
try {
  for (const line of readFileSync("backend/.env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !(m[1] in env)) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const names = ["DATABASE_URL", "SECRET_KEY", "STOREFRONT_INTEGRATION_TOKEN", "DEFAULT_ADMIN_EMAIL", "DEFAULT_ADMIN_PASSWORD"];
for (const name of names) {
  if (!env[name]) { console.log(`skip ${name} (not set)`); continue; }
  const r = spawnSync("npx", ["wrangler", "secret", "put", name, "-c", "wrangler.containers.jsonc"],
    { input: env[name], stdio: ["pipe", "inherit", "inherit"], shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
