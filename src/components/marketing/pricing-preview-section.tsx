import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    id: 'starter',
    label: 'STARTER',
    price: '$0',
    period: '/mo',
    tagline: 'Free forever · no card',
    features: [
      '10 emails/month',
      'All 5 tone modes',
      'Email history (7 days)',
      'Copy to clipboard',
    ],
    cta: 'START FREE',
    href: '/register',
    highlight: false,
    badge: null,
  },
  {
    id: 'professional',
    label: 'PROFESSIONAL',
    price: '$19',
    period: '/mo',
    tagline: 'For power users',
    features: [
      '500 emails/month',
      'All 5 tone modes',
      'Unlimited history',
      'Priority generation',
      'Custom signatures',
    ],
    cta: 'GET STARTED',
    href: '/register?plan=pro',
    highlight: true,
    badge: 'RECOMMENDED',
  },
  {
    id: 'enterprise',
    label: 'ENTERPRISE',
    price: '$99',
    period: '/mo',
    tagline: 'For teams & integrations',
    features: [
      'Unlimited emails',
      'REST API access',
      'Team management',
      'SLA guarantee',
      'Dedicated support',
    ],
    cta: 'CONTACT SALES',
    href: '/contact',
    highlight: false,
    badge: null,
  },
]

export const PricingPreviewSection = () => (
  <section
    aria-labelledby="pricing-heading"
    className="py-20 sm:py-28 bg-card border-y border-border"
  >
    <div className="container mx-auto">
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
        {'// 04_ACCESS_PASSES'}
      </div>
      <h2
        id="pricing-heading"
        className="font-display text-2xl font-black text-foreground uppercase tracking-wider mb-12"
      >
        ACCESS_LEVELS
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'relative flex flex-col gap-6 p-8 border bg-background',
              plan.highlight
                ? 'border-primary shadow-[0_0_20px_rgba(0,255,136,0.25)]'
                : 'border-border'
            )}
          >
            {plan.badge && (
              <Badge className="absolute top-4 right-4 font-label text-[10px] uppercase tracking-widest bg-primary text-primary-foreground">
                {plan.badge}
              </Badge>
            )}

            <div>
              <p className="font-label text-xs text-primary uppercase tracking-widest mb-2">
                {plan.label}
              </p>
              <div className="flex items-end gap-1">
                <span className="font-display text-4xl font-black text-foreground">
                  {plan.price}
                </span>
                <span className="font-mono text-sm text-muted-foreground mb-1">{plan.period}</span>
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-1">{plan.tagline}</p>
            </div>

            <ul className="space-y-2 flex-1">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 font-mono text-xs text-muted-foreground"
                >
                  <span className="text-primary mt-0.5">■</span>
                  {f}
                </li>
              ))}
            </ul>

            <Button
              asChild
              className={cn(
                'chamfered w-full',
                plan.highlight && 'animate-pulse-glow',
                plan.id === 'enterprise' && 'border-secondary text-secondary hover:bg-secondary/10'
              )}
              variant={plan.id === 'enterprise' ? 'outline' : 'default'}
            >
              <Link href={plan.href}>{plan.cta} →</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
)
