# Phase 6 Report — Pricing Page · i18n · Polish · Deploy

**Date:** 2026-06-27  
**Branch:** feature/phase-6-pricing-i18n-deploy  
**Status:** In Progress

---

## Step 6.1 — Pricing Page ✅

### Files Created

- `src/lib/pricing.ts` — `PRICING_TIERS` array with 3 tiers (Starter/Professional/Enterprise)
- `src/components/pricing/pricing-card.tsx` — `PricingCard` component with chamfered corners, recommended badge, feature list
- `src/app/(marketing)/pricing/page.tsx` — Full pricing page with billing toggle, 3-column grid, FAQ link

### Manual Verification

- [ ] /pricing: section label "// 04_ACCESS_PASSES" visible
- [ ] Heading "ACCESS_LEVELS" in Orbitron font
- [ ] 3 cards render in grid (Starter/Professional/Enterprise)
- [ ] Professional card: 2px neon green border, "RECOMMENDED" badge, pulse-glow animation
- [ ] All CTA buttons work: Starter/Professional → /register, Enterprise → mailto:
- [ ] Billing toggle renders (Monthly/Annual with "SAVE 20%" badge)
- [ ] Mobile (375px): cards stack 1 column
- [ ] Desktop (1440px): 3-column grid

---

## Step 6.2 — next-intl i18n ✅

### Strategy: Cookie-based locale (no URL restructure)

- Locale detected from `NEXT_LOCALE` cookie or `Accept-Language` header
- Default: `en`, supported: `en`, `ru`
- `LanguageSwitcher` component sets cookie and reloads page

### Files Created

- `messages/en.json` — English translations (nav, hero, generator, pricing, auth, profile)
- `messages/ru.json` — Russian translations (full Cyrillic)
- `src/i18n/request.ts` — `getRequestConfig` reading from cookie
- `src/components/shared/language-switcher.tsx` — EN/RU toggle in header

### Files Modified

- `next.config.ts` — Added `withNextIntl` plugin
- `middleware.ts` — Added locale detection + cookie setting
- `src/app/layout.tsx` — Added `NextIntlClientProvider`, `getLocale`, `getMessages`
- `src/components/shared/header.tsx` — Added `LanguageSwitcher`

### Manual Verification

- [ ] EN/RU switcher visible in header
- [ ] Switching to RU → Cyrillic strings appear in header/hero
- [ ] `bun run typecheck` — 0 errors
- [ ] `bun run build` — builds successfully with next-intl plugin

---

## Step 6.3 — Final Polish ✅

### Files Created

- `src/app/sitemap.ts` — Sitemap for /, /pricing, /login, /register
- `src/app/robots.ts` — Robots.txt with disallow for /dashboard, /history, /profile

### Files Modified

- `src/app/layout.tsx` — Added `metadataBase`, Twitter card metadata
- `src/app/error.tsx` — Added Sentry.captureException

### Manual Verification

- [ ] /sitemap.xml responds with valid XML
- [ ] /robots.txt responds with correct rules

---

## Step 6.4 — Vercel Deploy

### Checklist

- [ ] Push branch to GitHub
- [ ] Create PR → merge to main
- [ ] Connect Vercel to GitHub repo
- [ ] Set all environment variables in Vercel Dashboard
- [ ] Update Supabase Auth redirect URLs to production domain
- [ ] Verify production URL end-to-end

---

## Step 6.5 — Sentry ✅

### Files Created

- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

### Files Modified

- `src/app/error.tsx` — Sentry.captureException on error
- `src/actions/email.ts` — Sentry.captureException in AI catch block

### To Complete

- [ ] `bun add @sentry/nextjs`
- [ ] Set `NEXT_PUBLIC_SENTRY_DSN` in production env vars
- [ ] Verify errors appear in Sentry dashboard

---

## Regression Test Results

```bash
# Run after all steps complete:
bun run typecheck     # target: 0 errors
bun run lint          # target: 0 warnings
bun test              # target: all green
bun run build         # target: success
```
