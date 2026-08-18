'use client'

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface TextFieldProps {
  label: ReactNode
  /** Se pinta en gris junto a la etiqueta, como el "(opcional)" del waitlist. */
  optionalText?: string
  hint?: ReactNode
  /** Si hay error, el campo se marca y el mensaje se anuncia por `role="alert"`. */
  error?: string
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
  className?: string
}

/**
 * Envoltorio de campo: etiqueta, pista y error.
 *
 * Existe para que nadie tenga que volver a acordarse de cablear `htmlFor`,
 * `aria-describedby` y `aria-invalid` a mano. El `children` es una función
 * porque el propio campo necesita el `id` y el `describedBy` que genera este
 * componente, y así no hay forma de conectarlos mal.
 */
export function TextField({
  label,
  optionalText,
  hint,
  error,
  children,
  className,
}: TextFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = cn(hint && hintId, error && errorId) || undefined

  return (
    <div className={cn('rmx-textfield', className)}>
      <label className="rmx-textfield__label" htmlFor={id}>
        {label}
        {optionalText && <span className="rmx-textfield__optional"> {optionalText}</span>}
      </label>

      {children({ id, describedBy, invalid: Boolean(error) })}

      {hint && !error && (
        <p className="rmx-textfield__hint" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="rmx-textfield__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className, ...rest },
  ref,
) {
  return (
    <input
      {...rest}
      ref={ref}
      className={cn('rmx-input', invalid && 'rmx-input--invalid', className)}
      aria-invalid={invalid || undefined}
    />
  )
})
