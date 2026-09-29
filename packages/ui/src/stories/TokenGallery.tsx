import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  colors,
  fontSizes,
  fontWeights,
  leading,
  motion,
  radius,
  shadows,
  space,
  tracking,
  zIndex,
} from '../tokens'

// Renders every --sk-* token as a live swatch/sample. Not a story and not a
// component export — a Storybook docs helper for the Tokens page. Values are read
// from src/tokens.ts, so this can never drift from the generated CSS.

const cssVar = (name: string) => `var(--sk-${name})`

// --- WCAG 2.1 contrast (Storybook-only, not shipped) --------------------------
// The color swatches carry a live contrast badge (ratio + PASS/FAIL at AA 4.5:1)
// for every token used as text/foreground, computed against --sk-bg and
// --sk-surface in the currently active theme. Resolved CSS-var values are read at
// runtime (client-only) so the badge tracks the Storybook theme toolbar / any
// [data-theme] wrapper, rather than hard-coding one theme's hex.

/** Token suffixes that are used as text/icon foreground colors. */
const FOREGROUND_TOKENS = [
  'text',
  'text-dim',
  'text-faint',
  'accent',
  'accent-deep',
  'premium',
  'premium-dim',
  'success',
  'on-accent',
] as const

/** Parse a CSS color (`#rgb`/`#rrggbb`/`#rrggbbaa`, `rgb()`/`rgba()`) to sRGB 0–255. */
function parseColor(input: string): [number, number, number] | null {
  const s = input.trim()
  if (s.startsWith('#')) {
    let hex = s.slice(1)
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('')
    }
    if (hex.length !== 6 && hex.length !== 8) return null
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
    return [r, g, b]
  }
  const m = s.match(/rgba?\(([^)]+)\)/i)
  if (m) {
    const parts = (m[1] ?? '').split(/[,/\s]+/).filter(Boolean)
    if (parts.length < 3) return null
    const r = Number.parseFloat(parts[0] ?? '')
    const g = Number.parseFloat(parts[1] ?? '')
    const b = Number.parseFloat(parts[2] ?? '')
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
    return [r, g, b]
  }
  return null
}

/** WCAG relative luminance of an sRGB triple. */
function relativeLuminance([r, g, b]: [number, number, number]): number {
  const lin = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** WCAG contrast ratio between two resolved CSS colors, or null if unparseable. */
function contrastRatio(fg: string, bg: string): number | null {
  const f = parseColor(fg)
  const b = parseColor(bg)
  if (!f || !b) return null
  const lf = relativeLuminance(f)
  const lb = relativeLuminance(b)
  const hi = Math.max(lf, lb)
  const lo = Math.min(lf, lb)
  return (hi + 0.05) / (lo + 0.05)
}

const badgeBase: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '1px 6px',
  borderRadius: 'var(--sk-radius-pill)',
  fontSize: '10px',
  fontFamily: 'var(--sk-font-sans)',
  lineHeight: 1.6,
  border: '1px solid var(--sk-line)',
  whiteSpace: 'nowrap',
}

/** One "text on <surface>" contrast badge. */
function ContrastBadge({ on, ratio }: { on: string; ratio: number | null }) {
  if (ratio == null) return null
  const pass = ratio >= 4.5
  return (
    <span
      style={{
        ...badgeBase,
        color: pass ? 'var(--sk-success)' : 'var(--sk-accent)',
      }}
      title={`Contrast of this color as text on --sk-${on}: ${ratio.toFixed(2)}:1 (AA normal text needs 4.5:1)`}
    >
      <span style={{ color: 'var(--sk-text-dim)' }}>on {on}</span>
      <strong>{ratio.toFixed(2)}</strong>
      <span>{pass ? 'PASS' : 'FAIL'}</span>
    </span>
  )
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section style={{ marginBottom: 32 }}>
    <h3
      style={{
        font: 'var(--sk-weight-bold) var(--sk-text-lg)/1.2 var(--sk-font-display)',
        letterSpacing: 'var(--sk-tracking-tight)',
        margin: '0 0 12px',
      }}
    >
      {title}
    </h3>
    {children}
  </section>
)

