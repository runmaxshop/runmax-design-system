'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type ButtonVariant = 'inverse' | 'brand' | 'subtle' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonShape = 'pill' | 'rounded'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * `inverse` es el botón oscuro por defecto de RunMax (el de "Quiero mi acceso
   * anticipado"). `brand` es el verde y se reserva para un único acento por
   * pantalla: si todo es verde, nada destaca.
   */
  variant?: ButtonVariant
  /** `sm` son 44px, el área táctil mínima que pide WCAG 2.1. */
  size?: ButtonSize
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
  variant = 'inverse',
  size = 'md',
  shape = 'pill',
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
    variant = 'inverse',
    size = 'md',
    shape = 'pill',
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
