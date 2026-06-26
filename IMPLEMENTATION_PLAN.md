# IMPLEMENTATION_PLAN.md — Phased Plan with LLM Prompts

> Each step = an LLM prompt + test plan.  
> Each phase ends with regression testing.  
> Reports: `docs/reports/phase-N-report.md`

## How to Use This Plan

1. Open GitNexus, connect repository `ai-email-generator` (branch: `main`)
2. Before each step: read `AGENT.md` → load the listed context files
3. For any library usage: run Context7 MCP first (see RULES.md §7)
4. Copy the prompt → execute → run the step's tests
5. At phase end: regression test → write report

---

# PHASE 0 — Project Initialisation

## Step 0.1 — Scaffold Next.js + TypeScript + Tailwind

### Context for LLM (load from GitNexus: ai-email-generator/main)
```
- /ARCHITECTURE.md → Section 6 "Project Structure"
- /RULES.md → Section 5 "Path Aliases", Section 4 "CSS & Tailwind"
- /AGENT.md → "Dev Commands"
```

### Context7 Lookups Required
```
Context7 → resolve "next.js"           → App Router setup docs
Context7 → resolve "tailwindcss"       → v4 CSS-first config
Context7 → resolve "shadcn-ui"         → init docs
```

### Prompt

```
You are a Senior Next.js developer. Initialise the MVP AI Email Generator project.

## Context
Load from GitNexus (ai-email-generator/main):
- ARCHITECTURE.md → Section 2 (stack), Section 6 (structure)
- RULES.md → Section 4 (Tailwind), Section 5 (imports)
- AGENT.md → "Dev Commands"

Before writing any config, fetch:
- Context7 → "next.js" → App Router setup
- Context7 → "tailwindcss" → v4 config
- Context7 → "shadcn-ui" → init

## Task

1. Initialise Next.js 15 with App Router:
```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

2. Create the full directory structure (all empty, with .gitkeep):
```
src/
  app/(marketing)/
  app/(auth)/
  app/(dashboard)/
  app/api/webhooks/
  components/ui/
  components/marketing/
  components/auth/
  components/dashboard/
  components/pricing/
  components/shared/
  lib/ai/providers/
  lib/supabase/
  lib/validations/
  hooks/
  store/
  actions/
  types/
tests/unit/
tests/integration/
tests/e2e/playwright/
docs/reports/
docs/migrations/
messages/
docker/
```

3. Configure `tsconfig.json` strict flags:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

4. Install dependencies (fetch each lib's docs from Context7 first):
```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @anthropic-ai/sdk
npm install zod react-hook-form @hookform/resolvers
npm install @tanstack/react-query zustand
npm install framer-motion
npm install next-intl
npm install clsx tailwind-merge

npx shadcn@latest init
npx shadcn@latest add button input textarea select label card badge \
  form toast sonner dialog dropdown-menu avatar separator skeleton \
  tabs radio-group switch accordion

npm install -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D playwright @playwright/test
npm install -D @types/node
```

5. Create `src/app/globals.css` with all design tokens from RULES.md Section 4.1.

6. Create `.env.example` from ARCHITECTURE.md Section 8.

7. Create `src/lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

export const formatDate = (date: Date | string): string =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  }).format(new Date(date))
```

8. Update `package.json` scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "gen:types": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/database.ts"
  }
}
```

## RULES (from RULES.md)
- Functional approach — no classes
- TypeScript strict
- cn() for conditional classes
- No inline styles

## Tests — Step 0.1
### Manual Verification
- [ ] `npm run dev` starts without errors at localhost:3000
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run lint` — 0 errors
- [ ] localhost:3000 opens in browser (default Next.js page)
- [ ] DevTools: no console errors
- [ ] All directories exist under `src/`
- [ ] `.env.example` created with all keys
```

---

## Step 0.2 — Vitest + Playwright Configuration

### Context7 Lookups Required
```
Context7 → resolve "vitest"      → config docs
Context7 → resolve "playwright"  → config + webServer docs
```

### Prompt

```
You are a QA Engineer. Set up the testing infrastructure for a Next.js 15 project.

## Context (GitNexus: ai-email-generator/main)
- RULES.md → Section 8 "Testing"
- AGENT.md → "Dev Commands"

## Context7 (fetch before writing config)
- Context7 → "vitest" → configuration guide
- Context7 → "playwright" → configuration + webServer

## Task

1. Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/unit/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/components/ui/', '.next/']
    }
  },
  resolve: { alias: { '@': resolve(__dirname, './src') } }
})
```

2. Create `tests/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

3. Create `playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
})
```

4. Create first smoke test `tests/unit/utils.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { cn, formatDate } from '@/lib/utils'

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })
  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })
  it('resolves tailwind conflicts', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })
})

describe('formatDate()', () => {
  it('formats a date string', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('Jan')
    expect(result).toContain('2024')
  })
})
```

