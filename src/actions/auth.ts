'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { LoginSchema, RegisterSchema } from '@/lib/validations/auth'
import type { ActionResult } from '@/types'

export const loginAction = async (formData: FormData): Promise<ActionResult<void>> => {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = LoginSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Validation failed',
      code: 'VALIDATION_ERROR',
    }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    console.error('[loginAction]', error.message)
    return {
      success: false,
      error: 'Invalid email or password',
      code: 'AUTH_INVALID',
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export const registerAction = async (formData: FormData): Promise<ActionResult<void>> => {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const parsed = RegisterSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Validation failed',
      code: 'VALIDATION_ERROR',
    }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    },
  })

  if (error) {
    console.error('[registerAction]', error.message)
    if (error.message.toLowerCase().includes('already registered')) {
      return {
        success: false,
        error: 'An account with this email already exists',
        code: 'AUTH_INVALID',
      }
    }
    return { success: false, error: 'Registration failed. Please try again.', code: 'SERVER_ERROR' }
  }

  // Supabase requires email confirmation in production — no session yet, so we
  // cannot redirect to /dashboard. Return success and let the form show the prompt.
  return { success: true, data: undefined }
}

export const logoutAction = async (): Promise<void> => {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
