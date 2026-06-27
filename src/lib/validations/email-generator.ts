import { z } from 'zod'

export const EMAIL_TONE_OPTIONS = [
  'professional',
  'casual',
  'formal',
  'friendly',
  'persuasive',
] as const

export const EMAIL_LENGTH_OPTIONS = ['short', 'medium', 'long'] as const

export const GenerateEmailSchema = z.object({
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(500, 'Subject must be less than 500 characters')
    .trim(),
  tone: z.enum(EMAIL_TONE_OPTIONS, {
    errorMap: () => ({ message: 'Please select a tone' }),
  }),
  length: z.enum(EMAIL_LENGTH_OPTIONS, {
    errorMap: () => ({ message: 'Please select a length' }),
  }),
})

export type GenerateEmailInput = z.infer<typeof GenerateEmailSchema>

export const EMAIL_TONE_LABELS: Record<(typeof EMAIL_TONE_OPTIONS)[number], string> = {
  professional: 'Professional',
  casual: 'Casual',
  formal: 'Formal',
  friendly: 'Friendly',
  persuasive: 'Persuasive',
}

export const EMAIL_LENGTH_LABELS: Record<(typeof EMAIL_LENGTH_OPTIONS)[number], string> = {
  short: 'Short (~100 words)',
  medium: 'Medium (~250 words)',
  long: 'Long (~500 words)',
}
