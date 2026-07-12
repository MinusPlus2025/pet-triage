import { PawMark, PetDuo } from './icons'

export default function TopBar() {
  return (
    <header className="pt-8 pb-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[var(--color-ink-faint)]">
            <PawMark className="text-[var(--color-primary)]" size={15} />
            <span className="text-[11px] uppercase tracking-[0.2em]">
              Pet Triage
            </span>
          </div>
          <h1 className="text-[27px] font-medium leading-none tracking-wide text-[var(--color-primary)]">
            毛孩急诊官
          </h1>
        </div>
        <PetDuo className="-mb-1 shrink-0" width={116} height={80} />
      </div>
      <p className="mt-3.5 text-sm leading-relaxed text-[var(--color-ink-dim)]">
        毛孩子不对劲？拍张照，30秒告诉你要不要去医院
      </p>
    </header>
  )
}
