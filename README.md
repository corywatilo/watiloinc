# Watilo Inc.

The personal site of Cory Watilo &mdash; styled like a company, run by one.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, `src/` layout, `@/*` alias)
- TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [PostHog](https://posthog.com) (`posthog-js` + `posthog-node`) &mdash; project `30022`

## Getting started

Prerequisites: Node 20+, [pnpm](https://pnpm.io).

```bash
pnpm install
cp .env.local.example .env.local   # fill in real PostHog keys
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | Lint with ESLint |

## Analytics

Pageviews and events flow into PostHog project **30022**. Client-side capture is wired up in [src/app/providers.tsx](src/app/providers.tsx); App Router pageviews come from [src/app/PostHogPageView.tsx](src/app/PostHogPageView.tsx). Server-side capture is available via [src/lib/posthog-server.ts](src/lib/posthog-server.ts).

## Deploy

Vercel-ready. Set `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `POSTHOG_KEY`, and `POSTHOG_HOST` in the project's environment variables.
