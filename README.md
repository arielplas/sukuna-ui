# sukuna-ui

A React component library in the Sukuna design language: near-black surfaces, crimson for action,
bone for premium, Archivo headlines. **Dark is the identity; light is a mode.**

- **SSR-safe, zero runtime styling.** Tailwind v4 utilities mapped to `--sk-*` tokens. Static
  components (Text, Badge, Card) work in React Server Components; interactive ones carry
  `'use client'`.
- **Themeable via `data-theme`.** No `dark:` variants, no config — flip `data-theme` and every token
  switches.
- **React 18 and 19.** React is a peer dependency; nothing is bundled twice.
- **Tree-shakeable.** Importing `Button` alone is ~800 B (excluding React/deps).

> Pre-1.0. On `0.x`, minor = breaking, patch = everything else, until all v1 components are used in
> a real app. See [`docs/questions.md`](docs/questions.md) Q6 and [`docs/releasing.md`](docs/releasing.md).

## Install

```bash
bun add sukuna-ui react react-dom
```

## Setup

### Tailwind consumers (primary path)

Add two lines to your global CSS — your Tailwind build then emits exactly the utilities used:

```css
@import "tailwindcss";
@import "sukuna-ui/theme.css";              /* @theme tokens + data-theme palettes */
@source "../node_modules/sukuna-ui/dist";   /* so your build sees our classes */
```

### Non-Tailwind consumers (fallback path)

Import the precompiled stylesheet:

```ts
import "sukuna-ui/styles.css"
```

Second-class: not purged, tokens overridable only via `--sk-*` vars.

### Theme

Set `data-theme` on `<html>` (or any ancestor):

```html
<html data-theme="dark"> <!-- default/brand; or "light" -->
```

Override any token by redefining `--sk-*` under your own selector.

## Usage

```tsx
import { Button, Card, Text, Dialog } from "sukuna-ui"

export function Example() {
  return (
    <Card elevation="raised">
      <Text as="h2" font="display" size="lg" weight="bold">Welcome</Text>
      <Dialog>
        <Dialog.Trigger><Button>Open</Button></Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Hello</Dialog.Title>
          <Dialog.Description>Every component, one CSS import.</Dialog.Description>
          <Dialog.Close render={<Button>Got it</Button>} />
        </Dialog.Content>
      </Dialog>
    </Card>
  )
}
```

## Components

| Tier | Components |
|---|---|
| Static (RSC-safe) | `Text`, `Badge`, `Card` |
| Native interactive | `Button`, `Input`, `Checkbox`, `Switch` |
| Headless-backed (Base UI) | `Tooltip`, `Dialog`, `Select` |

Fonts: the library does **not** bundle Archivo. Load it yourself (`@import` or `next/font`) so
`--sk-font-display` resolves; it falls back to the system sans otherwise.

## RSC notes

`Text`, `Badge`, and `Card` are server components (no `'use client'`). `Button`, `Checkbox`,
`Switch`, `Tooltip`, `Dialog`, and `Select` are client components — the `'use client'` boundary is
per-file in the published package, so a server component importing only `Text` never pulls a client
component in.

## Development

Bun only. See [`CLAUDE.md`](CLAUDE.md) and [`docs/`](docs). Every unit of work ends green:

```bash
bun run check && bun run test:coverage && bun run build && bun run check:pkg
```

- `bun run storybook` — component workshop (dark/light toolbar).
- `bun run test:browser` — Playwright suite (built Storybook).
- `bun run size` — per-export size budget.

## License

MIT
