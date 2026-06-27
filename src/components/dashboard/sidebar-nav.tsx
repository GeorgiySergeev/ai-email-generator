'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Zap, History, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Generator', icon: Zap },
  { href: '/history', label: 'History', icon: History },
  { href: '/profile', label: 'Profile', icon: User },
] as const

type SidebarNavProps = {
  className?: string
}

export const SidebarNav = ({ className }: SidebarNavProps) => {
  const pathname = usePathname()

  return (
    <nav className={cn('flex flex-col gap-0.5', className)}>
      <div className="font-label text-xs text-muted-foreground uppercase tracking-wider px-3 py-2 mb-1">
        NAVIGATION
      </div>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2.5 font-mono text-xs transition-all',
              isActive
                ? 'bg-muted text-primary border-l-2 border-primary'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
