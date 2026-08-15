import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** `elevated` levanta la tarjeta con sombra; `outlined` solo la delimita. */
  variant?: 'elevated' | 'outlined' | 'plain'
  padding?: 'none' | 'md' | 'lg'
}

/** Superficie contenedora. La tarjeta del formulario del waitlist es una de estas. */
export function Card({
  variant = 'elevated',
  padding = 'lg',
  className,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        'rmx-card',
        `rmx-card--${variant}`,
        `rmx-card--pad-${padding}`,
        className,
      )}
    />
  )
}
