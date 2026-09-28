'use client'

// Internal controls for VideoPlayer: the chapter-segmented seek bar with hover preview, the volume
// slider and the settings menu. Not exported from the package; VideoPlayer composes them.
import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { CheckIcon, ChevronIcon } from './video-player.icons'
import type { VideoPlayerLabels } from './video-player.labels'
import { videoPlayerStyles } from './video-player.styles'
import {
  type Chapter,
  chapterEnd,
  chapterIndexAt,
  clamp,
  cueAt,
  formatTime,
  type ThumbnailCue,
} from './video-player.utils'

const styles = videoPlayerStyles()

/** Fraction (0–1) of `el`'s width at the pointer. 0 when the element has no layout. */
const ratioAt = (el: HTMLElement, clientX: number) => {
  const r = el.getBoundingClientRect()
  return r.width > 0 ? clamp((clientX - r.left) / r.width, 0, 1) : 0
}

const cssUrl = (url: string) => `url("${url.replace(/"/g, '%22')}")`

export interface SeekBarProps {
  current: number
  duration: number
  buffered: number
  chapters: Chapter[]
  thumbnails: ThumbnailCue[]
  labels: VideoPlayerLabels
  onSeek: (time: number) => void
  onDraggingChange: (dragging: boolean) => void
  /** Highlighted A–B loop range, in the same time base as `current`. */
  range?: { start: number; end: number } | null
}

/** Seek slider. Splits into one segment per chapter; hover shows a thumbnail, chapter and time. */
export function SeekBar({
  current,
  duration,
  buffered,
  chapters,
  thumbnails,
  labels,
  onSeek,
  onDraggingChange,
  range,
}: SeekBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<{ time: number; x: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const known = Number.isFinite(duration) && duration > 0
  const total = known ? duration : 0

  const timeAt = (clientX: number) => ratioAt(ref.current as HTMLDivElement, clientX) * total

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current as HTMLDivElement
    const time = timeAt(e.clientX)
    setHover({ time, x: e.clientX - el.getBoundingClientRect().left })
    if (dragging) onSeek(time)
  }
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    ref.current?.setPointerCapture?.(e.pointerId)
    setDragging(true)
    onDraggingChange(true)
    onSeek(timeAt(e.clientX))
  }
  const endDrag = () => {
    if (!dragging) return
    setDragging(false)
    onDraggingChange(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = {
      ArrowRight: 5,
      ArrowUp: 5,
      ArrowLeft: -5,
      ArrowDown: -5,
      PageUp: 30,
      PageDown: -30,
    }
    let next: number | null = null
    if (e.shiftKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) return // chapter jump → root
    if (e.key in step) next = current + (step[e.key] as number)
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = total
    if (next === null) return
    e.preventDefault()
    e.stopPropagation()
    onSeek(clamp(next, 0, total))
  }

  const segments = chapters.length && known ? chapters : [{ start: 0, title: '' }]
  const hot = hover && chapters.length ? chapterIndexAt(chapters, hover.time) : -1
  const chapter = chapters[chapterIndexAt(chapters, current)]
  const thumb = hover ? cueAt(thumbnails, hover.time) : undefined
  const hoverChapter = hover && chapters.length ? chapters[hot]?.title : undefined
  const width = ref.current?.getBoundingClientRect().width ?? 0
  const half = (thumb?.w ?? 160) / 2 + 2

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={labels.seek}
      aria-valuemin={0}
      aria-valuemax={Math.floor(total)}
      aria-valuenow={Math.floor(current)}
      aria-valuetext={labels.seekValue(current, total, chapter?.title)}
      data-dragging={dragging ? '' : undefined}
      className={styles.seek()}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => setHover(null)}
      onKeyDown={onKeyDown}
    >
      <div className={styles.segments()}>
        {segments.map((c, i) => {
          const end = chapterEnd(segments, i, total)
          const span = Math.max(end - c.start, 0)
          const pct = (t: number) => `${span > 0 ? clamp((t - c.start) / span, 0, 1) * 100 : 0}%`
          return (
            <div
              key={c.start}
              data-chapter={i}
              className={styles.segment({ hot: i === hot })}
              style={{ flexGrow: span || 1, flexBasis: 0 }}
            >
              <div className={styles.buffered()} style={{ width: pct(buffered) }} />
              <div className={styles.played()} style={{ width: pct(current) }} />
            </div>
          )
        })}
      </div>
      {range && total > 0 ? (
        <div
          data-loop-range=""
          className={styles.loopRange()}
          style={{
            left: `${(range.start / total) * 100}%`,
            width: `${((range.end - range.start) / total) * 100}%`,
          }}
        />
      ) : null}
      <div
        className={styles.thumb()}
        style={{ left: `${total > 0 ? (current / total) * 100 : 0}%` }}
      />
      {hover ? (
        <div
          className={styles.preview()}
          style={{ left: width > 0 ? clamp(hover.x, half, width - half) : hover.x }}
          aria-hidden="true"
        >
          {hoverChapter ? <div className={styles.previewChapter()}>{hoverChapter}</div> : null}
          {thumb ? (
            <div
              data-thumbnail=""
              className={styles.previewImage()}
              style={
                thumb.w
                  ? {
                      width: thumb.w,
                      height: thumb.h,
                      backgroundImage: cssUrl(thumb.url),
                      backgroundPosition: `${-(thumb.x ?? 0)}px ${-(thumb.y ?? 0)}px`,
                    }
                  : { backgroundImage: cssUrl(thumb.url), backgroundSize: 'cover' }
              }
            />
          ) : null}
          <div className={styles.previewTime()}>{formatTime(hover.time, total)}</div>
        </div>
      ) : null}
    </div>
  )
}

