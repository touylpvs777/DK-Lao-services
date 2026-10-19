# Running the CRM on free cloud plans (no domain, PC can be off)

| Part | Where | Address |
|---|---|---|
| Website (DK-LUD repo) | Cloudflare Worker `dk-lud` | https://dk-lud.dk-lud.workers.dev |
| Staff CRM screens (`frontend/`) | Cloudflare Worker `dk-lao-services` | https://dk-lao-services.dk-lud.workers.dev |
| CRM API (`backend/`) | Render free web service `dk-crm-api` | https://dk-crm-api.onrender.com |
| Database | Neon free Postgres | — |

The `dk-lao-services` Worker serves the screens and forwards `/api`, `/uploads` and `/health` to Render, like
nginx does in Docker, so the browser needs no CORS. Every 10 minutes its cron pings the backend's `/livez`
so the free Render service does not fall asleep. `/livez` skips the database, so Neon can still suspend
when nobody is using the CRM.

## 1. Database (Neon)

1. Sign up at https://neon.tech, create a project in the Singapore region (closest to Laos).
2. Copy the connection string (Connect → the **direct** one, without `-pooler`).
3. Copy the local data across (Git Bash, Docker running):
   ```bash
   NEON_DATABASE_URL='postgresql://…' bash scripts/migrate-db-to-neon.sh
   ```

## 2. Backend (Render)

1. Push this repository to GitHub.
2. Render dashboard → **New → Blueprint** → choose the repository. It reads `render.yaml`.
3. Fill in when asked: `DATABASE_URL` (the Neon string as printed), `STOREFRONT_INTEGRATION_TOKEN`
   (from `backend/.env`), `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD`.
4. When it is live, open `https://<service>.onrender.com/health`: `"database": "ok"`.
   If Render gave the service a different address, use that address everywhere below.

## 3. Staff screens (Cloudflare)

The Worker `dk-lao-services` is connected to this repository in the Cloudflare dashboard, so every push
to `main` builds and deploys it. Its build settings: root directory empty (`/`), build command
`npm run build`, deploy command `npx wrangler deploy`. To deploy by hand instead:

```bash
cd frontend
npm run cf:deploy
```
If the backend address differs, change `BACKEND_URL` in `wrangler.jsonc` (repository root) first.
If the Worker address differs, add it to `ALLOWED_ORIGINS` on Render.

## 4. Point the website at the cloud backend

```bash
cd ../DK-LUD   # the website repository
printf '%s' 'https://dk-crm-api.onrender.com' | npx wrangler secret put CRM_API_URL --name dk-lud
curl -s https://dk-lud.dk-lud.workers.dev/api/health   # "crm":"ok"
```
Use Git Bash for `wrangler secret put`: PowerShell adds a byte-order mark to piped text.

## Limits of the free plans

- **Uploaded images are lost when Render redeploys or restarts**: the free plan has no persistent disk.
  Product images in `frontend/public/images` and the website are not affected. Keep uploads to a minimum,
  or move uploads to Cloudflare R2 (free up to 10 GB) before relying on them.
- Render free gives 750 hours a month, enough for one service running all month.
- Neon free has 0.5 GB of storage and a monthly compute allowance; it suspends after 5 idle minutes and
  wakes in about a second.
- If the backend is down, the website keeps working with the last known prices and offers WhatsApp for
  orders.
