# Phase 4 — Auth Pages: Login · Register

> **Goal:** fully functional Login and Register pages with React Hook Form + Zod + Server Actions, E2E tested.  
> **Estimated time:** ~2 hours  
> **Prerequisite:** Phase 2 (Server Actions) complete  
> **Regression:** `bun run typecheck && bun test --dom && bun run test:e2e`

---

## Context Sources

### GitNexus (ai-email-generator / main)
```
/SPEC.md          → FR-02 (auth acceptance criteria), US-01 (register), US-02 (login)
/RULES.md         → Section 3.1 (functional components), Section 4 (mobile-first)
/AGENT.md         → "Technology Map → Forms (RHF + Zod)"
/src/lib/validations/auth.ts  → LoginSchema, RegisterSchema, LoginInput, RegisterInput
/src/actions/auth.ts          → loginAction, registerAction, logoutAction
/src/types/index.ts           → ActionResult
```

### Context7 (fetch before each step)
```
react-hook-form  → useForm, FormProvider, useFormContext, zodResolver, handleSubmit, formState.errors
zod              → already set up — reference only
next.js          → useFormStatus (from react-dom), useActionState, Server Actions + RHF
shadcn-ui        → Form, FormField, FormItem, FormLabel, FormControl, FormMessage
```

---

## UI Reference

**Source:** `ui/Auth.dc.html`

**Page Structure:**
1. Logo (RGB shift animation, centered)
2. Auth card (chamfered corners, corner accents)
3. Form (terminal-style inputs with ">" prefix)
4. Footer link

**Key Components:**
- Logo: "NEUR·O·MAIL" with RGB shift animation
- Card: chamfered clip-path, corner accents (green borders)
- Inputs: ">" prefix, chamfered clip-path, cyberpunk labels ("01 // EMAIL_ADDRESS")
- Button: "INITIALIZE_ACCESS →" (chamfered, pulse-glow)
- Background: circuit grid + radial glow
- Errors: "ERR: ACCESS_DENIED · Invalid credentials"

**Design System:** See `DESIGN_SYSTEM.md` for complete cyberpunk specification.

---

## Step 4.1 — Auth Layout + Shared Form Components

### Context7
```
Context7 → "next.js" → App Router group layout, Metadata
Context7 → "shadcn-ui" → Card, Button, Input components
```

### Prompt
```
You are a Next.js 15 + Tailwind CSS developer. Create the auth layout and reusable form components.

## Context (GitNexus: ai-email-generator/main)
- RULES.md → Section 3 (functional components), Section 4 (Tailwind)
- src/app/globals.css (@theme tokens)
- SPEC.md → FR-02

## Context7 (fetch before writing)
- Context7 → "next.js" → group route layout
- Context7 → "shadcn-ui" → Card, CardContent, CardHeader, CardTitle

## Task

### 1. src/app/(auth)/layout.tsx — centred single-column layout
```typescript
import Link from 'next/link'

type AuthLayoutProps = { children: React.ReactNode }

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Circuit grid background */}
      <div 
        className="fixed inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Radial glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(0,255,136,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Simple top bar */}
      <header className="relative z-10 border-b border-border px-4 py-4">
        <Link href="/" className="font-display font-black text-primary uppercase tracking-wider animate-rgb-shift">
          NEUR·O·MAIL
        </Link>
      </header>

      {/* Main content — vertically centred */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="relative z-10 border-t border-border px-4 py-4 text-center font-mono text-xs text-muted-foreground">
        © {new Date().getFullYear()} NEUROMAIL
      </footer>
    </div>
  )
}
```

### 2. src/components/auth/form-error.tsx — reusable error alert
```typescript
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type FormErrorProps = {
  message: string | null | undefined
  className?: string
}

export const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 border border-destructive/50 bg-destructive/10',
        'px-3 py-2.5 font-mono text-xs text-destructive',
        'clip-path-[polygon(0_4px,4px_0,calc(100%_-_4px)_0,100%_4px,100%_calc(100%_-_4px),calc(100%_-_4px)_100%,4px_100%,0_calc(100%_-_4px))]',
        className
      )}
    >
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>ERR: {message}</span>
    </div>
  )
}
```

### 3. src/components/auth/submit-button.tsx — tracks pending state via useFormStatus
```typescript
'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type SubmitButtonProps = {
  label: string
  loadingLabel?: string
  className?: string
}

