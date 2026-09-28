'use client'

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useControllableState } from '../../hooks/use-controllable-state'
import { Spinner } from '../spinner'
import {
  type PlaylistRegistration,
  type VideoEngine,
  type VideoEngineLevel,
  type VideoEngineSession,
  type VideoPanelTab,
  type VideoPlayerActions,
  VideoPlayerContext,
  type VideoPlayerContextValue,
  type VideoPlayerFeatures,
  type VideoPlayerState,
  type VideoTrack,
} from './video-player.context'
import { type MenuPage, SeekBar, SettingsMenu, VolumeSlider } from './video-player.controls'
import {
  AirPlayIcon,
  AlertIcon,
  CameraIcon,
  CaptionsIcon,
  ChevronIcon,
  CloseIcon,
  DownloadIcon,
  FullscreenIcon,
  GearIcon,
  KeyboardIcon,
  LinkIcon,
  ListIcon,
  LoopIcon,
  MoonIcon,
  NextIcon,
  PauseIcon,
  PipIcon,
  PlayIcon,
  PrevIcon,
  QualityIcon,
  ReplayIcon,
  ShareIcon,
  SkipIcon,
  SpeedIcon,
  SunIcon,
  TheaterIcon,
  TypeIcon,
  VolumeIcon,
} from './video-player.icons'
import { defaultLabels, type VideoPlayerLabels } from './video-player.labels'
import { type VideoPlayerStyleProps, videoPlayerStyles } from './video-player.styles'
import {
  type Chapter,
  chapterIndexAt,
  chaptersFromCues,
  clamp,
  cueAt,
  defaultSourceIndex,
  formatTime,
  isHd,
  parseVtt,
  sourceLabel,
  type ThumbnailCue,
  thumbnailsFromCues,
  type VideoSource,
  type VttCue,
} from './video-player.utils'

export type { VideoTrack } from './video-player.context'

/** Settings rows available in the gear menu. */
export type VideoPlayerSetting =
  | 'quality'
  | 'speed'
  | 'captions'
  | 'picture'
  | 'sleep'
  | 'loop'
  | 'snapshot'
  | 'download'

type Native = Omit<
  ComponentPropsWithoutRef<'video'>,
  'controls' | 'children' | 'title' | 'contextMenu'
>

/** Everything {@link VideoPlayer} accepts besides its name (`title` or `aria-label`). */
export interface VideoPlayerOwnProps extends Native {
  /** Line under the title while controls show (series, episode, channel…). */
  info?: ReactNode
  /**
   * Frame shape. Ignored in fullscreen.
   * @default '16/9'
   */
  aspectRatio?: NonNullable<VideoPlayerStyleProps['aspectRatio']>
  /** Renditions for the quality menu. Overrides `src`. The `default` one (else the first) plays first. */
  sources?: VideoSource[]
  /** Caption, subtitle and chapter tracks (WebVTT). */
  tracks?: VideoTrack[]
  /** Chapters given inline; wins over a `chapters` track. */
  chapters?: Chapter[]
  /** Hover-preview thumbnails: a WebVTT URL (sprite `#xywh=` cues) or cues given inline. */
  thumbnails?: string | ThumbnailCue[]
  /** Start playback at this many seconds. */
  startTime?: number
  /** Watermark in the top-right corner; a link when `href` is set. */
  logo?: { src: string; alt: string; href?: string }
  /**
   * Speed menu entries.
   * @default [0.5, 0.75, 1, 1.25, 1.5, 2]
   */
  playbackRates?: number[]
  /**
   * Seconds moved by the back/forward buttons and the `J` / `L` keys.
   * @default 10
   */
  skipSeconds?: number
  /**
   * Frame rate for `,` / `.` frame stepping while paused.
   * @default 24
   */
  frameRate?: number
  /**
   * Gear-menu rows. Rows with nothing to choose (one rendition, no captions) are skipped.
   * @default ['quality', 'speed', 'captions']
   */
  settings?: VideoPlayerSetting[]
  /**
   * Hide the controls after 2.5s without input while playing.
   * @default true
   */
  autoHide?: boolean
  /**
   * Keyboard shortcuts while focus is inside the player. Never bound on the window.
   * @default true
   */
  hotkeys?: boolean
  /**
   * Replace the browser's right-click menu with the player's (copy link, shortcuts).
   * @default true
   */
  contextMenu?: boolean
  /**
   * On touch screens: a large back / play / forward row and double-tap-to-seek on the sides.
   * @default true
   */
  touchControls?: boolean
  /**
   * `'muted'` autoplays muted (what browsers allow) and shows a "Tap to unmute" chip.
   * @default 'none'
   */
  autoplayPolicy?: 'muted' | 'none'
  /**
   * Remember the position in `localStorage` under this key and offer "Resume from…" next time.
   * With a playlist, each item is remembered separately.
   */
  resume?: string
  /** Players sharing a group name pause each other: only one plays at a time. */
  syncGroup?: string
  /**
   * While playing, dock to the bottom-right corner when scrolled out of view. The viewer can close
   * the mini player; it docks again after the player scrolls back into view.
   * @default false
   */
  floating?: boolean
  /** Controlled theater mode. Shows the theater button (and `T` key) when this or `onTheaterChange` is set. */
  theater?: boolean
  /**
   * Initial theater mode when uncontrolled.
   * @default false
   */
  defaultTheater?: boolean
  /** Fires when the viewer toggles theater mode. The app owns the wider layout. */
  onTheaterChange?: (theater: boolean) => void
  /**
   * File for the gear menu's Download row (add `'download'` to `settings`): a URL, or a URL plus a
   * file name.
   */
  download?: string | { src: string; filename?: string }
  /**
   * Receives the frame captured by the Snapshot row (add `'snapshot'` to `settings`). Without it
   * the PNG is downloaded. Needs same-origin or CORS-enabled media (`crossOrigin="anonymous"`).
   */
  onSnapshot?: (image: Blob, time: number) => void
  /**
   * Stop playback at `seconds` and cover the frame with `content` (a sign-up prompt, a paywall…).
   * Seeking past the limit is blocked.
   */
  watchLimit?: { seconds: number; content: ReactNode }
  /**
   * Live stream mode: a LIVE pill replaces the time (crimson at the live edge, click to jump back),
   * and the bar spans the seekable window (DVR). `dvrWindow` caps that window in seconds.
   */
  live?: boolean | { dvrWindow?: number }
  /**
   * Streaming engine for sources the browser can't play natively, e.g. `hlsEngine()` from
   * `sukuna-ui/video/hls`. Its quality levels replace `sources` in the Quality menu. Create it
   * once (module scope or `useMemo`), not inline on every render.
   */
  engine?: VideoEngine
  /** Override any visible or accessible string (i18n). */
  labels?: Partial<VideoPlayerLabels>
  /** Fires when playback crosses into another chapter. */
  onChapterChange?: (chapter: Chapter, index: number) => void
  /** Fires after the viewer picks another rendition. */
  onQualityChange?: (source: VideoSource, index: number) => void
  /** Parts (`VideoPlayerPanel`, `VideoPlayerSkip`…) or your own components using `useVideoPlayer`. */
  children?: ReactNode
}

/** Props for {@link VideoPlayer}. Needs a `title` or an `aria-label` to name the player. */
export type VideoPlayerProps = VideoPlayerOwnProps &
  (
    | {
        /** Shown top-left while the controls show; also names the player region. */
        title: string
        'aria-label'?: string
      }
    | { title?: undefined; 'aria-label': string }
  )

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2]
const HIDE_AFTER = 2500
const SPINNER_DELAY = 200
const NO_FEATURES: VideoPlayerFeatures = { panelTabs: [], share: false }

const NO_CHAPTERS: Chapter[] = []
const NO_THUMBS: ThumbnailCue[] = []
const DEFAULT_PICTURE = { zoom: 1, mirror: false, brightness: 100, contrast: 100, saturate: 100 }
type LoopMode = 'off' | 'video' | 'chapter' | 'ab'

// Players in the same `syncGroup` pause each other. Only touched from effects and handlers.
const syncGroups = new Map<string, Set<() => void>>()

type CaptionSize = 'S' | 'M' | 'L'
type CaptionColor = 'text' | 'premium'
type CaptionBg = 'solid' | 'soft' | 'none'

const trackKey = (t: VideoTrack) => t.srclang ?? t.label ?? t.src
const defaultCaption = (tracks: VideoTrack[]) => {
  const d = tracks.find((t) => t.default)
  return d ? trackKey(d) : null
}

async function loadVtt(src: string): Promise<VttCue[]> {
  const res = await fetch(src)
  if (!res.ok) throw new Error(`VTT ${res.status}`)
  return parseVtt(await res.text())
}

