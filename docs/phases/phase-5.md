# Phase 5 — Dashboard: Layout · Generator · History · Profile

> **Goal:** complete authenticated dashboard — email generator, history page, profile page, responsive sidebar layout.  
> **Estimated time:** ~4 hours  
> **Prerequisite:** Phase 2 (Server Actions), Phase 4 (Auth) complete  
> **Regression:** `bun run typecheck && bun test --dom && bun run test:e2e`

---

## Context Sources

### GitNexus (ai-email-generator / main)
```
/SPEC.md          → FR-03 (generator), FR-04 (AI), FR-06 (profile), US-03..US-08
/RULES.md         → Section 3 (components), Section 4 (Tailwind), Section 10 (state: Zustand)
/AGENT.md         → "Technology Map → TanStack Query, Zustand"
/src/actions/email.ts   → generateEmailAction, deleteEmailAction
/src/actions/profile.ts → updateProfileAction
/src/lib/validations/email-generator.ts → GenerateEmailSchema, EMAIL_TONE_LABELS, EMAIL_LENGTH_LABELS
/src/types/index.ts     → GeneratedEmail, Profile, ActionResult
```

### Context7 (fetch before each step)
```
next.js         → Server Components data fetching, Suspense, loading.tsx, error.tsx
supabase-js     → .from().select().order() for history queries
tanstack-query  → useQuery, useMutation, QueryClientProvider
zustand         → create, selector pattern
shadcn-ui       → Tabs, Skeleton, Dialog, DropdownMenu, Avatar, Badge
framer-motion   → AnimatePresence, motion.div for result appearance
react-hook-form → re-use from Phase 4
```

---

## UI Reference

**Sources:** 
- `ui/Dashboard.dc.html` (Generator + History)
- `ui/Profile.dc.html` (User settings)

**Dashboard Structure:**
1. Top bar (logo + status + user avatar + logout)
2. Sidebar nav (Generator, History, Profile)
3. Main content:
   - Generator form (terminal-style)
   - Output panel (terminal window)
   - History list (chamfered cards)

**Profile Structure:**
1. Top bar
2. Sidebar nav
3. Main content:
   - Identity card (terminal header "identity.cfg")
   - Subscription card (terminal header "subscription.status")
   - Settings card

**Key Components:**
- Sidebar: "NAVIGATION" label, active state with green border
- Generator: terminal-style form, ">" prefix on inputs
- Output: "OUTPUT_STREAM" header, terminal dots
- History: chamfered cards, "SUBJECT · TONE · DATE" format
- Profile: "identity.cfg" terminal header, avatar with neon border
- Subscription: progress bar with neon glow

**Design System:** See `DESIGN_SYSTEM.md` for complete cyberpunk specification.

---

## Step 5.1 — Dashboard Layout + Sidebar

### Context7
```
Context7 → "next.js" → App Router group layout, loading.tsx
Context7 → "shadcn-ui" → Avatar, Separator, Badge
```

### Prompt
```
You are a Next.js 15 UI developer. Create the authenticated dashboard layout with sidebar navigation.

## Context (GitNexus: ai-email-generator/main)
- SPEC.md → US-03 (dashboard view)
- RULES.md → Section 3.1 (functional components), Section 4 (responsive)
- src/app/globals.css (@theme tokens)

## Context7 (MANDATORY)
- Context7 → "next.js" → layout.tsx, loading.tsx for dashboard group
- Context7 → "supabase-js" → auth.getUser() in Server Component

## Task

### 1. src/components/dashboard/sidebar-nav.tsx
```typescript
'use client'
// Client: uses usePathname for active link highlighting

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Zap, History, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Generator', icon: Zap },
  { href: '/history', label: 'History', icon: History },
  { href: '/profile', label: 'Profile', icon: User }
] as const

type SidebarNavProps = {
  className?: string
}

