'use client'

import { useVideoPlayer } from './video-player.context'
import { videoPlayerPartsStyles } from './video-player-parts.styles'

/** Props for {@link VideoPlayerUpNext}. */
export interface VideoPlayerUpNextProps {
  /**
   * Seconds before the end of an item when the card appears and counts down.
   * @default 10
   */
  countdown?: number
}

const CIRCUMFERENCE = 2 * Math.PI * 15

/**
 * The "Up next" card: in the last seconds of a playlist item it shows the next video with a
 * countdown ring, **Play now** and **Cancel** (which stops auto-advance for this item).
 *
 * @remarks
 * - Needs a `VideoPlayerPlaylist` with `autoAdvance` and a next item; renders nothing otherwise.
 * - Accessibility: a labelled `status` region, so the countdown is announced politely; both
 *   actions are real buttons.
 *
 * @example
 * ```tsx
 * import { VideoPlayer, VideoPlayerPlaylist, VideoPlayerUpNext } from '@sukuna-ui/video'
 *
 * <VideoPlayer title="Night walks">
 *   <VideoPlayerPlaylist items={episodes} />
 *   <VideoPlayerUpNext countdown={8} />
 * </VideoPlayer>
 * ```
 */
export function VideoPlayerUpNext({ countdown = 10 }: VideoPlayerUpNextProps) {
  const { state, actions, labels } = useVideoPlayer()
  const s = videoPlayerPartsStyles()
  const p = state.playlist
  const remaining = state.duration - state.currentTime
  if (!p?.autoAdvance || !p.hasNext || state.advanceCancelled || !state.started || state.ended)
    return null
  if (!Number.isFinite(remaining) || remaining > countdown) return null

  const next = p.items[(p.index + 1) % p.items.length]
  if (!next) return null
  const seconds = Math.max(0, Math.ceil(remaining))
  const progress = 1 - seconds / countdown

  return (
    <div
      role="status"
      aria-label={labels.upNextIn(seconds)}
      className={`${s.card()} ${s.upNext()}`}
    >
      <div className={s.upNextThumb()}>
        {next.thumb ? <img src={next.thumb} alt="" className={s.upNextImage()} /> : null}
        <svg viewBox="0 0 36 36" className={s.ring()} aria-hidden="true">
          <circle cx="18" cy="18" r="15" strokeWidth="3" className={s.ringTrack()} />
          <circle
            cx="18"
            cy="18"
            r="15"
            strokeWidth="3"
            className={s.ringValue()}
            strokeDasharray={`${(progress * CIRCUMFERENCE).toFixed(1)} ${CIRCUMFERENCE.toFixed(1)}`}
            transform="rotate(-90 18 18)"
          />
          <text x="18" y="22" textAnchor="middle" className={s.ringText()}>
            {seconds}
          </text>
        </svg>
      </div>
      <div className={s.meta()}>
        <span className={s.eyebrow()}>{labels.upNext}</span>
        <span className={s.upNextTitle()}>{next.title}</span>
      </div>
      <div className={s.actions()}>
        <button type="button" className={s.secondary()} onClick={actions.cancelAdvance}>
          {labels.cancel}
        </button>
        <button type="button" className={s.primary()} onClick={actions.next}>
          {labels.playNow}
        </button>
      </div>
    </div>
  )
}