## Tests — Step 0.2
- [ ] `npm run test` — smoke test passes (green)
- [ ] `npm run test:e2e -- --list` — Playwright config is valid
- [ ] `npm run test:coverage` — coverage report generated
```

---

## Step 0.3 — GitHub Actions CI/CD + Docker

### Prompt

```
You are a DevOps Engineer. Set up CI/CD for a Next.js 15 project deployed to Vercel.

## Context (GitNexus: ai-email-generator/main)
- ARCHITECTURE.md → Section 5 "CI/CD, Docker"
- README.md → "Docker" section

## Context7
- Context7 → "next.js" → standalone output config

## Task

1. Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test
      - name: Build check
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          AI_PROVIDER: mock
```

2. Create `docker/Dockerfile` (multi-stage):
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

3. Create `docker/docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - ../.env.local
```

4. Add to `next.config.ts`:
```typescript
const nextConfig = {
  output: 'standalone',
}
```

## Tests — Step 0.3
- [ ] `docker build -f docker/Dockerfile -t ai-email-gen .` — succeeds
- [ ] `docker run -p 3000:3000 ai-email-gen` — app starts
- [ ] GitHub Actions YAML is valid (no syntax errors)
```

---

### 🔄 Phase 0 Regression Test

```bash
npm run typecheck   # 0 errors
npm run lint        # 0 warnings
npm run test        # all tests green
npm run build       # build succeeds
```

**Report:** `docs/reports/phase-0-report.md`

---

# PHASE 1 — Types, Schemas, AI Provider

## Step 1.1 — TypeScript Types

### Context7
```
Context7 → "zod" → type inference (z.infer)
```

### Prompt

```
You are a TypeScript architect. Create the type system for MVP AI Email Generator.

## Context (GitNexus: ai-email-generator/main)
- ARCHITECTURE.md → Section 7 (DB schema)
- SPEC.md → FR-04 (AI Provider Interface)
- RULES.md → Section 1 (TypeScript, naming)

## Context7 (fetch first)
- Context7 → "zod" → type inference guide

## Task

1. Create `src/types/index.ts` — all public types (UserPlan, Profile, EmailTone, EmailLength,
   GeneratedEmail, ToastVariant, ActionResult<T>, AppErrorCode).

2. Create `src/types/ai.ts` — AI Provider contract (GenerateEmailParams,
   GenerateEmailResult, AIProvider interface).

3. Create `src/types/database.ts` — Supabase typed schema stub for profiles and
   generated_emails (Row, Insert, Update variants). This will be auto-regenerated
   after DB setup via `npm run gen:types`.

## RULES
- TypeScript strict — no any
- Named exports only
- Use `type` not `interface` for component prop types

## Tests — Step 1.1
- [ ] `npm run typecheck` — 0 errors after adding types
- [ ] All exports from `src/types/index.ts` importable via `@/types`
```

---

## Step 1.2 — Zod Validation Schemas

### Context7
```
Context7 → "zod" → .refine(), .enum(), .transform()
Context7 → "react-hook-form" → zodResolver integration
```

### Prompt

```
You are a TypeScript / Zod specialist. Create validation schemas for all forms.

## Context (GitNexus: ai-email-generator/main)
- RULES.md → Section 1.2 (naming: PascalCase + Schema suffix)
- SPEC.md → FR-02 (auth validations), FR-03 (generator validations)
- src/types/index.ts (EmailTone, EmailLength)

## Context7 (fetch first)
- Context7 → "zod" → .refine(), .enum(), z.infer

## Task

1. Create `src/lib/validations/auth.ts`:
   - LoginSchema: email (z.string().email()), password (min 1)
   - RegisterSchema: email, password (min 8, max 100, uppercase + digit),
     confirmPassword — .refine() that passwords match
   - Export inferred types: LoginInput, RegisterInput

2. Create `src/lib/validations/email-generator.ts`:
   - GenerateEmailSchema: subject (min 3, max 500, .trim()),
     tone (z.enum with 5 options), length (z.enum with 3 options)
   - Export: GenerateEmailInput, EMAIL_TONE_LABELS, EMAIL_LENGTH_LABELS constants

3. Create `src/lib/validations/profile.ts`:
   - UpdateProfileSchema: fullName (optional, min 1, max 100, .trim())
   - Export: UpdateProfileInput

4. Write unit tests for each schema in co-located `.test.ts` files.

## Tests — Step 1.2
- [ ] LoginSchema: rejects invalid email, rejects empty password
- [ ] RegisterSchema: rejects short password, rejects mismatched passwords
- [ ] GenerateEmailSchema: rejects subject < 3 chars, rejects invalid tone
- [ ] `npm run test` — all Zod schema tests green
```

