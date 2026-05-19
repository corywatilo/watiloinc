# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project

**Watilo Inc.** &mdash; a personal site for Cory Watilo that reads like a small company. Single Next.js app, deployed to Vercel.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- PostHog: `posthog-js` (browser) + `posthog-node` (server)
- Licensed fonts served from Cloudflare R2 via a Worker (see Fonts below)
- Package manager: **pnpm** &mdash; always use `pnpm`, never `npm`/`yarn`

## Layout

- `src/app/` &mdash; routes, layouts, and route-colocated components
- `src/components/` &mdash; shared UI (create as needed)
- `src/lib/` &mdash; shared utilities and server-only helpers (e.g. `posthog-server.ts`)
- `@/*` alias maps to `src/*`

## Common commands

```bash
pnpm dev          # dev server
pnpm build        # production build
pnpm lint         # eslint
```

## PostHog

This site sends events to **PostHog project 30022**. When the user asks anything analytics-related (event volumes, conversion, feature-flag rollouts, top pages, error tracking, etc.), prefer the PostHog MCP server over guessing &mdash; specifically `mcp__claude_ai_PostHog__exec` (which requires auth + switching to that project first).

Env vars (see [.env.local.example](.env.local.example)):

- `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` &mdash; client, exposed to the browser
- `POSTHOG_KEY` / `POSTHOG_HOST` &mdash; server, never exposed

Client provider lives at [src/app/providers.tsx](src/app/providers.tsx); App Router pageview tracking at [src/app/PostHogPageView.tsx](src/app/PostHogPageView.tsx). `capture_pageview` is intentionally `false` &mdash; pageviews are fired manually on route change so client-side nav is captured correctly.

Server-side capture uses the singleton from [src/lib/posthog-server.ts](src/lib/posthog-server.ts). In serverless route handlers, remember to `await client.shutdown()` (or set `flushAt: 1`) before returning so events flush before the function exits.

## Fonts

Two licensed Fontspring families, served from a Cloudflare Worker backed by an R2 bucket. The repo is public so the font binaries can't live here.

- **`font-display`** (Tailwind class) &rarr; `"ZT Bros Oskon 90s Expanded"` &mdash; **bold + bold-italic only**. Use for site headers, nav, prominent UI. Don't use `font-normal` with this family; the browser will fake a regular weight from the bold cut.
- **`font-body`** (Tailwind class, applied to `<body>` by default) &rarr; `"ZT Bros Oskon 90s ExtraExpanded"` &mdash; regular / italic / bold / bold-italic. Use for content (long-form text, paragraphs).

Tokens live in [src/app/globals.css](src/app/globals.css) under `@theme`; Tailwind v4 auto-generates the utilities.

### Architecture

- Source of truth for cuts: [src/lib/fonts.ts](src/lib/fonts.ts) (`FONTS` array).
- Dynamic CSS endpoint: [src/app/fonts.css/route.ts](src/app/fonts.css/route.ts) emits `@font-face` declarations pointing at the Worker. Appends `?k=$FONT_ACCESS_KEY` server-side when the env var is set (dev only).
- Loaded in [src/app/layout.tsx](src/app/layout.tsx) via `<link rel="stylesheet" href="/fonts.css">` plus a `preload` for the most-used cut.

### Worker

- Code: [workers/fonts/src/index.ts](workers/fonts/src/index.ts), config: [workers/fonts/wrangler.jsonc](workers/fonts/wrangler.jsonc).
- Deployed name: `watilo-fonts` at `https://watilo-fonts.watiloinc.workers.dev`.
- R2 bucket: `watilo-fonts` (12 objects: 6 cuts &times; woff2 + woff).
- Auth policy (any one is sufficient):
  1. `?k=<token>` matches the `FONT_ACCESS_KEY` worker secret.
  2. `Origin` (or `Referer`) matches `https://watilo.com`, `https://www.watilo.com`, ends with `.vercel.app` (HTTPS), or is `http://localhost:3000`.
- Anything else returns **403**.

### Deploy & operate

From repo root:

```bash
# Re-deploy after editing worker code
pnpm wrangler deploy --config workers/fonts/wrangler.jsonc

# Rotate the worker secret (don't forget to update FONT_ACCESS_KEY in .env.local + Vercel)
pnpm wrangler secret put FONT_ACCESS_KEY --config workers/fonts/wrangler.jsonc

# Inspect R2 contents
pnpm wrangler r2 object list watilo-fonts
```

### Env vars

- `NEXT_PUBLIC_FONT_HOST` &mdash; full URL of the worker, e.g. `https://watilo-fonts.watiloinc.workers.dev`. Required at both build and runtime.
- `FONT_ACCESS_KEY` &mdash; server-only secret. Set locally in `.env.local`; **do not** set in Vercel production env (Origin check guards prod, and shipping the key to the browser via the generated CSS would defeat the protection).

## Conventions

- Tailwind-first styling. No CSS modules unless there's a strong reason.
- Keep components colocated with their route under `src/app/` until they're reused, then promote to `src/components/`.
- No premature abstractions &mdash; three similar lines are fine.
- Don't add comments that just describe what the code does; only document non-obvious *why*.

## Skills worth invoking

These exist in this harness; load via the Skill tool when relevant:

- `simplify` &mdash; run before declaring a change done; catches duplication/dead code
- `figma:figma-generate-design` &mdash; for translating an app page or layout into Figma
- `figma:figma-use` &mdash; mandatory prereq before any `use_figma` write
- `claude-api` &mdash; only relevant if we add an Anthropic SDK feature

## Out of scope (not yet, but planned)

- Design system / component library
- Real content (writing, projects)
- Reverse-proxying PostHog ingestion through Next rewrites (to dodge adblockers)
