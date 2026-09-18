import { type CSSProperties, type ReactNode, useEffect, useState } from 'react'
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Chip,
  Combobox,
  Dialog,
  Divider,
  Drawer,
  Input,
  Menu,
  Pagination,
  Progress,
  RadioGroup,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Stepper,
  Switch,
  Table,
  Tabs,
  Text,
  ToastProvider,
  Tooltip,
  useToast,
} from 'sukuna-ui'

const shell: CSSProperties = { maxWidth: 1120, margin: '0 auto', padding: '0 24px 96px' }
const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }
const col: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 }

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 40 }}>
      <Text
        as="h2"
        font="display"
        size="lg"
        weight="bold"
        style={{ marginBottom: 14, letterSpacing: 'var(--sk-tracking-tight)' }}
      >
        {title}
      </Text>
      <Card elevation="raised" padding="lg">
        {children}
      </Card>
    </section>
  )
}

function ToastDemo() {
  const { toast } = useToast()
  return (
    <Button
      variant="secondary"
      onClick={() => toast({ title: 'Saved', description: 'Your changes are live.' })}
    >
      Show toast
    </Button>
  )
}

const selectItems = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
]

function Showcase() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [page, setPage] = useState(2)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div style={{ minHeight: '100vh' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          background: 'color-mix(in srgb, var(--sk-bg) 78%, transparent)',
          borderBottom: '1px solid var(--sk-line)',
        }}
      >
        <div
          style={{
            ...shell,
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Text as="span" font="display" size="lg" weight="black">
              sukuna<span style={{ color: 'var(--sk-accent)' }}>-ui</span>
            </Text>
            <Badge tone="accent" dot>
              showcase
            </Badge>
          </div>
          <Button
            variant="ghost"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? '☾ Dark' : '☀ Light'} — toggle
          </Button>
        </div>
      </header>

      <main style={shell}>
        <div style={{ padding: '48px 0 8px' }}>
          <Text as="h1" font="display" size="xl" weight="black">
            Every component, one page
          </Text>
          <Text tone="dim" size="lg" style={{ marginTop: 8 }}>
            Dark is the identity; light is a mode. Flip the toggle to see both.
          </Text>
        </div>

        <Section title="Typography">
          <div style={col}>
            <Text as="h3" font="display" size="xl" weight="black">
              Display / Archivo black
            </Text>
            <Text size="lg" weight="bold">
              Bold body large
            </Text>
            <Text>Default body — the quick brown fox jumps over the lazy dog.</Text>
            <Text tone="dim">Dim secondary text</Text>
            <Text tone="faint">Faint / placeholder text</Text>
            <Text tone="accent" weight="semibold">
              Accent text
            </Text>
            <Text tone="premium" weight="semibold">
              Premium bone text
            </Text>
          </div>
        </Section>

        <Section title="Buttons">
          <div style={row}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        <Section title="Badges · Chips · Avatars">
          <div style={row}>
            <Badge>Neutral</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="premium">Premium</Badge>
            <Divider orientation="vertical" style={{ height: 24 }} />
            <Chip>Filter</Chip>
            <Chip tone="accent" onDismiss={() => {}}>
              Dismissible
            </Chip>
            <Chip tone="success">Active</Chip>
            <Divider orientation="vertical" style={{ height: 24 }} />
            <Avatar fallback="AR" />
            <Avatar fallback="JS" size="lg" />
            <Avatar src="https://i.pravatar.cc/80?img=12" alt="User" size="lg" />
          </div>
        </Section>

        <Section title="Alerts">
          <div style={col}>
            <Alert title="Heads up">This is an informational alert.</Alert>
            <Alert tone="success" title="Success">
              Your payment went through.
            </Alert>
            <Alert tone="warning" title="Careful">
              Your trial ends in 3 days.
            </Alert>
            <Alert tone="danger" title="Error">
              Something went wrong.
            </Alert>
          </div>
        </Section>

        <Section title="Form controls">
          <div style={{ ...col, maxWidth: 380 }}>
            <Input placeholder="Email address" aria-label="Email" />
            <Input placeholder="Invalid input" invalid aria-label="Invalid" />
            <div style={row}>
              <Checkbox defaultChecked /> <Text>Checkbox</Text>
              <Switch defaultChecked /> <Text>Switch</Text>
            </div>
            <RadioGroup
              aria-label="Plan"
              defaultValue="pro"
              items={[
                { value: 'free', label: 'Free' },
                { value: 'pro', label: 'Pro' },
                { value: 'ent', label: 'Enterprise', disabled: true },
              ]}
            />
            <div style={{ paddingTop: 4 }}>
              <Slider defaultValue={40} aria-label="Volume" />
            </div>
          </div>
        </Section>

        <Section title="Selects · Combobox · Menu">
          <div style={row}>
            <Select items={selectItems} placeholder="Framework" aria-label="Framework" />
            <Combobox
              items={['Apple', 'Banana', 'Cherry', 'Grapefruit', 'Mango']}
              aria-label="Fruit"
              maxRenderedItems={50}
            />
            <Menu
              items={[
                { label: 'Edit', onSelect: () => {} },
                { label: 'Duplicate', onSelect: () => {} },
                { label: 'Delete', onSelect: () => {}, disabled: true },
              ]}
            >
              <Button variant="secondary">Open menu ▾</Button>
            </Menu>
          </div>
        </Section>

        <Section title="Overlays — Tooltip · Dialog · Drawer · Toast">
          <div style={row}>
            <Tooltip content="Tooltips clear dialogs and dropdowns">
              <Button variant="ghost">Hover me</Button>
            </Tooltip>
            <Dialog>
              <Dialog.Trigger>
                <Button>Open dialog</Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Title>Member role</Dialog.Title>
                <Dialog.Description>
                  A dropdown inside a dialog renders above it.
                </Dialog.Description>
                <div style={{ marginTop: 16 }}>
                  <Select items={selectItems} defaultValue="react" aria-label="Role" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                  <Dialog.Close render={<Button>Done</Button>} />
                </div>
              </Dialog.Content>
            </Dialog>
            <Drawer>
              <Drawer.Trigger>
                <Button variant="secondary">Open drawer</Button>
              </Drawer.Trigger>
              <Drawer.Content side="right">
                <Drawer.Title>Filters</Drawer.Title>
                <Drawer.Description>Refine your results.</Drawer.Description>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                  <Drawer.Close render={<Button>Apply</Button>} />
                </div>
              </Drawer.Content>
            </Drawer>
            <ToastDemo />
          </div>
        </Section>

        <Section title="Navigation — Tabs · Accordion · Breadcrumbs · Pagination · Stepper">
          <div style={col}>
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Library', href: '/library' },
                { label: 'Components', current: true },
              ]}
            />
            <Tabs
              defaultValue="account"
              items={[
                { value: 'account', label: 'Account', content: <Text>Manage your account.</Text> },
                { value: 'billing', label: 'Billing', content: <Text>Update billing.</Text> },
                { value: 'team', label: 'Team', content: <Text>Team.</Text>, disabled: true },
              ]}
            />
            <Divider />
            <Accordion
              defaultValue={['ship']}
              items={[
                { value: 'ship', trigger: 'Shipping', content: 'Ships in 2–3 business days.' },
                { value: 'returns', trigger: 'Returns', content: 'Free returns within 30 days.' },
              ]}
            />
            <Divider />
            <Stepper
              activeStep={1}
              steps={[
                { label: 'Cart', description: 'Review items' },
                { label: 'Shipping', description: 'Address' },
                { label: 'Payment', description: 'Card' },
              ]}
            />
            <Pagination page={page} count={10} onPageChange={setPage} />
          </div>
        </Section>

        <Section title="Feedback — Progress · Spinner · Skeleton">
          <div style={col}>
            <div style={row}>
              <Spinner size="sm" />
              <Spinner />
              <Spinner size="lg" />
              <Text tone="dim">Loading…</Text>
            </div>
            <Progress value={60} label="Uploading" />
            <Progress value={null} label="Working" />
            <div style={{ ...col, maxWidth: 360 }}>
              <Skeleton style={{ height: 16, width: '70%' }} />
              <Skeleton style={{ height: 16, width: '90%' }} />
              <Skeleton style={{ height: 16, width: '55%' }} />
            </div>
          </div>
        </Section>

        <Section title="Data — Table">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col">Name</Table.HeaderCell>
                <Table.HeaderCell scope="col">Role</Table.HeaderCell>
                <Table.HeaderCell scope="col">Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {[
                { name: 'Ada Lovelace', role: 'Admin', status: 'Active' },
                { name: 'Alan Turing', role: 'Editor', status: 'Invited' },
                { name: 'Grace Hopper', role: 'Viewer', status: 'Active' },
              ].map((r) => (
                <Table.Row key={r.name}>
                  <Table.Cell>{r.name}</Table.Cell>
                  <Table.Cell>{r.role}</Table.Cell>
                  <Table.Cell>
                    <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Section>

        <div style={{ marginTop: 56, textAlign: 'center' }}>
          <Text tone="faint" size="sm">
            sukuna-ui · 29 components · one CSS import
          </Text>
        </div>
      </main>
    </div>
  )
}

export function App() {
  return (
    <ToastProvider>
      <Showcase />
    </ToastProvider>
  )
}
