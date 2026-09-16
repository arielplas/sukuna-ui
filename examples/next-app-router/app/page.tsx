// NO 'use client' — this is a React Server Component. It imports the static components
// (Text, Badge, Card — server-safe) directly, and renders the interactive client island below.
// If Text/Badge/Card wrongly carried 'use client', or Button/etc. lacked it, `next build` would
// fail here — so a green build validates the RSC boundaries end to end.
import { Badge, Card, Text } from 'sukuna-ui'
import { Demo } from './demo'

export default function Page() {
  return (
    <main style={{ minHeight: '100vh', padding: 32 }}>
      <Text as="h1" font="display" size="3xl" weight="black" tracking="tight">
        sukuna-ui in Next.js (App Router, RSC)
      </Text>
      <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
        <Badge tone="accent" dot>
          server component
        </Badge>
        <Badge tone="success">SSR</Badge>
      </div>
      <Card elevation="raised" style={{ maxWidth: 480 }}>
        <Text as="h2" font="display" size="lg" weight="bold">
          Rendered on the server
        </Text>
        <Text tone="dim" size="sm" style={{ marginTop: 4 }}>
          The heading, badges, and this card are server components. The controls below are a client
          island.
        </Text>
        <div style={{ marginTop: 16 }}>
          <Demo />
        </div>
      </Card>
    </main>
  )
}
