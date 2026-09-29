'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useVideoPlayer } from './video-player.context'
import { videoPlayerPartsStyles } from './video-player-parts.styles'

/** Props for {@link VideoPlayerAudio}. */
export interface VideoPlayerAudioProps {
  /** Cover art URL (square). Falls back to a crimson tile with the title's initials. */
  art?: string
  /** Heading; defaults to the player's title. */
  title?: string
  /** Line under the title (artist, show, episode). */
  artist?: ReactNode
  /**
   * Draw a live frequency visualizer with the Web Audio API while playing. Needs same-origin or
   * CORS-enabled media, otherwise the analyser reads silence.
   * @default true
   */
  visualizer?: boolean
}

// createMediaElementSource() may run only once per element, so remember the graph per <video>.
type Graph = { ctx: AudioContext; analyser: AnalyserNode }
const graphs = new WeakMap<HTMLMediaElement, Graph>()

function graphFor(el: HTMLMediaElement): Graph | null {
  const existing = graphs.get(el)
  if (existing) return existing
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  const ctx = new Ctx()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 128
  ctx.createMediaElementSource(el).connect(analyser)
  analyser.connect(ctx.destination)
  const graph = { ctx, analyser }
  graphs.set(el, graph)
  return graph
}

const initials = (text: string) =>
  text
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()

/**
 * Audio mode for the player: cover art, title and a frequency visualizer in place of the picture.
 * Use it for podcasts, music or any audio-only source played through `VideoPlayer`.
 *
 * @remarks
 * - The visualizer starts on the first play (browsers only allow an `AudioContext` after a user
 *   gesture) and stops while paused. Under `prefers-reduced-motion` it doesn't draw.
 * - Colors are read from the player's `--vp-color-accent` / `--vp-color-accent-deep` tokens at draw time.
 * - The art is decorative (`alt=""`); the title and artist are real text.
 *
 * @example
 * ```tsx
 * import { VideoPlayer, VideoPlayerAudio } from '@sukunagg/video'
 *
 * <VideoPlayer title="Last Train (Night Mix)" src="/audio/last-train.mp3" aspectRatio="16/9">
 *   <VideoPlayerAudio art="/audio/cover.jpg" artist="Sukuna Sound · Episode 3" />
 * </VideoPlayer>
 * ```
 */
export function VideoPlayerAudio({ art, title, artist, visualizer = true }: VideoPlayerAudioProps) {
  const { state, videoRef } = useVideoPlayer()
  const s = videoPlayerPartsStyles()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [reduced, setReduced] = useState(false)
  const heading = title ?? state.title ?? ''
  const playing = state.started && !state.paused

  useEffect(() => {
    setReduced(Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches))
  }, [])

  useEffect(() => {
    const el = videoRef.current
    const canvas = canvasRef.current
    if (!visualizer || reduced || !playing || !el || !canvas) return
    const graph = graphFor(el)
    const c2d = canvas.getContext('2d')
    if (!graph || !c2d) return
    graph.ctx.resume().catch(() => {})
    const bins = new Uint8Array(graph.analyser.frequencyBinCount)
    const css = getComputedStyle(canvas)
    const top = css.getPropertyValue('--vp-color-accent').trim()
    const bottom = css.getPropertyValue('--vp-color-accent-deep').trim()
    let frame = 0
    const draw = () => {
      const { width, height } = canvas
      graph.analyser.getByteFrequencyData(bins)
      c2d.clearRect(0, 0, width, height)
      const gradient = c2d.createLinearGradient(0, height, 0, 0)
      gradient.addColorStop(0, bottom)
      gradient.addColorStop(1, top)
      c2d.fillStyle = gradient
      const bar = width / bins.length
      bins.forEach((v, i) => {
        const h = Math.max(2, (v / 255) * height)
        c2d.fillRect(i * bar + 1, height - h, Math.max(1, bar - 2), h)
      })
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [visualizer, reduced, playing, videoRef])

  return (
    <div className={s.audio()}>
      {art ? (
        <img src={art} alt="" className={s.art()} />
      ) : (
        <div aria-hidden="true" className={s.artFallback()}>
          {initials(heading)}
        </div>
      )}
      <div className={s.audioMeta()}>
        <div>
          <div className={s.audioTitle()}>{heading}</div>
          {artist ? <div className={s.audioArtist()}>{artist}</div> : null}
        </div>
        {visualizer && !reduced ? (
          <canvas ref={canvasRef} width={512} height={128} className={s.visualizer()} />
        ) : null}
      </div>
    </div>
  )
}