export interface VolumeSliderProps {
  value: number
  label: string
  onChange: (value: number) => void
}

/** Horizontal 0–1 volume slider (5% keyboard steps). */
export function VolumeSlider({ value, label, onChange }: VolumeSliderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const set = (clientX: number) => onChange(ratioAt(ref.current as HTMLDivElement, clientX))
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = {
      ArrowRight: 0.05,
      ArrowUp: 0.05,
      ArrowLeft: -0.05,
      ArrowDown: -0.05,
    }
    let next: number | null = null
    if (e.key in step) next = value + (step[e.key] as number)
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = 1
    if (next === null) return
    e.preventDefault()
    e.stopPropagation()
    onChange(clamp(Math.round(next * 100) / 100, 0, 1))
  }
  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-valuetext={`${Math.round(value * 100)}%`}
      className={styles.volumeTrack()}
      onPointerDown={(e) => {
        ref.current?.setPointerCapture?.(e.pointerId)
        dragging.current = true
        set(e.clientX)
      }}
      onPointerMove={(e) => {
        if (dragging.current) set(e.clientX)
      }}
      onPointerUp={() => {
        dragging.current = false
      }}
      onKeyDown={onKeyDown}
    >
      <div className={styles.volumeFill()} style={{ width: `${value * 100}%` }} />
      <div className={styles.volumeThumb()} style={{ left: `${value * 100}%` }} />
    </div>
  )
}

/** One row of a settings page. */
export type MenuRow =
  | { type: 'link'; id: string; icon?: ReactNode; label: string; value?: ReactNode; page: string }
  | { type: 'radio'; id: string; label: ReactNode; checked: boolean; onSelect: () => void }
  | {
      type: 'chips'
      id: string
      label: string
      options: {
        id: string
        label: string
        swatch?: string
        checked: boolean
        onSelect: () => void
      }[]
    }
  | { type: 'action'; id: string; icon?: ReactNode; label: string; onSelect: () => void }
  | {
      type: 'toggle'
      id: string
      icon?: ReactNode
      label: string
      checked: boolean
      onToggle: () => void
    }

export interface MenuPage {
  title?: string
  rows: MenuRow[]
}

