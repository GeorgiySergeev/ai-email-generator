# AI Email Generator

> **Status: Planning / Pre-implementation.** This repository contains architecture
> documentation and a phased implementation plan. No application code exists yet.
> See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) to build from scratch.

> Generate professional, casual, formal, or persuasive emails in seconds using AI.  
> MVP built in 48 hours as part of a Vibe Coder / AI-First Developer test assignment.

[![CI](https://github.com/your-username/ai-email-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/ai-email-generator/actions)
[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://your-project.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)

## Created demo@example.com (free)

## Created pro@example.com (pro)

## Created email: Quarterly report

## Created email: Meeting invitation

<!-- TODO: Replace with real URLs after first deploy -->

**Live URL:** [https://your-project.vercel.app](https://your-project.vercel.app)  
**GitHub:** [https://github.com/your-username/ai-email-generator](https://github.com/your-username/ai-email-generator)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Docker](#docker)
- [Key Architectural Decisions](#key-architectural-decisions)
- [AI Development Report](#ai-development-report)

---

## Features

- **Landing Page** — hero, features, live demo (no auth required), FAQ, pricing preview, CTA
- **Authentication** — register, login, logout via Supabase Auth
- **Dashboard** — generate emails with subject, tone (5 options), and length (3 options)
- **AI Generation** — Anthropic Claude (Haiku) or deterministic Mock (switchable via env)
- **Email History** — view, copy, and delete previously generated emails
- **Pricing Page** — Free / Pro / Enterprise plans with monthly/yearly toggle
- **Profile Page** — view and update user details
- **Error Handling** — global error boundary, 404 page, toast notifications; no white screens
- **Responsive** — mobile (375px), tablet (768px), desktop (1440px)
- **i18n** — English and Russian via next-intl
- **Animations** — Framer Motion (hero, scroll-reveal, route transitions)
- **Docker** — multi-stage Dockerfile + docker-compose for local dev
- **CI/CD** — GitHub Actions (lint + typecheck + test on PR, deploy to Vercel on merge)

---

## Tech Stack

| Layer           | Technology                              | Version |
| --------------- | --------------------------------------- | ------- |
| Framework       | Next.js (App Router)                    | 15.x    |
| Language        | TypeScript (strict)                     | 5.x     |
| Styling         | Tailwind CSS                            | 4.x     |
| UI Components   | shadcn/ui + Radix UI                    | latest  |
| Animations      | Framer Motion                           | 11.x    |
| Auth + Database | Supabase                                | 2.x     |
| Validation      | Zod                                     | 3.x     |
| Forms           | React Hook Form                         | 7.x     |
| Server State    | Server Actions + revalidatePath         | —       |
| Client State    | Zustand                                 | 5.x     |
| AI Provider     | Anthropic Claude Haiku / Mock           | —       |
| i18n            | next-intl                               | 3.x     |
| Package Manager | Bun                                     | 1.x     |
| Testing         | bun test + Testing Library + Playwright | —       |
| Deploy          | Vercel                                  | —       |
| Containers      | Docker (`oven/bun` image)               | —       |
| CI/CD           | GitHub Actions                          | —       |

---

## Project Structure

```
ai-email-generator/
├── .github/
│   └── workflows/
│       ├── ci.yml             # lint + typecheck + test on PR
│       └── deploy.yml         # deploy to Vercel on main merge
├── docker/
│   ├── Dockerfile             # multi-stage production build
│   └── docker-compose.yml     # local development stack
├── docs/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── reports/               # per-phase test reports
├── messages/
│   ├── en.json                # English translations
│   └── ru.json                # Russian translations
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── (marketing)/       # Public: Landing page, Pricing
│   │   ├── (auth)/            # Login, Register
│   │   ├── (dashboard)/       # Protected: Dashboard, Profile, History
│   │   ├── api/webhooks/      # Future: Stripe webhooks
│   │   ├── error.tsx          # Global error boundary
│   │   ├── not-found.tsx      # 404 page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Design tokens (@theme)
│   ├── components/
│   │   ├── ui/                # shadcn/ui (auto-generated, do not edit)
│   │   ├── marketing/         # Landing page sections
│   │   ├── auth/              # Login / Register forms
│   │   ├── dashboard/         # Email generator, history, sidebar
│   │   ├── pricing/           # Pricing cards
│   │   └── shared/            # Header, Footer, shared components
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── types.ts       # AIProvider interface
│   │   │   ├── factory.ts     # getAIProvider() — env-based factory
│   │   │   └── providers/
│   │   │       ├── mock.ts    # Deterministic mock
│   │   │       └── claude.ts  # Anthropic Claude Haiku
│   │   ├── supabase/
│   │   │   ├── client.ts      # Browser client
│   │   │   └── server.ts      # Server client (cookies)
│   │   ├── validations/
│   │   │   ├── auth.ts        # LoginSchema, RegisterSchema
│   │   │   ├── email-generator.ts # GenerateEmailSchema
│   │   │   └── profile.ts     # UpdateProfileSchema
│   │   └── utils.ts           # cn(), formatDate()
│   ├── hooks/                 # Custom React hooks
│   ├── store/
│   │   ├── generator-store.ts # Zustand: form + result state
│   │   └── ui-store.ts        # Zustand: modals, sidebar
│   ├── actions/
│   │   ├── auth.ts            # loginAction, registerAction, logoutAction
│   │   ├── email.ts           # generateEmailAction, deleteEmailAction
│   │   └── profile.ts         # updateProfileAction
│   └── types/
│       ├── index.ts           # All project types
│       ├── ai.ts              # AI provider types
│       └── database.ts        # Supabase auto-generated types
├── tests/
│   ├── unit/                  # Vitest unit tests
│   ├── integration/           # Vitest integration tests
│   └── e2e/playwright/        # Playwright e2e tests
├── middleware.ts              # Route protection (Supabase session check)
├── next.config.ts
├── tsconfig.json
├── playwright.config.ts
├── ARCHITECTURE.md            # Full stack decisions & architecture
├── SPEC.md                    # Functional & non-functional requirements
├── RULES.md                   # Code standards (TypeScript, Tailwind, Context7)
├── AGENT.md                   # LLM agent context guide
├── IMPLEMENTATION_PLAN.md     # Phased plan with LLM prompts per step
└── .env.example
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.x (`curl -fsSL https://bun.sh/install | bash`)
- A [Supabase](https://supabase.com) project (free tier is sufficient)
- (Optional) Anthropic API key for real AI generation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-email-generator.git
cd ai-email-generator
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI Provider: "mock" (default, no API key needed) or "claude"
AI_PROVIDER=mock
ANTHROPIC_API_KEY=        # only if AI_PROVIDER=claude

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up the database

Run the migration in your Supabase project (SQL Editor):

```bash
# Open docs/migrations/001_initial_schema.sql and run its contents in Supabase SQL Editor
```

Or if you have the Supabase CLI:

```bash
bunx supabase db push
```

### 5. Generate TypeScript types from your schema

```bash
# Requires SUPABASE_PROJECT_ID in .env.local
bun run gen:types
```

### 6. Start the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable                        | Required | Description                             |
| ------------------------------- | -------- | --------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | ✅       | Your Supabase project URL               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅       | Supabase anon (public) key              |
| `SUPABASE_SERVICE_ROLE_KEY`     | ⚠️       | Only needed for admin operations        |
| `AI_PROVIDER`                   | ✅       | `mock` (default) or `claude`            |
| `ANTHROPIC_API_KEY`             | ⚠️       | Required only when `AI_PROVIDER=claude` |
| `NEXT_PUBLIC_APP_URL`           | ✅       | Public URL of the app                   |
| `SUPABASE_PROJECT_ID`           | ⚠️       | Required for `bun run gen:types`        |

---

## Running Tests

```bash
# Unit + integration tests (bun test)
bun test

# Watch mode
bun test --watch

# With DOM (React component tests via happy-dom)
bun test --dom

# Coverage report
bun test --coverage

# End-to-end tests (Playwright)
bun run test:e2e

# Type check
bun run typecheck

# Lint
bun run lint
```

---

## Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged) to enforce code quality on every commit.

**Setup (first time only):**

```bash
bun run prepare
```

**What runs automatically on `git commit`:**

- ESLint + Prettier on staged `.ts`, `.tsx`, `.json`, `.md` files
- Full TypeScript check (`bun run typecheck`)

Hooks are mandatory — never skip with `--no-verify` unless explicitly approved.

---

## Database Seeding

Seed development data (demo users + sample emails) for local development:

```bash
# Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
bun run db:seed
```

**Creates:**

- `demo@example.com` / `password123` (Free plan)
- `pro@example.com` / `password123` (Pro plan)
- 2 sample emails for demo user

---

## Docker

### Development

```bash
# Start with docker-compose
docker compose -f docker/docker-compose.yml up

# Or build and run manually
docker build -f docker/Dockerfile -t ai-email-gen .
docker run -p 3000:3000 --env-file .env.local ai-email-gen
```

### Production build

The Dockerfile uses a multi-stage build on `oven/bun:1-alpine`:

1. **builder** — `bun install --frozen-lockfile` + `bun run build`
2. **runner** — minimal Alpine image with `standalone` Next.js output

The output is ~50 MB, runs as a non-root user.

---

## Key Architectural Decisions

Full rationale for every decision is in [ARCHITECTURE.md](./ARCHITECTURE.md). Summary:

**Next.js 15 (App Router) over alternatives**  
Single repo, SSR for Landing Page SEO, built-in API Routes, zero-config Vercel deploy. Middleware protects dashboard routes without client-side redirect flicker.

**Supabase over Firebase / Auth0 / Prisma+PlanetScale**  
One platform for Auth + PostgreSQL + RLS. Free tier covers MVP. Row Level Security means user data isolation is enforced at the DB layer — no extra middleware checks needed.

**AI Provider Pattern (Strategy)**  
`getAIProvider()` reads `AI_PROVIDER` env and returns `ClaudeProvider` or `MockProvider`, both implementing the same `AIProvider` interface. Switching providers requires zero code changes. Adding OpenAI or Gemini takes ~10 minutes.

**Tailwind 4 + shadcn/ui over MUI / Chakra**  
shadcn/ui copies components into the project (no vendor lock-in). Radix primitives provide accessibility out of the box. Tailwind 4 CSS-first config keeps the design system in one `globals.css` file.

**Zod over Yup / class-validator**  
TypeScript-first inference: `z.infer<typeof schema>` gives exact types. Works end-to-end: API validation, form validation (via RHF resolver), AI response parsing. No `any` at system boundaries.

**Server Actions over REST endpoints**  
Mutations are type-safe end-to-end without a separate API layer. CSRF protection built in. `redirect()` and `revalidatePath()` work natively after mutations.

**Zustand over Redux**  
Only client UI state is managed in Zustand (form values, modal state). Server state is fetched via Server Components + mutations go through Server Actions (revalidatePath for cache invalidation). Zustand stores are ~10 lines each, no boilerplate.

---

## AI Development Report

> TODO: `docs/AI_DEVELOPMENT_REPORT.md` will be written after Phase 6 completion.

### AI Tools Used

| Tool                                 | Role                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------- |
| **Claude (Anthropic)** — Cowork mode | Architecture design, documentation, code generation, code review       |
| **Claude Code**                      | Scaffolding, file creation, iterative editing                          |
| **Context7 MCP**                     | Fetching up-to-date library docs (Next.js, Supabase, Tailwind, shadcn) |
| **GitNexus**                         | Project context management across LLM sessions                         |

### Development Process

The project was built using a structured AI-assisted workflow:

1. **Phase 0 — Architecture & Documentation**  
   Prompted Claude to produce `ARCHITECTURE.md`, `SPEC.md`, `RULES.md`, `AGENT.md`, and `IMPLEMENTATION_PLAN.md` before writing a single line of application code. This gave every subsequent LLM prompt a stable, structured context to work from.

2. **Phase 1–6 — Iterative Implementation**  
   Each step from `IMPLEMENTATION_PLAN.md` was executed as a focused LLM prompt with explicit GitNexus context references. Context7 was called before every library integration to get current API docs.

3. **Testing at Every Step**  
   Each prompt ended with a test checklist. Regression tests ran at the end of each phase. Reports were written to `docs/reports/`.

### Key Prompts (selected)

1. **Architecture design** — "Design the full tech stack for an MVP AI Email Generator. Justify every choice, list rejected alternatives."
2. **RULES.md generation** — "Write comprehensive development rules covering TypeScript, Tailwind, functional approach, Context7 usage, naming conventions."
3. **AI Provider Pattern** — "Implement a Strategy pattern for AI providers with ClaudeProvider and MockProvider, switchable via env."
4. **Supabase schema** — "Write SQL migrations for profiles and generated_emails tables with RLS policies and an auto-create-profile trigger."
5. **Supabase SSR clients** — (after Context7 → supabase-ssr) "Create browser and server Supabase clients for Next.js 15 App Router following current SSR docs."
6. **Next.js Middleware** — (after Context7 → next.js) "Write middleware that protects /dashboard routes and redirects authenticated users away from /login."
7. **Zod schemas** — "Create LoginSchema, RegisterSchema, GenerateEmailSchema with proper error messages and TypeScript inference."
8. **Server Actions** — "Implement loginAction, registerAction, logoutAction as typed Server Actions returning ActionResult<T>."
9. **Email Generator form** — "Build the EmailGeneratorForm client component using React Hook Form + Zod + Zustand for result state."
10. **Landing Page Hero** — "Create an animated hero section with Framer Motion: fade-in + slide-up for title, gradient blob decoration, two CTA buttons."
11. **Scroll-reveal sections** — "Add Framer Motion whileInView animations to Features and FAQ sections."
12. **Demo section** — "Build a demo email generator section that works without authentication, using the mock AI provider directly."
13. **Pricing page** — "Create a Pricing page with 3 plans (Free/Pro/Enterprise), a monthly/yearly toggle (Zustand), and Pro card visually highlighted."
14. **Error boundaries** — "Implement error.tsx and not-found.tsx with recovery UI. Add toast notifications for AI failures."
15. **i18n setup** — (after Context7 → next-intl) "Configure next-intl for EN/RU with App Router, add language switcher to header."
16. **Docker multi-stage** — "Write a multi-stage Dockerfile (builder → runner Alpine) with standalone Next.js output."
17. **GitHub Actions CI** — "Create a CI workflow: typecheck + lint + test on PR, deploy to Vercel on main merge."
18. **Playwright e2e** — "Write Playwright tests for auth flow (register → dashboard) and generate email flow (form → result → history)."
19. **Performance audit** — "Review the Landing Page for Lighthouse Performance. Identify and fix LCP and FCP issues."
20. **Final deploy checklist** — "Run full pre-deploy checklist: typecheck, lint, build, e2e tests. Fix all issues. Update README with live URL."

---

## License

MIT
