import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const CtaSection = () => (
  <section
    aria-labelledby="cta-heading"
    className="relative py-24 sm:py-32 overflow-hidden"
    style={{
      background:
        'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,255,136,0.08) 0%, transparent 70%)',
    }}
  >
    <div className="container mx-auto text-center">
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-6">
        {'// 06_DEPLOY'}
      </div>
      <h2
        id="cta-heading"
        className="font-display text-3xl font-black text-foreground uppercase tracking-wider mb-4 sm:text-4xl"
      >
        READY_TO_DEPLOY?
      </h2>
      <p className="font-mono text-base text-muted-foreground mb-10 max-w-2xl mx-auto">
        Join thousands of professionals saving hours every week with AI-powered email generation.
      </p>
      <Button asChild size="lg" className="chamfered animate-pulse-glow px-10">
        <Link href="/register">GET_ACCESS →</Link>
      </Button>
    </div>
  </section>
)
