import Anthropic from '@anthropic-ai/sdk'
import type { AIProvider, GenerateEmailParams, GenerateEmailResult } from '@/types/ai'

const MODEL = 'claude-haiku-4-5-20251001'

const MAX_TOKENS: Record<string, number> = {
  short: 350,
  medium: 750,
  long: 1300,
}

const LENGTH_GUIDE: Record<string, string> = {
  short: 'approximately 100 words',
  medium: 'approximately 250 words',
  long: 'approximately 500 words',
}

const TONE_GUIDE: Record<string, string> = {
  professional: 'Use a professional, business-appropriate tone. Be clear, concise, and respectful.',
  casual:
    'Use a casual, conversational tone. Be friendly and relaxed, like writing to a colleague you know well.',
  formal:
    'Use a highly formal tone. Follow strict business letter conventions with proper salutations and closings.',
  friendly: 'Use a warm, friendly tone. Be personable, approachable, and enthusiastic.',
  persuasive:
    'Use a persuasive tone. Present compelling arguments, address objections, and include a clear call to action.',
}

const buildSystemPrompt = (params: GenerateEmailParams): string =>
  `You are an expert email writer.
Tone instruction: ${TONE_GUIDE[params.tone]}
Length target: ${LENGTH_GUIDE[params.length]}.
Return ONLY the email content — no preamble, no explanations.
Include: Subject line, greeting, body paragraphs, and signature placeholder.`

const getClient = (): Anthropic => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY environment variable is not set')
  return new Anthropic({
    apiKey,
    fetch: (url, init) => {
      // Fix Next.js Undici premature close bug by disabling keepalive and forcing identity encoding
      return fetch(url, {
        ...init,
        keepalive: false,
        headers: {
          ...init?.headers,
          'accept-encoding': 'identity',
        },
      })
    },
  })
}

export const claudeAIProvider: AIProvider = {
  name: 'claude-haiku-4-5',

  generateEmail: async (params: GenerateEmailParams): Promise<GenerateEmailResult> => {
    const client = getClient()

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS[params.length] ?? 750,
      temperature: 0.7,
      system: buildSystemPrompt(params),
      messages: [{ role: 'user', content: `Write an email about: ${params.subject}` }],
    })

    const block = message.content[0]
    if (!block || block.type !== 'text') {
      throw new Error('Unexpected response format from Claude API')
    }

    return {
      content: block.text,
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
      modelUsed: MODEL,
    }
  },
}
