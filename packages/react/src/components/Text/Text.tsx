import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type HeadingSize = '56' | '40' | '30' | '24' | '18'
export type TextSize = '18' | '17' | '16' | '14' | '13'
export type TextTone = 'default' | 'strong' | 'deep' | 'muted' | 'subtle' | 'danger' | 'on-inverse'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Nivel semántico del encabezado. Va separado del tamaño a propósito: el
   * nivel lo manda la estructura del documento y el tamaño lo manda el diseño,
   * y forzarlos a coincidir es lo que produce páginas que saltan de h1 a h4.
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?: HeadingSize
  tone?: TextTone
  children: ReactNode
}

/** Titular en Barlow Condensed, la tipografía de display de RunMax. */
export function Heading({
  level = 2,
  size = '30',
  tone = 'deep',
  className,
  children,
  ...rest
}: HeadingProps) {
  // La union concreta de los seis encabezados, no `ElementType`. Con
  // `ElementType` a secas TypeScript tiene que contemplar tambien componentes
  // que no aceptan hijos, y quien nos instala se come un error de tipos
  // ("children expects type 'never'"). Aqui no saltaba porque cada version de
  // TypeScript y de @types/react resuelve esa union de forma distinta: el bug
  // solo aparecia del lado del consumidor.
  const Tag: HeadingTag = `h${level}`
  return (
    <Tag
      {...rest}
      className={cn('rmx-heading', `rmx-heading--${size}`, `rmx-tone--${tone}`, className)}
    >
      {children}
    </Tag>
  )
}

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'li'
  size?: TextSize
  tone?: TextTone
  weight?: 'regular' | 'medium' | 'semibold'
  align?: 'start' | 'center' | 'end'
  children: ReactNode
}

/** Texto corrido en Barlow. */
export function Text({
  as: Tag = 'p',
  size = '16',
  tone = 'default',
  weight = 'regular',
  align,
  className,
  children,
  ...rest
}: TextProps) {
  return (
    <Tag
      {...rest}
      className={cn(
        'rmx-text',
        `rmx-text--${size}`,
        `rmx-tone--${tone}`,
        `rmx-weight--${weight}`,
        align && `rmx-align--${align}`,
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/**
 * Contenido visible solo para lectores de pantalla.
 *
 * Es la forma correcta de dar contexto que sobra visualmente pero hace falta en
 * audio — un "abre en una pestaña nueva", el nombre de un grupo de campos.
 * Nunca uses `display: none` para esto: eso lo oculta también del lector.
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="rmx-visually-hidden">{children}</span>
}
