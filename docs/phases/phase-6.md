# Phase 6 — Pricing Page · i18n · Final Polish · Vercel Deploy

> **Goal:** Pricing page with 3 tiers, next-intl EN+RU localization, final polish pass, Vercel production deploy.  
> **Estimated time:** ~3 hours  
> **Prerequisite:** Phases 0–5 complete  
> **Regression:** `bun run typecheck && bun run lint && bun test && bun run test:e2e && bun run build`

---

## Context Sources

### GitNexus (ai-email-generator / main)
```
/SPEC.md          → FR-05 (pricing tiers: Free $0, Pro $19, Enterprise $99), FR-09 (i18n EN+RU)
/RULES.md         → Section 12 (Deployment + Vercel), Section 4 (Tailwind)
/AGENT.md         → "Localisation", "Deployment"
/ARCHITECTURE.md  → Section 3.12 (next-intl), Section 3.15 (deployment)
```

### Context7 (fetch before each step)
```
next-intl      → App Router setup, routing, useTranslations, getTranslations, middleware.ts integration
next.js        → Metadata API in i18n context
shadcn-ui      → Card, Badge, Button, CheckIcon
```

---

## UI Reference

**Source:** `ui/Pricing.dc.html`

**Page Structure:**
1. Nav (same as Landing)
2. Hero (centered, billing toggle)
3. Pricing cards (3-column grid: Starter/Professional/Enterprise)
4. Comparison table (feature matrix)
5. FAQ (link to Landing FAQ)
6. CTA
7. Footer

**Key Components:**
- Billing toggle: "Monthly" / "Annual" with "SAVE 20%" badge
- Pricing cards: chamfered corners, terminal-style headers
- Professional card: "RECOMMENDED" badge, neon green border, pulse-glow
- Feature list: "→" prefix for included, "✕" for excluded
- Comparison table: cyberpunk styling with neon accents

**Design System:** See `DESIGN_SYSTEM.md` for complete cyberpunk specification.

---

## Step 6.1 — Pricing Page (Full)

### Context7
```
Context7 → "shadcn-ui" → Card, Badge, Button, Check icon via lucide-react
Context7 → "next.js"   → Metadata API
```

### Prompt
```
You are a Next.js 15 + Tailwind CSS developer. Create the full Pricing page.

## Context (GitNexus: ai-email-generator/main)
- SPEC.md → FR-05 (pricing tiers, features table)
- src/app/globals.css (@theme tokens)
- RULES.md → Section 4 (mobile-first, Tailwind)

## Context7 (MANDATORY)
- Context7 → "shadcn-ui" → Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button

## Task

### 1. Define pricing data — src/lib/pricing.ts

```typescript
import type { UserPlan } from '@/types'

export type PricingFeature = {
  text: string
  included: boolean
}

export type PricingTier = {
  plan: UserPlan
  name: string
  price: number
  period: 'month' | 'year' | 'free'
  description: string
  features: PricingFeature[]
  cta: string
  recommended: boolean
}

export const PRICING_TIERS: PricingTier[] = [
  {
    plan: 'free',
    name: 'STARTER',
    price: 0,
    period: 'free',
    description: 'Free forever · no card',
    recommended: false,
    cta: 'START FREE',
    features: [
      { text: '10 emails per month', included: true },
      { text: '3 tone modes', included: true },
      { text: '7-day history', included: true },
      { text: 'Email support', included: true },
      { text: 'API access', included: false },
      { text: 'Custom tones', included: false },
      { text: 'Priority support', included: false }
    ]
  },
  {
    plan: 'pro',
    name: 'PROFESSIONAL',
    price: 19,
    period: 'month',
    description: 'Billed monthly',
    recommended: true,
    cta: 'GET STARTED',
    features: [
      { text: 'Unlimited emails', included: true },
      { text: 'All 5 tone modes', included: true },
      { text: 'Unlimited history', included: true },
      { text: 'Priority support', included: true },
      { text: 'Export to .txt / .eml', included: true },
      { text: 'Claude Haiku model', included: true },
      { text: 'API access', included: false }
    ]
  },
  {
    plan: 'enterprise',
    name: 'ENTERPRISE',
    price: 99,
    period: 'month',
    description: 'Billed monthly',
    recommended: false,
    cta: 'CONTACT SALES',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'REST API access', included: true },
      { text: 'Custom tone training', included: true },
      { text: 'Up to 10 team seats', included: true },
      { text: '99.9% SLA guarantee', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Priority support', included: true }
    ]
  }
]
```

### 2. src/components/pricing/pricing-card.tsx
```typescript
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { PricingTier } from '@/lib/pricing'

