import { Avatar as Base } from '@base-ui-components/react/avatar'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { type AvatarStyleProps, avatarStyles } from './avatar.styles'

export interface AvatarProps extends ComponentPropsWithoutRef<'span'>, AvatarStyleProps {
  src?: string
  alt?: string
  fallback?: ReactNode
}

/** Image with a graceful fallback (Base UI). No `'use client'` — the wrapper holds no state. */
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
