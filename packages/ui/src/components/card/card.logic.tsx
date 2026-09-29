import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { type CardStyleProps, cardStyles } from './card.styles'

export interface CardProps
  extends ComponentPropsWithoutRef<'div'>,
    Omit<CardStyleProps, 'interactive' | 'tone' | 'glow'> {
  /**
   * Surface treatment. `premium` is the bone/gold look: a `--sk-premium-dim` border plus a 6%
   * premium tint mixed into the surface.
   * @default 'default'
   */
  tone?: 'default' | 'premium'
  /**
   * Clickable-card affordance: hover lift, and a card-sized focus ring when the card or a link or
   * button inside it has keyboard focus. Styling only; put a real `<a>`/`<button>` inside.
   * @default false
   */
  interactive?: boolean
  /**
   * Crimson `--sk-accent-glow` halo on hover (the same glow as Button primary); the transition is
   * off under `prefers-reduced-motion`.
   * @default false
   */
  glow?: boolean
}

/**
 * Surface container that groups related content on a chosen elevation.
 *
 * @remarks
 * - SSR/RSC: static and RSC-safe (no `'use client'`).
 * - Accessibility: renders a generic `<div>` with no implicit role and no focus. Add
 *   `role="group"` plus `aria-label` (or wrap in `<section>`) only when the content warrants a
 *   landmark. A clickable Card is still a wrapped (or contained) Link/Button — `interactive`
 *   adds only the hover lift and a focus ring that lights when that control has keyboard focus;
 *   it never adds a role or `tabIndex` itself.
 * - Variants:
 *   - `elevation`: 'flat' (default) | 'raised' | 'sunken'. `raised` adds `shadow-card` as a
 *     resting shadow (not a hover effect); `sunken` uses the darker `well` background.
 *   - `padding`: 'none' | 'sm' | 'md' (default) | 'lg' — 0 / 16px / 24px / 32px.
 *   - `radius`: 'md' | 'lg' (default).
 *   - `tone`: 'default' | 'premium' — the bone/gold surface treatment: `--sk-premium-dim` border
 *     plus a 6% premium tint mixed into the surface.
 *   - `interactive`: boolean — hover lift + a card-sized focus ring (see below).
 *   - `glow`: boolean — the crimson `--sk-accent-glow` halo on hover (same as Button primary).
 *   - All motion respects `prefers-reduced-motion`.
 * - Props extend `<div>`; `className` merges last and wins over a conflicting utility.
 * - Theming: surface, border and shadow come from `--sk-*` tokens and flip with `data-theme`.
 * - `interactive` (v1.3): hover lift + pointer, and a focus ring when the card or anything
 *   inside it has keyboard focus. Put a real `<a>`/`<button>` inside for the action; the class
 *   alone does not make a `div` operable.
 *
 * @example
 * ```tsx
 * import { Badge, Card, Text } from '@sukunagg/ui'
 *
 * <Card elevation="raised" padding="lg" radius="lg">
 *   <Badge tone="premium">Special grade</Badge>
 *   <Text as="h3" font="display" size="xl" weight="bold">
 *     Ryomen Sukuna
 *   </Text>
 *   <Text tone="dim">King of Curses. Twenty fingers, four arms, zero mercy.</Text>
 * </Card>
 * ```
 *
 * @example
 * ```tsx
 * // A clickable card: the Link is the control; `interactive` adds the affordance.
 * <a href="/plans/pro">
 *   <Card tone="premium" interactive glow>Pro plan</Card>
 * </a>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { elevation, padding, radius, tone, interactive, glow, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cardStyles({ elevation, padding, radius, tone, interactive, glow, className })}
      {...rest}
    />
  )
})
