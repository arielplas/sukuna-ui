import { afterEach, beforeEach, describe, expect, it, jest, mock, spyOn } from 'bun:test'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { expectHydrates, renderServer } from '../../../test/ssr'
import { useVideoPlayer, VideoPlayer, type VideoPlayerProps } from './index'

// ── fixtures ────────────────────────────────────────────────────────────────────────────────
const VTT: Record<string, string> = {
  '/en.vtt':
    'WEBVTT\n\n00:00.000 --> 00:05.000\nShibuya, 11:40 p.m.\n\n00:05.000 --> 00:10.000\nLast trains',
  '/es.vtt': 'WEBVTT\n\n00:00.000 --> 00:05.000\nShibuya, 23:40',
  '/chapters.vtt':
    'WEBVTT\n\n00:00.000 --> 00:30.000\nCold open\n\n00:30.000 --> 01:30.000\nCrossing\n\n01:30.000 --> 04:00.000\nRiver',
  '/thumbs.vtt': 'WEBVTT\n\n00:00.000 --> 04:00.000\nsprite.jpg#xywh=160,0,160,90',
}

let fetchSpy: ReturnType<typeof spyOn>
beforeEach(() => {
  fetchSpy = spyOn(globalThis, 'fetch').mockImplementation((async (input: RequestInfo | URL) => {
    const body = VTT[String(input)]
    return body ? new Response(body) : new Response('nope', { status: 404 })
  }) as typeof fetch)
})
afterEach(() => fetchSpy.mockRestore())

const getVideo = (c: HTMLElement) => c.querySelector('video') as HTMLVideoElement
const region = () => screen.getByRole('region')

/** Give the fake <video> real-looking media metadata. */
function setMedia(v: HTMLVideoElement, m: { duration?: number; buffered?: [number, number][] }) {
  if (m.duration !== undefined)
    Object.defineProperty(v, 'duration', { value: m.duration, configurable: true })
  if (m.buffered)
    Object.defineProperty(v, 'buffered', {
      configurable: true,
      value: {
        length: m.buffered.length,
        start: (i: number) => (m.buffered as [number, number][])[i]?.[0],
        end: (i: number) => (m.buffered as [number, number][])[i]?.[1],
      },
    })
}

function renderPlayer(props: Partial<VideoPlayerProps> = {}) {
  const utils = render(<VideoPlayer title="Last Train" src="/v.mp4" {...(props as object)} />)
  const video = getVideo(utils.container)
  setMedia(video, { duration: 240 })
  fireEvent.durationChange(video)
  return { ...utils, video }
}

const button = (name: string | RegExp) => screen.getByRole('button', { name })
const seekSlider = () => screen.getByRole('slider', { name: 'Seek' })

