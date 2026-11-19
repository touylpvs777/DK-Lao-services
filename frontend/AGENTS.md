# Frontend — DK LAO CRM/ERP staff screens

A **React 19 + Vite 8** single-page app. It is **not** a Next.js project: the
`next.config.ts`, `next-env.d.ts` and `pages/` files that used to sit here were
leftovers from an abandoned experiment and have been removed. Do not reintroduce
them, and do not follow Next.js conventions (no App Router, no `pages/`, no
server components, no `next/*` imports).

## Stack

| Concern | Tool |
| --- | --- |
| Build / dev server | Vite 8 (`vite.config.ts`) |
| UI | React 19, Base UI, Tailwind CSS **3** (`tailwind.config.js`) |
| Routing | React Router 7 |
| Server state | TanStack Query 5 |
| Client state | Zustand |
| Tables | TanStack Table 8 |
| Forms | React Hook Form + Zod |
| Charts / maps | Recharts, Leaflet |
| i18n | i18next (`src/i18n/*.json` — lo, th, en, zh, vi, fr, ru, ar) |
| Export | `xlsx` (lazy-loaded; see the `vendor-xlsx` chunk) |

Config files are **single**, not duplicated: `eslint.config.js`,
`postcss.config.js`, `tailwind.config.js`. If you find a `.mjs` twin of any of
them, it is a leftover — delete it rather than edit it.

## Commands

```bash
npm ci          # install
npm run dev     # Vite dev server on :5173, proxies /api -> http://localhost:8001
npm run lint    # ESLint
npx tsc -b      # type check (what CI runs)
npm run build   # tsc -b && vite build
npm run cf:build # production build for the Cloudflare Worker
```

## Conventions

- Import with the `@/` alias (`@/components/...`), configured in both
  `vite.config.ts` and `tsconfig.app.json`.
- API calls live in `src/api/*.ts` and go through `src/api/client.ts`; do not
  call `axios` or `fetch` directly from a component.
- Resolve any image or file URL through `resolveMediaUrl()` in
  `src/utils/media.ts`. Backend uploads are served from `/uploads/...`.
- Keep user-facing strings in `src/i18n/*.json`, not hard-coded in components.
- The build output must stay deployable to a Cloudflare Worker, so keep
  `public/` small: product and spare-part photos belong in the backend upload
  store (`POST /api/v1/uploads/images`), **not** in this repository.

## Do not commit

Build artefacts and one-off scripts: `tsconfig.tsbuildinfo`, `vite_output.txt`,
`dist/`, and throwaway codemods (`fix*.mjs`, `fix*.cjs`, `clean_imports.cjs`).
`.gitignore` covers these; if you need a codemod, run it and delete it.
