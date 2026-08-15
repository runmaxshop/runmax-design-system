'use client'

import { useId, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface AccordionItem {
  question: ReactNode
  answer: ReactNode
}

export interface AccordionProps {
  items: readonly AccordionItem[]
  /** Con `single`, abrir una cierra la anterior. Es el comportamiento del FAQ. */
  mode?: 'single' | 'multiple'
  /** Numera las preguntas, como en el FAQ del waitlist. */
  numbered?: boolean
  /** Nivel del encabezado que envuelve cada pregunta; debe encajar en la página. */
  headingLevel?: 2 | 3 | 4
  className?: string
}

/**
 * Acordeón del FAQ.
 *
 * Cada pregunta va dentro de un encabezado real y el panel se enlaza con
 * `aria-controls` / `aria-labelledby`. Eso es lo que permite navegar el FAQ
 * saltando de encabezado en encabezado con un lector de pantalla, en vez de
 * tener que tabular por todo.
 */
export function Accordion({
  items,
  mode = 'single',
  numbered = false,
  headingLevel = 3,
  className,
}: AccordionProps) {
  const baseId = useId()
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set())
  const Heading = `h${headingLevel}` as const

  function toggle(index: number) {
    setOpen((current) => {
      if (mode === 'single') {
        return current.has(index) ? new Set() : new Set([index])
      }
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <ul className={cn('rmx-accordion', className)}>
      {items.map((item, index) => {
        const isOpen = open.has(index)
        const questionId = `${baseId}-q${index}`
        const answerId = `${baseId}-a${index}`

        return (
          <li className="rmx-accordion__item" key={questionId} data-open={isOpen || undefined}>
            <Heading className="rmx-accordion__heading">
              <button
                className="rmx-accordion__question"
                type="button"
                id={questionId}
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => toggle(index)}
              >
                {numbered && (
                  <span className="rmx-accordion__number" aria-hidden="true">
                    {index + 1}
                  </span>
                )}
                <span className="rmx-accordion__text">{item.question}</span>
                <span className="rmx-accordion__icon" aria-hidden="true" />
              </button>
            </Heading>

            <div
              className="rmx-accordion__answer"
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              hidden={!isOpen}
            >
              <div className="rmx-accordion__answer-inner">{item.answer}</div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
