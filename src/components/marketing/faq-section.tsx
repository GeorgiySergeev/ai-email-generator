'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const FAQ_ITEMS = [
  {
    q: 'Is NEUROMAIL really free?',
    a: 'Yes. The Starter plan is free forever — no credit card required. You get 10 AI-generated emails per month to try the full system.',
  },
  {
    q: 'How does the AI generate emails?',
    a: 'NEUROMAIL uses Claude Haiku, a state-of-the-art language model from Anthropic. Your subject line and tone selection are used to construct a contextually accurate, on-brand email draft in under 2 seconds.',
  },
  {
    q: 'Can I edit the generated emails?',
    a: 'Absolutely. The generated email is plain text — copy it into your email client and edit freely. You can also re-generate with different parameters at any time.',
  },
  {
    q: 'Is my data secure?',
    a: 'Your data is stored securely in a Supabase-managed Postgres database with row-level security. We do not share your email content or personal data with third parties.',
  },
  {
    q: 'What languages are supported?',
    a: 'Currently English only. Multi-language support is on the roadmap for Q3 2026.',
  },
  {
    q: 'Can I use this for business emails?',
    a: 'Yes — NEUROMAIL is optimized for professional use. The Professional and Enterprise plans include higher monthly quotas, priority generation, and API access for team workflows.',
  },
  {
    q: "What if I don't like the generated email?",
    a: 'Hit Generate again. Each generation produces a unique result. You can also switch tone or length and regenerate until the output fits your needs.',
  },
]

export const FaqSection = () => (
  <section aria-labelledby="faq-heading" className="py-20 sm:py-28">
    <div className="container mx-auto">
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
        {'// 05_FAQ'}
      </div>
      <h2
        id="faq-heading"
        className="font-display text-2xl font-black text-foreground uppercase tracking-wider mb-12"
      >
        FREQUENTLY_ASKED
      </h2>

      <Accordion type="single" collapsible className="space-y-px">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border border-border bg-card px-6">
            <AccordionTrigger className="font-mono text-sm text-foreground uppercase tracking-wide py-5 hover:text-primary hover:no-underline transition-colors">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="font-mono text-xs text-muted-foreground leading-relaxed pb-5">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
)
