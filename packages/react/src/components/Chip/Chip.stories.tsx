import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Chip, ChipGroup } from './Chip'

const meta = {
  title: 'Componentes/Chip',
  component: Chip,
  parameters: {
    docs: {
      description: {
        component:
          'Un chip es un botón de dos estados. El seleccionado se expone con `aria-pressed`, no con una clase: es la semántica que un lector de pantalla sabe anunciar ("pulsado" / "no pulsado").',
      },
    },
  },
  args: { children: 'Running' },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Estados: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Chip>Sin seleccionar</Chip>
      <Chip selected>Seleccionado</Chip>
      <Chip disabled>Deshabilitado</Chip>
    </div>
  ),
}

/** Los deportes reales del formulario del waitlist. Selección única. */
export const GrupoDeDeportes: Story = {
  name: 'Grupo de deportes',
  render: function GrupoDeDeportes() {
    const SPORTS = ['Running', 'Triatlón', 'Ciclismo', 'Hyrox', 'Trail', 'Gym', 'Natación', 'Otro']
    const [selected, setSelected] = useState<string | null>('Running')

    return (
      <div style={{ maxWidth: 420 }}>
        <ChipGroup label="Sugerencias de deporte">
          {SPORTS.map((sport) => (
            <Chip
              key={sport}
              selected={selected === sport}
              onClick={() => setSelected((s) => (s === sport ? null : sport))}
            >
              {sport}
            </Chip>
          ))}
        </ChipGroup>
      </div>
    )
  },
}