---

## Step 1.3 — AI Provider (Mock + Claude)

### Context7
```
Context7 → "anthropic"  → Messages API, model names, streaming
```

### Prompt

```
You are a backend developer. Implement the AI Provider Pattern for email generation.

## Context (GitNexus: ai-email-generator/main)
- ARCHITECTURE.md → Section 5.1 (AI Provider Pattern)
- src/types/ai.ts (AIProvider, GenerateEmailParams, GenerateEmailResult)
- RULES.md → Section 2 (functional approach, no classes)

## Context7 (MANDATORY — fetch before writing Claude provider)
- Context7 → "anthropic" → Messages API reference
- Context7 → "anthropic" → model names (confirm haiku model string)

## Task

1. `src/lib/ai/providers/mock.ts` — MockProvider:
   - Implements AIProvider interface
   - Deterministic templates per tone (5 options)
   - Expands content based on length multiplier
   - 800ms artificial delay to simulate API
   - name: 'mock-v1'

2. `src/lib/ai/providers/claude.ts` — ClaudeProvider:
   - Uses Anthropic SDK (API key from env)
   - System prompt includes tone instructions + length target word count
   - temperature: 0.7, max_tokens based on length (short: 300, medium: 700, long: 1200)
   - Returns content, tokensUsed, modelUsed
   - Throws typed error when API key missing

3. `src/lib/ai/factory.ts` — getAIProvider():
   - Reads AI_PROVIDER env
   - Returns MockProvider for 'mock' or unknown values
   - Returns ClaudeProvider for 'claude'
   - Logs a warning for unknown values

## Tests — Step 1.3
- [ ] MockProvider: generates content for all 5 tones
- [ ] MockProvider: long length produces more content than short
- [ ] MockProvider: content contains the subject
- [ ] Factory: returns mock when AI_PROVIDER=mock
- [ ] Factory: returns claude when AI_PROVIDER=claude
- [ ] `npm run test` — all AI provider tests green
```

---

### 🔄 Phase 1 Regression Test

```bash
npm run typecheck   # 0 errors
npm run test        # Zod + AI Provider tests green
```

**Report:** `docs/reports/phase-1-report.md`

---

# PHASE 2 — Supabase: Auth + Database

## Step 2.1 — Supabase Clients (Browser + Server)

### Context7
```
Context7 → "supabase-ssr"  → Next.js App Router SSR guide
Context7 → "next.js"       → middleware.ts API
```

### Prompt

```
You are a Supabase specialist. Configure Supabase clients for Next.js 15 App Router.

## Context (GitNexus: ai-email-generator/main)
- ARCHITECTURE.md → Section 3.6 (Supabase justification)
- src/types/database.ts (Database types)
- RULES.md → Section 11 (Security)

## Context7 (MANDATORY — fetch before writing any Supabase code)
- Context7 → "supabase-ssr" → App Router setup guide
- Context7 → "next.js" → middleware.ts API reference

## Task

1. `src/lib/supabase/client.ts` — browser client using createBrowserClient<Database>

2. `src/lib/supabase/server.ts` — server client using createServerClient<Database>
   with cookies() from next/headers (async in Next.js 15)

3. `middleware.ts` (project root):
   - Refresh session on every request
   - Redirect unauthenticated users away from (dashboard) routes
   - Redirect authenticated users away from (auth) routes
   - matcher config that excludes _next/static, _next/image, favicon, api

## Tests — Step 2.1
- [ ] `npm run typecheck` — clients typed correctly, 0 errors
- [ ] `npm run dev` — starts without errors
- [ ] middleware.ts is valid (Next.js does not throw on startup)
```

---

## Step 2.2 — SQL Migrations + RLS

### Prompt

```
You are a Database Engineer. Write SQL migrations and RLS policies for Supabase.

## Context (GitNexus: ai-email-generator/main)
- ARCHITECTURE.md → Section 7 (DB schema with full SQL)
- SPEC.md → FR-02, FR-03, FR-06 (data requirements)

## Task

1. Write `docs/migrations/001_initial_schema.sql` with:
   - profiles table (extends auth.users with CASCADE delete)
   - generated_emails table with CHECK constraints
   - Indexes on user_id and created_at
   - handle_updated_at() trigger function + trigger on profiles
   - handle_new_user() trigger: auto-creates profile on auth.users INSERT
   - RLS enabled on both tables
   - SELECT/UPDATE policies for profiles (auth.uid() = id)
   - ALL policy for generated_emails (auth.uid() = user_id)

2. Run the migration in Supabase SQL Editor.

3. Regenerate TypeScript types:
   npm run gen:types

## Tests — Step 2.2
- [ ] Tables exist in Supabase Dashboard → Table Editor
- [ ] RLS shown as enabled on both tables
- [ ] Register a test user → profile row auto-created
- [ ] `npm run gen:types` — src/types/database.ts updated, no type errors
```

