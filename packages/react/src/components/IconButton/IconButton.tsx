'use client'

/** IconButton — F (fluido). Es un cuadrado: no tiene "versión móvil", tiene `size`. */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost'
export type IconButtonSize = 's' | 'm'

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * OBLIGATORIA. Un botón sin texto visible no tiene nombre accesible, y un
   * lector de pantalla anunciaría solo «botón». El componente lo cablea como
   * `aria-label`: es la razón principal por la que esto no es una variante de
   * `Button` —ahí el tipo no podría exigirlo—.
   */
  label: string
  /**
   * El icono, de [Lucide](https://lucide.dev/icons/). La librería no depende de
   * `lucide-react` a propósito: quien la use trae los iconos que necesita y no
   * carga un set entero. El botón solo define `color`, y el `currentColor` de
   * Lucide lo recoge; su `width` y `height` los pone el CSS según `size`.
   */
  icon: ReactNode
  /** Mismos nombres que `Button`. `secondary` aquí sí lleva contorno —ver el CSS—. */
  variant?: IconButtonVariant
  /**
   * `s` son 32px y `m` 40. Ninguno llega a los 44×44 de WCAG 2.5.5, así que en
   * móvil se usa `m`.
   */
  size?: IconButtonSize
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = 'primary', size = 'm', disabled, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={cn('rmx-icon-button', `rmx-icon-button--${variant}`, `rmx-icon-button--${size}`, className)}
      aria-label={label}
      disabled={disabled}
    >
      {icon}
    </button>
  )
})
