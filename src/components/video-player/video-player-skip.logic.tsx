'use client'

import { useVideoPlayer } from './video-player.context'
import { NextIcon } from './video-player.icons'
import { videoPlayerPartsStyles } from './video-player-parts.styles'

/** Props for {@link VideoPlayerSkip}. */
export interface VideoPlayerSkipProps {
  /** Seconds where the button appears (inclusive). */
  start: number
  /** Seconds it skips to; the button hides from here on. */
  end: number
  /**
   * Button text.
   * @default labels.skipIntro ('Skip intro')
   */
  label?: string
}

/**
 * A "Skip intro" (or "Skip recap", "Skip credits") button that appears for a time range and jumps
 * to its end. Mount one per range.
 *
 * @remarks
 * Sits above the control bar and drops to the bottom edge when the controls hide, so it never
 * covers them. Appears only after playback has started.
 *
 * @example
 * ```tsx
 * import { VideoPlayer, VideoPlayerSkip } from 'sukuna-ui'
 *
 * <VideoPlayer title="Episode 3" src="/v/ep3.mp4">
 *   <VideoPlayerSkip start={0} end={42} />
 *   <VideoPlayerSkip start={1260} end={1320} label="Skip credits" />
 * </VideoPlayer>
 * ```
 */
export function VideoPlayerSkip({ start, end, label }: VideoPlayerSkipProps) {
  const { state, actions, labels } = useVideoPlayer()
  const s = videoPlayerPartsStyles()
  const t = state.currentTime
  if (!state.started || state.ended || t < start || t >= end) return null
  return (
    <button type="button" className={`${s.card()} ${s.skip()}`} onClick={() => actions.seek(end)}>
      {label ?? labels.skipIntro}
      <NextIcon />
    </button>
  )
}
