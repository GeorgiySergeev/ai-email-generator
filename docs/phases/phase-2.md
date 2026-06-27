# Phase 2 — Supabase: Clients · SQL Migrations · RLS · Server Actions

> **Goal:** Supabase fully wired — browser + server clients, DB schema with RLS, auth + email Server Actions, middleware guard.  
> **Estimated time:** ~2 hours  
> **Prerequisite:** Phase 1 complete  
> **Regression:** `bun run typecheck && bun test` + manual auth flow

---

## Context Sources

### GitNexus (ai-email-generator / main)
```
/ARCHITECTURE.md  → Section 3.6 (Supabase justification), Section 7 (DB schema SQL)
/SPEC.md          → FR-02 (Auth flows), FR-03 (Email generator flow)
/RULES.md         → Section 6 (error handling), Section 11 (security)
/AGENT.md         → "Technology Map → Supabase", "Common Mistakes"
/src/types/index.ts       → ActionResult, AppErrorCode
/src/lib/validations/auth.ts → LoginSchema, RegisterSchema
/src/lib/validations/email-generator.ts → GenerateEmailSchema
```

### Context7 (fetch before each step)
```
supabase-ssr   → App Router SSR guide, createServerClient, createBrowserClient
supabase-js    → .from().insert().select().single(), auth.getUser()
next.js        → middleware.ts, cookies(), Server Actions, redirect(), revalidatePath()
```

---

## Step 2.1 — Supabase Clients (Browser + Server + Middleware)

### Context7
```
Context7 → "supabase-ssr" → FULL App Router setup guide (read carefully — cookies API differs in Next.js 15)
Context7 → "next.js"      → middleware.ts, NextRequest, cookies API
```

### Prompt
```
You are a Supabase + Next.js 15 specialist. Set up Supabase SSR clients and route-protection middleware.

## Context (GitNexus: ai-email-generator/main)
- ARCHITECTURE.md → Section 3.6 (Supabase), Section 5.2 (Route Groups)
- src/types/database.ts (Database type)
- RULES.md → Section 11 (Security), Section 2 (functional)
- AGENT.md → "Common Mistakes" items 5, 6, 7

## Context7 (MANDATORY — fetch before writing ANY Supabase code)
- Context7 → "supabase-ssr" → createBrowserClient, createServerClient, App Router guide
- Context7 → "next.js" → middleware.ts conventions, NextRequest/NextResponse, cookies()

## Task

### 1. src/lib/supabase/client.ts — browser client
```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

### 2. src/lib/supabase/server.ts — server client (async, reads cookies)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — ignore (read-only context)
          }
        }
      }
    }
  )
}
```

### 3. middleware.ts (project root) — session refresh + route protection
```typescript
import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export const middleware = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  // IMPORTANT: do not add logic between getUser() and the return
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protected: dashboard, profile, history
  const isDashboard = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/history')

  if (isDashboard && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Auth pages: redirect if already logged in
  const isAuth = pathname.startsWith('/login') || pathname.startsWith('/register')
  if (isAuth && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|api).*)']
}
```

## Tests — Step 2.1
### Manual Verification
- [ ] `bun run typecheck` — Supabase clients typed correctly, 0 errors
- [ ] `bun dev` starts without errors (with .env.local configured)
- [ ] Open /dashboard without being logged in → redirect to /login
- [ ] Open /login while logged in → redirect to /dashboard
```

---

## Step 2.2 — SQL Migration + RLS

### Context7
```
Context7 → "supabase-js" → RLS policies, SQL migration patterns
```