type PricingCardProps = {
  tier: PricingTier
}

export const PricingCard = ({ tier }: PricingCardProps) => (
  <div
    className={cn(
      'relative flex flex-col bg-card border overflow-hidden',
      tier.recommended
        ? 'border-2 border-primary shadow-[0_0_30px_rgba(0,255,136,0.08)]'
        : 'border-border hover:border-muted-foreground/50 transition-colors'
    )}
    style={{
      clipPath: 'polygon(0 14px, 14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px))'
    }}
  >
    {tier.recommended && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-background font-label text-xs tracking-wider px-4 py-1">
        RECOMMENDED
      </div>
    )}

    <div className={cn('p-7 flex flex-col gap-0', tier.recommended && 'pt-10')}>
      {/* Tier name */}
      <div className={cn(
        'font-label text-xs tracking-wider uppercase mb-4',
        tier.recommended ? 'text-primary' : 'text-muted-foreground'
      )}>
        {tier.name}
      </div>

      {/* Price */}
      <div className="flex items-end gap-1 mb-2">
        {tier.price === 0 ? (
          <span className="font-display text-4xl font-black text-foreground">$0</span>
        ) : (
          <>
            <span className={cn(
              'font-display text-4xl font-black',
              tier.recommended ? 'text-primary' : 'text-foreground'
            )}>
              ${tier.price}
            </span>
            <span className="font-mono text-sm text-muted-foreground mb-1">/mo</span>
          </>
        )}
      </div>

      {/* Description */}
      <div className="font-mono text-xs text-muted-foreground mb-6">
        {tier.description}
      </div>

      {/* Divider */}
      <div className="h-px bg-border mb-6"></div>

      {/* Features */}
      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {tier.features.map((feature) => (
          <li key={feature.text} className="flex items-start gap-2.5 font-mono text-xs">
            <span className={cn(
              'shrink-0 mt-0.5',
              feature.included
                ? tier.recommended ? 'text-primary' : 'text-muted-foreground'
                : 'text-muted-foreground/40'
            )}>
              {feature.included ? '→' : '✕'}
            </span>
            <span className={cn(
              feature.included ? 'text-foreground' : 'text-muted-foreground/40'
            )}>
              {feature.included && <strong className="font-bold">{feature.text.split(' ')[0]}</strong>}
              {feature.included ? ` ${feature.text.split(' ').slice(1).join(' ')}` : feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        asChild
        variant={tier.recommended ? 'default' : 'outline'}
        className={cn(
          'w-full chamfered',
          tier.recommended && 'animate-pulse-glow'
        )}
      >
        <Link href={tier.plan === 'enterprise' ? 'mailto:sales@neuromail.dev' : '/register'}>
          {tier.cta}
        </Link>
      </Button>
    </div>
  </div>
)
```

### 3. src/app/(marketing)/pricing/page.tsx
```typescript
import type { Metadata } from 'next'
import { PricingCard } from '@/components/pricing/pricing-card'
import { PRICING_TIERS } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Pricing — NEUROMAIL',
  description: 'Simple, transparent pricing. Start free, upgrade when ready.'
}

export default function PricingPage() {
  return (
    <div className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section label */}
        <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3 text-center">
          // 04_ACCESS_PASSES
        </div>

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16 space-y-4">
          <h1 className="font-display text-4xl font-black tracking-tight text-foreground uppercase sm:text-5xl">
            ACCESS_LEVELS
          </h1>
          <p className="font-mono text-base text-muted-foreground">
            Start for free. Upgrade when you're ready. No hidden fees.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className="font-mono text-sm text-foreground">Monthly</span>
            <button className="relative w-14 h-7 bg-muted rounded-full transition-colors">
              <span className="absolute left-1 top-1 w-5 h-5 bg-primary rounded-full transition-transform"></span>
            </button>
            <span className="font-mono text-sm text-muted-foreground">
              Annual
              <Badge variant="outline" className="ml-2 chamfered font-label text-xs">
                SAVE 20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards — 1 col mobile → 3 col lg+ */}
        <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.plan} tier={tier} />
          ))}
        </div>

        {/* FAQ nudge */}
        <div className="mt-16 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            Have questions?{' '}
            <a href="/#faq" className="text-primary hover:underline">
              Check our FAQ →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
