import ImageUploader from './ImageUploader'
import { SPECIES, AGES, EXAMPLES, INPUT_PLACEHOLDER } from '../constants'

function ChoiceGroup({ label, options, value, onChange }) {
  return (
    <div>
      <span className="mb-2 block text-xs text-[var(--color-ink-faint)]">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt.id === value
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`rounded-[20px] border px-4 py-1.5 text-sm transition-colors ${
                active
                  ? 'border-[var(--color-primary)] bg-[var(--color-surface-2)] text-[var(--color-primary)]'
                  : 'border-[var(--color-border-pill)] bg-[var(--color-surface)] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function InputArea({
  images,
  setImages,
  text,
  setText,
  species,
  setSpecies,
  age,
  setAge,
  onSubmit,
  onExample,
  disabled,
}) {
  return (
    <section className="flex flex-col gap-5">
      <ImageUploader images={images} onChange={setImages} />

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          // Enter sends; Shift+Enter is a newline. Ignore Enter while an IME
          // is composing (e.g. selecting Chinese candidates).
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            if (!disabled) onSubmit()
          }
        }}
        placeholder={INPUT_PLACEHOLDER}
        rows={3}
        className="w-full resize-none rounded-[10px] border-[0.5px] border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-primary)] focus:outline-none"
      />

      <div className="flex flex-col gap-4">
        <ChoiceGroup
          label="谁不舒服？"
          options={SPECIES}
          value={species}
          onChange={setSpecies}
        />
        <ChoiceGroup label="几岁了？" options={AGES} value={age} onChange={setAge} />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className="w-full rounded-lg bg-[var(--color-primary)] py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        帮我判断
      </button>

      <div>
        <span className="mb-2 block text-xs text-[var(--color-ink-faint)]">
          试试示例
        </span>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => onExample(ex)}
              className="rounded-[20px] border border-[var(--color-border-pill)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
