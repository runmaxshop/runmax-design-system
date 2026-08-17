import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
  title: 'Componentes/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'El botón de RunMax. `inverse` es el por defecto y es el que lleva la acción principal de la landing. `brand` (verde) se reserva para un único acento por pantalla: si todo es verde, nada destaca.',
      },
    },
  },
  args: {
    children: 'Quiero mi acceso anticipado',
    variant: 'inverse',
    size: 'md',
    shape: 'pill',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['inverse', 'brand', 'subtle', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['pill', 'rounded'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Juega con los controles de la derecha para ver todas las combinaciones. */
export const Playground: Story = {}

export const Variantes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args} variant="inverse">Inverse</Button>
      <Button {...args} variant="brand">Brand</Button>
      <Button {...args} variant="subtle">Subtle</Button>
      <Button {...args} variant="ghost">Ghost</Button>
    </div>
  ),
}

/** `sm` son 44px: el área táctil mínima que exige WCAG 2.1 (2.5.5 Target Size). */
export const Tamanos: Story = {
  name: 'Tamaños',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args} size="sm">Small · 32px</Button>
      <Button {...args} size="md">Medium · 40px</Button>
      <Button {...args} size="lg">Large · 48px</Button>
    </div>
  ),
}

/**
 * Mientras carga, el botón se deshabilita y marca `aria-busy`, de modo que un
 * lector de pantalla anuncia que hay algo en curso en vez de quedarse mudo.
 */
export const Cargando: Story = {
  args: { loading: true, loadingText: 'Apartando tu lugar…' },
}

export const Deshabilitado: Story = {
  args: { disabled: true },
}

/** Así se ve dentro de la tarjeta del formulario del waitlist. */
export const AnchoCompleto: Story = {
  name: 'Ancho completo',
  args: { fullWidth: true, size: 'lg' },
  parameters: { layout: 'padded' },
}