const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: 12,
}

const cardStyle: CSSProperties = {
  border: '1px solid var(--sk-line)',
  borderRadius: 'var(--sk-radius-sm)',
  overflow: 'hidden',
  background: 'var(--sk-surface)',
}

const metaRow: CSSProperties = {
  padding: '8px 10px',
  fontSize: 'var(--sk-text-sm)',
  fontFamily: 'var(--sk-font-sans)',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
}

function ColorSwatches() {
  const ref = useRef<HTMLDivElement>(null)
  // Resolved CSS-var values for the current theme, keyed by token suffix. Empty
  // on the server / first paint; filled in the effect below (client-only).
  const [resolved, setResolved] = useState<Record<string, string>>({})

  useEffect(() => {
    if (typeof window === 'undefined') return
    const read = () => {
      // Read from a node inside this gallery so a [data-theme] wrapper (e.g.
      // ThemedTokenGallery) resolves correctly; fall back to <html>.
      const el = ref.current ?? document.documentElement
      const style = getComputedStyle(el)
      const next: Record<string, string> = {}
      for (const name of Object.keys(colors)) {
        next[name] = style.getPropertyValue(`--sk-${name}`).trim()
      }
      setResolved(next)
    }
    read()
    // Re-read when the Storybook theme toolbar flips data-theme on <html>.
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  const bg = resolved.bg
  const surface = resolved.surface

  return (
    <div ref={ref} style={grid}>
      {Object.keys(colors).map((name) => {
        const isForeground = (FOREGROUND_TOKENS as readonly string[]).includes(name)
        const fg = resolved[name]
        return (
          <div key={name} style={cardStyle}>
            <div style={{ height: 56, background: cssVar(name) }} />
            <div style={metaRow}>
              <code style={{ color: 'var(--sk-text)' }}>--sk-{name}</code>
              {isForeground && fg && bg && surface && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  <ContrastBadge on="bg" ratio={contrastRatio(fg, bg)} />
                  <ContrastBadge on="surface" ratio={contrastRatio(fg, surface)} />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TypeScale() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Object.entries(fontSizes).map(([key, value]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <code style={{ width: 96, color: 'var(--sk-text-dim)', fontSize: 'var(--sk-text-sm)' }}>
            text-{key}
          </code>
          <span style={{ fontSize: cssVar(`text-${key}`), fontFamily: 'var(--sk-font-display)' }}>
            Sukuna {value}
          </span>
        </div>
      ))}
    </div>
  )
}

function Weights() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {Object.entries(fontWeights).map(([key, value]) => (
        <span key={key} style={{ fontWeight: value, fontSize: 'var(--sk-text-xl)' }}>
          {key} {value}
        </span>
      ))}
    </div>
  )
}

function Tracking() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Object.entries(tracking).map(([key, value]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <code style={{ width: 96, color: 'var(--sk-text-dim)', fontSize: 'var(--sk-text-sm)' }}>
            {key}
          </code>
          <span
            style={{
              letterSpacing: cssVar(`tracking-${key}`),
              textTransform: key === 'eyebrow' ? 'uppercase' : 'none',
            }}
          >
            {value} — the quick brown fox
          </span>
        </div>
      ))}
    </div>
  )
}

function Leading() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {Object.entries(leading).map(([key, value]) => (
        <p
          key={key}
          style={{
            lineHeight: cssVar(`leading-${key}`),
            maxWidth: 200,
            margin: 0,
            border: '1px solid var(--sk-line)',
            padding: 8,
            borderRadius: 'var(--sk-radius-sm)',
          }}
        >
          <code style={{ color: 'var(--sk-text-dim)', fontSize: 'var(--sk-text-sm)' }}>
            {key} {value}
          </code>
          <br />
          Dark is the identity; light is a mode. Crimson is for action.
        </p>
      ))}
    </div>
  )
}

