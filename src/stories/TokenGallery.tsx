import type { CSSProperties, ReactNode } from 'react'
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
  return (
    <div style={grid}>
      {Object.keys(colors).map((name) => (
        <div key={name} style={cardStyle}>
          <div style={{ height: 56, background: cssVar(name) }} />
          <div style={metaRow}>
            <code style={{ color: 'var(--sk-text)' }}>--sk-{name}</code>
          </div>
        </div>
      ))}
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