export const SubmitButton = ({ label, loadingLabel = 'AUTHENTICATING...', className }: SubmitButtonProps) => {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn('w-full chamfered animate-pulse-glow', className)}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? loadingLabel : label}
    </Button>
  )
}
```

## Tests — Step 4.1
### Component (bun test --dom)
```typescript
// tests/unit/auth/submit-button.test.tsx
import { describe, it, expect } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { SubmitButton } from '@/components/auth/submit-button'

describe('SubmitButton', () => {
  it('renders label text', () => {
    render(<SubmitButton label="Sign in" />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined()
  })
  it('is not disabled by default', () => {
    render(<SubmitButton label="Sign in" />)
    const btn = screen.getByRole('button')
    expect(btn.hasAttribute('disabled')).toBe(false)
  })
})
```
### Manual Verification
- [ ] `bun test --dom` — SubmitButton tests green
- [ ] Auth layout renders with logo and footer
- [ ] Layout centred at all breakpoints
```

---

## Step 4.2 — Login Page

### Context7
```
Context7 → "react-hook-form" → useForm, zodResolver, handleSubmit, formState.errors
Context7 → "shadcn-ui"      → Form, FormField, FormItem, FormLabel, FormControl, FormMessage
Context7 → "next.js"        → useActionState from react (NOT next), startTransition
```

### Prompt
```
You are a Next.js 15 forms specialist. Create the Login page with RHF + Zod + Server Action.

## Context (GitNexus: ai-email-generator/main)
- src/lib/validations/auth.ts (LoginSchema, LoginInput)
- src/actions/auth.ts (loginAction)
- src/components/auth/form-error.tsx
- src/components/auth/submit-button.tsx
- RULES.md → Section 3 (naming, functional), Section 4 (Tailwind)
- SPEC.md → FR-02 (login acceptance criteria), US-02

## Context7 (MANDATORY — fetch before writing form code)
- Context7 → "react-hook-form" → useForm, zodResolver, handleSubmit, formState
- Context7 → "shadcn-ui" → Form component (FormField, FormItem, FormLabel, FormControl, FormMessage)

## Task

### 1. src/components/auth/login-form.tsx
```typescript
'use client'
// Client Component: uses React Hook Form + useTransition

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { LoginSchema, type LoginInput } from '@/lib/validations/auth'
import { loginAction } from '@/actions/auth'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from './form-error'
import { Loader2 } from 'lucide-react'

export const LoginForm = () => {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = (data: LoginInput) => {
    setServerError(null)
    const formData = new FormData()
    formData.set('email', data.email)
    formData.set('password', data.password)

    startTransition(async () => {
      const result = await loginAction(formData)
      if (!result.success) {
        setServerError(result.error)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormError message={serverError} />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                01 // EMAIL_ADDRESS
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
                    &gt;
                  </span>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isPending}
                    className="pl-8 chamfered"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                02 // PASSWORD
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
                    &gt;
                  </span>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isPending}
                    className="pl-8 chamfered"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full chamfered animate-pulse-glow">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'AUTHENTICATING...' : 'INITIALIZE_ACCESS →'}
        </Button>

        <p className="text-center font-mono text-xs text-muted-foreground">
          No account?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">
            REGISTER →
          </Link>
        </p>
      </form>
    </Form>
  )
}
```

### 2. src/app/(auth)/login/page.tsx
```typescript
import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Login | NEUROMAIL' }

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      {/* Section label */}
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3 text-center">
        // ACCESS_PROTOCOL
      </div>
      
      {/* Card with chamfered corners */}
      <div className="bg-card border border-border overflow-hidden" style={{
        clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))'
      }}>
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-black text-foreground uppercase tracking-wider">
              SYSTEM_LOGIN
            </h1>
            <p className="font-mono text-sm text-muted-foreground">
              Enter your credentials to access the system
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
```

## Tests — Step 4.2
### Component (bun test --dom)
```typescript
// tests/unit/auth/login-form.test.tsx
import { describe, it, expect } from 'bun:test'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/components/auth/login-form'

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeDefined()
    expect(screen.getByLabelText(/password/i)).toBeDefined()
  })

  it('shows validation error for invalid email', async () => {
    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'not-email' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeDefined()
    })
  })

  it('shows validation error when password is empty', async () => {
    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeDefined()
    })
  })

  it('has link to register page', () => {
    render(<LoginForm />)
    const link = screen.getByRole('link', { name: /sign up/i })
    expect(link.getAttribute('href')).toBe('/register')
  })
})
```
### E2E (Playwright)
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/valid email/i)).toBeVisible()
  })

  test('shows error for wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('wrong@example.com')
    await page.getByLabel(/password/i).fill('WrongPass1')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/invalid email or password/i)).toBeVisible()
  })

  test('redirects to dashboard on valid login', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill(process.env.TEST_USER_EMAIL!)
    await page.getByLabel(/password/i).fill(process.env.TEST_USER_PASSWORD!)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/dashboard')
  })
})
```
### Manual Verification
- [ ] /login renders Card with form
- [ ] Email validation: error shown inline
- [ ] Wrong password: server error appears below button
- [ ] Valid credentials: redirect to /dashboard
- [ ] Keyboard: Tab through fields, Enter submits
- [ ] Mobile (375px): form fits without overflow
```

---

## Step 4.3 — Register Page

### Context7
```
Context7 → "react-hook-form" → useForm, refine + cross-field validation with RHF
Context7 → "shadcn-ui"      → Form components
```

### Prompt
```
You are a Next.js 15 forms specialist. Create the Register page with full password validation.

