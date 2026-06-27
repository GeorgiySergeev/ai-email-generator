import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { EmailHistoryList } from '@/components/dashboard/email-history-list'
import type { GeneratedEmail } from '@/types'
import type { Database } from '@/types/database'

type EmailRow = Database['public']['Tables']['generated_emails']['Row']

export const metadata: Metadata = { title: 'History | NEUROMAIL' }

export default async function HistoryPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rows, error } = (await supabase
    .from('generated_emails')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)) as { data: EmailRow[] | null; error: unknown }

  if (error) {
    console.error('[HistoryPage]', String(error))
  }

  const emails: GeneratedEmail[] = (rows ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    subject: row.subject,
    tone: row.tone as GeneratedEmail['tone'],
    length: row.length as GeneratedEmail['length'],
    content: row.content,
    modelUsed: row.model_used,
    tokensUsed: row.tokens_used,
    createdAt: row.created_at,
  }))

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-3xl">
      <div className="font-label text-xs text-primary uppercase tracking-[0.24em] mb-3">
        {'// EMAIL_HISTORY'}
      </div>
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-black text-foreground uppercase tracking-wider">
            HISTORY_LOG
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            {emails.length} email{emails.length !== 1 ? 's' : ''} generated
          </p>
        </div>
      </div>
      <EmailHistoryList emails={emails} />
    </div>
  )
}
