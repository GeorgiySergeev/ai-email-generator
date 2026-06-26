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

All tokens are defined in `src/app/globals.css` inside `@theme`:

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary: oklch(59% 0.2 260);
  --color-primary-foreground: oklch(98% 0 0);
  --color-secondary: oklch(96% 0.01 260);
  --color-secondary-foreground: oklch(20% 0 0);
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(10% 0 0);
  --color-muted: oklch(96% 0.01 260);
  --color-muted-foreground: oklch(55% 0.02 260);
  --color-border: oklch(90% 0.01 260);
  --color-destructive: oklch(55% 0.22 25);
  --color-success: oklch(60% 0.18 145);

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
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

  /* Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Animation */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: oklch(10% 0 0);
    --color-foreground: oklch(98% 0 0);
    /* ... */
  }
}
```

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
| TanStack Query hooks | Context7 → `tanstack-query` |
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
cat package.json | grep <package-name>

# 2. Fetch docs via Context7 to confirm correct package name and version
# Context7 MCP → resolve-library-id → "<package-name>"

# 3. Install
npm install <package-name>

# 4. Document the addition in the PR description with reason
```

No package should be added without: (a) a reason, (b) bundle size consideration, (c) Context7 docs consulted.

---

## 8. Testing

### 8.1 Required Tests per Module

| Type | Covers | Tool |
|---|---|---|
| Unit | utilities, Zod schemas, AI providers, hooks | Vitest |
| Integration | Server Actions, Supabase queries | Vitest + msw |
| E2E | auth flow, generate email flow, pricing page | Playwright |

### 8.2 Test Writing Rules

- Test file co-located with tested file: `utils.ts` → `utils.test.ts`.
- E2E tests in `tests/e2e/`.
- Naming: `describe('generateEmail') → it('should return error when subject is empty')`.
- No `test.only` in commits.
- Mock external dependencies (Supabase, Anthropic API) via `vi.mock()` or msw.

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

- [ ] Tests written and passing
- [ ] TypeScript error-free (`tsc --noEmit`)
- [ ] ESLint warning-free
- [ ] No `console.log` in production code
- [ ] Components work on mobile (320px+)
- [ ] Context7 consulted for any new library usage

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
