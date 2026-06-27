# Phase 0 — Scaffold · Bun · bunfig · Docker · CI/CD

> **Goal:** runnable Next.js 15 project with Bun, bun test configured, Docker built, GitHub Actions wired.  
> **Estimated time:** ~2 hours  
> **Regression:** `bun run typecheck && bun run lint && bun test && bun run build`

---

## Context Sources

### GitNexus (ai-email-generator / main)

```
/ARCHITECTURE.md  → Section 2 (stack), Section 6 (project structure)
/RULES.md         → Section 4 (Tailwind/CSS), Section 5 (path aliases), Section 8 (testing)
/AGENT.md         → "Dev Commands", "Toolchain Reference"
```

### Context7 (fetch before each step)

```
next.js          → App Router init, next.config.ts output: standalone
tailwindcss      → v4 CSS-first @theme config
shadcn-ui        → CLI init + add commands
bun              → bunfig.toml, bun test --dom, bun install
playwright       → config, webServer
```

---

## Step 0.1 — Initialise Next.js 15 with Bun

### Context7

```
Context7 → "next.js"     → create-next-app, App Router docs
Context7 → "tailwindcss" → v4 init
Context7 → "bun"         → bun create, package manager docs
```

### Prompt

````
You are a Senior Next.js developer. Initialise the MVP AI Email Generator project using Bun.

## Context
Load from GitNexus (ai-email-generator/main):
- ARCHITECTURE.md → Section 2 (stack), Section 6 (directory layout)
- RULES.md → Section 4 (Tailwind), Section 5 (path aliases)

Fetch from Context7 before writing any file:
- Context7 → "next.js" → create-next-app options, App Router structure
- Context7 → "tailwindcss" → v4 CSS-first config (@theme)
- Context7 → "bun" → package manager, bunfig.toml

## Task

### 1. Create the Next.js 15 project (Bun-native)
```bash
bunx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
````

### 2. Create full directory tree (all empty, add .gitkeep so git tracks them)

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
tests/
  unit/
  integration/
  e2e/playwright/
docs/
  phases/
  reports/
  migrations/
messages/
docker/
```

### 3. Update tsconfig.json — add strict flags

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

### 4. Install all dependencies with Bun

```bash
# Runtime deps
bun add @supabase/supabase-js @supabase/ssr
bun add @anthropic-ai/sdk
bun add zod react-hook-form @hookform/resolvers/zod
bun add zustand
bun add framer-motion
bun add next-intl
bun add clsx tailwind-merge
bun add lucide-react

# shadcn/ui init (fetch docs from Context7 → "shadcn-ui" first)
bunx shadcn@latest init

# shadcn components
bunx shadcn@latest add button input textarea select label card badge \
  form sonner dialog dropdown-menu avatar separator skeleton \
  tabs radio-group switch accordion

# Dev deps
bun add -d @testing-library/react @testing-library/jest-dom @testing-library/user-event
bun add -d playwright @playwright/test
bun add -d @types/node
# Note: NO vitest, NO @vitejs/plugin-react — bun test is built-in
```

### 5. Create bunfig.toml in project root

```toml
[install]
# Prefer bun.lockb over package-lock.json
frozenLockfile = false  # set true in CI

[test]
preload = ["./tests/setup.ts"]
# coverage enabled via --coverage flag
```

### 6. Create tests/setup.ts

```typescript
import "@testing-library/jest-dom";
```

### 7. Update package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "bun test",
    "test:dom": "bun test --dom",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage",
    "test:e2e": "playwright test",
    "gen:types": "bunx supabase gen types typescript --project-id ${SUPABASE_PROJECT_ID} > src/types/database.ts"
  }
}
```

### 8. Create src/app/globals.css with complete @theme design tokens

Copy the full @theme block from RULES.md Section 4.1 verbatim.
Add `@import "tailwindcss";` as the first line.

### 9. Create .env.example

```bash
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

### 10. Create src/lib/utils.ts

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const formatDate = (date: Date | string): string =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
```

## RULES

- No npm, no npx — use bun / bunx everywhere
- No vitest imports — use `import { ... } from 'bun:test'`
- Functional approach — no classes

## Tests — Step 0.1

### Manual Verification

- [ ] `bun dev` starts at localhost:3000 with no errors
- [ ] `bun run typecheck` — 0 errors
- [ ] `bun run lint` — 0 errors
- [ ] Browser: localhost:3000 opens (default Next.js page)
- [ ] DevTools: no console errors
- [ ] All directories under `src/` exist
- [ ] `bun.lockb` generated (not `package-lock.json`)
- [ ] `.env.example` created with all keys

```

---

## Step 0.2 — bun test Smoke Test

### Context7
```

Context7 → "bun" → bun test API, bun:test imports, --dom flag, bunfig.toml

```

