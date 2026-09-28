'use client'

// Shared state for VideoPlayer and its parts. `useVideoPlayer()` is public: apps use it to build
// their own parts or a fully custom (chromeless) UI on top of the player's state.
import { createContext, type ReactNode, type RefObject, useContext } from 'react'
import type { VideoPlayerLabels } from './video-player.labels'
import type { Chapter, ThumbnailCue, VideoSource, VttCue } from './video-player.utils'

/** A text track loaded by the player (fetched and rendered by us, not the browser). */
export interface VideoTrack {
  /** `captions` / `subtitles` show in the CC menu; `chapters` drive the segmented bar. */
  kind: 'captions' | 'subtitles' | 'chapters'
  /** WebVTT URL. The server must allow CORS when it's on another origin. */
  src: string
  /** BCP 47 language, e.g. `en`. Used as the track key. */
  srclang?: string
  /** Menu label, e.g. `English`. */
  label?: string
  /** Show this caption track on load. */
  default?: boolean
}

/** One video in a {@link VideoPlayerPlaylist}. Same media fields as `VideoPlayer` itself. */
export interface VideoPlaylistItem {
  /** Stable id; used by `rememberKey` / `resume` and as the React key. Falls back to the index. */
  id?: string
  /** Shown as the player title and in the playlist. */
  title: string
  /** Line under the title. */
  info?: ReactNode
  /** Poster frame for this item. */
  poster?: string
  /** 16:9 thumbnail for the playlist and "Up next" (80×45 or larger). */
  thumb?: string
  /** Duration in seconds, shown in the playlist before the item loads. */
  duration?: number
  /** Single media URL (or use `sources`). */
  src?: string
  /** Renditions for the quality menu. */
  sources?: VideoSource[]
  /** Caption / subtitle / chapter tracks. */
  tracks?: VideoTrack[]
  /** Inline chapters. */
  chapters?: Chapter[]
  /** Hover-preview thumbnails (VTT URL or cues). */
  thumbnails?: string | ThumbnailCue[]
}

/** One quality level reported by a streaming engine (HLS / DASH renditions). */
export interface VideoEngineLevel {
  /** Vertical resolution in pixels. */
  height: number
  /** Bits per second. */
  bitrate?: number
  /** Name from the manifest, if any. */
  label?: string
}

/** What a streaming engine tells the player. */
export interface VideoEngineCallbacks {
  /** The manifest's quality levels, lowest first or in manifest order. */
  onLevels: (levels: VideoEngineLevel[]) => void
  /** The level now playing (also while on Auto). */
  onLevelChange: (index: number) => void
  /** An error the engine couldn't recover from; the player shows its error state. */
  onFatalError: () => void
}

/** A live engine attachment. */
export interface VideoEngineSession {
  /** Pin a level by index, or `-1` for automatic (adaptive) selection. */
  setLevel: (index: number) => void
  /** Detach and free everything (called on source change and unmount). */
  destroy: () => void
}

/**
 * A streaming engine the player can hand a source to (Tier 3 seam). `@sukuna-ui/video/hls` ships
 * one for hls.js; write your own for dash.js, Shaka or a DRM stack.
 */
export interface VideoEngine {
  /** For debugging and error messages. */
  name: string
  /**
   * Whether this engine plays `src`. Decided from the URL alone so the server and client render
   * the same `<video>`; the player then never sets `src` itself.
   */
  handles: (src: string) => boolean
  /** Load `src` into `video`. Runs in an effect, never on the server. */
  attach: (
    video: HTMLVideoElement,
    src: string,
    callbacks: VideoEngineCallbacks,
  ) => VideoEngineSession
}

/** A caption or subtitle track the player can show. */
export interface VideoCaptionTrack {
  /** Stable key: `srclang`, else `label`, else `src`. */
  key: string
  /** Menu label. */
  label: string
}

/** Tabs the side panel can show. */
export type VideoPanelTab = 'chapters' | 'playlist' | 'transcript'

/** Playlist position, when a {@link VideoPlayerPlaylist} is mounted. */
export interface VideoPlayerPlaylistState {
  items: VideoPlaylistItem[]
  index: number
  hasNext: boolean
  hasPrevious: boolean
  /** Plays the next item when one ends. */
  autoAdvance: boolean
  /** Wraps from the last item to the first. */
  repeat: boolean
}

