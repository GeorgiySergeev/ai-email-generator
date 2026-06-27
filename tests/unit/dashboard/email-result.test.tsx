import { describe, it, expect } from 'bun:test'
import { render, screen, fireEvent } from '@testing-library/react'
import { EmailResult } from '@/components/dashboard/email-result'
import type { GeneratedEmail } from '@/types'

const mockEmail: GeneratedEmail = {
  id: 'test-id',
  userId: 'user-id',
  subject: 'Project Update',
  tone: 'professional',
  length: 'medium',
  content: 'Dear John,\n\nRegarding the project update...',
  modelUsed: 'mock-v1',
  tokensUsed: 120,
  createdAt: '2024-06-26T10:00:00Z',
}

describe('EmailResult', () => {
  it('renders subject and tone badge', () => {
    render(<EmailResult email={mockEmail} />)
    expect(screen.getByText('Project Update')).toBeDefined()
    expect(screen.getByText('Professional')).toBeDefined()
  })

  it('renders email content', () => {
    render(<EmailResult email={mockEmail} />)
    expect(screen.getAllByText(/project update/i).length).toBeGreaterThan(0)
  })

  it('shows delete button when onDelete provided', () => {
    render(<EmailResult email={mockEmail} onDelete={() => {}} />)
    expect(screen.getByRole('button', { name: /delete/i })).toBeDefined()
  })

  it('does not show delete button when onDelete not provided', () => {
    render(<EmailResult email={mockEmail} />)
    expect(screen.queryByRole('button', { name: /delete/i })).toBeNull()
  })

  it('calls onDelete with email id when delete clicked', () => {
    let deletedId: string | null = null
    render(
      <EmailResult
        email={mockEmail}
        onDelete={(id) => {
          deletedId = id
        }}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(deletedId as unknown as string).toBe('test-id')
  })
})