### Prompt
```

You are a QA Engineer. Write the first smoke tests using bun's built-in test runner.

## Context (GitNexus: ai-email-generator/main)

- RULES.md → Section 8 "Testing" (bun test rules)
- src/lib/utils.ts (cn, formatDate)

## Context7 (MANDATORY — fetch before writing tests)

- Context7 → "bun" → bun test, bun:test module, describe/it/expect API
- Context7 → "bun" → bunfig.toml test section

## Task

1. Create tests/unit/utils.test.ts — uses bun:test (NOT vitest):

```typescript
import { describe, it, expect } from "bun:test";
import { cn, formatDate } from "@/lib/utils";

describe("cn()", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });
  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });
  it("resolves tailwind conflicts (last wins)", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });
});

describe("formatDate()", () => {
  it("formats a date string", () => {
    const result = formatDate("2024-01-15");
    expect(result).toContain("Jan");
    expect(result).toContain("2024");
  });
  it("accepts a Date object", () => {
    const result = formatDate(new Date("2024-06-26"));
    expect(result).toContain("2024");
  });
});
```

2. Create playwright.config.ts:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "bun dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

## Tests — Step 0.2

### Unit (bun test)

- [ ] `bun test` — 5 tests, all green
- [ ] `bun test --coverage` — coverage report generated

### Manual Verification

- [ ] `bun run test:e2e -- --list` — Playwright lists 0 tests (config valid, no tests yet)

```

---

## Step 0.3 — Docker (oven/bun image)

### Context7
```

Context7 → "bun" → Docker, oven/bun image, production setup
Context7 → "next.js" → standalone output

```

### Prompt
```

You are a DevOps Engineer. Create a production-grade Docker setup using oven/bun base image.

## Context (GitNexus: ai-email-generator/main)

- ARCHITECTURE.md → Section 3.15 (Docker)
- README.md → "Docker" section

## Context7 (fetch before writing Dockerfile)

- Context7 → "bun" → Docker guide, oven/bun image variants
- Context7 → "next.js" → output: "standalone" config

## Task

1. Add to next.config.ts:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

2. Create docker/Dockerfile:

```dockerfile
# ---- Build Stage ----
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# ---- Production Stage ----
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]
```

3. Create docker/docker-compose.yml:

```yaml
version: "3.8"
services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - ../.env.local
    environment:
      AI_PROVIDER: ${AI_PROVIDER:-mock}
```

4. Add docker/Dockerfile to .dockerignore (create if missing):

```
node_modules
.next
.git
.env*.local
bun.lockb
tests/e2e
docs
```

## Tests — Step 0.3

### Manual Verification

- [ ] `docker build -f docker/Dockerfile -t ai-email-gen .` — exits 0
- [ ] `docker run -p 3000:3000 --env-file .env.local ai-email-gen` — app responds at :3000
- [ ] `docker images ai-email-gen` — image size < 200 MB

```

---

## Step 0.4 — GitHub Actions CI (Bun)

### Context7
```

Context7 → "bun" → GitHub Actions setup, oven-sh/setup-bun action

```

### Prompt
```

You are a DevOps Engineer. Write GitHub Actions CI using Bun.

## Context (GitNexus: ai-email-generator/main)

- ARCHITECTURE.md → Section 3.15 (CI/CD)
- README.md → CI badge URL pattern

## Context7

- Context7 → "bun" → GitHub Actions integration, oven-sh/setup-bun

## Task

Create .github/workflows/ci.yml:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  ci:
    name: Typecheck · Lint · Test · Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Type check
        run: bun run typecheck

      - name: Lint
        run: bun run lint

      - name: Unit tests
        run: bun test --coverage

      - name: Build
        run: bun run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          AI_PROVIDER: mock
```

Create .github/workflows/deploy.yml:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    needs: [ci]
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install --frozen-lockfile
      - name: Deploy
        run: bunx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Tests — Step 0.4

### Manual Verification

- [ ] YAML valid (no syntax errors — use yamllint or GitHub Actions linter)
- [ ] Push to a feature branch → CI runs on GitHub Actions
- [ ] All CI steps pass (typecheck · lint · bun test · build)

````

---

## Step 0.5 — Pre-commit Hooks (Husky + lint-staged)

### Context7
```
Context7 → "husky" → setup with Bun, pre-commit hooks
```

### Prompt
```
You are a DevOps Engineer. Set up pre-commit hooks to enforce code quality.

## Context (GitNexus: ai-email-generator/main)
- RULES.md → Section 8 (Testing), Section 9 (Git Conventions)
- package.json scripts (typecheck, lint, test)

## Context7
- Context7 → "husky" → Bun integration, pre-commit setup

## Task

### 1. Install husky + lint-staged
```bash
bun add -d husky lint-staged
```

### 2. Initialize husky
```bash
bunx husky init
```

### 3. Create .husky/pre-commit
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

bunx lint-staged
bun run typecheck
```

### 4. Add lint-staged config to package.json
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

### 5. Add prepare script to package.json
```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

### 6. Create .prettierrc
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 7. Create .prettierignore
```
.next
node_modules
bun.lockb
coverage
dist
```

## Tests — Step 0.5

### Manual Verification

- [ ] `git add . && git commit` → lint-staged runs ESLint + Prettier
- [ ] Commit with TypeScript error → pre-commit hook fails
- [ ] `bun run prepare` → husky installs hooks
- [ ] `.husky/pre-commit` exists and is executable

```