---

## Step 2.3 — Server Actions: Auth

### Context7
```
Context7 → "next.js" → Server Actions, redirect(), revalidatePath()
```

### Prompt

```
You are a Next.js / Supabase developer. Implement Server Actions for authentication.

## Context (GitNexus: ai-email-generator/main)
- src/lib/validations/auth.ts (LoginSchema, RegisterSchema)
- src/lib/supabase/server.ts (createServerSupabaseClient)
- src/types/index.ts (ActionResult, AppErrorCode)
- RULES.md → Section 2 (functional approach), Section 6 (error handling)
- SPEC.md → FR-02

## Context7 (fetch before writing)
- Context7 → "next.js" → Server Actions guide, redirect(), revalidatePath()

## Task

Create `src/actions/auth.ts` with:
- loginAction(formData): validate → signInWithPassword → revalidatePath + redirect
- registerAction(formData): validate → signUp → revalidatePath + redirect
- logoutAction(): signOut → revalidatePath + redirect

All return ActionResult<void>. Map Supabase error messages to human-readable strings.

## Tests — Step 2.3
- [ ] `npm run typecheck` — Server Actions typed correctly
- [ ] Manual: register with valid data → redirect /dashboard
- [ ] Manual: login with wrong password → "Invalid email or password" message
- [ ] Manual: logout → redirect /
- [ ] /dashboard without session → redirect /login (middleware)
```

---

## Step 2.4 — Server Actions: Email Generator

### Context7
```
Context7 → "next.js" → revalidatePath(), Server Actions patterns
Context7 → "supabase-js" → insert + select + single()
```

### Prompt

```
You are a Next.js / Supabase developer. Implement the email generation Server Action.

## Context (GitNexus: ai-email-generator/main)
- src/lib/validations/email-generator.ts (GenerateEmailSchema)
- src/lib/ai/factory.ts (getAIProvider)
- src/lib/supabase/server.ts
- src/types/index.ts (ActionResult, GeneratedEmail)
- RULES.md → Section 6 (error handling)

## Context7 (fetch before writing)
- Context7 → "next.js" → Server Actions
- Context7 → "supabase-js" → insert + select patterns

## Task

Create `src/actions/email.ts` with:
- generateEmailAction(formData): auth check → Zod validate → getAIProvider() →
  AI generate (try/catch AI_UNAVAILABLE) → INSERT to generated_emails →
  revalidatePath('/dashboard') → return ActionResult<GeneratedEmail>
- deleteEmailAction(emailId): auth check → DELETE with user_id safety check →
  revalidatePath → ActionResult<void>

## Tests — Step 2.4
- [ ] `npm run typecheck` — 0 errors
- [ ] Manual: fill form → Generate → email appears on page
- [ ] Manual: email saved in Supabase (Dashboard → Table Editor)
- [ ] Manual: unauthenticated call → AUTH_REQUIRED error
- [ ] AI error → handled without white screen
```

---

### 🔄 Phase 2 Regression Test

```bash
npm run typecheck
npm run test
# Manual:
# 1. Register → profile in DB
# 2. Login → redirect Dashboard
# 3. Generate email → saved in DB
# 4. Logout → redirect /
# 5. /dashboard without session → redirect /login
```

**Report:** `docs/reports/phase-2-report.md`

---

# PHASE 3 — UI: Landing Page

## Step 3.1 — Root Layout + Header + Footer + Error Pages

### Context7
```
Context7 → "next.js" → App Router layout, metadata API, error.tsx
Context7 → "next.js" → next/font
```

### Prompt

```
You are a React / Next.js UI developer. Create the root layout, header, footer, and error pages.

## Context (GitNexus: ai-email-generator/main)
- src/app/globals.css (@theme design tokens)
- RULES.md → Section 3 (components), Section 4 (Tailwind)
- ARCHITECTURE.md → Section 5.2 (Route Groups)
- SPEC.md → FR-07 (Error Handling)

## Context7 (fetch before writing)
- Context7 → "next.js" → App Router root layout, Metadata API
- Context7 → "next.js" → error.tsx, not-found.tsx conventions
- Context7 → "next.js" → next/font

## Task

1. `src/app/layout.tsx` — root layout with Inter font, metadata (title, description, OG).

2. `src/app/(marketing)/layout.tsx` — wraps Header + Footer around children.

3. `src/components/shared/header.tsx` — navigation with Login/Register for guests,
   Dashboard/Logout for authenticated users (Server Component, reads session).

4. `src/components/shared/footer.tsx` — links, copyright.

5. `src/app/error.tsx` — error boundary with Reset button, logs error to console.

6. `src/app/not-found.tsx` — 404 page with link to home.

## Tests — Step 3.1
- [ ] localhost:3000 — header renders
- [ ] localhost:3000 — footer renders
- [ ] /nonexistent-page → 404 page (not white screen)
- [ ] error.tsx: throw inside a Server Component → error boundary shows Reset button
- [ ] Mobile 375px: header layout correct, no overflow
```