/** Read-only snapshot of the player, re-rendered on every media event. */
export interface VideoPlayerState {
  /** The player's title (the playlist item's when a playlist is mounted). */
  title: string | undefined
  /** Seconds played. */
  currentTime: number
  /** Media length in seconds; `NaN` until metadata loads. */
  duration: number
  /** End of the buffered range that contains `currentTime`, in seconds. */
  buffered: number
  paused: boolean
  ended: boolean
  /** True after the first `play` event. */
  started: boolean
  /** True while the media is stalled and the spinner shows. */
  waiting: boolean
  /** True after a media error, until Retry. */
  error: boolean
  /** 0–1. */
  volume: number
  muted: boolean
  playbackRate: number
  fullscreen: boolean
  pictureInPicture: boolean
  /** Chapters from the `chapters` prop or the chapters track. */
  chapters: Chapter[]
  /** Index of the chapter containing `currentTime`; -1 without chapters. */
  chapterIndex: number
  /** Renditions from `sources`. */
  sources: VideoSource[]
  /** Index into `sources` of the playing rendition. */
  sourceIndex: number
  /** Quality levels from a streaming `engine` (empty without one). */
  levels: VideoEngineLevel[]
  /** The pinned engine level, or `-1` for automatic. */
  level: number
  /** The engine level actually playing (useful on automatic). */
  playingLevel: number
  captionTracks: VideoCaptionTrack[]
  /** Key of the showing caption track, or `null` when captions are off. */
  captionTrack: string | null
  /**
   * Cues of the showing caption track, or of the last one shown when captions are off (the
   * transcript keeps working). Empty until fetched.
   */
  cues: VttCue[]
  /** False while the controls are auto-hidden. */
  controlsVisible: boolean
  /** Playlist position, or `null` without a `VideoPlayerPlaylist`. */
  playlist: VideoPlayerPlaylistState | null
  /** Side panel state. */
  panel: { open: boolean; tab: VideoPanelTab }
  shareOpen: boolean
  /** The viewer cancelled auto-advance for the current item ("Up next" → Cancel). */
  advanceCancelled: boolean
  theater: boolean
}

/** Commands for driving the player. All are safe to call at any time. */
export interface VideoPlayerActions {
  play: () => void
  pause: () => void
  togglePlay: () => void
  /** Restart from the beginning and play. */
  replay: () => void
  /** Jump to a time in seconds (clamped to the media). */
  seek: (time: number) => void
  /** Move by a signed number of seconds. */
  skip: (delta: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setPlaybackRate: (rate: number) => void
  /** Switch rendition, keeping position and play state. */
  setSource: (index: number) => void
  /** Pin a streaming-engine level, or `-1` for automatic. No-op without an engine. */
  setLevel: (index: number) => void
  /** Show a caption track by key, or `null` to hide captions. */
  setCaptionTrack: (key: string | null) => void
  toggleFullscreen: () => void
  togglePictureInPicture: () => void
  toggleTheater: () => void
  /** Reveal the controls and restart the auto-hide timer. */
  showControls: () => void
  /** Playlist: play the next / previous / given item. No-ops without a playlist. */
  next: () => void
  previous: () => void
  selectItem: (index: number) => void
  /** Stop auto-advance for the current item. */
  cancelAdvance: () => void
  openPanel: (tab?: VideoPanelTab) => void
  closePanel: () => void
  openShare: () => void
  closeShare: () => void
}

/** How a playlist part hands its items to the player. @internal Parts only. */
export interface PlaylistRegistration {
  items: VideoPlaylistItem[]
  index: number
  select: (index: number) => void
  autoAdvance: boolean
  repeat: boolean
}

/** Features parts announce so the core can show their buttons. @internal Parts only. */
export interface VideoPlayerFeatures {
  /** Tabs a mounted `VideoPlayerPanel` can show (empty without one). */
  panelTabs: VideoPanelTab[]
  /** A `VideoPlayerShare` is mounted. */
  share: boolean
}

export interface VideoPlayerContextValue {
  state: VideoPlayerState
  actions: VideoPlayerActions
  labels: VideoPlayerLabels
  /** The underlying `<video>` element. */
  videoRef: RefObject<HTMLVideoElement | null>
  /** Which built-in parts are mounted. */
  features: VideoPlayerFeatures
  /** @internal Used by the built-in parts to register themselves. */
  registry: {
    setPlaylist: (playlist: PlaylistRegistration | null) => void
    setFeature: <K extends keyof VideoPlayerFeatures>(key: K, value: VideoPlayerFeatures[K]) => void
  }
}

export const VideoPlayerContext = createContext<VideoPlayerContextValue | null>(null)

/**
 * State and actions of the nearest {@link VideoPlayer}. Use it inside a player's children to build
 * custom parts (a chapter list, a "next episode" card, analytics hooks…).
 *
 * @remarks
 * Throws when called outside a `VideoPlayer`, so a misplaced part fails loudly in development.
 *
 * @example
 * ```tsx
 * import { VideoPlayer, useVideoPlayer } from '@sukuna-ui/video'
 *
 * function JumpToEnd() {
 *   const { state, actions } = useVideoPlayer()
 *   return <button onClick={() => actions.seek(state.duration - 10)}>Last 10s</button>
 * }
 *
 * <VideoPlayer title="Demo" src="/demo.mp4">
 *   <JumpToEnd />
 * </VideoPlayer>
 * ```
 */
export function useVideoPlayer(): VideoPlayerContextValue {
  const value = useContext(VideoPlayerContext)
  if (!value) throw new Error('useVideoPlayer must be used inside <VideoPlayer>')
  return value
}
