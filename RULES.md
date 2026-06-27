# RULES.md — Development Standards · MVP AI Email Generator

> These rules are mandatory for all contributors, including LLM agents.  
> Violating a rule = PR blocked.

---

## 1. Language & Typing

### 1.1 TypeScript — strict mode

```jsonc
// tsconfig.json — required flags
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

Forbidden: `any`, `as any`, `@ts-ignore` (without explanation comment), `!` (non-null assertion) without obvious justification.  
Allowed: `unknown` + type narrowing, `as const`, `satisfies`.

### 1.2 Naming Conventions

| Entity | Style | Example |
|---|---|---|
| Variables, functions | `camelCase` | `generateEmail`, `userEmail` |
| React Components | `PascalCase` | `EmailGeneratorForm` |
| Types / Interfaces | `PascalCase` | `GenerateEmailParams` |
| Zod schemas | `PascalCase` + `Schema` suffix | `GenerateEmailSchema` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_EMAIL_LENGTH` |
| Component files | `kebab-case.tsx` | `email-generator-form.tsx` |
| Utility files | `kebab-case.ts` | `use-generate-email.ts` |
| CSS variables | `--kebab-case` | `--color-primary` |
| Zustand store actions | verb + noun | `setTone`, `resetForm`, `openModal` |
| Server Actions | verb + noun + `Action` | `generateEmailAction`, `loginAction` |
| Supabase tables | `snake_case` (plural) | `generated_emails`, `profiles` |
| Supabase columns | `snake_case` | `user_id`, `created_at` |

---

## 2. Functional Approach — STRICT

### 2.1 No Classes

```typescript
// ❌ FORBIDDEN
class EmailService {
  generate() { ... }
}

// ✅ CORRECT
const generateEmail = (params: GenerateEmailParams): Promise<GenerateEmailResult> => { ... }
```

**Exception:** Error boundaries (`class ErrorBoundary extends React.Component`) — the only place a class is permitted (React requires it).

### 2.2 Pure Functions

- Functions must not have side effects unless explicitly marked (Server Actions, hooks).
- Use `const` for all functions. No `function` declarations except Server Actions and Next.js page/layout (Next.js requires `export default function`).

```typescript
// ❌
function formatDate(date: Date) { ... }

// ✅
const formatDate = (date: Date): string => { ... }

// ✅ Server Action (exception)
export async function loginAction(formData: FormData) { ... }
```

### 2.3 Immutability

- Never mutate arrays/objects in place. Use spread, `map`, `filter`, `reduce`.
- `const` for all variables. `let` only when reassignment is unavoidable (loop counters).
- `var` is forbidden.

---

## 3. React Components

### 3.1 Functional Components Only

```typescript
// ❌ FORBIDDEN
export default class HeroSection extends React.Component { ... }

// ✅
const HeroSection = (): JSX.Element => {
  return <section>...</section>
}
export default HeroSection
```

### 3.2 Props

- Always type via `type`, not `interface` (for component props).
- Destructure props in the function signature.
- Do not use `React.FC` (hides return type, causes generic issues).

```typescript
// ❌
const Button: React.FC<ButtonProps> = (props) => <button>{props.children}</button>

// ✅
type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

const Button = ({ children, variant = 'primary', onClick }: ButtonProps) => (
  <button onClick={onClick}>{children}</button>
)
```

### 3.3 Server vs Client Components

- Default: Server Component (no `'use client'`).
- Add `'use client'` only when necessary: hooks, event handlers, browser API.
- The client/server boundary must be as low in the component tree as possible.
- Comment is required when adding `'use client'`:

```typescript
'use client'
// Client Component: uses useState for form state management
```

### 3.4 Export Naming

- Page components (`page.tsx`, `layout.tsx`) → `export default`.
- All other components → **named export**.

```typescript
// page.tsx
export default function DashboardPage() { ... }

// email-generator-form.tsx
export const EmailGeneratorForm = () => { ... }
```

---

## 4. CSS & Tailwind

### 4.1 Design System via CSS Variables

All tokens are defined in `src/app/globals.css` inside `@theme`. **Dark mode only** — no light theme.

