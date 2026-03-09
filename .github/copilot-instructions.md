# Copilot / AI agent instructions for Modern Day Circus Manager

This project is a Next.js (App Router) site with small serverless API routes that forward work to an n8n instance. The goal of these notes is to help an AI coding agent be productive immediately by highlighting the architecture, conventions, and concrete examples.

- **Big picture:** The UX/frontend lives in the `app/` folder (Next 16+ App Router). Client UI components live in `components/marketing/` and are mounted from pages under `app/`. Small server-side API handlers live in `app/api/*/route.ts` and are thin validators that forward payloads to `lib/n8n.ts`.

- **Key integration:** `lib/n8n.ts` centralizes calls to n8n. It builds a URL from `N8N_BASE_URL` (fallback: `https://moderndaycircus.app.n8n.cloud`) and sends JSON with a hardcoded `x-api-key: moderndaycircus`. n8n may return plain text or JSON; `callN8N` parses JSON with a text fallback.

- **API pattern to follow:** API routes are POST-only, use `zod` for payload validation and return `NextResponse`. Example: see [app/api/agent/route.ts](app/api/agent/route.ts). Typical flow:
  - Parse `await req.json()` then `schema.safeParse`
  - On success call `callN8N('/workflow-path', parsed.data)`
  - On error return `NextResponse.json({ error: '...' }, { status: 400|502 })`

- **Client <> server communication:** Client components use `fetch('/api/agent', { method: 'POST', body: JSON.stringify(...) })` and expect either `{ reply: '...' }` or a JSON object. See `components/marketing/HeroWithChat.tsx` for the chat UX pattern.

- **Environment variables:** For local testing set `N8N_BASE_URL` and `N8N_SECRET` as needed. `lib/n8n.ts` currently ignores `N8N_SECRET` but expects `N8N_BASE_URL` when not using the default cloud URL.

- **Styling & fonts:** Tailwind v4 is used; global colors are applied as CSS variables in `app/layout.tsx` and `app/globals.css`. Fonts are loaded with `next/font/google` into CSS variables (`--font-geist-sans`, `--font-geist-mono`) — prefer preserving those variables when editing layout or global styles.

- **Scripts & dev flow:** Use `npm run dev` (or `pnpm dev`) to start the Next dev server. Build with `npm run build`. Lint with `npm run lint` (ESLint configured). See [package.json](package.json) for exact scripts.

- **Code patterns & conventions:**
  - Use `"use client"` at the top of interactive components (see `components/marketing/*`).
  - Keep API routes minimal: validate with `zod`, forward to `callN8N`, and return simple JSON responses.
  - Prefer server-safe code in `app/` server components; isolate browser-only logic into client components.

- **Notable files to inspect before changing behavior:**
  - [lib/n8n.ts](lib/n8n.ts) — central integration with n8n (error handling, URL building)
  - [app/api/booking/route.ts](app/api/booking/route.ts), [app/api/safety/route.ts](app/api/safety/route.ts), [app/api/release-brief/route.ts](app/api/release-brief/route.ts)
  - [components/marketing/HeroWithChat.tsx](components/marketing/HeroWithChat.tsx) — client fetch pattern and UI expectations
  - [app/layout.tsx](app/layout.tsx) and [app/globals.css](app/globals.css) — global theming and font variables

- **Testing & runtime caveats:**
  - n8n endpoints can return text or JSON; rely on `callN8N` fallback behavior.
  - API handlers assume `POST` requests with JSON bodies. Unit tests are not present in the repo; keep changes small and verify by running `npm run dev` and exercising the relevant UI flows (e.g. chat, booking form).

- **When making edits:**
  - Preserve the `zod` validation pattern in API routes.
  - If adding new API endpoints that call n8n, reuse `callN8N(path, body)` and match existing response shapes (`{ reply: '...' }` or JSON body).
  - Update `N8N_BASE_URL` in environment for integration testing. For CI or Vercel deployments, ensure your deployment secrets reflect the same key names.

- **Examples (copy/paste snippets):**
  - Call n8n from server code: `await callN8N('/webhook/booking', { name, email })` — see [app/api/booking/route.ts](app/api/booking/route.ts).
  - Client chat send: `fetch('/api/agent', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ message, context }) })` — see `HeroWithChat.tsx`.

If anything above is unclear or you want this file expanded with test/run commands, CI notes, or additional code examples, tell me which area to expand and I will iterate.
