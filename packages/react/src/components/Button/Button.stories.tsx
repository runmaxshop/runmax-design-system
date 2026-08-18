import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Input } from '../TextField/TextField'
import { Button } from './Button'

const meta = {
  title: 'Componentes/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'El botón de RunMax. `primary` es negro —la acción en RunMax es negra, no lima— ' +
          '`secondary` es solo relleno blanco y `ghost` no tiene contenedor. `rect` va en ' +
          'formularios y PDP; `pill`, sobre foto.',
      },
    },
  },
  args: {
    children: 'Quiero mi acceso anticipado',
    variant: 'primary',
    size: 'm',
    shape: 'rect',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    shape: { control: 'inline-radio', options: ['rect', 'pill'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Juega con los controles de la derecha para ver todas las combinaciones. */
export const Playground: Story = {}

export const Variantes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="ghost">Ghost</Button>
    </div>
  ),
}

/**
 * 32 · 40 · 48, la escala `control.height`. `s` cumple WCAG 2.5.8 (AA, 24×24)
 * pero no 2.5.5 (AAA, 44×44): si va a ser el único destino táctil de una acción
 * importante en móvil, subí a `m`.
 */
export const Tamanos: Story = {
  name: 'Tamaños',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args} size="s">Small · 32px</Button>
      <Button {...args} size="m">Medium · 40px</Button>
      <Button {...args} size="l">Large · 48px</Button>
    </div>
  ),
}

/**
 * El input mide 48, así que `l` es el que alinea con él sin ayuda de nadie.
 * Es la razón por la que el alto sale del token y no de la suma del padding.
 */
export const AlineadoConUnCampo: Story = {
  name: 'Alineado con un campo',
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Input placeholder="tu@email.com" style={{ width: 220 }} aria-label="Email" />
      <Button {...args} size="l">Unirme</Button>
    </div>
  ),
}

/** Las 18 combinaciones del archivo de Figma, en el mismo orden. */
export const Matriz: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      {(['rect', 'pill'] as const).map((shape) => (
        <div key={shape} style={{ display: 'grid', gap: 12 }}>
          <code style={{ fontSize: 12, opacity: 0.6 }}>shape={shape}</code>
          {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
            <div key={variant} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {(['s', 'm', 'l'] as const).map((size) => (
                <Button key={size} {...args} variant={variant} size={size} shape={shape}>
                  Button
                </Button>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}

/**
 * Mientras carga, el botón se deshabilita y marca `aria-busy`, de modo que un
 * lector de pantalla anuncia que hay algo en curso en vez de quedarse mudo.
 */
export const Cargando: Story = {
  args: { loading: true, loadingText: 'Apartando tu lugar…' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('cargando bloquea el botón y lo anuncia como ocupado', async () => {
      const button = canvas.getByRole('button', { name: 'Apartando tu lugar…' })
      await expect(button).toBeDisabled()
      await expect(button).toHaveAttribute('aria-busy', 'true')
    })
  },
}

export const Deshabilitado: Story = {
  args: { disabled: true },
}

/** Así se ve dentro de la tarjeta del formulario del waitlist. */
export const AnchoCompleto: Story = {
  name: 'Ancho completo',
  args: { fullWidth: true, size: 'l', shape: 'pill' },
  parameters: { layout: 'padded' },
}
