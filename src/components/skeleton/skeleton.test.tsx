import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Skeleton } from './index'

describe('Skeleton', () => {
  it('applies the variant', () => {
    render(<Skeleton variant="circular" data-testid="s" />)
    expect(screen.getByTestId('s').classList.contains('rounded-full')).toBe(true)
  })

  it('is decorative and merges sizing className', () => {
    render(<Skeleton className="h-4 w-40" data-testid="s" />)
    const el = screen.getByTestId('s')
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el.classList.contains('h-4')).toBe(true)
    expect(el.classList.contains('animate-pulse')).toBe(true)
  })

  it('shimmer swaps the pulse for the shine sweep; pulse stays the default', () => {
    render(
      <>
        <Skeleton data-testid="pulse" />
        <Skeleton animation="shimmer" data-testid="shimmer" />
      </>,
    )
    const pulse = screen.getByTestId('pulse').classList
    expect(pulse.contains('animate-pulse')).toBe(true)
    expect(pulse.contains('animate-shine-fast')).toBe(false)
    const shimmer = screen.getByTestId('shimmer')
    expect(shimmer.classList.contains('animate-shine-fast')).toBe(true)
    expect(shimmer.classList.contains('animate-pulse')).toBe(false)
    expect(shimmer.classList.contains('motion-reduce:animate-none')).toBe(true)
    expect(shimmer.hasAttribute('animation')).toBe(false)
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Skeleton ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('renders on the server', () => {
    expect(renderServer(<Skeleton />)).toContain('aria-hidden')
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Skeleton variant="text" className="w-40" />
          <Skeleton variant="rectangular" className="h-24 w-full" />
          <Skeleton variant="circular" className="size-10" />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})