export const SidebarNav = ({ className }: SidebarNavProps) => {
  const pathname = usePathname()

  return (
    <nav className={cn('flex flex-col gap-0.5', className)}>
      <div className="font-label text-xs text-muted-foreground uppercase tracking-wider px-3 py-2 mb-1">
        NAVIGATION
      </div>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2.5 font-mono text-xs transition-all',
              isActive
                ? 'bg-muted text-primary border-l-2 border-primary'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
```

### 2. src/app/(dashboard)/layout.tsx — dashboard shell with sidebar
```typescript
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { logoutAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'

type DashboardLayoutProps = { children: React.ReactNode }

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name, plan')
    .eq('id', user.id)
    .single()

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — hidden on mobile, visible sm+ */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card sm:flex sm:flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/" className="font-display font-black text-primary uppercase tracking-wider animate-rgb-shift">
            NEUR·O·MAIL
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex flex-1 flex-col p-3">
          <SidebarNav />
        </div>

        {/* Plan badge + Upgrade */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="font-label text-xs text-muted-foreground uppercase tracking-wider">
            PLAN // {profile?.plan?.toUpperCase() ?? 'FREE'}
          </div>
          <div className="bg-background h-1 rounded overflow-hidden">
            <div className="h-full bg-primary shadow-[0_0_6px_rgba(0,255,136,0.5)]" style={{ width: '30%' }}></div>
          </div>
          <div className="font-mono text-xs text-muted-foreground">3 / 10 emails</div>
          <Button asChild variant="outline" size="sm" className="w-full chamfered">
            <Link href="/pricing">Upgrade →</Link>
          </Button>
        </div>

        {/* User info + Logout */}
        <div className="border-t border-border p-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary flex items-center justify-center font-display text-xs text-primary shadow-[0_0_6px_rgba(0,255,136,0.2)]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-xs text-foreground">
                {profile?.full_name ?? profile?.email ?? 'User'}
              </p>
            </div>
          </div>
          <form action={logoutAction} className="w-full">
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-2 font-mono text-xs text-muted-foreground hover:text-destructive">
              logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b border-border px-4 sm:hidden">
          <Link href="/" className="font-display font-black text-primary uppercase tracking-wider animate-rgb-shift">
            NEUR·O·MAIL
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="font-label text-xs text-muted-foreground uppercase tracking-wider">
              STATUS: <span className="text-primary">■ ONLINE</span>
            </span>
            <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary flex items-center justify-center font-display text-xs text-primary">
              {initials}
            </div>
          </div>
        </header>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-background sm:hidden">
          <SidebarNavMobile />
        </nav>

        <main className="flex-1 overflow-auto pb-16 sm:pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### 2.5. src/components/dashboard/sidebar-nav-mobile.tsx — mobile bottom bar
```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Zap, History, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Generator', icon: Zap },
  { href: '/history', label: 'History', icon: History },
  { href: '/profile', label: 'Profile', icon: User }
] as const

export const SidebarNavMobile = () => {
  const pathname = usePathname()

  return (
    <div className="flex w-full items-center justify-around py-2">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1 font-label text-xs transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        )
      })}
    </div>
  )
}
```

### 3. src/app/(dashboard)/loading.tsx — loading skeleton for route transitions
```typescript
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
```

## Tests — Step 5.1
### Manual Verification
- [ ] sm+ screen (768px+): sidebar visible with all 3 nav items
- [ ] Mobile (375px): sidebar hidden, bottom nav shows
- [ ] Active link highlighted in primary colour
- [ ] User name + plan shown in sidebar bottom
- [ ] Unauthenticated /dashboard → /login (middleware handles this, layout confirms)
```

---

## Step 5.2 — Email Generator Form + AI Result Display

### Context7
```
Context7 → "react-hook-form" → re-use from Phase 4
Context7 → "framer-motion"  → AnimatePresence for result block
Context7 → "shadcn-ui"     → Select, RadioGroup, Textarea
Context7 → "zustand"        → create store, selector pattern
```

### Prompt
```
You are a Next.js 15 + Zustand developer. Create the email generator form with AI result display.

## Context (GitNexus: ai-email-generator/main)
- src/lib/validations/email-generator.ts (GenerateEmailSchema, EMAIL_TONE_LABELS, EMAIL_LENGTH_LABELS, EMAIL_TONE_OPTIONS, EMAIL_LENGTH_OPTIONS)
- src/actions/email.ts (generateEmailAction)
- src/types/index.ts (GeneratedEmail, ActionResult)
- RULES.md → Section 10 (Zustand — UI state only, no classes), Section 3, 4
- SPEC.md → FR-03 (generator acceptance criteria)

## Context7 (MANDATORY — fetch before writing Zustand and RHF code)
- Context7 → "zustand" → create, typed store, selector pattern
- Context7 → "react-hook-form" → handleSubmit, useForm, zodResolver, formState
- Context7 → "framer-motion" → AnimatePresence

## Task

### 1. src/store/email-generator.ts — Zustand UI state
```typescript
import { create } from 'zustand'
import type { GeneratedEmail } from '@/types'

type GeneratorState = {
  lastResult: GeneratedEmail | null
  isGenerating: boolean
  error: string | null
}

type GeneratorActions = {
  setResult: (email: GeneratedEmail) => void
  setGenerating: (value: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const INITIAL_STATE: GeneratorState = {
  lastResult: null,
  isGenerating: false,
  error: null
}

export const useEmailGeneratorStore = create<GeneratorState & GeneratorActions>((set) => ({
  ...INITIAL_STATE,
  setResult: (email) => set({ lastResult: email, error: null }),
  setGenerating: (value) => set({ isGenerating: value }),
  setError: (error) => set({ error }),
  reset: () => set(INITIAL_STATE)
}))
```

### 2. src/components/dashboard/email-result.tsx — animated email result card
```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { GeneratedEmail } from '@/types'
import { EMAIL_TONE_LABELS, EMAIL_LENGTH_LABELS } from '@/lib/validations/email-generator'
import { formatDate } from '@/lib/utils'

type EmailResultProps = {
  email: GeneratedEmail
  onDelete?: (id: string) => void
}

export const EmailResult = ({ email, onDelete }: EmailResultProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-card border border-border overflow-hidden" style={{
      clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))'
    }}>
      {/* Terminal header */}
      <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-destructive"></span>
        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_4px_#00ff88]"></span>
        <span className="ml-2 font-label text-xs text-muted-foreground tracking-wider">
          email.output
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Header with subject + badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 min-w-0 flex-1">
            <h3 className="font-mono text-sm font-bold text-foreground truncate">
              {email.subject}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="chamfered font-label text-xs">
                {EMAIL_TONE_LABELS[email.tone]}
              </Badge>
              <Badge variant="outline" className="chamfered font-label text-xs">
                {EMAIL_LENGTH_LABELS[email.length]}
              </Badge>
              <Badge variant="outline" className="chamfered font-label text-xs text-muted-foreground">
                {email.modelUsed}
              </Badge>
            </div>
          </div>
          <span className="font-mono text-xs text-muted-foreground whitespace-nowrap shrink-0">
            {formatDate(email.createdAt)}
          </span>
        </div>

        {/* Email content */}
        <div className="bg-background border border-border p-4">
          <pre className="font-mono text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {email.content}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="chamfered gap-2">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'COPIED!' : 'COPY_TO_CLIPBOARD'}
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(email.id)}
              className="chamfered gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              DELETE
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
```

### 3. src/components/dashboard/email-generator-form.tsx
```typescript
'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { generateEmailAction } from '@/actions/email'
import { GenerateEmailSchema, type GenerateEmailInput, EMAIL_TONE_OPTIONS, EMAIL_TONE_LABELS, EMAIL_LENGTH_OPTIONS, EMAIL_LENGTH_LABELS } from '@/lib/validations/email-generator'
import { useEmailGeneratorStore } from '@/store/email-generator'
import { EmailResult } from './email-result'
import { FormError } from '@/components/auth/form-error'

export const EmailGeneratorForm = () => {
  const { lastResult, isGenerating, error, setResult, setGenerating, setError } =
    useEmailGeneratorStore()
  const [isPending, startTransition] = useTransition()

  const form = useForm<GenerateEmailInput>({
    resolver: zodResolver(GenerateEmailSchema),
    defaultValues: { subject: '', tone: 'professional', length: 'medium' }
  })

  const onSubmit = (data: GenerateEmailInput) => {
    setGenerating(true)
    setError(null)
    const formData = new FormData()
    formData.set('subject', data.subject)
    formData.set('tone', data.tone)
    formData.set('length', data.length)

    startTransition(async () => {
      const result = await generateEmailAction(formData)
      setGenerating(false)
      if (result.success) {
        setResult(result.data)
        form.reset()
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormError message={error} />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                  01 // SUBJECT_LINE
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-primary font-mono text-sm pointer-events-none">
                      &gt;
                    </span>
                    <Textarea
                      placeholder="What is your email about?"
                      rows={3}
                      className="resize-none pl-8 chamfered"
                      disabled={isPending}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                    02 // TONE_MATRIX
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="chamfered">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMAIL_TONE_OPTIONS.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {EMAIL_TONE_LABELS[tone]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                    03 // OUTPUT_LENGTH
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="chamfered">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMAIL_LENGTH_OPTIONS.map((len) => (
                        <SelectItem key={len} value={len}>
                          {EMAIL_LENGTH_LABELS[len]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isPending} size="lg" className="w-full chamfered animate-pulse-glow">
            {isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> GENERATING...</>
            ) : (
              <>GENERATE_EMAIL →</>
            )}
          </Button>
        </form>
      </Form>

      <AnimatePresence mode="wait">
        {lastResult && (
          <motion.div
            key={lastResult.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <EmailResult email={lastResult} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

### 4. src/app/(dashboard)/dashboard/page.tsx
```typescript
import type { Metadata } from 'next'
import { EmailGeneratorForm } from '@/components/dashboard/email-generator-form'

export const metadata: Metadata = { title: 'Generator | NEUROMAIL' }

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-3xl">
      {/* Section label */}
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
        // EMAIL_GENERATOR
      </div>
      <div className="mb-8 space-y-2">
        <h1 className="font-display text-2xl font-black text-foreground uppercase tracking-wider">
          GENERATOR_PROTOCOL
        </h1>
        <p className="font-mono text-sm text-muted-foreground">
          Describe your email and let AI write it for you.
        </p>
      </div>
      <EmailGeneratorForm />
    </div>
  )
}
```

## Tests — Step 5.2
### Component (bun test --dom)
```typescript
// tests/unit/dashboard/email-result.test.tsx
import { describe, it, expect } from 'bun:test'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EmailResult } from '@/components/dashboard/email-result'
import type { GeneratedEmail } from '@/types'

const mockEmail: GeneratedEmail = {
  id: 'test-id',
  userId: 'user-id',
  subject: 'Project Update',
  tone: 'professional',
  length: 'medium',
  content: 'Dear John,\n\nRegarding the project update...',
  modelUsed: 'mock-v1',
  tokensUsed: 120,
  createdAt: '2024-06-26T10:00:00Z'
}

describe('EmailResult', () => {
  it('renders subject and tone badge', () => {
    render(<EmailResult email={mockEmail} />)
    expect(screen.getByText('Project Update')).toBeDefined()
    expect(screen.getByText('Professional')).toBeDefined()
  })

  it('renders email content', () => {
    render(<EmailResult email={mockEmail} />)
    expect(screen.getByText(/project update/i)).toBeDefined()
  })

  it('shows delete button when onDelete provided', () => {
    render(<EmailResult email={mockEmail} onDelete={() => {}} />)
    expect(screen.getByRole('button', { name: /delete/i })).toBeDefined()
  })

  it('calls onDelete with email id when delete clicked', () => {
    let deletedId: string | null = null
    render(<EmailResult email={mockEmail} onDelete={(id) => { deletedId = id }} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(deletedId).toBe('test-id')
  })
})
```
### Manual Verification
- [ ] /dashboard: Generator form renders with subject, tone, length fields
- [ ] Fill form + Generate → loading spinner → email result appears with animation
- [ ] Copy: clipboard content matches email text
- [ ] Token count shown below result
- [ ] Mobile: form and result readable at 375px
```

---

## Step 5.3 — History Page

### Context7
```
Context7 → "next.js"   → Server Component data fetch, Suspense, loading.tsx
Context7 → "supabase-js" → .from().select().order().limit() query
Context7 → "framer-motion" → AnimatePresence, staggerChildren for list
```

### Prompt
```
You are a Next.js 15 developer. Create the email history page with server-side data fetching.

## Context (GitNexus: ai-email-generator/main)
- src/lib/supabase/server.ts
- src/actions/email.ts (deleteEmailAction)
- src/components/dashboard/email-result.tsx
- src/types/index.ts (GeneratedEmail)
- SPEC.md → US-07 (email history)

## Context7 (MANDATORY)
- Context7 → "next.js" → Server Components, async page component pattern
- Context7 → "supabase-js" → .select().order().limit() chaining
- Context7 → "framer-motion" → staggerChildren for list items

## Task

### 1. src/app/(dashboard)/history/loading.tsx
Skeleton list of 3 EmailResult-sized cards.

### 2. src/components/dashboard/email-history-list.tsx — Client Component for delete interactions
```typescript
'use client'

import { useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EmailResult } from './email-result'
import { deleteEmailAction } from '@/actions/email'
import type { GeneratedEmail } from '@/types'
import { useRouter } from 'next/navigation'

type EmailHistoryListProps = {
  emails: GeneratedEmail[]
}

export const EmailHistoryList = ({ emails }: EmailHistoryListProps) => {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteEmailAction(id)
      if (result.success) router.refresh()
    })
  }

  if (emails.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground">No emails generated yet. Head to the Generator to create your first one.</p>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {emails.map((email, i) => (
          <motion.div
            key={email.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
          >
            <EmailResult email={email} onDelete={handleDelete} />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}
```

### 3. src/app/(dashboard)/history/page.tsx — Server Component fetches data
```typescript
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { EmailHistoryList } from '@/components/dashboard/email-history-list'
import type { GeneratedEmail } from '@/types'

export const metadata: Metadata = { title: 'History | NEUROMAIL' }

export default async function HistoryPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rows, error } = await supabase
    .from('generated_emails')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('[HistoryPage]', error.message)
  }

  const emails: GeneratedEmail[] = (rows ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    subject: row.subject,
    tone: row.tone as GeneratedEmail['tone'],
    length: row.length as GeneratedEmail['length'],
    content: row.content,
    modelUsed: row.model_used,
    tokensUsed: row.tokens_used,
    createdAt: row.created_at
  }))

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-3xl">
      {/* Section label */}
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
        // EMAIL_HISTORY
      </div>
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-black text-foreground uppercase tracking-wider">
            HISTORY_LOG
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            {emails.length} email{emails.length !== 1 ? 's' : ''} generated
          </p>
        </div>
      </div>
      <EmailHistoryList emails={emails} />
    </div>
  )
}
```

## Tests — Step 5.3
### Manual Verification
- [ ] /history: emails listed newest first
- [ ] Delete: email removed, list refreshes
- [ ] Empty state: friendly message with link to dashboard
- [ ] Loading state: skeletons shown during data fetch
- [ ] Stagger animation plays on initial render
```

