// Shared, provider-agnostic conversation layer.
// Content assembly, the follow-up hard safeguard, and JSON parse/retry all live
// here so they are identical no matter which provider is active.
import { SYSTEM_PROMPT, SPECIES, AGES } from './constants'
import { generate } from './providers'
import { parseModelReply } from './modelReply'

function labelOf(list, id) {
  return list.find((x) => x.id === id)?.label ?? id
}

// Build one neutral user turn { role, text, images }. First turn carries
// species + age.
export function buildUserContent({ text, images, species, age, includeMeta }) {
  let body = text || ''
  if (includeMeta) {
    const meta = `物种：${labelOf(SPECIES, species)}\n年龄段：${labelOf(AGES, age)}`
    body = body ? `${meta}\n\n${body}` : meta
  }
  return { role: 'user', text: body, images: images || [] }
}

// Frontend hard safeguard for the follow-up cap.
export const FORCE_CONCLUDE = { role: 'user', text: '请直接给出结论', images: [] }

// Send the conversation and validate the model's JSON reply with strict schema
// checking. On any failure (network, parse, or schema) retry once, then throw.
// Returns { parsed, raw }.
export async function sendTurn(history) {
  let lastErr
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await generate(history, SYSTEM_PROMPT)
      const parsed = parseModelReply(raw)
      return { parsed, raw }
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr
}
