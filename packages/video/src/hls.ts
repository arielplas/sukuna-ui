// @sukuna-ui/video/hls — hls.js engine for VideoPlayer (Tier 3 adapter, Q23).
// hls.js is an optional peer dependency: only apps that import this entry need it installed.
import Hls, { type HlsConfig } from 'hls.js'
import type { VideoEngine } from './components/video-player/video-player.context'

/** Options for {@link hlsEngine}. */
export interface HlsEngineOptions {
  /** Passed straight to `new Hls(config)` (buffer sizes, ABR tuning, DRM, `xhrSetup`…). */
  config?: Partial<HlsConfig>
  /**
   * Prefer the browser's own HLS (Safari, iOS) even where hls.js could run.
   * @default false
   */
  preferNative?: boolean
}

const HLS_URL = /\.m3u8(?:[?#]|$)/i

/**
 * An HLS engine for `VideoPlayer`, backed by hls.js: adaptive streaming and a Quality menu built
 * from the manifest's levels (Auto plus each resolution).
 *
 * @remarks
 * - Claims `.m3u8` URLs only; everything else keeps playing natively.
 * - Where Media Source Extensions are missing (iOS Safari) it hands the URL to the native player,
 *   which plays HLS on its own (without a level menu).
 * - Recovers once from a fatal network error (reload) and once from a fatal media error
 *   (`recoverMediaError`); after that the player shows its error state, and Retry re-attaches.
 * - Create the engine once (module scope or `useMemo`), not inline in render.
 *
 * @example
 * ```tsx
 * import { VideoPlayer } from '@sukuna-ui/video'
 * import { hlsEngine } from '@sukuna-ui/video/hls'
 *
 * const engine = hlsEngine()
 *
 * <VideoPlayer title="Live from Shibuya" src="https://cdn.example.com/live/master.m3u8" engine={engine} />
 * ```
 */
export function hlsEngine({ config, preferNative = false }: HlsEngineOptions = {}): VideoEngine {
  return {
    name: 'hls.js',
    handles: (src) => HLS_URL.test(src),
    attach(video, src, callbacks) {
      const native = video.canPlayType('application/vnd.apple.mpegurl') !== ''
      if (!Hls.isSupported() || (preferNative && native)) {
        video.src = src
        return {
          setLevel: () => {},
          destroy: () => {
            video.removeAttribute('src')
            video.load()
          },
        }
      }

      const hls = new Hls(config)
      let networkRetry = true
      let mediaRetry = true
      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        callbacks.onLevels(
          data.levels.map((l) => ({
            height: l.height,
            bitrate: l.bitrate,
            label: l.name || undefined,
          })),
        )
      })
      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => callbacks.onLevelChange(data.level))
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR && networkRetry) {
          networkRetry = false
          hls.startLoad()
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR && mediaRetry) {
          mediaRetry = false
          hls.recoverMediaError()
        } else {
          callbacks.onFatalError()
        }
      })
      hls.loadSource(src)
      hls.attachMedia(video)
      return {
        setLevel: (index) => {
          hls.currentLevel = index
        },
        destroy: () => hls.destroy(),
      }
    },
  }
}
