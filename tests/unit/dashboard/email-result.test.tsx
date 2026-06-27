import { describe, it, expect } from 'bun:test'
import { render, fireEvent } from '@testing-library/react'
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
    const { getByText } = render(<EmailResult email={mockEmail} />)
    expect(getByText('Project Update')).toBeDefined()
    expect(getByText('Professional')).toBeDefined()
  })

  it('renders email content', () => {
    const { getAllByText } = render(<EmailResult email={mockEmail} />)
    expect(getAllByText(/project update/i).length).toBeGreaterThan(0)
  })

  it('shows delete button when onDelete provided', () => {
    const { getByRole } = render(<EmailResult email={mockEmail} onDelete={() => {}} />)
    expect(getByRole('button', { name: /delete/i })).toBeDefined()
  })

  it('does not show delete button when onDelete not provided', () => {
    const { queryByRole } = render(<EmailResult email={mockEmail} />)
    expect(queryByRole('button', { name: /delete/i })).toBeNull()
  })

  it('calls onDelete with email id when delete clicked', () => {
    let deletedId: string | null = null
    const { getByRole } = render(
      <EmailResult
        email={mockEmail}
        onDelete={(id) => {
          deletedId = id
        }}
      />
    )
    fireEvent.click(getByRole('button', { name: /delete/i }))
    expect(deletedId as unknown as string).toBe('test-id')
  })
})
