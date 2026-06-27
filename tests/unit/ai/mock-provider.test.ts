import { describe, it, expect } from 'bun:test'
import { mockAIProvider } from '@/lib/ai/providers/mock'

describe('mockAIProvider', () => {
  it('has correct name', () => {
    expect(mockAIProvider.name).toBe('mock-v1')
  })

  it('generates content containing the subject', async () => {
    const result = await mockAIProvider.generateEmail({
      subject: 'Q3 Budget Review',
      tone: 'professional',
      length: 'short',
    })
    expect(result.content).toContain('Q3 Budget Review')
    expect(result.content.length).toBeGreaterThan(50)
    expect(result.modelUsed).toBe('mock-v1')
    expect(result.tokensUsed).toBeGreaterThan(0)
  })

  it('generates unique content for each tone', async () => {
    const tones = ['professional', 'casual', 'formal', 'friendly', 'persuasive'] as const
    const results = await Promise.all(
      tones.map((tone) => mockAIProvider.generateEmail({ subject: 'Test', tone, length: 'short' }))
    )
    const contents = results.map((r) => r.content.slice(0, 30))
    const unique = new Set(contents)
    expect(unique.size).toBe(tones.length)
  })

  it('generates more content for longer length', async () => {
    const base = { subject: 'Test Subject', tone: 'casual' } as const
    const short = await mockAIProvider.generateEmail({ ...base, length: 'short' })
    const long = await mockAIProvider.generateEmail({ ...base, length: 'long' })
    expect(long.content.length).toBeGreaterThan(short.content.length)
  })
})
