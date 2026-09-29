'use client'

import { useEffect } from 'react'
import { useControllableState } from '../../hooks/use-controllable-state'
import { useVideoPlayer, type VideoPlaylistItem } from './video-player.context'

/** Props for {@link VideoPlayerPlaylist}. */
export interface VideoPlayerPlaylistProps {
  /** Videos in play order. Each item's media replaces the player's own `src` / `sources` / tracks. */
  items: VideoPlaylistItem[]
  /** Controlled current item. */
  index?: number
  /**
   * Initial item when uncontrolled.
   * @default 0
   */
  defaultIndex?: number
  /** Fires with the new index whenever the item changes (click, next/previous, auto-advance). */
  onIndexChange?: (index: number) => void
  /**
   * Play the next item when one ends. `VideoPlayerUpNext` shows a countdown first.
   * @default true
   */
  autoAdvance?: boolean
  /**
   * Wrap from the last item back to the first (and previous from the first to the last).
   * @default false
   */
  repeat?: boolean
  /** Remember the current item in `localStorage` under this key (uncontrolled only). */
  rememberKey?: string
}

const storageKey = (key: string) => `sk-playlist:${key}`

/**
 * Turns a {@link VideoPlayer} into a playlist: the current item's media plays in the player,
 * previous / next buttons and `Shift+N` / `Shift+P` appear, and items auto-advance.
 *
 * @remarks
 * - Renders nothing itself. Pair it with `VideoPlayerPanel` for a visible list and
 *   `VideoPlayerUpNext` for the end-of-item countdown.
 * - Controlled via `index` + `onIndexChange`, or uncontrolled via `defaultIndex` (optionally
 *   remembered with `rememberKey`).
 * - SSR: the first item renders on the server only after hydration, because the player learns
 *   about the playlist in an effect; give the `VideoPlayer` the first item's `title` for a
 *   meaningful server render.
 *
 * @example
 * ```tsx
 * import { VideoPlayer, VideoPlayerPanel, VideoPlayerPlaylist } from '@sukunagg/video'
 *
 * <VideoPlayer title="Night walks">
 *   <VideoPlayerPlaylist
 *     rememberKey="night-walks"
 *     items={[
 *       { id: 'shibuya', title: 'Last Train, Shibuya', src: '/v/shibuya.mp4', thumb: '/t/1.jpg' },
 *       { id: 'tsukiji', title: 'Morning Market, Tsukiji', src: '/v/tsukiji.mp4', thumb: '/t/2.jpg' },
 *     ]}
 *   />
 *   <VideoPlayerPanel tabs={['playlist']} />
 * </VideoPlayer>
 * ```
 */
export function VideoPlayerPlaylist({
  items,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  autoAdvance = true,
  repeat = false,
  rememberKey,
}: VideoPlayerPlaylistProps) {
  const { registry } = useVideoPlayer()
  const [index, setIndex] = useControllableState({
    value: indexProp,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  })

  // Restore the remembered item once (uncontrolled only).
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount only
  useEffect(() => {
    if (!rememberKey || indexProp !== undefined) return
    try {
      const saved = Number(localStorage.getItem(storageKey(rememberKey)))
      if (saved > 0 && saved < items.length) setIndex(saved)
    } catch {}
  }, [])

  useEffect(() => {
    if (!rememberKey) return
    try {
      localStorage.setItem(storageKey(rememberKey), String(index))
    } catch {}
  }, [rememberKey, index])

  useEffect(() => {
    registry.setPlaylist({
      items,
      index: Math.min(Math.max(index, 0), Math.max(items.length - 1, 0)),
      select: setIndex,
      autoAdvance,
      repeat,
    })
  }, [registry, items, index, setIndex, autoAdvance, repeat])

  useEffect(() => () => registry.setPlaylist(null), [registry])

  return null
}
