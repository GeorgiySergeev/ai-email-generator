# Phase 3 — Landing Page

> **Goal:** full public Landing Page — all 6 sections, animated, responsive, Lighthouse Performance ≥ 85.  
> **Estimated time:** ~3 hours  
> **Prerequisite:** Phase 0 (scaffold) complete  
> **Regression:** visual check on 375px / 768px / 1440px + Lighthouse audit

---

## Context Sources

### GitNexus (ai-email-generator / main)
```
/SPEC.md          → FR-01 (all 6 sections + acceptance criteria)
/RULES.md         → Section 3 (components), Section 4 (Tailwind/mobile-first), Section 12 (Semantic HTML)
/AGENT.md         → "Design System", "Top 10 Rules"
/CONTENT.md       → All user-facing text, SEO meta, Schema.org definitions
/src/app/globals.css → @theme design tokens (colours, spacing, radius, duration)
```

### Context7 (fetch before each step)
```
framer-motion  → motion, AnimatePresence, whileInView, useScroll, viewport options
shadcn-ui      → Accordion, Card, Badge, Button components
lucide         → icon components, className sizing, aria-hidden
next.js        → Metadata API, next/image, next/font, favicon, OG image, JSON-LD
```

---

## UI Reference

**Source:** `ui/Landing.dc.html`

**Page Structure:**
1. Nav (sticky, blur backdrop, cyberpunk logo)
2. Hero (2-column: copy + terminal demo, status indicators)
3. Stats (4-column grid with neon numbers)
4. Features (3-column grid, numbered cards [01]-[06])
5. Demo (2-column: controls + output terminal)
6. How-it-works (3-step process with large numbers)
7. Pricing preview (3 cards: Starter/Professional/Enterprise)
8. FAQ (accordion, 7 questions)
9. CTA (dark gradient, "READY_TO_DEPLOY?")
10. Footer

**Key Components:**
- Terminal window (red/yellow/green dots header)
- Chamfered buttons/inputs (clip-path polygon)
- RGB shift animation on logo "NEUR·O·MAIL"
- Section labels: "// 01_CAPABILITIES", "// 02_DEMO", etc.
- Neon glow effects on primary elements
- Circuit grid background (subtle)

**Design System:** See `DESIGN_SYSTEM.md` for complete cyberpunk specification (colors, typography, effects, components).

---

## Step 3.1 — Root Layout + Error Pages

### Context7
```
Context7 → "next.js" → App Router root layout, Metadata API, next/font
Context7 → "next.js" → error.tsx, not-found.tsx conventions
```

### Prompt
```
You are a Next.js 15 UI developer. Create the root layout, error pages, and marketing layout.

## Context (GitNexus: ai-email-generator/main)
- RULES.md → Section 3.1 (functional components), Section 4.1 (design tokens)
- SPEC.md → FR-07 (error handling)
- AGENT.md → "Design System"
- src/app/globals.css (@theme tokens)

## Context7 (MANDATORY)
- Context7 → "next.js" → App Router layout, Metadata API
- Context7 → "next.js" → error.tsx component contract (error + reset props)
- Context7 → "next.js" → next/font Google Fonts integration
- Context7 → "lucide" → icon components for React

## Task

### 1. src/app/layout.tsx — root layout
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'AI Email Generator — Write Better Emails Instantly',
    template: '%s | AI Email Generator'
  },
  description: 'Generate professional, casual, or formal emails in seconds using AI. Save time and communicate better.',
  openGraph: {
    title: 'AI Email Generator',
    description: 'Generate perfect emails with AI in seconds',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AI Email Generator' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Email Generator',
    description: 'Generate perfect emails with AI in seconds',
    images: ['/og-image.png']
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
      <body className={`${inter.variable} font-sans bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

