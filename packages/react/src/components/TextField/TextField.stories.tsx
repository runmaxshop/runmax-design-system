import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button/Button'
import { TextField, Input } from './TextField'

const meta = {
  title: 'Componentes/TextField',
  component: TextField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`TextField` conecta la etiqueta, la pista y el error con el campo (`htmlFor`, `aria-describedby`, `aria-invalid`) para que nadie tenga que acordarse de hacerlo a mano. Por eso `children` es una función: recibe el `id` que genera el propio componente, y así no hay forma de cablearlo mal.',
      },
    },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Basico: Story = {
  name: 'Básico',
  args: { label: 'Tu correo', children: () => null },
  render: (args) => (
    <div style={{ maxWidth: 380 }}>
      <TextField {...args} label="Tu correo">
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            aria-describedby={describedBy}
            invalid={invalid}
            type="email"
            placeholder="nombre@correo.com"
            autoComplete="email"
          />
        )}
      </TextField>
    </div>
  ),
}

export const ConOpcionalYPista: Story = {
  name: 'Opcional + pista',
  args: { label: '', children: () => null },
  render: () => (
    <div style={{ maxWidth: 380 }}>
      <TextField
        label="¿Qué deporte practicas?"
        optionalText="(opcional)"
        hint="Escríbelo a tu manera, no hay lista cerrada."
      >
        {({ id, describedBy }) => (
          <Input id={id} aria-describedby={describedBy} placeholder="Running, trail, hyrox…" />
        )}
      </TextField>
    </div>
  ),
}

/** El mensaje va con `role="alert"`, así que un lector de pantalla lo anuncia al aparecer. */
export const ConError: Story = {
  name: 'Con error',
  args: { label: '', children: () => null },
  render: () => (
    <div style={{ maxWidth: 380 }}>
      <TextField label="Tu correo" error="Escribe un correo válido para unirte a la lista.">
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            aria-describedby={describedBy}
            invalid={invalid}
            type="email"
            defaultValue="nombre@"
          />
        )}
      </TextField>
    </div>
  ),
}

/** Validación en vivo: escribe algo sin `@` y sal del campo. */
export const Interactivo: Story = {
  args: { label: '', children: () => null },
  render: function Interactivo() {
    const [value, setValue] = useState('')
    const [touched, setTouched] = useState(false)
    const error = touched && !value.includes('@') ? 'Escribe un correo válido.' : undefined

    return (
      <div style={{ maxWidth: 380 }}>
        <TextField label="Tu correo" error={error}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              aria-describedby={describedBy}
              invalid={invalid}
              type="email"
              placeholder="nombre@correo.com"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => setTouched(true)}
            />
          )}
        </TextField>
      </div>
    )
  },
}

/**
 * Los cinco estados del componente en Figma. `Rest`, `Error` y `Disabled` se
 * ven aquí tal cual; `Hover` y `Focus` son pseudo-estados y hay que provocarlos
 * —pasa el ratón por el primero, o entra con el tabulador—.
 *
 * Los tres bordes son una escalera del mismo grosor: en reposo `border.default`
 * da 1.43:1 y apenas se insinúa —quien identifica el campo es su relleno, no su
 * contorno—, `border.hover` es el primero que supera el 3:1 de WCAG 1.4.11, y
 * el foco es negro.
 */
export const Estados: Story = {
  args: { label: '', children: () => null },
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 380 }}>
      <TextField label="Rest — pasa el ratón para ver el hover">
        {({ id }) => <Input id={id} placeholder="Correo electrónico" />}
      </TextField>

      <TextField label="Error" error="Escribe un correo válido para unirte a la lista.">
        {({ id, describedBy, invalid }) => (
          <Input id={id} aria-describedby={describedBy} invalid={invalid} defaultValue="nombre@" />
        )}
      </TextField>

      <TextField label="Disabled">
        {({ id }) => <Input id={id} placeholder="Correo electrónico" disabled />}
      </TextField>
    </div>
  ),
}

/**
 * El campo mide 48 (`control.height.l`), así que el botón que va a su lado es
 * `size="l"`. Los dos salen de la misma escala y por eso alinean sin ayuda.
 */
export const AlineadoConUnBoton: Story = {
  name: 'Alineado con un botón',
  args: { label: '', children: () => null },
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', maxWidth: 460 }}>
      <div style={{ flex: 1 }}>
        <TextField label="Tu correo">
          {({ id }) => <Input id={id} type="email" placeholder="nombre@correo.com" />}
        </TextField>
      </div>
      <Button size="l">Unirme</Button>
    </div>
  ),
}
