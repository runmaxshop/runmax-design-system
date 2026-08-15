'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Estado seleccionado. Se expone como `aria-pressed`, no como una clase: un
   * chip es un botón de dos estados, y esa es la semántica que un lector de
   * pantalla sabe anunciar.
   */
  selected?: boolean
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { selected = false, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={cn('rmx-chip', className)}
      aria-pressed={selected}
    />
  )
})

/** Contenedor de chips. Agrupa y da el `aria-label` que describe al conjunto. */
export function ChipGroup({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('rmx-chip-group', className)} role="group" aria-label={label}>
      {children}
    </div>
  )
}
