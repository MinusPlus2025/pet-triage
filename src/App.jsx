import { useRef, useState } from 'react'
import TopBar from './components/TopBar'
import InputArea from './components/InputArea'
import ChatArea from './components/ChatArea'
import VerdictCard from './components/VerdictCard'
import { buildUserContent, sendTurn, FORCE_CONCLUDE } from './gemini'

const ERROR_TEXT = '判断出错，请重新描述'

export default function App() {
  const [images, setImages] = useState([])
  const [text, setText] = useState('')
  const [species, setSpecies] = useState('cat')
  const [age, setAge] = useState('adult')

  const [messages, setMessages] = useState([]) // display bubbles
  const [verdict, setVerdict] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Full Gemini conversation (contents), including the model's raw JSON replies.
  const historyRef = useRef([])

  function handleExample(ex) {
    setSpecies(ex.species)
    setAge(ex.age)
    setText(ex.text)
  }

  async function handleSubmit() {
    if (loading) return
    const userText = text.trim()
    const userImages = images
    if (!userText && userImages.length === 0) return

    // reflect the user's turn in the chat, then clear the inputs
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

    // Hard safeguard: once the model has sent 3 messages, force a conclusion. (req 3)
    const modelCount = historyRef.current.filter((c) => c.role === 'model').length
    const contents =
      modelCount >= 3 ? [...historyRef.current, FORCE_CONCLUDE] : historyRef.current

    try {
      const { parsed, raw } = await sendTurn(contents)
      historyRef.current = [...historyRef.current, { role: 'model', parts: [{ text: raw }] }]

      if (parsed.type === 'verdict' || parsed.level) {
        // Unknown level is handled by VerdictCard (renders as YELLOW). (§4.3)
        setVerdict(parsed)
      } else if (parsed.type === 'question' || parsed.text) {
        setMessages((prev) => [...prev, { role: 'model', text: parsed.text }])
      } else {
        throw new Error('unexpected shape')
      }
    } catch {
      // Roll back this turn so the next submit is a clean user turn.
      historyRef.current = prevHistory
      setError(ERROR_TEXT)
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = text.trim().length > 0 || images.length > 0

  return (
    <div className="mx-auto min-h-full w-full max-w-[480px] px-5 pb-16">
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
        </div>
      )}
    </div>
  )
}
