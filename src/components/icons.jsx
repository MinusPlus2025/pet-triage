// 柔和插画风图标与配图 —— 内联 SVG。
// 单色图标用 currentColor 跟随配色；多色插画用配色令牌硬值（藏青/燕麦/奶白）。
// 不用在红色结论卡（§3.3 红卡不放任何插画和装饰）。

const NAVY = '#1A2B49'
const CREAM = '#FFFFFF'
const OAT = '#ECE9E2'
const CORAL = '#E7A98C' // 柔和暖色点缀（鼻头/舌）

// 品牌爪印（填充，猫狗通用）
export function PawMark({ size = 26, className = '' }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <g fill="currentColor">
        <ellipse cx="16" cy="21" rx="6.5" ry="5.2" />
        <ellipse cx="8.5" cy="14.5" rx="2.6" ry="3.4" />
        <ellipse cx="23.5" cy="14.5" rx="2.6" ry="3.4" />
        <ellipse cx="13" cy="10.5" rx="2.3" ry="3" />
        <ellipse cx="19" cy="10.5" rx="2.3" ry="3" />
      </g>
    </svg>
  )
}

// 猫脸（柔和填充剪影，胶囊里用）
export function CatFace({ size = 18, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="currentColor">
      <path d="M4 6.4c0-1 1.1-1.3 1.7-.5L8.3 9c1.1-.5 2.4-.8 3.7-.8s2.6.3 3.7.8l2.6-3.1c.6-.8 1.7-.5 1.7.5V12c0 4.4-3.6 7.6-8 7.6S4 16.4 4 12z" />
    </svg>
  )
}

// 狗脸（柔和填充剪影，垂耳）
export function DogFace({ size = 18, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 4.6c-3.4 0-6 2.1-6.5 5C4 9.5 2.9 11 3.3 12.8c.4 1.6 1.8 2.5 3.3 2.2C7.6 17.6 9.6 19.4 12 19.4s4.4-1.8 5.4-4.4c1.5.3 2.9-.6 3.3-2.2.4-1.8-.7-3.3-2.2-3.2-.5-2.9-3.1-5-6.5-5z" />
    </svg>
  )
}

// 相机（上传区）
export function CameraGlyph({ size = 26, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8.5C4 7.7 4.7 7 5.5 7H8l1-1.8c.2-.4.6-.7 1-.7h4c.4 0 .8.3 1 .7L16 7h2.5c.8 0 1.5.7 1.5 1.5V17c0 .8-.7 1.5-1.5 1.5h-13C4.7 18.5 4 17.8 4 17z" />
      <circle cx="12" cy="12.5" r="3.2" />
    </svg>
  )
}

