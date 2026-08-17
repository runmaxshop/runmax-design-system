import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

/**
 * Los nombres son roles de la escala, no medidas. `display-l` sigue siendo
 * `display-l` el día que mida 44px en vez de 40, y dos roles que hoy miden lo
 * mismo (`heading-m` y `display-s`, ambos 24px) pueden separarse sin renombrar
 * nada en las aplicaciones.
 */
export type HeadingSize =
  | 'display-xl'
  | 'display-l'
  | 'display-m'
  | 'display-s'
  | 'heading-m'
  | 'heading-s'

export type TextSize = 'body-l' | 'body-m' | 'body-s' | 'label-m' | 'price-m' | 'overline-m'

export type TextTone = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'accent' | 'danger'

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

/**
 * Titular en Barlow Condensed.
 *
 * Los roles `display-*` salen en ExtraBold Italic y mayúsculas —la voz de la
 * marca en las mesas—; los `heading-*` son titulares de sección en Bold, sin
 * transformar. La diferencia es de tono, no de tamaño: `display-s` y
 * `heading-m` miden ambos 24px.
 */
export function Heading({
  level = 2,
  size = 'display-m',
  tone = 'primary',
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
  /**
   * Sin valor, manda el peso del rol: `label-m` sale en Medium y `overline-m`
   * en Bold sin pedirlo. Pasarlo es una excepción explícita, no el caso normal.
   */
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
  align?: 'start' | 'center' | 'end'
  children: ReactNode
}

/**
 * Texto corrido en Barlow.
 *
 * Los roles `label-m`, `price-m` y `overline-m` salen en la condensada: son
 * interfaz, no lectura. El cuerpo largo va en Barlow porque una condensada a
 * 14px en párrafos de varias líneas es el uso para el que menos está pensada.
 */
export function Text({
  as: Tag = 'p',
  size = 'body-l',
  tone = 'primary',
  weight,
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
        weight && `rmx-weight--${weight}`,
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