```

## Tests — Step 6.1
### Manual Verification
- [ ] /pricing: section label "// 04_ACCESS_PASSES" visible
- [ ] Heading "ACCESS_LEVELS" in Orbitron font
- [ ] 3 cards render in grid (Starter/Professional/Enterprise)
- [ ] Professional card: 2px neon green border, "RECOMMENDED" badge, pulse-glow animation
- [ ] Starter card: correct features with "→" prefix
- [ ] Enterprise card: correct features with "→" prefix
- [ ] All CTA buttons work: Starter/Professional → /register, Enterprise → mailto:
- [ ] Billing toggle renders (Monthly/Annual with "SAVE 20%" badge)
- [ ] Mobile (375px): cards stack 1 column
- [ ] Tablet (768px): cards in 1-2 column layout
- [ ] Desktop (1440px): 3-column grid
- [ ] All cards have chamfered corners
- [ ] Feature list uses "→" for included, "✕" for excluded
```

---

## Step 6.2 — next-intl i18n Setup (EN + RU)

### Context7
```
Context7 → "next-intl" → App Router setup (FULL guide), middleware integration, useTranslations, getTranslations, next.config.ts plugin
```

### Prompt
```
You are a next-intl specialist. Set up EN + RU localization in the Next.js 15 App Router project.

## Context (GitNexus: ai-email-generator/main)
- ARCHITECTURE.md → Section 3.12 (next-intl)
- SPEC.md → FR-09 (EN as default, RU optional)
- AGENT.md → "Localisation" section

## Context7 (MANDATORY — fetch ALL of next-intl docs before starting)
- Context7 → "next-intl" → App Router setup, middleware, routing, useTranslations, getTranslations (Server Components)

## Task

### 1. Create messages/en.json
```json
{
  "common": {
    "loading": "LOADING...",
    "error": "ERR: SYSTEM_ERROR",
    "retry": "RETRY →",
    "save": "SAVE",
    "cancel": "CANCEL"
  },
  "nav": {
    "home": "Home",
    "pricing": "//pricing",
    "dashboard": "Dashboard",
    "history": "History",
    "profile": "Profile",
    "login": "login",
    "register": "get_access →",
    "logout": "logout"
  },
  "hero": {
    "eyebrow": "// SYS_INITIALIZED · AI EMAIL ENGINE v2.1.0",
    "heading": "Write Better Emails in Seconds",
    "subheading": "AI-powered email generation with precision tone control. No writer's block. No generic templates. Just high-signal messages that land every time.",
    "status_online": "STATUS: ■ ONLINE",
    "status_engine": "ENGINE: CLAUDE_HAIKU",
    "status_uptime": "UPTIME: 99.9%",
    "cta_primary": "GET_ACCESS →",
    "cta_secondary": "LIVE_DEMO ↓"
  },
  "generator": {
    "section_label": "// EMAIL_GENERATOR",
    "title": "GENERATOR_PROTOCOL",
    "description": "Describe your email and let AI write it for you.",
    "subject_label": "01 // SUBJECT_LINE",
    "subject_placeholder": "What is your email about?",
    "tone_label": "02 // TONE_MATRIX",
    "length_label": "03 // OUTPUT_LENGTH",
    "submit": "GENERATE_EMAIL →",
    "submitting": "GENERATING..."
  },
  "pricing": {
    "section_label": "// 04_ACCESS_PASSES",
    "title": "ACCESS_LEVELS",
    "subtitle": "Start for free. Upgrade when you're ready. No hidden fees.",
    "recommended_badge": "RECOMMENDED",
    "monthly": "Monthly",
    "annual": "Annual",
    "save_badge": "SAVE 20%",
    "starter": "STARTER",
    "professional": "PROFESSIONAL",
    "enterprise": "ENTERPRISE"
  },
  "auth": {
    "section_label_login": "// ACCESS_PROTOCOL",
    "section_label_register": "// NEW_USER_PROTOCOL",
    "login_title": "SYSTEM_LOGIN",
    "login_desc": "Enter your credentials to access the system",
    "register_title": "SYSTEM_REGISTER",
    "register_desc": "Create your account to start generating",
    "email_label": "01 // EMAIL_ADDRESS",
    "password_label": "02 // PASSWORD",
    "confirm_password_label": "03 // CONFIRM_PASSWORD",
    "sign_in": "INITIALIZE_ACCESS →",
    "signing_in": "AUTHENTICATING...",
    "create_account": "CREATE_ACCOUNT →",
    "creating": "INITIALIZING...",
    "no_account": "No account?",
    "have_account": "Have account?",
    "sign_up": "REGISTER →",
    "sign_in_link": "LOGIN →"
  },
  "profile": {
    "section_label": "// USER_PROFILE",
    "title": "PROFILE_SETTINGS",
    "identity_header": "identity.cfg",
    "subscription_header": "subscription.status",
    "danger_header": "danger.zone",
    "display_name_label": "DISPLAY NAME",
    "display_name_placeholder": "Enter display name",
    "save_changes": "UPDATE_IDENTITY →",
    "saving": "UPDATING...",
    "success": "IDENTITY_UPDATED",
    "plan_label": "PLAN",
    "upgrade": "UPGRADE_PLAN →",
    "delete_account": "DELETE_ACCOUNT"
  }
}
```

### 2. Create messages/ru.json
Full Russian translation of en.json:
```json
{
  "common": {
    "loading": "ЗАГРУЗКА...",
    "error": "ОШИБКА: СИСТЕМНЫЙ_СБОЙ",
    "retry": "ПОВТОРИТЬ →",
    "save": "СОХРАНИТЬ",
    "cancel": "ОТМЕНА"
  },
  "nav": {
    "home": "Главная",
    "pricing": "//цены",
    "dashboard": "Панель",
    "history": "История",
    "profile": "Профиль",
    "login": "войти",
    "register": "получить_доступ →",
    "logout": "выйти"
  },
  "hero": {
    "eyebrow": "// СИСТЕМА_ИНИЦИАЛИЗИРОВАНА · ИИ ДВИЖОК v2.1.0",
    "heading": "Пишите лучшие письма за секунды",
    "subheading": "ИИ-генерация писем с точным контролем тона. Никакого writer's block. Только высококачественные сообщения.",
    "status_online": "СТАТУС: ■ В СЕТИ",
    "status_engine": "ДВИЖОК: CLAUDE_HAIKU",
    "status_uptime": "АПТАЙМ: 99.9%",
    "cta_primary": "ПОЛУЧИТЬ_ДОСТУП →",
    "cta_secondary": "ЖИВОЕ_ДЕМО ↓"
  },
  "generator": {
    "section_label": "// ГЕНЕРАТОР_ПИСЕМ",
    "title": "ПРОТОКОЛ_ГЕНЕРАЦИИ",
    "description": "Опишите цель письма, и ИИ напишет его за вас.",
    "subject_label": "01 // ТЕМА_ПИСЬМА",
    "subject_placeholder": "О чём ваше письмо?",
    "tone_label": "02 // МАТРИЦА_ТОНОВ",
    "length_label": "03 // ДЛИНА_ВЫВОДА",
    "submit": "СГЕНЕРИРОВАТЬ_ПИСЬМО →",
    "submitting": "ГЕНЕРИРУЕМ..."
  },
  "pricing": {
    "section_label": "// 04_УРОВНИ_ДОСТУПА",
    "title": "УРОВНИ_ДОСТУПА",
    "subtitle": "Начните бесплатно. Обновитесь когда нужно больше. Без скрытых платежей.",
    "recommended_badge": "РЕКОМЕНДУЕМЫЙ",
    "monthly": "Ежемесячно",
    "annual": "Ежегодно",
    "save_badge": "ЭКОНОМИЯ 20%",
    "starter": "STARTER",
    "professional": "PROFESSIONAL",
    "enterprise": "ENTERPRISE"
  },
  "auth": {
    "section_label_login": "// ПРОТОКОЛ_ДОСТУПА",
    "section_label_register": "// ПРОТОКОЛ_НОВОГО_ПОЛЬЗОВАТЕЛЯ",
    "login_title": "СИСТЕМНЫЙ_ВХОД",
    "login_desc": "Введите учетные данные для доступа к системе",
    "register_title": "СИСТЕМНАЯ_РЕГИСТРАЦИЯ",
    "register_desc": "Создайте аккаунт чтобы начать генерацию",
    "email_label": "01 // EMAIL_АДРЕС",
    "password_label": "02 // ПАРОЛЬ",
    "confirm_password_label": "03 // ПОДТВЕРДИТЕ_ПАРОЛЬ",
    "sign_in": "ИНИЦИАЛИЗИРОВАТЬ_ДОСТУП →",
    "signing_in": "АУТЕНТИФИКАЦИЯ...",
    "create_account": "СОЗДАТЬ_АККАУНТ →",
    "creating": "ИНИЦИАЛИЗАЦИЯ...",
    "no_account": "Нет аккаунта?",
    "have_account": "Есть аккаунт?",
    "sign_up": "ЗАРЕГИСТРИРОВАТЬСЯ →",
    "sign_in_link": "ВОЙТИ →"
  },
  "profile": {
    "section_label": "// ПРОФИЛЬ_ПОЛЬЗОВАТЕЛЯ",
    "title": "НАСТРОЙКИ_ПРОФИЛЯ",
    "identity_header": "identity.cfg",
    "subscription_header": "subscription.status",
    "danger_header": "danger.zone",
    "display_name_label": "ОТОБРАЖАЕМОЕ ИМЯ",
    "display_name_placeholder": "Введите отображаемое имя",
    "save_changes": "ОБНОВИТЬ_ЛИЧНОСТЬ →",
    "saving": "ОБНОВЛЕНИЕ...",
    "success": "ЛИЧНОСТЬ_ОБНОВЛЕНА",
    "plan_label": "ПЛАН",
    "upgrade": "ОБНОВИТЬ_ПЛАН →",
    "delete_account": "УДАЛИТЬ_АККАУНТ"
  }
}
```

### 3. src/i18n/request.ts
```typescript
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  const safeLocale = ['en', 'ru'].includes(locale ?? '') ? locale! : 'en'

  return {
    locale: safeLocale,
    messages: (await import(`../../messages/${safeLocale}.json`)).default
  }
})
```

### 4. Update next.config.ts — add next-intl plugin
```typescript
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'standalone'
}

