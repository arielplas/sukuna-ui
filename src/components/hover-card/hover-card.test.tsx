import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { expectAccessible } from '../../../test/axe'
import { expectHydrates, renderServer } from '../../../test/ssr'
import { HoverCard } from './index'

function Example({
  defaultOpen,
  side,
  className,
}: {
  defaultOpen?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}) {
  return (
    <HoverCard defaultOpen={defaultOpen}>
      <HoverCard.Trigger href="/u/sukuna">@sukuna</HoverCard.Trigger>
      <HoverCard.Content side={side} className={className}>
        <div>Ryomen Sukuna</div>
      </HoverCard.Content>
    </HoverCard>
  )
}

describe('HoverCard', () => {
  it('renders the trigger as a link', () => {
    render(<Example />)
    expect(screen.getByRole('link', { name: '@sukuna' })).toHaveAttribute('href', '/u/sukuna')
  })

  it('does not render the content while closed', () => {
    render(<Example />)
    expect(screen.queryByText('Ryomen Sukuna')).toBeNull()
  })

  it('renders the content when defaultOpen', () => {
    render(<Example defaultOpen />)
    expect(screen.getByText('Ryomen Sukuna')).toBeInTheDocument()
  })

  it('applies the side to the positioner', () => {
    render(<Example defaultOpen side="bottom" />)
    expect(document.querySelector('[data-side="bottom"]')).not.toBeNull()
  })

  it('defaults the side to top', () => {
    render(<Example defaultOpen />)
    expect(document.querySelector('[data-side="top"]')).not.toBeNull()
  })

  it('merges a consumer className onto the popup', () => {
    render(<Example defaultOpen className="w-64" />)
    expect(document.querySelector('.w-64')).not.toBeNull()
  })

  it('renders only the trigger on the server', () => {
    const html = renderServer(
      <HoverCard>
        <HoverCard.Trigger href="/u/sukuna">@sukuna</HoverCard.Trigger>
        <HoverCard.Content>preview</HoverCard.Content>
      </HoverCard>,
    )
    expect(html).toContain('@sukuna')
    expect(html).not.toContain('preview')
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(
      <HoverCard>
        <HoverCard.Trigger href="/u/sukuna">@sukuna</HoverCard.Trigger>
        <HoverCard.Content>preview</HoverCard.Content>
      </HoverCard>,
    )
  })

  it('trigger is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Example />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})
