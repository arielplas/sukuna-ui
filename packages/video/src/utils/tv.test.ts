import { describe, expect, it } from 'bun:test'
import { tv } from './tv'

// The player writes every utility as `vp:<utility>` (its stylesheet is built with Tailwind
// `prefix(vp)`), so merge must resolve conflicts between prefixed classes and leave an app's own
// unprefixed classes alone.
const demo = tv({
  base: 'vp:inline-flex vp:h-8 vp:text-md vp:text-text',
  variants: { tone: { accent: 'vp:bg-accent', quiet: 'vp:bg-surface-2' } },
  defaultVariants: { tone: 'accent' },
})

describe('tv (vp prefix)', () => {
  it('lets a later prefixed utility win over a conflicting one', () => {
    const out = demo({ class: 'vp:h-10' }).split(' ')
    expect(out).toContain('vp:h-10')
    expect(out).not.toContain('vp:h-8')
  })

  it('keeps a custom font size and a text colour apart', () => {
    const out = demo().split(' ')
    expect(out).toContain('vp:text-md')
    expect(out).toContain('vp:text-text')
  })

  it('passes an app class through without touching the prefixed ones', () => {
    const out = demo({ tone: 'quiet', class: 'h-20 max-w-xl' }).split(' ')
    expect(out).toContain('h-20')
    expect(out).toContain('max-w-xl')
    expect(out).toContain('vp:h-8')
    expect(out).toContain('vp:bg-surface-2')
    expect(out).not.toContain('vp:bg-accent')
  })
})
