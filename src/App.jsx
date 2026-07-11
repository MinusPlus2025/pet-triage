import { useState } from 'react'
import TopBar from './components/TopBar'
import InputArea from './components/InputArea'
import ChatArea from './components/ChatArea'
import VerdictCard from './components/VerdictCard'

// ─── TEMPORARY: layout-review preview ────────────────────────────────
// Mock data so all UI states are visible before Gemini is wired in.
// Remove this block (and the preview strip below) in the API phase.
const PREVIEW_QUESTION = [
  {
    role: 'user',
    text: '公猫，从昨晚开始一直蹲猫砂盆，蹲很久但砂盆里没有尿。',
  },
  { role: 'model', text: '它今天有没有排出任何尿液？叫唤时是不是碰肚子就疼？' },
]
const PREVIEW_VERDICTS = {
  GREEN: {
    level: 'GREEN',
    reason: '呕吐物为管状毛发，吐后精神食欲正常，符合吐毛球表现。',
    actions: [
      '继续正常喂食，观察今日进食与排便是否正常。',
      '可少量喂食化毛膏，帮助毛球排出。',
      '若出现反复干呕、连续两天不进食或精神明显变差，请升级就医。',
    ],
    urgent_note: '',
  },
  YELLOW: {
    level: 'YELLOW',
    reason: '软便持续两天，但精神食欲尚可，需排查肠道问题。',
    actions: [
      '暂时改喂易消化食物，保证饮水。',
      '观察是否出现血便、呕吐或精神变差。',
      '就诊时可要求做便检，排查寄生虫和细菌感染，避免过度用药。',
    ],
    urgent_note: '',
  },
  RED: {
    level: 'RED',
    reason: '公猫频繁进出猫砂盆却排不出尿，高度提示尿道阻塞。',
    actions: [
      '立即准备就医，不要喂水喂食。',
      '用通风航空箱转运，避免挤压腹部。',
      '到院直接告知“排尿困难”，要求优先处理。',
    ],
    urgent_note: '尿道阻塞在 24-48 小时内可致肾衰竭死亡，不能拖到明天。',
  },
}
// ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [images, setImages] = useState([])
  const [text, setText] = useState('')
  const [species, setSpecies] = useState('cat')
  const [age, setAge] = useState('adult')

  const [messages, setMessages] = useState([])
  const [verdict, setVerdict] = useState(null)

  // TEMPORARY: preview switcher state
  const [preview, setPreview] = useState('none')

  function handleExample(ex) {
    setSpecies(ex.species)
    setAge(ex.age)
    setText(ex.text)
  }

  function handleSubmit() {
    // Gemini API not wired yet (layout-review phase).
    // Show the user's message so the chat flow is visible.
    if (!text.trim() && images.length === 0) return
    setMessages((prev) => [...prev, { role: 'user', text, images }])
    setText('')
    setImages([])
  }

  // TEMPORARY: resolve what to show from the preview switcher
  const showMessages = preview === 'question' ? PREVIEW_QUESTION : messages
  const showVerdict =
    preview in PREVIEW_VERDICTS ? PREVIEW_VERDICTS[preview] : verdict

  const canSubmit = text.trim().length > 0 || images.length > 0

  return (
    <div className="mx-auto min-h-full w-full max-w-[480px] px-5 pb-16">
      <TopBar />

      {/* TEMPORARY layout-review strip — remove when wiring Gemini */}
      <div className="mb-6 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-2">
        <span className="mr-2 text-xs text-[var(--color-ink-faint)]">
          布局预览（临时）
        </span>
        {['none', 'question', 'GREEN', 'YELLOW', 'RED'].map((p) => (
          <button
            key={p}
            onClick={() => setPreview(p)}
            className={`mr-1.5 rounded px-2 py-0.5 text-xs ${
              preview === p
                ? 'bg-[var(--color-surface-2)] text-[var(--color-ink)]'
                : 'text-[var(--color-ink-dim)]'
            }`}
          >
            {p === 'none'
              ? '无'
              : p === 'question'
                ? '追问'
                : { GREEN: '绿', YELLOW: '黄', RED: '红' }[p]}
          </button>
        ))}
      </div>

      <InputArea
        images={images}
        setImages={setImages}
        text={text}
        setText={setText}
        species={species}
        setSpecies={setSpecies}
        age={age}
        setAge={setAge}
        onSubmit={handleSubmit}
        onExample={handleExample}
        disabled={!canSubmit}
      />

      {(showMessages.length > 0 || showVerdict) && (
        <div className="mt-8 flex flex-col gap-6">
          <ChatArea messages={showMessages} />
          {showVerdict && <VerdictCard verdict={showVerdict} />}
        </div>
      )}
    </div>
  )
}
