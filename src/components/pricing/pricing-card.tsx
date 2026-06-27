import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
        {tier.price === 0 ? (
          <span className="font-display text-4xl font-black text-foreground">$0</span>
        ) : (
          <>
            <span
              className={cn(
                'font-display text-4xl font-black',
                tier.recommended ? 'text-primary' : 'text-foreground'
              )}
            >
              ${tier.price}
            </span>
            <span className="font-mono text-sm text-muted-foreground mb-1">/mo</span>
          </>
        )}
      </div>

      <div className="font-mono text-xs text-muted-foreground mb-6">{tier.description}</div>

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
            <span className={cn(feature.included ? 'text-foreground' : 'text-muted-foreground/40')}>
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

      <Button
        asChild
        variant={tier.recommended ? 'default' : 'outline'}
        className="w-full"
        style={{
          clipPath:
            'polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))',
        }}
      >
        <Link href={tier.plan === 'enterprise' ? 'mailto:sales@neuromail.dev' : '/register'}>
          {tier.cta}
        </Link>
      </Button>
    </div>
  </div>
)