### Prompt
```
You are a Database Engineer. Write the full SQL migration for Supabase.

## Context (GitNexus: ai-email-generator/main)
- ARCHITECTURE.md → Section 7 (complete DB schema with SQL)
- SPEC.md → FR-02 (users/profiles), FR-03 (generated_emails)

## Task

### 1. Create docs/migrations/001_initial_schema.sql

Write the COMPLETE migration script:

```sql
-- ─── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── profiles ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  plan        TEXT NOT NULL DEFAULT 'free'
              CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── generated_emails ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.generated_emails (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,
  tone        TEXT NOT NULL CHECK (
                tone IN ('professional','casual','formal','friendly','persuasive')
              ),
  length      TEXT NOT NULL CHECK (length IN ('short','medium','long')),
  content     TEXT NOT NULL,
  model_used  TEXT NOT NULL DEFAULT 'mock',
  tokens_used INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_emails_user_id
  ON public.generated_emails(user_id);

CREATE INDEX IF NOT EXISTS idx_emails_created_at
  ON public.generated_emails(created_at DESC);

-- ─── updated_at trigger ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── Auto-create profile on signup ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_emails ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- generated_emails
CREATE POLICY "emails_select_own"
  ON public.generated_emails FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "emails_insert_own"
  ON public.generated_emails FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "emails_delete_own"
  ON public.generated_emails FOR DELETE
  USING (auth.uid() = user_id);
```

### 2. Execute the migration
Run the contents of docs/migrations/001_initial_schema.sql in Supabase Dashboard → SQL Editor.

### 3. Regenerate TypeScript types
```bash
bun run gen:types
```
This overwrites src/types/database.ts with the real Supabase schema.

## Tests — Step 2.2
### Manual Verification
- [ ] Supabase Dashboard → Table Editor: `profiles` and `generated_emails` tables exist
- [ ] RLS shown as enabled on both tables
- [ ] Register a test user → immediately check: `profiles` row created automatically
- [ ] `bun run gen:types` completes without error
- [ ] `bun run typecheck` — 0 errors after types regenerated
```

---

## Step 2.3 — Server Actions: Authentication

### Context7
```
Context7 → "next.js"   → Server Actions, redirect(), revalidatePath(), cookies
Context7 → "supabase-js" → signInWithPassword, signUp, signOut
```

### Prompt
```
You are a Next.js 15 + Supabase developer. Implement Server Actions for all auth flows.

## Context (GitNexus: ai-email-generator/main)
- src/lib/validations/auth.ts (LoginSchema, RegisterSchema)
- src/lib/supabase/server.ts (createServerSupabaseClient)
- src/types/index.ts (ActionResult, AppErrorCode)
- RULES.md → Section 6 (error handling rules), Section 2.2 (pure functions)
- SPEC.md → FR-02 (auth acceptance criteria)

## Context7 (MANDATORY)
- Context7 → "next.js" → Server Actions guide, redirect(), revalidatePath()
- Context7 → "supabase-js" → auth.signInWithPassword, auth.signUp, auth.signOut

## Task

Create src/actions/auth.ts:

```typescript
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { LoginSchema, RegisterSchema } from '@/lib/validations/auth'
import type { ActionResult } from '@/types'

export const loginAction = async (formData: FormData): Promise<ActionResult<void>> => {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  const parsed = LoginSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Validation failed',
      code: 'VALIDATION_ERROR'
    }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    console.error('[loginAction]', error.message)
    return {
      success: false,
      error: 'Invalid email or password',
      code: 'AUTH_INVALID'
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export const registerAction = async (formData: FormData): Promise<ActionResult<void>> => {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string
  }

  const parsed = RegisterSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Validation failed',
      code: 'VALIDATION_ERROR'
    }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    }
  })

  if (error) {
    console.error('[registerAction]', error.message)
    if (error.message.toLowerCase().includes('already registered')) {
      return { success: false, error: 'An account with this email already exists', code: 'AUTH_INVALID' }
    }
    return { success: false, error: 'Registration failed. Please try again.', code: 'SERVER_ERROR' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export const logoutAction = async (): Promise<void> => {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
```

## Tests — Step 2.3
### Manual Verification
- [ ] `bun run typecheck` — Server Actions typed, 0 errors
- [ ] Register with valid data → redirect /dashboard → profile row in Supabase
- [ ] Login with wrong password → stays on /login, shows "Invalid email or password"
- [ ] Login with valid data → redirect /dashboard
- [ ] Logout from /dashboard → redirect /
- [ ] /dashboard without session → redirect /login
```

---

## Step 2.4 — Server Actions: Email Generation + Profile

### Context7
```
Context7 → "next.js"   → revalidatePath(), Server Actions patterns
Context7 → "supabase-js" → .from().insert().select().single(), .from().update()
```

### Prompt
```
You are a Next.js + Supabase developer. Implement email generation and profile Server Actions.

## Context (GitNexus: ai-email-generator/main)
- src/lib/validations/email-generator.ts (GenerateEmailSchema)
- src/lib/validations/profile.ts (UpdateProfileSchema)
- src/lib/ai/factory.ts (getAIProvider)
- src/lib/supabase/server.ts (createServerSupabaseClient)
- src/types/index.ts (ActionResult, GeneratedEmail, Profile)
- RULES.md → Section 6 (error handling)

## Context7 (MANDATORY)
- Context7 → "supabase-js" → insert + select().single(), update(), auth.getUser()
- Context7 → "next.js" → revalidatePath after mutations

## Task

### 1. src/actions/email.ts
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAIProvider } from '@/lib/ai/factory'
import { GenerateEmailSchema } from '@/lib/validations/email-generator'
import type { ActionResult, GeneratedEmail } from '@/types'

export const generateEmailAction = async (
  formData: FormData
): Promise<ActionResult<GeneratedEmail>> => {
  // 1. Auth check
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' }

  // 2. Validate
  const rawData = {
    subject: formData.get('subject') as string,
    tone: formData.get('tone') as string,
    length: formData.get('length') as string
  }
  const parsed = GenerateEmailSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid input',
      code: 'VALIDATION_ERROR'
    }
  }

  // 3. Generate with AI
  const aiProvider = getAIProvider()
  let aiResult
  try {
    aiResult = await aiProvider.generateEmail(parsed.data)
  } catch (error) {
    console.error('[generateEmailAction] AI error:', error)
    return { success: false, error: 'AI generation failed. Please try again.', code: 'AI_UNAVAILABLE' }
  }

  // 4. Persist
  const { data: saved, error: dbError } = await supabase
    .from('generated_emails')
    .insert({
      user_id: user.id,
      subject: parsed.data.subject,
      tone: parsed.data.tone,
      length: parsed.data.length,
      content: aiResult.content,
      model_used: aiResult.modelUsed,
      tokens_used: aiResult.tokensUsed ?? null
    })
    .select()
    .single()

  if (dbError ?? !saved) {
    console.error('[generateEmailAction] DB error:', dbError)
    return { success: false, error: 'Failed to save email', code: 'SERVER_ERROR' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/history')

  return {
    success: true,
    data: {
      id: saved.id,
      userId: saved.user_id,
      subject: saved.subject,
      tone: saved.tone as GeneratedEmail['tone'],
      length: saved.length as GeneratedEmail['length'],
      content: saved.content,
      modelUsed: saved.model_used,
      tokensUsed: saved.tokens_used,
      createdAt: saved.created_at
    }
  }
}

export const deleteEmailAction = async (emailId: string): Promise<ActionResult<void>> => {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' }

  const { error } = await supabase
    .from('generated_emails')
    .delete()
    .eq('id', emailId)
    .eq('user_id', user.id) // Belt-and-suspenders on top of RLS

  if (error) return { success: false, error: 'Failed to delete email', code: 'SERVER_ERROR' }

  revalidatePath('/dashboard')
  revalidatePath('/history')
  return { success: true, data: undefined }
}
```

### 2. src/actions/profile.ts
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UpdateProfileSchema } from '@/lib/validations/profile'
import type { ActionResult, Profile } from '@/types'

export const updateProfileAction = async (
  formData: FormData
): Promise<ActionResult<Profile>> => {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' }

  const rawData = { fullName: formData.get('fullName') as string }
  const parsed = UpdateProfileSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Validation failed',
      code: 'VALIDATION_ERROR'
    }
  }

  const { data: updated, error } = await supabase
    .from('profiles')
    .update({ full_name: parsed.data.fullName ?? null })
    .eq('id', user.id)
    .select()
    .single()

  if (error ?? !updated) {
    return { success: false, error: 'Failed to update profile', code: 'SERVER_ERROR' }
  }

  revalidatePath('/profile')

  return {
    success: true,
    data: {
      id: updated.id,
      email: updated.email,
      fullName: updated.full_name,
      avatarUrl: updated.avatar_url,
      plan: updated.plan as Profile['plan'],
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    }
  }
}
```

## Tests — Step 2.4
### Manual Verification
- [ ] Fill generator form → Generate → result appears + row in Supabase
- [ ] Delete an email → row gone from Supabase
- [ ] Unauthenticated generateEmailAction call → AUTH_REQUIRED
- [ ] AI_PROVIDER=mock → fast response, no API call
- [ ] Update profile name → change persists after page reload
- [ ] `bun run typecheck` — 0 errors
```

