import Anthropic from '@anthropic-ai/sdk'
import 'dotenv/config'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function test() {
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'hello' }],
    })
    console.log('Success:', message)
  } catch (e) {
    console.error('Error:', e)
  }
}
test()