## Context (GitNexus: ai-email-generator/main)
- src/lib/validations/auth.ts (RegisterSchema — has .refine for password match)
- src/actions/auth.ts (registerAction)
- src/components/auth/form-error.tsx, submit-button.tsx
- RULES.md → Section 3, 4
- SPEC.md → FR-02 (register: email + min 8 char password + uppercase + number)

## Context7 (MANDATORY)
- Context7 → "react-hook-form" → cross-field validation, resolver usage

## Task

### 1. src/components/auth/register-form.tsx
Pattern matches LoginForm but has 3 fields (email, password, confirmPassword) and richer validation.

```typescript
'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { RegisterSchema, type RegisterInput } from '@/lib/validations/auth'
import { registerAction } from '@/actions/auth'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from './form-error'
import { Loader2 } from 'lucide-react'

export const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' }
  })

  const onSubmit = (data: RegisterInput) => {
    setServerError(null)
    const formData = new FormData()
    formData.set('email', data.email)
    formData.set('password', data.password)
    formData.set('confirmPassword', data.confirmPassword)

    startTransition(async () => {
      const result = await registerAction(formData)
      if (!result.success) {
        setServerError(result.error)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormError message={serverError} />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                01 // EMAIL_ADDRESS
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
                    &gt;
                  </span>
                  <Input type="email" placeholder="you@example.com"
                    autoComplete="email" disabled={isPending} className="pl-8 chamfered" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                02 // PASSWORD
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
                    &gt;
                  </span>
                  <Input type="password" placeholder="Min 8 chars, 1 uppercase, 1 number"
                    autoComplete="new-password" disabled={isPending} className="pl-8 chamfered" {...field} />
                </div>
              </FormControl>
              <div className="font-mono text-xs text-muted-foreground mt-1">// min 8 chars</div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                03 // CONFIRM_PASSWORD
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
                    &gt;
                  </span>
                  <Input type="password" placeholder="Repeat password"
                    autoComplete="new-password" disabled={isPending} className="pl-8 chamfered" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full chamfered animate-pulse-glow">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'INITIALIZING...' : 'CREATE_ACCOUNT →'}
        </Button>

        <p className="text-center font-mono text-xs text-muted-foreground">
          Have account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            LOGIN →
          </Link>
        </p>
      </form>
    </Form>
  )
}
```

