# DK LAO — Services CRM / ERP

Staff system for DK LAO's forklift business: customers and sales pipeline,
quotations, sales orders, delivery notes, invoices and receipts, rentals,
maintenance and work orders, spare parts and warehouse stock, forklift fleet
(with GPS and hour-meter telemetry), projects, and reporting.

Customers do not log in. The public website talks to this system over a small
token-protected integration (see [Website integration](#website-integration)).

## Stack

| Layer | Technology |
| --- | --- |
| API | FastAPI, SQLAlchemy 2 (async), Pydantic v2, Alembic |
| Database | PostgreSQL (production) · SQLite (local default) |
| Auth | JWT access/refresh (python-jose) + bcrypt, role-based permissions |
| Jobs | APScheduler (recurring billing, maintenance schedules) |
| Frontend | React 19, Vite 8, TanStack Query/Table, Zustand, React Router 7 |
| UI | Tailwind CSS 3, Base UI, Recharts, Leaflet |
| i18n | i18next — Lao, Thai, English, Chinese, Vietnamese, French, Russian, Arabic |

## Layout

```
backend/              FastAPI service
  app/routes/         35 route modules, all mounted under /api/v1
  app/models/         73 SQLAlchemy models
  app/services/       49 service classes (business rules live here, not in routes)
  app/core/           settings, security, permissions, middleware
  app/tests/          pytest suite
  migrations/         Alembic revisions
frontend/             React + Vite single-page app (staff screens)
  src/api/            typed API client, one module per domain
  src/pages/          25 screen groups
  src/i18n/           translation files
CRM-System/docs/      architecture, data model, design and roadmap documents
scripts/              operational scripts (database migration to Neon)
```

## Run it locally

Backend — needs Python 3.12:

```bash
cd backend
python -m venv .venv && . .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                            # then edit it
uvicorn app.main:app --reload --port 8001
```

With no `DATABASE_URL` it uses SQLite (`crm.db`) and creates the schema on
start. For PostgreSQL see [setup.md](setup.md).

Create the first administrator (the app never creates one by itself):

```bash
DEFAULT_ADMIN_EMAIL=you@example.com DEFAULT_ADMIN_PASSWORD='at-least-12-chars' python seed_admin.py
```

Frontend — needs Node 22:

```bash
cd frontend
npm ci
npm run dev        # http://localhost:5173, proxies /api to http://localhost:8001
```

API documentation is at `http://localhost:8001/docs` outside production.

## Checks

```bash
cd backend  && pytest -q      # 151 tests
cd frontend && npx tsc -b     # type check
cd frontend && npm run lint
cd frontend && npm run build
```

CI (`.github/workflows/ci.yml`) runs these on every push and pull request to
`main`, plus `pip-audit` and `npm audit` for known-vulnerable dependencies.

## Settings

Everything is read from the environment; `backend/.env.example` documents each
value. The ones that matter most:

| Variable | Purpose |
| --- | --- |
| `ENVIRONMENT` | `production` turns off `/docs`, refuses unsafe settings, and never seeds an admin |
| `DATABASE_URL` | PostgreSQL connection string; empty means local SQLite |
| `SECRET_KEY` | Signs login tokens. 32+ random characters, different per environment |
| `ALLOWED_ORIGINS` | JSON list of the real site origins. Never `["*"]` |
| `STOREFRONT_INTEGRATION_TOKEN` | Shared secret for the website integration. Empty disables it |
| `WHATSAPP_*`, `SMTP_*` | Notification channels |
| `IOT_WEBHOOK_API_KEY` | Authenticates the forklift telemetry webhook |

In production the service **refuses to start** when `SECRET_KEY` is the
placeholder or shorter than 32 characters, when `DEBUG` is on, when
`ALLOWED_ORIGINS` contains `*`, or when a storefront token is set but too
short (`app/core/config.py`, `production_problems()`).

## Website integration

Three endpoints are meant for the public website, all authenticated with the
`X-Storefront-Token` header (compared in constant time). They answer `503`
when `STOREFRONT_INTEGRATION_TOKEN` is unset and `401` when the token is wrong.

| Endpoint | Purpose |
| --- | --- |
| `POST /api/v1/leads/website-inquiries` | Receive a service or store-order inquiry and file it as a lead |
| `GET /api/v1/storefront/catalog` | Published spare parts: retail price and whether they can be ordered. Never internal cost or warehouse quantities |
| `GET /api/v1/storefront/orders/track` | Let a customer follow an order with its `WEB-000123` reference and the phone number used |

An inquiry becomes a `Lead` with `source=website` and `status=new`. The system
links it to an existing customer when exactly one matches on phone (last eight
digits) or email, alerts every active sales user, and returns the reference.
The website can never create a confirmed sales order: staff verify stock,
pricing and payment first.

> The retail price published by `/storefront/catalog` is currently the stored
> cost multiplied by a hard-coded `1.65` (`app/routes/storefront.py`). That
> figure is a placeholder, not an approved pricing policy — agree the real rule
> and make it a setting before the catalog goes public.

## Images

Product, spare-part and forklift photos belong in the backend upload store, not
in this repository:

```
POST /api/v1/uploads/images     multipart upload, JPEG/PNG/WebP, 5 MB limit
POST /api/v1/uploads/from-url   fetch from a URL (blocks private network addresses)
```

Both return a `/uploads/images/<uuid>.<ext>` URL, which is what
`SparePart.image_url`, `ProductImage.image_url` and `ForkliftPhoto.image_url`
store, and what `/storefront/catalog` publishes to the website. The frontend
resolves it through `resolveMediaUrl()` in `src/utils/media.ts`.

That directory is a Docker volume (`uploads`), so **back it up with the
database** — a release replaces the application, not the volume.

## Deployment

- **Docker Compose** (own server): frontend + nginx, backend, PostgreSQL, and
  an optional Cloudflare tunnel. See [DEPLOY.md](DEPLOY.md).
- **Render + Neon** (free tier): one container serves both the screens and the
  API. See [render.yaml](render.yaml) and [DEPLOY-FREE.md](DEPLOY-FREE.md).
  The free plan sleeps when idle, so expect a slow first request; move to a
  paid plan before staff rely on it daily.