---

## Step 5.4 — Profile Page

### Context7
```
Context7 → "react-hook-form" → useForm for profile update
Context7 → "shadcn-ui"      → Avatar, AvatarFallback, Badge, Separator, Card
```

### Prompt
```
You are a Next.js 15 developer. Create the profile page with account info + update form.

## Context (GitNexus: ai-email-generator/main)
- src/actions/profile.ts (updateProfileAction)
- src/lib/validations/profile.ts (UpdateProfileSchema)
- src/lib/supabase/server.ts
- src/types/index.ts (Profile)
- SPEC.md → FR-06 (profile), US-09

## Context7
- Context7 → "react-hook-form" → useForm with default values populated from server data
- Context7 → "shadcn-ui" → Avatar, Badge, Separator

## Task

### 1. src/components/dashboard/profile-form.tsx — Client Component
```typescript
'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateProfileAction } from '@/actions/profile'
import { UpdateProfileSchema, type UpdateProfileInput } from '@/lib/validations/profile'
import { FormError } from '@/components/auth/form-error'
import { Check } from 'lucide-react'
import type { Profile } from '@/types'

type ProfileFormProps = { profile: Profile }

export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: { fullName: profile.fullName ?? '' }
  })

  const onSubmit = (data: UpdateProfileInput) => {
    setError(null)
    setSuccess(false)
    const formData = new FormData()
    if (data.fullName) formData.set('fullName', data.fullName)

    startTransition(async () => {
      const result = await updateProfileAction(formData)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormError message={error} />
        {success && (
          <div className="flex items-center gap-2 font-mono text-xs text-primary">
            <Check className="h-3.5 w-3.5" /> IDENTITY_UPDATED
          </div>
        )}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                DISPLAY NAME
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
                    &gt;
                  </span>
                  <Input placeholder="Enter display name" disabled={isPending} className="pl-8 chamfered" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="chamfered">
          {isPending ? 'UPDATING...' : 'UPDATE_IDENTITY →'}
        </Button>
      </form>
    </Form>
  )
}
```

### 2. src/app/(dashboard)/profile/page.tsx — Server Component
```typescript
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { ProfileForm } from '@/components/dashboard/profile-form'
import type { Profile } from '@/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Profile | NEUROMAIL' }

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: row } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!row) redirect('/login')

  const profile: Profile = {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    plan: row.plan as Profile['plan'],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }

  const initials = profile.fullName
    ? profile.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile.email[0]?.toUpperCase() ?? '?'

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-3xl">
      {/* Section label */}
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
        // USER_PROFILE
      </div>
      <h1 className="font-display text-2xl font-black text-foreground uppercase tracking-wider mb-8">
        PROFILE_SETTINGS
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identity card */}
        <div className="bg-card border border-border overflow-hidden" style={{
          clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))'
        }}>
          <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive"></span>
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_4px_#00ff88]"></span>
            <span className="ml-2 font-label text-xs text-muted-foreground tracking-wider">
              identity.cfg
            </span>
          </div>
          <div className="p-6 space-y-5">
            {/* Avatar + email */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center font-display text-2xl font-black text-primary shadow-[0_0_14px_rgba(0,255,136,0.2)]">
                {initials}
              </div>
              <div>
                <div className="font-display text-base font-bold text-foreground tracking-wider">
                  {profile.email}
                </div>
                <div className="font-label text-xs text-muted-foreground tracking-wider mt-1">
                  UID: NM-{profile.id.slice(0, 5).toUpperCase()} · {profile.plan.toUpperCase()} PLAN
                </div>
              </div>
            </div>

            {/* Form */}
            <ProfileForm profile={profile} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Subscription card */}
          <div className="bg-card border border-border overflow-hidden" style={{
            clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))'
          }}>
            <div className="bg-muted border-b border-border px-4 py-2 font-label text-xs text-muted-foreground tracking-wider">
              subscription.status
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-base font-black text-foreground tracking-wider">
                    {profile.plan.toUpperCase()} PLAN
                  </div>
                  <div className="font-mono text-xs text-muted-foreground mt-1">
                    Active since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <Badge variant={profile.plan === 'pro' ? 'default' : 'secondary'} className="chamfered font-label text-xs">
                  {profile.plan.toUpperCase()}
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="bg-background h-1 rounded overflow-hidden">
                <div className="h-full bg-primary shadow-[0_0_6px_rgba(0,255,136,0.5)]" style={{ width: '30%' }}></div>
              </div>
              <div className="font-mono text-xs text-muted-foreground">3 / 10 emails</div>

              <Button asChild variant="outline" size="sm" className="w-full chamfered">
                <Link href="/pricing">UPGRADE_PLAN →</Link>
              </Button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-card border border-border overflow-hidden" style={{
            clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))'
          }}>
            <div className="bg-muted border-b border-border px-4 py-2 font-label text-xs text-muted-foreground tracking-wider">
              danger.zone
            </div>
            <div className="p-6">
              <Button variant="outline" size="sm" className="chamfered text-destructive border-destructive/40 hover:bg-destructive/10">
                DELETE_ACCOUNT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Tests — Step 5.4
