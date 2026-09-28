'use client'

import { type ReactNode, useState } from 'react'
import { useVideoPlayer } from './video-player.context'
import { CloseIcon } from './video-player.icons'
import { videoPlayerPartsStyles } from './video-player-parts.styles'

/** Props for {@link VideoPlayerOverlay}. */
export interface VideoPlayerOverlayProps {
  /** Content: a promo card, a sponsor note, a call to action, a lower third… */
  children: ReactNode
  /** Accessible name of the overlay region. */
  'aria-label': string
  /** Seconds where it appears (inclusive). Omit to show from the start. */
  start?: number
  /** Seconds where it disappears. Omit to keep it to the end. */
  end?: number
  /**
   * `'time'` shows it inside `start`–`end` while playing or paused; `'pause'` only while paused
   * inside the window (a "banner on pause").
   * @default 'time'
   */
  showOn?: 'time' | 'pause'
  /**
   * `card`: a floating panel at `placement`. `banner`: a full-width strip above the control bar
   * (`placement` ignored). `plain`: no chrome, just positioned.
   * @default 'card'
   */
  variant?: 'card' | 'banner' | 'plain'
  /**
   * Corner (or centre) for `card` / `plain`.
   * @default 'top-right'
   */
  placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  /**
   * Show a close button; once closed it stays closed for this player instance.
   * @default false
   */
  dismissible?: boolean
}

/**
 * Timed content over the video: promo cards, sponsor notes, banners shown on pause, lower thirds.
 * Mount one per overlay.
 *
 * @remarks
 * - Accessibility: a labelled `region`. Its content isn't announced when it appears; add your own
 *   live region inside if it must be. Banners sit above the control bar, never over it, and
 *   overlays stay visible when the controls auto-hide.
 * - A scrolling news-ticker variant waits on a new `theme.css` keyframe (owner approval, Q25).
 *
 * @example
 * ```tsx
 * import { VideoPlayer, VideoPlayerOverlay } from '@sukuna-ui/video'
 *
 * <VideoPlayer title="Night food walk" src="/v/food.mp4">
 *   <VideoPlayerOverlay aria-label="Tour offer" start={30} end={45} dismissible>
 *     Book this walk with a local guide.{' '}
 *     <a href="/tours/night-food">See tours</a>
 *   </VideoPlayerOverlay>
 *   <VideoPlayerOverlay aria-label="Sponsor" showOn="pause" variant="banner">
 *     Brought to you by Sukuna Sound.
 *   </VideoPlayerOverlay>
 * </VideoPlayer>
 * ```
 */
export function VideoPlayerOverlay({
  children,
  'aria-label': ariaLabel,
  start = 0,
  end = Number.POSITIVE_INFINITY,
  showOn = 'time',
  variant = 'card',
  placement = 'top-right',
  dismissible = false,
}: VideoPlayerOverlayProps) {
  const { state, labels } = useVideoPlayer()
  const s = videoPlayerPartsStyles({ placement: variant === 'banner' ? undefined : placement })
  const [dismissed, setDismissed] = useState(false)
  const t = state.currentTime
  const inWindow = t >= start && t < end
  const visible = !dismissed && inWindow && (showOn === 'time' || (state.paused && state.started))
  if (!visible) return null

  const chrome =
    variant === 'banner'
      ? s.overlayBanner()
      : variant === 'plain'
        ? s.overlayPlain()
        : s.overlayCard()

  return (
    <section aria-label={ariaLabel} className={`${s.overlay()} ${chrome}`}>
      {children}
      {dismissible ? (
        <button
          type="button"
          aria-label={labels.close}
          className={s.overlayClose()}
          onClick={() => setDismissed(true)}
        >
          <CloseIcon />
        </button>
      ) : null}
    </section>
  )
}
