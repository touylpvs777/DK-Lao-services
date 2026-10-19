# Running the CRM on a server (Docker)

Three containers plus an optional HTTPS tunnel:

| Service | What it is | Reachable from |
|---|---|---|
| `frontend` | The staff CRM screens and the reverse proxy (nginx). Forwards `/api/`, `/uploads/` and `/health` to the backend. | Port 80 |
| `backend` | The CRM API. Hidden behind nginx. | `127.0.0.1:8001` only |
| `db` | PostgreSQL. | `127.0.0.1:${DB_PORT}` only |
| `cloudflared` (optional, profile `tunnel`) | Public HTTPS without opening a router port. | Cloudflare |

## Variables

Put these in the `.env` next to `docker-compose.yml` (or pass `--env-file`):

| Variable | Purpose |
|---|---|
| `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` | PostgreSQL credentials and the local port |
| `SECRET_KEY` | Signs login tokens. At least 32 random characters: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `CLOUDFLARE_TUNNEL_TOKEN` | Only for the tunnel |

`backend/.env` is also read by the backend. Set these there:

| Variable | Value |
|---|---|
| `ALLOWED_ORIGINS` | JSON list of the real HTTPS addresses, e.g. `["https://crm.example.com"]` |
| `STOREFRONT_INTEGRATION_TOKEN` | At least 32 random characters. The website uses the same value as `CRM_STOREFRONT_TOKEN` |
| `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD` | First admin on an empty database. Password of 12+ characters |

Compose sets `ENVIRONMENT=production`. In production the backend refuses to start with a placeholder
`SECRET_KEY`, `DEBUG=true`, `ALLOWED_ORIGINS=["*"]` or a short storefront token, hides `/docs`, and never
creates an admin with a built-in password.

## Start

```
docker compose up -d --build
docker compose --profile tunnel up -d     # adds the HTTPS tunnel
```

In the Cloudflare Zero Trust dashboard create a tunnel, copy its token into `CLOUDFLARE_TUNNEL_TOKEN`,
and add a public hostname (for example `crm.example.com`) with the service `http://frontend:80`.

## Connect the website

The website is the DK-LUD repo, deployed as the `dk-lud` Worker. On it set `CRM_API_URL=https://crm.example.com`
and the secret `CRM_STOREFRONT_TOKEN` (same value as `STOREFRONT_INTEGRATION_TOKEN`). One address serves both
the staff screens and the API, so no separate API hostname is needed. The website calls the CRM from its
server only, so its domain does not go in `ALLOWED_ORIGINS`. Check the connection at `https://<website>/api/health`.

## Keep in mind

- A server needs to be on all the time. A Windows PC works only while it is on and Docker Desktop is running.
- Back up the `pgdata` and `uploads` volumes.
- Change a leftover default admin password now: the backend logs a critical message at start if it finds one.
