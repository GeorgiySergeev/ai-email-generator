import { describe, it, expect } from 'bun:test'
import { LoginSchema, RegisterSchema } from '@/lib/validations/auth'

describe('LoginSchema', () => {
  it('accepts valid credentials', () => {
    const r = LoginSchema.safeParse({ email: 'a@b.com', password: 'pass' })
    expect(r.success).toBe(true)
  })
  it('rejects invalid email', () => {
    const r = LoginSchema.safeParse({ email: 'not-email', password: 'pass' })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0]?.path).toContain('email')
  })
  it('rejects empty password', () => {
    const r = LoginSchema.safeParse({ email: 'a@b.com', password: '' })
    expect(r.success).toBe(false)
  })
})

describe('RegisterSchema', () => {
  const valid = {
    email: 'test@example.com',
    password: 'Password1',
    confirmPassword: 'Password1',
  }
  it('accepts valid registration data', () => {
    expect(RegisterSchema.safeParse(valid).success).toBe(true)
  })
  it('rejects password shorter than 8 characters', () => {
    const r = RegisterSchema.safeParse({ ...valid, password: 'Ab1', confirmPassword: 'Ab1' })
    expect(r.success).toBe(false)
  })
  it('rejects password without uppercase', () => {
    const r = RegisterSchema.safeParse({
      ...valid,
      password: 'password1',
      confirmPassword: 'password1',
    })
    expect(r.success).toBe(false)
  })
  it('rejects mismatched passwords', () => {
    const r = RegisterSchema.safeParse({ ...valid, confirmPassword: 'Different1' })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0]?.path).toContain('confirmPassword')
  })
})
