import Link from 'next/link'

export const Footer = () => (
  <footer className="border-t border-border bg-background py-8">
    <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="font-label text-xs text-muted-foreground uppercase tracking-wider">
        © {new Date().getFullYear()} NEUR·O·MAIL — All rights reserved
      </p>
      <nav className="flex items-center gap-6" aria-label="Footer navigation">
        <Link
          href="/pricing"
          className="font-label text-xs text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
        >
          {'//'}pricing
        </Link>
        <Link
          href="/privacy"
          className="font-label text-xs text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
        >
          {'//'}privacy
        </Link>
        <Link
          href="/terms"
          className="font-label text-xs text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
        >
          {'//'}terms
        </Link>
      </nav>
    </div>
  </footer>
)
