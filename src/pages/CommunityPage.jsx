import { useState } from 'react'
import { COMMUNITY, levelOf } from '../data/demo'

function LevelBadge({ points }) {
  const l = levelOf(points)
  return (
    <span
      className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
      style={{ backgroundColor: `${l.color}22`, color: l.color }}
    >
      {l.name}
    </span>
  )
}

function ExperienceCard({ item }) {
  const [helpful, setHelpful] = useState(item.helpful)
  const [liked, setLiked] = useState(false)

  function toggle() {
    setHelpful((h) => h + (liked ? -1 : 1))
    setLiked((v) => !v)
  }

  return (
    <div className="rounded-[10px] border-[0.5px] border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-md bg-[var(--color-surface-2)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
          {item.tag}
        </span>
      </div>
      <div className="mb-2 flex items-center gap-1.5 text-xs text-[var(--color-ink-dim)]">
        <span className="font-medium text-[var(--color-ink)]">{item.nick}</span>
        <LevelBadge points={item.points} />
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-ink)]">{item.body}</p>
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={toggle}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
            liked
              ? 'border-[var(--color-green)] bg-[var(--color-green)]/10 text-[var(--color-green)]'
              : 'border-[var(--color-border-pill)] text-[var(--color-ink-dim)]'
          }`}
        >
          <span>👍</span>
          <span>{helpful} 人觉得有帮助</span>
        </button>
        <span className="text-xs font-medium text-[var(--color-yellow)]">
          为 TA 赚得 +{item.earned.toLocaleString()} 分
        </span>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  return (
    <div className="pt-8">
      <h2 className="mb-1 text-xl font-medium text-[var(--color-primary)]">经验广场</h2>
      <p className="mb-4 text-sm text-[var(--color-ink-dim)]">
        一半来自兽医指南，一半来自真实铲屎官
      </p>

      {/* 说说你家的经历（纯展示，+50 分） */}
      <button
        type="button"
        className="mb-5 flex w-full items-center justify-between rounded-[10px] border-[0.5px] border-dashed border-[var(--color-primary)]/40 bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-primary)]"
      >
        <span>说说你家的经历，帮到下一个焦虑的人</span>
        <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-xs text-white">
          +50 分
        </span>
      </button>

      <div className="flex flex-col gap-3">
        {COMMUNITY.map((item, i) => (
          <ExperienceCard key={i} item={item} />
        ))}
      </div>
    </div>
  )
}