describe('VideoPlayer', () => {
  it('server-renders the frame, a labelled region and idle controls', () => {
    const html = renderServer(<VideoPlayer title="Last Train" src="/v.mp4" poster="/p.jpg" />)
    expect(html).toContain('aria-roledescription="video player"')
    expect(html).toContain('aria-label="Last Train"')
    expect(html).toContain('data-theme="dark"')
    expect(html).toContain('<video')
    expect(html).not.toContain(' controls')
    expect(html).toContain('Play Last Train')
    expect(html).toContain('--:--')
    expect(html).not.toContain('Enter fullscreen')
    expect(html).not.toContain('Picture-in-picture')
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<VideoPlayer title="Last Train" src="/v.mp4" />)
  })

  it('is accessible idle and in the error state', async () => {
    const { container, video } = renderPlayer({
      tracks: [{ kind: 'captions', src: '/en.vtt', srclang: 'en', label: 'English' }],
      sources: [
        { src: '/1080.mp4', res: 1080 },
        { src: '/720.mp4', res: 720 },
      ],
    })
    await expectAccessible(container)
    fireEvent.error(video)
    await expectAccessible(container)
  })

  it('forwards ref to the video, className to the frame and native props to the video', () => {
    const ref = createRef<HTMLVideoElement>()
    const onPlay = mock()
    const { container } = render(
      <VideoPlayer
        ref={ref}
        title="T"
        src="/v.mp4"
        className="max-w-xl"
        data-testid="vid"
        onPlay={onPlay}
      />,
    )
    expect(ref.current).toBeInstanceOf(HTMLVideoElement)
    expect(region().classList.contains('max-w-xl')).toBe(true)
    expect(screen.getByTestId('vid').tagName).toBe('VIDEO')
    expect(getVideo(container).hasAttribute('controls')).toBe(false)
    fireEvent.play(getVideo(container))
    expect(onPlay).toHaveBeenCalledTimes(1)
  })

  it('plays, pauses and replays from the big button, the bar and the video surface', () => {
    const play = spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    const pause = spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    const { video } = renderPlayer()
    fireEvent.click(button('Play Last Train'))
    expect(play).toHaveBeenCalledTimes(1)
    fireEvent.play(video)
    expect(screen.queryByRole('button', { name: 'Play Last Train' })).toBeNull()
    Object.defineProperty(video, 'paused', { value: false, configurable: true })
    fireEvent.click(button('Pause'))
    expect(pause).toHaveBeenCalledTimes(1)
    fireEvent.pause(video)
    Object.defineProperty(video, 'paused', { value: true, configurable: true })
    fireEvent.click(video)
    expect(play).toHaveBeenCalledTimes(2)
    fireEvent.ended(video)
    expect(button('Replay')).toBeInTheDocument()
    play.mockRestore()
    pause.mockRestore()
  })

  it('swallows a rejected play() (autoplay policy)', async () => {
    const play = spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(new Error('blocked'))
    renderPlayer()
    fireEvent.click(button('Play Last Train'))
    await act(async () => {})
    expect(play).toHaveBeenCalled()
    play.mockRestore()
  })

  it('shows time, buffered range and the seek value text', () => {
    const { video, container } = renderPlayer()
    video.currentTime = 83
    setMedia(video, {
      buffered: [
        [0, 20],
        [80, 120],
      ],
    })
    fireEvent.timeUpdate(video)
    expect(container.textContent).toContain('1:23')
    expect(container.textContent).toContain('/ 4:00')
    expect(seekSlider()).toHaveAttribute('aria-valuetext', '1 minute 23 seconds of 4 minutes')
    const buffered = container.querySelector('[data-chapter="0"] > div') as HTMLElement
    expect(buffered.style.width).toBe('50%')
    fireEvent.progress(video)
  })

  it('seeks with the keyboard; Shift+arrows are left to the chapter hotkeys', () => {
    const { video } = renderPlayer()
    const slider = seekSlider()
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(video.currentTime).toBe(5)
    fireEvent.keyDown(slider, { key: 'PageUp' })
    expect(video.currentTime).toBe(35)
    fireEvent.keyDown(slider, { key: 'ArrowDown' })
    expect(video.currentTime).toBe(30)
    fireEvent.keyDown(slider, { key: 'End' })
    expect(video.currentTime).toBe(240)
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(video.currentTime).toBe(0)
    fireEvent.keyDown(slider, { key: 'x' })
    // Shift+arrow bubbles to the player: a chapter jump, or a plain 5s step without chapters.
    fireEvent.keyDown(slider, { key: 'ArrowRight', shiftKey: true })
    expect(video.currentTime).toBe(5)
  })

  it('seeks by pointer and previews the chapter, thumbnail and time on hover', async () => {
    const { video, container } = renderPlayer({
      chapters: [
        { start: 0, title: 'Cold open' },
        { start: 120, title: 'Crossing' },
      ],
      thumbnails: [
        { start: 0, end: 120, url: '/a.jpg', x: 0, y: 0, w: 160, h: 90 },
        { start: 120, end: 240, url: '/b"c.jpg' },
      ],
    })
    const slider = seekSlider()
    spyOn(slider, 'getBoundingClientRect').mockReturnValue({ left: 0, width: 400 } as DOMRect)
    fireEvent.pointerMove(slider, { clientX: 300 })
    expect(slider).toHaveTextContent('Crossing')
    expect(slider).toHaveTextContent('3:00')
    const thumb = container.querySelector('[data-thumbnail]') as HTMLElement
    expect(thumb.style.backgroundImage).toContain('b%22c.jpg')
    fireEvent.pointerMove(slider, { clientX: 20 })
    const sprite = container.querySelector('[data-thumbnail]') as HTMLElement
    expect(sprite.style.backgroundPosition).toBe('0px 0px')
    fireEvent.pointerDown(slider, { clientX: 200, pointerId: 1 })
    expect(video.currentTime).toBe(120)
    expect(slider).toHaveAttribute('data-dragging')
    fireEvent.pointerMove(slider, { clientX: 100 })
    expect(video.currentTime).toBe(60)
    fireEvent.pointerUp(slider)
    expect(slider).not.toHaveAttribute('data-dragging')
    fireEvent.pointerCancel(slider)
    fireEvent.pointerLeave(slider)
    expect(slider).not.toHaveTextContent('Crossing')
  })

  it('mutes, restores volume and drives the volume slider', () => {
    const { video } = renderPlayer()
    fireEvent.click(button('Mute'))
    expect(video.muted).toBe(true)
    fireEvent.volumeChange(video)
    expect(button('Unmute')).toBeInTheDocument()
    fireEvent.click(button('Unmute'))
    expect(video.muted).toBe(false)
    fireEvent.volumeChange(video)
    const vol = screen.getByRole('slider', { name: 'Volume' })
    fireEvent.keyDown(vol, { key: 'ArrowLeft' })
    expect(video.volume).toBe(0.95)
    fireEvent.keyDown(vol, { key: 'Home' })
    expect(video.muted).toBe(true)
    fireEvent.volumeChange(video)
    fireEvent.click(button('Unmute'))
    expect(video.volume).toBe(0.95) // last non-zero level
    fireEvent.keyDown(vol, { key: 'End' })
    fireEvent.keyDown(vol, { key: 'q' })
    spyOn(vol, 'getBoundingClientRect').mockReturnValue({ left: 0, width: 100 } as DOMRect)
    fireEvent.pointerDown(vol, { clientX: 30, pointerId: 1 })
    expect(video.volume).toBe(0.3)
    fireEvent.pointerMove(vol, { clientX: 40 })
    expect(video.volume).toBe(0.4)
    fireEvent.pointerUp(vol)
    fireEvent.pointerMove(vol, { clientX: 90 })
    expect(video.volume).toBe(0.4)
    fireEvent.volumeChange(video)
    expect(vol).toHaveAttribute('aria-valuenow', '40')
    // a muted element at volume 0 unmutes to at least 10%
    video.volume = 0
    video.muted = true
    fireEvent.volumeChange(video)
    fireEvent.click(button('Unmute'))
    expect(video.volume).toBe(0.4)
  })

  it('changes speed from the settings menu and navigates pages with the keyboard', () => {
    const { video } = renderPlayer()
    const gear = button('Settings')
    fireEvent.click(gear)
    const menu = screen.getByRole('menu', { name: 'Settings' })
    expect(within(menu).queryByText('Quality')).toBeNull() // single rendition
    fireEvent.click(within(menu).getByRole('menuitem', { name: /Speed/ }))
    const speedMenu = screen.getByRole('menu', { name: 'Speed' })
    fireEvent.keyDown(speedMenu, { key: 'ArrowDown' })
    fireEvent.keyDown(speedMenu, { key: 'ArrowUp' })
    fireEvent.keyDown(speedMenu, { key: 'Tab' })
    fireEvent.keyDown(speedMenu, { key: 'z' })
    fireEvent.keyDown(speedMenu, { key: 'ArrowLeft' })
    expect(screen.getByRole('menu', { name: 'Settings' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('menuitem', { name: /Speed/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Back to settings' }))
    fireEvent.click(screen.getByRole('menuitem', { name: /Speed/ }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: '1.5×' }))
    expect(video.playbackRate).toBe(1.5)
    fireEvent.rateChange(video)
    // a choice keeps the menu open on the same page, ticked in place
    expect(screen.getByRole('menu', { name: 'Speed' })).toBeInTheDocument()
    expect(screen.getByRole('menuitemradio', { name: '1.5×' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    fireEvent.click(screen.getByRole('menuitemradio', { name: '2×' })) // and another, same page
    expect(video.playbackRate).toBe(2)
    fireEvent.rateChange(video)
    fireEvent.click(screen.getByRole('button', { name: 'Back to settings' }))
    expect(screen.getByRole('menuitem', { name: /Speed/ })).toHaveTextContent('2×')
    fireEvent.click(gear) // the gear toggles it closed
    expect(screen.queryByRole('menu')).toBeNull()
    fireEvent.click(gear)
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
    expect(gear).toHaveFocus()
    fireEvent.click(gear)
    fireEvent.pointerDown(screen.getByRole('menu'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('menu')).toBeNull()
    fireEvent.click(gear)
    fireEvent.click(video) // clicking the video closes the menu instead of toggling play
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('switches quality, keeping position and play state', () => {
    const play = spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    const onQualityChange = mock()
    const { video } = renderPlayer({
      src: undefined,
      sources: [
        { src: '/1080.mp4', res: 1080 },
        { src: '/480.mp4', res: 480, default: true },
      ],
      onQualityChange,
    })
    expect(video.getAttribute('src')).toBe('/480.mp4')
    expect(button('Settings').textContent).not.toContain('HD')
    video.currentTime = 42
    Object.defineProperty(video, 'paused', { value: false, configurable: true })
    fireEvent.click(button('Settings'))
    fireEvent.click(screen.getByRole('menuitem', { name: /Quality/ }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: '480p' })) // same → no change
    expect(onQualityChange).not.toHaveBeenCalled()
    // still open, still on the Quality page
    fireEvent.click(screen.getByRole('menuitemradio', { name: /^1080p/ }))
    expect(onQualityChange).toHaveBeenCalledWith({ src: '/1080.mp4', res: 1080 }, 0)
    expect(video.getAttribute('src')).toBe('/1080.mp4')
    expect(button('Settings').textContent).toContain('HD')
    video.currentTime = 0
    fireEvent.loadedMetadata(video)
    expect(video.currentTime).toBe(42)
    expect(play).toHaveBeenCalled()
    play.mockRestore()
  })

  it('loads the default caption track, renders cues and switches or styles them', async () => {
    const { video, container } = renderPlayer({
      tracks: [
        { kind: 'captions', src: '/en.vtt', srclang: 'en', label: 'English', default: true },
        { kind: 'subtitles', src: '/es.vtt', srclang: 'es', label: 'Español' },
        { kind: 'captions', src: '/missing.vtt', label: 'Broken' },
      ],
    })
    await waitFor(() => expect(container.textContent).toContain('Shibuya, 11:40 p.m.'))
    const cc = button('Turn off captions')
    expect(cc).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(cc)
    expect(container.textContent).not.toContain('Shibuya, 11:40')
    fireEvent.keyDown(region(), { key: 'c' })
    await waitFor(() => expect(container.textContent).toContain('Shibuya, 11:40 p.m.')) // cached
    fireEvent.click(button('Settings'))
    fireEvent.click(screen.getByRole('menuitem', { name: /Subtitles/ }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Español' }))
    await waitFor(() => expect(container.textContent).toContain('Shibuya, 23:40'))
    // each choice stays on the Subtitles page
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Broken' }))
    await act(async () => {})
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Off' }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'English' }))
    fireEvent.click(screen.getByRole('menuitem', { name: /Caption style/ }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Size: Large' }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Text color: Champagne' }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Background: Outline' }))
    await waitFor(() => expect(container.textContent).toContain('Shibuya, 11:40'))
    const caption = screen.getByText('Shibuya, 11:40 p.m.')
    expect(caption.classList.contains('text-2xl')).toBe(true)
    expect(caption.classList.contains('text-premium')).toBe(true)
    expect(caption.classList.contains('bg-transparent')).toBe(true)
    video.currentTime = 7
    fireEvent.timeUpdate(video)
    expect(container.textContent).toContain('Last trains')
  })

  it('reads chapters from a track, labels the current one and jumps between them', async () => {
    const onChapterChange = mock()
    const { video } = renderPlayer({
      tracks: [{ kind: 'chapters', src: '/chapters.vtt' }],
      onChapterChange,
    })
    await waitFor(() => {
      expect(button('Chapters: Cold open')).toBeInTheDocument()
      // passive effect: can land a tick after the button renders
      expect(onChapterChange).toHaveBeenCalledWith({ start: 0, title: 'Cold open' }, 0)
    })
    fireEvent.keyDown(region(), { key: 'ArrowRight', shiftKey: true })
    expect(video.currentTime).toBe(30)
    fireEvent.timeUpdate(video)
    expect(button('Chapters: Crossing')).toBeInTheDocument()
    expect(onChapterChange).toHaveBeenLastCalledWith({ start: 30, title: 'Crossing' }, 1)
    video.currentTime = 40
    fireEvent.timeUpdate(video)
    fireEvent.keyDown(region(), { key: 'ArrowLeft', shiftKey: true }) // >3s in → chapter start
    expect(video.currentTime).toBe(30)
    fireEvent.keyDown(region(), { key: 'ArrowLeft', shiftKey: true }) // at start → previous
    expect(video.currentTime).toBe(0)
    video.currentTime = 50
    fireEvent.timeUpdate(video)
    fireEvent.click(button('Chapters: Crossing'))
    expect(video.currentTime).toBe(30)
    expect(seekSlider().getAttribute('aria-valuetext')).toContain('Crossing')
  })

  it('ignores a chapters track that fails to load, and inline chapters win', async () => {
    renderPlayer({ tracks: [{ kind: 'chapters', src: '/missing.vtt' }] })
    await act(async () => {})
    expect(screen.queryByRole('button', { name: /Chapters:/ })).toBeNull()
  })

  it('loads a thumbnails VTT', async () => {
    const { container } = renderPlayer({ thumbnails: '/thumbs.vtt' })
    await act(async () => {})
    const slider = seekSlider()
    spyOn(slider, 'getBoundingClientRect').mockReturnValue({ left: 0, width: 400 } as DOMRect)
    fireEvent.pointerMove(slider, { clientX: 100 })
    const thumb = container.querySelector('[data-thumbnail]') as HTMLElement
    expect(thumb.style.backgroundImage).toContain('/sprite.jpg')
    expect(thumb.style.backgroundPosition).toBe('-160px 0px')
  })

  it('applies startTime once on first metadata', () => {
    const { video } = renderPlayer({ startTime: 12 })
    fireEvent.loadedMetadata(video)
    expect(video.currentTime).toBe(12)
    video.currentTime = 50
    fireEvent.loadedMetadata(video)
    expect(video.currentTime).toBe(50)
  })

  it('runs every hotkey inside the player and none outside it', () => {
    const play = spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    const pause = spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    const { video } = renderPlayer()
    const r = region()
    const key = (k: string, extra = {}) => fireEvent.keyDown(r, { key: k, ...extra })
    key(' ')
    expect(play).toHaveBeenCalledTimes(1)
    key('k')
    expect(play).toHaveBeenCalledTimes(2)
    key('l')
    expect(video.currentTime).toBe(10)
    key('ArrowRight')
    expect(video.currentTime).toBe(15)
    key('ArrowLeft')
    key('j')
    expect(video.currentTime).toBe(0)
    key('ArrowDown')
    expect(video.volume).toBe(0.95)
    key('ArrowUp')
    expect(video.volume).toBe(1)
    key('m')
    expect(video.muted).toBe(true)
    key('ArrowUp') // from muted → 5%
    expect(video.volume).toBe(0.05)
    video.muted = true
    key('ArrowDown')
    key('.')
    expect(video.currentTime).toBeCloseTo(1 / 24)
    key(',')
    expect(video.currentTime).toBe(0)
    key('>')
    expect(video.playbackRate).toBe(1.25)
    video.playbackRate = 3 // not in the list → steps from 1×
    key('<')
    expect(video.playbackRate).toBe(0.75)
    key('5')
    expect(video.currentTime).toBe(120)
    key('End')
    expect(video.currentTime).toBe(240)
    key('Home')
    expect(video.currentTime).toBe(0)
    key('c') // no captions → ignored
    key('q') // unbound
    key('l', { ctrlKey: true })
    expect(video.currentTime).toBe(0)
    fireEvent.keyDown(button('Mute'), { key: ' ' }) // native button activation wins
    expect(play).toHaveBeenCalledTimes(2)
    Object.defineProperty(video, 'paused', { value: false, configurable: true })
    key('.') // frame step only while paused
    expect(video.currentTime).toBe(0)
    key('k')
    expect(pause).toHaveBeenCalled()
    play.mockRestore()
    pause.mockRestore()
  })

  it('can turn hotkeys off', () => {
    const { video } = renderPlayer({ hotkeys: false })
    fireEvent.keyDown(region(), { key: 'l' })
    expect(video.currentTime).toBe(0)
  })

  it('opens the shortcuts sheet with ? and closes it with Escape or the close button', () => {
    renderPlayer({ labels: { shortcuts: 'Atajos' } })
    fireEvent.keyDown(region(), { key: '?' })
    const dialog = screen.getByRole('dialog', { name: 'Atajos' })
    expect(within(dialog).getByText('Play or pause')).toBeInTheDocument()
    const close = within(dialog).getByRole('button', { name: 'Close' })
    expect(close).toHaveFocus()
    fireEvent.keyDown(close, { key: 'x' })
    fireEvent.keyDown(close, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.keyDown(region(), { key: '?' })
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.keyDown(region(), { key: '?' })
    fireEvent.keyDown(region(), { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('replaces the right-click menu with copy-link and shortcuts', async () => {
    const writeText = mock(async (_text: string) => {})
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const { video } = renderPlayer()
    video.currentTime = 83
    fireEvent.timeUpdate(video)
    fireEvent.contextMenu(region(), { clientX: 50, clientY: 40 })
    const menu = screen.getByRole('menu', { name: 'Video options' })
    expect(menu.style.left).toBe('50px')
    fireEvent.contextMenu(menu) // right-click inside our menu keeps it
    fireEvent.click(within(menu).getByRole('menuitem', { name: 'Copy video link' }))
    expect(writeText).toHaveBeenCalledWith(window.location.href.split('#')[0])
    fireEvent.contextMenu(region())
    fireEvent.click(screen.getByRole('menuitem', { name: 'Copy link at 1:23' }))
    expect(String(writeText.mock.calls[1]?.[0])).toContain('t=83')
    fireEvent.contextMenu(region())
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
    expect(region()).toHaveFocus()
    fireEvent.contextMenu(region())
    fireEvent.click(screen.getByRole('menuitem', { name: 'Keyboard shortcuts' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.keyDown(region(), { key: 'Escape' })
    fireEvent.contextMenu(region())
    fireEvent.keyDown(region(), { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
    fireEvent.contextMenu(region())
    fireEvent.click(video)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('keeps the browser menu when contextMenu is off', () => {
    renderPlayer({ contextMenu: false })
    fireEvent.contextMenu(region())
    expect(screen.queryByRole('menu')).toBeNull()
  })

  describe('with fake timers', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => jest.useRealTimers())

    it('auto-hides the controls while playing and never while paused or focused', () => {
      const { video } = renderPlayer()
      fireEvent.play(video)
      act(() => jest.advanceTimersByTime(2600))
      expect(region()).toHaveAttribute('data-controls', 'hidden')
      fireEvent.pointerMove(region())
      expect(region()).toHaveAttribute('data-controls', 'shown')
      act(() => button('Mute').focus())
      act(() => jest.advanceTimersByTime(2600))
      expect(region()).toHaveAttribute('data-controls', 'shown') // focus inside the bar
      act(() => (document.activeElement as HTMLElement).blur())
      fireEvent.pointerLeave(region(), { pointerType: 'touch' }) // a finger lifting isn't leaving
      expect(region()).toHaveAttribute('data-controls', 'shown')
      fireEvent.pointerLeave(region(), { pointerType: 'mouse' })
      expect(region()).toHaveAttribute('data-controls', 'hidden')
      fireEvent.pause(video)
      expect(region()).toHaveAttribute('data-controls', 'shown')
      fireEvent.pointerLeave(region(), { pointerType: 'mouse' })
      expect(region()).toHaveAttribute('data-controls', 'shown')
    })

    it('±10s taps keep the controls up and restart the inactivity timer', () => {
      const { video } = renderPlayer()
      fireEvent.play(video)
      act(() => jest.advanceTimersByTime(2000))
      const forward = button('Forward 10 seconds')
      // a tap: pointerdown restarts the timer, the click seeks and leaves (non-keyboard) focus
      spyOn(forward, 'matches').mockReturnValue(false)
      fireEvent.pointerDown(forward, { pointerType: 'touch' })
      act(() => forward.focus())
      fireEvent.click(forward)
      fireEvent.pointerLeave(region(), { pointerType: 'touch' })
      expect(video.currentTime).toBe(10)
      act(() => jest.advanceTimersByTime(2000)) // 4s since play, 2s since the tap
      expect(region()).toHaveAttribute('data-controls', 'shown')
      act(() => jest.advanceTimersByTime(600)) // inactivity reached
      expect(region()).toHaveAttribute('data-controls', 'hidden') // tap focus doesn't pin them
    })

    it('keeps the controls when :focus-visible is unsupported', () => {
      const { video } = renderPlayer()
      fireEvent.play(video)
      const mute = button('Mute')
      spyOn(mute, 'matches').mockImplementation(() => {
        throw new Error('unsupported selector')
      })
      act(() => mute.focus())
      act(() => jest.advanceTimersByTime(2600))
      expect(region()).toHaveAttribute('data-controls', 'shown')
    })

    it('keeps controls with autoHide off', () => {
      const { video } = renderPlayer({ autoHide: false })
      fireEvent.play(video)
      act(() => jest.advanceTimersByTime(3000))
      expect(region()).toHaveAttribute('data-controls', 'shown')
    })

    it('shows the spinner only after a 200ms stall', () => {
      const { video } = renderPlayer()
      fireEvent.waiting(video)
      expect(screen.queryByRole('status', { name: 'Loading' })).toBeNull()
      act(() => jest.advanceTimersByTime(250))
      expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
      fireEvent.playing(video)
      expect(screen.queryByRole('status', { name: 'Loading' })).toBeNull()
      fireEvent.waiting(video)
      act(() => jest.advanceTimersByTime(250))
      fireEvent.canPlay(video)
      expect(screen.queryByRole('status', { name: 'Loading' })).toBeNull()
    })

    it('touch: shows the big row, toggles controls on tap and seeks on double-tap', () => {
      const mm = spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
      const play = spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
      const { video } = renderPlayer()
      expect(screen.queryByRole('button', { name: 'Play Last Train' })).toBeNull()
      const row = screen.getAllByRole('button', { name: 'Forward 10 seconds' })
      fireEvent.click(row[0] as HTMLElement)
      expect(video.currentTime).toBe(10)
      fireEvent.click(screen.getAllByRole('button', { name: 'Back 10 seconds' })[0] as HTMLElement)
      expect(video.currentTime).toBe(0)
      act(() => jest.advanceTimersByTime(600))
      fireEvent.click(screen.getAllByRole('button', { name: 'Play' })[0] as HTMLElement)
      expect(play).toHaveBeenCalled()
      spyOn(video, 'getBoundingClientRect').mockReturnValue({ left: 0, width: 400 } as DOMRect)
      jest.setSystemTime(new Date(10_000))
      fireEvent.click(video, { clientX: 350 }) // single tap → hide
      expect(region()).toHaveAttribute('data-controls', 'hidden')
      jest.setSystemTime(new Date(10_100))
      fireEvent.click(video, { clientX: 350 }) // double tap right → +10
      expect(video.currentTime).toBe(10)
      expect(region().textContent).toContain('+10')
      jest.setSystemTime(new Date(20_000))
      fireEvent.click(video, { clientX: 50 }) // single tap → show again
      expect(region()).toHaveAttribute('data-controls', 'shown')
      jest.setSystemTime(new Date(20_100))
      fireEvent.click(video, { clientX: 50 })
      expect(video.currentTime).toBe(0)
      fireEvent.doubleClick(video) // no fullscreen on touch
      act(() => jest.advanceTimersByTime(600))
      mm.mockRestore()
      play.mockRestore()
    })
  })

  it('shows the error alert and retries by reloading the source', () => {
    const load = spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
    const onError = mock()
    const { video } = renderPlayer({ onError })
    fireEvent.error(video)
    expect(onError).toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent("This video couldn't be loaded.")
    fireEvent.click(button('Retry'))
    expect(load).toHaveBeenCalled()
    expect(screen.queryByRole('alert')).toBeNull()
    load.mockRestore()
  })

  it('autoplays muted with a tap-to-unmute chip', () => {
    const { video } = renderPlayer({ autoplayPolicy: 'muted' })
    expect(video.autoplay).toBe(true)
    fireEvent.click(button('Tap to unmute'))
    expect(video.muted).toBe(false)
    fireEvent.volumeChange(video)
    expect(screen.queryByRole('button', { name: 'Tap to unmute' })).toBeNull()
  })

  it('shows fullscreen, picture-in-picture and AirPlay when the browser supports them', () => {
    const doc = document as Document & Record<string, unknown>
    Object.defineProperty(doc, 'fullscreenEnabled', { value: true, configurable: true })
    Object.defineProperty(doc, 'pictureInPictureEnabled', { value: true, configurable: true })
    const picker = mock()
    const requestPip = mock(async () => {})
    Object.defineProperty(HTMLMediaElement.prototype, 'webkitShowPlaybackTargetPicker', {
      value: picker,
      configurable: true,
    })
    Object.defineProperty(HTMLMediaElement.prototype, 'requestPictureInPicture', {
      value: requestPip,
      configurable: true,
    })
    const requestFs = mock(async () => {})
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
      value: requestFs,
      configurable: true,
    })
    const lock = mock(async () => {})
    Object.defineProperty(window.screen, 'orientation', { value: { lock }, configurable: true })
    const mm = spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList)

    const { video } = renderPlayer()
    fireEvent.click(button('AirPlay'))
    expect(picker).toHaveBeenCalled()
    fireEvent.click(button('Picture-in-picture'))
    expect(requestPip).toHaveBeenCalled()
    fireEvent(video, new Event('enterpictureinpicture'))
    expect(button('Picture-in-picture')).toHaveAttribute('aria-pressed', 'true')
    fireEvent(video, new Event('leavepictureinpicture'))
    const exitPip = mock(async () => {})
    Object.defineProperty(doc, 'pictureInPictureElement', { value: video, configurable: true })
    Object.defineProperty(doc, 'exitPictureInPicture', { value: exitPip, configurable: true })
    fireEvent.keyDown(region(), { key: 'i' })
    expect(exitPip).toHaveBeenCalled()

    fireEvent.click(button('Enter fullscreen'))
    expect(requestFs).toHaveBeenCalled()
    fireEvent.doubleClick(video)
    expect(requestFs).toHaveBeenCalledTimes(2)
    Object.defineProperty(doc, 'fullscreenElement', { value: region(), configurable: true })
    fireEvent(document, new Event('fullscreenchange'))
    const exitFs = mock(async () => {})
    Object.defineProperty(doc, 'exitFullscreen', { value: exitFs, configurable: true })
    fireEvent.keyDown(region(), { key: 'f' })
    expect(exitFs).toHaveBeenCalled()
    expect(button('Exit fullscreen')).toBeInTheDocument()

    for (const k of [
      'fullscreenEnabled',
      'pictureInPictureEnabled',
      'pictureInPictureElement',
      'exitPictureInPicture',
      'fullscreenElement',
      'exitFullscreen',
    ])
      delete doc[k]
    delete (HTMLMediaElement.prototype as unknown as Record<string, unknown>)
      .webkitShowPlaybackTargetPicker
    delete (HTMLMediaElement.prototype as unknown as Record<string, unknown>)
      .requestPictureInPicture
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).requestFullscreen
    mm.mockRestore()
  })

  it('locks landscape on touch fullscreen and falls back to webkitEnterFullscreen', async () => {
    const lock = mock(async () => {})
    Object.defineProperty(window.screen, 'orientation', { value: { lock }, configurable: true })
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
      value: async () => {},
      configurable: true,
    })
    const mm = spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
    renderPlayer()
    fireEvent.keyDown(region(), { key: 'f' })
    await act(async () => {})
    expect(lock).toHaveBeenCalledWith('landscape')
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).requestFullscreen
    mm.mockRestore()

    const enter = mock()
    Object.defineProperty(HTMLMediaElement.prototype, 'webkitEnterFullscreen', {
      value: enter,
      configurable: true,
    })
    const { unmount } = render(<VideoPlayer aria-label="iOS" src="/v.mp4" />)
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Enter fullscreen' }).at(-1) as HTMLElement,
    )
    expect(enter).toHaveBeenCalled()
    unmount()
    delete (HTMLMediaElement.prototype as unknown as Record<string, unknown>).webkitEnterFullscreen
  })

  it('renders title, info and a linked or plain logo; aria-label alone skips the top bar', () => {
    const { unmount } = render(
      <VideoPlayer
        title="T"
        info="Episode 1"
        src="/v.mp4"
        logo={{ src: '/l.svg', alt: 'Sukuna', href: 'https://sukuna.test' }}
      />,
    )
    expect(screen.getByText('Episode 1')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sukuna' })).toHaveAttribute(
      'href',
      'https://sukuna.test',
    )
    unmount()
    const second = render(
      <VideoPlayer aria-label="Clip" src="/v.mp4" logo={{ src: '/l.svg', alt: 'Mark' }} />,
    )
    expect(screen.getByRole('img', { name: 'Mark' })).toBeInTheDocument()
    expect(screen.queryByRole('link')).toBeNull()
    second.unmount()
    render(<VideoPlayer aria-label="Clip" src="/v.mp4" aspectRatio="9/16" />)
    expect(region().classList.contains('aspect-[9/16]')).toBe(true)
    expect(region().querySelector('.font-display.text-lg')).toBeNull()
  })

  it('exposes state and actions to parts through useVideoPlayer', () => {
    function Part() {
      const { state, actions, labels, videoRef } = useVideoPlayer()
      return (
        <button type="button" onClick={() => actions.seek(state.duration - 10)}>
          {labels.play} {String(videoRef.current !== null)} {state.duration}
        </button>
      )
    }
    const { video } = renderPlayer({ children: <Part /> })
    fireEvent.click(screen.getByRole('button', { name: /Play true 240/ }))
    expect(video.currentTime).toBe(230)
    expect(() => render(<Part />)).toThrow('useVideoPlayer must be used inside <VideoPlayer>')
  })

  it('omits empty settings and hides the gear when nothing is left', () => {
    renderPlayer({ settings: [] })
    expect(screen.queryByRole('button', { name: 'Settings' })).toBeNull()
  })
})