export default withNextIntl(nextConfig)
```

### 5. Update middleware.ts — integrate next-intl + Supabase session
next-intl needs to run alongside the Supabase session middleware. Fetch Context7 → "next-intl" → middleware guide for App Router (locale detection in URL or Accept-Language header).

Simplified approach: use next-intl's `createMiddleware` wrapping the Supabase logic, or handle locale detection separately (EN default, /ru/* for Russian).

### 6. Wire useTranslations into at least the Hero and Generator pages
```typescript
// Example in src/components/marketing/hero-section.tsx
import { useTranslations } from 'next-intl'

export const HeroSection = () => {
  const t = useTranslations('hero')
  // ...
  // Replace hardcoded strings: t('heading'), t('cta_primary') etc.
}
```

## Tests — Step 6.2
### Manual Verification
- [ ] /en — English strings render
- [ ] /ru — Russian strings render (Cyrillic)
- [ ] Default locale (no prefix) → English
- [ ] Language switcher (if built) toggles locale
- [ ] `bun run typecheck` — 0 errors (message type safety)
- [ ] `bun run build` — builds successfully with next-intl plugin
```

---

## Step 6.3 — Final Polish Pass

### Context7
```
Context7 → "next.js" → metadata, OpenGraph, robots, sitemap
```

### Prompt
```
You are a frontend developer. Run a final polish pass across the entire application.

## Context (GitNexus: ai-email-generator/main)
- All files in src/
- SPEC.md → NFR-01 (Performance), NFR-02 (Accessibility ≥ WCAG 2.1 AA), NFR-04 (Responsive: 375/768/1440)
- RULES.md → Section 11 (Security)

## Task

### 1. Add site metadata + SEO to root layout.tsx
Add: canonical URL, robots meta, twitter/OG images, author.

### 2. Create src/app/sitemap.ts
```typescript
import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 }
  ]
}
```

### 3. Create src/app/robots.ts
```typescript
import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard', '/history', '/profile'] }],
    sitemap: `${BASE_URL}/sitemap.xml`
  }
}
```

### 4. Accessibility audit (WCAG 2.1 AA)
Check each interactive element:
- [ ] All form inputs have `<label>` associations
- [ ] Buttons have descriptive text (not just icons)
- [ ] Error messages have `role="alert"`
- [ ] Focus states visible (`outline` not removed)
- [ ] Color contrast ≥ 4.5:1 for body text
- [ ] Skip-to-content link in root layout

### 5. Performance audit (Lighthouse ≥ 85)
- [ ] Images: use next/image for any images
- [ ] Framer Motion: dynamic import with `ssr: false` where needed
- [ ] Fonts: `display: swap` (already in Inter config)
- [ ] No unused imports

### 6. Responsive check at all 3 breakpoints
Go through every page at 375px, 768px, 1440px:
- [ ] No horizontal scroll
- [ ] No text overflow / clipping
- [ ] Touch targets ≥ 44px on mobile

### 7. Error states
- [ ] AI generation fails → error message shown to user
- [ ] Supabase unreachable → generic error with retry
- [ ] 404 page works
- [ ] Error boundary catches unexpected errors

## Tests — Step 6.3
### Manual Verification
- [ ] /sitemap.xml responds with valid XML
- [ ] /robots.txt responds with rules
- [ ] Lighthouse: Performance ≥ 85 on Landing Page
- [ ] Lighthouse: Accessibility ≥ 90 on all pages
- [ ] axe DevTools extension: 0 critical issues
```

