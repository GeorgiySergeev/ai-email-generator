# ARCHITECTURE.md — MVP AI Email Generator

> **Phase 1 · Base Architecture**  
> Status: ✅ Approved  
> Date: 2026-06-26

---

## 1. System Overview

MVP AI Email Generator is a SaaS application with a Landing Page, authentication, an email generation dashboard via LLM, a pricing page, and a user profile. Key constraints: fast MVP (48 h), deploy-ready, clean architecture, AI provider swappable from mock to real without refactoring.

---

## 2. Adopted Technology Stack

| Layer               | Technology                                  | Version              |
| ------------------- | ------------------------------------------- | -------------------- |
| **Framework**       | Next.js (App Router)                        | 15.x                 |
| **Language**        | TypeScript                                  | 5.x                  |
| **Styling**         | Tailwind CSS                                | 4.x                  |
| **UI Components**   | shadcn/ui + Radix UI                        | latest               |
| **Animations**      | Framer Motion                               | 11.x                 |
| **Fonts**           | Orbitron + JetBrains Mono + Share Tech Mono | via next/font        |
| **Design System**   | Cyberpunk (dark-only, neon palette)         | see DESIGN_SYSTEM.md |
| **Auth + DB**       | Supabase                                    | 2.x                  |
| **Validation**      | Zod                                         | 3.x                  |
| **Forms**           | React Hook Form                             | 7.x                  |
| **Server State**    | Server Actions + revalidatePath             | —                    |
| **Client State**    | Zustand                                     | 5.x                  |
| **AI Provider**     | Anthropic Claude API + Mock adapter         | —                    |
| **i18n**            | next-intl                                   | 3.x                  |
| **Package Manager** | Bun                                         | 1.x                  |
| **Testing**         | bun test + Testing Library + Playwright     | —                    |
| **Linting**         | ESLint (flat config) + Prettier             | —                    |
| **CI/CD**           | GitHub Actions                              | —                    |
| **Deploy**          | Vercel                                      | —                    |
| **Containers**      | Docker (`oven/bun` image)                   | —                    |
| **Lib Docs**        | Context7 MCP                                | —                    |

---

## 3. Technology Justification

### 3.1 Next.js 15 (App Router)

**Chosen because:**

- App Router defaults to Server Components → less client JS, better Landing Page SEO.
- Built-in Route Handlers replace a separate Express/Fastify server → less infrastructure.
- Layouts + Route Groups cleanly isolate `(auth)`, `(dashboard)`, `(marketing)`.
- Native Vercel integration → zero-config deploy, Edge Runtime, ISR.
- Middleware for route protection without client-side redirect flicker.
- v15 ships stable `after()` API for post-response tasks and improved cache semantics.

**Critical for MVP:** single repository, single process, no CORS, no separate backend.

### 3.2 TypeScript 5.x

**Chosen because:**

- Catches errors at compile time, especially with Supabase (typed schema) and Zod.
- `strict: true` + `noUncheckedIndexedAccess` eliminates an entire class of runtime errors.
- All AI responses typed through Zod → no `any` at system boundaries.

### 3.3 Tailwind CSS 4.x

**Chosen because:**

- Utility-first → fast layout without inventing class names.
- Tailwind 4 introduces CSS-first config (no `tailwind.config.ts` file needed), native CSS cascade layers, better tree-shaking.
- Design system defined via CSS variables in `@theme` block → single source of truth.
- JIT + purge → production CSS bundle < 10 KB.

### 3.4 shadcn/ui + Radix UI

**Chosen because:**

- shadcn/ui is not a library — it's **copied components**. No vendor lock-in; code lives in the project.
- All components built on Radix UI → WCAG 2.1 AA accessibility out of the box.
- Fully compatible with Tailwind, easily customised.
- Large ecosystem of ready-made blocks (shadcn/charts, etc.).

### 3.5 Framer Motion

**Chosen because:**

- Declarative API that works with Server and Client Components.
- Needed: animated hero section, scroll-reveal for Landing sections, route transitions.
- `AnimatePresence` for smooth mount/unmount of components.

### 3.6 Supabase (Auth + PostgreSQL)

**Chosen because:**

- Single platform: Auth, Database, Storage, Realtime — reduces infrastructure complexity.
- Free tier sufficient for MVP: 500 MB DB, 50,000 MAU.
- Built-in Row Level Security (RLS) — data isolation enforced at the DB layer with no extra middleware.
- Supabase Auth supports: email/password, magic link, OAuth (Google, GitHub).
- `supabase gen types typescript` → auto-generate types from DB schema.
- SSR-compatible client (`@supabase/ssr`) for Next.js App Router.

### 3.7 Zod

**Chosen because:**

