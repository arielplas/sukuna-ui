// Inline SVG icons for VideoPlayer. Decorative only (aria-hidden); every button carries its own
// accessible name. No icon dependency, same approach as Carousel's chevrons. Server-safe.
import type { ReactNode } from 'react'

const Stroke = ({ children, width = 2 }: { children: ReactNode; width?: number }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
)

const Fill = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    {children}
  </svg>
)

export const PlayIcon = () => (
  <Fill>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
  </Fill>
)

export const PauseIcon = () => (
  <Fill>
    <rect x="6" y="5" width="4" height="14" rx="1.2" />
    <rect x="14" y="5" width="4" height="14" rx="1.2" />
  </Fill>
)

export const ReplayIcon = () => (
  <Stroke>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </Stroke>
)

/** Circular arrow with the skip amount printed inside. `dir` -1 = back, 1 = forward. */
export const SkipIcon = ({ dir, seconds }: { dir: -1 | 1; seconds: number }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {dir < 0 ? (
        <>
          <path d="M4 12a8 8 0 1 0 2.4-5.7" />
          <path d="M4 4v4h4" />
        </>
      ) : (
        <>
          <path d="M20 12a8 8 0 1 1-2.4-5.7" />
          <path d="M20 4v4h-4" />
        </>
      )}
    </g>
    <text x="12" y="15.2" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="currentColor">
      {seconds}
    </text>
  </svg>
)

export const VolumeIcon = ({ level }: { level: 'mute' | 'low' | 'high' }) => (
  <Stroke>
    <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" />
    {level === 'mute' ? (
      <>
        <path d="m22 9-6 6" />
        <path d="m16 9 6 6" />
      </>
    ) : (
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    )}
    {level === 'high' ? <path d="M18.5 5.5a9 9 0 0 1 0 13" /> : null}
  </Stroke>
)

export const CaptionsIcon = () => (
  <Stroke>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M10 10.2a2 2 0 1 0 0 3.6" />
    <path d="M17 10.2a2 2 0 1 0 0 3.6" />
  </Stroke>
)

export const GearIcon = () => (
  <Stroke width={1.8}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </Stroke>
)

export const PipIcon = () => (
  <Stroke>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <rect x="12" y="11" width="7" height="6" rx="1" fill="currentColor" />
  </Stroke>
)

export const AirPlayIcon = () => (
  <Stroke>
    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
    <path d="m12 15 5 6H7z" fill="currentColor" />
  </Stroke>
)

export const FullscreenIcon = ({ exit }: { exit: boolean }) =>
  exit ? (
    <Stroke>
      <path d="M9 4v4a1 1 0 0 1-1 1H4" />
      <path d="M20 9h-4a1 1 0 0 1-1-1V4" />
      <path d="M15 20v-4a1 1 0 0 1 1-1h4" />
      <path d="M4 15h4a1 1 0 0 1 1 1v4" />
    </Stroke>
  ) : (
    <Stroke>
      <path d="M4 9V5a1 1 0 0 1 1-1h4" />
      <path d="M15 4h4a1 1 0 0 1 1 1v4" />
      <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
      <path d="M9 20H5a1 1 0 0 1-1-1v-4" />
    </Stroke>
  )

export const CheckIcon = () => (
  <Stroke width={3}>
    <path d="m5 12 5 5 9-10" />
  </Stroke>
)

export const ChevronIcon = ({ dir }: { dir: 'left' | 'right' }) => (
  <Stroke>{dir === 'left' ? <path d="m15 6-6 6 6 6" /> : <path d="m9 6 6 6-6 6" />}</Stroke>
)

export const CloseIcon = () => (
  <Stroke>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Stroke>
)

export const QualityIcon = () => (
  <Stroke>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 15V9" />
    <path d="M11 15V9" />
    <path d="M7 12h4" />
    <path d="M14 9h2a3 3 0 0 1 0 6h-2z" />
  </Stroke>
)

export const SpeedIcon = () => (
  <Stroke>
    <path d="M12 14l4-4" />
    <path d="M3.3 19a10 10 0 1 1 17.4 0" />
  </Stroke>
)

export const TypeIcon = () => (
  <Stroke>
    <path d="M4 7V5h16v2" />
    <path d="M9 19h6" />
    <path d="M12 5v14" />
  </Stroke>
)

export const LinkIcon = () => (
  <Stroke>
    <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
    <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
  </Stroke>
)

export const KeyboardIcon = () => (
  <Stroke>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" />
  </Stroke>
)

export const AlertIcon = () => (
  <Stroke>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5" />
    <path d="M12 16.2v.1" />
  </Stroke>
)

export const PrevIcon = () => (
  <Fill>
    <path d="M17 6.2v11.6a.8.8 0 0 1-1.25.66L8 13v5a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5l7.75-5.46A.8.8 0 0 1 17 6.2Z" />
  </Fill>
)

export const NextIcon = () => (
  <Fill>
    <path d="M7 6.2v11.6a.8.8 0 0 0 1.25.66L16 13v5a1 1 0 0 0 2 0V6a1 1 0 0 0-2 0v5L8.25 5.54A.8.8 0 0 0 7 6.2Z" />
  </Fill>
)

export const ListIcon = () => (
  <Stroke>
    <path d="M8 6h13" />
    <path d="M8 12h13" />
    <path d="M8 18h9" />
    <path d="M3.5 6h.01" />
    <path d="M3.5 12h.01" />
    <path d="M3.5 18h.01" />
  </Stroke>
)

export const TheaterIcon = () => (
  <Stroke>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
  </Stroke>
)

export const ShareIcon = () => (
  <Stroke>
    <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
    <path d="m16 6-4-4-4 4" />
    <path d="M12 2v13" />
  </Stroke>
)

export const SunIcon = () => (
  <Stroke>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Stroke>
)

export const MoonIcon = () => (
  <Stroke>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </Stroke>
)

export const LoopIcon = () => (
  <Stroke>
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11V9a3 3 0 0 1 3-3h15" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v2a3 3 0 0 1-3 3H3" />
  </Stroke>
)

export const CameraIcon = () => (
  <Stroke>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
    <circle cx="12" cy="13" r="3" />
  </Stroke>
)

export const DownloadIcon = () => (
  <Stroke>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5" />
    <path d="M12 15V3" />
  </Stroke>
)
