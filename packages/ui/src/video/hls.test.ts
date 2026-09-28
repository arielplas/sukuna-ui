import { beforeEach, describe, expect, it, mock } from 'bun:test'
import type { VideoEngineCallbacks } from '../components/video-player'

// A stand-in for hls.js: records handlers and calls so the adapter's wiring can be driven.
type Handler = (event: string, data: unknown) => void
let supported = true
let instance: FakeHls | null = null
class FakeHls {
  static Events = { MANIFEST_PARSED: 'parsed', LEVEL_SWITCHED: 'switched', ERROR: 'error' }
  static ErrorTypes = { NETWORK_ERROR: 'net', MEDIA_ERROR: 'media', OTHER_ERROR: 'other' }
  static isSupported = () => supported
  handlers: Record<string, Handler> = {}
  currentLevel = -1
  config: unknown
  loadSource = mock()
  attachMedia = mock()
  startLoad = mock()
  recoverMediaError = mock()
  destroy = mock()
  constructor(config?: unknown) {
    this.config = config
    instance = this
  }
  on(event: string, handler: Handler) {
    this.handlers[event] = handler
  }
  emit(event: string, data: unknown) {
    this.handlers[event]?.(event, data)
  }
}
mock.module('hls.js', () => ({ default: FakeHls }))
const { hlsEngine } = await import('./hls')

const callbacks = () =>
  ({ onLevels: mock(), onLevelChange: mock(), onFatalError: mock() }) satisfies VideoEngineCallbacks

describe('hlsEngine', () => {
  beforeEach(() => {
    supported = true
    instance = null
  })

  it('claims .m3u8 URLs only', () => {
    const engine = hlsEngine()
    expect(engine.name).toBe('hls.js')
    expect(engine.handles('https://cdn.test/live/master.m3u8')).toBe(true)
    expect(engine.handles('/v/index.M3U8?token=1')).toBe(true)
    expect(engine.handles('/v/clip.mp4')).toBe(false)
  })

  it('loads through hls.js, reports levels and switches, and pins levels', () => {
    const cb = callbacks()
    const video = document.createElement('video')
    const session = hlsEngine({ config: { maxBufferLength: 20 } }).attach(video, '/a.m3u8', cb)
    const hls = instance as FakeHls
    expect(hls.config).toEqual({ maxBufferLength: 20 })
    expect(hls.loadSource).toHaveBeenCalledWith('/a.m3u8')
    expect(hls.attachMedia).toHaveBeenCalledWith(video)
    hls.emit('parsed', {
      levels: [
        { height: 360, bitrate: 1, name: '' },
        { height: 720, bitrate: 2, name: 'HD' },
      ],
    })
    expect(cb.onLevels).toHaveBeenCalledWith([
      { height: 360, bitrate: 1, label: undefined },
      { height: 720, bitrate: 2, label: 'HD' },
    ])
    hls.emit('switched', { level: 1 })
    expect(cb.onLevelChange).toHaveBeenCalledWith(1)
    session.setLevel(0)
    expect(hls.currentLevel).toBe(0)
    session.destroy()
    expect(hls.destroy).toHaveBeenCalled()
  })

  it('recovers once from network and media errors, then gives up', () => {
    const cb = callbacks()
    hlsEngine().attach(document.createElement('video'), '/a.m3u8', cb)
    const hls = instance as FakeHls
    hls.emit('error', { fatal: false, type: 'net' })
    expect(hls.startLoad).not.toHaveBeenCalled()
    hls.emit('error', { fatal: true, type: 'net' })
    expect(hls.startLoad).toHaveBeenCalledTimes(1)
    hls.emit('error', { fatal: true, type: 'media' })
    expect(hls.recoverMediaError).toHaveBeenCalledTimes(1)
    hls.emit('error', { fatal: true, type: 'net' })
    hls.emit('error', { fatal: true, type: 'media' })
    hls.emit('error', { fatal: true, type: 'other' })
    expect(cb.onFatalError).toHaveBeenCalledTimes(3)
  })

  it('hands the URL to native HLS without MSE, or when preferred', () => {
    supported = false
    const video = document.createElement('video')
    const load = mock()
    video.load = load
    const session = hlsEngine().attach(video, 'https://cdn.test/a.m3u8', callbacks())
    expect(instance).toBeNull()
    expect(video.getAttribute('src')).toBe('https://cdn.test/a.m3u8')
    session.setLevel(1) // no-op natively
    session.destroy()
    expect(video.hasAttribute('src')).toBe(false)
    expect(load).toHaveBeenCalled()

    supported = true
    const safari = document.createElement('video')
    safari.canPlayType = () => 'maybe'
    hlsEngine({ preferNative: true }).attach(safari, '/b.m3u8', callbacks())
    expect(instance).toBeNull()
    expect(safari.getAttribute('src')).toBe('/b.m3u8')
  })
})
