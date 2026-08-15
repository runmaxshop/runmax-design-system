import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

/**
 * Etiqueta de estado.
 *
 * Es decorativa por defecto: si el color es la única señal de algo importante
 * (un pedido cancelado, un producto agotado), el texto del badge tiene que
 * decirlo también. Nadie debería depender del color para entender el estado.
 */
export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return <span {...rest} className={cn('rmx-badge', `rmx-badge--${tone}`, className)} />
}
