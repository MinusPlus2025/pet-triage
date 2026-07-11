export default function TopBar() {
  return (
    <header className="pt-10 pb-6">
      <div className="flex items-baseline gap-2">
        <h1 className="text-2xl font-light tracking-wide text-[var(--color-ink)]">
          毛孩急诊官
        </h1>
        <span className="text-sm font-light text-[var(--color-ink-faint)]">
          Pet Triage
        </span>
      </div>
      <p className="mt-2 text-sm text-[var(--color-ink-dim)]">
        拍张照，30秒判断要不要去医院
      </p>
    </header>
  )
}