---

## Step 2.5 — Seed Script (Dev Data)

### Context7
```
Context7 → "supabase-js" → service role client, bypass RLS
```

### Prompt
```
You are a backend developer. Create a seed script for development data.

## Context (GitNexus: ai-email-generator/main)
- ARCHITECTURE.md → Section 7 (DB schema)
- src/types/database.ts (Database type)
- .env.example (SUPABASE_SERVICE_ROLE_KEY)

## Context7
- Context7 → "supabase-js" → service role client for admin operations

## Task

### 1. Create scripts/seed.ts
```typescript
import { createClient } from '@supabase/supabase-js'
// Note: avoid @/ alias — this runs via `bun run`, outside Next.js context
import type { Database } from '../src/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!serviceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required for seeding')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, serviceRoleKey)

const seedProfiles = async () => {
  const testUsers = [
    { email: 'demo@example.com', full_name: 'Demo User', plan: 'free' as const },
    { email: 'pro@example.com', full_name: 'Pro User', plan: 'pro' as const },
  ]

  for (const user of testUsers) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single()

    if (existing) {
      console.log(`⏭️  Profile ${user.email} already exists`)
      continue
    }

    // Create auth user (requires service role)
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: 'password123',
      email_confirm: true,
      user_metadata: { full_name: user.full_name }
    })

    if (authError) {
      console.error(`❌ Failed to create ${user.email}:`, authError.message)
      continue
    }

    // Update profile (created by trigger)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: user.full_name, plan: user.plan })
      .eq('id', authUser.user.id)

    if (profileError) {
      console.error(`❌ Failed to update profile ${user.email}:`, profileError.message)
    } else {
      console.log(`✅ Created ${user.email} (${user.plan})`)
    }
  }
}