- Runtime validation of all input data (API routes, forms, AI responses).
- Automatically infers TypeScript types → `z.infer<typeof schema>`.
- Integrates with React Hook Form via `@hookform/resolvers/zod`.
- Validates and transforms AI responses at system boundaries.

### 3.8 React Hook Form

**Chosen because:**

- Uncontrolled form → no re-render on every keystroke.
- Native Zod integration via resolver.
- Supports `useFormState` for Server Actions.

### 3.9 Server Actions (Server State)

**Chosen because:**

- Mutations are type-safe end-to-end without a separate API layer (no REST endpoints).
- CSRF protection built into Next.js Server Actions.
- `revalidatePath()` and `redirect()` work natively after mutations — no cache invalidation code needed.
- AI generation is async: Server Action returns `ActionResult<T>` with loading/error/result state.
- TanStack Query is **not used** in MVP — Server Actions + Server Components cover all data flows.
  If optimistic updates become necessary post-MVP, it's the first library to add.

### 3.10 Zustand

**Chosen because:**

- Functional approach (no classes, no reducers).
- Minimal boilerplate compared to Redux.
- Only needed for UI state: current tone/length in the generator form, open modals.
- No Provider wrapper → less nesting.

### 3.11 AI — Anthropic Claude + Mock Adapter

**Chosen because:**

- **Strategy/Adapter pattern**: `AIProvider` interface with a single `generateEmail(params)` method.
- `ClaudeProvider` implements the real API.
- `MockProvider` implements a deterministic response for dev/test.
- Switch via `AI_PROVIDER=claude|mock` env variable.
- Claude Haiku — fast and cheap for MVP.

### 3.12 next-intl (i18n)

**Chosen because:**

- Bonus point from the spec.
- Supports App Router Server Components.
- Lazy-loading translations via `messages` files.
- EN + RU for MVP.

### 3.13 bun test + Testing Library + Playwright

**Chosen because:**

- **bun test** is built into Bun — zero config, native TypeScript, fastest test runner available (runs test files in parallel workers natively).
- `import { describe, it, expect, mock } from 'bun:test'` — no external test runner dep.
- Built-in `--dom` flag activates happy-dom for React component tests without extra setup.
- `--coverage` flag works out of the box.
- Testing Library still used for React component queries (works with bun test).
- Playwright: e2e for critical paths (auth flow, generate email flow).

### 3.14 Context7 MCP

**Chosen because:**

- LLM training data becomes stale — library APIs change, methods deprecate.
- Context7 provides pinned, current documentation for exact package versions in use.
- Mandatory before using any library API or installing any package (see RULES.md §7).

### 3.15 Docker

**Chosen because:**

- Bonus point from the spec.
- `docker-compose.yml` for local development.
- Production Dockerfile with multi-stage build (builder → runner).

### 3.16 Cyberpunk Design System

**Chosen because:**

- Unique visual identity differentiates from generic SaaS products.
- Dark-only design simplifies theming (no light/dark toggle complexity).
- Monospace-first typography reinforces "developer tool" positioning.
- Neon color palette (green/magenta/cyan) creates high contrast and memorability.
- Chamfered geometry (clip-path) adds technical aesthetic without custom SVG.
- Terminal-style UI components reinforce "command-line" metaphor for power users.

**Key decisions:**

- **Orbitron** for headings (futuristic, technical, high-impact)
- **JetBrains Mono** for body (readable monospace, developer-friendly)
- **Share Tech Mono** for labels (HUD aesthetic, technical feel)
- **Hex colors** over oklch (precise neon values, easier to match design mockups)
- **CSS animations** over Framer Motion for effects (performance, simpler for micro-interactions)
- **Respect `prefers-reduced-motion`** for accessibility (WCAG 2.1 AA compliance)

**Reference:** See `DESIGN_SYSTEM.md` for complete specification including color tokens, typography scale, button variants, input styles, card patterns, effects, and component examples.

**UI Mockups:** `ui/ai-emai-generator/*.dc.html` (Landing, Auth, Dashboard, Pricing, Profile, DesignSystem)

---

## 4. Rejected Alternatives

### 4.1 Framework

| Alternative                         | Reason Rejected                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------------- |
| **Vite + React SPA**                | No SSR → poor SEO for Landing Page; requires separate backend                                 |
| **Remix**                           | Good option, but less mature than Next.js App Router equivalent; fewer Supabase SSR resources |
| **SvelteKit**                       | Smaller component ecosystem; LLM agents have less Svelte training context                     |
| **Astro**                           | Excellent for Landing Page; poor fit for the SPA dashboard section                            |
| **T3 Stack (Next + tRPC + Prisma)** | tRPC adds a layer of complexity; Prisma + separate PostgreSQL = more infrastructure for MVP   |

### 4.2 UI Library

