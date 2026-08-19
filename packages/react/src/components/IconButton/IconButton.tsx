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
  /**
   * Convierte el botón en un interruptor de dos estados y lo anuncia con
   * `aria-pressed`. Sin esta prop no se emite el atributo: un botón de acción
   * que dijera `aria-pressed="false"` estaría mintiendo sobre lo que es.
   *
   * Es el mismo patrón que `selected` en `Chip`.
   *
   * OJO con la etiqueta: cuando uses `pressed`, `label` NO debe cambiar entre
   * los dos estados. El estado ya lo comunica `aria-pressed`, y una etiqueta
   * que además pasa de «Añadir a favoritos» a «Quitar de favoritos» hace que
   * un lector de pantalla lo anuncie dos veces y se contradiga. Usá un nombre
   * estable —«Favorito»— y dejá que el atributo haga su trabajo.
   */
  pressed?: boolean
  /**
   * El icono del estado marcado. Si no se pasa, se usa `icon` en los dos.
   * Con Lucide el relleno es un atributo del propio icono, así que el par
   * suele ser `<Heart />` y `<Heart fill="currentColor" />`.
   */
  iconPressed?: ReactNode
  /** Mismos nombres y mismo comportamiento que en `Button`. */
  variant?: IconButtonVariant
  /**
   * `s` son 32px y `m` 40. Ninguno llega a los 44×44 de WCAG 2.5.5, así que en
   * móvil se usa `m`.
   */
  size?: IconButtonSize
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, iconPressed, pressed, variant = 'primary', size = 'm', disabled, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={cn('rmx-icon-button', `rmx-icon-button--${variant}`, `rmx-icon-button--${size}`, className)}
      aria-label={label}
      // `undefined` no emite el atributo; `false` sí, y eso es lo correcto:
      // un interruptor apagado tiene que anunciarse como apagado.
      aria-pressed={pressed}
      disabled={disabled}
    >
      {pressed && iconPressed ? iconPressed : icon}
    </button>
  )
})