---

## Step 3.2 — Hero + Features + Demo Sections

### Context7
```
Context7 → "framer-motion" → motion components, whileInView, AnimatePresence
Context7 → "shadcn-ui"     → Card, Badge components
```

### Prompt

```
You are a frontend developer (Next.js + Tailwind + Framer Motion).
Create the visually strong first three Landing Page sections.

## Context (GitNexus: ai-email-generator/main)
- src/app/globals.css (@theme tokens)
- RULES.md → Section 4 (Tailwind rules, mobile-first)
- SPEC.md → FR-01 (Landing Page sections)

## Context7 (fetch before writing animations)
- Context7 → "framer-motion" → motion components, AnimatePresence, whileInView
- Context7 → "framer-motion" → viewport options
- Context7 → "shadcn-ui" → Card component API

## Task

1. `src/components/marketing/hero-section.tsx`:
   - 'use client' — uses Framer Motion
   - Animated headline: fadeIn (opacity 0→1) + slideUp (y 20→0), duration 0.6s
   - Subheadline with slight delay
   - Two CTAs: "Start for Free" → /register, "See Demo" → smooth scroll
   - Decorative gradient blob (CSS, no inline styles)
   - Mobile-first layout

2. `src/components/marketing/features-section.tsx`:
   - Server Component
   - 6 feature cards in grid (1 col → 2 col sm → 3 col lg)
   - Each card: lucide-react icon + title + description
   - whileInView animation (each card slides up with stagger)

3. `src/components/marketing/demo-section.tsx`:
   - 'use client' — interactive form
   - Subject input + tone select + Generate button
   - Calls MockProvider directly (no auth required)
   - Shows result with copy button
   - CTA after result: "Get Full Access" → /register

## RULES
- Mobile-first Tailwind classes
- cn() for conditional classes
- No inline styles
- Animations via Framer Motion only

## Tests — Step 3.2
- [ ] Desktop (1440px): 3 sections display correctly
- [ ] Tablet (768px): features grid shows 2 columns
- [ ] Mobile (375px): single column, no horizontal scroll
- [ ] Demo: enter subject → Generate → result appears
- [ ] Scroll-reveal animations trigger on scroll
- [ ] Lighthouse Performance ≥ 85 (run from Chrome DevTools)
```

---

## Step 3.3 — FAQ + Pricing Preview + CTA + Assemble

### Context7
```
Context7 → "shadcn-ui" → Accordion component API
```

### Prompt

```
You are a frontend developer. Complete the Landing Page: FAQ, Pricing Preview, CTA, assemble.

## Context (GitNexus: ai-email-generator/main)
- SPEC.md → FR-01 (sections), FR-05 (pricing plans)
- src/app/globals.css (design tokens)
- RULES.md → Section 4 (Tailwind)

## Context7 (fetch before using Accordion)
- Context7 → "shadcn-ui" → Accordion component props and usage

## Task

1. `src/components/marketing/faq-section.tsx`:
   - shadcn/ui Accordion (type="single", collapsible)
   - 7 Q&A: what is it, how it works, free plan, privacy, tones, history, integrations

2. `src/components/marketing/pricing-preview-section.tsx`:
   - 3 cards (Free / Pro / Enterprise), data from SPEC.md FR-05
   - Pro card: ring-2 ring-primary + "Most Popular" badge
   - "See All Plans" → /pricing

3. `src/components/marketing/cta-section.tsx`:
   - Gradient background using design tokens
   - Headline + "Get Started Free" → /register

4. `src/app/(marketing)/page.tsx` — assemble all 6 sections in order:
   HeroSection → FeaturesSection → DemoSection →
   PricingPreviewSection → FaqSection → CtaSection

## Tests — Step 3.3
- [ ] FAQ accordion opens/closes each item
- [ ] Pricing preview: 3 cards, Pro highlighted
- [ ] CTA button → /register
- [ ] Full Landing Page scrolls with no horizontal overflow
- [ ] Lighthouse Performance ≥ 85, Accessibility ≥ 90
```

---

### 🔄 Phase 3 Regression Test

```bash
npm run typecheck
npm run test
# Manual: full Landing Page at 375px, 768px, 1440px
# Demo section works without auth
# Lighthouse audit in Chrome DevTools
```

**Report:** `docs/reports/phase-3-report.md`

---

# PHASE 4 — Auth Pages

## Step 4.1 — Login + Register Forms

