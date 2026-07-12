// tests for src/modelReply.js — strict model output validation
import { describe, it } from 'node:test'
import assert from 'node:assert'
import { parseModelReply } from '../src/modelReply.js'

describe('parseModelReply', () => {
  // 1. question with ```json fence
  it('parses question wrapped in ```json fence', () => {
    const raw = '```json\n{"type": "question", "text": "症状持续多久了？"}\n```'
    const result = parseModelReply(raw)
    assert.strictEqual(result.type, 'question')
    assert.strictEqual(result.text, '症状持续多久了？')
  })

  // 2. valid GREEN verdict
  it('parses valid GREEN verdict', () => {
    const raw = JSON.stringify({
      type: 'verdict',
      level: 'GREEN',
      reason: '吐毛球，精神食欲正常',
      actions: ['观察精神状态', '若出现拒食请就医'],
      urgent_note: '',
    })
    const result = parseModelReply(raw)
    assert.strictEqual(result.type, 'verdict')
    assert.strictEqual(result.level, 'GREEN')
    assert.strictEqual(result.reason, '吐毛球，精神食欲正常')
    assert.strictEqual(result.actions.length, 2)
    assert.strictEqual(result.urgent_note, '')
  })

  // 3. valid YELLOW verdict
  it('parses valid YELLOW verdict', () => {
    const raw = JSON.stringify({
      type: 'verdict',
      level: 'YELLOW',
      reason: '腹泻两天，建议就诊',
      actions: ['记录排便频率', '就诊时可要求便检'],
      urgent_note: '',
    })
    const result = parseModelReply(raw)
    assert.strictEqual(result.type, 'verdict')
    assert.strictEqual(result.level, 'YELLOW')
    assert.strictEqual(result.actions.length, 2)
  })

  // 4. valid RED verdict
  it('parses valid RED verdict', () => {
    const raw = JSON.stringify({
      type: 'verdict',
      level: 'RED',
      reason: '公猫尿闭，需要立即处理',
      actions: ['立即前往最近的宠物医院'],
      urgent_note: '尿道阻塞可在24-48小时内导致肾衰竭',
    })
    const result = parseModelReply(raw)
    assert.strictEqual(result.type, 'verdict')
    assert.strictEqual(result.level, 'RED')
    assert.strictEqual(result.urgent_note, '尿道阻塞可在24-48小时内导致肾衰竭')
  })

  // 5. invalid JSON throws INVALID_MODEL_OUTPUT
  it('throws INVALID_MODEL_OUTPUT for invalid JSON', () => {
    assert.throws(() => parseModelReply('not json at all'), (e) =>
      e.message.startsWith('INVALID_MODEL_OUTPUT'),
    )
  })

  // 6. unknown type
  it('throws for unknown type', () => {
    const raw = JSON.stringify({ type: 'greeting', text: 'hello' })
    assert.throws(() => parseModelReply(raw), (e) =>
      e.message.startsWith('INVALID_MODEL_OUTPUT'),
    )
  })

  // 7. unknown level URGENT
  it('throws for unknown level URGENT', () => {
    const raw = JSON.stringify({
      type: 'verdict',
      level: 'URGENT',
      reason: 'test',
      actions: ['do something'],
      urgent_note: '',
    })
    assert.throws(() => parseModelReply(raw), (e) =>
      e.message.startsWith('INVALID_MODEL_OUTPUT'),
    )
  })

  // 8. empty actions array
  it('throws for empty actions array', () => {
    const raw = JSON.stringify({
      type: 'verdict',
      level: 'YELLOW',
      reason: 'test',
      actions: [],
      urgent_note: '',
    })
    assert.throws(() => parseModelReply(raw), (e) =>
      e.message.startsWith('INVALID_MODEL_OUTPUT'),
    )
  })

  // 9. actions not an array
  it('throws when actions is not an array', () => {
    const raw = JSON.stringify({
      type: 'verdict',
      level: 'YELLOW',
      reason: 'test',
      actions: 'do something',
      urgent_note: '',
    })
    assert.throws(() => parseModelReply(raw), (e) =>
      e.message.startsWith('INVALID_MODEL_OUTPUT'),
    )
  })

  // 10. empty reason
  it('throws for empty reason', () => {
    const raw = JSON.stringify({
      type: 'verdict',
      level: 'YELLOW',
      reason: '',
      actions: ['do something'],
      urgent_note: '',
    })
    assert.throws(() => parseModelReply(raw), (e) =>
      e.message.startsWith('INVALID_MODEL_OUTPUT'),
    )
  })

  // 11. question.text is empty
  it('throws for empty question.text', () => {
    const raw = JSON.stringify({ type: 'question', text: '' })
    assert.throws(() => parseModelReply(raw), (e) =>
      e.message.startsWith('INVALID_MODEL_OUTPUT'),
    )
  })

  // 12. RED missing urgent_note
  it('throws for RED verdict missing urgent_note', () => {
    const raw = JSON.stringify({
      type: 'verdict',
      level: 'RED',
      reason: 'emergency',
      actions: ['go now'],
    })
    assert.throws(() => parseModelReply(raw), (e) =>
      e.message.startsWith('INVALID_MODEL_OUTPUT'),
    )
  })

  // 13. RED urgent_note is empty
  it('throws for RED verdict with empty urgent_note', () => {
    const raw = JSON.stringify({
      type: 'verdict',
      level: 'RED',
      reason: 'emergency',
      actions: ['go now'],
      urgent_note: '',
    })
    assert.throws(() => parseModelReply(raw), (e) =>
      e.message.startsWith('INVALID_MODEL_OUTPUT'),
    )
  })

  // 14. GREEN urgent_note can be empty
  it('allows GREEN verdict with empty urgent_note', () => {
    const raw = JSON.stringify({
      type: 'verdict',
      level: 'GREEN',
      reason: 'just a hairball',
      actions: ['monitor'],
      urgent_note: '',
    })
    const result = parseModelReply(raw)
    assert.strictEqual(result.type, 'verdict')
    assert.strictEqual(result.level, 'GREEN')
  })

  // 15. YELLOW urgent_note can be empty
  it('allows YELLOW verdict with empty urgent_note', () => {
    const raw = JSON.stringify({
      type: 'verdict',
      level: 'YELLOW',
      reason: 'mild symptoms',
      actions: ['visit vet this week'],
      urgent_note: '',
    })
    const result = parseModelReply(raw)
    assert.strictEqual(result.type, 'verdict')
    assert.strictEqual(result.level, 'YELLOW')
  })
})
