import { STORE, CURRENT_USER } from '../data/demo'

export default function StorePage() {
  const u = CURRENT_USER
  return (
    <div className="pt-8">
      <h2 className="mb-1 text-xl font-medium text-[var(--color-primary)]">备货</h2>
      <p className="mb-4 text-sm text-[var(--color-ink-dim)]">
        家里常备一点，很多趟医院就省了
      </p>

      {/* 顶部积分条 */}
      <div className="mb-5 flex items-center justify-between rounded-[10px] bg-[var(--color-primary)] px-4 py-3 text-white">
        <span className="text-sm">你有 {u.points.toLocaleString()} 积分可用</span>
        <span className="text-sm font-semibold">最高可抵 {(u.points / 10).toFixed(0)} 元</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STORE.map((item, i) => (
          <div
            key={i}
            className="flex flex-col rounded-[10px] border-[0.5px] border-[var(--color-border)] bg-[var(--color-surface)] p-3"
          >
            <div
              className="mb-2 flex h-20 items-center justify-center rounded-lg text-3xl"
              style={{ backgroundColor: item.tint }}
            >
              {item.emoji}
            </div>
            <div className="text-sm font-medium text-[var(--color-ink)]">{item.name}</div>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-[var(--color-ink-dim)]">
              {item.use}
            </p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-[var(--color-ink)]">¥{item.price}</span>
              <span className="text-xs font-medium text-[var(--color-green)]">
                可抵 {item.points} 分
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
