'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PricingTier } from '@/lib/pricing'
import { createCheckoutSession } from '@/actions/stripe'

type PricingCardProps = {
  tier: PricingTier
  isAnnual: boolean
  isLoggedIn?: boolean
  currentPlan?: string
}

export const PricingCard = ({ tier, isAnnual, isLoggedIn, currentPlan }: PricingCardProps) => {
  const [isPending, startTransition] = useTransition()

  const isCurrentPlan = currentPlan === tier.plan

  const priceToDisplay = isAnnual ? tier.price.yearly / 12 : tier.price.monthly

  const handleAction = () => {
    if (tier.plan === 'free') return

    startTransition(async () => {
      const result = await createCheckoutSession(
        tier.plan as 'pro' | 'enterprise',
        isAnnual ? 'yearly' : 'monthly'
      )
      if (result && result.success && result.url) {
        window.location.href = result.url
      } else if (result?.error) {
        alert('Checkout error: ' + result.error)
      }
    })
  }

  return (
    <div
      className={cn(
        'relative flex flex-col bg-card border overflow-hidden',
        tier.recommended
          ? 'border-2 border-primary shadow-[0_0_30px_rgba(0,255,136,0.08)]'
          : 'border-border hover:border-muted-foreground/50 transition-colors'
      )}
      style={{
        clipPath:
          'polygon(0 14px, 14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px))',
      }}
    >
      {tier.recommended && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-background font-label text-xs tracking-wider px-4 py-1">
          RECOMMENDED
        </div>
      )}

      <div className={cn('p-7 flex flex-col flex-1', tier.recommended && 'pt-10')}>
        <div
          className={cn(
            'font-label text-xs tracking-wider uppercase mb-4',
            tier.recommended ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {tier.name}
        </div>

        <div className="flex items-end gap-1 mb-2">
          {tier.price.monthly === 0 ? (
            <span className="font-display text-4xl font-black text-foreground">$0</span>
          ) : (
            <>
              <span
                className={cn(
                  'font-display text-4xl font-black',
                  tier.recommended ? 'text-primary' : 'text-foreground'
                )}
              >
                ${priceToDisplay.toFixed(2)}
              </span>
              <span className="font-mono text-sm text-muted-foreground mb-1">/mo</span>
            </>
          )}
        </div>

        <div className="font-mono text-xs text-muted-foreground mb-6">
          {tier.price.monthly === 0 ? (
            tier.description
          ) : isAnnual ? (
            <>
              Billed{' '}
              <span
                className={cn('font-bold', tier.recommended ? 'text-primary' : 'text-foreground')}
              >
                ${tier.price.yearly.toFixed(2)}
              </span>{' '}
              annually
            </>
          ) : (
            'Billed monthly'
          )}
        </div>

        <div className="h-px bg-border mb-6" />

        <ul className="flex flex-col gap-3 mb-8 flex-1">
          {tier.features.map((feature) => (
            <li key={feature.text} className="flex items-start gap-2.5 font-mono text-xs">
              <span
                className={cn(
                  'shrink-0 mt-0.5',
                  feature.included
                    ? tier.recommended
                      ? 'text-primary'
                      : 'text-muted-foreground'
                    : 'text-muted-foreground/40'
                )}
              >
                {feature.included ? '→' : '✕'}
              </span>
              <span
                className={cn(feature.included ? 'text-foreground' : 'text-muted-foreground/40')}
              >
                {feature.included ? (
                  <>
                    <strong className="font-bold">{feature.text.split(' ')[0]}</strong>{' '}
                    {feature.text.split(' ').slice(1).join(' ')}
                  </>
                ) : (
                  feature.text
                )}
              </span>
            </li>
          ))}
        </ul>

        {tier.plan === 'free' ? (
          <Button
            asChild
            variant={tier.recommended ? 'default' : 'outline'}
            className="w-full"
            style={{
              clipPath:
                'polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))',
            }}
          >
            <Link href={isLoggedIn ? '/dashboard' : '/register'}>
              {isLoggedIn ? 'GO TO DASHBOARD' : tier.cta}
            </Link>
          </Button>
        ) : (
          <Button
            onClick={isCurrentPlan ? undefined : handleAction}
            disabled={isPending || isCurrentPlan}
            variant={tier.recommended ? 'default' : 'outline'}
            className="w-full"
            style={{
              clipPath:
                'polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))',
            }}
          >
            {isPending ? 'REDIRECTING...' : isCurrentPlan ? 'CURRENT PLAN' : tier.cta}
          </Button>
        )}
      </div>
    </div>
  )
}
