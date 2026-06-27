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
      { text: 'Priority support', included: false },
    ],
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
      { text: 'API access', included: false },
    ],
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
      { text: 'Priority support', included: true },
    ],
  },
]
