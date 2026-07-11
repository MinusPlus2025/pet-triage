// Message bubbles. Model on the left, user on the right. (§3.3)
export default function ChatArea({ messages }) {
  if (!messages.length) return null

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
    </section>
  )
}
