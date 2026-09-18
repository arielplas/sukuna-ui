import { Avatar as Base } from '@base-ui-components/react/avatar'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { type AvatarStyleProps, avatarStyles } from './avatar.styles'

export interface AvatarProps extends ComponentPropsWithoutRef<'span'>, AvatarStyleProps {
  /**
   * Image URL. When omitted no `<img>` is rendered and `fallback` shows permanently; when set,
   * the image is shown once it loads and `fallback` covers the loading and error states.
   */
  src?: string
  /**
   * Alternative text for the image. Omitted → `alt=""` (decorative), which is right when a
   * visible name sits next to the avatar; pass the person's name when the image is the only
   * identity cue.
   * @default ''
   */
  alt?: string
  /**
   * Initials or an icon shown while the image loads, if it fails, or when `src` is absent.
   * Rendered bold and uppercase; keep initials to one or two characters so they fit.
   */
  fallback?: ReactNode
}

/**
 * A user or entity image with a graceful fallback (initials or an icon).
 *
 * @remarks
 * - SSR/RSC: this wrapper has no `'use client'` and holds no state; it composes Base UI's
 *   `Avatar.Root` / `Avatar.Image` / `Avatar.Fallback`, which track image-load state
 *   internally. Server output always contains the fallback; the `<img>` swaps in on the client
 *   after it loads.
 * - Accessibility: an unlabelled image is decorative (`alt=""`) so a screen reader never reads
 *   the file name; give `alt` a meaningful value when nothing else names the person. The
 *   fallback is real text (`text-text-dim` on `bg-surface-2`, contrast ≥ 4.5:1), so it is
 *   readable and announced.
 * - Variants: `size`: 'sm' (32px, `text-xs`) | 'md' (40px, `text-sm`, default) | 'lg' (48px,
 *   `text-md`). Always a circle (`rounded-full`, `overflow-hidden`); the image is
 *   `object-cover`, so any aspect ratio is cropped to fit.
 * - Not `forwardRef` (matches the other headless-backed wrappers). Remaining props go to the
 *   root `<span>`, so `className` (merged last), `title`, `data-*` and event handlers work.
 *
 * @example
 * ```tsx
 * import { Avatar } from 'sukuna-ui'
 *
 * // Image with initials shown while it loads or if the request fails.
 * <Avatar src="https://example.com/ryomen.jpg" alt="Ryomen Sukuna" fallback="RS" />
 *
 * // No image: initials only.
 * <Avatar fallback="MF" size="lg" />
 *
 * // Decorative next to a visible name: leave `alt` off (defaults to '').
 * <div className="flex items-center gap-2">
 *   <Avatar src={user.avatarUrl} fallback={user.initials} size="sm" />
 *   <span>{user.name}</span>
 * </div>
 * ```
 */
export function Avatar({ src, alt, fallback, size, className, ...rest }: AvatarProps) {
  const styles = avatarStyles({ size })
  return (
    <Base.Root className={styles.root({ className })} {...rest}>
      {/* Default alt="" so an image with no caption is treated as decorative (a fallback exists)
          rather than letting the screen reader announce the filename. */}
      {src ? <Base.Image src={src} alt={alt ?? ''} className={styles.image()} /> : null}
      <Base.Fallback className={styles.fallback()}>{fallback}</Base.Fallback>
    </Base.Root>
  )
}
