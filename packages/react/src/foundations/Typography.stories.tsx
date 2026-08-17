import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading, Text } from '../components/Text/Text'

const meta: Meta = {
  title: 'Fundamentos/Tipografía',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Dos familias: **Barlow Condensed** para titulares e interfaz y **Barlow** para texto corrido. La escala es por rol, no por tamaño: `body-m` dice para qué sirve, `14` solo dice cuánto mide. Cada rol trae su interlineado resuelto — ceñido en display, holgado en cuerpo. En `Heading`, el nivel semántico (`level`) y el rol visual (`size`) son props separadas a propósito: el nivel lo manda la estructura del documento y el rol lo manda el diseño. Forzarlos a coincidir es lo que produce páginas que saltan de `h1` a `h4`.',
      },
    },
  },
}
export default meta

const DISPLAY = ['display-xl', 'display-l', 'display-m', 'display-s'] as const
const HEADINGS = ['heading-m', 'heading-s'] as const
const TEXTS = ['body-l', 'body-m', 'body-s'] as const
const UI = ['label-m', 'price-m', 'overline-m'] as const

const code = { fontSize: 12, color: '#6B6660' }

export const Display: StoryObj = {
  name: 'Display — la voz de la marca',
  render: () => (
    <div style={{ display: 'grid', gap: 28, maxWidth: 900 }}>
      {DISPLAY.map((size) => (
        <div key={size}>
          <code style={code}>
            {'<Heading size="'}
            {size}
            {'" />'} · ExtraBold Italic, mayúsculas
          </code>
          <Heading level={2} size={size}>
            Corre más lejos
          </Heading>
        </div>
      ))}
    </div>
  ),
}

export const Titulares: StoryObj = {
  name: 'Titulares de sección',
  render: () => (
    <div style={{ display: 'grid', gap: 28, maxWidth: 800 }}>
      {HEADINGS.map((size) => (
        <div key={size}>
          <code style={code}>
            {'<Heading size="'}
            {size}
            {'" />'} · Bold, sin transformar
          </code>
          <Heading level={2} size={size}>
            Nutrición y accesorios
          </Heading>
        </div>
      ))}
    </div>
  ),
}

export const TextoCorrido: StoryObj = {
  name: 'Texto corrido',
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 640 }}>
      {TEXTS.map((size) => (
        <div key={size}>
          <code style={code}>
            {'<Text size="'}
            {size}
            {'" />'} · Barlow
          </code>
          <Text size={size}>
            Max es tu coach experto: te recomienda producto según lo que necesitas y solo te
            sugiere lo que hay en stock real.
          </Text>
        </div>
      ))}
    </div>
  ),
}

export const Interfaz: StoryObj = {
  name: 'Roles de interfaz',
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 640 }}>
      <div>
        <code style={code}>{'<Text size="label-m" />'} · Barlow Condensed Medium</code>
        <Text size="label-m">Talla</Text>
      </div>
      <div>
        <code style={code}>{'<Text size="price-m" />'} · cifras tabulares</code>
        <Text size="price-m">$950.000</Text>
      </div>
      <div>
        <code style={code}>{'<Text size="overline-m" />'} · Bold, mayúsculas, tracking 10%</code>
        <Text size="overline-m">On Cloud · Más vendido</Text>
      </div>
      <p style={{ fontFamily: 'Barlow, sans-serif', fontSize: 13, color: '#6B6660', margin: 0 }}>
        Los tres van en la condensada: son interfaz, no lectura. {UI.length} roles.
      </p>
    </div>
  ),
}

export const Tonos: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
      <Text tone="primary">tone=&quot;primary&quot; — títulos, precio, nombre de producto</Text>
      <Text tone="secondary">tone=&quot;secondary&quot; — descripción y copy de apoyo</Text>
      <Text tone="tertiary">tone=&quot;tertiary&quot; — meta, breadcrumb, conteo</Text>
      <Text tone="danger">tone=&quot;danger&quot; — errores de formulario</Text>
      <div style={{ background: '#000000', padding: 12 }}>
        <Text tone="inverse">tone=&quot;inverse&quot; — sobre fondo oscuro</Text>
        <Text tone="accent">tone=&quot;accent&quot; — el lima, solo aquí</Text>
      </div>
      <p style={{ fontFamily: 'Barlow, sans-serif', fontSize: 13, color: '#6B6660', margin: 0 }}>
        <strong>accent</strong> vive únicamente sobre oscuro: sobre blanco da 1.8:1 y no llega a AA.
      </p>
    </div>
  ),
}
