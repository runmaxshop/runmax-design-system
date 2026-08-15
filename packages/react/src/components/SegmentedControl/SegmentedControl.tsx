'use client'

import { useId } from 'react'
import { cn } from '../../lib/cn'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

export interface SegmentedControlProps<T extends string> {
  /** Etiqueta del grupo. Obligatoria: un radiogroup sin nombre no dice nada. */
  label: string
  options: readonly SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Oculta la etiqueta visualmente pero la deja para lectores de pantalla. */
  hideLabel?: boolean
  className?: string
}

/**
 * Selector segmentado — el "Comprar / Vender / Ambos" del waitlist.
 *
 * Por debajo son `<input type="radio">` de verdad con el `<span>` dibujado
 * encima. Se hace así, y no con `<div role="radio">`, porque el radio nativo ya
 * trae gratis la navegación con flechas, el agrupado por `name` y el soporte de
 * lectores de pantalla; reimplementar eso a mano casi siempre sale peor.
 */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  hideLabel = false,
  className,
}: SegmentedControlProps<T>) {
  const name = useId()
  const labelId = `${name}-label`

  return (
    <div className={cn('rmx-segmented', className)}>
      <span className={cn('rmx-segmented__label', hideLabel && 'rmx-visually-hidden')} id={labelId}>
        {label}
      </span>
      <div
        className="rmx-segmented__track"
        role="radiogroup"
        aria-labelledby={labelId}
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {options.map((option) => (
          <label className="rmx-segmented__option" key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