---

## Step 6.4 — Vercel Deploy + GitHub Repo

### Context7
```
Context7 → "next.js" → Vercel deployment, environment variables
```

### Prompt
```
You are a DevOps engineer. Deploy the project to Vercel from GitHub.

## Context (GitNexus: ai-email-generator/main)
- ARCHITECTURE.md → Section 3.15 (Vercel)
- README.md → "Deployment" section
- .github/workflows/deploy.yml

## Task

### 1. Initialize git and push to GitHub
```bash
git init
git add .
git commit -m "feat: initial MVP — AI Email Generator"
git branch -M main
git remote add origin https://github.com/<your-username>/ai-email-generator.git
git push -u origin main
```

### 2. Connect to Vercel
Option A (CLI):
```bash
bunx vercel login
bunx vercel link
bunx vercel env pull .env.local  # or set env vars manually
bunx vercel --prod
```

Option B (Dashboard):
- vercel.com → New Project → Import from GitHub
- Set Root Directory: `.` (project root)
- Framework Preset: Next.js

### 3. Set Vercel Environment Variables (Production)
Add these in Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL         = <your supabase project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY    = <your supabase anon key>
SUPABASE_SERVICE_ROLE_KEY        = <your supabase service role>
AI_PROVIDER                      = claude         # or mock
ANTHROPIC_API_KEY                = <your key>
NEXT_PUBLIC_APP_URL              = https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME             = "AI Email Generator"
```