**Favicon & OG Image (create in `public/`):**
- `favicon.ico` — 32×32, generate via [realfavicongenerator.net](https://realfavicongenerator.net) or inline SVG → ICO converter
- `apple-touch-icon.png` — 180×180 PNG
- `og-image.png` — 1200×630 PNG, use brand colors (`--color-primary` gradient + `<Logo />` component screenshot)
- Alternative: create `/api/og/route.tsx` using `@vercel/og` to generate OG images dynamically

See RULES.md §4.7 for Logo component specification.

### 2. src/app/error.tsx — global error boundary
```typescript
'use client'
// Client Component: error boundaries must be client-side (React requirement)

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

const GlobalError = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error('[GlobalError]', error.digest, error.message)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-muted-foreground max-w-md">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
      <Button onClick={reset} size="lg">Try again</Button>
    </div>
  )
}

export default GlobalError
```

### 3. src/app/not-found.tsx
```typescript
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
    <div className="space-y-2">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold text-foreground">Page not found</h2>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
    </div>
    <Button asChild size="lg">
      <Link href="/">Go home</Link>
    </Button>
  </div>
)

export default NotFound
```

### 4. src/components/shared/header.tsx — Server Component (reads session)
```typescript
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { logoutAction } from '@/actions/auth'

export const Header = async () => {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/" className="font-display font-black text-primary uppercase tracking-wider animate-rgb-shift">
          NEUR·O·MAIL
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/#features" className="font-mono text-xs text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            //features
          </Link>
          <Link href="/#demo" className="font-mono text-xs text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            //demo
          </Link>
          <Link href="/pricing" className="font-mono text-xs text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            //pricing
          </Link>
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm">logout</Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">login</Link>
              </Button>
              <Button asChild size="sm" className="chamfered">
                <Link href="/register">get_access →</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
```

### 5. src/components/shared/footer.tsx
Simple footer: copyright + links to Pricing, Privacy.

### 6. src/app/(marketing)/layout.tsx
```typescript
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'

type MarketingLayoutProps = { children: React.ReactNode }

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

## Tests — Step 3.1
### Manual Verification
- [ ] localhost:3000 — header renders with "Get started" and "Log in" buttons
- [ ] localhost:3000 — footer renders
- [ ] /random-url → 404 page (not a white screen)
- [ ] error.tsx: add a `throw new Error('test')` in layout temporarily → error boundary with "Try again" button
- [ ] Mobile 375px: header fits without overflow
```

---

## Step 3.2 — Hero Section

### Context7
```
Context7 → "framer-motion" → motion.div, initial/animate/transition, AnimatePresence
Context7 → "framer-motion" → variants, staggerChildren
```

### Prompt
```
You are a frontend developer. Create an animated hero section for the Landing Page.

## Context (GitNexus: ai-email-generator/main)
- src/app/globals.css (@theme: --color-primary, --duration-slow, --ease-default)
- RULES.md → Section 4.2 (Tailwind rules: no arbitrary values, mobile-first)
- RULES.md → Section 4.3 (no inline styles)
- SPEC.md → FR-01 (hero must have: headline, subheadline, CTA, visual accent)

## Context7 (MANDATORY — fetch before writing animations)
- Context7 → "framer-motion" → motion components, variants, staggerChildren

## Task

Create src/components/marketing/hero-section.tsx:

```typescript
'use client'
// Client Component: uses Framer Motion

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
}

