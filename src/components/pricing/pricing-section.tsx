'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { PricingCard } from '@/components/pricing/pricing-card'
import { PRICING_TIERS } from '@/lib/pricing'
import { cn } from '@/lib/utils'

type PricingSectionProps = {
  isLoggedIn?: boolean
  currentPlan?: string
}

export const PricingSection = ({ isLoggedIn, currentPlan = 'free' }: PricingSectionProps) => {
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <>
      <div className="mx-auto max-w-2xl text-center mb-16 space-y-4">
        <h1 className="font-display text-4xl font-black tracking-tight text-foreground uppercase sm:text-5xl">
          ACCESS_LEVELS
        </h1>
        <p className="font-mono text-base text-muted-foreground">
          Start for free. Upgrade when you&apos;re ready. No hidden fees.
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <span
            className={cn(
              'font-mono text-sm',
              !isAnnual ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            Monthly
          </span>
          <button
            type="button"
            className="relative w-14 h-7 bg-muted rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle billing period"
            aria-pressed={isAnnual}
          >
            <span
              className={cn(
                'absolute top-1 w-5 h-5 bg-primary rounded-full transition-transform',
                isAnnual ? 'left-8' : 'left-1'
              )}
            />
          </button>
          <span
            className={cn(
              'font-mono text-sm flex items-center gap-2',
              isAnnual ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            Annual
            <Badge variant="outline" className="font-label text-xs">
              SAVE 50%
            </Badge>
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
        {PRICING_TIERS.map((tier) => (
          <PricingCard
            key={tier.name}
            tier={tier}
            isAnnual={isAnnual}
            isLoggedIn={isLoggedIn ?? false}
            currentPlan={currentPlan}
          />
        ))}
      </div>
    </>
  )
}
