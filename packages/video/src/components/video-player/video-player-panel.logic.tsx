'use client'

import { type KeyboardEvent, useEffect, useId, useRef } from 'react'
import { useVideoPlayer, type VideoPanelTab } from './video-player.context'
import { CloseIcon } from './video-player.icons'
import { chapterEnd, cueAt, formatTime } from './video-player.utils'
import { videoPlayerPartsStyles } from './video-player-parts.styles'

/** Props for {@link VideoPlayerPanel}. */
export interface VideoPlayerPanelProps {
  /**
   * Tabs to offer, in order. Tabs with nothing to show are dropped: chapters need chapters,
   * playlist needs a `VideoPlayerPlaylist`, transcript needs a caption track.
   * @default ['chapters', 'playlist', 'transcript']
   */
  tabs?: VideoPanelTab[]
  /**
   * Open the panel on mount.
   * @default false
   */
  defaultOpen?: boolean
}

const ALL_TABS: VideoPanelTab[] = ['chapters', 'playlist', 'transcript']

/**
 * A side drawer inside the player with tabs for the chapter list, the playlist and a clickable
 * transcript. Opens from the list button in the control bar or the chapter label.
 *
 * @remarks
 * - Accessibility: a labelled `complementary` region with an ARIA tablist (←/→ move between tabs);
 *   the current chapter, item and caption line carry `aria-current`. Escape (with focus in the
 *   player) closes it.
 * - The transcript uses the showing caption track, or the last one shown when captions are off,
 *   and follows playback.
 * - Renders nothing while closed.
 *
 * @example
 * ```tsx
 * import { VideoPlayer, VideoPlayerPanel } from '@sukuna-ui/video'
 *
 * <VideoPlayer
 *   title="Lesson 4"
 *   src="/v/lesson-4.mp4"
 *   tracks={[
 *     { kind: 'chapters', src: '/v/lesson-4-chapters.vtt' },
 *     { kind: 'captions', src: '/v/lesson-4-en.vtt', srclang: 'en', label: 'English' },
 *   ]}
 * >
 *   <VideoPlayerPanel tabs={['chapters', 'transcript']} />
 * </VideoPlayer>
 * ```
 */
export function VideoPlayerPanel({ tabs = ALL_TABS, defaultOpen = false }: VideoPlayerPanelProps) {
  const { state, actions, labels, registry } = useVideoPlayer()
  const s = videoPlayerPartsStyles()
  const id = useId()
  const listRef = useRef<HTMLDivElement>(null)

  const available = tabs.filter((t) =>
    t === 'chapters'
      ? state.chapters.length > 0
      : t === 'playlist'
        ? state.playlist !== null
        : state.captionTracks.length > 0,
  )
  const availableKey = available.join()

  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the joined tab list
  useEffect(() => {
    registry.setFeature('panelTabs', available)
  }, [registry, availableKey])
  useEffect(() => () => registry.setFeature('panelTabs', []), [registry])

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount only
  useEffect(() => {
    if (defaultOpen) actions.openPanel()
  }, [])

  const tab = available.includes(state.panel.tab) ? state.panel.tab : available[0]
  const activeCue = cueAt(state.cues, state.currentTime)

  // Keep the current transcript line in view while it plays.
  useEffect(() => {
    if (tab !== 'transcript' || !activeCue) return
    listRef.current
      ?.querySelector<HTMLElement>('[aria-current="true"]')
      ?.scrollIntoView?.({ block: 'nearest' })
  }, [tab, activeCue])

  if (!state.panel.open || !tab) return null

  const tabLabel = (t: VideoPanelTab) =>
    t === 'chapters' ? labels.chapters : t === 'playlist' ? labels.playlist : labels.transcript

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    e.stopPropagation()
    const i = available.indexOf(tab)
    const next =
      available[(i + (e.key === 'ArrowRight' ? 1 : -1) + available.length) % available.length]
    actions.openPanel(next)
    const el = e.currentTarget.querySelector<HTMLElement>(`[data-tab="${next}"]`)
    el?.focus()
  }

  return (
    <aside aria-label={labels.panel} className={s.panel()}>
      <div className={s.panelHead()}>
        <div role="tablist" aria-label={labels.panel} className={s.tabs()} onKeyDown={onTabKey}>
          {available.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              id={`${id}-${t}`}
              data-tab={t}
              aria-selected={t === tab}
              aria-controls={`${id}-list`}
              tabIndex={t === tab ? 0 : -1}
              className={s.tab()}
              onClick={() => actions.openPanel(t)}
            >
              {tabLabel(t)}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label={labels.closePanel}
          className={s.iconButton()}
          onClick={actions.closePanel}
        >
          <CloseIcon />
        </button>
      </div>
      <div
        ref={listRef}
        id={`${id}-list`}
        role="tabpanel"
        aria-labelledby={`${id}-${tab}`}
        className={s.list()}
      >
        {tab === 'chapters'
          ? state.chapters.map((c, i) => (
              <button
                key={c.start}
                type="button"
                aria-current={i === state.chapterIndex}
                className={s.item()}
                onClick={() => actions.seek(c.start)}
              >
                <span className={s.thumbWrap()}>
                  {c.thumb ? (
                    <img src={c.thumb} alt="" className={s.thumb()} />
                  ) : (
                    <span className={s.thumbIndex()}>{i + 1}</span>
                  )}
                  {Number.isFinite(state.duration) ? (
                    <span className={s.duration()}>
                      {formatTime(chapterEnd(state.chapters, i, state.duration) - c.start)}
                    </span>
                  ) : null}
                </span>
                <span className={s.meta()}>
                  <span className={s.metaTitle()}>{c.title}</span>
                  <span className={s.metaSub()}>{formatTime(c.start, state.duration)}</span>
                </span>
              </button>
            ))
          : tab === 'playlist'
            ? state.playlist?.items.map((item, i) => (
                <button
                  key={item.id ?? i}
                  type="button"
                  aria-current={i === state.playlist?.index}
                  aria-label={`${item.title}, ${labels.playlistPosition(i + 1, state.playlist?.items.length ?? 0)}`}
                  className={s.item()}
                  onClick={() => actions.selectItem(i)}
                >
                  <span className={s.thumbWrap()}>
                    {item.thumb ? (
                      <img src={item.thumb} alt="" className={s.thumb()} />
                    ) : (
                      <span className={s.thumbIndex()}>{i + 1}</span>
                    )}
                    {item.duration ? (
                      <span className={s.duration()}>{formatTime(item.duration)}</span>
                    ) : null}
                  </span>
                  <span className={s.meta()}>
                    <span className={s.metaTitle()}>{item.title}</span>
                    {i === state.playlist?.index ? (
                      <span className={s.metaSub()}>{labels.nowPlaying}</span>
                    ) : null}
                  </span>
                </button>
              ))
            : state.cues.map((c) => (
                <button
                  key={`${c.start}-${c.text}`}
                  type="button"
                  aria-current={c === activeCue}
                  className={s.line()}
                  onClick={() => actions.seek(c.start)}
                >
                  <span className={s.lineTime()}>{formatTime(c.start, state.duration)}</span>
                  <span>{c.text}</span>
                </button>
              ))}
      </div>
    </aside>
  )
}