export const HeroSection = () => (
  <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
    {/* Circuit grid background */}
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <div 
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
    </div>

    <div className="container mx-auto">
      {/* Eyebrow */}
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-6">
        // SYS_INITIALIZED · AI EMAIL ENGINE v2.1.0
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Copy */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.h1
            variants={item}
            className="font-display text-4xl font-black tracking-tight text-foreground uppercase sm:text-5xl lg:text-6xl"
          >
            Write Better Emails{' '}
            <span className="text-primary">in Seconds</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="font-mono text-base text-muted-foreground leading-relaxed max-w-xl"
          >
            AI-powered email generation with precision tone control. No writer's block. No generic templates. Just high-signal messages that land every time.
          </motion.p>

          {/* Status indicators */}
          <motion.div variants={item} className="flex flex-wrap gap-6 font-label text-xs text-muted-foreground uppercase tracking-wider">
            <span>STATUS: <span className="text-primary">■ ONLINE</span></span>
            <span>ENGINE: <span className="text-tertiary">CLAUDE_HAIKU</span></span>
            <span>UPTIME: <span className="text-primary">99.9%</span></span>
          </motion.div>

          <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="chamfered animate-pulse-glow">
              <Link href="/register">GET_ACCESS →</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="chamfered">
              <a href="#demo">LIVE_DEMO ↓</a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right: Terminal demo */}
        <motion.div
          variants={item}
          className="hidden lg:block"
        >
          <div className="bg-card border border-border overflow-hidden">
            <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_4px_#00ff88]"></span>
              <span className="ml-2 font-label text-xs text-muted-foreground tracking-wider">
                neuromail://session/demo.01
              </span>
            </div>
            <div className="p-5 font-mono text-sm leading-relaxed">
              <div className="text-muted-foreground mb-2">
                <span className="text-primary">$</span> neuromail generate --tone=professional --length=medium
              </div>
              <div className="text-muted-foreground text-xs">
                <span className="text-muted-foreground">→</span> Initializing engine...<span className="text-primary"> ✓</span>
              </div>
              <div className="text-muted-foreground text-xs">
                <span className="text-muted-foreground">→</span> Applying tone matrix...<span className="text-primary"> ✓</span>
              </div>
              <div className="text-muted-foreground text-xs mb-3">
                <span className="text-muted-foreground">→</span> Generating output...<span className="text-tertiary"> DONE (1.3s)</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="text-xs text-muted-foreground tracking-wider mb-2">
                  OUTPUT ─────────────────
                </div>
                <div className="text-foreground text-xs leading-relaxed">
                  Dear Sarah,<br />
                  <br />
                  I wanted to share the Q3 performance update. Revenue exceeded targets by 12%, with strong momentum in enterprise. I'd welcome 15 minutes to walk through the highlights.<br />
                  <br />
                  Best regards,<br />
                  Alex
                </div>
              </div>
              <div className="mt-3 text-sm">
                <span className="text-primary">$</span>
                <span className="animate-blink text-primary">█</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)
```

## Tests — Step 3.2
### Manual Verification
- [ ] Desktop (1440px): hero content centred, gradient blob visible
- [ ] Mobile (375px): text stacks cleanly, buttons full-width
- [ ] Animations play on page load (opacity 0→1, slide up)
- [ ] "Start for free" → /register
- [ ] "See it in action" → smooth scroll to #demo
- [ ] No horizontal scroll at any breakpoint
```

---

## Step 3.3 — Features Section

### Context7
```
Context7 → "framer-motion" → whileInView, viewport once:true
```

### Prompt
```
You are a frontend developer. Create the Features section with scroll-reveal animations.

## Context (GitNexus: ai-email-generator/main)
- src/app/globals.css (@theme design tokens)
- RULES.md → Section 4 (Tailwind, mobile-first grid)
- SPEC.md → FR-01 (features section: min 3 cards)

## Context7 (fetch before writing)
- Context7 → "framer-motion" → whileInView, viewport prop, AnimatePresence

## Task

Create src/components/marketing/features-section.tsx:

6 feature cards in a responsive grid with cyberpunk styling. Each card has:
- Number label: "[01]", "[02]", etc.
- Title (uppercase, cyberpunk style)
- Description
- whileInView animation (slide up + fade in, with index-based delay)

Features to include:
1. "[01] Instant Generation" — "Sub-2 second drafts via Claude Haiku. From subject line to signature in the time it takes to think."
2. "[02] Tone Matrix" — "5 precision modes — Professional, Casual, Formal, Friendly, Persuasive. The right register for every audience."
3. "[03] Context Engine" — "Not a template filler. The AI reads intent from your subject and constructs coherent, on-point output every time."
4. "[04] History Log" — "Every email saved automatically. Scroll back, copy, or re-generate with new parameters on any past item."
5. "[05] One-Click Copy" — "Copy-ready output in a single click. Paste directly into Gmail, Outlook, or any client. Zero formatting loss."
6. "[06] API Ready" — "Enterprise plan includes REST API. Integrate AI email generation directly into your own workflows and products."

Section structure:
```tsx
<section id="features" aria-labelledby="features-heading">
  <div className="container mx-auto">
    <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
      // 01_CAPABILITIES
    </div>
    <h2 id="features-heading" className="font-display text-2xl font-black text-foreground uppercase tracking-wider mb-12">
      SYS_CAPABILITIES
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
      {/* 6 cards with bg-card */}
    </div>
  </div>
