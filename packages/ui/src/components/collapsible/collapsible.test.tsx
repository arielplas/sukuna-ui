import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { expectAccessible } from '../../../../../test/axe'
import { expectHydrates, renderServer } from '../../../../../test/ssr'
import { Collapsible } from './index'

function Example(props: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  hideIcon?: boolean
  keepMounted?: boolean
}) {
  const { hideIcon, keepMounted, ...root } = props
  return (
    <Collapsible {...root}>
      <Collapsible.Trigger hideIcon={hideIcon}>Advanced</Collapsible.Trigger>
      <Collapsible.Content keepMounted={keepMounted}>Secret settings</Collapsible.Content>
    </Collapsible>
  )
}

describe('Collapsible', () => {
  it('is closed by default', () => {
    render(<Example />)
    expect(screen.getByRole('button', { name: 'Advanced' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.queryByText('Secret settings')).toBeNull()
  })

  it('opens and closes on click', async () => {
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Advanced' })
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Secret settings')).toBeInTheDocument()
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('toggles from the keyboard', async () => {
    render(<Example />)
    screen.getByRole('button', { name: 'Advanced' }).focus()
    await userEvent.keyboard('[Enter]')
    expect(screen.getByText('Secret settings')).toBeInTheDocument()
  })

  it('supports defaultOpen and controlled open with onOpenChange', async () => {
    const onOpenChange = mock(() => {})
    const { unmount } = render(<Example defaultOpen />)
    expect(screen.getByText('Secret settings')).toBeInTheDocument()
    unmount()

    render(<Example open={false} onOpenChange={onOpenChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Advanced' }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByText('Secret settings')).toBeNull() // parent didn't flip `open`
  })

  it('disabled blocks toggling', async () => {
    render(<Example disabled />)
    const trigger = screen.getByRole('button', { name: 'Advanced' })
    expect(trigger).toHaveAttribute('aria-disabled', 'true')
    expect(trigger.className).toContain('data-[disabled]:opacity-45')
    await userEvent.click(trigger)
    expect(screen.queryByText('Secret settings')).toBeNull()
  })

  it('shows a chevron unless hideIcon; keepMounted keeps the panel in the DOM', () => {
    const { unmount } = render(<Example />)
    expect(screen.getByRole('button').querySelector('svg')).not.toBeNull()
    unmount()
    render(<Example hideIcon keepMounted />)
    expect(screen.getByRole('button').querySelector('svg')).toBeNull()
    expect(screen.getByText('Secret settings')).not.toBeVisible()
  })

  it('forwards refs and merges className on each part', () => {
    const root = createRef<HTMLDivElement>()
    const trigger = createRef<HTMLButtonElement>()
    const panel = createRef<HTMLDivElement>()
    render(
      <Collapsible ref={root} className="mt-4" defaultOpen>
        <Collapsible.Trigger ref={trigger} className="text-lg">
          T
        </Collapsible.Trigger>
        <Collapsible.Content ref={panel} className="pt-4">
          C
        </Collapsible.Content>
      </Collapsible>,
    )
    expect(root.current?.classList.contains('mt-4')).toBe(true)
    expect(trigger.current?.classList.contains('text-lg')).toBe(true)
    expect(screen.getByText('C').classList.contains('pt-4')).toBe(true)
    expect(screen.getByText('C').classList.contains('pt-2')).toBe(false)
    expect(panel.current).toBeInstanceOf(HTMLDivElement)
  })

  it('renders on the server and hydrates', async () => {
    const html = renderServer(<Example />)
    expect(html).toContain('Advanced')
    expect(html).not.toContain('Secret settings')
    await expectHydrates(<Example defaultOpen />)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { unmount, container } = render(
        <div data-theme={theme}>
          <Example defaultOpen />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})
