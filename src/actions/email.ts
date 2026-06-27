'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAIProvider } from '@/lib/ai/factory'
import { GenerateEmailSchema } from '@/lib/validations/email-generator'
import type { ActionResult, GeneratedEmail } from '@/types'
import type { Database } from '@/types/database'

type EmailInsert = Database['public']['Tables']['generated_emails']['Insert']
type EmailRow = Database['public']['Tables']['generated_emails']['Row']

export const generateEmailAction = async (
  formData: FormData
): Promise<ActionResult<GeneratedEmail>> => {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' }

  const rawData = {
    subject: formData.get('subject') as string,
    tone: formData.get('tone') as string,
    length: formData.get('length') as string,
  }
  const parsed = GenerateEmailSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid input',
      code: 'VALIDATION_ERROR',
    }
  }

  // Check usage limits
  const { data: profile } = (await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()) as { data: { plan: string } | null; error: unknown }

  if (profile?.plan === 'free') {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('generated_emails')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', yesterday)

    if (count !== null && count >= 10) {
      return {
        success: false,
        error:
          'Дневной лимит (10 писем) исчерпан. Счетчик обновится через сутки, либо перейдите на платный тариф.',
        code: 'RATE_LIMITED',
      }
    }
  }

  const aiProvider = getAIProvider()
  let aiResult
  try {
    aiResult = await aiProvider.generateEmail(parsed.data)
  } catch (error) {
    // TODO: Sentry.captureException(error, { extra: { userId: user.id, subject: parsed.data.subject } }) — uncomment after bun add @sentry/nextjs
    console.error('[generateEmailAction] AI error:', error)
    return {
      success: false,
      error: 'AI generation failed. Please try again.',
      code: 'AI_UNAVAILABLE',
    }
  }

  const insertRow: EmailInsert = {
    user_id: user.id,
    subject: parsed.data.subject,
    tone: parsed.data.tone,
    length: parsed.data.length,
    content: aiResult.content,
    model_used: aiResult.modelUsed,
    tokens_used: aiResult.tokensUsed ?? null,
  }

  const { data: saved, error: dbError } = (await supabase
    .from('generated_emails')
    .insert(insertRow as never)
    .select()
    .single()) as { data: EmailRow | null; error: unknown }

  if (dbError || !saved) {
    console.error('[generateEmailAction] DB error:', dbError)
    return { success: false, error: 'Failed to save email', code: 'SERVER_ERROR' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/history')

  return {
    success: true,
    data: {
      id: saved.id,
      userId: saved.user_id,
      subject: saved.subject,
      tone: saved.tone as GeneratedEmail['tone'],
      length: saved.length as GeneratedEmail['length'],
      content: saved.content,
      modelUsed: saved.model_used,
      tokensUsed: saved.tokens_used,
      createdAt: saved.created_at,
    },
  }
}

export const deleteEmailAction = async (emailId: string): Promise<ActionResult<void>> => {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' }

  const { error } = await supabase
    .from('generated_emails')
    .delete()
    .eq('id', emailId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: 'Failed to delete email', code: 'SERVER_ERROR' }

  revalidatePath('/dashboard')
  revalidatePath('/history')
  return { success: true, data: undefined }
}