</section>
```

Grid layout: 1 col (default) → 2 col (md:) → 3 col (lg:)

Server Component (no 'use client' — use Framer Motion with the 'm' import or mark as client).

## RULES
- Mobile-first Tailwind
- cn() for any conditional classes
- No inline styles
- All animations via Framer Motion
- Use cyberpunk design tokens from DESIGN_SYSTEM.md

## Tests — Step 3.3
### Manual Verification
- [ ] 6 cards render in a 3-column grid on desktop
- [ ] Cards stack to 1 column on mobile (375px)
- [ ] Scroll-reveal animations trigger as each card enters viewport
- [ ] Section label "// 01_CAPABILITIES" visible
- [ ] Heading "SYS_CAPABILITIES" in Orbitron font
```

---

## Step 3.4 — Demo Section (no auth)

### Context7
```
Context7 → "framer-motion" → AnimatePresence, layout animations
```

### Prompt
```
You are a frontend developer. Create an interactive Demo section that works without authentication.

## Context (GitNexus: ai-email-generator/main)
- src/lib/ai/providers/mock.ts (mockAIProvider — call directly, no Server Action)
- src/lib/validations/email-generator.ts (EMAIL_TONE_LABELS, GenerateEmailSchema)
- RULES.md → Section 3.3 (Server vs Client), Section 4

## Context7
- Context7 → "framer-motion" → AnimatePresence for result appearance

## Task

Create src/components/marketing/demo-section.tsx:

```typescript
'use client'
// Client Component: interactive demo without authentication

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { mockAIProvider } from '@/lib/ai/providers/mock'
import { EMAIL_TONE_LABELS, EMAIL_TONE_OPTIONS } from '@/lib/validations/email-generator'
import { Copy, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const DemoSection = () => {
  const [subject, setSubject] = useState('')
  const [tone, setTone] = useState<typeof EMAIL_TONE_OPTIONS[number]>('professional')
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleGenerate = () => {
    if (!subject.trim() || isPending) return
    startTransition(async () => {
      const res = await mockAIProvider.generateEmail({ subject, tone, length: 'short' })
      setResult(res.content)
    })
  }

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="demo" className="py-20 sm:py-28 bg-card border-y border-border">
      <div className="container mx-auto">
        {/* Section label */}
        <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
          // 02_DEMO
        </div>
        <h2 className="font-display text-2xl font-black text-foreground uppercase tracking-wider mb-3">
          LIVE_DEMO
        </h2>
        <p className="font-mono text-sm text-muted-foreground mb-12">
          No registration required. Try the generator now.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-start">
          {/* Left: Controls */}
          <div className="space-y-6">
            {/* Subject */}
            <div>
              <label className="font-label text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                01 // SUBJECT LINE
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
                  &gt;
                </span>
                <Textarea
                  placeholder="What is your email about?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  rows={1}
                  className="pl-8 resize-none chamfered"
                />
              </div>
            </div>

            {/* Tone */}
            <div>
              <label className="font-label text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                02 // TONE MATRIX
              </label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger className="chamfered">
                  <SelectValue placeholder="Tone" />
                </SelectTrigger>
                <SelectContent>
                  {EMAIL_TONE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{EMAIL_TONE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Length */}
            <div>
              <label className="font-label text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                03 // OUTPUT LENGTH
              </label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="chamfered flex-1">SHORT</Button>
                <Button variant="outline" size="sm" className="chamfered flex-1">MEDIUM</Button>
                <Button variant="outline" size="sm" className="chamfered flex-1">LONG</Button>
              </div>
            </div>

            {/* Generate button */}
            <Button
              onClick={handleGenerate}
              disabled={!subject.trim() || isPending}
              className="chamfered w-full animate-pulse-glow"
            >
              {isPending ? 'GENERATING...' : 'GENERATE_EMAIL →'}
            </Button>
          </div>

          {/* Right: Output terminal */}
          <div className="bg-background border border-border overflow-hidden">
            <div className="bg-muted border-b border-border px-4 py-2 flex items-center justify-between">
              <span className="font-label text-xs text-muted-foreground tracking-wider">
                OUTPUT_STREAM
              </span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
              </div>
            </div>
            <div className="p-5 min-h-[300px] flex flex-col">
              <AnimatePresence mode="wait">
                {!result && !isPending && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center gap-3 opacity-30"
                  >
                    <div className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                      AWAITING INPUT
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      Enter a subject and hit generate
                    </div>
                  </motion.div>
                )}

                {isPending && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-sm leading-loose"
                  >
                    <div className="text-primary">→ analyzing subject...</div>
                    <div className="text-tertiary">→ applying tone matrix...</div>
                    <div className="text-muted-foreground">
                      → generating output<span className="animate-blink text-primary">_</span>
                    </div>
                  </motion.div>
                )}

                {result && !isPending && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex-1 flex flex-col"
                  >
                    <pre className="font-mono text-sm text-foreground whitespace-pre-wrap leading-relaxed flex-1">
                      {result}
                    </pre>
                    <div className="border-t border-border pt-3 mt-3 flex justify-end">
                      <Button variant="outline" size="sm" onClick={handleCopy} className="chamfered">
                        {copied ? 'COPIED!' : 'COPY_TO_CLIPBOARD'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

## Tests — Step 3.4
### Manual Verification
- [ ] Demo section renders with 2-column layout on desktop
- [ ] Section label "// 02_DEMO" visible
- [ ] Heading "LIVE_DEMO" in Orbitron font
- [ ] Form labels use cyberpunk style ("01 // SUBJECT LINE", etc.)
- [ ] Input has ">" prefix
- [ ] Generate button has chamfered corners and pulse-glow animation
- [ ] Output terminal has red/yellow/green dots header
- [ ] Empty state shows "AWAITING INPUT"
- [ ] Loading state shows "→ analyzing subject...", "→ applying tone matrix..."
- [ ] Result displays in terminal-style pre block
- [ ] Copy button works and shows "COPIED!"
- [ ] Mobile (375px): stacks to 1 column, full-width buttons
- [ ] Enter subject → click Generate → loading spinner → email appears
- [ ] Copy button: clipboard contains the email text
- [ ] After copy: button shows "Copied!" for 2 seconds
- [ ] "Get full access" → /register
- [ ] Works without being logged in
- [ ] Mobile: form and result readable at 375px
```

---

## Step 3.5 — FAQ + Pricing Preview + CTA + Assemble Page

### Context7
```
Context7 → "shadcn-ui" → Accordion component (type, collapsible, props)
Context7 → "shadcn-ui" → Card, Badge components
```

### Prompt
```
You are a frontend developer. Create FAQ, Pricing Preview, CTA sections, then assemble the full Landing Page.

## Context (GitNexus: ai-email-generator/main)
- SPEC.md → FR-01 (section list), FR-05 (pricing: Free $0, Pro $19, Enterprise $99)
- CONTENT.md → FAQ questions, Pricing tiers, CTA text
- DESIGN_SYSTEM.md → Cyberpunk design tokens
- src/app/globals.css (@theme tokens)
- RULES.md → Section 4 (Tailwind), Section 12 (Semantic HTML)

## Context7 (MANDATORY — fetch before using Accordion)
- Context7 → "shadcn-ui" → Accordion type/collapsible API
- Context7 → "shadcn-ui" → Card, Badge usage

## Task

### 1. src/components/marketing/faq-section.tsx
shadcn/ui Accordion with cyberpunk styling. Include 7 Q&As:

Section structure:
```tsx
<section aria-labelledby="faq-heading">
  <div className="container mx-auto">
    <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
      // 05_FAQ
    </div>
    <h2 id="faq-heading" className="font-display text-2xl font-black text-foreground uppercase tracking-wider mb-12">
      FREQUENTLY_ASKED
    </h2>
    <Accordion type="single" collapsible>
      {/* 7 Q&As from CONTENT.md */}
    </Accordion>
  </div>
</section>
```

Questions (from CONTENT.md):
1. "Is NEUROMAIL really free?"
2. "How does the AI generate emails?"
3. "Can I edit the generated emails?"
4. "Is my data secure?"
5. "What languages are supported?"
6. "Can I use this for business emails?"
7. "What if I don't like the generated email?"

### 2. src/components/marketing/pricing-preview-section.tsx
Three pricing cards (Starter / Professional / Enterprise) with cyberpunk styling.

Section structure:
```tsx
<section aria-labelledby="pricing-heading">
  <div className="container mx-auto">
    <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
      // 04_ACCESS_PASSES
    </div>
    <h2 id="pricing-heading" className="font-display text-2xl font-black text-foreground uppercase tracking-wider mb-12">
      ACCESS_LEVELS
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 3 pricing cards with chamfered corners */}
    </div>
  </div>
</section>
```

Pricing cards (from CONTENT.md):
- **Starter** ($0/mo): "STARTER", "Free forever · no card", chamfered button "START FREE"
- **Professional** ($19/mo): "PROFESSIONAL", "RECOMMENDED" badge, neon green border, chamfered button "GET STARTED" with pulse-glow
- **Enterprise** ($99/mo): "ENTERPRISE", chamfered button "CONTACT SALES" with magenta border

### 3. src/components/marketing/cta-section.tsx
Dark gradient background with cyberpunk styling.

```tsx
<section aria-labelledby="cta-heading">
  <div className="container mx-auto text-center">
    <h2 id="cta-heading" className="font-display text-3xl font-black text-foreground uppercase tracking-wider mb-4">
      READY_TO_DEPLOY?
    </h2>
    <p className="font-mono text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
      Join thousands of professionals saving hours every week with AI-powered email generation.
    </p>
    <Button asChild size="lg" className="chamfered animate-pulse-glow">
      <Link href="/register">GET_ACCESS →</Link>
    </Button>
  </div>
</section>
```

### 4. src/app/(marketing)/page.tsx — assemble all sections
```typescript
import { HeroSection } from '@/components/marketing/hero-section'
import { FeaturesSection } from '@/components/marketing/features-section'
import { DemoSection } from '@/components/marketing/demo-section'
import { PricingPreviewSection } from '@/components/marketing/pricing-preview-section'
import { FaqSection } from '@/components/marketing/faq-section'
import { CtaSection } from '@/components/marketing/cta-section'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NEUROMAIL — Write Better Emails in Seconds'
}

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <PricingPreviewSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
```

## Semantic HTML & Schema.org Requirements

**All sections must follow RULES.md §12:**

1. **Semantic structure:**
   ```tsx
   <section aria-labelledby="hero-heading">
     <div className="container">
       <h2 id="hero-heading">...</h2>
     </div>
   </section>
   ```

2. **Mobile-first responsive:**
   ```tsx
   <h1 className="text-4xl md:text-5xl lg:text-6xl">...</h1>
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
   ```

3. **Schema.org JSON-LD (add to page.tsx):**
   ```tsx
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

   <script
     type="application/ld+json"
     dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
   />
   ```

4. **Content from CONTENT.md:**
   - All text comes from `CONTENT.md` → `src/lib/content.ts`
   - SEO meta tags defined in `CONTENT.md` §1.1
   - Schema.org definitions in `CONTENT.md` §6

5. **Accessibility checklist:**
   - [ ] Skip link present in root layout
   - [ ] All sections have `aria-labelledby`
   - [ ] Heading hierarchy: H1 → H2 → H3 (no skips)
   - [ ] Icons: decorative = `aria-hidden="true"`, functional = `aria-label`
   - [ ] Touch targets ≥ 44px on mobile
   - [ ] Focus indicators visible on all interactive elements

## Tests — Step 3.5
### Manual Verification
- [ ] All 6 sections visible when scrolling the Landing Page
- [ ] FAQ section: label "// 05_FAQ", heading "FREQUENTLY_ASKED" in Orbitron
- [ ] FAQ accordion: each item opens and closes independently
- [ ] Pricing preview: label "// 04_ACCESS_PASSES", heading "ACCESS_LEVELS"
- [ ] Pricing cards: 3 cards (Starter/Professional/Enterprise), Professional has neon green border and "RECOMMENDED" badge
- [ ] CTA section: heading "READY_TO_DEPLOY?", chamfered button with pulse-glow
- [ ] All CTAs → /register
- [ ] No horizontal scroll at 375px, 768px, 1440px
- [ ] Lighthouse (Chrome DevTools): Performance ≥ 85, Accessibility ≥ 90
- [ ] Schema.org JSON-LD present in page source (FAQPage)
```

---

## Phase 3 Regression Test

```bash
bun run typecheck   # 0 errors
bun run lint        # 0 warnings
bun test            # all tests still green
bun run build       # build completes
```

### Visual Regression Checklist
- [ ] Landing Page at 375px — mobile layout correct, no overflow
- [ ] Landing Page at 768px — tablet layout correct
- [ ] Landing Page at 1440px — desktop layout correct
- [ ] Animations play on first load and on scroll
- [ ] All 6 sections render in correct order
- [ ] Hero CTA → /register; Demo works; FAQ accordion works

**Write report:** `docs/reports/phase-3-report.md`
