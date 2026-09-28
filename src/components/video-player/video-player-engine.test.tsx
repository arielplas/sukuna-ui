import { describe, expect, it, mock, spyOn } from 'bun:test'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { renderServer } from '../../../test/ssr'
import { type VideoEngine, type VideoEngineCallbacks, VideoPlayer } from './index'

function fakeEngine() {
  let cb: VideoEngineCallbacks | null = null
  const setLevel = mock()
  const destroy = mock()
  const attach = mock((_v: HTMLVideoElement, _src: string, callbacks: VideoEngineCallbacks) => {
    cb = callbacks
    return { setLevel, destroy }
  })
  const engine: VideoEngine = { name: 'fake', handles: (src) => src.endsWith('.m3u8'), attach }
  return { engine, attach, setLevel, destroy, cb: () => cb as unknown as VideoEngineCallbacks }
}

const levels = [
  { height: 360, bitrate: 800_000 },
  { height: 1080, bitrate: 5_000_000, label: 'Full HD' },
  { height: 720, bitrate: 2_500_000 },
]

describe('VideoPlayer engine seam', () => {
  it('never sets src for engine URLs (server and client) and attaches in an effect', () => {
    const { engine, attach } = fakeEngine()
    expect(renderServer(<VideoPlayer title="T" src="/live.m3u8" engine={engine} />)).not.toContain(
      'live.m3u8',
    )
    const { container } = render(<VideoPlayer title="T" src="/live.m3u8" engine={engine} />)
    expect(container.querySelector('video')?.hasAttribute('src')).toBe(false)
    expect(attach).toHaveBeenCalledTimes(1)
    expect(attach.mock.calls[0]?.[1]).toBe('/live.m3u8')
  })

  it('leaves other URLs to the browser', () => {
    const { engine, attach } = fakeEngine()
    const { container } = render(<VideoPlayer title="T" src="/v.mp4" engine={engine} />)
    expect(container.querySelector('video')?.getAttribute('src')).toBe('/v.mp4')
    expect(attach).not.toHaveBeenCalled()
  })

  it('builds the Quality menu from engine levels: Auto + highest first, pins a level', () => {
    const f = fakeEngine()
    render(<VideoPlayer title="T" src="/live.m3u8" engine={f.engine} />)
    act(() => f.cb().onLevels(levels))
    act(() => f.cb().onLevelChange(2))
    const gear = screen.getByRole('button', { name: 'Settings' })
    expect(gear).toHaveTextContent('HD') // playing 720p on Auto
    fireEvent.click(gear)
    expect(screen.getByRole('menuitem', { name: /Quality/ })).toHaveTextContent('Auto · 720p')
    fireEvent.click(screen.getByRole('menuitem', { name: /Quality/ }))
    const names = screen.getAllByRole('menuitemradio').map((r) => r.textContent)
    expect(names).toEqual(['Auto', 'Full HDHD', '720pHD', '360p'])
    fireEvent.click(screen.getByRole('menuitemradio', { name: /^360p/ }))
    expect(f.setLevel).toHaveBeenCalledWith(0)
    expect(gear).not.toHaveTextContent('HD')
    // the menu stays open and returns to the main list
    expect(screen.getByRole('menuitem', { name: /Quality/ })).toHaveTextContent('360p')
    fireEvent.click(screen.getByRole('menuitem', { name: /Quality/ }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Auto' }))
    expect(f.setLevel).toHaveBeenLastCalledWith(-1)
  })

  it('shows Auto alone before a level plays, and a single level hides the menu row', () => {
    const f = fakeEngine()
    render(<VideoPlayer title="T" src="/live.m3u8" engine={f.engine} />)
    act(() => f.cb().onLevels(levels))
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
    expect(screen.getByRole('menuitem', { name: /Quality/ })).toHaveTextContent(/Auto(?! ·)/)
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    act(() => f.cb().onLevels([levels[0] as (typeof levels)[number]]))
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
    expect(screen.queryByRole('menuitem', { name: /Quality/ })).toBeNull()
  })

  it('a fatal engine error shows the error state; Retry re-attaches; unmount destroys', () => {
    const f = fakeEngine()
    const { unmount } = render(<VideoPlayer title="T" src="/live.m3u8" engine={f.engine} />)
    act(() => f.cb().onFatalError())
    expect(screen.getByRole('alert')).toBeInTheDocument()
    const load = spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(load).not.toHaveBeenCalled()
    expect(f.destroy).toHaveBeenCalledTimes(1)
    expect(f.attach).toHaveBeenCalledTimes(2)
    unmount()
    expect(f.destroy).toHaveBeenCalledTimes(2)
    load.mockRestore()
  })

  it('uses the selected rendition URL from `sources` when the engine claims it', () => {
    const f = fakeEngine()
    render(
      <VideoPlayer
        title="T"
        sources={[
          { src: '/a.m3u8', res: 1080 },
          { src: '/b.mp4', res: 480, default: true },
        ]}
        engine={f.engine}
      />,
    )
    expect(f.attach).not.toHaveBeenCalled() // default is the mp4
  })
})
