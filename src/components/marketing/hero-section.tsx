'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
}

export const HeroSection = () => (
  <section
    aria-labelledby="hero-heading"
    className="relative overflow-hidden py-20 sm:py-28 lg:py-36"
  >
    {/* Circuit grid background */}
    <div
      className="absolute inset-0 -z-10 opacity-[0.018]"
      aria-hidden="true"
      style={{
        backgroundImage: `linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }}
    />

    <div className="container mx-auto">
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-6">
        {'// SYS_INITIALIZED · AI EMAIL ENGINE v2.1.0'}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Copy */}
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          <motion.h1
            id="hero-heading"
            variants={item}
            className="font-display text-4xl font-black tracking-tight text-foreground uppercase sm:text-5xl lg:text-6xl"
          >
            Write Better Emails <span className="text-primary">in Seconds</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="font-mono text-base text-muted-foreground leading-relaxed max-w-xl"
          >
            AI-powered email generation with precision tone control. No writer&apos;s block. No
            generic templates. Just high-signal messages that land every time.
          </motion.p>

          {/* Status indicators */}
          <motion.div
            variants={item}
            className="flex flex-wrap gap-6 font-label text-xs text-muted-foreground uppercase tracking-wider"
          >
            <span>
              STATUS: <span className="text-primary">■ ONLINE</span>
            </span>
            <span>
              ENGINE: <span className="text-tertiary">CLAUDE_HAIKU</span>
            </span>
            <span>
              UPTIME: <span className="text-primary">99.9%</span>
            </span>
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
        <motion.div variants={item} initial="hidden" animate="show" className="hidden lg:block">
          <div className="bg-card border border-border overflow-hidden">
            <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive" aria-hidden="true" />
              <span className="w-2 h-2 rounded-full bg-yellow-500" aria-hidden="true" />
              <span
                className="w-2 h-2 rounded-full bg-primary"
                style={{ boxShadow: '0 0 4px #00ff88' }}
                aria-hidden="true"
              />
              <span className="ml-2 font-label text-xs text-muted-foreground tracking-wider">
                neuromail://session/demo.01
              </span>
            </div>
            <div className="p-5 font-mono text-sm leading-relaxed">
              <div className="text-muted-foreground mb-2">
                <span className="text-primary">$</span> neuromail generate --tone=professional
                --length=medium
              </div>
              <div className="text-muted-foreground text-xs">
                <span>→</span> Initializing engine...
                <span className="text-primary"> ✓</span>
              </div>
              <div className="text-muted-foreground text-xs">
                <span>→</span> Applying tone matrix...
                <span className="text-primary"> ✓</span>
              </div>
              <div className="text-muted-foreground text-xs mb-3">
                <span>→</span> Generating output...
                <span className="text-tertiary"> DONE (1.3s)</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="text-xs text-muted-foreground tracking-wider mb-2">
                  OUTPUT ─────────────────
                </div>
                <div className="text-foreground text-xs leading-relaxed">
                  Dear Sarah,
                  <br />
                  <br />
                  I wanted to share the Q3 performance update. Revenue exceeded targets by 12%, with
                  strong momentum in enterprise. I&apos;d welcome 15 minutes to walk through the
                  highlights.
                  <br />
                  <br />
                  Best regards,
                  <br />
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
