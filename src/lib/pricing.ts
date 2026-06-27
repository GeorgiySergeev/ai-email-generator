import type { UserPlan } from '@/types'

export type PricingFeature = {
  text: string
  included: boolean
}

export type PricingTier = {
  plan: UserPlan
  name: string
  price: {
    monthly: number
    yearly: number
  }
  stripePriceId?: {
    monthly: string
    yearly: string
  }
  description: string
  features: PricingFeature[]
  cta: string
  recommended: boolean
}

export const PRICING_TIERS: PricingTier[] = [
  {
    plan: 'free',
    name: 'STARTER',
    price: {
      monthly: 0,
      yearly: 0,
    },
    description: 'Free forever · no card',
    recommended: false,
    cta: 'START FREE',
    features: [
      { text: '10 emails per day', included: true },
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
    price: {
      monthly: 19.99,
      yearly: 119.94, // $9.99/mo
    },
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
      yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || '',
    },
    description: 'Billed per period',
    recommended: true,
    cta: 'UPGRADE NOW',
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
    price: {
      monthly: 29.99,
      yearly: 179.94, // $14.99/mo
    },
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENT_MONTHLY || '',
      yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENT_YEARLY || '',
    },
    description: 'Billed per period',
    recommended: false,
    cta: 'UPGRADE NOW',
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
