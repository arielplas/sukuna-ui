'use client'

import { useVideoPlayer } from './video-player.context'
import { formatTime } from './video-player.utils'
import { videoPlayerPartsStyles } from './video-player-parts.styles'

/** One suggestion on a {@link VideoPlayerEndScreen}. */
export interface VideoPlayerRelatedItem {
  /** Visible title; also the accessible name. */
  title: string
  /** 16:9 thumbnail URL. */
  thumb?: string
  /** Length in seconds. */
  duration?: number
  /** Renders the tile as a link. */
  href?: string
  /** Renders the tile as a button that calls this. Ignored when `href` is set. */
  onSelect?: () => void
}

/** Props for {@link VideoPlayerEndScreen}. */
export interface VideoPlayerEndScreenProps {
  /** Suggestions shown as a grid under "Watch next". */
  related?: VideoPlayerRelatedItem[]
}

/**
 * What the frame shows when a video ends (and a playlist isn't about to auto-advance): Replay,
 * Share (when a `VideoPlayerShare` is mounted) and a grid of related videos.
 *
 * @remarks
 * Accessibility: a labelled `region` over the frame; tiles are links (`href`) or buttons
 * (`onSelect`) with their title as the name.
 *
 * @example
 * ```tsx
 * import { VideoPlayer, VideoPlayerEndScreen } from '@sukuna-ui/video'
 *
 * <VideoPlayer title="Last Train, Shibuya" src="/v/shibuya.mp4">
 *   <VideoPlayerEndScreen
 *     related={[
 *       { title: 'Morning Market, Tsukiji', thumb: '/t/2.jpg', duration: 318, href: '/watch/tsukiji' },
 *       { title: 'Rain on Omoide Yokocho', thumb: '/t/3.jpg', duration: 197, href: '/watch/omoide' },
 *     ]}
 *   />
 * </VideoPlayer>
 * ```
 */
export function VideoPlayerEndScreen({ related = [] }: VideoPlayerEndScreenProps) {
  const { state, actions, labels, features } = useVideoPlayer()
  const s = videoPlayerPartsStyles()
  if (!state.ended || state.shareOpen) return null

  return (
    <section aria-label={labels.watchNext} className={s.cover()}>
      <div className={s.coverCard()}>
        <div className={s.coverHead()}>
          <h3 className={s.heading()}>{labels.watchNext}</h3>
          <div className={s.buttons()}>
            <button type="button" className={s.primary()} onClick={actions.replay}>
              {labels.replay}
            </button>
            {features.share ? (
              <button type="button" className={s.secondary()} onClick={actions.openShare}>
                {labels.share}
              </button>
            ) : null}
          </div>
        </div>
        {related.length ? (
          <div className={s.related()}>
            {related.map((r) => {
              const body = (
                <>
                  {r.thumb ? (
                    <img src={r.thumb} alt="" className={s.relatedImage()} />
                  ) : (
                    <span className={s.relatedImage()} />
                  )}
                  <span className={s.relatedTitle()}>{r.title}</span>
                  {r.duration ? (
                    <span className={s.relatedSub()}>{formatTime(r.duration)}</span>
                  ) : null}
                </>
              )
              return r.href ? (
                <a key={r.title} href={r.href} className={s.relatedItem()}>
                  {body}
                </a>
              ) : (
                <button
                  key={r.title}
                  type="button"
                  className={s.relatedItem()}
                  onClick={r.onSelect}
                >
                  {body}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