### 2. src/app/(auth)/register/page.tsx
```typescript
import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = { title: 'Register | NEUROMAIL' }

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      {/* Section label */}
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3 text-center">
        // NEW_USER_PROTOCOL
      </div>
      
      {/* Card with chamfered corners */}
      <div className="bg-card border border-border overflow-hidden" style={{
        clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))'
      }}>
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-black text-foreground uppercase tracking-wider">
              SYSTEM_REGISTER
            </h1>
            <p className="font-mono text-sm text-muted-foreground">
              Create your account to start generating
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
```

## Tests — Step 4.3
### Component (bun test --dom)
```typescript
// tests/unit/auth/register-form.test.tsx
import { describe, it, expect } from 'bun:test'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RegisterForm } from '@/components/auth/register-form'

describe('RegisterForm', () => {
  it('renders all three fields with cyberpunk labels', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText(/EMAIL_ADDRESS/i)).toBeDefined()
    expect(screen.getByLabelText(/^PASSWORD/i)).toBeDefined()
    expect(screen.getByLabelText(/CONFIRM_PASSWORD/i)).toBeDefined()
  })

  it('shows error for weak password (no uppercase)', async () => {
    render(<RegisterForm />)
    fireEvent.change(screen.getByLabelText(/EMAIL_ADDRESS/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/^PASSWORD/i), { target: { value: 'password1' } })
    fireEvent.change(screen.getByLabelText(/CONFIRM_PASSWORD/i), { target: { value: 'password1' } })
    fireEvent.click(screen.getByRole('button', { name: /CREATE_ACCOUNT/i }))
    await waitFor(() => {
      expect(screen.getByText(/uppercase/i)).toBeDefined()
    })
  })

  it('shows error when passwords don\'t match', async () => {
    render(<RegisterForm />)
    fireEvent.change(screen.getByLabelText(/EMAIL_ADDRESS/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/^PASSWORD/i), { target: { value: 'Password1' } })
    fireEvent.change(screen.getByLabelText(/CONFIRM_PASSWORD/i), { target: { value: 'Password2' } })
    fireEvent.click(screen.getByRole('button', { name: /CREATE_ACCOUNT/i }))
    await waitFor(() => {
      expect(screen.getByText(/don't match/i)).toBeDefined()
    })
  })
})
```
### E2E (Playwright)
```typescript
// Append to tests/e2e/auth.spec.ts
test.describe('Register Page', () => {
  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/register')
    await page.getByRole('button', { name: /CREATE_ACCOUNT/i }).click()
    await expect(page.getByText(/valid email/i)).toBeVisible()
  })

  test('shows error for duplicate email', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel(/EMAIL_ADDRESS/i).fill(process.env.TEST_USER_EMAIL!)
    await page.getByLabel(/^PASSWORD/i).fill('Password1')
    await page.getByLabel(/CONFIRM_PASSWORD/i).fill('Password1')
    await page.getByRole('button', { name: /CREATE_ACCOUNT/i }).click()
    await expect(page.getByText(/already registered/i)).toBeVisible()
  })
})
```
### Manual Verification
- [ ] /register renders 3-field form with cyberpunk styling
- [ ] Section label "// NEW_USER_PROTOCOL" visible
- [ ] Heading "SYSTEM_REGISTER" in Orbitron font
- [ ] All inputs have ">" prefix and chamfered corners
- [ ] Weak password (no uppercase): inline error shown with "ERR:" prefix
- [ ] Password mismatch: confirmPassword error shown
- [ ] Duplicate email: server error shown
- [ ] Valid new user: redirect to /dashboard
- [ ] Profile row appears in Supabase immediately
- [ ] Mobile: all fields accessible, button full-width
```

---

## Phase 4 Regression Test

```bash
bun run typecheck     # 0 errors
bun test --dom        # login-form + register-form tests green
bun run test:e2e      # auth.spec.ts all passing
bun run build         # no build errors
```

### Manual Auth Flow Checklist
- [ ] / → click "Get started" → /register
- [ ] Register new user → /dashboard
- [ ] Logout → /
- [ ] /dashboard (no session) → /login
- [ ] Login → /dashboard
- [ ] Both forms: accessibility (label → input associations, tab order)

**Write report:** `docs/reports/phase-4-report.md`
