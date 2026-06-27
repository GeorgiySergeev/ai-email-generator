'use client'

import { motion } from 'framer-motion'

const FEATURES = [
  {
    num: '[01]',
    title: 'Instant Generation',
    desc: 'Sub-2 second drafts via Claude Haiku. From subject line to signature in the time it takes to think.',
  },
  {
    num: '[02]',
    title: 'Tone Matrix',
    desc: '5 precision modes — Professional, Casual, Formal, Friendly, Persuasive. The right register for every audience.',
  },
  {
    num: '[03]',
    title: 'Context Engine',
    desc: 'Not a template filler. The AI reads intent from your subject and constructs coherent, on-point output every time.',
  },
  {
    num: '[04]',
    title: 'History Log',
    desc: 'Every email saved automatically. Scroll back, copy, or re-generate with new parameters on any past item.',
  },
  {
    num: '[05]',
    title: 'One-Click Copy',
    desc: 'Copy-ready output in a single click. Paste directly into Gmail, Outlook, or any client. Zero formatting loss.',
  },
  {
    num: '[06]',
    title: 'API Ready',
    desc: 'Enterprise plan includes REST API. Integrate AI email generation directly into your own workflows and products.',
  },
]

export const FeaturesSection = () => (
  <section id="features" aria-labelledby="features-heading" className="py-20 sm:py-28">
    <div className="container mx-auto">
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
        {'// 01_CAPABILITIES'}
      </div>
      <h2
        id="features-heading"
        className="font-display text-2xl font-black text-foreground uppercase tracking-wider mb-12"
      >
        SYS_CAPABILITIES
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="bg-card p-8 flex flex-col gap-4"
          >
            <span className="font-label text-xs text-primary uppercase tracking-widest">
              {f.num}
            </span>
            <h3 className="font-display text-sm font-black text-foreground uppercase tracking-wider">
              {f.title}
            </h3>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)
