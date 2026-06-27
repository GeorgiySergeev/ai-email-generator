'use client'

import { useEffect, useState, useTransition } from 'react'
import { cn } from '@/lib/utils'

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
] as const

type LocaleCode = (typeof LOCALES)[number]['code']

function getCookieLocale(): LocaleCode {
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/)
  const value = match?.[1]
  return value === 'ru' ? 'ru' : 'en'
}

export const LanguageSwitcher = () => {
  const [active, setActive] = useState<LocaleCode>('en')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setActive(getCookieLocale())
  }, [])

  const handleSwitch = (locale: LocaleCode) => {
    if (locale === active) return
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
      window.location.reload()
    })
  }

  return (
    <div className="flex items-center gap-1" aria-label="Language switcher">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleSwitch(code)}
          disabled={isPending}
          className={cn(
            'font-label text-xs tracking-wider px-2 py-1 transition-colors',
            'border border-transparent hover:border-border',
            active === code ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
          aria-label={`Switch to ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
