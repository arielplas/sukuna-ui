# Component: Stepper

> Follows the `docs/component-button.md` template. Static component — no `'use client'`.

## 1. Purpose

Show progress through an ordered sequence of steps.

## 2. Files

```
src/components/stepper/
├── stepper.styles.tsx   # tv() slots: root, list, step, indicator, body, label, description, connector.
├── stepper.logic.tsx    # forwardRef<ol>; NO 'use client'.
├── stepper.test.tsx
├── stepper.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface Step { label: ReactNode; description?: ReactNode }

export interface StepperProps extends Omit<ComponentPropsWithoutRef<'ol'>, 'children'> {
  steps: Step[]
  activeStep: number   // 0-based index of the current step
  orientation?: 'horizontal' | 'vertical'   // default 'horizontal'
}
```

## 4. Variants → tokens

indicator by state: completed `bg-accent text-text border-accent` (check); current
`border-accent text-accent` + ring; upcoming `border-line text-text-faint`. connector: completed →
`bg-accent`, else `bg-line`. label: current/completed `text-text`, upcoming `text-text-dim`.

## 5. States

per step: completed (`index < activeStep`) · current (`=== activeStep`, `aria-current="step"`) ·
upcoming (`> activeStep`).

## 6. Logic (`stepper.logic.tsx`)

- No `'use client'`. `forwardRef<HTMLOListElement>`. `<ol>` of `<li>` steps; each renders an
  indicator (check when completed, else the 1-based number), label, optional description, and a
  connector between steps.

## 7. Styles

`tv()` `slots` + `orientation` variant; indicator/connector state via `data-*`/computed classes.

## 8. Accessibility checklist

- [ ] Ordered list; current step `aria-current="step"`.
- [ ] Completed/current conveyed by more than color (check icon + number + text weight).
- [ ] Give the list an `aria-label` (e.g. "Progress").

## 9. Tests

Renders a step per item; marks completed (check) / current (`aria-current`) / upcoming; connectors
between; ref; className; SSR; axe both themes.

## 10. Stories

`Horizontal`, `Vertical`, `WithDescriptions`, `FirstStep`, `Completed`.

## 11. Decisions

- Display-only (no built-in navigation/click); drive `activeStep` from your own state.
