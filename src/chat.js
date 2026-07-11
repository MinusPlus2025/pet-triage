// Shared, provider-agnostic conversation layer.
// Content assembly, the follow-up hard safeguard, and JSON parse/retry all live
// here so they are identical no matter which provider is active. (§4, req 4)
import { SYSTEM_PROMPT, SPECIES, AGES } from './constants'
import { generate } from './providers'

function labelOf(list, id) {
  return list.find((x) => x.id === id)?.label ?? id
}

// Build one neutral user turn { role, text, images }. First turn carries
// species + age. (§4.1)
export function buildUserContent({ text, images, species, age, includeMeta }) {
  let body = text || ''
  if (includeMeta) {
    const meta = `物种：${labelOf(SPECIES, species)}\n年龄段：${labelOf(AGES, age)}`
    body = body ? `${meta}\n\n${body}` : meta
  }
  return { role: 'user', text: body, images: images || [] }
}

// Frontend hard safeguard for the follow-up cap (§ requirement 3).
export const FORCE_CONCLUDE = { role: 'user', text: '请直接给出结论', images: [] }

// Strip an optional ```json … ``` fence before JSON.parse. (§4.3)
function stripFences(text) {
  const t = text.trim()
  const m = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return (m ? m[1] : t).trim()
}

// Send the conversation and parse the model's JSON reply.
// On any failure (network or parse) retry once, then throw. (§4.3)
// Returns { parsed, raw }.
export async function sendTurn(history) {
  let lastErr
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await generate(history, SYSTEM_PROMPT)
      const parsed = JSON.parse(stripFences(raw))
      return { parsed, raw }
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr
}