| Alternative                     | Reason Rejected                                                   |
| ------------------------------- | ----------------------------------------------------------------- |
| **MUI (Material UI)**           | Heavy (> 300 KB), enforces Material Design, painful customisation |
| **Ant Design**                  | Enterprise aesthetic, heavy, weak Tailwind integration            |
| **Chakra UI v3**                | Rewritten, smaller community, weaker shadcn ecosystem integration |
| **Mantine**                     | Good, but overlaps with shadcn; extra vendor                      |
| **Headless UI (Tailwind Labs)** | Fewer components, not actively developed                          |

### 4.3 Authentication

| Alternative                  | Reason Rejected                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| **Auth0**                    | Paid above 7,500 MAU; external vendor; complex own-DB integration                    |
| **Firebase Auth**            | Google lock-in; Firestore is non-relational; separate DB from main data              |
| **NextAuth.js (Auth.js v5)** | Requires more custom code for Supabase DB; Supabase Auth already integrates with RLS |
| **Clerk**                    | Paid at scale; external UI component that resists customisation                      |

### 4.4 Database / ORM

| Alternative              | Reason Rejected                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| **Prisma + PlanetScale** | PlanetScale MySQL-only (no foreign keys); separate infrastructure                        |
| **Drizzle + Neon**       | Drizzle is excellent, but Neon is a separate vendor; Supabase covers DB + Auth + Storage |
| **MongoDB + Mongoose**   | NoSQL is a poor fit for relational user/email data; no RLS                               |
| **Firebase Firestore**   | NoSQL, Google lock-in, weak typing                                                       |

### 4.5 State Management

| Alternative       | Reason Rejected                                           |
| ----------------- | --------------------------------------------------------- |
| **Redux Toolkit** | Overkill for MVP; boilerplate; reducer-based mental model |
| **Jotai**         | Atomic model harder to organise for structured stores     |
| **Recoil**        | Facebook project in maintenance mode                      |
| **Valtio**        | Less TypeScript-friendly                                  |
| **Context API**   | Re-render issues with unrelated updates; does not scale   |

### 4.6 AI Provider

| Alternative              | Reason Rejected                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------- |
| **OpenAI GPT-4o**        | More expensive for the same task; Anthropic gives better structured output control |
| **Google Gemini**        | Less mature Node.js SDK; API less stable in the ecosystem                          |
| **Vercel AI SDK**        | Good option, but hides providers behind abstraction — loses control over prompts   |
| **LangChain**            | Heavy, excessive abstraction for MVP                                               |
| **Ollama (local model)** | Cannot deploy on Vercel without a complex worker setup                             |

### 4.7 Validation

| Alternative         | Reason Rejected                                                                     |
| ------------------- | ----------------------------------------------------------------------------------- |
| **Valibot**         | Good (smaller bundle), but Zod has a larger integration ecosystem (RHF, tRPC, etc.) |
| **Yup**             | Older, weaker TypeScript inference                                                  |
| **class-validator** | Requires classes — violates the "no classes" rule                                   |
| **Joi**             | No TypeScript-first inference                                                       |

### 4.8 Deploy

| Alternative                      | Reason Rejected                                      |
| -------------------------------- | ---------------------------------------------------- |
| **Netlify**                      | Weaker Next.js App Router Edge feature support       |
| **Railway**                      | Good for Docker, but more expensive; no edge network |
| **Render**                       | No edge, slow cold start                             |
| **VPS (DigitalOcean / Hetzner)** | Requires devops work; no CDN out of the box          |
| **AWS Amplify**                  | Complex; frequently lags behind new Next.js versions |

---

## 5. Architectural Patterns

### 5.1 AI Provider Pattern (Strategy)

```
src/lib/ai/
├── types.ts           # AIProvider interface, GenerateEmailParams, GenerateEmailResult
├── providers/
│   ├── claude.ts      # ClaudeProvider implements AIProvider
│   └── mock.ts        # MockProvider implements AIProvider
└── factory.ts         # getAIProvider() → env-based factory
```

Any new provider (OpenAI, Gemini) can be added in 5 minutes without touching business logic.

### 5.2 Route Groups (Next.js)

```
app/
├── (marketing)/       # Public: Landing, Pricing
├── (auth)/            # Login, Register, Forgot Password
└── (dashboard)/       # Protected: Dashboard, Profile, History
```

`middleware.ts` is the single point of session validation for `(dashboard)`.

### 5.3 Server Actions vs Route Handlers

- **Server Actions** — mutations from forms (login, register, generate email). No additional API endpoint needed.
- **Route Handlers** (`/api/*`) — only for webhooks (future: Stripe) and public API.

### 5.4 Data Layer

```
Browser → Server Action → Supabase (RLS enforced)
         ↘ AI Provider (Claude | Mock) → structured Zod response
```

