# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project

**Watilo Inc.** &mdash; a personal site for Cory Watilo that reads like a small company. Single Next.js app, deployed to Vercel.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- PostHog: `posthog-js` (browser) + `posthog-node` (server)
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
