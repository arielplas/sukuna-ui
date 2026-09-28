import { afterEach, beforeEach, describe, expect, it, jest, mock, spyOn } from 'bun:test'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { expectAccessible } from '../../../../../test/axe'
import {
  VideoPlayer,
  VideoPlayerAudio,
  VideoPlayerOverlay,
  VideoPlayerPlaylist,
  type VideoPlayerProps,
} from './index'

let play: ReturnType<typeof spyOn>
let pause: ReturnType<typeof spyOn>
beforeEach(() => {
  play = spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  pause = spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
})
afterEach(() => {
  play.mockRestore()
  pause.mockRestore()
  jest.useRealTimers() // even when a fake-timer test fails midway
})

const button = (name: string | RegExp) => screen.getByRole('button', { name })
const region = () => screen.getAllByRole('region').at(0) as HTMLElement
const chapters = [
  { start: 0, title: 'Intro' },
  { start: 40, title: 'Middle' },
]

function setup(props: Partial<VideoPlayerProps> = {}, parts: React.ReactNode = null) {
  const utils = render(
    <VideoPlayer title="Player" src="/v.mp4" {...(props as object)}>
      {parts}
    </VideoPlayer>,
  )
  const video = utils.container.querySelector('video') as HTMLVideoElement
  Object.defineProperty(video, 'duration', { value: 100, configurable: true })
  fireEvent.durationChange(video)
  return { ...utils, video }
}
const openGear = (row: RegExp) => {
  fireEvent.click(button('Settings'))
  fireEvent.click(screen.getByRole('menuitem', { name: row }))
}

/** Wrap document.createElement so elements of `tag` get `patch` applied (instance-level mocks). */
function patchCreate(tag: string, patch: (el: HTMLElement) => void) {
  const orig = document.createElement.bind(document)
  return spyOn(document, 'createElement').mockImplementation(((
    t: string,
    o?: ElementCreationOptions,
  ) => {
    const el = orig(t, o)
    if (t.toLowerCase() === tag) patch(el)
    return el
  }) as typeof document.createElement)
}