export interface SettingsMenuProps {
  label: string
  backLabel: string
  pages: Record<string, MenuPage>
  initialPage?: string
  onClose: (restoreFocus: boolean) => void
  className?: string
  style?: React.CSSProperties
}

/**
 * A paged popup menu rendered inside the player root (so it stays visible in fullscreen). Rows
 * link to sub-pages, pick a radio value, or choose a chip. Arrow keys move, ArrowLeft goes back,
 * Escape closes.
 */
export function SettingsMenu({
  label,
  backLabel,
  pages,
  initialPage = 'root',
  onClose,
  className,
  style,
}: SettingsMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pageId, setPageId] = useState(initialPage)
  const page = pages[pageId] ?? (pages.root as MenuPage)

  // Focus the first row whenever a page opens.
  // biome-ignore lint/correctness/useExhaustiveDependencies: refocus on page change only
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[data-menu-item]')?.focus({ preventScroll: true })
  }, [pageId])

  const go = (id: string) => setPageId(id)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>('[data-menu-item]') ?? [])
    const i = items.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'ArrowDown') items[(i + 1) % items.length]?.focus()
    else if (e.key === 'ArrowUp') items[(i - 1 + items.length) % items.length]?.focus()
    else if (e.key === 'ArrowLeft' && pageId !== 'root') go('root')
    else if (e.key === 'Escape') onClose(true)
    else if (e.key !== 'Tab') return
    if (e.key !== 'Tab') e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={page.title ?? label}
      className={className ?? styles.menu()}
      style={style}
      onKeyDown={onKeyDown}
    >
      {page.title ? (
        <div className={styles.menuHead()}>
          <button
            type="button"
            data-menu-item=""
            aria-label={backLabel}
            className={styles.menuBack()}
            onClick={() => go('root')}
          >
            <ChevronIcon dir="left" />
          </button>
          <span className={styles.menuHeadTitle()}>{page.title}</span>
        </div>
      ) : null}
      {page.rows.map((row) => {
        if (row.type === 'link')
          return (
            <button
              key={row.id}
              type="button"
              role="menuitem"
              data-menu-item=""
              aria-haspopup="menu"
              className={styles.menuItem()}
              onClick={() => go(row.page)}
            >
              {row.icon}
              {row.label}
              <span className={styles.menuValue()}>
                {row.value}
                <ChevronIcon dir="right" />
              </span>
            </button>
          )
        if (row.type === 'radio')
          return (
            <button
              key={row.id}
              type="button"
              role="menuitemradio"
              aria-checked={row.checked}
              data-menu-item=""
              className={`group/item ${styles.menuItem()}`}
              onClick={row.onSelect}
            >
              <span className={styles.menuTick()}>
                <CheckIcon />
              </span>
              {row.label}
            </button>
          )
        if (row.type === 'chips')
          return (
            <div key={row.id}>
              <div className={styles.menuLabel()}>{row.label}</div>
              <div className={styles.chips()}>
                {row.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={o.checked}
                    aria-label={`${row.label}: ${o.label}`}
                    data-menu-item=""
                    className={styles.chip()}
                    onClick={o.onSelect}
                  >
                    {o.swatch ? (
                      <span className={styles.swatch()} style={{ background: o.swatch }} />
                    ) : (
                      o.label
                    )}
                  </button>
                ))}
              </div>
            </div>
          )
        if (row.type === 'toggle')
          return (
            <button
              key={row.id}
              type="button"
              role="menuitemcheckbox"
              aria-checked={row.checked}
              data-menu-item=""
              className={`group/item ${styles.menuItem()}`}
              onClick={row.onToggle}
            >
              {row.icon}
              {row.label}
              <span className={styles.switch()} aria-hidden="true" />
            </button>
          )
        return (
          <button
            key={row.id}
            type="button"
            role="menuitem"
            data-menu-item=""
            className={styles.menuItem()}
            onClick={row.onSelect}
          >
            {row.icon}
            {row.label}
          </button>
        )
      })}
    </div>
  )
}
