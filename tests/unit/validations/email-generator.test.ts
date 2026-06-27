import { describe, it, expect } from 'bun:test'
import { GenerateEmailSchema } from '@/lib/validations/email-generator'

describe('GenerateEmailSchema', () => {
  const valid = { subject: 'Project Update', tone: 'professional', length: 'medium' }

  it('accepts valid input', () => {
    expect(GenerateEmailSchema.safeParse(valid).success).toBe(true)
  })
  it('rejects subject shorter than 3 chars', () => {
    expect(GenerateEmailSchema.safeParse({ ...valid, subject: 'ab' }).success).toBe(false)
  })
  it('trims whitespace from subject', () => {
    const r = GenerateEmailSchema.safeParse({ ...valid, subject: '  hello  ' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.subject).toBe('hello')
  })
  it('rejects invalid tone', () => {
    expect(GenerateEmailSchema.safeParse({ ...valid, tone: 'angry' }).success).toBe(false)
  })
  it('rejects invalid length', () => {
    expect(GenerateEmailSchema.safeParse({ ...valid, length: 'xl' }).success).toBe(false)
  })
})
