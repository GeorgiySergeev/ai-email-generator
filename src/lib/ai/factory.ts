import type { AIProvider } from '@/types/ai'
import { mockAIProvider } from './providers/mock'
import { claudeAIProvider } from './providers/claude'

export const getAIProvider = (): AIProvider => {
  const providerName = process.env.AI_PROVIDER ?? 'mock'

  switch (providerName) {
    case 'claude':
      return claudeAIProvider
    case 'mock':
      return mockAIProvider
    default:
      console.warn(`[AI Factory] Unknown provider "${providerName}", falling back to mock`)
      return mockAIProvider
  }
}
