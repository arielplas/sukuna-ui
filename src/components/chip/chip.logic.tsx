import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { type ChipStyleProps, chipStyles } from './chip.styles'

export interface ChipProps extends ComponentPropsWithoutRef<'span'>, ChipStyleProps {
  /** Node rendered before the children, e.g. a 12–14px icon; mark it `aria-hidden` yourself. */
  leadingIcon?: ReactNode
  /**
   * Fires when the trailing remove button is clicked. Providing it is what renders the button;
   * the Chip holds no state, so the consumer removes the chip in response.
   */
  onDismiss?: () => void
  /**
   * Accessible name for the remove button (its only content is an icon).
   * @default 'Remove'
   */
  dismissLabel?: string
}

const DismissIcon = () => (
  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

/**
 * Compact token for filters, selections and tags, optionally removable.
 *
 * @remarks
 * - SSR/RSC: static and RSC-safe (no `'use client'`). The optional dismiss button only forwards
 *   `onDismiss`; no client state is involved.
 * - Accessibility: the root is a non-focusable `<span>`. When `onDismiss` is set, a real
 *   `<button type="button">` is appended with `aria-label={dismissLabel}`, so it gets keyboard
 *   focus, Enter/Space activation and a visible focus ring for free. Localize `dismissLabel`
 *   and make it specific when several chips are listed (e.g. `'Remove filter: Tokyo'`).
 * - Variants:
 *   - `tone`: 'neutral' (default) | 'accent' | 'success' | 'premium' (same palette as Badge).
 *   - `size`: 'sm' | 'md' (default) — 24px / 28px tall.
 * - For a non-removable status pill use Badge instead. `className` merges into the root slot
 *   and wins over a conflicting utility.
 * - Theming: colors come from `--sk-*` tokens and flip with `data-theme`.
 *
 * @example
 * ```tsx
 * import { Chip } from 'sukuna-ui'
 *
 * function Filters({ tags, remove }: { tags: string[]; remove: (t: string) => void }) {
 *   return tags.map((tag) => (
 *     <Chip key={tag} tone="accent" onDismiss={() => remove(tag)} dismissLabel={`Remove ${tag}`}>
 *       {tag}
 *     </Chip>
 *   ))
 * }
 * ```
 */
export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { tone, size, leadingIcon, onDismiss, dismissLabel = 'Remove', className, children, ...rest },
  ref,
) {
  const styles = chipStyles({ tone, size })
  return (
    <span ref={ref} className={styles.root({ className })} {...rest}>
      {leadingIcon}
      {children}
      {onDismiss ? (
        <button
          type="button"
          aria-label={dismissLabel}
          className={styles.dismiss()}
          onClick={onDismiss}
        >
          <DismissIcon />
        </button>
      ) : null}
    </span>
  )
})
