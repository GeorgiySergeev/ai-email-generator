'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { useI18n } from '@/components/shared/i18n-provider'
import { logoutAction } from '@/actions/auth'

type NavLinksProps = {
  isLoggedIn: boolean
}

export const NavLinks = ({ isLoggedIn }: NavLinksProps) => {
  const { t } = useI18n()

  return (
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
        {t('nav', 'pricing')}
      </Link>
      {isLoggedIn ? (
        <>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">{t('nav', 'dashboard')}</Link>
          </Button>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm" className="chamfered">
              {t('nav', 'logout')}
            </Button>
          </form>
        </>
      ) : (
        <>
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">{t('nav', 'login')}</Link>
          </Button>
          <Button asChild size="sm" className="chamfered animate-pulse-glow">
            <Link href="/register">{t('nav', 'register')}</Link>
          </Button>
        </>
      )}
    </nav>
  )
}
