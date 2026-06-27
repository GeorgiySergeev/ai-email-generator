import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NavLinks } from '@/components/shared/nav-links'

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
        <NavLinks isLoggedIn={!!user} />
      </div>
    </header>
  )
}
