import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconHome(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  )
}

export function IconBuilding(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
      <path d="M10 21v-3h4v3" />
    </svg>
  )
}

export function IconFloors(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Z" />
      <path d="m3 12.5 9 4.5 9-4.5" />
      <path d="m3 17 9 4.5 9-4.5" />
    </svg>
  )
}

export function IconList(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconImages(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="5" width="14" height="12" rx="1.5" />
      <path d="m3 14 4-3.5 3.5 3 3-2.5L17 14" />
      <circle cx="8" cy="9" r="1.2" />
      <path d="M17 9h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8" />
    </svg>
  )
}

export function IconStar(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3.5 14.3 8.6l5.7.7-4.2 3.9 1.1 5.6L12 16l-4.9 2.8 1.1-5.6L4 9.3l5.7-.7L12 3.5Z" />
    </svg>
  )
}

export function IconRotate360(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v4.5h-4.5" />
      <ellipse cx="12" cy="12" rx="8" ry="3.4" />
    </svg>
  )
}

export function IconVideo(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m16 10.5 5-2.5v8l-5-2.5" />
    </svg>
  )
}

export function IconMapPin(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 21s-6.5-5.3-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.7 12 21 12 21Z" />
      <circle cx="12" cy="10.8" r="2.4" />
    </svg>
  )
}

export function IconPhone(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M6.5 3.5h3l1.5 4-2 1.4a12.5 12.5 0 0 0 6.1 6.1l1.4-2 4 1.5v3A2.5 2.5 0 0 1 18 20 14.5 14.5 0 0 1 4 6a2.5 2.5 0 0 1 2.5-2.5Z" />
    </svg>
  )
}

export function IconCalculator(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M15.5 15v3.5M8.5 18.5h3.5" />
    </svg>
  )
}

export function IconDownload(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 4v11" />
      <path d="m7.5 11.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </svg>
  )
}

export function IconClose(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function IconMenu(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M5 7h14M5 12h14M5 17h14" />
    </svg>
  )
}

export function IconChevronLeft(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
    </svg>
  )
}

export function IconChevronRight(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </svg>
  )
}

export function IconCheck(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}

export function IconCopy(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  )
}

export function IconShare(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="17.5" cy="5.5" r="2.5" />
      <circle cx="6.5" cy="12" r="2.5" />
      <circle cx="17.5" cy="18.5" r="2.5" />
      <path d="m8.7 10.8 6.6-4M8.7 13.2l6.6 4" />
    </svg>
  )
}

export function IconExpand(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
    </svg>
  )
}

export function IconQuote(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M8 11H4.5A1.5 1.5 0 0 1 3 9.5V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6a5 5 0 0 1-5 5" />
      <path d="M20 11h-3.5A1.5 1.5 0 0 1 15 9.5V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6a5 5 0 0 1-5 5" />
    </svg>
  )
}

export function IconExternal(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </svg>
  )
}