### Context7
```
Context7 → "react-hook-form" → useForm, zodResolver, formState
Context7 → "next.js"         → useFormState, useFormStatus (Server Actions form)
Context7 → "shadcn-ui"       → Form, Input, Button components
```

### Prompt

```
You are a React / Next.js developer. Build the authentication pages using RHF + Zod.

## Context (GitNexus: ai-email-generator/main)
- src/actions/auth.ts (loginAction, registerAction)
- src/lib/validations/auth.ts (LoginSchema, RegisterSchema)
- RULES.md → Section 3 (components), Section 6 (error handling)
- SPEC.md → FR-02

## Context7 (fetch before writing forms)
- Context7 → "react-hook-form" → useForm, zodResolver, formState.errors
- Context7 → "next.js" → useFormState, useFormStatus
- Context7 → "shadcn-ui" → Form, FormField, FormMessage

## Task

1. `src/components/auth/login-form.tsx` — 'use client':
   - React Hook Form + zodResolver(LoginSchema)
   - Fields: email (Input), password (Input type="password")
   - Submit → loginAction via startTransition
   - Server error displayed below form
   - Loading state on button (useFormStatus or isPending)

2. `src/components/auth/register-form.tsx` — 'use client':
   - RHF + zodResolver(RegisterSchema)
   - Fields: email, password, confirmPassword
   - Inline per-field error messages

3. `src/app/(auth)/login/page.tsx` — renders LoginForm, links to /register
4. `src/app/(auth)/register/page.tsx` — renders RegisterForm, links to /login
5. `src/app/(auth)/layout.tsx` — centred layout, no sidebar

## Tests — Step 4.1
- [ ] /login: form renders
- [ ] /login: empty submit → inline field errors
- [ ] /login: wrong password → "Invalid email or password"
- [ ] /login: success → redirect /dashboard
- [ ] /register: all 3 fields validate (email, password strength, confirm match)
- [ ] /register: success → redirect /dashboard
- [ ] Keyboard: Tab through all fields, Enter to submit
- [ ] Mobile: form not clipped at 375px
```

---

### 🔄 Phase 4 Regression Test

```bash
npm run typecheck
npm run test
# Auth flow manual test
```

**Report:** `docs/reports/phase-4-report.md`

---

# PHASE 5 — Dashboard

## Step 5.1 — Dashboard Layout + Sidebar

### Context7
```
Context7 → "next.js"    → nested layouts, loading.tsx
Context7 → "shadcn-ui"  → Sheet (mobile drawer), NavigationMenu
```

### Prompt

```
You are a React / Next.js developer. Create the Dashboard layout with navigation.

## Context (GitNexus: ai-email-generator/main)
- ARCHITECTURE.md → (dashboard) route group
- src/lib/supabase/server.ts
- RULES.md → Server Components rule, mobile adaptation

## Context7 (fetch before writing)
- Context7 → "next.js" → nested layouts, protected routes pattern
- Context7 → "shadcn-ui" → Sheet component for mobile drawer

## Task

1. `src/app/(dashboard)/layout.tsx` — Server Component:
   - Loads user from Supabase
   - Renders SidebarNav on desktop (lg:)
   - Renders bottom navigation bar on mobile
   - Redirect to /login if no user (fallback for non-middleware cases)

2. `src/components/dashboard/sidebar-nav.tsx`:
   - Links: Dashboard, History, Profile
   - Logout button → logoutAction
   - Active route highlight via usePathname
   - Collapsible on tablet (Sheet)

3. Loading states: `src/app/(dashboard)/dashboard/loading.tsx`

## Tests — Step 5.1
- [ ] /dashboard accessible only when authenticated
- [ ] Desktop: sidebar visible on left
- [ ] Mobile (375px): bottom navigation bar
- [ ] Active state highlights current route
- [ ] Logout from sidebar works
```

---

## Step 5.2 — Email Generator Form + Result

### Context7
```
Context7 → "zustand"         → create store, set(), subscriptions
Context7 → "react-hook-form" → useForm with Server Actions
Context7 → "shadcn-ui"       → Textarea, RadioGroup, Tabs, Sonner toast
Context7 → "framer-motion"   → AnimatePresence for result card
```

### Prompt