```css
@import "tailwindcss";

@theme {
  /* Colors - Cyberpunk Palette (hex for precise neon control) */
  --color-background: #0a0a0f;
  --color-card: #12121a;
  --color-muted: #1c1c2e;
  --color-border: #2a2a3a;
  --color-foreground: #e0e0e0;
  --color-muted-foreground: #6b7280;
  --color-primary: #00ff88;
  --color-secondary: #ff00ff;
  --color-tertiary: #00d4ff;
  --color-destructive: #ff3366;

  /* Typography - Cyberpunk Fonts */
  --font-display: 'Orbitron', monospace;
  --font-mono: 'JetBrains Mono', monospace;
  --font-label: 'Share Tech Mono', monospace;
  
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* Spacing */
  --spacing-section: 5rem;
  --spacing-container: 1.5rem;

  /* Shadows - Neon Glow */
  --shadow-sm: 0 0 5px rgba(0, 255, 136, 0.2);
  --shadow-md: 0 0 10px rgba(0, 255, 136, 0.3);
  --shadow-lg: 0 0 20px rgba(0, 255, 136, 0.4);

  /* Animation */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Layout utilities */
@utility container {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: var(--spacing-container);
}

@utility container-narrow {
  width: 100%;
  max-width: 640px;
  margin-inline: auto;
  padding-inline: var(--spacing-container);
}

/* Focus indicators (WCAG 2.1 AA) */
@layer base {
  :focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

/* Cyberpunk Effects */
@keyframes rgb-shift {
  0%, 100% { text-shadow: -1px 0 #ff00ff, 1px 0 #00d4ff; }
  50% { text-shadow: 1px 0 #ff00ff, -1px 0 #00d4ff; }
}

@keyframes glitch {
  0%, 79%, 100% { transform: translate(0); }
  80% { transform: translate(-3px, 1px); }
  83% { transform: translate(2px, -1px); }
  86% { transform: translate(0); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px #00ff88, 0 0 10px rgba(0, 255, 136, 0.35); }
  50% { box-shadow: 0 0 14px #00ff88, 0 0 28px rgba(0, 255, 136, 0.55); }
}

@keyframes blink {
  50% { opacity: 0; }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Reference:** See `DESIGN_SYSTEM.md` for complete cyberpunk design system specification.

### 4.2 Tailwind Class Rules

```typescript
// ❌ FORBIDDEN: hardcoded arbitrary values
<div className="text-[#3B82F6] mt-[27px] w-[342px]" />

// ✅ Use design-system tokens
<div className="text-primary mt-6 w-full max-w-sm" />
```

- No arbitrary values `[...]` except in extreme cases (must include a comment explaining why).
- Class order: layout → spacing → typography → color → border → effects → responsive → state.
- Conditional classes via `cn()` utility (clsx + tailwind-merge).

```typescript
import { cn } from '@/lib/utils'

<button className={cn(
  "px-4 py-2 rounded-md font-medium transition-colors",
  variant === 'primary' && "bg-primary text-primary-foreground hover:bg-primary/90",
  variant === 'secondary' && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  disabled && "opacity-50 cursor-not-allowed",
  className
)} />
```

### 4.3 No Inline Styles

```typescript
// ❌
<div style={{ marginTop: '16px', color: '#blue' }} />

// ✅
<div className="mt-4 text-primary" />
```

Exception: dynamic CSS custom property values that cannot be expressed via Tailwind  
(e.g., `style={{ '--progress': `${value}%` }}`).

### 4.4 Responsive — Mobile First

```typescript
// ❌ Desktop-first
<div className="grid-cols-3 sm:grid-cols-1" />

// ✅ Mobile-first
<div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
```

Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.

### 4.5 Component Styles

No CSS Modules (`.module.css`) for components — Tailwind only.  
`globals.css` is reserved for: `@theme` tokens, CSS reset/base, `@layer base` for global HTML elements.

### 4.6 Icons — lucide-react

All icons come from `lucide-react`. No other icon libraries, no raw SVG files for UI icons.

```typescript
// ✅ CORRECT
import { Mail, ArrowRight, Check, X } from 'lucide-react'

<Mail className="size-5 text-muted-foreground" />
<ArrowRight className="size-4" aria-hidden="true" />

