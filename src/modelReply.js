// Validate and parse model JSON output.
// Throws INVALID_MODEL_OUTPUT for any structural violation.

const VALID_LEVELS = new Set(['GREEN', 'YELLOW', 'RED'])
const VALID_TYPES = new Set(['question', 'verdict'])

function stripFences(text) {
  const t = text.trim()
  const m = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return (m ? m[1] : t).trim()
}

function assert(ok, msg) {
  if (!ok) {
    const e = new Error(`INVALID_MODEL_OUTPUT: ${msg}`)
    e.code = 'INVALID_MODEL_OUTPUT'
    throw e
  }
}

export function parseModelReply(raw) {
  const stripped = stripFences(raw)

  let parsed
  try {
    parsed = JSON.parse(stripped)
  } catch {
    throw Object.assign(
      new Error('INVALID_MODEL_OUTPUT: 模型返回的不是合法 JSON'),
      { code: 'INVALID_MODEL_OUTPUT' },
    )
  }

  // Must be an object
  assert(
    parsed && typeof parsed === 'object' && !Array.isArray(parsed),
    '模型返回的顶层结构必须是 JSON 对象',
  )

  // type must be present and valid
  assert(
    typeof parsed.type === 'string' && VALID_TYPES.has(parsed.type),
    `type 必须是 "question" 或 "verdict"，而不是 "${parsed.type}"`,
  )

  if (parsed.type === 'question') {
    assert(
      typeof parsed.text === 'string' && parsed.text.trim().length > 0,
      'question.text 必须是非空字符串',
    )
    return { type: 'question', text: parsed.text.trim() }
  }

  // verdict
  assert(
    typeof parsed.level === 'string' && VALID_LEVELS.has(parsed.level),
    `verdict.level 必须是 GREEN / YELLOW / RED，而不是 "${parsed.level}"`,
  )
  assert(
    typeof parsed.reason === 'string' && parsed.reason.trim().length > 0,
    'verdict.reason 必须是非空字符串',
  )
  assert(Array.isArray(parsed.actions), 'verdict.actions 必须是数组')
  assert(
    parsed.actions.length >= 1 && parsed.actions.length <= 5,
    `verdict.actions 长度必须为 1-5，实际为 ${parsed.actions.length}`,
  )
  for (const a of parsed.actions) {
    assert(
      typeof a === 'string' && a.trim().length > 0,
      'verdict.actions 每一项必须是非空字符串',
    )
  }

  const urgentNote = parsed.urgent_note
  assert(
    urgentNote !== undefined && urgentNote !== null && typeof urgentNote === 'string',
    'verdict.urgent_note 必须存在且为字符串',
  )

  if (parsed.level === 'RED') {
    assert(urgentNote.trim().length > 0, 'RED 级别的 urgent_note 不能为空')
  }

  return {
    type: 'verdict',
    level: parsed.level,
    reason: parsed.reason.trim(),
    actions: parsed.actions.map((a) => a.trim()),
    urgent_note: urgentNote.trim(),
  }
}
