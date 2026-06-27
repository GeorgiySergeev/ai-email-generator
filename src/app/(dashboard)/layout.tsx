import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { SidebarNavMobile } from '@/components/dashboard/sidebar-nav-mobile'
import { logoutAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import type { Database } from '@/types/database'

type ProfileRow = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'email' | 'full_name' | 'plan'
>
type DashboardLayoutProps = { children: React.ReactNode }

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = (await supabase
    .from('profiles')
    .select('email, full_name, plan')
    .eq('id', user.id)
    .single()) as { data: ProfileRow | null; error: unknown }

  const { count: emailCount } = await supabase
    .from('generated_emails')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const currentCount = emailCount ?? 0
  const maxLimit = 10
  const isFreePlan = (profile?.plan ?? 'free') === 'free'
  const progressPercent = Math.min((currentCount / maxLimit) * 100, 100)

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (profile?.email?.[0]?.toUpperCase() ?? '?')

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — hidden on mobile, visible sm+ */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card sm:flex sm:flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link
            href="/"
            className="font-display font-black text-primary uppercase tracking-wider animate-rgb-shift"
          >
            NEUR·O·MAIL
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex flex-1 flex-col p-3">
          <SidebarNav />
        </div>

        {/* Plan badge + Upgrade */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="font-label text-xs text-muted-foreground uppercase tracking-wider">
            PLAN // {profile?.plan?.toUpperCase() ?? 'FREE'}
          </div>
          <div className="bg-background h-1 rounded overflow-hidden">
            <div
              className={`h-full bg-primary shadow-[0_0_6px_rgba(0,255,136,0.5)] ${currentCount >= maxLimit && isFreePlan ? 'bg-destructive shadow-[0_0_6px_rgba(255,50,50,0.5)]' : ''}`}
              style={{ width: isFreePlan ? `${progressPercent}%` : '100%' }}
            />
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {isFreePlan
              ? `${currentCount} / ${maxLimit} emails`
              : `${currentCount} emails generated`}
          </div>
          <Button asChild variant="outline" size="sm" className="w-full chamfered">
            <Link href="/pricing">Upgrade →</Link>
          </Button>
        </div>

        {/* User info + Logout */}
        <div className="border-t border-border p-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary flex items-center justify-center font-display text-xs text-primary shadow-[0_0_6px_rgba(0,255,136,0.2)]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-xs text-foreground">
                {profile?.full_name ?? profile?.email ?? 'User'}
              </p>
            </div>
          </div>
          <form action={logoutAction} className="w-full">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 font-mono text-xs text-muted-foreground hover:text-destructive"
            >
              logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar + content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b border-border px-4 sm:hidden">
          <Link
            href="/"
            className="font-display font-black text-primary uppercase tracking-wider animate-rgb-shift"
          >
            NEUR·O·MAIL
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="font-label text-xs text-muted-foreground uppercase tracking-wider">
              STATUS: <span className="text-primary">■ ONLINE</span>
            </span>
            <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary flex items-center justify-center font-display text-xs text-primary">
              {initials}
            </div>
          </div>
        </header>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-background sm:hidden">
          <SidebarNavMobile />
        </nav>

        <main className="flex-1 overflow-auto pb-16 sm:pb-0">{children}</main>
      </div>
    </div>
  )
}
