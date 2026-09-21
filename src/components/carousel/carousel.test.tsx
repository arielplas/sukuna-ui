import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { createRef, useState } from 'react'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Carousel } from './index'

// Default to reduced motion so autoplay never auto-starts unless a test opts in.
let mm: ReturnType<typeof spyOn>
beforeEach(() => {
  mm = spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
})
afterEach(() => mm.mockRestore())

function mockInterval() {
  mm.mockReturnValue({ matches: false } as MediaQueryList)
  let cb: (() => void) | null = null
  const si = spyOn(globalThis, 'setInterval').mockImplementation(((fn: () => void) => {
    cb = fn
    return 1
  }) as typeof setInterval)
  const ci = spyOn(globalThis, 'clearInterval').mockImplementation(() => {})
  return {
    tick: () => act(() => cb?.()),
    si,
    ci,
    restore: () => {
      si.mockRestore()
      ci.mockRestore()
    },
  }
}

const Slides = () => (
  <Carousel aria-label="Featured">
    <div>One</div>
    <div>Two</div>
    <div>Three</div>
  </Carousel>
)

const transform = (el: HTMLElement) =>
  (el.querySelector('[aria-live]')?.firstElementChild as HTMLElement)?.style.transform

describe('Carousel', () => {
  it('server-renders every slide inside a labelled carousel region', () => {
    const html = renderServer(<Slides />)
    expect(html).toContain('aria-roledescription="carousel"')
    expect(html).toContain('One')
    expect(html).toContain('Two')
    expect(html).toContain('Three')
    expect(html).toContain('aria-label="2 of 3"')
  })

  it('next/prev move the track and dots reflect the active slide', async () => {
    const { container } = render(<Slides />)
    expect(transform(container)).toBe('translateX(-0%)')
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(transform(container)).toBe('translateX(-100%)')
    expect(screen.getByRole('button', { name: 'Go to slide 2' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(transform(container)).toBe('translateX(-0%)')
  })

  it('disables the end controls when not looping', () => {
    render(<Slides />)
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next slide' })).not.toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Go to slide 3' }))
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled()
  })

  it('wraps past the ends when loop is set', () => {
    const { container } = render(
      <Carousel aria-label="L" loop>
        <div>A</div>
        <div>B</div>
      </Carousel>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(transform(container)).toBe('translateX(-100%)') // wrapped to last
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(transform(container)).toBe('translateX(-0%)') // wrapped to first
  })

  it('navigates with the keyboard (arrows, Home, End)', () => {
    const { container } = render(<Slides />)
    const region = screen.getByRole('region', { name: 'Featured' })
    fireEvent.keyDown(region, { key: 'ArrowRight' })
    expect(transform(container)).toBe('translateX(-100%)')
    fireEvent.keyDown(region, { key: 'End' })
    expect(transform(container)).toBe('translateX(-200%)')
    fireEvent.keyDown(region, { key: 'Home' })
    expect(transform(container)).toBe('translateX(-0%)')
    fireEvent.keyDown(region, { key: 'ArrowLeft' }) // clamped at 0
    expect(transform(container)).toBe('translateX(-0%)')
    fireEvent.keyDown(region, { key: 'a' }) // ignored
    expect(transform(container)).toBe('translateX(-0%)')
  })

  it('dots jump to a slide', () => {
    const { container } = render(<Slides />)
    fireEvent.click(screen.getByRole('button', { name: 'Go to slide 3' }))
    expect(transform(container)).toBe('translateX(-200%)')
  })

  it('autoplay advances and the pause control stops it', () => {
    const iv = mockInterval()
    const { container } = render(
      <Carousel aria-label="Auto" loop autoplay autoplayInterval={1000}>
        <div>A</div>
        <div>B</div>
      </Carousel>,
    )
    const viewport = container.querySelector('[aria-live]') as HTMLElement
    expect(viewport).toHaveAttribute('aria-live', 'off') // running
    iv.tick()
    expect(transform(container)).toBe('translateX(-100%)')
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
    expect(viewport).toHaveAttribute('aria-live', 'polite') // paused
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    iv.restore()
  })

  it('autoplay pauses on hover', () => {
    const iv = mockInterval()
    const { container } = render(
      <Carousel aria-label="Auto" loop autoplay>
        <div>A</div>
        <div>B</div>
      </Carousel>,
    )
    const viewport = container.querySelector('[aria-live]') as HTMLElement
    expect(viewport).toHaveAttribute('aria-live', 'off')
    const region = screen.getByRole('region', { name: 'Auto' })
    fireEvent.mouseEnter(region)
    expect(viewport).toHaveAttribute('aria-live', 'polite')
    fireEvent.mouseLeave(region)
    expect(viewport).toHaveAttribute('aria-live', 'off')
    // focus/blur within the carousel also pauses/resumes
    fireEvent.focus(region)
    expect(viewport).toHaveAttribute('aria-live', 'polite')
    fireEvent.blur(region)
    expect(viewport).toHaveAttribute('aria-live', 'off')
    iv.restore()
  })

  it('never auto-starts under prefers-reduced-motion', () => {
    const si = spyOn(globalThis, 'setInterval')
    const { container } = render(
      <Carousel aria-label="Auto" loop autoplay>
        <div>A</div>
        <div>B</div>
      </Carousel>,
    )
    // matchMedia default reports reduced motion → running is false.
    expect(container.querySelector('[aria-live]')).toHaveAttribute('aria-live', 'polite')
    expect(si).not.toHaveBeenCalled()
    si.mockRestore()
  })

  it('supports pauseOnHover=false and hiding controls/dots', () => {
    render(
      <Carousel aria-label="Bare" controls={false} dots={false} pauseOnHover={false}>
        <div>A</div>
        <div>B</div>
      </Carousel>,
    )
    expect(screen.queryByRole('button', { name: 'Next slide' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Go to slide 1' })).toBeNull()
  })

  it('drives a controlled parent', () => {
    const onIndexChange = mock()
    render(
      <Carousel aria-label="C" index={0} onIndexChange={onIndexChange}>
        <div>A</div>
        <div>B</div>
      </Carousel>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(onIndexChange).toHaveBeenCalledWith(1)

    function Controlled() {
      const [i, setI] = useState(0)
      return (
        <Carousel aria-label="C2" index={i} onIndexChange={setI}>
          <div>A</div>
          <div>B</div>
        </Carousel>
      )
    }
    const { container } = render(<Controlled />)
    fireEvent.click(within(container).getByRole('button', { name: 'Next slide' }))
    expect(within(container).getByRole('button', { name: 'Go to slide 2' })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })

  it('renders an empty carousel without controls and ignores keys', () => {
    render(<Carousel aria-label="Empty">{null}</Carousel>)
    const region = screen.getByRole('region', { name: 'Empty' })
    expect(() => fireEvent.keyDown(region, { key: 'ArrowRight' })).not.toThrow()
    expect(screen.queryByRole('button', { name: 'Next slide' })).toBeNull()
  })

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLElement>()
    render(
      <Carousel aria-label="R" ref={ref} className="max-w-md" data-testid="c">
        <div>A</div>
      </Carousel>,
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(screen.getByTestId('c').classList.contains('max-w-md')).toBe(true)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { unmount, container } = render(
        <div data-theme={theme}>
          <Carousel aria-label="Featured" loop autoplay>
            <div>One</div>
            <div>Two</div>
          </Carousel>
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})
