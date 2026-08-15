/**
 * @runmax/react — componentes de interfaz de RunMax.
 *
 * Uso:
 *   import { Button, Field, Input } from '@runmax/react'
 *   import '@runmax/react/styles.css'   // una sola vez, en la raíz de la app
 */

export { Button, buttonClassName } from './components/Button/Button'
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonShape } from './components/Button/Button'

export { Field, Input } from './components/Field/Field'
export type { FieldProps, InputProps } from './components/Field/Field'

export { Chip, ChipGroup } from './components/Chip/Chip'
export type { ChipProps } from './components/Chip/Chip'

export { SegmentedControl } from './components/SegmentedControl/SegmentedControl'
export type {
  SegmentedControlProps,
  SegmentedOption,
} from './components/SegmentedControl/SegmentedControl'

export { Accordion } from './components/Accordion/Accordion'
export type { AccordionProps, AccordionItem } from './components/Accordion/Accordion'

export { Card } from './components/Card/Card'
export type { CardProps } from './components/Card/Card'

export { Badge } from './components/Badge/Badge'
export type { BadgeProps, BadgeTone } from './components/Badge/Badge'

export { Heading, Text, VisuallyHidden } from './components/Text/Text'
export type { HeadingProps, TextProps, TextTone } from './components/Text/Text'

export { cn } from './lib/cn'
