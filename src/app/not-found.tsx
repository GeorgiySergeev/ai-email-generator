import Link from 'next/link'
import { Button } from '@/components/ui/button'

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
    <div className="space-y-2">
      <p className="font-label text-xs text-primary uppercase tracking-widest mb-4">
        {'// 404_NOT_FOUND'}
      </p>
      <h1 className="font-display text-6xl font-black text-primary">404</h1>
      <h2 className="font-display text-2xl font-semibold text-foreground uppercase">
        PAGE_NOT_FOUND
      </h2>
      <p className="text-muted-foreground font-mono text-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
    </div>
    <Button asChild size="lg" className="chamfered">
      <Link href="/">GO_HOME →</Link>
    </Button>
  </div>
)

export default NotFound