const srcAt = (list: VideoSource[] | undefined, index: number) => list?.[index]?.src

/**
 * True when focus sits inside `el` because of the keyboard. A mouse click or tap also focuses the
 * button it hits, but that must not pin the controls open; keyboard focus must (WCAG 2.4.7).
 */
function keyboardFocusIn(el: HTMLElement | null) {
  const active = document.activeElement
  if (!el || !active || !el.contains(active)) return false
  try {
    return active.matches(':focus-visible')
  } catch {
    return true // no :focus-visible support: keep the controls, the accessible choice
  }
}

/** Trigger a browser download for a URL (handlers only). */
function saveUrl(href: string, filename: string) {
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  a.rel = 'noopener'
  a.click()
}

function storage(key: string | null) {
  return {
    read: () => {
      try {
        const v = key ? localStorage.getItem(key) : null
        return v === null ? null : Number(v)
      } catch {
        return null
      }
    },
    write: (t: number) => {
      try {
        if (key) localStorage.setItem(key, String(Math.floor(t)))
      } catch {}
    },
    clear: () => {
      try {
        if (key) localStorage.removeItem(key)
      } catch {}
    },
  }
}

type Handler = ((e: SyntheticEvent<HTMLVideoElement>) => void) | undefined
const chain =
  (ours: () => void, theirs: Handler) =>
  (e: SyntheticEvent<HTMLVideoElement>): void => {
    ours()
    theirs?.(e)
  }

type WebkitVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
  webkitShowPlaybackTargetPicker?: () => void
}

/**
 * A video player with Sukuna-branded controls over the native `<video>` element: play, a
 * chapter-segmented seek bar with thumbnail previews, volume, a settings menu (quality, speed,
 * captions, caption style), picture-in-picture, AirPlay, fullscreen, theater mode, a floating mini
 * player, resume and keyboard shortcuts. Add parts as children for a side panel, playlist,
 * "Up next", end screen, share sheet and skip-intro button.
 *
 * @remarks
 * - SSR/RSC: a client component. The server renders the frame, the `<video>` and idle controls;
 *   buttons that depend on browser support (fullscreen, picture-in-picture, AirPlay) appear after
 *   hydration. Tracks and thumbnails are fetched in effects; `resume` reads `localStorage` in
 *   handlers only.
 * - Theme: the chrome is always dark (`data-theme="dark"` on the root) so it stays readable over
 *   video inside a light app.
 * - Accessibility: the root is a focusable `region` named by `title` / `aria-label`
 *   (`aria-roledescription="video player"`). Every control is a real button with an action label
 *   ("Play", "Mute", "Enter fullscreen"); toggles use `aria-pressed`. Seek and volume are
 *   `role="slider"` with spoken `aria-valuetext`. Controls never hide while focus is inside them.
 *   Captions are rendered by the player (not `::cue`) so their style is adjustable.
 * - Keyboard (focus inside the player): Space/K play, ←/→ 5s, Shift+←/→ chapter, J/L
 *   `skipSeconds`, ↑/↓ volume, M mute, C captions, F fullscreen, I picture-in-picture, T theater,
 *   Shift+N/P next/previous video, `,`/`.` frame step while paused, `<`/`>` speed, 0–9 jump,
 *   Home/End, `?` shortcuts, Escape closes panels.
 * - Props: `ref` points at the `<video>`; `className` and `style` go to the frame; every other
 *   native media prop and event passes to the `<video>`. `controls` is not accepted.
 * - Children are parts: they render in a layer over the video and can read state with
 *   `useVideoPlayer()`. With a `VideoPlayerPlaylist`, the current item's media replaces `src`,
 *   `sources`, `tracks`, `chapters`, `thumbnails`, `poster`, `title` and `info`.
 *
 * @example
 * ```tsx
 * import { VideoPlayer } from 'sukuna-ui'
 *
 * <VideoPlayer
 *   title="Last Train, Shibuya"
 *   info="Night walk · Episode 1"
 *   poster="/shibuya.jpg"
 *   sources={[
 *     { src: '/v/1080.mp4', type: 'video/mp4', res: 1080 },
 *     { src: '/v/720.mp4', type: 'video/mp4', res: 720, default: true },
 *   ]}
 *   tracks={[
 *     { kind: 'captions', src: '/v/en.vtt', srclang: 'en', label: 'English', default: true },
 *     { kind: 'chapters', src: '/v/chapters.vtt' },
 *   ]}
 *   thumbnails="/v/thumbs.vtt"
 *   resume="shibuya-ep1"
 * />
 * ```
 *
 * @example
 * ```tsx
 * import {
 *   VideoPlayer,
 *   VideoPlayerEndScreen,
 *   VideoPlayerPanel,
 *   VideoPlayerPlaylist,
 *   VideoPlayerShare,
 *   VideoPlayerSkip,
 *   VideoPlayerUpNext,
 * } from 'sukuna-ui'
 *
 * <VideoPlayer title="Night walks" floating>
 *   <VideoPlayerPlaylist items={episodes} />
 *   <VideoPlayerPanel />
 *   <VideoPlayerSkip start={0} end={12} />
 *   <VideoPlayerUpNext />
 *   <VideoPlayerShare />
 *   <VideoPlayerEndScreen related={related} />
 * </VideoPlayer>
 * ```
 */
