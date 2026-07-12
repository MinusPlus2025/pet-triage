import { LEVELS, DISCLAIMER } from '../constants'

// YELLOW: the "就诊时可要求的检查方向" action is rendered in its own
// "带着这张清单去医院" sub-block. The model returns a flat actions array,
// so we detect the checklist items by keyword. (§3.4)
const CHECKLIST_HINTS = ['检查', '可要求', '便检', '刮片', '化验', '拍片', '就诊时']

function splitYellowActions(actions = []) {
  const checklist = []
  const rest = []
  for (const a of actions) {
    if (CHECKLIST_HINTS.some((h) => a.includes(h))) checklist.push(a)
    else rest.push(a)
  }
  return { checklist, rest }
}

// §3.4 — jump to the phone's map app searching "宠物医院" via URL scheme.
// No map API. Desktop falls back to the Google Maps search URL.
function openNearbyHospital() {
  const q = encodeURIComponent('宠物医院')
  const ua = navigator.userAgent
  let url
  if (/iPhone|iPad|iPod|Macintosh/.test(ua)) url = `maps://?q=${q}`
  else if (/Android/.test(ua)) url = `geo:0,0?q=${q}`
  else url = `https://www.google.com/maps/search/?api=1&query=${q}`
  window.location.href = url
}

function ActionList({ items }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((a, i) => (
        <li
          key={i}
          className="flex gap-2 text-sm leading-relaxed text-[var(--color-ink)]"
        >
          <span className="text-[var(--color-ink-faint)]">·</span>
          <span>{a}</span>
        </li>
      ))}
    </ul>
  )
}

export default function VerdictCard({ verdict }) {
  // Unknown level falls back to YELLOW rendering. (§4.3)
  const level = LEVELS[verdict.level] ? verdict.level : 'YELLOW'
  const cfg = LEVELS[level]
  const color = cfg.color

  const isYellow = level === 'YELLOW'
  const isGreen = level === 'GREEN'
  const isRed = level === 'RED'

  const { checklist, rest } = isYellow
    ? splitYellowActions(verdict.actions)
    : { checklist: [], rest: verdict.actions || [] }

  return (
    <section
      className="overflow-hidden rounded-[10px]"
      style={{ backgroundColor: cfg.bg, border: `1.5px solid ${cfg.border}` }}
    >
      {/* title */}
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-xl font-light" style={{ color }}>
          {cfg.title}
        </h2>
      </div>

      <div className="flex flex-col gap-6 px-5 pb-5">
        {/* reason */}
        {verdict.reason && (
          <p className="text-sm leading-relaxed text-[var(--color-ink)]">
            {verdict.reason}
          </p>
        )}

        {/* actions */}
        {rest.length > 0 && <ActionList items={rest} />}

        {/* YELLOW: 带着这张清单去医院 */}
        {isYellow && checklist.length > 0 && (
          <div
            className="border-l-2 pl-3"
            style={{ borderColor: color }}
          >
            <p className="mb-1.5 text-xs font-medium" style={{ color }}>
              {cfg.checklistLabel}
            </p>
            <ActionList items={checklist} />
          </div>
        )}

        {/* RED: 为什么不能等 + urgent_note */}
        {isRed && verdict.urgent_note && (
          <div>
            <p className="mb-1 text-xs font-medium" style={{ color }}>
              {cfg.urgentLabel}
            </p>
            <p className="text-sm font-bold leading-relaxed text-[var(--color-ink)]">
              {verdict.urgent_note}
            </p>
          </div>
        )}

        {/* RED: jump to nearest hospital */}
        {isRed && (
          <button
            type="button"
            onClick={openNearbyHospital}
            className="w-full rounded-lg py-3 text-sm font-medium text-white"
            style={{ backgroundColor: color }}
          >
            找最近的医院
          </button>
        )}

        {/* GREEN: fixed footnote */}
        {isGreen && (
          <p className="text-xs text-[var(--color-ink-faint)]">{cfg.footnote}</p>
        )}
      </div>

      {/* disclaimer — always shown */}
      <div className="border-t-[0.5px] border-[var(--color-border)] px-5 py-3">
        <p className="text-xs leading-relaxed text-[var(--color-ink-faint)]">
          {DISCLAIMER}
        </p>
      </div>
    </section>
  )
}
