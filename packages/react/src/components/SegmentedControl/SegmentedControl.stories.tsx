import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { SegmentedControl, type SegmentedControlProps } from './SegmentedControl'

// El componente es genérico (`<T extends string>`), y `Meta<typeof X>` no sabe
// resolver eso. Se tipa contra las props ya instanciadas en `string`, que es lo
// que usan las historias.
const meta: Meta<SegmentedControlProps<string>> = {
  title: 'Componentes/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Por debajo son `<input type="radio">` de verdad con un `<span>` dibujado encima. Se hace así, y no con `<div role="radio">`, porque el radio nativo ya trae la navegación con flechas, el agrupado por `name` y el soporte de lectores de pantalla. Pruébalo: enfoca una opción y muévete con las flechas del teclado.',
      },
    },
  },
}

export default meta
type Story = StoryObj<SegmentedControlProps<string>>

const INTENTS = [
  { value: 'comprar', label: 'Comprar' },
  { value: 'vender', label: 'Vender' },
  { value: 'ambos', label: 'Ambos' },
] as const

/** El selector de intención del formulario del waitlist. */
export const Intencion: Story = {
  name: 'Intención',
  args: { label: 'Vas a usar RunMaxShop para', options: INTENTS, value: 'comprar', onChange: () => {} },
  render: function Intencion(args) {
    const [value, setValue] = useState<string>('comprar')
    return (
      <div style={{ maxWidth: 380 }}>
        <SegmentedControl {...args} value={value} onChange={setValue} />
      </div>
    )
  },
  // La razón de existir de este componente es que por debajo son radios
  // nativos. Esto comprueba justo eso: que el árbol accesible sea un
  // radiogroup con nombre y radios de verdad, no divs disfrazados. Si alguien
  // lo "simplifica" a botones algún día, esta historia se pone en rojo.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('es un radiogroup con nombre accesible', async () => {
      const grupo = canvas.getByRole('radiogroup', { name: 'Vas a usar RunMaxShop para' })
      await expect(grupo).toBeInTheDocument()
    })

    await step('hay una sola opción marcada al arrancar', async () => {
      await expect(canvas.getByRole('radio', { name: 'Comprar' })).toBeChecked()
      await expect(canvas.getByRole('radio', { name: 'Vender' })).not.toBeChecked()
      await expect(canvas.getByRole('radio', { name: 'Ambos' })).not.toBeChecked()
    })

    await step('elegir otra mueve la marca, no la suma', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: 'Vender' }))
      await expect(canvas.getByRole('radio', { name: 'Vender' })).toBeChecked()
      await expect(canvas.getByRole('radio', { name: 'Comprar' })).not.toBeChecked()
    })
  },
}

/** Se adapta a cualquier número de opciones: la rejilla se calcula sola. */
export const DosOpciones: Story = {
  name: 'Dos opciones',
  args: {
    label: 'Tipo de cuenta',
    options: [
      { value: 'persona', label: 'Persona' },
      { value: 'empresa', label: 'Empresa' },
    ],
    value: 'persona',
    onChange: () => {},
  },
  render: function DosOpciones(args) {
    const [value, setValue] = useState<string>('persona')
    return (
      <div style={{ maxWidth: 320 }}>
        <SegmentedControl {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}
