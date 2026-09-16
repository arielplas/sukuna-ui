'use client'

import { Button, Checkbox, Dialog, Input, Select, Switch, Tooltip } from '@sukuna/ui'
import { useState } from 'react'

const frameworks = [
  { value: 'react', label: 'React' },
  { value: 'next', label: 'Next.js' },
  { value: 'remix', label: 'Remix' },
]

// Client island: the interactive components live behind a 'use client' boundary.
export function Demo() {
  const [remember, setRemember] = useState(true)
  const [notify, setNotify] = useState(false)
  const [framework, setFramework] = useState('next')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button>Primary</Button>
        <Tooltip content="Crimson is for action">
          <Button variant="secondary">Hover</Button>
        </Tooltip>
      </div>
      <Input aria-label="Email" type="email" placeholder="you@example.com" />
      <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
        <Checkbox id="remember" checked={remember} onCheckedChange={setRemember} />
        <label htmlFor="remember" style={{ fontSize: 'var(--sk-text-sm)' }}>
          Remember me
        </label>
      </div>
      <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
        <Switch checked={notify} onCheckedChange={setNotify} aria-label="Notifications" />
        <span style={{ fontSize: 'var(--sk-text-sm)' }}>Notifications {notify ? 'on' : 'off'}</span>
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
  )
}
