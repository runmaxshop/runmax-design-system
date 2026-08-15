import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading, Text } from '../components/Text/Text'

const meta: Meta = {
  title: 'Fundamentos/Tipografía',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Dos familias: **Barlow Condensed** para titulares y **Barlow** para texto corrido. En `Heading`, el nivel semántico (`level`) y el tamaño visual (`size`) son props separadas a propósito: el nivel lo manda la estructura del documento y el tamaño lo manda el diseño. Forzarlos a coincidir es lo que produce páginas que saltan de `h1` a `h4`.',
      },
    },
  },
}
export default meta

const HEADINGS = ['56', '40', '30', '24', '18'] as const
const TEXTS = ['18', '17', '16', '14', '13'] as const

export const Titulares: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 28, maxWidth: 800 }}>
      {HEADINGS.map((size) => (
        <div key={size}>
          <code style={{ fontSize: 12, color: '#5C5A54' }}>
            {'<Heading size="'}
            {size}
            {'" />'} · Barlow Condensed {size}px
          </code>
          <Heading level={2} size={size}>
            Corre más lejos con RunMax
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
          <code style={{ fontSize: 12, color: '#5C5A54' }}>
            {'<Text size="'}
            {size}
            {'" />'} · Barlow {size}px
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

export const Tonos: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
      <Text tone="default">tone=&quot;default&quot; — texto principal</Text>
      <Text tone="deep">tone=&quot;deep&quot; — titulares y énfasis</Text>
      <Text tone="strong">tone=&quot;strong&quot; — texto sobre campos</Text>
      <Text tone="subtle">tone=&quot;subtle&quot; — apoyo</Text>
      <Text tone="muted">tone=&quot;muted&quot; — notas y textos secundarios</Text>
      <Text tone="danger">tone=&quot;danger&quot; — errores de formulario</Text>
      <div style={{ background: '#252324', padding: 12, borderRadius: 10 }}>
        <Text tone="on-inverse">tone=&quot;on-inverse&quot; — sobre fondo oscuro</Text>
      </div>
    </div>
  ),
}
