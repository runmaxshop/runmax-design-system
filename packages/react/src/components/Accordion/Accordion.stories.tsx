import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion } from './Accordion'

const meta = {
  title: 'Componentes/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Cada pregunta va dentro de un encabezado real (`h2`–`h4`, configurable) y el panel se enlaza con `aria-controls`. Eso permite recorrer el FAQ saltando de encabezado en encabezado con un lector de pantalla, en vez de tener que tabular por todo.',
      },
    },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

const FAQ = [
  {
    question: '¿Qué es RunMaxShop?',
    answer: (
      <p>
        Un marketplace deportivo con <strong>Max</strong>, un coach con inteligencia artificial que
        te recomienda producto según lo que necesitas y solo sugiere lo que hay en stock real.
      </p>
    ),
  },
  {
    question: '¿Cuándo abren?',
    answer: <p>Estamos en pre-lanzamiento. Quien esté en la lista entra primero.</p>,
  },
  {
    question: '¿Puedo vender en RunMaxShop?',
    answer: (
      <>
        <p>Sí. Marca «Vender» en el formulario y te contactamos cuando abramos el registro.</p>
        <p>Cada producto pasa por revisión antes de publicarse.</p>
      </>
    ),
  },
]

/** Como en el FAQ del waitlist: numerado y con una sola respuesta abierta a la vez. */
export const FaqDelWaitlist: Story = {
  name: 'FAQ del waitlist',
  args: { items: FAQ, numbered: true, mode: 'single' },
  render: (args) => (
    <div style={{ maxWidth: 680 }}>
      <Accordion {...args} />
    </div>
  ),
}

export const VariasAbiertas: Story = {
  name: 'Varias abiertas',
  args: { items: FAQ, mode: 'multiple' },
  render: (args) => (
    <div style={{ maxWidth: 680 }}>
      <Accordion {...args} />
    </div>
  ),
}
