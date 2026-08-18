'use client'

/** Button — F (fluido). No tiene versión móvil: tiene `size` y `fullWidth`. */

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 's' | 'm' | 'l'
export type ButtonShape = 'rect' | 'pill'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * `primary` es negro: en RunMax la acción es negra, no lima —el lima es un
   * acento de superficie y por eso no hay variante de marca aquí. `secondary`
   * es solo relleno blanco, sin contorno —por eso no va sobre `bg.surface`:
   * blanco sobre blanco no se distingue—. `ghost` no tiene contenedor.
   */
  variant?: ButtonVariant
  /**
   * 32 · 40 · 48, la escala `control.height`. `m` es la de un input, así que es
   * la que hace que un botón alinee con un campo en la misma fila.
   *
   * OJO con `s`: cumple WCAG 2.5.8 (AA, 24×24) pero no 2.5.5 (AAA, 44×44). Si
   * va a ser el único destino táctil de una acción importante en móvil, usá `m`.
   */
  size?: ButtonSize
  /** `rect` en formularios y PDP; `pill` sobre foto. */
  shape?: ButtonShape
  fullWidth?: boolean
  /**
   * Deshabilita el botón y marca `aria-busy`. Recibe el foco igualmente, para
   * que quien navegue con teclado no lo pierda a mitad del envío.
   */
  loading?: boolean
  /** Texto que sustituye al contenido mientras `loading` está activo. */
  loadingText?: string
}

/** Las clases del botón, sueltas, para poder vestir un `<a>` con el mismo aspecto. */
export function buttonClassName({
  variant = 'primary',
  size = 'm',
  shape = 'rect',
  fullWidth = false,
  className,
}: Pick<ButtonProps, 'variant' | 'size' | 'shape' | 'fullWidth' | 'className'> = {}): string {
  return cn(
    'rmx-button',
    `rmx-button--${variant}`,
    `rmx-button--${size}`,
    `rmx-button--${shape}`,
    fullWidth && 'rmx-button--full',
    className,
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'm',
    shape = 'rect',
    fullWidth = false,
    loading = false,
    loadingText,
    disabled,
    children,
    className,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      // Sin `type` explícito, un botón dentro de un formulario envía. Más de un
      // bug de "se recarga la página al hacer clic" sale exactamente de ahí.
      type={type}
      className={buttonClassName({ variant, size, shape, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && loadingText ? loadingText : children}
    </button>
  )
})