export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  function VideoPlayer(props, forwardedRef) {
    const {
      title: titleProp,
      'aria-label': ariaLabel,
      info: infoProp,
      aspectRatio,
      sources: sourcesProp,
      tracks: tracksProp,
      chapters: chaptersInline,
      thumbnails: thumbnailsInline,
      startTime,
      logo,
      playbackRates = RATES,
      skipSeconds = 10,
      frameRate = 24,
      settings = ['quality', 'speed', 'captions'],
      autoHide = true,
      hotkeys = true,
      contextMenu = true,
      touchControls = true,
      autoplayPolicy = 'none',
      resume,
      syncGroup,
      floating = false,
      theater: theaterProp,
      defaultTheater = false,
      onTheaterChange,
      download,
      onSnapshot,
      watchLimit,
      live,
      engine,
      labels: labelsProp,
      onChapterChange,
      onQualityChange,
      children,
      className,
      style,
      src: srcProp,
      poster: posterProp,
      autoPlay,
      muted: mutedProp,
      playsInline = true,
      onPlay,
      onPause,
      onTimeUpdate,
      onDurationChange,
      onLoadedMetadata,
      onProgress,
      onVolumeChange,
      onRateChange,
      onWaiting,
      onPlaying,
      onCanPlay,
      onEnded,
      onError,
      ...videoProps
    } = props

    const labels = useMemo(() => ({ ...defaultLabels, ...labelsProp }), [labelsProp])
    const s = videoPlayerStyles()
    const rootRef = useRef<HTMLElement>(null)
    const hostRef = useRef<HTMLDivElement>(null)
    const barRef = useRef<HTMLDivElement>(null)
    const gearRef = useRef<HTMLButtonElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    useImperativeHandle(forwardedRef, () => videoRef.current as HTMLVideoElement)
    const video = useCallback(() => videoRef.current as WebkitVideo, [])

    // ── parts registry ──
    const [playlist, setPlaylist] = useState<PlaylistRegistration | null>(null)
    const [features, setFeatures] = useState<VideoPlayerFeatures>(NO_FEATURES)
    const registry = useMemo<VideoPlayerContextValue['registry']>(
      () => ({
        setPlaylist,
        setFeature: (key, value) =>
          setFeatures((f) => (String(f[key]) === String(value) ? f : { ...f, [key]: value })),
      }),
      [],
    )

    // ── media: the playlist's current item wins over the player's own props ──
    const item = playlist ? playlist.items[playlist.index] : undefined
    const itemKey = item && playlist ? (item.id ?? String(playlist.index)) : ''
    const title = item ? item.title : titleProp
    const info = item ? item.info : infoProp
    const sources = item ? item.sources : sourcesProp
    const src = item ? item.src : srcProp
    const tracks = item ? item.tracks : tracksProp
    const chaptersProp = item ? item.chapters : chaptersInline
    const thumbnailsProp = item ? item.thumbnails : thumbnailsInline
    const poster = item?.poster ?? posterProp

    // ── media state ──
    const [paused, setPaused] = useState(true)
    const [started, setStarted] = useState(false)
    const [ended, setEnded] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(Number.NaN)
    const [buffered, setBuffered] = useState(0)
    const [volume, setVolumeState] = useState(1)
    const [muted, setMuted] = useState(Boolean(mutedProp) || autoplayPolicy === 'muted')
    const [rate, setRate] = useState(1)
    const [waiting, setWaiting] = useState(false)
    const [spinner, setSpinner] = useState(false)
    const [error, setError] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)
    const [pip, setPip] = useState(false)
    const [support, setSupport] = useState({ fullscreen: false, pip: false, airplay: false })
    const [coarse, setCoarse] = useState(false)
    const [sourceIndex, setSourceIndex] = useState(() => defaultSourceIndex(sources ?? []))
    const restore = useRef<{ time: number; play: boolean } | null>(null)
    const playOnLoad = useRef(false)
    const startApplied = useRef(false)
    const lastVolume = useRef(1)
    const lastSaved = useRef(0)

    // ── UI state ──
    const [hidden, setHidden] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [ctx, setCtx] = useState<{ x: number; y: number } | null>(null)
    const [shortcuts, setShortcuts] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [flash, setFlash] = useState<-1 | 1 | null>(null)
    const [unmuteChip, setUnmuteChip] = useState(autoplayPolicy === 'muted')
    const [panel, setPanel] = useState<{ open: boolean; tab: VideoPanelTab }>({
      open: false,
      tab: 'chapters',
    })
    const [shareOpen, setShareOpen] = useState(false)
    const [advanceCancelled, setAdvanceCancelled] = useState(false)
    const [resumeAt, setResumeAt] = useState<number | null>(null)
    const [picture, setPicture] = useState(DEFAULT_PICTURE)
    const [sleep, setSleep] = useState<'off' | 'end' | number>('off')
    const [loop, setLoop] = useState<{ mode: LoopMode; a?: number; b?: number }>({ mode: 'off' })
    const [toast, setToast] = useState<string | null>(null)
    const [liveRange, setLiveRange] = useState({ start: 0, end: 0 })
    const [levels, setLevels] = useState<VideoEngineLevel[]>([])
    const [level, setLevelState] = useState(-1)
    const [playingLevel, setPlayingLevel] = useState(-1)
    const [attempt, setAttempt] = useState(0)
    const session = useRef<VideoEngineSession | null>(null)
    const [offscreen, setOffscreen] = useState(false)
    const [dockDismissed, setDockDismissed] = useState(false)
    const [hostHeight, setHostHeight] = useState<number | undefined>(undefined)
    const [theater, setTheater] = useControllableState({
      value: theaterProp,
      defaultValue: defaultTheater,
      onChange: onTheaterChange,
    })
    const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const lastTap = useRef(0)
    // Stable, so it focuses once on mount instead of on every re-render.
    const focusOnMount = useCallback(
      (el: HTMLElement | null) => el?.focus({ preventScroll: true }),
      [],
    )
    const pauseSelf = useRef<() => void>(() => {})

    // ── tracks ──
    const captionTracks = useMemo(
      () => (tracks ?? []).filter((t) => t.kind === 'captions' || t.kind === 'subtitles'),
      [tracks],
    )
    const [captionKey, setCaptionKey] = useState<string | null>(() => defaultCaption(captionTracks))
    const [preferredCaption, setPreferredCaption] = useState<string | null>(() => {
      const first = captionTracks[0]
      return defaultCaption(captionTracks) ?? (first ? trackKey(first) : null)
    })
    const [cues, setCues] = useState<VttCue[]>([])
    const [captionStyle, setCaptionStyle] = useState<{
      size: CaptionSize
      color: CaptionColor
      bg: CaptionBg
    }>({ size: 'M', color: 'text', bg: 'solid' })
    const [fetchedChapters, setFetchedChapters] = useState<Chapter[]>([])
    const [thumbnails, setThumbnails] = useState<ThumbnailCue[]>(
      Array.isArray(thumbnailsProp) ? thumbnailsProp : [],
    )
    const chapters = chaptersProp ?? fetchedChapters
    const chapterIndex = chapterIndexAt(chapters, currentTime)
    const resumeKey = resume ? `sk-video:${resume}${itemKey ? `:${itemKey}` : ''}` : null
    const store = storage(resumeKey)

    // A new playlist item: reset per-media state (the element reloads on its own).
    const firstItem = useRef(true)
    // biome-ignore lint/correctness/useExhaustiveDependencies: runs when the item changes only
    useEffect(() => {
      if (firstItem.current) {
        firstItem.current = false
        return
      }
      startApplied.current = false
      setSourceIndex(defaultSourceIndex(sources ?? []))
      setFetchedChapters([])
      setEnded(false)
      setAdvanceCancelled(false)
      setResumeAt(null)
      setCurrentTime(0)
      setDuration(Number.NaN)
      setBuffered(0)
      const keys = captionTracks.map(trackKey)
      setCaptionKey((k) => (k && keys.includes(k) ? k : defaultCaption(captionTracks)))
      setPreferredCaption((k) => (k && keys.includes(k) ? k : (keys[0] ?? null)))
    }, [itemKey])

    // Cues of the showing track — or the preferred one when a transcript needs them.
    const cueKey =
      captionKey ?? (features.panelTabs.includes('transcript') ? preferredCaption : null)
    const cueCache = useRef(new Map<string, VttCue[]>())
    useEffect(() => {
      const track = captionTracks.find((t) => trackKey(t) === cueKey)
      if (!track) return setCues([])
      const cached = cueCache.current.get(track.src)
      if (cached) return setCues(cached)
      let live = true
      loadVtt(track.src)
        .then((c) => {
          cueCache.current.set(track.src, c)
          if (live) setCues(c)
        })
        .catch(() => {})
      return () => {
        live = false
      }
    }, [cueKey, captionTracks])

    // Chapters track (only when no inline chapters).
    const chapterSrc = chaptersProp ? undefined : tracks?.find((t) => t.kind === 'chapters')?.src
    useEffect(() => {
      if (!chapterSrc) return
      let live = true
      loadVtt(chapterSrc)
        .then((c) => live && setFetchedChapters(chaptersFromCues(c)))
        .catch(() => {})
      return () => {
        live = false
      }
    }, [chapterSrc])

    // Thumbnails VTT.
    useEffect(() => {
      if (typeof thumbnailsProp !== 'string') {
        setThumbnails(thumbnailsProp ?? [])
        return
      }
      let live = true
      loadVtt(thumbnailsProp)
        .then((c) => live && setThumbnails(thumbnailsFromCues(c, thumbnailsProp)))
        .catch(() => {})
      return () => {
        live = false
      }
    }, [thumbnailsProp])

    // Browser support + pointer type (client only, so SSR and hydration render the same).
    useEffect(() => {
      const v = video()
      setSupport({
        fullscreen: Boolean(document.fullscreenEnabled || v.webkitEnterFullscreen),
        pip: Boolean(document.pictureInPictureEnabled) && !v.disablePictureInPicture,
        airplay: typeof v.webkitShowPlaybackTargetPicker === 'function',
      })
      setCoarse(Boolean(window.matchMedia?.('(pointer: coarse)').matches))
      const onFs = () => setFullscreen(document.fullscreenElement === rootRef.current)
      const onEnterPip = () => setPip(true)
      const onLeavePip = () => setPip(false)
      document.addEventListener('fullscreenchange', onFs)
      v.addEventListener('enterpictureinpicture', onEnterPip)
      v.addEventListener('leavepictureinpicture', onLeavePip)
      return () => {
        document.removeEventListener('fullscreenchange', onFs)
        v.removeEventListener('enterpictureinpicture', onEnterPip)
        v.removeEventListener('leavepictureinpicture', onLeavePip)
      }
    }, [video])

    // One player at a time per sync group.
    useEffect(() => {
      if (!syncGroup) return
      const group = syncGroups.get(syncGroup) ?? new Set<() => void>()
      syncGroups.set(syncGroup, group)
      const pause = () => video().pause()
      pauseSelf.current = pause
      group.add(pause)
      return () => {
        group.delete(pause)
      }
    }, [syncGroup, video])

    // Floating: watch the in-page slot; remember its height so the page doesn't jump.
    useEffect(() => {
      const host = hostRef.current
      if (!floating || !host || typeof IntersectionObserver === 'undefined') return
      const io = new IntersectionObserver(([entry]) => {
        if (!entry) return
        setOffscreen(!entry.isIntersecting)
        if (entry.isIntersecting) setDockDismissed(false)
        else setHostHeight(entry.boundingClientRect.height)
      })
      io.observe(host)
      return () => io.disconnect()
    }, [floating])

    // Spinner only after a short stall, so quick seeks don't flash it.
    useEffect(() => {
      if (!waiting) return setSpinner(false)
      const t = setTimeout(() => setSpinner(true), SPINNER_DELAY)
      return () => clearTimeout(t)
    }, [waiting])

    // Chapter change callback.
    const lastChapter = useRef(-1)
    useEffect(() => {
      if (chapterIndex < 0 || chapterIndex === lastChapter.current) return
      lastChapter.current = chapterIndex
      onChapterChange?.(chapters[chapterIndex] as Chapter, chapterIndex)
    }, [chapterIndex, chapters, onChapterChange])

    // ── auto-hide ──
    const holding = menuOpen || dragging || ctx !== null || panel.open || shareOpen
    const limitAt = watchLimit?.seconds
    const limited = limitAt !== undefined && currentTime >= limitAt - 0.05
    const latest = useRef({ paused, holding, autoHide, theater, limitAt, limited })
    latest.current = { paused, holding, autoHide, theater, limitAt, limited }
    const showControls = useCallback(() => {
      setHidden(false)
      clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => {
        const l = latest.current
        if (l.autoHide && !l.paused && !l.holding && !keyboardFocusIn(barRef.current))
          setHidden(true)
      }, HIDE_AFTER)
    }, [])
    useEffect(() => {
      if (paused) setHidden(false)
      else showControls()
    }, [paused, showControls])
    useEffect(() => () => clearTimeout(hideTimer.current), [])

    // Streaming engine: it owns `src` for the URLs it claims (decided at render, so SSR matches).
    const mediaSrc = srcAt(sources, sourceIndex) ?? src
    const engineSrc = engine && mediaSrc && engine.handles(mediaSrc) ? mediaSrc : null
    const engineRef = useRef(engine)
    engineRef.current = engine
    // biome-ignore lint/correctness/useExhaustiveDependencies: `attempt` re-attaches after Retry
    useEffect(() => {
      const eng = engineRef.current
      if (!eng || !engineSrc) return
      const attached = eng.attach(video(), engineSrc, {
        onLevels: setLevels,
        onLevelChange: setPlayingLevel,
        onFatalError: () => setError(true),
      })
      session.current = attached
      return () => {
        attached.destroy()
        session.current = null
        setLevels([])
        setLevelState(-1)
        setPlayingLevel(-1)
      }
    }, [engine?.name, engineSrc, video, attempt])

    // Sleep timer: pause after N minutes.
    useEffect(() => {
      if (typeof sleep !== 'number') return
      const t = setTimeout(() => {
        video().pause()
        setSleep('off')
      }, sleep * 60_000)
      return () => clearTimeout(t)
    }, [sleep, video])

    // Toasts disappear on their own.
    useEffect(() => {
      if (!toast) return
      const t = setTimeout(() => setToast(null), 2400)
      return () => clearTimeout(t)
    }, [toast])

    // "Loop → Whole video" is the native loop attribute.
    const nativeLoop = Boolean(videoProps.loop)
    useEffect(() => {
      video().loop = loop.mode === 'video' || nativeLoop
    }, [loop.mode, nativeLoop, video])

    // Watch limit: stop at the limit.
    useEffect(() => {
      if (limited && !paused) video().pause()
    }, [limited, paused, video])

    // ── playlist navigation ──
    const nav = useRef({ playlist, currentTime, paused })
    nav.current = { playlist, currentTime, paused }
    const selectItem = useCallback((i: number, play?: boolean) => {
      const p = nav.current.playlist
      if (!p) return
      const n = p.items.length
      const next = p.repeat ? (i + n) % n : clamp(i, 0, n - 1)
      if (next === p.index) return
      playOnLoad.current = play ?? !nav.current.paused
      p.select(next)
    }, [])

    // ── actions ──
    const actions = useMemo<VideoPlayerActions>(() => {
      const seek = (t: number) => {
        const v = video()
        const end = Number.isFinite(v.duration) ? v.duration : Number.POSITIVE_INFINITY
        v.currentTime = clamp(t, 0, Math.min(end, latest.current.limitAt ?? end))
        setCurrentTime(v.currentTime)
      }
      const play = () => {
        if (latest.current.limited) return
        const p = video().play()
        if (p && typeof p.catch === 'function') p.catch(() => {})
      }
      return {
        play,
        pause: () => video().pause(),
        togglePlay: () => (video().paused || video().ended ? play() : video().pause()),
        replay: () => {
          seek(0)
          play()
        },
        seek,
        skip: (d) => seek(video().currentTime + d),
        setVolume: (vol) => {
          const v = video()
          v.volume = clamp(vol, 0, 1)
          v.muted = vol <= 0
          if (vol > 0) lastVolume.current = v.volume
          setUnmuteChip(false)
        },
        toggleMute: () => {
          const v = video()
          if (v.muted || v.volume === 0) {
            v.muted = false
            if (v.volume === 0) v.volume = Math.max(lastVolume.current, 0.1)
          } else v.muted = true
          setUnmuteChip(false)
        },
        setPlaybackRate: (r) => {
          video().playbackRate = r
        },
        setLevel: (i) => {
          session.current?.setLevel(i)
          setLevelState(i)
        },
        setSource: (i) => {
          const v = video()
          restore.current = { time: v.currentTime, play: !v.paused }
          setSourceIndex(i)
        },
        setCaptionTrack: (key) => {
          if (key) setPreferredCaption(key)
          setCaptionKey(key)
        },
        toggleFullscreen: () => {
          const v = video()
          if (document.fullscreenElement) {
            document.exitFullscreen?.().catch(() => {})
            return
          }
          const root = rootRef.current as HTMLElement
          if (typeof root.requestFullscreen === 'function') {
            root
              .requestFullscreen()
              .then(() => {
                const o = screen.orientation as ScreenOrientation & {
                  lock?: (o: string) => Promise<void>
                }
                if (window.matchMedia?.('(pointer: coarse)').matches)
                  o?.lock?.('landscape').catch(() => {})
              })
              .catch(() => {})
          } else v.webkitEnterFullscreen?.()
        },
        togglePictureInPicture: () => {
          if (document.pictureInPictureElement) document.exitPictureInPicture().catch(() => {})
          else
            video()
              .requestPictureInPicture?.()
              .catch(() => {})
        },
        toggleTheater: () => setTheater(!latest.current.theater),
        showControls,
        next: () => {
          const p = nav.current.playlist
          if (p) selectItem(p.index + 1)
        },
        previous: () => {
          const p = nav.current.playlist
          if (!p) return
          if (nav.current.currentTime > 3) seek(0)
          else selectItem(p.index - 1)
        },
        selectItem: (i) => selectItem(i, true),
        cancelAdvance: () => setAdvanceCancelled(true),
        openPanel: (tab) => {
          setMenuOpen(false)
          setPanel((p) => ({ open: true, tab: tab ?? p.tab }))
        },
        closePanel: () => setPanel((p) => ({ ...p, open: false })),
        openShare: () => {
          setMenuOpen(false)
          setShareOpen(true)
        },
        closeShare: () => setShareOpen(false),
      }
    }, [showControls, video, selectItem, setTheater])

    const hasPrevious = playlist ? playlist.repeat || playlist.index > 0 : false
    const hasNext = playlist ? playlist.repeat || playlist.index < playlist.items.length - 1 : false
    const willAdvance = Boolean(
      playlist?.autoAdvance && hasNext && !advanceCancelled && sleep !== 'end',
    )
    const loopRange =
      loop.mode === 'chapter' && chapters[chapterIndex]
        ? {
            start: (chapters[chapterIndex] as Chapter).start,
            end: chapters[chapterIndex + 1]?.start ?? duration,
          }
        : loop.mode === 'ab' && loop.a !== undefined && loop.b !== undefined && loop.b > loop.a
          ? { start: loop.a, end: loop.b }
          : null
    const dvr = typeof live === 'object' ? live.dvrWindow : undefined

    const state: VideoPlayerState = {
      title,
      currentTime,
      duration,
      buffered,
      paused,
      ended,
      started,
      waiting: spinner,
      error,
      volume,
      muted,
      playbackRate: rate,
      fullscreen,
      pictureInPicture: pip,
      chapters,
      chapterIndex,
      sources: sources ?? [],
      sourceIndex,
      levels,
      level,
      playingLevel,
      captionTracks: captionTracks.map((t) => ({
        key: trackKey(t),
        label: t.label ?? trackKey(t),
      })),
      captionTrack: captionKey,
      cues,
      controlsVisible: !hidden,
      playlist: playlist
        ? {
            items: playlist.items,
            index: playlist.index,
            hasNext,
            hasPrevious,
            autoAdvance: playlist.autoAdvance,
            repeat: playlist.repeat,
          }
        : null,
      panel,
      shareOpen,
      advanceCancelled,
      theater,
    }

    const toggleCaptions = () => actions.setCaptionTrack(captionKey ? null : preferredCaption)

    // ── media event handlers (ours first, then the consumer's) ──
    const syncTime = () => {
      const v = video()
      setCurrentTime(v.currentTime)
      const b = v.buffered
      for (let i = 0; b && i < b.length; i++) {
        if (b.start(i) <= v.currentTime + 0.5 && v.currentTime <= b.end(i)) setBuffered(b.end(i))
      }
      if (resumeKey && Math.abs(v.currentTime - lastSaved.current) >= 5) {
        lastSaved.current = v.currentTime
        store.write(v.currentTime)
      }
      if (loopRange && v.currentTime >= loopRange.end) {
        v.currentTime = loopRange.start
        setCurrentTime(loopRange.start)
      }
      const sk = v.seekable
      if (live && sk?.length) {
        const end = sk.end(sk.length - 1)
        const start = dvr ? Math.max(sk.start(0), end - dvr) : sk.start(0)
        setLiveRange((r) => (r.start === start && r.end === end ? r : { start, end }))
      }
    }
    const media = {
      onPlay: chain(() => {
        setPaused(false)
        setStarted(true)
        setEnded(false)
        setResumeAt(null)
        if (syncGroup)
          for (const pause of syncGroups.get(syncGroup) ?? [])
            if (pause !== pauseSelf.current) pause()
      }, onPlay),
      onPause: chain(() => {
        setPaused(true)
        if (resumeKey && !video().ended) store.write(video().currentTime)
      }, onPause),
      onTimeUpdate: chain(syncTime, onTimeUpdate),
      onProgress: chain(syncTime, onProgress),
      onDurationChange: chain(() => setDuration(video().duration), onDurationChange),
      onLoadedMetadata: chain(() => {
        const v = video()
        setDuration(v.duration)
        if (restore.current) {
          v.currentTime = restore.current.time
          if (restore.current.play) actions.play()
          restore.current = null
        } else if (!startApplied.current) {
          if (startTime) v.currentTime = startTime
          const saved = store.read()
          if (saved !== null && saved > 5 && saved < v.duration - 5) setResumeAt(saved)
        }
        if (playOnLoad.current) {
          playOnLoad.current = false
          actions.play()
        }
        startApplied.current = true
        setError(false)
      }, onLoadedMetadata),
      onVolumeChange: chain(() => {
        const v = video()
        setVolumeState(v.volume)
        setMuted(v.muted)
      }, onVolumeChange),
      onRateChange: chain(() => setRate(video().playbackRate), onRateChange),
      onWaiting: chain(() => setWaiting(true), onWaiting),
      onPlaying: chain(() => setWaiting(false), onPlaying),
      onCanPlay: chain(() => setWaiting(false), onCanPlay),
      onEnded: chain(() => {
        setPaused(true)
        store.clear()
        if (sleep === 'end') setSleep('off')
        const p = nav.current.playlist
        if (p && willAdvance) selectItem(p.index + 1, true)
        else setEnded(true)
      }, onEnded),
      onError: chain(() => {
        setError(true)
        setWaiting(false)
      }, onError),
    }

    // ── pointer on the video surface ──
    const flashSeek = (dir: -1 | 1) => {
      actions.skip(dir * skipSeconds)
      setFlash(dir)
      setTimeout(() => setFlash(null), 500)
    }
    const onVideoClick = (e: MouseEvent<HTMLVideoElement>) => {
      setCtx(null)
      if (menuOpen) return setMenuOpen(false)
      if (coarse && touchControls) {
        const now = Date.now()
        if (now - lastTap.current < 300) {
          const r = e.currentTarget.getBoundingClientRect()
          flashSeek(e.clientX - r.left < r.width / 2 ? -1 : 1)
        } else if (hidden) showControls()
        else setHidden(true)
        lastTap.current = now
        return
      }
      actions.togglePlay()
    }

    const showTheater = theaterProp !== undefined || onTheaterChange !== undefined

    // ── hotkeys ──
    const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
      const target = e.target as HTMLElement
      if (!hotkeys || e.metaKey || e.ctrlKey || e.altKey) return
      if (
        target.closest(
          'input, textarea, select, [contenteditable="true"], [role="menu"], [role="dialog"]',
        )
      )
        return
      if (target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return
      const v = video()
      const k = e.key
      const lower = k.toLowerCase()
      let handled = true
      if (k === ' ' || lower === 'k') actions.togglePlay()
      else if (e.shiftKey && (k === 'ArrowRight' || k === 'ArrowLeft') && chapters.length) {
        const i = chapterIndex
        const cur = chapters[i] as Chapter
        if (k === 'ArrowRight') actions.seek((chapters[i + 1] ?? cur).start)
        else
          actions.seek(
            v.currentTime - cur.start > 3
              ? cur.start
              : (chapters[Math.max(i - 1, 0)] as Chapter).start,
          )
      } else if (e.shiftKey && lower === 'n') actions.next()
      else if (e.shiftKey && lower === 'p') actions.previous()
      else if (k === 'ArrowRight') actions.skip(5)
      else if (k === 'ArrowLeft') actions.skip(-5)
      else if (lower === 'l') actions.skip(skipSeconds)
      else if (lower === 'j') actions.skip(-skipSeconds)
      else if (k === 'ArrowUp')
        actions.setVolume(Math.round((v.muted ? 0 : v.volume) * 100 + 5) / 100)
      else if (k === 'ArrowDown')
        actions.setVolume(Math.round((v.muted ? 0 : v.volume) * 100 - 5) / 100)
      else if (lower === 'm') actions.toggleMute()
      else if (lower === 'c' && captionTracks.length) toggleCaptions()
      else if (lower === 'f') actions.toggleFullscreen()
      else if (lower === 'i') actions.togglePictureInPicture()
      else if (lower === 't' && showTheater) actions.toggleTheater()
      else if (k === ',' && v.paused) actions.skip(-1 / frameRate)
      else if (k === '.' && v.paused) actions.skip(1 / frameRate)
      else if (k === '<' || k === '>') {
        const i = playbackRates.indexOf(v.playbackRate)
        const next =
          playbackRates[
            clamp(
              (i < 0 ? playbackRates.indexOf(1) : i) + (k === '>' ? 1 : -1),
              0,
              playbackRates.length - 1,
            )
          ]
        if (next !== undefined) actions.setPlaybackRate(next)
      } else if (k === 'Home') actions.seek(0)
      else if (k === 'End') actions.seek(live ? liveRange.end : v.duration)
      else if (/^[0-9]$/.test(k) && !live) actions.seek((v.duration || 0) * (Number(k) / 10))
      else if (k === '?') setShortcuts(true)
      else if (k === 'Escape' && (ctx || shortcuts || panel.open || shareOpen)) {
        setCtx(null)
        setShortcuts(false)
        setShareOpen(false)
        actions.closePanel()
      } else handled = false
      if (handled) {
        e.preventDefault()
        showControls()
      }
    }

    // ── menus ──
    useEffect(() => {
      if (!menuOpen && !ctx) return
      const onDown = (e: PointerEvent) => {
        const t = e.target as Node
        if (
          rootRef.current?.querySelector('[role="menu"]')?.contains(t) ||
          gearRef.current?.contains(t)
        )
          return
        setMenuOpen(false)
        setCtx(null)
      }
      document.addEventListener('pointerdown', onDown)
      return () => document.removeEventListener('pointerdown', onDown)
    }, [menuOpen, ctx])

    const closeMenu = (restoreFocus: boolean) => {
      setMenuOpen(false)
      if (restoreFocus) gearRef.current?.focus()
    }

    const allSources = sources ?? []
    const pages: Record<string, MenuPage> = { root: { rows: [] } }
    const rootRows = (pages.root as MenuPage).rows
    const levelLabel = (l: VideoEngineLevel) => l.label ?? `${l.height}p`
    if (settings.includes('quality') && levels.length > 1) {
      const playing = levels[playingLevel]
      rootRows.push({
        type: 'link',
        id: 'quality',
        icon: <QualityIcon />,
        label: labels.quality,
        value:
          level === -1
            ? `${labels.auto}${playing ? ` · ${levelLabel(playing)}` : ''}`
            : levelLabel(levels[level] as VideoEngineLevel),
        page: 'quality',
      })
      const pick = (i: number) => () => actions.setLevel(i)
      pages.quality = {
        title: labels.quality,
        rows: [
          {
            type: 'radio',
            id: 'q-auto',
            label: labels.auto,
            checked: level === -1,
            onSelect: pick(-1),
          },
          ...levels
            .map((l, i) => ({ l, i }))
            .sort((a, b) => b.l.height - a.l.height)
            .map(({ l, i }) => ({
              type: 'radio' as const,
              id: `q-l${i}`,
              label: (
                <>
                  {levelLabel(l)}
                  {l.height >= 720 ? <span className={s.hdTag()}>HD</span> : null}
                </>
              ),
              checked: level === i,
              onSelect: pick(i),
            })),
        ],
      }
    } else if (settings.includes('quality') && allSources.length > 1) {
      const cur = allSources[sourceIndex] as VideoSource
      rootRows.push({
        type: 'link',
        id: 'quality',
        icon: <QualityIcon />,
        label: labels.quality,
        value: sourceLabel(cur),
        page: 'quality',
      })
      pages.quality = {
        title: labels.quality,
        rows: allSources.map((src, i) => ({
          type: 'radio' as const,
          id: `q${i}`,
          label: (
            <>
              {sourceLabel(src)}
              {isHd(src) ? <span className={s.hdTag()}>HD</span> : null}
            </>
          ),
          checked: i === sourceIndex,
          onSelect: () => {
            if (i !== sourceIndex) {
              actions.setSource(i)
              onQualityChange?.(src, i)
            }
          },
        })),
      }
    }
    if (settings.includes('speed')) {
      rootRows.push({
        type: 'link',
        id: 'speed',
        icon: <SpeedIcon />,
        label: labels.speed,
        value: rate === 1 ? labels.normal : `${rate}×`,
        page: 'speed',
      })
      pages.speed = {
        title: labels.speed,
        rows: playbackRates.map((r) => ({
          type: 'radio' as const,
          id: `r${r}`,
          label: r === 1 ? labels.normal : `${r}×`,
          checked: r === rate,
          onSelect: () => actions.setPlaybackRate(r),
        })),
      }
    }
    if (settings.includes('captions') && captionTracks.length) {
      const current = state.captionTracks.find((t) => t.key === captionKey)
      rootRows.push({
        type: 'link',
        id: 'captions',
        icon: <CaptionsIcon />,
        label: labels.subtitles,
        value: current?.label ?? labels.off,
        page: 'captions',
      })
      pages.captions = {
        title: labels.subtitles,
        rows: [
          {
            type: 'radio',
            id: 'off',
            label: labels.off,
            checked: captionKey === null,
            onSelect: () => actions.setCaptionTrack(null),
          },
          ...state.captionTracks.map((t) => ({
            type: 'radio' as const,
            id: `c-${t.key}`,
            label: t.label,
            checked: t.key === captionKey,
            onSelect: () => actions.setCaptionTrack(t.key),
          })),
          {
            type: 'link',
            id: 'style',
            icon: <TypeIcon />,
            label: labels.captionStyle,
            page: 'style',
          },
        ],
      }
      const chip = <K extends keyof typeof captionStyle>(
        key: K,
        id: (typeof captionStyle)[K],
        label: string,
        swatch?: string,
      ) => ({
        id: String(id),
        label,
        swatch,
        checked: captionStyle[key] === id,
        onSelect: () => setCaptionStyle((cs) => ({ ...cs, [key]: id })),
      })
      pages.style = {
        title: labels.captionStyle,
        rows: [
          {
            type: 'chips',
            id: 'size',
            label: labels.size,
            options: [
              chip('size', 'S', labels.small),
              chip('size', 'M', labels.medium),
              chip('size', 'L', labels.large),
            ],
          },
          {
            type: 'chips',
            id: 'color',
            label: labels.textColor,
            options: [
              chip('color', 'text', labels.white, 'var(--sk-text)'),
              chip('color', 'premium', labels.champagne, 'var(--sk-premium)'),
            ],
          },
          {
            type: 'chips',
            id: 'bg',
            label: labels.background,
            options: [
              chip('bg', 'solid', labels.solid),
              chip('bg', 'soft', labels.soft),
              chip('bg', 'none', labels.outline),
            ],
          },
        ],
      }
    }

    const pictureChips = (
      key: 'zoom' | 'brightness' | 'contrast' | 'saturate',
      label: string,
      values: number[],
      format: (n: number) => string,
    ) => ({
      type: 'chips' as const,
      id: key,
      label,
      options: values.map((v) => ({
        id: String(v),
        label: format(v),
        checked: picture[key] === v,
        onSelect: () => setPicture((p) => ({ ...p, [key]: v })),
      })),
    })
    const pct = (n: number) => `${Math.round(n * 100)}%`
    const pctRaw = (n: number) => `${n}%`
    if (settings.includes('picture')) {
      const adjusted = JSON.stringify(picture) !== JSON.stringify(DEFAULT_PICTURE)
      rootRows.push({
        type: 'link',
        id: 'picture',
        icon: <SunIcon />,
        label: labels.picture,
        value: adjusted ? labels.pictureAdjusted : labels.pictureDefault,
        page: 'picture',
      })
      pages.picture = {
        title: labels.picture,
        rows: [
          pictureChips('zoom', labels.zoom, [1, 1.25, 1.5, 2], pct),
          {
            type: 'toggle',
            id: 'mirror',
            label: labels.mirror,
            checked: picture.mirror,
            onToggle: () => setPicture((p) => ({ ...p, mirror: !p.mirror })),
          },
          pictureChips('brightness', labels.brightness, [75, 100, 125], pctRaw),
          pictureChips('contrast', labels.contrast, [75, 100, 125, 150], pctRaw),
          pictureChips('saturate', labels.saturation, [0, 100, 150], pctRaw),
          {
            type: 'action',
            id: 'reset',
            label: labels.resetPicture,
            onSelect: () => setPicture(DEFAULT_PICTURE),
          },
        ],
      }
    }
    if (settings.includes('sleep')) {
      const sleepLabel = (v: typeof sleep) =>
        v === 'off' ? labels.off : v === 'end' ? labels.endOfVideo : labels.sleepMinutes(v)
      rootRows.push({
        type: 'link',
        id: 'sleep',
        icon: <MoonIcon />,
        label: labels.sleepTimer,
        value: sleepLabel(sleep),
        page: 'sleep',
      })
      pages.sleep = {
        title: labels.sleepTimer,
        rows: (['off', 15, 30, 60, 'end'] as const).map((v) => ({
          type: 'radio' as const,
          id: `s-${v}`,
          label: sleepLabel(v),
          checked: sleep === v,
          onSelect: () => setSleep(v),
        })),
      }
    }
    if (settings.includes('loop')) {
      const t = currentTime
      const abLabel =
        loop.a !== undefined && loop.b !== undefined
          ? labels.loopCustom(formatTime(loop.a, duration), formatTime(loop.b, duration))
          : null
      rootRows.push({
        type: 'link',
        id: 'loop',
        icon: <LoopIcon />,
        label: labels.loop,
        value:
          loop.mode === 'video'
            ? labels.loopVideo
            : loop.mode === 'chapter'
              ? labels.loopChapter
              : loop.mode === 'ab'
                ? abLabel
                : labels.off,
        page: 'loop',
      })
      const radio = (mode: LoopMode, label: string) => ({
        type: 'radio' as const,
        id: `l-${mode}`,
        label,
        checked: loop.mode === mode,
        onSelect: () => setLoop((l) => ({ ...l, mode })),
      })
      pages.loop = {
        title: labels.loop,
        rows: [
          radio('off', labels.off),
          radio('video', labels.loopVideo),
          ...(chapters.length ? [radio('chapter', labels.loopChapter)] : []),
          ...(abLabel ? [radio('ab', abLabel)] : []),
          {
            type: 'action',
            id: 'a',
            label: labels.setLoopStart(formatTime(t, duration)),
            onSelect: () =>
              setLoop((l) => ({
                a: t,
                b: l.b !== undefined && l.b > t ? l.b : undefined,
                mode: 'ab',
              })),
          },
          {
            type: 'action',
            id: 'b',
            label: labels.setLoopEnd(formatTime(t, duration)),
            onSelect: () =>
              setLoop((l) => ({ a: l.a !== undefined && l.a < t ? l.a : 0, b: t, mode: 'ab' })),
          },
        ],
      }
    }
    if (settings.includes('snapshot')) {
      rootRows.push({
        type: 'action',
        id: 'snapshot',
        icon: <CameraIcon />,
        label: labels.snapshot,
        onSelect: takeSnapshot,
      })
    }
    if (settings.includes('download') && download) {
      rootRows.push({
        type: 'action',
        id: 'download',
        icon: <DownloadIcon />,
        label: labels.download,
        onSelect: () => {
          const file = typeof download === 'string' ? { src: download } : download
          saveUrl(file.src, file.filename ?? file.src.split('/').pop() ?? 'video')
        },
      })
    }

    function takeSnapshot() {
      const v = video()
      const t = v.currentTime
      try {
        const canvas = document.createElement('canvas')
        canvas.width = v.videoWidth
        canvas.height = v.videoHeight
        const c2d = canvas.getContext('2d')
        if (!c2d) throw new Error('no canvas')
        c2d.drawImage(v, 0, 0)
        canvas.toBlob((blob) => {
          if (!blob) return setToast(labels.snapshotBlocked)
          if (onSnapshot) onSnapshot(blob, t)
          else {
            const url = URL.createObjectURL(blob)
            saveUrl(url, `${(name ?? 'video').replace(/[^\w-]+/g, '-')}-${Math.floor(t)}s.png`)
            URL.revokeObjectURL(url)
          }
          setToast(labels.snapshotSaved)
        }, 'image/png')
      } catch {
        setToast(labels.snapshotBlocked)
      }
    }

    const copy = (text: string) => {
      navigator.clipboard?.writeText(text).catch(() => {})
      setCtx(null)
    }
    const pageUrl = () => window.location.href.split('#')[0] as string
    const withTime = (url: string) => {
      const u = new URL(url)
      u.searchParams.set('t', String(Math.floor(video().currentTime)))
      return u.toString()
    }

    // ── derived UI ──
    const name = title ?? ariaLabel
    const cue = captionKey ? cueAt(cues, currentTime) : undefined
    const showTouch = coarse && touchControls && !error
    const volumeLevel = muted || volume === 0 ? 'mute' : volume < 0.5 ? 'low' : 'high'
    const chapter = chapters[chapterIndex]
    const current = allSources[sourceIndex]
    const docked = floating && offscreen && started && !paused && !dockDismissed && !fullscreen
    const hasPanel = features.panelTabs.length > 0
    const timeBase = live ? liveRange.start : 0
    const atLiveEdge = liveRange.end - currentTime < 10

    const contextValue = useMemo<VideoPlayerContextValue>(
      () => ({ state, actions, labels, videoRef, features, registry }),
      // biome-ignore lint/correctness/useExhaustiveDependencies: state is rebuilt each render
      [state, actions, labels, features, registry],
    )

    const frame = (
      <section
        ref={rootRef}
        aria-roledescription={labels.roleDescription}
        aria-label={name}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: focusable so hotkeys work after a click
        tabIndex={0}
        data-theme="dark"
        data-controls={hidden ? 'hidden' : 'shown'}
        data-docked={docked ? '' : undefined}
        data-panel={panel.open ? 'open' : undefined}
        className={s.root({ aspectRatio, fullscreen, docked, className })}
        style={style}
        onPointerMove={showControls}
        onPointerDown={showControls}
        onFocus={showControls}
        onKeyDown={onKeyDown}
        onContextMenu={(e) => {
          if (!contextMenu || (e.target as HTMLElement).closest('[role="menu"]')) return
          e.preventDefault()
          const r = e.currentTarget.getBoundingClientRect()
          setMenuOpen(false)
          setCtx({ x: e.clientX - r.left, y: e.clientY - r.top })
        }}
        onPointerLeave={(e) => {
          // Touch fires pointerleave when the finger lifts; only a mouse really leaves.
          if (e.pointerType === 'mouse' && !paused && autoHide && !holding) {
            clearTimeout(hideTimer.current)
            setHidden(true)
          }
        }}
      >
        <video
          ref={videoRef}
          className={s.video()}
          src={engineSrc ? undefined : mediaSrc}
          poster={poster}
          autoPlay={autoPlay || autoplayPolicy === 'muted'}
          muted={mutedProp || autoplayPolicy === 'muted'}
          playsInline={playsInline}
          style={
            JSON.stringify(picture) === JSON.stringify(DEFAULT_PICTURE)
              ? undefined
              : {
                  scale: `${picture.mirror ? -picture.zoom : picture.zoom} ${picture.zoom}`,
                  filter: `brightness(${picture.brightness}%) contrast(${picture.contrast}%) saturate(${picture.saturate}%)`,
                }
          }
          onClick={onVideoClick}
          onDoubleClick={() => {
            if (!coarse) actions.toggleFullscreen()
          }}
          {...videoProps}
          {...media}
        />

        <div className={s.scrimTop()} />
        <div className={s.scrimBottom()} />

        {title || logo || features.share ? (
          <div className={s.top()}>
            <div className={s.titleWrap()}>
              {title ? <div className={s.title()}>{title}</div> : null}
              {info ? <div className={s.info()}>{info}</div> : null}
            </div>
            {features.share ? (
              <button
                type="button"
                aria-label={labels.share}
                aria-haspopup="dialog"
                className={`${s.button()} ${s.compactHidden()}`}
                onClick={() => {
                  actions.pause()
                  actions.openShare()
                }}
              >
                <ShareIcon />
              </button>
            ) : null}
            {logo ? (
              logo.href ? (
                <a href={logo.href} className={s.logoLink()} target="_blank" rel="noreferrer">
                  <img src={logo.src} alt={logo.alt} className={s.logo()} />
                </a>
              ) : (
                <img src={logo.src} alt={logo.alt} className={s.logo()} />
              )
            ) : null}
          </div>
        ) : null}

        {cue ? (
          <div className={s.captionWrap()} aria-live="off">
            <span
              className={s.caption({
                captionSize: captionStyle.size,
                captionColor: captionStyle.color,
                captionBg: captionStyle.bg,
              })}
            >
              {cue.text}
            </span>
          </div>
        ) : null}

        <div className={s.center()}>
          {error ? (
            <div role="alert" className={s.errorPanel()}>
              <AlertIcon />
              <div className={s.errorTitle()}>{labels.errorTitle}</div>
              <p className={s.errorBody()}>{labels.errorBody}</p>
              <button
                type="button"
                className={s.retry()}
                onClick={() => {
                  setError(false)
                  if (engineSrc) setAttempt((n) => n + 1)
                  else video().load()
                }}
              >
                {labels.retry}
              </button>
            </div>
          ) : spinner ? (
            <Spinner size="lg" label={labels.loading} className={s.spinner()} />
          ) : showTouch && !hidden ? (
            <div className={s.touchRow()}>
              <button
                type="button"
                aria-label={labels.back(skipSeconds)}
                className={s.touchButton()}
                onClick={() => flashSeek(-1)}
              >
                <SkipIcon dir={-1} seconds={skipSeconds} />
              </button>
              <button
                type="button"
                aria-label={paused ? labels.play : labels.pause}
                className={s.bigPlay()}
                onClick={actions.togglePlay}
              >
                {paused ? <PlayIcon /> : <PauseIcon />}
              </button>
              <button
                type="button"
                aria-label={labels.forward(skipSeconds)}
                className={s.touchButton()}
                onClick={() => flashSeek(1)}
              >
                <SkipIcon dir={1} seconds={skipSeconds} />
              </button>
            </div>
          ) : !started && !showTouch ? (
            <button
              type="button"
              aria-label={labels.playTitle(name as string)}
              className={s.bigPlay()}
              onClick={actions.play}
            >
              <PlayIcon />
            </button>
          ) : null}
        </div>

        {flash ? (
          <div
            className={`${s.flash()} ${flash < 0 ? s.flashLeft() : s.flashRight()}`}
            aria-hidden="true"
          >
            <div>
              <SkipIcon dir={flash} seconds={skipSeconds} />
              {flash < 0 ? '−' : '+'}
              {skipSeconds}
            </div>
          </div>
        ) : null}

        {unmuteChip && muted ? (
          <button type="button" className={s.unmute()} onClick={actions.toggleMute}>
            <VolumeIcon level="mute" />
            {labels.tapToUnmute}
          </button>
        ) : null}

        {resumeAt !== null ? (
          <div className={s.resume()}>
            <span>{labels.resumeFrom(formatTime(resumeAt, duration))}</span>
            <button type="button" className={s.retry()} onClick={() => setResumeAt(null)}>
              {labels.startOver}
            </button>
            <button
              type="button"
              className={s.primary()}
              onClick={() => {
                actions.seek(resumeAt)
                setResumeAt(null)
                actions.play()
              }}
            >
              {labels.resume}
            </button>
          </div>
        ) : null}

        {toast ? (
          <div role="status" className={s.toast()}>
            {toast}
          </div>
        ) : null}

        <div className={s.parts()}>{children}</div>

        {limited && watchLimit ? (
          <div aria-live="polite" className={s.cover()}>
            {watchLimit.content}
          </div>
        ) : null}

        <div ref={barRef} className={s.bar()}>
          <SeekBar
            current={currentTime - timeBase}
            duration={live ? liveRange.end - liveRange.start : duration}
            buffered={buffered - timeBase}
            chapters={live ? NO_CHAPTERS : chapters}
            thumbnails={live ? NO_THUMBS : thumbnails}
            labels={labels}
            onSeek={(t) => actions.seek(t + timeBase)}
            onDraggingChange={setDragging}
            range={loopRange}
          />
          <div className={s.row()}>
            {playlist ? (
              <button
                type="button"
                aria-label={labels.previous}
                className={`${s.button()} ${s.midHidden()}`}
                disabled={!hasPrevious && currentTime <= 3}
                onClick={actions.previous}
              >
                <PrevIcon />
              </button>
            ) : null}
            <button
              type="button"
              aria-label={ended ? labels.replay : paused ? labels.play : labels.pause}
              className={s.button()}
              onClick={actions.togglePlay}
            >
              {ended ? <ReplayIcon /> : paused ? <PlayIcon /> : <PauseIcon />}
            </button>
            {playlist ? (
              <button
                type="button"
                aria-label={labels.next}
                className={s.button()}
                disabled={!hasNext}
                onClick={actions.next}
              >
                <NextIcon />
              </button>
            ) : null}
            <button
              type="button"
              aria-label={labels.back(skipSeconds)}
              className={`${s.button()} ${s.midHidden()}`}
              onClick={() => actions.skip(-skipSeconds)}
            >
              <SkipIcon dir={-1} seconds={skipSeconds} />
            </button>
            <button
              type="button"
              aria-label={labels.forward(skipSeconds)}
              className={`${s.button()} ${s.midHidden()}`}
              onClick={() => actions.skip(skipSeconds)}
            >
              <SkipIcon dir={1} seconds={skipSeconds} />
            </button>
            <div className={s.volumeGroup()}>
              <button
                type="button"
                aria-label={volumeLevel === 'mute' ? labels.unmute : labels.mute}
                className={s.button()}
                onClick={actions.toggleMute}
              >
                <VolumeIcon level={volumeLevel} />
              </button>
              <div className={s.volumeSlide()}>
                <VolumeSlider
                  value={muted ? 0 : volume}
                  label={labels.volume}
                  onChange={actions.setVolume}
                />
              </div>
            </div>
            {live ? (
              <>
                <button
                  type="button"
                  data-edge={atLiveEdge ? '' : undefined}
                  aria-label={atLiveEdge ? labels.live : labels.goLive}
                  className={s.live()}
                  onClick={() => actions.seek(liveRange.end)}
                >
                  {labels.live.toUpperCase()}
                </button>
                {atLiveEdge ? null : (
                  <div className={s.time()}>
                    <span className={s.timeDim()}>−{formatTime(liveRange.end - currentTime)}</span>
                    <span className={s.srOnly()}>
                      {labels.behindLive(formatTime(liveRange.end - currentTime))}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className={s.time()}>
                <span>{formatTime(currentTime, duration)}</span>{' '}
                <span className={s.timeDim()}>/ {formatTime(duration)}</span>
              </div>
            )}
            {chapter ? (
              <button
                type="button"
                aria-label={`${labels.chapters}: ${chapter.title}`}
                className={s.chapterButton()}
                onClick={() =>
                  features.panelTabs.includes('chapters')
                    ? actions.openPanel('chapters')
                    : actions.seek(chapter.start)
                }
              >
                <span className={s.chapterDot()}>·</span>
                <span className={s.chapterName()}>{chapter.title}</span>
                <ChevronIcon dir="right" />
              </button>
            ) : null}
            <div className={s.spacer()} />
            {captionTracks.length ? (
              <button
                type="button"
                aria-label={captionKey ? labels.captionsOff : labels.captionsOn}
                aria-pressed={captionKey !== null}
                className={s.button()}
                onClick={toggleCaptions}
              >
                <CaptionsIcon />
              </button>
            ) : null}
            {rootRows.length ? (
              <button
                ref={gearRef}
                type="button"
                aria-label={labels.settings}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className={s.button()}
                onClick={() => {
                  setCtx(null)
                  setMenuOpen((o) => !o)
                }}
              >
                <GearIcon />
                {(
                  levels.length
                    ? (levels[level === -1 ? playingLevel : level]?.height ?? 0) >= 720
                    : current && isHd(current)
                ) ? (
                  <span className={s.hdBadge()} aria-hidden="true">
                    HD
                  </span>
                ) : null}
              </button>
            ) : null}
            {hasPanel ? (
              <button
                type="button"
                aria-label={labels.panel}
                aria-pressed={panel.open}
                className={`${s.button()} ${s.compactHidden()}`}
                onClick={() => (panel.open ? actions.closePanel() : actions.openPanel())}
              >
                <ListIcon />
              </button>
            ) : null}
            {showTheater ? (
              <button
                type="button"
                aria-label={labels.theater}
                aria-pressed={theater}
                className={`${s.button()} ${s.midHidden()}`}
                onClick={actions.toggleTheater}
              >
                <TheaterIcon />
              </button>
            ) : null}
            {support.airplay ? (
              <button
                type="button"
                aria-label={labels.airplay}
                className={`${s.button()} ${s.midHidden()}`}
                onClick={() => video().webkitShowPlaybackTargetPicker?.()}
              >
                <AirPlayIcon />
              </button>
            ) : null}
            {support.pip ? (
              <button
                type="button"
                aria-label={labels.pip}
                aria-pressed={pip}
                className={`${s.button()} ${s.compactHidden()}`}
                onClick={actions.togglePictureInPicture}
              >
                <PipIcon />
              </button>
            ) : null}
            {support.fullscreen ? (
              <button
                type="button"
                aria-label={fullscreen ? labels.exitFullscreen : labels.enterFullscreen}
                className={s.button()}
                onClick={actions.toggleFullscreen}
              >
                <FullscreenIcon exit={fullscreen} />
              </button>
            ) : null}
          </div>
        </div>

        {menuOpen ? (
          <SettingsMenu
            label={labels.settings}
            backLabel={labels.backToSettings}
            pages={pages}
            onClose={closeMenu}
          />
        ) : null}

        {ctx ? (
          <SettingsMenu
            label={labels.videoOptions}
            backLabel={labels.backToSettings}
            className={s.contextMenu()}
            style={{ left: ctx.x, top: ctx.y }}
            onClose={() => {
              setCtx(null)
              rootRef.current?.focus()
            }}
            pages={{
              root: {
                rows: [
                  {
                    type: 'action',
                    id: 'copy',
                    icon: <LinkIcon />,
                    label: labels.copyLink,
                    onSelect: () => copy(pageUrl()),
                  },
                  {
                    type: 'action',
                    id: 'copy-t',
                    icon: <LinkIcon />,
                    label: labels.copyLinkAt(formatTime(currentTime, duration)),
                    onSelect: () => copy(withTime(pageUrl())),
                  },
                  {
                    type: 'action',
                    id: 'keys',
                    icon: <KeyboardIcon />,
                    label: labels.shortcuts,
                    onSelect: () => {
                      setCtx(null)
                      setShortcuts(true)
                    },
                  },
                ],
              },
            }}
          />
        ) : null}

        {shortcuts ? (
          <div role="dialog" aria-modal="false" aria-label={labels.shortcuts} className={s.cover()}>
            <button
              type="button"
              aria-label={labels.close}
              className={s.close()}
              ref={focusOnMount}
              onClick={() => {
                setShortcuts(false)
                rootRef.current?.focus()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShortcuts(false)
                  rootRef.current?.focus()
                }
              }}
            >
              <CloseIcon />
            </button>
            <div className={s.shortcuts()}>
              <div className={s.menuHeadTitle()}>{labels.shortcuts}</div>
              <dl className={s.shortcutsGrid()}>
                {labels.shortcutList(skipSeconds).map(([keys, what]) => (
                  <div key={keys} className="contents">
                    <dt className={s.kbd()}>{keys}</dt>
                    <dd>{what}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ) : null}

        {docked ? (
          <button
            type="button"
            aria-label={labels.closeMiniPlayer}
            className={s.dockClose()}
            onClick={() => setDockDismissed(true)}
          >
            <CloseIcon />
          </button>
        ) : null}
      </section>
    )

    return (
      <VideoPlayerContext.Provider value={contextValue}>
        {floating ? (
          <div
            ref={hostRef}
            className={s.host()}
            style={docked ? { height: hostHeight } : undefined}
          >
            {frame}
          </div>
        ) : (
          frame
        )}
      </VideoPlayerContext.Provider>
    )
  },
)
