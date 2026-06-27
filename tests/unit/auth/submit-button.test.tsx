// @happy-dom
import { describe, it, expect } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { SubmitButton } from '@/components/auth/submit-button'

describe('SubmitButton', () => {
  it('renders label text', () => {
    render(<SubmitButton label="Sign in" />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined()
  })

  it('is not disabled by default', () => {
    render(<SubmitButton label="Sign in" />)
    const btn = screen.getByRole('button')
    expect(btn.hasAttribute('disabled')).toBe(false)
  })
})
