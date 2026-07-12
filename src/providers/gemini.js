// Gemini provider. Key exposed in the frontend — hackathon demo only.
//
// Provider contract (identical across providers):
//   generate(history, systemPrompt) -> Promise<string>
//   - history: neutral turns { role: 'user' | 'model', text, images: string[] }
//              where images are base64 data URLs
//   - returns the model's raw text reply
// Parsing / retry / follow-up safeguard all live in the shared layer (src/chat.js).

// gemini-2.5-flash is multimodal — it can read uploaded photos.
export const supportsImages = true

const MODEL = 'gemini-2.5-flash'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

function splitDataUrl(dataUrl) {
  const comma = dataUrl.indexOf(',')
  const head = dataUrl.slice(0, comma)
  const data = dataUrl.slice(comma + 1)
  const mime = head.match(/data:(.*?);/)?.[1] || 'image/jpeg'
  return { mime, data }
}

function toContents(history) {
  return history.map((m) => {
    const parts = []
    if (m.text) parts.push({ text: m.text })
    for (const dataUrl of m.images || []) {
      const { mime, data } = splitDataUrl(dataUrl)
      parts.push({ inline_data: { mime_type: mime, data } })
    }
    if (parts.length === 0) parts.push({ text: '' })
    return { role: m.role === 'model' ? 'model' : 'user', parts }
  })
}

export async function generate(history, systemPrompt) {
  if (!API_KEY || API_KEY.trim().length === 0) {
    throw new Error('MISSING_KEY: VITE_GEMINI_API_KEY 未配置')
  }

  let res
  try {
    res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: toContents(history),
        generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
      }),
    })
  } catch (e) {
    throw new Error(`NETWORK: ${e.message}`)
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    if (res.status === 401 || res.status === 403) {
      throw new Error(`BAD_KEY: Gemini ${res.status} ${detail.slice(0, 120)}`)
    }
    if (res.status === 429) {
      throw new Error(`RATE_LIMIT: Gemini 429 ${detail.slice(0, 120)}`)
    }
    throw new Error(`Gemini API ${res.status} ${detail.slice(0, 120)}`)
  }

  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts || []
  return parts.map((p) => p.text || '').join('')
}
