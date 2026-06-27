# DESIGN_SYSTEM.md — NEUROMAIL Design System

> Complete specification for the cyberpunk aesthetic.  
> Dark mode only · Monospace-first · Chamfered geometry · Neon glow  
> Version: 2.1.0

---

## 1. Colors

All colors use hex values for precise neon control. No oklch.

### 1.1 Base Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#0a0a0f` | Page background, near-black |
| `card` | `#12121a` | Card backgrounds, elevated surfaces |
| `muted` | `#1c1c2e` | Muted backgrounds, terminal headers |
| `border` | `#2a2a3a` | Borders, dividers |
| `foreground` | `#e0e0e0` | Primary text color |
| `muted-foreground` | `#6b7280` | Secondary text, labels |

### 1.2 Accent Colors (Neon)

| Token | Hex | Usage | Glow |
|-------|-----|-------|------|
| `primary` | `#00ff88` | Primary accent, CTAs, links | `rgba(0,255,136,0.5)` |
| `secondary` | `#ff00ff` | Secondary accent, enterprise tier | `rgba(255,0,255,0.5)` |
| `tertiary` | `#00d4ff` | Tertiary accent, info badges | `rgba(0,212,255,0.5)` |
| `destructive` | `#ff3366` | Errors, delete actions | `rgba(255,51,102,0.5)` |

### 1.3 CSS Variables

```css
@theme {
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
}
```

---

## 2. Typography

### 2.1 Font Families

| Role | Font | Weights | CSS Variable |
|------|------|---------|--------------|
| **Headings** | Orbitron | 400, 700, 900 | `--font-display` |
| **Body / UI** | JetBrains Mono | 300, 400, 500, 700 | `--font-mono` |
| **Labels / HUD** | Share Tech Mono | 400 | `--font-label` |

### 2.2 Type Scale

| Level | Font | Size | Weight | Tracking | Transform | Usage |
|-------|------|------|--------|----------|-----------|-------|
| **H1** | Orbitron | 2.5rem | 900 | 0.04em | uppercase | Page titles |
| **H2** | Orbitron | 1.75rem | 900 | 0.06em | uppercase | Section headings |
| **H3** | Orbitron | 1.1rem | 700 | 0.06em | uppercase | Subsection headings |
| **Eyebrow** | Share Tech Mono | 0.62rem | 400 | 0.26em | uppercase | Section labels (e.g., "// 01_CAPABILITIES") |
| **Body** | JetBrains Mono | 0.85rem | 400 | — | — | Paragraph text |
| **Caption** | Share Tech Mono | 0.6rem | 400 | 0.14em | uppercase | Metadata, status text |
| **Terminal** | JetBrains Mono | 0.8rem | 400 | — | — | Code/terminal output |

### 2.3 CSS Variables

```css
@theme {
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
}
```

### 2.4 next/font Setup

```typescript
import { Orbitron, JetBrains_Mono, Share_Tech_Mono } from 'next/font/google'

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
```

---

## 3. Buttons

### 3.1 Variants

| Variant | Background | Text | Border | Effect | Usage |
|---------|------------|------|--------|--------|-------|
| **Primary** | `#00ff88` | `#0a0a0f` | none | pulse-glow | Main CTAs |
| **Outline Accent** | transparent | `#00ff88` | `#00ff88` | neon glow hover | Secondary CTAs |
| **Secondary** | transparent | `#ff00ff` | `#ff00ff` | neon glow hover | Enterprise actions |
| **Ghost** | transparent | `#6b7280` | `#2a2a3a` | — | Tertiary actions |
| **Destructive** | transparent | `#ff3366` | `rgba(255,51,102,0.4)` | — | Delete/cancel |
| **Disabled** | `#00ff88` | `#0a0a0f` | none | opacity: 0.35 | Inactive state |

### 3.2 Chamfer Clip-Path

All buttons use chamfered corners via `clip-path`:

```css
clip-path: polygon(
  0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px,
  100% calc(100% - 8px), calc(100% - 8px) 100%,
  8px 100%, 0 calc(100% - 8px)
);
```

**Size variants:**
- Small: `5px` chamfer
- Medium: `8px` chamfer (default)
- Large: `14px` chamfer

### 3.3 Button Styles

```css
/* Base button */
font-family: 'JetBrains Mono', monospace;
font-size: 0.76rem;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.18em;
padding: 12px 22px;
cursor: pointer;
transition: all 150ms;

/* Primary */
background: #00ff88;
color: #0a0a0f;
animation: pulse-glow 3s ease-in-out infinite;

/* Outline */
background: transparent;
border: 1px solid #00ff88;
color: #00ff88;
box-shadow: 0 0 8px rgba(0,255,136,0.2);

/* Disabled */
opacity: 0.35;
cursor: not-allowed;
```

---

## 4. Inputs

### 4.1 Base Styles