// ❌ FORBIDDEN
import { FaEnvelope } from 'react-icons/fa'
import { MdArrowForward } from 'react-icons/md'
```

**Rules:**
- Always pass `className` for sizing (`size-4`, `size-5`, `size-6`) — never hardcode `width`/`height`.
- Decorative icons: add `aria-hidden="true"`.
- Interactive icons (buttons, links): wrap in a parent with `aria-label`.
- Use `strokeWidth` prop only when the design explicitly requires it.

### 4.7 Logo

The logo is a **text-based inline SVG + wordmark** — no image files, no CDN dependency.

```typescript
// src/components/shared/logo.tsx
import { Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

type LogoProps = { className?: string; size?: 'sm' | 'md' | 'lg' }

const sizes = {
  sm: { icon: 'size-5', text: 'text-lg' },
  md: { icon: 'size-6', text: 'text-xl' },
  lg: { icon: 'size-8', text: 'text-2xl' },
} as const

export const Logo = ({ className, size = 'md' }: LogoProps) => (
  <span className={cn('inline-flex items-center gap-2 font-bold text-foreground', className)}>
    <Mail className={sizes[size].icon} aria-hidden="true" />
    <span className={sizes[size].text}>EmailAI</span>
  </span>
)
```

**Rules:**
- Use `<Logo />` component everywhere — no emoji `✉️` in production code.
- Favicon: generate at build time via `next/font` or a static `public/favicon.ico` (32×32, created in Phase 3).
- OG image: `public/og-image.png` (1200×630) — generate with `/api/og` route or static file in Phase 3.

---

## 5. File Structure & Imports

### 5.1 Path Aliases

```json
// tsconfig.json
{
  "paths": { "@/*": ["./src/*"] }
}
```

Use `@/` for all internal imports. Relative paths going up (`../`) more than one level are forbidden.

```typescript
// ❌
import { Button } from '../../../components/ui/button'

// ✅
import { Button } from '@/components/ui/button'
```

### 5.2 Import Order (ESLint enforced)

```typescript
// 1. React / Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. External libraries
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'

// 3. Internal — types
import type { GenerateEmailParams } from '@/types'

// 4. Internal — lib/utils
import { cn } from '@/lib/utils'

// 5. Internal — components
import { Button } from '@/components/ui/button'

// 6. Internal — hooks/store/actions
import { useGenerateEmail } from '@/hooks/use-generate-email'
```

---

## 6. Error Handling

### 6.1 No Empty Catch Blocks

```typescript
// ❌
try {
  await generateEmail(params)
} catch (e) {}

// ✅
try {
  await generateEmail(params)
} catch (error) {
  console.error('[generateEmail]', error)
  throw new Error('Failed to generate email', { cause: error })
}
```

### 6.2 Typed Errors

```typescript
type AppError = {
  code: 'AUTH_REQUIRED' | 'AI_UNAVAILABLE' | 'RATE_LIMITED' | 'VALIDATION_ERROR'
  message: string
  details?: unknown
}
```

### 6.3 Server Actions Return Typed Results

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: AppErrorCode }

export const generateEmailAction = async (
  params: GenerateEmailParams
): Promise<ActionResult<GeneratedEmail>> => {
  // ...
}
```

### 6.4 Error Boundaries

- `app/error.tsx` — global fallback.
- Component-level boundaries for AI results and email history.
- No white screens, ever.

---

## 7. Context7 — Mandatory for Library Work

> **This rule applies to every LLM agent and every human developer.**

### 7.1 Rule

**Before using any library API, installing a package, or configuring a dependency — fetch the current documentation via Context7 MCP.**

Training data is unreliable for library APIs: versions change, methods deprecate, configuration formats shift. Context7 provides pinned, current documentation for the exact package version in use.

### 7.2 When to Use Context7

| Situation | Action |
|---|---|
| Installing a new npm package | Fetch its docs via Context7 before writing integration code |
| Using a shadcn/ui component | Context7 → `shadcn/ui` → component name |
| Configuring Supabase SDK | Context7 → `supabase-js` → relevant guide |
| Next.js App Router APIs | Context7 → `next.js` → topic |
| Tailwind CSS v4 config | Context7 → `tailwindcss` |
| Framer Motion animations | Context7 → `framer-motion` |
| Zod schema patterns | Context7 → `zod` |
| TanStack Query hooks | Context7 → `tanstack-query` | _Not used in MVP — reference for future_ |
| Zustand store patterns | Context7 → `zustand` |

### 7.3 Workflow

```
Task: "Add a Supabase query to fetch user emails"

WRONG ❌
→ Write code from memory / training data
→ Risk: outdated API signatures, deprecated methods

CORRECT ✅
1. Context7 MCP → resolve "supabase-js"
2. Context7 MCP → get-library-docs for "querying data"
3. Read current API → write code based on actual docs
4. Commit
```

### 7.4 Context Provider

Context for the project is managed via **GitNexus** (connected repository: `ai-email-generator`, branch: `main`). GitNexus provides:
- Project-specific context: `ARCHITECTURE.md`, `RULES.md`, `SPEC.md`, `AGENT.md`
- Code context: actual file contents, types, schemas

Context7 provides:
- External library documentation (always up to date)
- Package API references
- Migration guides

**Use both together:** GitNexus for project context, Context7 for library docs.

### 7.5 Installing Packages

Before adding any dependency:

```bash
# 1. Check if it already exists
bun pm ls | grep <package-name>

# 2. Fetch docs via Context7 to confirm correct package name and version
# Context7 MCP → resolve-library-id → "<package-name>"

# 3. Install
bun add <package-name>

# 4. Document the addition in the PR description with reason
```

No package should be added without: (a) a reason, (b) bundle size consideration, (c) Context7 docs consulted.

---

## 8. Testing

### 8.1 Required Tests per Module

| Type | Covers | Tool |
|---|---|---|
| Unit | utilities, Zod schemas, AI providers, hooks | bun test |
| Integration | Server Actions, Supabase queries | bun test + msw |
| E2E | auth flow, generate email flow, pricing page | Playwright |

### 8.2 Test Writing Rules

- Test file co-located with tested file: `utils.ts` → `utils.test.ts`.
- E2E tests in `tests/e2e/`.
- Naming: `describe('generateEmail') → it('should return error when subject is empty')`.
- No `test.only` in commits.
- Import from `bun:test`, not `vitest`:

```typescript
// ❌
import { describe, it, expect, vi } from 'vitest'

// ✅
import { describe, it, expect, mock, spyOn } from 'bun:test'
```

- Mock modules via `mock.module()` (bun test equivalent of `vi.mock()`).
- DOM tests run with `bun test --dom` (uses built-in happy-dom).

---

## 9. Git Conventions

### 9.1 Conventional Commits

```
feat(dashboard): add email tone selector
fix(auth): handle expired session redirect
docs(rules): add Context7 rule
test(ai): add mock provider unit tests
chore(deps): update tailwindcss to 4.1.0
```

### 9.2 Branch Naming

```
feature/dashboard-email-generator
fix/auth-session-expiry
chore/setup-ci-pipeline
```

### 9.3 PR Checklist

- [ ] Tests written and passing (`bun test`)
- [ ] TypeScript error-free (`bun run typecheck`)
- [ ] ESLint warning-free (`bun run lint`)
- [ ] No `console.log` in production code
- [ ] Components work on mobile (320px+)
- [ ] Context7 consulted for any new library usage

### 9.4 Pre-commit Hooks (Husky + lint-staged)

Pre-commit hooks are **mandatory** and enforced automatically via Husky.

**What runs on every commit:**
- `lint-staged`: ESLint + Prettier on staged `.ts`, `.tsx`, `.json`, `.md` files
- `bun run typecheck`: full TypeScript check

**Rules:**
- Never skip hooks with `--no-verify` unless explicitly approved
- If hooks fail, fix the issues and commit again
- Hook configuration lives in `.husky/pre-commit` and `package.json` → `lint-staged`

**Setup (first time only):**
```bash
bun run prepare  # installs husky hooks
```

---

## 10. Performance

- Images only via `next/image`.
- Dynamic imports for heavy components: `const Chart = dynamic(() => import(...), { ssr: false })`.
- `loading.tsx` for each dashboard route.
- Do not add dependencies without justification (bundle size matters).

---

## 11. Security

- All user-supplied data goes through Zod before use.
- No secrets in `NEXT_PUBLIC_` variables (Supabase anon key and URL are the only exception).
- Server Actions validate session before executing.
- Content Security Policy (CSP) headers in `next.config.ts`.
- SQL injection prevented via Supabase typed client (prepared statements).

---

## 12. Semantic HTML & Accessibility

### 12.1 Document Structure (Mobile-First)

Every page follows this semantic structure:

```html
<body>
  <a href="#main-content" class="sr-only focus:not-sr-only">
    Skip to content
  </a>

  <header role="banner">
    <div class="container">
      <nav aria-label="Main navigation">...</nav>
    </div>
  </header>

  <main id="main-content" role="main">
    <section aria-labelledby="section-heading">
      <div class="container">
        <h2 id="section-heading">...</h2>
        <!-- content -->
      </div>
    </section>
    <!-- more sections -->
  </main>

  <footer role="contentinfo">
    <div class="container">
      <nav aria-label="Footer navigation">...</nav>
    </div>
  </footer>
</body>
```

**Rules:**
- `<main>` — **one per page**, with `id="main-content"` for skip-link
- `<section>` — each with `aria-labelledby` pointing to its heading
- `<div class="container">` — layout only, no semantic meaning
- Heading hierarchy: `H1` → `H2` → `H3` (never skip levels)
- Landmark roles: `banner` (header), `main`, `contentinfo` (footer)

### 12.2 Container Utility

Add to `src/app/globals.css`:

```css
@utility container {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: var(--spacing-container);
}

@utility container-narrow {
  width: 100%;
  max-width: 640px;
  margin-inline: auto;
  padding-inline: var(--spacing-container);
}
```

**Usage:**
```tsx
// Standard container (max 1280px)
<div className="container">...</div>

// Narrow container for forms (max 640px)
<div className="container-narrow">...</div>
```

### 12.3 Mobile-First Responsive Design

**All components start with mobile styles, then add breakpoints:**

```tsx
// ✅ CORRECT — mobile-first
<section className="py-12 md:py-16 lg:py-20">
  <div className="container">
    <h2 className="text-3xl md:text-4xl lg:text-5xl">...</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* cards */}
    </div>
  </div>
</section>

// ❌ WRONG — desktop-first
<section className="py-20 md:py-16 sm:py-12">
  <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
```

**Breakpoints (Tailwind defaults):**
- Base: `0px` (mobile-first, no prefix)
- `sm:` `640px` (large phones)
- `md:` `768px` (tablets)
- `lg:` `1024px` (laptops)
- `xl:` `1280px` (desktops)

**Mobile-specific rules:**
- Touch targets: minimum `44px × 44px`
- CTA buttons: `w-full` on mobile, `sm:w-auto` on desktop
- Navigation: hamburger menu on mobile, full nav on `lg:flex`
- Forms: full-width inputs, stacked labels
- Modals: full-screen on mobile, centered on desktop

### 12.4 Accessibility Requirements (WCAG 2.1 AA)

**Mandatory for all components:**

1. **Skip link** — first element in `<body>`:
   ```tsx
   <a href="#main-content" className="sr-only focus:not-sr-only absolute top-4 left-4 z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground">
     Skip to content
   </a>
   ```

2. **Focus indicators** — visible on all interactive elements:
   ```css
   /* globals.css */
   :focus-visible {
     outline: 2px solid var(--color-primary);
     outline-offset: 2px;
   }
   ```

3. **Form accessibility:**
   ```tsx
   <label htmlFor="email">Email</label>
   <input id="email" aria-describedby="email-error" />
   <p id="email-error" role="alert">Invalid email</p>
   ```

4. **Loading states:**
   ```tsx
   <div aria-busy="true" aria-live="polite">
     <Spinner />
     <span className="sr-only">Loading...</span>
   </div>
   ```

5. **Icons:**
   ```tsx
   // Decorative
   <Mail aria-hidden="true" />

   // Functional
   <button aria-label="Delete email">
     <Trash aria-hidden="true" />
   </button>
   ```

6. **Images:**
   ```tsx
   // Informative
   <img src="..." alt="Dashboard showing email history" />

   // Decorative
   <img src="..." alt="" aria-hidden="true" />
   ```

**Forbidden:**
- `<div onclick>` — use `<button>` or `<a>`
- `tabIndex={0}` on non-interactive elements
- `outline: none` without replacement
- Color-only indicators (add icons/text)

### 12.5 Schema.org Structured Data

Add JSON-LD to pages for rich snippets:

```tsx
// src/app/(marketing)/page.tsx
export default function LandingPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": CONTENT.landing.faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }

  return (
    <>
      {/* page content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
```

**Required schemas:**
- Landing: `Organization`, `WebApplication`, `FAQPage`
- Pricing: `Product` with `AggregateOffer`
- Auth: none (not indexed)

See `CONTENT.md` §6 for full schema definitions.

### 12.6 Content Management

**All user-facing text comes from `CONTENT.md`:**

```tsx
// src/lib/content.ts
export const CONTENT = {
  landing: {
    hero: {
      heading: "Write Better Emails in Seconds",
      // ...
    }
  }
}

// In components
import { CONTENT } from '@/lib/content'

<h1>{CONTENT.landing.hero.heading}</h1>
```

**Rules:**
- Never hardcode marketing copy in components
- Update `CONTENT.md` first, then `src/lib/content.ts`
- For i18n: populate `messages/en.json` and `messages/ru.json` from `CONTENT.md`
- SEO meta tags: defined in `CONTENT.md` §1.1, §2.1, etc.
