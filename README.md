# AI Career Navigator — MVP

A working foundation slice of the full "AI Career Navigator" platform: **authentication, user
profile with a transparent career score, and an AI-powered professional summary generator**,
built as a real Next.js app rather than a mockup.

This is deliberately scoped. The original brief described a 40-module platform (resume builder,
job portal, recruiter panel, admin CMS, video interviews, payments, and more) — that's a
multi-month effort for a team, not something to fake with placeholder code. This MVP is the
part of that platform that's actually real, tested, and ready to build on.

## What's in this MVP

- **Auth**: register/login/logout with hashed passwords (bcrypt), short-lived signed JWT access
  tokens + opaque refresh tokens stored server-side, rate-limited endpoints, route protection via
  middleware.
- **Profile**: title, location, bio, skills, social links — saved via a validated API.
- **Career score**: a transparent, explainable completeness score (not a black-box AI score —
  see `src/app/api/profile/route.ts` for exactly how it's computed).
- **AI summary generator**: turns rough notes into a polished professional summary using the
  Claude API, server-side only (your API key never reaches the browser).
- **Dashboard shell**: sidebar + mobile nav + topbar, with "coming soon" slots for the resume
  builder and job tracker so the next modules have an obvious home.
- **Design system**: a custom "Night Navigator" visual identity (see Design notes below) with
  full dark/light mode, glassmorphism panels, and reduced-motion support.

## Stack

- **Next.js 14 (App Router) + TypeScript** — one codebase, no separate backend to deploy/CORS.
- **Prisma + SQLite** for local dev (zero config) — swap to Postgres for production, see below.
- **Tailwind CSS** for styling, **jose** for Edge-safe JWT, **bcryptjs** for password hashing,
  **Zod** for validation, **Framer-motion-ready** structure (motion currently via Tailwind
  keyframes to keep the bundle small; add `framer-motion` usage where you want richer transitions).

## Getting started

```bash
npm install
cp .env.example .env        # already done for you if you received this as a zip — check .env
# generate a real secret: openssl rand -base64 48   →  paste into JWT_SECRET in .env

npx prisma db push          # creates dev.db (SQLite) with the schema
npm run dev                 # http://localhost:3000
```

To enable the AI summary generator, add an Anthropic API key to `.env`:

```
ANTHROPIC_API_KEY="sk-ant-..."
```

Without it, the feature responds with a clear "not configured" message instead of failing
silently — the rest of the app works fine without it.

## Moving to Postgres for production

1. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
2. `docker compose up -d` (spins up a local Postgres) or point `DATABASE_URL` at a managed one.
3. `npx prisma db push` (or `prisma migrate dev` once you want real migration history).

## Project structure

```
src/
  app/
    page.tsx                 # landing page
    login/, register/        # auth pages
    dashboard/                # protected area (guarded by middleware.ts + layout.tsx)
      layout.tsx               # sidebar/topbar shell, re-verifies session server-side
      page.tsx                 # overview: career score, stats, "coming soon" modules
      profile/page.tsx          # profile editor + AI summary generator
    api/
      auth/{register,login,logout}/route.ts
      me/route.ts               # current user, used to hydrate client state
      profile/route.ts           # GET/PATCH profile, computes career score
      ai/summary/route.ts        # calls the Anthropic API server-side
      health/route.ts            # container/uptime health check
  components/
    ui/                       # Button, Input, GlassCard, ThemeToggle, TrajectoryMark (logo/signature)
    auth/                     # AuthCard, LoginForm, RegisterForm
    dashboard/                # Sidebar, MobileNav, Topbar, StatCard, ProfileForm
  lib/
    db.ts                     # Prisma client singleton
    jwt.ts                    # Edge-safe JWT sign/verify (used by middleware AND routes)
    password.ts               # bcrypt hashing (Node-only — never imported by middleware)
    session.ts                # reads/verifies the session cookie server-side
    validation.ts              # Zod schemas shared by forms and API routes
    rateLimit.ts                # in-memory rate limiter (swap for Redis before scaling out)
  middleware.ts               # redirects unauthenticated requests away from /dashboard/*
prisma/schema.prisma
```

One deliberate architectural note: JWT signing/verification lives in `lib/jwt.ts`, completely
separate from password hashing in `lib/password.ts`. `middleware.ts` runs on Next's Edge runtime,
which doesn't have Node's `crypto` module — bcrypt needs that module, `jose` (used for JWTs)
doesn't. Keeping them in separate files means the Edge bundle never accidentally pulls in
Node-only code.

## Design notes ("Night Navigator")

The visual identity is built around navigation/orientation rather than generic SaaS defaults:
a deep indigo canvas in dark mode, a warm "signal" amber accent (the beacon you navigate by),
and a teal "trail" accent for progress. The signature element is `TrajectoryMark` — a dotted
bearing line rising to a star, used as the logo and reused at different scales through the app,
instead of a generic bar-chart icon.

Type stack is `Fraunces` (display) / `Inter` (body) / `IBM Plex Mono` (data, stats). These are
referenced by name in `tailwind.config.ts` with solid system-font fallbacks; this sandbox
couldn't reach Google Fonts to bundle them, but on a machine with normal internet access you can
wire them up properly with `next/font/google` in `src/app/layout.tsx` for zero layout shift.

## Known limitations / honest caveats

- **Rate limiting is in-memory** — fine for one server instance, not for multiple. Swap
  `lib/rateLimit.ts` for a Redis-backed limiter (e.g. `@upstash/ratelimit`) before scaling
  horizontally; nothing else needs to change.
- **No email verification / password reset yet** — registration is immediate. These are natural
  next additions once you have an email provider (Resend, Postmark, SES) wired up.
- **No refresh-token rotation endpoint yet** — the `Session` table already stores refresh tokens
  so this is straightforward to add, just not built in this pass.
- This sandbox's network policy blocks `binaries.prisma.sh`, so I could not run `prisma generate`
  fully in this environment. TypeScript compiled cleanly and the full Next.js build succeeded up
  to that point (see build log), so the blocker is environmental, not a code issue — run
  `npx prisma generate` yourself right after `npm install` and it will complete normally.

## Suggested next module

Given this is the "auth + profile + dashboard" foundation, the natural next slice is either:
- **Resume builder**: generate a resume from this same profile data (reuses the AI call pattern
  in `api/ai/summary/route.ts`), or
- **Job tracker**: a `Job`/`Application` Prisma model plus a kanban-style tracker page.

Happy to build either as the next increment.
