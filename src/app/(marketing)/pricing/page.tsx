import type { Metadata } from 'next'
import Link from 'next/link'
import { PricingSection } from '@/components/pricing/pricing-section'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Pricing — NEUROMAIL',
  description: 'Simple, transparent pricing. Start free, upgrade when ready.',
}

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  let currentPlan = 'free'
  if (user) {
    const { data } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
    const planData = data as { plan?: string } | null
    if (planData?.plan) currentPlan = planData.plan
  }

  return (
    <div className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3 text-center">
          {/* 04_ACCESS_PASSES */}
        </div>

        <PricingSection isLoggedIn={isLoggedIn} currentPlan={currentPlan} />

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
