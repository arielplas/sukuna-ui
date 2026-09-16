import { describe, expect, it } from 'bun:test'
import { cn } from '../src/utils/cn'
import { tv, type VariantProps } from '../src/utils/tv'

// Phase 3 gate: the styling primitives (`tv`, `cn`) are pure and server-safe. A `.styles.tsx`
// looks exactly like `demo` below — no hooks, no DOM, no `'use client'` — so it renders on the
// server (RSC) without touching browser globals.
const demo = tv({
  base: 'inline-flex items-center text-text',
  variants: {
    size: { sm: 'h-8 text-sm', lg: 'h-12 text-lg' },
    tone: { accent: 'bg-accent', quiet: 'bg-surface-2' },
  },
  defaultVariants: { size: 'sm', tone: 'accent' },
})

type DemoProps = VariantProps<typeof demo>

describe('tv (variant styles)', () => {
  it('applies base + default variants', () => {
    const out = demo()
    expect(out).toContain('inline-flex')
    expect(out).toContain('h-8')
    expect(out).toContain('text-sm')
    expect(out).toContain('bg-accent')
  })

  it('selects a non-default variant', () => {
    const out = demo({ size: 'lg' })
    expect(out).toContain('h-12')
    expect(out).toContain('text-lg')
    expect(out).not.toContain('h-8')
  })

  it('lets a consumer class override a conflicting utility', () => {
    const out = demo({ class: 'h-20' })
    expect(out).toContain('h-20')
    expect(out).not.toContain('h-8')
  })

  it('types variant props', () => {
    const props: DemoProps = { size: 'lg', tone: 'quiet' }
    expect(demo(props)).toContain('bg-surface-2')
  })
})

describe('cn (class merge)', () => {
  it('last conflicting utility wins', () => {
    expect(cn('h-10', 'h-20')).toBe('h-20')
  })

  it('keeps a custom text SIZE and a text COLOR apart (tw-merge-config extension)', () => {
    // Without the font-size group extension, `text-md` reads as a color and would drop
    // `text-text`. Both must survive.
    const out = cn('text-md', 'text-text')
    expect(out).toContain('text-md')
    expect(out).toContain('text-text')
  })

  it('drops falsey values and dedupes conditionals', () => {
    expect(cn('px-2', false, null, undefined, 'py-2')).toBe('px-2 py-2')
  })
})

describe('styles render on the server (RSC-safe)', () => {
  it('produces a class string usable in renderToString', async () => {
    const { renderToString } = await import('react-dom/server')
    const html = renderToString(<div className={demo({ size: 'lg' })}>hi</div>)
    expect(html).toContain('h-12')
    expect(html).toContain('class="')
  })
})
