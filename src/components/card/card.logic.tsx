import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { type CardStyleProps, cardStyles } from './card.styles'

export interface CardProps
  extends ComponentPropsWithoutRef<'div'>,
    Omit<CardStyleProps, 'interactive'> {
  /**
   * Clickable-card affordance: hover lift, and a card-sized focus ring when the card or a link or
   * button inside it has keyboard focus. Styling only; put a real `<a>`/`<button>` inside.
   * @default false
   */
  interactive?: boolean
}

/**
 * Surface container that groups related content on a chosen elevation.
 *
 * @remarks
 * - SSR/RSC: static and RSC-safe (no `'use client'`).
 * - Accessibility: renders a generic `<div>` with no implicit role and no focus. Add
 *   `role="group"` plus `aria-label` (or wrap in `<section>`) only when the content warrants a
 *   landmark. There is no interactive/clickable Card — wrap the Card in a Button or Link.
 * - Variants:
 *   - `elevation`: 'flat' (default) | 'raised' | 'sunken'. `raised` adds `shadow-card` as a
 *     resting shadow (not a hover effect); `sunken` uses the darker `well` background.
 *   - `padding`: 'none' | 'sm' | 'md' (default) | 'lg' — 0 / 16px / 24px / 32px.
 *   - `radius`: 'md' | 'lg' (default).
 * - Props extend `<div>`; `className` merges last and wins over a conflicting utility.
 * - Theming: surface, border and shadow come from `--sk-*` tokens and flip with `data-theme`.
 * - `interactive` (v1.3): hover lift + pointer, and a focus ring when the card or anything
 *   inside it has keyboard focus. Put a real `<a>`/`<button>` inside for the action; the class
 *   alone does not make a `div` operable.
 *
 * @example
 * ```tsx
 * import { Badge, Card, Text } from 'sukuna-ui'
 *
 * <Card elevation="raised" padding="lg" radius="lg">
 *   <Badge tone="premium">Special grade</Badge>
 *   <Text as="h3" font="display" size="xl" weight="bold">
 *     Ryomen Sukuna
 *   </Text>
 *   <Text tone="dim">King of Curses. Twenty fingers, four arms, zero mercy.</Text>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { elevation, padding, radius, interactive, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cardStyles({ elevation, padding, radius, interactive, className })}
      {...rest}
    />
  )
})
