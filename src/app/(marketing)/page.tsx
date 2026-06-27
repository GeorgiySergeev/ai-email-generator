import type { Metadata } from 'next'
import { HeroSection } from '@/components/marketing/hero-section'
import { FeaturesSection } from '@/components/marketing/features-section'
import { DemoSection } from '@/components/marketing/demo-section'
import { PricingPreviewSection } from '@/components/marketing/pricing-preview-section'
import { FaqSection } from '@/components/marketing/faq-section'
import { CtaSection } from '@/components/marketing/cta-section'

export const metadata: Metadata = {
  title: 'NEUROMAIL — Write Better Emails in Seconds',
}

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is NEUROMAIL really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Starter plan is free forever — no credit card required. You get 10 AI-generated emails per month.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI generate emails?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NEUROMAIL uses Claude Haiku from Anthropic to generate contextually accurate email drafts in under 2 seconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I edit the generated emails?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. The generated email is plain text — copy it into your email client and edit freely.',
      },
    },
  ],
}

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <PricingPreviewSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
