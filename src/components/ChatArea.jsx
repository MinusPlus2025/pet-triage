import { LOADING_TEXT } from '../constants'

// Message bubbles. Model on the left, user on the right. (§3.3)
export default function ChatArea({ messages, loading }) {
  if (!messages.length && !loading) return null

  return (
    <section className="flex flex-col gap-3">
      {messages.map((m, i) => {
        const isUser = m.role === 'user'
        return (
          <div
            key={i}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                isUser
                  ? 'rounded-br-sm bg-[var(--color-surface-2)] text-[var(--color-ink)]'
                  : 'rounded-bl-sm bg-[var(--color-surface)] text-[var(--color-ink)]'
              }`}
            >
              {m.images?.length > 0 && (
                <div className="mb-2 flex gap-1.5">
                  {m.images.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt=""
                      className="h-14 w-14 rounded-md object-cover"
                    />
                  ))}
                </div>
              )}
              {m.text && <p className="whitespace-pre-wrap">{m.text}</p>}
            </div>
          </div>
        )
      })}

      {loading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink-dim)]">
            {LOADING_TEXT}
          </div>
        </div>
      )}
    </section>
  )
}
