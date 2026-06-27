import type { Metadata } from 'next'
import { EmailGeneratorForm } from '@/components/dashboard/email-generator-form'
import { CheckoutSuccessHandler } from '@/components/dashboard/checkout-success-handler'
import { Suspense } from 'react'

export const metadata: Metadata = { title: 'Generator | NEUROMAIL' }

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-3xl">
      <Suspense fallback={null}>
        <CheckoutSuccessHandler />
      </Suspense>
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
        {'// EMAIL_GENERATOR'}
      </div>
      <div className="mb-8 space-y-2">
        <h1 className="font-display text-2xl font-black text-foreground uppercase tracking-wider">
          GENERATOR_PROTOCOL
        </h1>
        <p className="font-mono text-sm text-muted-foreground">
          Describe your email and let AI write it for you.
        </p>
      </div>
      <EmailGeneratorForm />
    </div>
  )
}
