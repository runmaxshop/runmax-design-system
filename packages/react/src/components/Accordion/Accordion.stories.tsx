import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
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
  // Comprueba el contrato de `mode: 'single'`: abrir una cierra la anterior. Es
  // el estado que no se ve en una captura y el que se rompe sin que nadie mire.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const primera = canvas.getByRole('button', { name: /¿Qué es RunMaxShop\?/ })
    const segunda = canvas.getByRole('button', { name: /¿Cuándo abren\?/ })

    await step('arranca todo cerrado', async () => {
      await expect(primera).toHaveAttribute('aria-expanded', 'false')
      await expect(segunda).toHaveAttribute('aria-expanded', 'false')
    })

    await step('abrir la primera la expande', async () => {
      await userEvent.click(primera)
      await expect(primera).toHaveAttribute('aria-expanded', 'true')
    })

    await step('abrir la segunda cierra la primera', async () => {
      await userEvent.click(segunda)
      await expect(segunda).toHaveAttribute('aria-expanded', 'true')
      await expect(primera).toHaveAttribute('aria-expanded', 'false')
    })

    await step('cada pregunta apunta a su panel', async () => {
      const panelId = segunda.getAttribute('aria-controls')
      await expect(panelId).toBeTruthy()
      await expect(canvasElement.querySelector(`#${panelId}`)).toBeInTheDocument()
    })
  },
}

export const VariasAbiertas: Story = {
  name: 'Varias abiertas',
  args: { items: FAQ, mode: 'multiple' },
  render: (args) => (
    <div style={{ maxWidth: 680 }}>
      <Accordion {...args} />
    </div>
  ),
  // El contrario del anterior: aquí las dos tienen que poder quedar abiertas.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const primera = canvas.getByRole('button', { name: /¿Qué es RunMaxShop\?/ })
    const segunda = canvas.getByRole('button', { name: /¿Cuándo abren\?/ })

    await userEvent.click(primera)
    await userEvent.click(segunda)

    await expect(primera).toHaveAttribute('aria-expanded', 'true')
    await expect(segunda).toHaveAttribute('aria-expanded', 'true')
  },
}
