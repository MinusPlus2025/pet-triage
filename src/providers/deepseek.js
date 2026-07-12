// DeepSeek provider via the official OpenAI-compatible endpoint.
// Key exposed in the frontend — hackathon demo only.
//
// Provider contract (identical to gemini.js / qwen.js):
//   generate(history, systemPrompt) -> Promise<string>
//   - history: neutral turns { role: 'user' | 'model', text, images: string[] }
//              where images are base64 data URLs
//   - returns the model's raw text reply
//
// NOTE: DeepSeek's chat models are TEXT-ONLY — the API does not accept image
// inputs. Images are silently dropped here. For photo triage, switch
// VITE_MODEL_PROVIDER to a vision provider (qwen / gemini).

// DeepSeek chat models are text-only.
export const supportsImages = false

const ENDPOINT = 'https://api.deepseek.com/chat/completions'
const MODEL = import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat'
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

function toMessages(history, systemPrompt) {
  const messages = [{ role: 'system', content: systemPrompt }]
  for (const m of history) {
    const role = m.role === 'model' ? 'assistant' : 'user'
    // DeepSeek is text-only — images are never included in the request.
    messages.push({ role, content: m.text || '' })
  }
  return messages
}

export async function generate(history, systemPrompt) {
  if (!API_KEY || API_KEY === '在这里粘贴你的key') {
    throw new Error('MISSING_KEY: VITE_DEEPSEEK_API_KEY 未配置')
  }

  let res
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: toMessages(history, systemPrompt),
        temperature: 0.4,
        response_format: { type: 'json_object' },
      }),
    })
  } catch (e) {
    throw new Error(`NETWORK: ${e.message}`)
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    if (res.status === 401) throw new Error(`BAD_KEY: DeepSeek 401 ${detail.slice(0, 120)}`)
    if (res.status === 429) throw new Error(`RATE_LIMIT: DeepSeek 429 ${detail.slice(0, 120)}`)
    throw new Error(`DeepSeek API ${res.status} ${detail.slice(0, 120)}`)
  }

  const data = await res.json()
  return data?.choices?.[0]?.message?.content ?? ''
}