```
You are a React / Next.js / Zustand developer. Build the Email Generator UI.

## Context (GitNexus: ai-email-generator/main)
- src/actions/email.ts (generateEmailAction)
- src/lib/validations/email-generator.ts (GenerateEmailSchema, labels)
- src/types/index.ts (GeneratedEmail, EmailTone, EmailLength)
- RULES.md → Section 2 (functional), Section 3 (components)

## Context7 (fetch before writing)
- Context7 → "zustand" → create, set pattern
- Context7 → "react-hook-form" → form submission patterns
- Context7 → "shadcn-ui" → RadioGroup, Tabs API
- Context7 → "framer-motion" → AnimatePresence, motion.div

## Task

1. `src/store/generator-store.ts` — Zustand store:
   - State: result (GeneratedEmail | null), isLoading (boolean), error (string | null)
   - Actions: setResult, setLoading, setError, reset
   - No classes; use create<GeneratorState>((set) => ...)

2. `src/components/dashboard/email-generator-form.tsx` — 'use client':
   - RHF + zodResolver(GenerateEmailSchema)
   - Subject: Textarea
   - Tone: RadioGroup (5 options, labels from EMAIL_TONE_LABELS)
   - Length: Tabs (3 options, labels from EMAIL_LENGTH_LABELS)
   - Generate: Button disabled when subject empty or isLoading
   - On submit: setLoading(true) → generateEmailAction → setResult / setError

3. `src/components/dashboard/email-result.tsx` — 'use client':
   - Reads from useGeneratorStore
   - AnimatePresence: result card slides in when result is not null
   - Copy button: navigator.clipboard.writeText(result.content)
   - "Generate Another" → reset()
   - Error: shown as toast (sonner)

4. `src/app/(dashboard)/dashboard/page.tsx`:
   - Grid: EmailGeneratorForm | EmailResult side by side on lg, stacked on mobile

## Tests — Step 5.2
- [ ] Form renders on /dashboard
- [ ] Generate disabled when subject empty
- [ ] Fill form → Generate → loading spinner → result card appears
- [ ] Copy button: text copied to clipboard
- [ ] AI error: toast shown, form stays intact
- [ ] Mobile: form and result stacked in one column
- [ ] Result saved in Supabase (verify in Dashboard)
```

---

## Step 5.3 — History Page + Profile Page

### Context7
```
Context7 → "next.js"   → Server Component data fetching, loading.tsx skeleton
Context7 → "shadcn-ui" → Skeleton, Avatar, Badge
```

### Prompt

```
You are a React / Next.js developer. Build History and Profile pages.

## Context (GitNexus: ai-email-generator/main)
- src/lib/supabase/server.ts
- src/types/index.ts (GeneratedEmail, Profile)
- SPEC.md → FR-06 (Profile), FR-03 (History)

## Context7
- Context7 → "next.js" → Server Component data fetching
- Context7 → "shadcn-ui" → Skeleton, Avatar, Badge components

## Task

1. `src/actions/profile.ts` — updateProfileAction:
   - Auth check → UpdateProfileSchema validate → UPDATE profiles → ActionResult<Profile>

2. `src/app/(dashboard)/history/page.tsx` — Server Component:
   - SELECT last 20 from generated_emails WHERE user_id = auth.uid()
   - List of EmailHistoryCard components (subject, tone, length, date, delete button)
   - Empty state: "No emails yet. Generate your first one!"

3. `src/app/(dashboard)/history/loading.tsx` — skeleton list

4. `src/app/(dashboard)/profile/page.tsx` — Server Component:
   - Loads profile from Supabase
   - Shows avatar (initials), email (readonly), plan badge, registration date
   - Client form component for editing fullName
   - Logout button → logoutAction

5. `src/app/(dashboard)/profile/loading.tsx` — profile skeleton

## Tests — Step 5.3
- [ ] /history: shows list after generating emails
- [ ] /history: Delete button removes email, list updates
- [ ] /history: empty state when no emails
- [ ] /profile: name updates and persists after save
- [ ] /profile: plan badge shows "Free"
- [ ] loading.tsx: skeleton visible during slow fetch (throttle network in DevTools)
```

---

### 🔄 Phase 4+5 Regression Test

```bash
npm run typecheck
npm run test
npm run test:e2e   # auth flow + generate flow
```

E2E test files to create:
- `tests/e2e/auth.spec.ts` — register → login → logout
- `tests/e2e/generate-email.spec.ts` — login → generate → copy → history → delete
- `tests/e2e/landing.spec.ts` — demo section, pricing link, CTA

**Report:** `docs/reports/phase-4-5-report.md`

---

# PHASE 6 — Pricing + i18n + Polish + Deploy

## Step 6.1 — Pricing Page

### Prompt

