// ─── Users & Auth ─────────────────────────────────────────
export type UserPlan = 'free' | 'pro' | 'enterprise'

export type Profile = {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  plan: UserPlan
  createdAt: string
  updatedAt: string
}

// ─── Email Generator ──────────────────────────────────────
export type EmailTone = 'professional' | 'casual' | 'formal' | 'friendly' | 'persuasive'
export type EmailLength = 'short' | 'medium' | 'long'

export type GeneratedEmail = {
  id: string
  userId: string
  subject: string
  tone: EmailTone
  length: EmailLength
  content: string
  modelUsed: string
  tokensUsed: number | null
  createdAt: string
}

// ─── Server Action Results ────────────────────────────────
export type AppErrorCode =
  | 'AUTH_REQUIRED'
  | 'AUTH_INVALID'
  | 'AI_UNAVAILABLE'
  | 'RATE_LIMITED'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: AppErrorCode }

// ─── UI ───────────────────────────────────────────────────
export type ToastVariant = 'default' | 'success' | 'error' | 'warning'