// 头部主配图：一猫一狗并排而坐（柔和填充插画）
export function PetDuo({ className = '', width = 132, height = 92 }) {
  return (
    <svg viewBox="0 0 132 92" width={width} height={height} className={className} aria-hidden="true">
      {/* 地面柔影 */}
      <ellipse cx="66" cy="84" rx="56" ry="6" fill={OAT} />

      {/* 狗（左） */}
      <g>
        <path d="M32 82c-4 0-6-3-5-8 1-6 3-14 3-14 6-3 16-3 22 0 0 0 2 8 3 14 1 5-1 8-5 8z" fill={NAVY} />
        <circle cx="42" cy="44" r="15" fill={NAVY} />
        <ellipse cx="27" cy="46" rx="5.5" ry="10" fill={NAVY} transform="rotate(14 27 46)" />
        <ellipse cx="57" cy="46" rx="5.5" ry="10" fill={NAVY} transform="rotate(-14 57 46)" />
        <ellipse cx="42" cy="49" rx="8" ry="6.5" fill={CREAM} />
        <ellipse cx="42" cy="45" rx="2.4" ry="1.9" fill={CORAL} />
        <circle cx="36" cy="41" r="2.4" fill={CREAM} />
        <circle cx="48" cy="41" r="2.4" fill={CREAM} />
        <circle cx="36.4" cy="41.3" r="1.1" fill={NAVY} />
        <circle cx="47.6" cy="41.3" r="1.1" fill={NAVY} />
        <path d="M42 47.5v3c0 1.4-1.6 1.8-2.4.8M42 50.5c0 1.4 1.6 1.8 2.4.8" fill="none" stroke={NAVY} strokeWidth="1.1" strokeLinecap="round" />
      </g>

      {/* 猫（右） */}
      <g>
        <path d="M92 82c-3.5 0-5.5-3-4.6-7.6 1-5.4 2.6-12.4 2.6-12.4 5.4-3 14.4-3 20 0 0 0 1.6 7 2.6 12.4.9 4.6-1.1 7.6-4.6 7.6z" fill={NAVY} />
        <circle cx="100" cy="47" r="13.5" fill={NAVY} />
        <path d="M89 40l-1.5-11 9 6.5z" fill={NAVY} />
        <path d="M111 40l1.5-11-9 6.5z" fill={NAVY} />
        <ellipse cx="100" cy="52" rx="6.5" ry="5" fill={CREAM} />
        <path d="M100 49l-2.2 2.4h4.4z" fill={CORAL} />
        <circle cx="95" cy="45" r="2.1" fill={CREAM} />
        <circle cx="105" cy="45" r="2.1" fill={CREAM} />
        <circle cx="95" cy="45.3" r="1" fill={NAVY} />
        <circle cx="105" cy="45.3" r="1" fill={NAVY} />
        <path d="M89 52l-8-1.5M89 54l-8 1M111 52l8-1.5M111 54l8 1" fill="none" stroke={CREAM} strokeWidth="1" strokeLinecap="round" />
        {/* 尾巴 */}
        <path d="M110 78c8 1 12-4 11-11" fill="none" stroke={NAVY} strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  )
}

// ---- 底部导航图标（线性，跟随 currentColor）----
const nav = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}
function NavSvg({ children }) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true" {...nav}>
      {children}
    </svg>
  )
}
export const NavTriage = () => (
  <NavSvg>
    <path d="M6 4v5a4 4 0 0 0 8 0V4" />
    <path d="M4 4h4M12 4h4" />
    <path d="M10 17a4 4 0 0 0 8 0v-2" />
    <circle cx="18" cy="13" r="2" />
  </NavSvg>
)
export const NavCommunity = () => (
  <NavSvg>
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H9l-4 3.5V6.5z" />
    <path d="M8.5 9h7M8.5 12h4" />
  </NavSvg>
)
export const NavRank = () => (
  <NavSvg>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" />
    <path d="M7 6H4.5v1A2.5 2.5 0 0 0 7 9.5M17 6h2.5v1A2.5 2.5 0 0 1 17 9.5" />
    <path d="M12 13v3M9 20h6M10 20l.5-4h3l.5 4" />
  </NavSvg>
)
export const NavStore = () => (
  <NavSvg>
    <path d="M5 8h14l-1 11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </NavSvg>
)
export const NavProfile = () => (
  <NavSvg>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
  </NavSvg>
)

// 彩色身份勋章（我的 / 徽章用）。tone = 等级色
export function MedalBadge({ size = 64, tone = '#E0A33E', className = '' }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path d="M22 6h20l-6 20H28z" fill={tone} opacity="0.35" />
      <path d="M20 6l7 22M44 6l-7 22" stroke={tone} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="40" r="17" fill={tone} />
      <circle cx="32" cy="40" r="17" fill="#fff" opacity="0.14" />
      <circle cx="32" cy="40" r="12.5" fill="none" stroke="#fff" strokeWidth="2" opacity="0.85" />
      {/* 爪印 */}
      <g fill="#fff">
        <ellipse cx="32" cy="43.5" rx="4.6" ry="3.7" />
        <ellipse cx="26.5" cy="38.5" rx="1.9" ry="2.5" />
        <ellipse cx="37.5" cy="38.5" rx="1.9" ry="2.5" />
        <ellipse cx="29.5" cy="35.5" rx="1.7" ry="2.2" />
        <ellipse cx="34.5" cy="35.5" rx="1.7" ry="2.2" />
      </g>
    </svg>
  )
}

