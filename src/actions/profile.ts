'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UpdateProfileSchema } from '@/lib/validations/profile'
import type { ActionResult, Profile } from '@/types'
import type { Database } from '@/types/database'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

export const updateProfileAction = async (formData: FormData): Promise<ActionResult<Profile>> => {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' }

  const rawData = { fullName: formData.get('fullName') as string }
  const parsed = UpdateProfileSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Validation failed',
      code: 'VALIDATION_ERROR',
    }
  }

  const { data: updated, error } = (await supabase
    .from('profiles')
    .update({ full_name: parsed.data.fullName ?? null } as never)
    .eq('id', user.id)
    .select()
    .single()) as { data: ProfileRow | null; error: unknown }

  if (error || !updated) {
    return { success: false, error: 'Failed to update profile', code: 'SERVER_ERROR' }
  }

  revalidatePath('/profile')

  return {
    success: true,
    data: {
      id: updated.id,
      email: updated.email,
      fullName: updated.full_name,
      avatarUrl: updated.avatar_url,
      plan: updated.plan as Profile['plan'],
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    },
  }
}