### 4. Configure Supabase Auth callback URL
Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/dashboard`

### 5. Verify deployment
- [ ] Visit production URL — Landing Page loads
- [ ] Register a new account on production
- [ ] Generate an email on production
- [ ] Check Supabase Dashboard — row created in generated_emails

## Tests — Step 6.4
### Manual Verification
- [ ] Production URL accessible publicly
- [ ] HTTPS — SSL certificate valid
- [ ] Register + login + generate email → all work on production
- [ ] /dashboard without auth → /login redirect
- [ ] Vercel Dashboard: no build errors, all env vars set
```

---

## Step 6.5 — Error Tracking (Sentry)

### Context7
```
Context7 → "sentry" → Next.js App Router setup, @sentry/nextjs
```

### Prompt
```
You are a production-focused developer. Add Sentry error tracking to the app.

## Context (GitNexus: ai-email-generator/main)
- RULES.md → Section 6 (Error Handling), Section 11 (Security)
- SPEC.md → FR-07 (Error Handling: no white screens, log errors)
- next.config.ts (existing)

## Context7 (MANDATORY)
- Context7 → "sentry" → @sentry/nextjs App Router setup guide

## Task

### 1. Install Sentry
```bash
bun add @sentry/nextjs
```

### 2. Create sentry.client.config.ts (project root)
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  environment: process.env.NODE_ENV,
})
```