describe('VideoPlayer W3 settings', () => {
  it('adjusts zoom, mirror and filters, and resets them', () => {
    const { video } = setup({ settings: ['picture'] })
    openGear(/Picture/)
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Zoom: 150%' }))
    expect(video.style.scale).toBe('1.5 1.5')
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Mirror view' }))
    expect(screen.getByRole('menuitemcheckbox', { name: 'Mirror view' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(video.style.scale).toBe('-1.5 1.5')
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Brightness: 125%' }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Contrast: 150%' }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Saturation: 0%' }))
    expect(video.style.filter).toBe('brightness(125%) contrast(150%) saturate(0%)')
    fireEvent.click(button('Back to settings'))
    expect(screen.getByRole('menuitem', { name: /Picture/ })).toHaveTextContent('Adjusted')
    fireEvent.click(screen.getByRole('menuitem', { name: /Picture/ }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Reset picture' }))
    expect(video.getAttribute('style')).toBeNull()
  })

  it('sleep timer pauses after the chosen minutes', () => {
    jest.useFakeTimers()
    setup({ settings: ['sleep'] })
    openGear(/Sleep timer/)
    fireEvent.click(screen.getByRole('menuitemradio', { name: '15 minutes' }))
    expect(screen.getByRole('menuitemradio', { name: '15 minutes' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Back to settings' }))
    expect(screen.getByRole('menuitem', { name: /Sleep timer/ })).toHaveTextContent('15 minutes')
    act(() => jest.advanceTimersByTime(15 * 60_000))
    expect(pause).toHaveBeenCalled()
    expect(screen.getByRole('menuitem', { name: /Sleep timer/ })).toHaveTextContent('Off')
    jest.useRealTimers()
  })

  it('sleep "end of video" stops a playlist from advancing, once', () => {
    const items = [
      { title: 'A', src: '/a.mp4' },
      { title: 'B', src: '/b.mp4' },
    ]
    const { video } = setup({ settings: ['sleep'] }, <VideoPlayerPlaylist items={items} />)
    openGear(/Sleep timer/)
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'End of video' }))
    fireEvent.ended(video)
    expect(video.getAttribute('src')).toBe('/a.mp4')
    expect(screen.getByRole('menuitemradio', { name: 'Off' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('loops the whole video, a chapter, or a custom A–B range', () => {
    const { video, container } = setup({ settings: ['loop'], chapters })
    openGear(/Loop/)
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Whole video' }))
    expect(video.loop).toBe(true)
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'This chapter' }))
    expect(video.loop).toBe(false)
    expect(container.querySelector('[data-loop-range]')).not.toBeNull()
    video.currentTime = 40.2 // crossed the chapter end
    fireEvent.timeUpdate(video)
    expect(video.currentTime).toBe(0)
    // custom range: B before A defaults A to 0
    video.currentTime = 20
    fireEvent.timeUpdate(video)
    fireEvent.click(screen.getByRole('menuitem', { name: 'Set loop end at 0:20' }))
    expect(screen.getByRole('menuitemradio', { name: '0:00 – 0:20' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    video.currentTime = 10
    fireEvent.timeUpdate(video)
    fireEvent.click(screen.getByRole('menuitem', { name: 'Set loop start at 0:10' }))
    video.currentTime = 21
    fireEvent.timeUpdate(video)
    expect(video.currentTime).toBe(10)
    // A after B drops B (turn the active loop off first, or 0:30 snaps back to 0:10)
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Off' }))
    video.currentTime = 30
    fireEvent.timeUpdate(video)
    fireEvent.click(screen.getByRole('menuitem', { name: 'Set loop start at 0:30' }))
    expect(screen.queryByRole('menuitemradio', { name: /–/ })).toBeNull()
    fireEvent.click(screen.getByRole('menuitem', { name: 'Set loop end at 0:30' }))
    // B at or before A restarts the range from 0:00
    expect(screen.getByRole('menuitemradio', { name: '0:00 – 0:30' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Off' }))
    fireEvent.click(button('Back to settings'))
    expect(screen.getByRole('menuitem', { name: /Loop/ })).toHaveTextContent('Off')
  })

  it('names the loop mode in the root row', () => {
    setup({ settings: ['loop'] })
    openGear(/Loop/)
    expect(screen.queryByRole('menuitemradio', { name: 'This chapter' })).toBeNull()
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Whole video' }))
    fireEvent.click(button('Back to settings'))
    expect(screen.getByRole('menuitem', { name: /Loop/ })).toHaveTextContent('Whole video')
  })

  it('shows the chapter and custom loop names in the root row', () => {
    const { video } = setup({ settings: ['loop'], chapters })
    openGear(/Loop/)
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'This chapter' }))
    fireEvent.click(button('Back to settings'))
    expect(screen.getByRole('menuitem', { name: /Loop/ })).toHaveTextContent('This chapter')
    fireEvent.click(screen.getByRole('menuitem', { name: /Loop/ }))
    video.currentTime = 12
    fireEvent.timeUpdate(video)
    fireEvent.click(screen.getByRole('menuitem', { name: 'Set loop end at 0:12' }))
    fireEvent.click(button('Back to settings'))
    expect(screen.getByRole('menuitem', { name: /Loop/ })).toHaveTextContent('0:00 – 0:12')
  })

  it('takes a snapshot: callback, download, and blocked media', () => {
    const blob = new Blob(['png'], { type: 'image/png' })
    let ctx: unknown = { drawImage: mock() }
    let out: Blob | null = blob
    const created = patchCreate('canvas', (el) => {
      Object.assign(el, {
        getContext: () => ctx,
        toBlob: (cb: (b: Blob | null) => void) => cb(out),
      })
    })
    const onSnapshot = mock()
    const { video, unmount } = setup({ settings: ['snapshot'], onSnapshot })
    video.currentTime = 12
    fireEvent.click(button('Settings'))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Snapshot' }))
    expect(onSnapshot).toHaveBeenCalledWith(blob, 12)
    expect(screen.getByRole('status')).toHaveTextContent('Snapshot saved')
    unmount()
    created.mockRestore()

    // no callback → download via an object URL
    const clicks = mock()
    const createUrl = spyOn(URL, 'createObjectURL').mockReturnValue('blob:x')
    const revoke = spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const anchors: HTMLAnchorElement[] = []
    const orig = document.createElement.bind(document)
    const create = spyOn(document, 'createElement').mockImplementation(((t: string) => {
      const el = orig(t)
      if (t === 'canvas')
        Object.assign(el, {
          getContext: () => ctx,
          toBlob: (cb: (b: Blob | null) => void) => cb(out),
        })
      if (t === 'a') {
        ;(el as HTMLAnchorElement).click = clicks
        anchors.push(el as HTMLAnchorElement)
      }
      return el
    }) as typeof document.createElement)
    const second = setup({ settings: ['snapshot'], title: 'Night / walk' })
    fireEvent.click(button('Settings'))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Snapshot' }))
    expect(clicks).toHaveBeenCalled()
    expect(anchors.at(-1)?.download).toBe('Night-walk-0s.png')
    expect(revoke).toHaveBeenCalledWith('blob:x')
    // toBlob gives nothing, getContext is null, drawImage throws → "not available"
    out = null
    fireEvent.click(screen.getByRole('menuitem', { name: 'Snapshot' }))
    expect(screen.getByRole('status')).toHaveTextContent("Snapshots aren't available")
    ctx = null
    fireEvent.click(screen.getByRole('menuitem', { name: 'Snapshot' }))
    ctx = {
      drawImage: () => {
        throw new Error('tainted')
      },
    }
    fireEvent.click(screen.getByRole('menuitem', { name: 'Snapshot' }))
    expect(screen.getByRole('status')).toHaveTextContent("Snapshots aren't available")
    second.unmount()
    create.mockRestore()
    createUrl.mockRestore()
    revoke.mockRestore()
  })

  it('toasts disappear on their own', () => {
    jest.useFakeTimers()
    const created = patchCreate('canvas', (el) => Object.assign(el, { getContext: () => null }))
    setup({ settings: ['snapshot'] })
    fireEvent.click(button('Settings'))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Snapshot' }))
    expect(screen.getByRole('status')).toBeInTheDocument()
    act(() => jest.advanceTimersByTime(2500))
    expect(screen.queryByRole('status')).toBeNull()
    created.mockRestore()
    jest.useRealTimers()
  })

  it('downloads the given file', () => {
    const clicks = mock()
    const anchors: HTMLAnchorElement[] = []
    const created = patchCreate('a', (el) => {
      ;(el as HTMLAnchorElement).click = clicks
      anchors.push(el as HTMLAnchorElement)
    })
    const first = setup({ settings: ['download'], download: 'https://cdn.test/v/night.mp4' })
    fireEvent.click(button('Settings'))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Download' }))
    expect(anchors.at(-1)?.download).toBe('night.mp4')
    expect(anchors.at(-1)?.href).toBe('https://cdn.test/v/night.mp4')
    first.unmount()
    setup({ settings: ['download'], download: { src: '/v/x.mp4', filename: 'episode-1.mp4' } })
    fireEvent.click(button('Settings'))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Download' }))
    expect(anchors.at(-1)?.download).toBe('episode-1.mp4')
    expect(clicks).toHaveBeenCalledTimes(2)
    created.mockRestore()
  })

  it('has no Download row without a file', () => {
    setup({ settings: ['speed', 'download'] })
    fireEvent.click(button('Settings'))
    expect(screen.queryByRole('menuitem', { name: 'Download' })).toBeNull()
  })
})

describe('VideoPlayer watch limit', () => {
  it('stops at the limit, covers the frame and blocks play and seeking past it', () => {
    const { video } = setup({
      watchLimit: { seconds: 30, content: <p>Subscribe to keep watching</p> },
    })
    fireEvent.play(video)
    video.currentTime = 30
    fireEvent.timeUpdate(video)
    expect(screen.getByText('Subscribe to keep watching')).toBeInTheDocument()
    expect(pause).toHaveBeenCalled()
    fireEvent.pause(video) // what the real element fires after pause()
    play.mockClear()
    fireEvent.click(button('Play'))
    expect(play).not.toHaveBeenCalled()
    fireEvent.keyDown(region(), { key: 'End' })
    expect(video.currentTime).toBe(30)
    fireEvent.keyDown(region(), { key: 'Home' })
    expect(screen.queryByText('Subscribe to keep watching')).toBeNull()
  })
})

describe('VideoPlayer live', () => {
  function liveSetup(dvrWindow?: number) {
    const utils = setup({ live: dvrWindow ? { dvrWindow } : true })
    Object.defineProperty(utils.video, 'duration', {
      value: Number.POSITIVE_INFINITY,
      configurable: true,
    })
    Object.defineProperty(utils.video, 'seekable', {
      configurable: true,
      value: { length: 1, start: () => 0, end: () => 300 },
    })
    return utils
  }

  it('shows LIVE at the edge, time behind otherwise, and jumps back', () => {
    const { video } = liveSetup(60)
    video.currentTime = 295
    fireEvent.timeUpdate(video)
    const pill = button('Live')
    expect(pill).toHaveAttribute('data-edge')
    const seek = screen.getByRole('slider', { name: 'Seek' })
    expect(seek).toHaveAttribute('aria-valuemax', '60')
    expect(seek).toHaveAttribute('aria-valuenow', '55')
    video.currentTime = 250
    fireEvent.timeUpdate(video)
    expect(screen.getByText('0:50 behind live')).toBeInTheDocument()
    fireEvent.click(button('Jump to live'))
    expect(video.currentTime).toBe(300)
    video.currentTime = 250
    fireEvent.timeUpdate(video)
    fireEvent.keyDown(seek, { key: 'Home' }) // bar is relative to the DVR window
    expect(video.currentTime).toBe(240)
    fireEvent.keyDown(region(), { key: '5' }) // no percentage jumps on live
    expect(video.currentTime).toBe(240)
    fireEvent.keyDown(region(), { key: 'End' })
    expect(video.currentTime).toBe(300)
    fireEvent.progress(video) // same window → no state churn
  })

  it('uses the whole seekable range without a DVR cap', () => {
    const { video } = liveSetup()
    video.currentTime = 100
    fireEvent.timeUpdate(video)
    expect(screen.getByRole('slider', { name: 'Seek' })).toHaveAttribute('aria-valuemax', '300')
  })
})

describe('VideoPlayerOverlay', () => {
  it('shows a card inside its window and can be dismissed', async () => {
    const { video, container } = setup(
      {},
      <VideoPlayerOverlay aria-label="Tour offer" start={10} end={20} dismissible>
        Book a guide
      </VideoPlayerOverlay>,
    )
    expect(screen.queryByRole('region', { name: 'Tour offer' })).toBeNull()
    video.currentTime = 12
    fireEvent.timeUpdate(video)
    const card = screen.getByRole('region', { name: 'Tour offer' })
    expect(card.classList.contains('top-16')).toBe(true)
    await expectAccessible(container)
    fireEvent.click(within(card).getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('region', { name: 'Tour offer' })).toBeNull()
  })

  it('banner-on-pause and plain placements', () => {
    const { video } = setup(
      {},
      <>
        <VideoPlayerOverlay aria-label="Sponsor" showOn="pause" variant="banner">
          Sponsor
        </VideoPlayerOverlay>
        <VideoPlayerOverlay aria-label="Mark" variant="plain" placement="center">
          Mark
        </VideoPlayerOverlay>
      </>,
    )
    expect(screen.getByRole('region', { name: 'Mark' }).classList.contains('left-1/2')).toBe(true)
    expect(screen.queryByRole('region', { name: 'Sponsor' })).toBeNull() // not started
    fireEvent.play(video)
    expect(screen.queryByRole('region', { name: 'Sponsor' })).toBeNull() // playing
    fireEvent.pause(video)
    expect(screen.getByRole('region', { name: 'Sponsor' }).classList.contains('inset-x-0')).toBe(
      true,
    )
  })
})

describe('VideoPlayerAudio', () => {
  it('shows art or initials and draws the visualizer while playing', () => {
    const bars = mock()
    const c2d = {
      clearRect: mock(),
      createLinearGradient: () => ({ addColorStop: mock() }),
      fillRect: bars,
      fillStyle: '',
    }
    const created = patchCreate('canvas', (el) => Object.assign(el, { getContext: () => c2d }))
    // Rejects like a context the browser won't start yet; the player swallows it.
    const resume = mock(async () => {
      throw new Error('not allowed')
    })
    const connect = mock()
    const orig = window.AudioContext
    window.AudioContext = class {
      destination = {}
      resume = resume
      createAnalyser() {
        return {
          fftSize: 0,
          frequencyBinCount: 4,
          connect,
          getByteFrequencyData: (a: Uint8Array) => a.set([255, 128, 0, 64]),
        }
      }
      createMediaElementSource() {
        return { connect }
      }
    } as unknown as typeof AudioContext
    const raf = spyOn(globalThis, 'requestAnimationFrame').mockReturnValue(1)
    const caf = spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {})

    const { video, unmount } = setup(
      { title: 'Last Train Night Mix' },
      <VideoPlayerAudio artist="Sukuna Sound" />,
    )
    expect(screen.getByText('LT')).toBeInTheDocument() // initials fallback
    expect(screen.getByText('Sukuna Sound')).toBeInTheDocument()
    fireEvent.play(video)
    expect(resume).toHaveBeenCalled()
    expect(bars).toHaveBeenCalledTimes(4)
    fireEvent.pause(video)
    expect(caf).toHaveBeenCalled()
    fireEvent.play(video) // the element's graph is reused
    unmount()

    render(
      <VideoPlayer aria-label="Clip" src="/a.mp3">
        <VideoPlayerAudio art="/cover.jpg" title="Cover" visualizer={false} />
      </VideoPlayer>,
    )
    expect(document.querySelector('img[src="/cover.jpg"]')).not.toBeNull()
    expect(document.querySelector('canvas')).toBeNull()
    window.AudioContext = orig
    raf.mockRestore()
    caf.mockRestore()
    created.mockRestore()
  })

  it('skips drawing without Web Audio, a 2D context, or under reduced motion', () => {
    const orig = window.AudioContext
    ;(window as unknown as { AudioContext: undefined }).AudioContext = undefined
    const first = setup({}, <VideoPlayerAudio />)
    fireEvent.play(first.video)
    expect(screen.getByText('P')).toBeInTheDocument() // "Player"
    first.unmount()
    window.AudioContext = orig

    const mm = spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
    setup({}, <VideoPlayerAudio />)
    expect(document.querySelector('canvas')).toBeNull()
    mm.mockRestore()
  })

  it('reads webkitAudioContext and stops when there is no 2D context', () => {
    const created = patchCreate('canvas', (el) => Object.assign(el, { getContext: () => null }))
    const orig = window.AudioContext
    ;(window as unknown as { AudioContext: undefined }).AudioContext = undefined
    const connect = mock()
    ;(window as unknown as { webkitAudioContext: unknown }).webkitAudioContext = class {
      destination = {}
      createAnalyser() {
        return { connect, frequencyBinCount: 1 }
      }
      createMediaElementSource() {
        return { connect }
      }
    }
    const { video } = setup({}, <VideoPlayerAudio />)
    fireEvent.play(video)
    expect(connect).toHaveBeenCalled()
    window.AudioContext = orig
    delete (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext
    created.mockRestore()
  })
})
