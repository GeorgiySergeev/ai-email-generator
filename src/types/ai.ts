import type { EmailTone, EmailLength } from './index'

export type GenerateEmailParams = {
  subject: string
  tone: EmailTone
  length: EmailLength
  userLocale?: string
}

export type GenerateEmailResult = {
  content: string
  tokensUsed?: number
  modelUsed: string
}

export type AIProvider = {
  readonly name: string
  generateEmail: (params: GenerateEmailParams) => Promise<GenerateEmailResult>
}
