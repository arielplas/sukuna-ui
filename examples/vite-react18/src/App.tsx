import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  Input,
  Select,
  Switch,
  Text,
  Tooltip,
} from '@sukuna/ui'
import { useState } from 'react'

const frameworks = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
]

function Demo() {
  const [checked, setChecked] = useState(true)
  const [on, setOn] = useState(false)
  const [framework, setFramework] = useState('react')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
      <Text as="h1" font="display" size="3xl" weight="black" tracking="tight">
        @sukuna/ui in Vite + React 19
      </Text>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button loading>Loading</Button>
        <Tooltip content="Crimson is for action">
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Badge>Neutral</Badge>
        <Badge tone="accent" dot>
          LIVE
        </Badge>
        <Badge tone="success">Done</Badge>
        <Badge tone="premium">PREMIUM</Badge>
      </div>

      <Card elevation="raised">
        <Text as="h2" font="display" size="lg" weight="bold">
          Sign in
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          <Input aria-label="Email" type="email" placeholder="you@example.com" />
          <Input aria-label="Password" type="password" placeholder="••••••••" invalid />
          <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <Checkbox id="remember" checked={checked} onCheckedChange={setChecked} />
            <label htmlFor="remember" style={{ fontSize: 'var(--sk-text-sm)' }}>
              Remember me
            </label>
          </div>
          <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <Switch checked={on} onCheckedChange={setOn} aria-label="Notifications" />
            <Text as="span" size="sm">
              Notifications {on ? 'on' : 'off'}
            </Text>
          </div>
          <Select
            items={frameworks}
            value={framework}
            onValueChange={setFramework}
            aria-label="Framework"
          />
          <Dialog>
            <Dialog.Trigger>
              <Button fullWidth>Open dialog</Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Welcome</Dialog.Title>
              <Dialog.Description>Every component, one CSS import.</Dialog.Description>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <Dialog.Close render={<Button>Got it</Button>} />
              </div>
            </Dialog.Content>
          </Dialog>
        </div>
      </Card>
    </div>
  )
}

export function App() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--sk-bg)', padding: 32 }}>
      <div data-theme="dark" style={{ marginBottom: 32 }}>
        <Demo />
      </div>
      <div data-theme="light">
        <Demo />
      </div>
    </main>
  )
}
