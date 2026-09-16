# Component: Switch

> Follows the `docs/component-button.md` template. `'use client'` — holds controllable state.

## 1. Purpose

An on/off toggle for an immediate setting (not form submission). There is no native switch element,
so it's a `<button role="switch">` with a sliding thumb; keyboard and semantics come from the button.

## 2. Files

```
src/components/switch/
├── switch.styles.tsx   # tv() with slots: root (track) + thumb.
├── switch.logic.tsx    # 'use client' (controllable state).
├── switch.test.tsx
├── switch.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef } from 'react'

type Native = Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'onClick' | 'value' | 'role' | 'aria-checked'>

export interface SwitchProps extends Native {
  size?: 'sm' | 'md'                    // default 'md'
  checked?: boolean
  defaultChecked?: boolean              // default false
  onCheckedChange?: (checked: boolean) => void
}
```

Toggle via `onCheckedChange`. Uncontrolled + controlled through `useControllableState`. Give it an
accessible name (`aria-label` / `aria-labelledby`).

## 4. Variants → tokens

Slots — `root` (the track/button) and `thumb`:

- root base: `group relative inline-flex items-center rounded-pill p-0.5 border border-line bg-surface-2 transition-colors duration-fast ease-sukuna cursor-pointer aria-checked:bg-gradient-accent aria-checked:border-transparent disabled:opacity-45 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow focus-visible:ring-offset-2 focus-visible:ring-offset-bg`
- thumb base: `inline-block rounded-full bg-text transition-transform duration-fast ease-sukuna`

| size | root | thumb |
|---|---|---|
| sm | `h-5 w-9` | `size-4 group-aria-checked:translate-x-4` |
| md | `h-6 w-11` | `size-5 group-aria-checked:translate-x-5` |

The thumb slides via `group-aria-checked` reading the track's `aria-checked`.

## 5. States

off · on (crimson gradient track, thumb slid right) · focus-visible (accent-glow ring) ·
disabled (opacity .45, not-allowed).

## 6. Logic (`switch.logic.tsx`)

- `'use client'`.
- `forwardRef<HTMLButtonElement, SwitchProps>`.
- `useControllableState<boolean>`; `<button type="button" role="switch" aria-checked={state}
  onClick={() => setState(!state)}>` containing an `aria-hidden` thumb `<span>`.

## 7. Styles (`switch.styles.tsx`)

`tv()` with `slots: { root, thumb }` and a `size` variant; `defaultVariants: { size: 'md' }`.

## 8. Accessibility checklist

- [ ] `role="switch"` with `aria-checked` reflecting state (set by the component).
- [ ] Accessible name required (`aria-label`/`aria-labelledby`) — no visible label is rendered.
- [ ] Space and Enter toggle (native button).
- [ ] Focus ring ≥ 3:1 against the surface in both themes.
- [ ] Thumb is decorative (`aria-hidden`).

## 9. Tests

- Renders both sizes on the server with `role="switch"`.
- Toggles on click uncontrolled; fires `onCheckedChange`; `aria-checked` flips.
- Controlled `checked` stays until the parent updates.
- `disabled` blocks toggling.
- Space/Enter toggle via keyboard.
- Forwards `ref`; variant props don't leak; consumer `className` merges on the root; hydrates;
  axe passes in both themes.

## 10. Stories

`Playground`, `Sizes`, `On`, `Disabled`, `WithLabel`. Both themes.

## 11. Decisions

- Implemented as a `role="switch"` button (not a checkbox) so the thumb can be fully custom while
  keeping switch semantics — see `docs/ai-decisions.md`.