---

## Step 0.6 — CSP Headers + Security (next.config.ts)

### Context7
```
Context7 → "next.js" → next.config.ts, headers, Content Security Policy
```

### Prompt
```
You are a security-focused Next.js developer. Add CSP headers to next.config.ts.

## Context (GitNexus: ai-email-generator/main)
- RULES.md → Section 11 (Security)
- SPEC.md → NFR-02 (Security: CSP headers, HTTPS)
- next.config.ts (existing)

## Context7
- Context7 → "next.js" → next.config.ts headers API, CSP directives

## Task

### 1. Update next.config.ts with security headers
```typescript
import type { NextConfig } from 'next'

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim()

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspHeader,
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
```

### 2. Add Supabase domains to CSP (if using Supabase Storage images)
```typescript
// Add to img-src in cspHeader:
// img-src 'self' blob: data: https://*.supabase.co;
```

## Tests — Step 0.6

### Manual Verification

- [ ] `bun dev` → app starts without errors
- [ ] Browser DevTools → Network tab → Response Headers include `Content-Security-Policy`
- [ ] No CSP violations in Console
- [ ] `bun run build` → build succeeds

```

---

## Step 0.7 — Cyberpunk Fonts (next/font)

### Context7
```
Context7 → "next.js" → next/font Google Fonts integration
```

### Prompt
```
You are a Next.js 15 UI developer. Add cyberpunk fonts to the project.

## Context (GitNexus: ai-email-generator/main)
- DESIGN_SYSTEM.md → Typography section (Orbitron, JetBrains Mono, Share Tech Mono)
- RULES.md → Section 4.1 (design tokens)
- src/app/layout.tsx (existing root layout)

## Context7
- Context7 → "next.js" → next/font Google Fonts integration, variable fonts

## Task

### 1. Update src/app/layout.tsx — add cyberpunk fonts
```typescript
import type { Metadata } from 'next'
import { Orbitron, JetBrains_Mono, Share_Tech_Mono } from 'next/font/google'
import './globals.css'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '700', '900']
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['300', '400', '500', '700']
})

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  variable: '--font-label',
  display: 'swap',
  weight: '400'
})

export const metadata: Metadata = {
  title: {
    default: 'NEUROMAIL — Write Better Emails in Seconds',
    template: '%s | NEUROMAIL'
  },
  description: 'AI-powered email generation with precision tone control. No writer\'s block. No generic templates.',
  openGraph: {
    title: 'NEUROMAIL',
    description: 'AI-powered email generation with precision tone control',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NEUROMAIL' }]
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
}

type RootLayoutProps = { children: React.ReactNode }

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${orbitron.variable} ${jetbrainsMono.variable} ${shareTechMono.variable} font-mono bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

### 2. Update src/app/globals.css — add cyberpunk design tokens
Copy the full @theme block from RULES.md §4.1 verbatim, including:
- Cyberpunk color palette (hex values)
- Font variables (--font-display, --font-mono, --font-label)
- Container utilities
- Focus indicators
- Cyberpunk effects (rgb-shift, glitch, pulse-glow, blink, fade-up)
- prefers-reduced-motion media query

## Tests — Step 0.7

### Manual Verification

- [ ] `bun dev` → fonts load correctly
- [ ] Inspect body → has `--font-display`, `--font-mono`, `--font-label` CSS variables
- [ ] Test text: `<h1 className="font-display">NEUROMAIL</h1>` → Orbitron font
- [ ] Test text: `<p className="font-mono">Body text</p>` → JetBrains Mono
- [ ] Test text: `<span className="font-label">LABEL</span>` → Share Tech Mono
- [ ] `bun run typecheck` → 0 errors
- [ ] `bun run build` → build succeeds

```

---

## Phase 0 Regression Test

```bash
bun run typecheck     # 0 errors
bun run lint          # 0 warnings
bun test              # 5+ tests, all green
bun run build         # build completes successfully
````

**Write report:** `docs/reports/phase-0-report.md`

Use this template:

```markdown
# Phase 0 Report

**Date:** YYYY-MM-DD  
**Status:** ✅ Complete

## Steps

- [x] 0.1 — Next.js scaffold with Bun
- [x] 0.2 — bun test smoke tests
- [x] 0.3 — Docker (oven/bun)
- [x] 0.4 — GitHub Actions CI
- [x] 0.5 — Pre-commit hooks (husky + lint-staged)
- [x] 0.6 — CSP headers + security config
- [x] 0.7 — Cyberpunk fonts (next/font)

## Test Results

- bun test: X/X passing
- bun run build: ✅

## Context7 Lookups

| Library     | Topic                 | Used For                |
| ----------- | --------------------- | ----------------------- |
| next.js     | create-next-app       | Project init            |
| bun         | bunfig.toml, bun:test | Test runner setup       |
| tailwindcss | v4 @theme             | globals.css tokens      |
| shadcn-ui   | init + add            | Component library setup |
| husky       | pre-commit hooks      | Code quality enforcement |

## Notes

- ...
```
