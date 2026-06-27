import type { AIProvider, GenerateEmailParams, GenerateEmailResult } from '@/types/ai'

const TONE_TEMPLATES = {
  professional: `Subject: {subject}

Dear [Recipient],

I am writing regarding {subject}. After careful consideration, I want to address this clearly and professionally.

[Professional body content here]

Please do not hesitate to reach out if you have any questions.

Best regards,
[Your Name]`,

  casual: `Hey!

Just reaching out about {subject}.

[Casual, relaxed email body]

Let me know what you think!

Cheers,
[Your Name]`,

  formal: `Dear Sir/Madam,

I write to formally address the matter of {subject}.

[Formal body with structured language]

Yours faithfully,
[Your Name]`,

  friendly: `Hi there!

Hope you're doing well! I wanted to reach out about {subject}.

[Warm, personable body]

Looking forward to your response!

Warm regards,
[Your Name]`,

  persuasive: `Subject: Why {subject} Deserves Your Attention

Hi,

I believe {subject} represents a significant opportunity worth your consideration.

[Persuasive body with clear value proposition and call to action]

I'd love to discuss this further — when are you available?

Best,
[Your Name]`,
} as const

const LENGTH_PADDING: Record<string, string> = {
  short: '',
  medium: '\n\n[Additional context and supporting details that elaborate on the main point.]\n',
  long: '\n\n[Comprehensive background information]\n\n[Supporting arguments and evidence]\n\n[Specific examples and case studies]\n\n[Clear next steps and call to action]\n',
}

export const mockAIProvider: AIProvider = {
  name: 'mock-v1',

  generateEmail: async (params: GenerateEmailParams): Promise<GenerateEmailResult> => {
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

    const template = TONE_TEMPLATES[params.tone] ?? TONE_TEMPLATES.professional
    const body = template.replace(/\{subject\}/g, params.subject)
    const padding = LENGTH_PADDING[params.length] ?? ''
    const content = body + padding

    return {
      content,
      tokensUsed: Math.floor(content.length / 4),
      modelUsed: 'mock-v1',
    }
  },
}
