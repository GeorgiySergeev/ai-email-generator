import 'dotenv/config'

const apiKey = process.env.ANTHROPIC_API_KEY || 'test'

async function test() {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [{ role: 'user', content: 'hello' }],
      }),
    })
    console.log('Status:', response.status)
    const text = await response.text()
    console.log('Body:', text)
  } catch (e) {
    console.error('Error:', e)
  }
}
test()
