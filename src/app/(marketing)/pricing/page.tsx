import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PricingCard } from '@/components/pricing/pricing-card'
import { PRICING_TIERS } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Pricing — NEUROMAIL',
  description: 'Simple, transparent pricing. Start free, upgrade when ready.',
}

export default function PricingPage() {
  return (
    <div className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3 text-center">
          {/* 04_ACCESS_PASSES */}
        </div>

        <div className="mx-auto max-w-2xl text-center mb-16 space-y-4">
          <h1 className="font-display text-4xl font-black tracking-tight text-foreground uppercase sm:text-5xl">
            ACCESS_LEVELS
          </h1>
          <p className="font-mono text-base text-muted-foreground">
            Start for free. Upgrade when you&apos;re ready. No hidden fees.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <span className="font-mono text-sm text-foreground">Monthly</span>
            <button
              className="relative w-14 h-7 bg-muted rounded-full transition-colors"
              aria-label="Toggle billing period"
            >
              <span className="absolute left-1 top-1 w-5 h-5 bg-primary rounded-full transition-transform" />
            </button>
            <span className="font-mono text-sm text-muted-foreground flex items-center gap-2">
              Annual
              <Badge variant="outline" className="font-label text-xs">
                SAVE 20%
              </Badge>
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.plan} tier={tier} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            Have questions?{' '}
            <Link href="/#faq" className="text-primary hover:underline">
              Check our FAQ →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
