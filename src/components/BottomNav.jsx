import { NavTriage, NavCommunity, NavRank, NavStore, NavProfile } from './icons'

// §6.5 底部 Tab 导航，五个
export const TABS = [
  { id: 'triage', label: '判断', Icon: NavTriage },
  { id: 'community', label: '经验广场', Icon: NavCommunity },
  { id: 'rank', label: '贡献榜', Icon: NavRank },
  { id: 'store', label: '备货', Icon: NavStore },
  { id: 'profile', label: '我的', Icon: NavProfile },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-[480px] -translate-x-1/2 border-t-[0.5px] border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
      <div className="flex items-stretch justify-around px-1 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
        {TABS.map(({ id, label, Icon }) => {
          const on = id === active
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] transition-colors ${
                on
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-ink-faint)] hover:text-[var(--color-ink-dim)]'
              }`}
            >
              <Icon />
              <span className={on ? 'font-medium' : ''}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
