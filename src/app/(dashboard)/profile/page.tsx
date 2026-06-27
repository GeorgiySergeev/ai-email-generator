import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProfileForm } from '@/components/dashboard/profile-form'
import type { Profile } from '@/types'
import type { Database } from '@/types/database'
import Link from 'next/link'
import { createCustomerPortalSession } from '@/actions/stripe'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

export const metadata: Metadata = { title: 'Profile | NEUROMAIL' }

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: row } = (await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()) as { data: ProfileRow | null; error: unknown }

  if (!row) redirect('/login')

  const profile: Profile = {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    plan: row.plan as Profile['plan'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  // Calculate limits (last 24 hours)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('generated_emails')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', yesterday)

  const emailsCount = count || 0

  const initials = profile.fullName
    ? profile.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (profile.email[0]?.toUpperCase() ?? '?')

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-3xl">
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
        {'// USER_PROFILE'}
      </div>
      <h1 className="font-display text-2xl font-black text-foreground uppercase tracking-wider mb-8">
        PROFILE_SETTINGS
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identity card */}
        <div
          className="bg-card border border-border overflow-hidden"
          style={{
            clipPath:
              'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))',
          }}
        >
          <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_4px_#00ff88]" />
            <span className="ml-2 font-label text-xs text-muted-foreground tracking-wider">
              identity.cfg
            </span>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center font-display text-2xl font-black text-primary shadow-[0_0_14px_rgba(0,255,136,0.2)]">
                {initials}
              </div>
              <div>
                <div className="font-display text-base font-bold text-foreground tracking-wider">
                  {profile.email}
                </div>
                <div className="font-label text-xs text-muted-foreground tracking-wider mt-1">
                  UID: NM-{profile.id.slice(0, 5).toUpperCase()} · {profile.plan.toUpperCase()} PLAN
                </div>
              </div>
            </div>
            <ProfileForm profile={profile} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Subscription card */}
          <div
            className="bg-card border border-border overflow-hidden"
            style={{
              clipPath:
                'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
          >
            <div className="bg-muted border-b border-border px-4 py-2 font-label text-xs text-muted-foreground tracking-wider">
              subscription.status
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-base font-black text-foreground tracking-wider">
                    {profile.plan.toUpperCase()} PLAN
                  </div>
                  <div className="font-mono text-xs text-muted-foreground mt-1">
                    Active since{' '}
                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <Badge
                  variant={profile.plan === 'pro' ? 'default' : 'secondary'}
                  className="chamfered font-label text-xs"
                >
                  {profile.plan.toUpperCase()}
                </Badge>
              </div>

              {profile.plan === 'free' ? (
                <>
                  <div className="bg-background h-1 rounded overflow-hidden">
                    <div
                      className="h-full bg-primary shadow-[0_0_6px_rgba(0,255,136,0.5)] transition-all"
                      style={{ width: `${(emailsCount / 10) * 100}%` }}
                    />
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {emailsCount} / 10 emails today
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full chamfered">
                    <Link href="/pricing">UPGRADE_PLAN →</Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="font-mono text-xs text-muted-foreground">
                    Unlimited emails available
                  </div>
                  <form action={createCustomerPortalSession}>
                    <Button type="submit" variant="outline" size="sm" className="w-full chamfered">
                      MANAGE_SUBSCRIPTION →
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Danger zone */}
          <div
            className="bg-card border border-border overflow-hidden"
            style={{
              clipPath:
                'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
          >
            <div className="bg-muted border-b border-border px-4 py-2 font-label text-xs text-muted-foreground tracking-wider">
              danger.zone
            </div>
            <div className="p-6">
              <Button
                variant="outline"
                size="sm"
                className="chamfered text-destructive border-destructive/40 hover:bg-destructive/10"
              >
                DELETE_ACCOUNT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
