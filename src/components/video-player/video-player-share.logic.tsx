'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useVideoPlayer } from './video-player.context'
import { CloseIcon } from './video-player.icons'
import { formatTime } from './video-player.utils'
import { videoPlayerPartsStyles } from './video-player-parts.styles'

/** Props for {@link VideoPlayerShare}. */
export interface VideoPlayerShareProps {
  /** Link to share. Defaults to the current page URL (without the hash). */
  url?: string
  /** Embed code to offer, or a function building it from the shared URL. Omit to hide it. */
  embed?: string | ((url: string) => string)
}

/**
 * A share sheet inside the player: the link (optionally starting at the current time) with a
 * copy button, and embed code when `embed` is given. Mounting it adds a Share button to the top
 * bar (and to `VideoPlayerEndScreen`).
 *
 * @remarks
 * - Accessibility: a labelled `dialog` over the frame; focus moves to the link field on open,
 *   Escape or Close returns to the player. "Copied" feedback is announced via `aria-live`.
 * - Copying uses the Clipboard API in the click handler; when it's unavailable the field text is
 *   selected so the viewer can copy it by hand.
 *
 * @example
 * ```tsx
 * import { VideoPlayer, VideoPlayerShare } from 'sukuna-ui'
 *
 * <VideoPlayer title="Last Train, Shibuya" src="/v/shibuya.mp4">
 *   <VideoPlayerShare
 *     url="https://sukuna.video/watch/shibuya"
 *     embed={(url) => `<iframe src="${url}/embed" width="640" height="360" allowfullscreen></iframe>`}
 *   />
 * </VideoPlayer>
 * ```
 */
export function VideoPlayerShare({ url, embed }: VideoPlayerShareProps) {
  const { state, actions, labels, registry } = useVideoPlayer()
  const s = videoPlayerPartsStyles()
  const id = useId()
  const [atTime, setAtTime] = useState(false)
  const [copied, setCopied] = useState<'link' | 'embed' | null>(null)
  const linkRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    registry.setFeature('share', true)
    return () => registry.setFeature('share', false)
  }, [registry])

  // Reset the sheet and focus the link each time it opens.
  useEffect(() => {
    if (!state.shareOpen) return
    setCopied(null)
    linkRef.current?.focus({ preventScroll: true })
  }, [state.shareOpen])

  if (!state.shareOpen) return null

  const base = url ?? window.location.href.split('#')[0] ?? ''
  const link = (() => {
    if (!atTime) return base
    const u = new URL(base, window.location.href)
    u.searchParams.set('t', String(Math.floor(state.currentTime)))
    return u.toString()
  })()
  const embedCode = typeof embed === 'function' ? embed(base) : embed

  // Clipboard API first; when it's missing or refused, select the text for a manual copy.
  const copy = (text: string, which: 'link' | 'embed', field: string) => {
    const select = () => (document.getElementById(field) as HTMLInputElement | null)?.select()
    const pending = navigator.clipboard?.writeText?.(text)
    if (pending) pending.then(() => setCopied(which), select)
    else select()
  }
  const close = () => actions.closeShare()

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={labels.shareTitle}
      className={s.cover()}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          close()
        }
      }}
    >
      <button type="button" aria-label={labels.close} className={s.close()} onClick={close}>
        <CloseIcon />
      </button>
      <div className={s.coverCard()}>
        <h3 className={s.heading()}>{labels.shareTitle}</h3>
        <div className={s.field()}>
          <input
            id={`${id}-link`}
            type="text"
            readOnly
            aria-label={labels.videoLink}
            value={link}
            className={s.input()}
            ref={linkRef}
            onFocus={(e) => e.currentTarget.select()}
          />
          <button
            type="button"
            className={s.primary()}
            onClick={() => copy(link, 'link', `${id}-link`)}
          >
            {copied === 'link' ? labels.copied : labels.copyLink}
          </button>
        </div>
        <label className={s.check()}>
          <input type="checkbox" checked={atTime} onChange={(e) => setAtTime(e.target.checked)} />
          {labels.startAt(formatTime(state.currentTime, state.duration))}
        </label>
        {embedCode ? (
          <>
            <label htmlFor={`${id}-embed`} className={s.label()}>
              {labels.embedCode}
            </label>
            <textarea id={`${id}-embed`} readOnly value={embedCode} className={s.embed()} />
            <div className={s.buttons()}>
              <button
                type="button"
                className={s.secondary()}
                onClick={() => copy(embedCode, 'embed', `${id}-embed`)}
              >
                {copied === 'embed' ? labels.copied : labels.copyEmbed}
              </button>
            </div>
          </>
        ) : null}
        <span aria-live="polite" className="sr-only">
          {copied ? labels.copied : ''}
        </span>
      </div>
    </div>
  )
}
