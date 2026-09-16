import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { renderServer } from '../../../test/ssr'
import { Button } from '../button'
import { Tooltip } from './index'

// Unit scope only: trigger render + SSR. Hover/focus open, positioning, and dismiss need real
// layout and are covered in test/browser/tooltip.test.ts.
describe('Tooltip', () => {
  it('renders the trigger', () => {
    render(
      <Tooltip content="Saved to your library">
        <Button>Save</Button>
      </Tooltip>,
    )
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('does not render the popup while closed', () => {
    render(
      <Tooltip content="hidden tip">
        <Button>Hover</Button>
      </Tooltip>,
    )
    expect(screen.queryByText('hidden tip')).toBeNull()
  })

  it('renders the trigger (not the popup) on the server', () => {
    const html = renderServer(
      <Tooltip content="server-only-tip">
        <button type="button">Trigger</button>
      </Tooltip>,
    )
    expect(html).toContain('Trigger')
    expect(html).not.toContain('server-only-tip')
  })
})
