import { MedalBadge } from '../components/icons'
import { CURRENT_USER, MY_EXPERIENCES, levelOf, nextLevelOf } from '../data/demo'

function Stat({ value, label }) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <span className="text-lg font-semibold text-[var(--color-ink)]">{value}</span>
      <span className="mt-0.5 text-xs text-[var(--color-ink-dim)]">{label}</span>
    </div>
  )
}

export default function ProfilePage({ onNavigate }) {
  const u = CURRENT_USER
  const level = levelOf(u.points)
  const next = nextLevelOf(u.points)
  const gap = next ? next.min - u.points : 0
  const pct = next
    ? Math.min(100, ((u.points - level.min) / (next.min - level.min)) * 100)
    : 100

  return (
    <div className="pt-8">
      <h2 className="mb-5 text-xl font-medium text-[var(--color-primary)]">我的</h2>

      {/* 身份卡 */}
      <section className="rounded-[10px] border-[0.5px] border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex items-center gap-4">
          <MedalBadge size={64} tone={level.color} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-[var(--color-ink)]">{u.nick}</span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: `${level.color}22`, color: level.color }}
              >
                {level.name}
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-[32px] font-bold leading-none text-[var(--color-primary)]">
                {u.points.toLocaleString()}
              </span>
              <span className="text-sm text-[var(--color-ink-dim)]">累计贡献值</span>
            </div>
          </div>
        </div>

        {/* 三个数据 */}
        <div className="mt-5 flex border-y-[0.5px] border-[var(--color-border)] py-4">
          <Stat value={u.contributed} label="贡献经验" />
          <Stat value={u.recognized} label="被认可" />
          <Stat value={u.helped} label="帮助过" />
        </div>

        {/* 进度 */}
        {next && (
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs text-[var(--color-ink-dim)]">
              <span>距「{next.name}」还差 {gap.toLocaleString()} 分</span>
              <span>{u.points.toLocaleString()} / {next.min.toLocaleString()}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: level.color }} />
            </div>
          </div>
        )}

        {/* 积分余额 + 抵扣入口 */}
        <div className="mt-5 flex items-center justify-between rounded-[10px] bg-[var(--color-surface-2)] px-4 py-3">
          <div>
            <div className="text-sm text-[var(--color-ink-dim)]">可用积分</div>
            <div className="text-lg font-semibold text-[var(--color-ink)]">
              {u.points.toLocaleString()}
              <span className="ml-1 text-xs font-normal text-[var(--color-ink-dim)]">
                ≈ 抵 {(u.points / 10).toFixed(0)} 元
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('store')}
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            去备货抵扣
          </button>
        </div>
      </section>

      {/* 我贡献的经验 */}
      <h3 className="mb-3 mt-8 text-sm font-medium text-[var(--color-ink-dim)]">
        我贡献的经验 · {u.contributed} 条
      </h3>
      <div className="flex flex-col gap-3">
        {MY_EXPERIENCES.map((e, i) => (
          <div key={i} className="rounded-[10px] border-[0.5px] border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: `${level.color}18`, color: level.color }}
              >
                {e.tag}
              </span>
              <span className="text-xs text-[var(--color-ink-faint)]">
                {e.recognized} 人认可
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-ink)]">{e.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
