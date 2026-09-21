# Component: Counter

> Follows the `docs/component-button.md` section template. Client component (`'use client'`) —
> the count-up is a mount-time enhancement over a server-rendered final value.

## 1. Purpose

Animates a number from a start to a target value — for stat tiles, KPIs, pricing, and dashboards.
The **server renders the final value** (correct for no-JS and SEO); the animation is a progressive
enhancement that runs once on the client. Motion is decorative and never gates the information.

## 2. Files

```
src/components/counter/
├── counter.styles.tsx   # tv() variant map → Tailwind utilities. Pure. Server-safe.
├── counter.logic.tsx    # 'use client' — rAF count-up, forwardRef, a11y wiring.
├── counter.test.tsx
├── counter.stories.tsx
└── index.tsx            # export { Counter } ; export type { CounterProps }
```

## 3. API

```ts
import type { ComponentPropsWithoutRef } from 'react'

interface CounterOwnProps {
  value: number              // target value; ALSO the value rendered on the server / with no JS
  from?: number              // animation start; default 0
  duration?: number          // ms; default 1200
  decimals?: number          // fixed fraction digits; default 0
  prefix?: string            // e.g. '$'
  suffix?: string            // e.g. '%', 'k'
  format?: (n: number) => string   // full custom formatter; overrides decimals/prefix/suffix
  once?: boolean             // default true; animate only the first mount, snap on later value changes
}

// Renders a <span>. `children` is omitted — the number IS the content.
export type CounterProps =
  CounterOwnProps & Omit<ComponentPropsWithoutRef<'span'>, 'children'>
```

Deliberately **not** in v1: `startOnView` (count when scrolled into view — deferred; needs
`IntersectionObserver`, planned as a follow-up), locale/`Intl.NumberFormat` presets (pass your own
via `format`), scroll-scrubbed counting, spring physics, per-digit odometer roll. `format` is the
escape hatch for currency/locale — `format={(n) => n.toLocaleString()}`.

## 4. Variants → tokens

No color/size variants — a Counter inherits type and color from its context (wrap it in `Text`, or
set `className`). The only intrinsic style is **`tabular-nums`** (`--sk-` numerals rule) so the width
doesn't jitter frame to frame while counting.

| Base | Utility |
|---|---|
| numerals | `tabular-nums` |

No new color/spacing tokens required.

## 5. States

| State | Behavior |
|---|---|
| server / no-JS | renders the formatted **`value`** (final). This is the accessible source of truth. |
| mount (motion OK) | displays `from`, then rAF-interpolates to `value` over `duration` with an ease-out curve; ends exactly on `value`. |
| prefers-reduced-motion | **no animation** — shows the final `value` immediately (WCAG 2.3.3 / respects `motion-reduce`). |
| value change (`once={false}`) | re-animates from the currently displayed number to the new `value`. |
| value change (`once`, default) | snaps to the new `value` without re-animating. |

> One-frame note: because the server emits the final value, the mount effect briefly sets the
> display to `from` before the first animation frame. This is imperceptible and never happens for
> reduced-motion users. Documented as the SSR-correct tradeoff — we optimize for no-JS/SEO
> correctness over a hypothetical flash.

## 6. Logic (`counter.logic.tsx`)

- `'use client'` — uses `useEffect`, `useRef`, `requestAnimationFrame`.
- `forwardRef<HTMLSpanElement, CounterProps>`.
- Initial render state = the formatted **final** value (matches server HTML → clean hydration).
- Effect (deps `[value, from, duration, once]`): when `once` and already done, snap to `value` and
  return. Else read `window.matchMedia('(prefers-reduced-motion: reduce)').matches`; if reduced,
  leave the final value and return. Otherwise set display to `from` and start the rAF loop; cancel on
  unmount and on dependency change.
- Easing: `easeOutCubic` (`1 - (1 - t) ** 3`) — matches the `--sk-ease` deceleration feel.
  `duration <= 0` renders the target immediately.
- Formatting helper `fmt(n)` = `format ? format(n) : prefix + n.toFixed(decimals) + suffix`, used for
  both the visible (`aria-hidden`) text and the `aria-label`.
- Wrapper is `role="img"` + `aria-label={fmt(value)}` so the number is announced once, not per frame.
- No `window`/timing access outside `useEffect`.

## 7. Styles (`counter.styles.tsx`)

```ts
import { tv, type VariantProps } from '../../utils/tv'

export const counterStyles = tv({
  base: 'tabular-nums',
})
export type CounterStyleProps = VariantProps<typeof counterStyles>
```

Intentionally minimal — the Counter is a numeric text node; color/size come from context or a
consumer `className` (merged last by `tv()`).

## 8. Accessibility checklist

- [ ] The animating digits are decorative: put the mid-animation text in an `aria-hidden` inner
      span and expose the **final** formatted value via `role="img"` + `aria-label` on the outer
      `<span>`, so a screen reader announces `"1,234"` once, not every frame. (`role="img"` is what
      makes `aria-label` valid on the wrapper — a bare `<span aria-label>` fails axe's
      `aria-prohibited-attr`.)
- [ ] Reduced-motion users get the final value with no animation.
- [ ] The final value is present in server HTML (no-JS + SEO + SR all read it).
- [ ] `tabular-nums` prevents layout shift during the count.
- [ ] Color/contrast is the responsibility of the surrounding `Text`/`className`; Counter adds none.

## 9. Tests

Harness in `docs/testing.md`. Required cases:

- Server render (`renderServer`) outputs the formatted **final** value (not `from`).
- Reduced-motion (mock `matchMedia` → `matches: true`) shows the final value with no rAF scheduled.
- With motion, advancing rAF/timers interpolates and lands exactly on `value`.
- `decimals`, `prefix`, `suffix` format correctly; `format` overrides them.
- `aria-label` equals the final formatted value; inner animated node is `aria-hidden`.
- `duration <= 0` renders the target immediately.
- `once={false}` re-animates when `value` changes; `once` (default) snaps.
- Forwards `ref` to the `<span>`; consumer `className` wins; variant props don't leak to the DOM.
- axe: zero violations in both themes.

## 10. Stories

`Playground` (controls), `Basic`, `Currency` (`format`), `Percentage`, `Decimals`, `FromNonZero`.
Rendered under both themes.

## 11. Decisions

- **SSR renders the final value**, animation is a mount enhancement — chosen for no-JS/SEO
  correctness over avoiding a sub-frame flash (see §5 note). `// DECISION(open)` if the owner
  prefers server-rendering `from` instead.
- **`startOnView` deferred out of v1** — it needs `IntersectionObserver` (absent in the happy-dom
  test env, extra branches to cover). v1 animates on mount; scroll-triggered counting is a planned
  follow-up.
- Reduced-motion shows the final value immediately (no partial count).
- `role="img"` + `aria-label` carries the final value so the animation never spams assistive tech.
- No locale presets in v1 — `format` is the escape hatch (keeps the component dependency-free; no
  `Intl` surface to test).
- Default `duration` 1200ms, `easeOutCubic` — pending owner confirmation of feel.
