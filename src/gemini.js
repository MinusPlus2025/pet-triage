// Gemini API client. The frontend calls Gemini directly and the key is exposed
// in the bundle — hackathon demo only, no proxy layer (PRD §2).
import { SYSTEM_PROMPT, SPECIES, AGES } from './constants'

const MODEL = 'gemini-2.5-flash'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

function labelOf(list, id) {
  return list.find((x) => x.id === id)?.label ?? id
}

// Build one user turn's content. The first turn carries species + age. (§4.1)
export function buildUserContent({ text, images, species, age, includeMeta }) {
  const parts = []
  let body = text || ''
  if (includeMeta) {
    const meta = `物种：${labelOf(SPECIES, species)}\n年龄段：${labelOf(AGES, age)}`
    body = body ? `${meta}\n\n${body}` : meta
  }
  if (body) parts.push({ text: body })
  for (const dataUrl of images || []) {
    const comma = dataUrl.indexOf(',')
    const head = dataUrl.slice(0, comma)
    const data = dataUrl.slice(comma + 1)
    const mime = head.match(/data:(.*?);/)?.[1] || 'image/jpeg'
    parts.push({ inline_data: { mime_type: mime, data } })
  }
  if (parts.length === 0) parts.push({ text: '' })
  return { role: 'user', parts }
}

// Frontend hard safeguard for the follow-up cap (§ requirement 3).
export const FORCE_CONCLUDE = { role: 'user', parts: [{ text: '请直接给出结论' }] }

// Strip an optional ```json … ``` fence before JSON.parse. (§4.3)
function stripFences(text) {
  const t = text.trim()
  const m = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return (m ? m[1] : t).trim()
}

async function callGemini(contents) {
  const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Gemini API ${res.status} ${detail}`)
  }
  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts || []
  return parts.map((p) => p.text || '').join('')
}

// Send the conversation and parse the model's JSON reply.
// On any failure (network or parse) retry once, then throw. (§4.3)
// Returns { parsed, raw } — raw text is stored back into history for continuity.
export async function sendTurn(contents) {
  let lastErr
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await callGemini(contents)
      const parsed = JSON.parse(stripFences(raw))
      return { parsed, raw }
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr
}
