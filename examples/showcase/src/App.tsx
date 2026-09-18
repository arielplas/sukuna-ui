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

const GITHUB_URL = 'https://github.com/arielplas/sukuna-ui'
const NPM_URL = 'https://www.npmjs.com/package/sukuna-ui'

const shell: CSSProperties = { maxWidth: 1120, margin: '0 auto', padding: '0 24px 96px' }
const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }
const col: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 }
const mono: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
}
const codeChip: CSSProperties = {
  ...mono,
  fontSize: 13,
  padding: '2px 6px',
  borderRadius: 'var(--sk-radius-sm)',
  background: 'var(--sk-surface-2)',
  border: '1px solid var(--sk-line-soft)',
  color: 'var(--sk-text)',
}
const link: CSSProperties = { color: 'var(--sk-accent)', textDecorationThickness: 1 }

/** "Badges · Chips · Avatars" → "badges-chips-avatars" — stable anchors for deep links. */
const kebab = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = kebab(title)
  return (
    <section id={id} style={{ marginTop: 40 }}>
      <Text
        as="h2"
        font="display"
        size="lg"
        weight="bold"
        style={{ marginBottom: 14, letterSpacing: 'var(--sk-tracking-tight)' }}
      >
        <a href={`#${id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {title}
        </a>
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

function Hero() {
  return (
    <div style={{ padding: '56px 0 8px', maxWidth: 820 }}>
      <Text
        as="p"
        size="xs"
        weight="semibold"
        tone="accent"
        tracking="eyebrow"
        style={{ marginBottom: 16 }}
      >
        React · Tailwind v4 tokens · SSR / RSC-safe · WCAG AA
      </Text>
      <Text as="h1" font="display" size="3xl" weight="black" leading="tight" tracking="tight">
        React components built for dark-first products — and for the agents that build them.
      </Text>
      <Text tone="dim" size="lg" style={{ marginTop: 18, maxWidth: 640 }}>
        30 accessible components, one CSS import, zero runtime styling. Dark is the identity, light
        is a mode, and every component ships with docs your coding agent can read.
      </Text>

      <pre
        style={{
          ...mono,
          margin: '28px 0 0',
          padding: '14px 18px',
          fontSize: 14,
          lineHeight: 1.7,
          overflowX: 'auto',
          background: 'var(--sk-well)',
          border: '1px solid var(--sk-line)',
          borderRadius: 'var(--sk-radius-md)',
          maxWidth: 480,
        }}
      >
        <code>
          <span aria-hidden="true" style={{ color: 'var(--sk-text-faint)', userSelect: 'none' }}>
            ${' '}
          </span>
          bun add sukuna-ui{'\n'}
          <span aria-hidden="true" style={{ color: 'var(--sk-text-faint)', userSelect: 'none' }}>
            ${' '}
          </span>
          npm i sukuna-ui
        </code>
      </pre>

      <div style={{ ...row, gap: 12, marginTop: 24 }}>
        <Button as="a" href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </Button>
        <Button as="a" href={NPM_URL} target="_blank" rel="noreferrer" variant="secondary">
          npm
        </Button>
        <Button as="a" href="/llms.txt" variant="ghost">
          llms.txt for your agent
        </Button>
      </div>
    </div>
  )
}

function AgentsSection() {
  const li: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 }
  return (
    <Section title="Built for AI agents">
      <Text tone="dim" style={{ maxWidth: 680 }}>
        Every component is documented in plain Markdown, served next to the site. Point your agent
        at one URL and it gets the full API — props, variants, accessibility contract, examples.
      </Text>
      <ul
        style={{
          ...col,
          gap: 16,
          listStyle: 'none',
          padding: 0,
          margin: '20px 0 0',
        }}
      >
        <li style={li}>
          <Text weight="semibold">
            <a href="/llms.txt" style={link}>
              <code style={codeChip}>/llms.txt</code>
            </a>{' '}
            — the index
          </Text>
          <Text tone="dim" size="sm">
            What the library is, how to install it, and a link per component. Start here.
          </Text>
        </li>
        <li style={li}>
          <Text weight="semibold">
            <a href="/llms-full.txt" style={link}>
              <code style={codeChip}>/llms-full.txt</code>
            </a>{' '}
            — everything in one file
          </Text>
          <Text tone="dim" size="sm">
            Paste this URL into your agent for full context: all 30 component docs, tokens and
            styling rules in a single response.
          </Text>
        </li>
        <li style={li}>
          <Text weight="semibold">
            <code style={codeChip}>/llms/&lt;name&gt;.md</code> — one component at a time
          </Text>
          <Text tone="dim" size="sm">
            Per-component pages, e.g.{' '}
            <a href="/llms/button.md" style={link}>
              <code style={codeChip}>/llms/button.md</code>
            </a>
            , when you only need the one you are wiring up.
          </Text>
        </li>
        <li style={li}>
          <Text weight="semibold">Context7</Text>
          <Text tone="dim" size="sm">
            Using the Context7 MCP? Ask your agent to resolve{' '}
            <code style={codeChip}>sukuna-ui</code> and it pulls these same docs into its context.
          </Text>
        </li>
      </ul>
    </Section>
  )
}

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
        <Hero />

        <AgentsSection />

        <div style={{ marginTop: 56 }}>
          <Text as="p" size="xs" weight="semibold" tone="faint" tracking="eyebrow">
            Every component, one page
          </Text>
          <Text tone="dim" style={{ marginTop: 6 }}>
            Flip the toggle in the header to see both themes.
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
              <Checkbox defaultChecked label="Checkbox" />
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

        <footer style={{ marginTop: 56, textAlign: 'center' }}>
          <Text tone="faint" size="sm">
            sukuna-ui · 30 components · one CSS import · MIT ·{' '}
            <a href={GITHUB_URL} style={link}>
              GitHub
            </a>{' '}
            ·{' '}
            <a href={NPM_URL} style={link}>
              npm
            </a>{' '}
            ·{' '}
            <a href="/llms.txt" style={link}>
              llms.txt
            </a>
          </Text>
        </footer>
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