function Spacing() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Object.entries(space).map(([key, value]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <code style={{ width: 96, color: 'var(--sk-text-dim)', fontSize: 'var(--sk-text-sm)' }}>
            space-{key}
          </code>
          <div
            style={{ width: cssVar(`space-${key}`), height: 16, background: 'var(--sk-accent)' }}
          />
          <span style={{ color: 'var(--sk-text-dim)', fontSize: 'var(--sk-text-sm)' }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}

function Radii() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {Object.entries(radius).map(([key, value]) => (
        <div key={key} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: 'var(--sk-surface-2)',
              border: '1px solid var(--sk-line)',
              borderRadius: cssVar(`radius-${key}`),
            }}
          />
          <code style={{ color: 'var(--sk-text-dim)', fontSize: 'var(--sk-text-sm)' }}>
            {key} {value}
          </code>
        </div>
      ))}
    </div>
  )
}

function Elevation() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: 8 }}>
      {Object.keys(shadows).map((key) => (
        <div key={key} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 140,
              height: 88,
              background: 'var(--sk-surface)',
              borderRadius: 'var(--sk-radius-md)',
              boxShadow: cssVar(`shadow-${key}`),
            }}
          />
          <code style={{ color: 'var(--sk-text-dim)', fontSize: 'var(--sk-text-sm)' }}>
            shadow-{key}
          </code>
        </div>
      ))}
    </div>
  )
}

function Motion() {
  const rows = [
    ...Object.entries(motion.duration).map(([k, v]) => [`duration-${k}`, v] as const),
    ['ease', motion.ease] as const,
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {rows.map(([name, value]) => (
        <code key={name} style={{ fontSize: 'var(--sk-text-sm)' }}>
          --sk-{name}: {value}
        </code>
      ))}
    </div>
  )
}

function ZIndex() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {Object.entries(zIndex).map(([name, value]) => (
        <code key={name} style={{ fontSize: 'var(--sk-text-sm)' }}>
          --sk-z-{name}: {value}
        </code>
      ))}
    </div>
  )
}

/** The full token gallery, rendered plain. Wrap in a `[data-theme]` frame to theme it. */
export function TokenGallery() {
  return (
    <div style={{ fontFamily: 'var(--sk-font-sans)' }}>
      <Section title="Color">
        <ColorSwatches />
      </Section>
      <Section title="Type scale">
        <TypeScale />
      </Section>
      <Section title="Weights">
        <Weights />
      </Section>
      <Section title="Tracking">
        <Tracking />
      </Section>
      <Section title="Leading">
        <Leading />
      </Section>
      <Section title="Spacing">
        <Spacing />
      </Section>
      <Section title="Radius">
        <Radii />
      </Section>
      <Section title="Elevation">
        <Elevation />
      </Section>
      <Section title="Motion">
        <Motion />
      </Section>
      <Section title="Z-index">
        <ZIndex />
      </Section>
    </div>
  )
}

/** Token gallery wrapped in a themed surface, for side-by-side dark/light review. */
export function ThemedTokenGallery({ theme }: { theme: 'dark' | 'light' }) {
  return (
    <div
      data-theme={theme}
      style={{
        background: 'var(--sk-bg)',
        color: 'var(--sk-text)',
        padding: 24,
        borderRadius: 'var(--sk-radius-md)',
        border: '1px solid var(--sk-line)',
      }}
    >
      <p
        style={{
          margin: '0 0 16px',
          textTransform: 'uppercase',
          letterSpacing: 'var(--sk-tracking-eyebrow)',
          fontSize: 'var(--sk-text-xs)',
          color: 'var(--sk-text-dim)',
        }}
      >
        {theme}
      </p>
      <TokenGallery />
    </div>
  )
}
