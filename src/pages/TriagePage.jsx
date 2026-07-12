import { useEffect, useRef, useState } from 'react'
import TopBar from '../components/TopBar'
import InputArea from '../components/InputArea'
import ChatArea from '../components/ChatArea'
import VerdictCard from '../components/VerdictCard'
import { buildUserContent, sendTurn, FORCE_CONCLUDE } from '../chat'

// Surface the failure type as a user-facing message.
function errorText(err) {
  const msg = String(err?.message || err)
  if (msg.startsWith('MISSING_KEY')) return '没读到 API Key，请检查 .env 配置'
  if (msg.startsWith('BAD_KEY')) return 'API Key 无效，请检查 .env 里的 key'
  if (msg.startsWith('RATE_LIMIT')) return '请求太频繁了，稍等一下再试'
  if (msg.startsWith('NETWORK')) return '网络连接不上，检查一下网络再试'
  if (msg.startsWith('INVALID_MODEL_OUTPUT'))
    return '这次结果格式异常，未生成分诊结论。请重新描述，紧急情况直接联系宠物医院。'
  return '判断出错，请重新描述'
}

export default function TriagePage() {
  const [images, setImages] = useState([])
  const [text, setText] = useState('')
  const [species, setSpecies] = useState('cat')
  const [age, setAge] = useState('adult')

  const [messages, setMessages] = useState([]) // display bubbles
  const [verdict, setVerdict] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Full conversation (contents), including the model's raw JSON replies.
  const historyRef = useRef([])
  // Anchor for auto-scrolling to the newest bubble / verdict.
  const bottomRef = useRef(null)

  // Keep the latest message or verdict in view as the conversation grows.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading, verdict, error])

  // Clear everything and go back to a blank input.
  function handleReset() {
    historyRef.current = []
    setMessages([])
    setVerdict(null)
    setError(null)
    setImages([])
    setText('')
  }

  // Clicking an example clears the current conversation, then fills
  // the case text and options.
  function handleExample(ex) {
    historyRef.current = []
    setMessages([])
    setVerdict(null)
    setError(null)
    setImages([])
    setSpecies(ex.species)
    setAge(ex.age)
    setText(ex.text)
  }

  async function handleSubmit() {
    if (loading) return
    const userText = text.trim()
    const userImages = images
    if (!userText && userImages.length === 0) return

    // Clear old verdict before every new submission.
    setVerdict(null)

    // Reflect the user's turn in the chat, then clear the inputs.
    setMessages((prev) => [...prev, { role: 'user', text: userText, images: userImages }])
    setText('')
    setImages([])
    setError(null)
    setLoading(true)

    const prevHistory = historyRef.current
    const isFirst = prevHistory.length === 0
    const userContent = buildUserContent({
      text: userText,
      images: userImages,
      species,
      age,
      includeMeta: isFirst,
    })
    historyRef.current = [...prevHistory, userContent]

    // Hard safeguard: once the model has sent 3 messages, force a conclusion.
    const modelCount = historyRef.current.filter((c) => c.role === 'model').length
    const contents =
      modelCount >= 3 ? [...historyRef.current, FORCE_CONCLUDE] : historyRef.current

    try {
      const { parsed, raw } = await sendTurn(contents)
      historyRef.current = [...historyRef.current, { role: 'model', text: raw, images: [] }]

      if (parsed.type === 'verdict') {
        setVerdict(parsed)
      } else if (parsed.type === 'question') {
        setMessages((prev) => [...prev, { role: 'model', text: parsed.text }])
      } else {
        throw new Error('unexpected shape')
      }
    } catch (err) {
      // Roll back this turn so the next submit is a clean user turn.
      historyRef.current = prevHistory
      setError(errorText(err))
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = text.trim().length > 0 || images.length > 0

  return (
    <>
      <TopBar />

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
        disabled={!canSubmit || loading}
      />

      {(messages.length > 0 || loading || verdict || error) && (
        <div className="mt-8 flex flex-col gap-6">
          <ChatArea messages={messages} loading={loading} />
          {error && <p className="text-sm text-[var(--color-red)]">{error}</p>}
          {verdict && <VerdictCard verdict={verdict} />}
          {verdict && (
            <button
              type="button"
              onClick={handleReset}
              className="self-center text-sm text-[var(--color-ink-dim)] underline underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
            >
              重新开始
            </button>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </>
  )
}