RLS guarantees users see only their own data — no additional code-level checks required.

---

## 6. Project Structure

```
ai-email-generator/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── docs/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── reports/
├── messages/
│   ├── en.json
│   └── ru.json
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx          # Landing Page
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── history/page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/webhooks/route.ts
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                   # shadcn/ui (do not edit manually)
│   │   ├── marketing/
│   │   │   ├── hero-section.tsx
│   │   │   ├── features-section.tsx
│   │   │   ├── demo-section.tsx
│   │   │   ├── pricing-preview-section.tsx
│   │   │   ├── faq-section.tsx
│   │   │   └── cta-section.tsx
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   ├── dashboard/
│   │   │   ├── email-generator-form.tsx
│   │   │   ├── email-result.tsx
│   │   │   ├── history-list.tsx
│   │   │   └── sidebar-nav.tsx
│   │   ├── pricing/
│   │   │   ├── pricing-card.tsx
│   │   │   └── pricing-toggle.tsx
│   │   └── shared/
│   │       ├── header.tsx
│   │       ├── footer.tsx
│   │       ├── loading-spinner.tsx
│   │       └── error-message.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── types.ts
│   │   │   ├── factory.ts
│   │   │   └── providers/
│   │   │       ├── claude.ts
│   │   │       └── mock.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── validations/
│   │   │   ├── auth.ts
│   │   │   ├── email-generator.ts
│   │   │   └── profile.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── use-generate-email.ts
│   │   ├── use-auth.ts
│   │   └── use-email-history.ts
│   ├── store/
│   │   ├── generator-store.ts
│   │   └── ui-store.ts
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── email.ts
│   │   └── profile.ts
│   └── types/
│       ├── database.ts
│       ├── ai.ts
│       └── index.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/playwright/
├── ui/
│   ├── ai-emai-generator/
│   │   ├── Landing.dc.html
│   │   ├── Auth.dc.html
│   │   ├── Dashboard.dc.html
│   │   ├── Pricing.dc.html
│   │   ├── Profile.dc.html
│   │   └── DesignSystem.dc.html
│   └── support.js
├── .env.example
├── middleware.ts
├── next.config.ts
├── tsconfig.json
├── playwright.config.ts
├── ARCHITECTURE.md
├── DESIGN_SYSTEM.md
├── CONTENT.md
├── SPEC.md
├── RULES.md
├── AGENT.md
├── IMPLEMENTATION_PLAN.md
└── README.md
```

---

## 7. Database Schema

```sql
-- Extends auth.users (Supabase)
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  plan        TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.generated_emails (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject      TEXT NOT NULL,
  tone         TEXT NOT NULL CHECK (tone IN ('professional', 'casual', 'formal', 'friendly', 'persuasive')),
  length       TEXT NOT NULL CHECK (length IN ('short', 'medium', 'long')),
  content      TEXT NOT NULL,
  model_used   TEXT NOT NULL DEFAULT 'mock',
  tokens_used  INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can CRUD own emails" ON public.generated_emails
  FOR ALL USING (auth.uid() = user_id);
```

---

## 8. Environment Variables

```bash
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROJECT_ID=

# AI Provider: "claude" | "mock"
AI_PROVIDER=mock
ANTHROPIC_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="AI Email Generator"
```

---

## 9. Data Flow Diagram

```
User Browser
     │
     ├─── GET /  (Landing Page) ──► Next.js Server Component ──► Static HTML + Hydration
     │
     ├─── POST /login ──► Server Action ──► Supabase Auth ──► Session Cookie
     │
     ├─── GET /dashboard ──► Middleware (check session) ──► Server Component
     │         ↓
     │    [Form: Subject + Tone + Length]
     │         ↓
     └─── Server Action: generateEmail()
               │
               ├─── Validate with Zod (GenerateEmailSchema)
               ├─── getAIProvider() → ClaudeProvider | MockProvider
               │         ↓ Context7 consulted during development
               ├─── AI API call → raw text
               ├─── Parse + validate response
               ├─── INSERT INTO generated_emails (RLS: user_id = auth.uid())
               └─── Return result → Client Component → Display
```

---

## 10. Phase 1 Summary

**Adopted stack:** Next.js 15 + TypeScript + Tailwind 4 + shadcn/ui + Supabase + Zod + Zustand + Anthropic Claude (Mock Adapter) + Context7.

**Key decisions:**

- Monorepo (single Next.js project) — no separate backend
- AI Provider Pattern — mock ↔ real API without refactoring
- RLS in Supabase — security without per-request middleware
- Server Actions — fewer API routes, type-safe end-to-end
- App Router Route Groups — clean separation of marketing / auth / dashboard
- Context7 MCP — mandatory for all library API usage

**Next step:** Phase 2 — SPEC.md, RULES.md, AGENT.md
