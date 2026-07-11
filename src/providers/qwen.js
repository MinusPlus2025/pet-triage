// Qwen (通义千问) provider via DashScope's OpenAI-compatible endpoint.
// Key exposed in the frontend — hackathon demo only (PRD §2).
//
// Provider contract (identical to gemini.js):
//   generate(history, systemPrompt) -> Promise<string>
//   - history: neutral turns { role: 'user' | 'model', text, images: string[] }
//              where images are base64 data URLs
//   - returns the model's raw text reply

const MODEL = 'qwen-vl-plus'
const ENDPOINT =
  'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
const API_KEY = import.meta.env.VITE_QWEN_API_KEY

function toMessages(history, systemPrompt) {
  const messages = [{ role: 'system', content: systemPrompt }]
  for (const m of history) {
    const role = m.role === 'model' ? 'assistant' : 'user'
    if (m.images && m.images.length > 0) {
      const content = []
      if (m.text) content.push({ type: 'text', text: m.text })
      for (const url of m.images) content.push({ type: 'image_url', image_url: { url } })
      messages.push({ role, content })
    } else {
      messages.push({ role, content: m.text || '' })
    }
  }
  return messages
}

export async function generate(history, systemPrompt) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: toMessages(history, systemPrompt),
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Qwen API ${res.status} ${detail}`)
  }
  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  // qwen-vl may return content as an array of parts; normalise to text.
  if (Array.isArray(content)) return content.map((c) => c.text || '').join('')
  return content ?? ''
}