```
You are a frontend developer. Build a full Pricing page with 3 plans and a billing toggle.

## Context (GitNexus: ai-email-generator/main)
- SPEC.md → FR-05 (plans: Free $0, Pro $19, Enterprise $99)
- src/components/ui/ (Card, Badge, Button, Switch)
- RULES.md → Section 4 (Tailwind design system)

## Task

1. `src/store/ui-store.ts` — add billingCycle: 'monthly' | 'yearly' state

2. `src/components/pricing/pricing-toggle.tsx` — 'use client':
   - Switch (monthly ↔ yearly)
   - Yearly shows "Save 20%" badge

3. `src/components/pricing/pricing-card.tsx`:
   - Props: plan name, price, features[], highlighted, ctaLabel
   - Pro card: ring-2 ring-primary, badge "Most Popular"
   - Price: monthly or (monthly * 0.8) based on billingCycle from store

4. `src/app/(marketing)/pricing/page.tsx`:
   - PricingToggle + 3 PricingCards in grid
   - FAQ section below cards (billing FAQ)
   - All CTAs → /register (no Stripe)

## Tests — Step 6.1
- [ ] 3 cards render
- [ ] Toggle: monthly ↔ yearly prices update
- [ ] Pro card visually distinguished (ring border)
- [ ] CTA buttons work (→ /register)
- [ ] Responsive: 1 column on mobile
```

---

## Step 6.2 — next-intl (EN + RU)

### Context7
```
Context7 → "next-intl" → App Router setup, useTranslations, middleware config
```

### Prompt

```
You are a frontend developer. Add EN/RU internationalisation via next-intl.

## Context (GitNexus: ai-email-generator/main)
- ARCHITECTURE.md → Section 3.12 (next-intl)
- SPEC.md → NFR-04 (Localization)

## Context7 (MANDATORY — fetch before writing any next-intl code)
- Context7 → "next-intl" → App Router full setup guide
- Context7 → "next-intl" → routing, useTranslations, middleware config

## Task

1. Configure next-intl routing (i18n.ts, i18n/request.ts).
2. Update middleware.ts to handle locale prefixes (/en/, /ru/).
3. `messages/en.json` — all UI strings in English.
4. `messages/ru.json` — Russian translations.
5. Language switcher in Header (client component, persists selection).
6. Wrap Landing Page, Auth, and Dashboard page titles/labels in t().

## Tests — Step 6.2
- [ ] Language switcher in header
- [ ] /en/ and /ru/ routes both load correctly
- [ ] Landing Page renders in Russian when RU selected
- [ ] Selected language persists across page reloads
- [ ] `npm run typecheck` — 0 errors
```

---

## Step 6.3 — Final Polish + Deploy

### Prompt

```
You are a Senior Developer doing the final pre-deployment review.

## Context (GitNexus: ai-email-generator/main)
- All project files
- SPEC.md → Section 7 (acceptance checklist)
- RULES.md → Section 9 (Git, PR checklist)
- README.md

## Task

1. Run and fix all issues:
   npm run typecheck    # must be 0 errors
   npm run lint         # must be 0 warnings
   npm run build        # must succeed

2. Add CSP headers to `next.config.ts` (Content-Security-Policy, X-Frame-Options, etc.)

3. Update README.md → replace placeholder URL with the real Vercel URL.

4. Write `docs/AI_DEVELOPMENT_REPORT.md` with 20 key prompts used in development.

5. Deploy: `vercel --prod`

6. Verify live URL: register → dashboard → generate → history → pricing → profile → logout.

## Tests — Step 6.3
- [ ] Live Vercel URL accessible publicly
- [ ] Full user journey works on live URL
- [ ] Mobile 375px: entire flow works
- [ ] Lighthouse: Performance ≥ 85, Accessibility ≥ 90
- [ ] README contains live URL
- [ ] GitHub repo is public
```

---

### 🔄 Final Regression Test

```bash
npm run typecheck
npm run lint
npm run test -- --run
npm run test:e2e

# Critical E2E paths:
# 1. Landing → Register → Dashboard → Generate → History → Logout
# 2. Login → Profile → Update Name → Logout
# 3. /dashboard without session → redirect /login
# 4. /pricing page loads
# 5. /nonexistent → 404 page
```

**Final report:** `docs/reports/final-report.md`

---

## Phase Report Template

```markdown
# Phase N Report — [Phase Name]

**Date:** YYYY-MM-DD
**Status:** ✅ Complete | ⚠️ Partial | ❌ Issues

## Completed
- [x] Step N.1: ...
- [x] Step N.2: ...

## Test Results
- Unit: X/X passing
- E2E: X/X passing
- Lighthouse: Performance XX, Accessibility XX

## Issues & Resolutions
| Issue | Resolution |
|---|---|
| ... | ... |

## Context7 Lookups Performed
| Library | Topic | Result |
|---|---|---|
| next.js | middleware API | Used createServerClient pattern from docs |
| ... | ... | ... |

## Notes for Next Phase
- ...
```

---

## Documentation Index

```
docs/
├── migrations/
│   └── 001_initial_schema.sql
├── reports/
│   ├── phase-0-report.md
│   ├── phase-1-report.md
│   ├── phase-2-report.md
│   ├── phase-3-report.md
│   ├── phase-4-5-report.md
│   ├── phase-6-report.md
│   └── final-report.md
└── AI_DEVELOPMENT_REPORT.md
```
