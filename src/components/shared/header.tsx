import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { logoutAction } from '@/actions/auth'
import { LanguageSwitcher } from '@/components/shared/language-switcher'

export const Header = async () => {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link
          href="/"
          className="font-display font-black text-primary uppercase tracking-wider animate-rgb-shift"
          aria-label="NEUROMAIL home"
        >
          NEUR·O·MAIL
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6" aria-label="Main navigation">
          <LanguageSwitcher />
          <Link
            href="/#features"
            className="hidden sm:block font-label text-xs text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            {'//'}features
          </Link>
          <Link
            href="/#demo"
            className="hidden sm:block font-label text-xs text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            {'//'}demo
          </Link>
          <Link
            href="/pricing"
            className="hidden md:block font-label text-xs text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            {'//'}pricing
          </Link>
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm" className="chamfered">
                  logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">login</Link>
              </Button>
              <Button asChild size="sm" className="chamfered animate-pulse-glow">
                <Link href="/register">get_access →</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
