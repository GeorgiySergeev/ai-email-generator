import { describe, it, expect } from 'bun:test'
import { getAIProvider } from '@/lib/ai/factory'

describe('getAIProvider factory', () => {
  it('returns mock provider when AI_PROVIDER=mock', () => {
    process.env.AI_PROVIDER = 'mock'
    const provider = getAIProvider()
    expect(provider.name).toBe('mock-v1')
  })

  it('falls back to mock for unknown provider', () => {
    process.env.AI_PROVIDER = 'unknown-llm'
    const provider = getAIProvider()
    expect(provider.name).toBe('mock-v1')
  })
})