### Manual Verification
- [ ] /profile: section label "// USER_PROFILE", heading "PROFILE_SETTINGS"
- [ ] Identity card with terminal header "identity.cfg"
- [ ] Avatar with neon border and initials
- [ ] Email and UID displayed
- [ ] Update name → success message "IDENTITY_UPDATED" → page reload shows new name
- [ ] Supabase: profiles.full_name updated
- [ ] Subscription card with terminal header "subscription.status"
- [ ] Progress bar with neon glow
- [ ] Danger zone with terminal header "danger.zone"
- [ ] Mobile: cards stack cleanly at 375px
```

---

## Phase 5 Regression Test

```bash
bun run typecheck     # 0 errors
bun test --dom        # email-result tests, profile-form tests green
bun run test:e2e      # dashboard/generator/history/profile flows
bun run build         # no build errors
```

### E2E Dashboard Flow
```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await page.goto('/login')
    await page.getByLabel(/email/i).fill(process.env.TEST_USER_EMAIL!)
    await page.getByLabel(/password/i).fill(process.env.TEST_USER_PASSWORD!)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('generates an email', async ({ page }) => {
    await page.getByLabel(/about/i).fill('Following up on the quarterly report')
    await page.getByRole('button', { name: /generate email/i }).click()
    await expect(page.getByText(/quarterly report/i)).toBeVisible({ timeout: 15000 })
  })

  test('history page shows generated emails', async ({ page }) => {
    await page.goto('/history')
    await expect(page.getByRole('heading', { name: /history/i })).toBeVisible()
  })

  test('profile page shows user email', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.getByText(process.env.TEST_USER_EMAIL!)).toBeVisible()
  })
})
```

**Write report:** `docs/reports/phase-5-report.md`