### 3. Create sentry.server.config.ts (project root)
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

### 4. Create sentry.edge.config.ts (project root)
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

### 5. Update next.config.ts
```typescript
import { withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from 'next'

// ... existing config ...

const nextConfig: NextConfig = {
  // ... existing config ...
}

export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
})
```

### 6. Update src/app/global-error.tsx
```typescript
'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong!</h2>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  )
}
```

### 7. Add env vars to .env.example
```bash
# Sentry (error tracking)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
```

### 8. Update Server Actions to capture errors
```typescript
// In src/actions/email.ts, add to catch blocks:
import * as Sentry from '@sentry/nextjs'

// ... in catch block:
Sentry.captureException(error, { extra: { userId: user.id, subject } })
```

## Tests — Step 6.5

### Manual Verification

- [ ] `bun dev` → no Sentry errors in console
- [ ] Trigger error (e.g., invalid AI provider) → error appears in Sentry dashboard
- [ ] `bun run build` → build succeeds with Sentry config
- [ ] Production: errors are captured to Sentry

```

---

## Step 6.6 — AI Development Report

### Prompt
```
Write the AI Development Report documenting the entire project.

## Context (GitNexus: ai-email-generator/main)
- All phase reports in docs/reports/
- SPEC.md → Acceptance Checklist
- IMPLEMENTATION_PLAN.md

## Task

Create docs/reports/final-report.md with these sections:

1. **Project Summary** — What was built, tech stack, live URL
2. **Phase Log** — Each phase: date, time spent, what was completed
3. **AI Prompts Used** — The 20 most important prompts (from phase docs)
4. **Context7 Library Lookups** — Full table: library, topic, when used
5. **GitNexus Usage** — How it was used for context across sessions
6. **Test Results** — Final test counts, E2E results, Lighthouse scores
7. **Challenges & Solutions** — What went wrong, how it was fixed
8. **Acceptance Checklist** — Copy from SPEC.md, all items ticked
9. **Bonus Points Status** — Which bonus items were implemented
10. **Lessons Learned** — What to do differently next time

Include actual screenshots from Vercel + Supabase Dashboard.
```

---

## Phase 6 Final Regression Test

```bash
bun run typecheck     # 0 TypeScript errors
bun run lint          # 0 ESLint warnings
bun test              # all unit tests green
bun test --dom        # all component tests green
bun run test:e2e      # all E2E flows passing
bun run build         # production build succeeds
```

### Full App Acceptance Checklist
Copy from SPEC.md Acceptance Checklist and verify each item:

**Functional**
- [ ] Landing Page: all 6 sections visible and functional
- [ ] Register: creates account, creates Supabase profile row
- [ ] Login / Logout: works, sessions persist
- [ ] Dashboard: email form generates email with AI
- [ ] Email saved to Supabase on each generation
- [ ] History: shows all past emails, deletable
- [ ] Profile: name update persists
- [ ] Pricing Page: 3 tiers with features, correct CTAs
- [ ] Error handling: all errors show user-friendly messages
- [ ] Auth guard: /dashboard without session → /login

**Non-Functional**
- [ ] Responsive: 375px / 768px / 1440px — no overflow, no clipping
- [ ] Performance: Lighthouse ≥ 85 on Landing Page
- [ ] Accessibility: Lighthouse ≥ 90, 0 critical axe issues
- [ ] TypeScript: strict mode, 0 `any`, 0 errors
- [ ] No npm/npx — all bun/bunx
- [ ] Docker: image builds and runs
- [ ] CI/CD: GitHub Actions green

**Deployment**
- [ ] Deployed to Vercel
- [ ] Production URL works end-to-end
- [ ] Supabase Auth callback URL configured

**Write report:** `docs/reports/phase-6-report.md` + `docs/reports/final-report.md`