const seedEmails = async () => {
  const { data: demoUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'demo@example.com')
    .single()

  if (!demoUser) {
    console.log('⏭️  Skipping email seed (demo user not found)')
    return
  }

  const sampleEmails = [
    {
      subject: 'Quarterly report',
      tone: 'professional' as const,
      length: 'medium' as const,
      content: 'Dear Team,\n\nI am writing to share our Q2 results...',
      model_used: 'mock'
    },
    {
      subject: 'Meeting invitation',
      tone: 'casual' as const,
      length: 'short' as const,
      content: 'Hey everyone!\n\nLet\'s catch up next week...',
      model_used: 'mock'
    }
  ]

  for (const email of sampleEmails) {
    const { error } = await supabase
      .from('generated_emails')
      .insert({ user_id: demoUser.id, ...email })

    if (error) {
      console.error(`❌ Failed to insert email:`, error.message)
    } else {
      console.log(`✅ Created email: ${email.subject}`)
    }
  }
}

const main = async () => {
  console.log('🌱 Seeding database...\n')
  await seedProfiles()
  await seedEmails()
  console.log('\n✨ Seed complete!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
```

### 2. Add seed script to package.json
```json
{
  "scripts": {
    "db:seed": "bun run scripts/seed.ts"
  }
}
```

### 3. Add .env.local note
```bash
# SUPABASE_SERVICE_ROLE_KEY is required for seeding
# Get it from Supabase Dashboard → Settings → API → service_role key
```

## Tests — Step 2.5

### Manual Verification

- [ ] `bun run db:seed` → creates demo@example.com + pro@example.com
- [ ] `bun run db:seed` (second run) → skips existing users
- [ ] demo@example.com has 2 sample emails in history
- [ ] Login as demo@example.com / password123 → works

```

---

## Phase 2 Regression Test

```bash
bun run typecheck   # 0 errors
bun test            # all tests green
```

### Manual E2E Checklist
- [ ] Register → profile row created in DB
- [ ] Login → redirect /dashboard
- [ ] Generate email → saved in DB, appears on page
- [ ] Delete email from history → removed from DB
- [ ] Update profile name → persisted
- [ ] Logout → redirect /
- [ ] /dashboard without session → redirect /login

**Write report:** `docs/reports/phase-2-report.md`