```css
font-family: 'JetBrains Mono', monospace;
background: #12121a;
border: 1px solid #2a2a3a;
color: #00ff88;
padding: 11px 11px 11px 30px; /* left padding for ">" prefix */
font-size: 0.78rem;
clip-path: polygon(
  0 5px, 5px 0, calc(100% - 5px) 0, 100% 5px,
  100% calc(100% - 5px), calc(100% - 5px) 100%,
  5px 100%, 0 calc(100% - 5px)
);
```

### 4.2 States

| State | Border | Text | Shadow | Prefix Color |
|-------|--------|------|--------|--------------|
| **Default** | `#2a2a3a` | `#00ff88` | — | `#00ff88` |
| **Focus** | `#00ff88` | `#00ff88` | `0 0 6px rgba(0,255,136,0.22)` | `#00ff88` |
| **Disabled** | `#2a2a3a` | `#3a3a4a` | — | `#3a3a4a` |
| **Error** | `#ff3366` | `#ff3366` | `0 0 6px rgba(255,51,102,0.2)` | `#ff3366` |

### 4.3 Prefix Character

All inputs include a ">" prefix:

```tsx
<div className="relative">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
    &gt;
  </span>
  <input className="pl-8" />
</div>
```

### 4.4 Labels

Labels use Share Tech Mono, uppercase, with tracking:

```css
font-family: 'Share Tech Mono', monospace;
font-size: 0.57rem;
color: #6b7280;
letter-spacing: 0.14em;
text-transform: uppercase;
margin-bottom: 7px;
```

---

## 5. Cards

### 5.1 Variants

| Variant | Background | Border | Clip-Path | Usage |
|---------|------------|--------|-----------|-------|
| **Default** | `#12121a` | `1px solid #2a2a3a` | 12px chamfer | Feature cards |
| **Terminal** | `#0a0a0f` | `1px solid #2a2a3a` | 12px chamfer | Code/output displays |
| **Neon Highlight** | `#0a0a0f` | `2px solid #00ff88` | 12px chamfer | Recommended items |
| **Corner Accents** | `#12121a` | `1px solid #2a2a3a` | 10px chamfer | Auth screens, key panels |

### 5.2 Terminal Card Header

Terminal-style cards include a header with colored dots:

```tsx
<div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-2">
  <span className="w-2 h-2 rounded-full bg-destructive"></span>
  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
  <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_4px_#00ff88]"></span>
  <span className="ml-2 font-label text-xs text-muted-foreground tracking-wider">
    terminal.session
  </span>
</div>
```

### 5.3 Corner Accents

Decorative corner brackets for emphasis:

```tsx
<div className="relative">
  <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-primary"></div>
  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-primary"></div>
  <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-primary"></div>
  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-primary"></div>
  {/* Card content */}
</div>
```

---

## 6. Badges & Status

### 6.1 Badge Variants

| Variant | Text | Background | Border | Usage |
|---------|------|------------|--------|-------|
| **Active** | `#00ff88` | `rgba(0,255,136,0.08)` | `rgba(0,255,136,0.25)` | Active status |
| **Online** | `#00d4ff` | `rgba(0,212,255,0.08)` | `rgba(0,212,255,0.25)` | Online status |
| **Enterprise** | `#ff00ff` | `rgba(255,0,255,0.08)` | `rgba(255,0,255,0.25)` | Enterprise tier |
| **Error** | `#ff3366` | `rgba(255,51,102,0.08)` | `rgba(255,51,102,0.25)` | Error status |
| **Muted** | `#6b7280` | `rgba(107,114,128,0.08)` | `rgba(107,114,128,0.2)` | Neutral status |
| **Recommended** | `#0a0a0f` | `#00ff88` | none | Highlight badge |

### 6.2 Badge Styles

```css
font-family: 'Share Tech Mono', monospace;
font-size: 0.58rem;
letter-spacing: 0.14em;
padding: 4px 12px;
clip-path: polygon(
  0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px,
  100% calc(100% - 4px), calc(100% - 4px) 100%,
  4px 100%, 0 calc(100% - 4px)
);
```

### 6.3 Status Indicators

```tsx
<div className="flex items-center gap-2 font-label text-xs text-muted-foreground tracking-wider">
  STATUS: <span className="text-primary">■ ONLINE</span>
</div>

<div className="flex items-center gap-2 font-label text-xs text-muted-foreground tracking-wider">
  ENGINE: <span className="text-tertiary">CLAUDE_HAIKU</span>
</div>

<div className="flex items-center gap-2 font-label text-xs text-muted-foreground tracking-wider">
  UPTIME: <span className="text-primary">99.9%</span>
</div>
```

---

## 7. Effects & Animations

### 7.1 RGB Shift

Oscillating text-shadow for logo/branding:

```css
@keyframes rgb-shift {
  0%, 100% { text-shadow: -1px 0 #ff00ff, 1px 0 #00d4ff; }
  50% { text-shadow: 1px 0 #ff00ff, -1px 0 #00d4ff; }
}

animation: rgb-shift 3.5s ease-in-out infinite;
```

**Usage:** Logo "NEUR·O·MAIL"

### 7.2 Glitch

Intermittent translate flicker:

```css
@keyframes glitch {
  0%, 79%, 100% { transform: translate(0); }
  80% { transform: translate(-3px, 1px); }
  83% { transform: translate(2px, -1px); }
  86% { transform: translate(0); }
}

animation: glitch 7s steps(1) infinite;
```

**Usage:** H1 headings (subtle effect)

### 7.3 Pulse Glow

Oscillating box-shadow for active buttons:

```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px #00ff88, 0 0 10px rgba(0,255,136,0.35); }
  50% { box-shadow: 0 0 14px #00ff88, 0 0 28px rgba(0,255,136,0.55); }
}

animation: pulse-glow 3s ease-in-out infinite;
```

**Usage:** Primary CTA buttons

### 7.4 Blink Cursor

Terminal cursor blink:

```css
@keyframes blink {
  50% { opacity: 0; }
}

animation: blink 1.1s step-end infinite;
```

**Usage:** Terminal prompts, loading states

### 7.5 Fade Up

Entrance animation:

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}

animation: fade-up 0.55s ease both;
```

**Usage:** Page/section entrance

### 7.6 Neon Glow (Static)

Static text-shadow for emphasis:

```css
text-shadow: 0 0 8px rgba(0,255,136,0.6);
```

**Usage:** Accent text, highlights

### 7.7 Accessibility

**Respect `prefers-reduced-motion`:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Spacing

### 8.1 Scale

Base grid: **4px**

| Value | Usage |
|-------|-------|
| 4px | Micro spacing |
| 8px | Tight gaps |
| 12px | Small gaps |
| 16px | Default component gap |
| 20px | Card gaps |
| 24px | Card padding |
| 32px | Section gaps |
| 48px | Large section gaps |
| 64px | Page section padding |
| 80px | Section vertical padding |

### 8.2 CSS Variables

```css
@theme {
  --spacing-section: 5rem; /* 80px */
  --spacing-container: 1.5rem; /* 24px */
}
```

---

## 9. Layout

### 9.1 Container

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

### 9.2 Responsive Breakpoints

Mobile-first approach:

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Base | 0px | Mobile (default) |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |

### 9.3 Grid Patterns

**Features grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
```

**Stats grid:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-4">
```

**Pricing grid:**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
```

---

## 10. Brand

### 10.1 Logo

**Text:** "NEUR·O·MAIL"

**Font:** Orbitron 900, uppercase, tracking 0.12em

**Color:** `#00ff88` with RGB shift animation

**Component:**
```tsx
<span className="font-display font-black text-primary uppercase tracking-wider animate-rgb-shift">
  NEUR·O·MAIL
</span>
```

### 10.2 Section Labels

Format: `// [NUMBER]_[NAME]`

**Examples:**
- `// 01_CAPABILITIES`
- `// 02_DEMO`
- `// 03_PROTOCOL`
- `// 04_ACCESS_PASSES`

**Style:**
```css
font-family: 'Share Tech Mono', monospace;
font-size: 0.6rem;
color: #00ff88;
letter-spacing: 0.24em;
text-transform: uppercase;
```

---

## 11. Component Patterns

### 11.1 Terminal Window

```tsx
<div className="bg-background border border-border overflow-hidden">
  <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-destructive"></span>
    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
    <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_4px_#00ff88]"></span>
    <span className="ml-2 font-label text-xs text-muted-foreground tracking-wider">
      {title}
    </span>
  </div>
  <div className="p-5 font-mono text-sm leading-relaxed">
    {children}
  </div>
</div>
```

### 11.2 Stats Card

```tsx
<div className="p-6 border-r border-border last:border-r-0">
  <div className="font-display text-2xl font-black tracking-wide mb-1 text-primary shadow-[0_0_12px_rgba(0,255,136,0.4)]">
    {value}
  </div>
  <div className="font-label text-xs text-muted-foreground uppercase tracking-wider">
    {label}
  </div>
</div>
```

### 11.3 Circuit Background

```tsx
<div 
  className="absolute inset-0 pointer-events-none"
  style={{
    backgroundImage: `
      linear-gradient(rgba(0,255,136,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,136,0.018) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px'
  }}
/>
```

---

## 12. UI References

HTML mockups for all pages:

- `ui/Landing.dc.html` — Landing page
- `ui/Auth.dc.html` — Login/register
- `ui/Dashboard.dc.html` — Email generator + history
- `ui/Pricing.dc.html` — Pricing tiers
- `ui/Profile.dc.html` — User settings
- `ui/ai-emai-generator/DesignSystem.dc.html` — This design system

---

## 13. Implementation Checklist

- [ ] Install fonts via `next/font/google`
- [ ] Add CSS variables to `globals.css`
- [ ] Create chamfered button component
- [ ] Create chamfered input component with ">" prefix
- [ ] Create terminal window component
- [ ] Create logo component with RGB shift
- [ ] Add animations to `globals.css`
- [ ] Add `prefers-reduced-motion` media query
- [ ] Update all phase docs with UI references

---

**Version:** 2.1.0  
**Last updated:** 2026-06-26
