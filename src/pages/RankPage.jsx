import { RANKING, CURRENT_USER, levelOf } from '../data/demo'

const MEDALS = ['#E0A33E', '#B8C0C8', '#C88B5A'] // 金银铜

function RankRow({ rank, item }) {
  const l = levelOf(item.points)
  const top = rank <= 3
  return (
    <div
      className={`flex items-center gap-3 rounded-[10px] border-[0.5px] p-3 ${
        top ? 'border-[var(--color-border)] bg-[var(--color-surface)]' : 'border-transparent'
      }`}
    >
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold"
        style={
          top
            ? { backgroundColor: MEDALS[rank - 1], color: '#fff' }
            : { color: 'var(--color-ink-faint)' }
        }
      >
        {rank}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-[var(--color-ink)]">{item.nick}</span>
          <span
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
            style={{ backgroundColor: `${l.color}22`, color: l.color }}
          >
            {l.name}
          </span>
        </div>
        <div className="mt-0.5 text-xs text-[var(--color-ink-dim)]">
          {item.contributed} 条经验 · 被认可 {item.recognized}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-base font-bold text-[var(--color-primary)]">
          {item.points.toLocaleString()}
        </div>
        <div className="text-[10px] text-[var(--color-ink-faint)]">总贡献值</div>
      </div>
    </div>
  )
}

export default function RankPage() {
  return (
    <div className="pt-8">
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="text-xl font-medium text-[var(--color-primary)]">贡献榜</h2>
        <span className="text-xs text-[var(--color-ink-dim)]">
          你排在第 <span className="font-semibold text-[var(--color-primary)]">{CURRENT_USER.rank}</span> 位
        </span>
      </div>
      <p className="mb-5 text-sm text-[var(--color-ink-dim)]">
        你的经验会经过审核后进入知识库，帮到下一个焦虑的人
      </p>

      <div className="flex flex-col gap-1.5">
        {RANKING.map((item, i) => (
          <RankRow key={i} rank={i + 1} item={item} />
        ))}
      </div>
    </div>
  )
}
