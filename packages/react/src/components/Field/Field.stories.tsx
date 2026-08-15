import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Field, Input } from './Field'

const meta = {
  title: 'Componentes/Field',
  component: Field,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`Field` conecta la etiqueta, la pista y el error con el campo (`htmlFor`, `aria-describedby`, `aria-invalid`) para que nadie tenga que acordarse de hacerlo a mano. Por eso `children` es una función: recibe el `id` que genera el propio componente, y así no hay forma de cablearlo mal.',
      },
    },
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Basico: Story = {
  name: 'Básico',
  args: { label: 'Tu correo', children: () => null },
  render: (args) => (
    <div style={{ maxWidth: 380 }}>
      <Field {...args} label="Tu correo">
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
      </Field>
    </div>
  ),
}

export const ConOpcionalYPista: Story = {
  name: 'Opcional + pista',
  args: { label: '', children: () => null },
  render: () => (
    <div style={{ maxWidth: 380 }}>
      <Field
        label="¿Qué deporte practicas?"
        optionalText="(opcional)"
        hint="Escríbelo a tu manera, no hay lista cerrada."
      >
        {({ id, describedBy }) => (
          <Input id={id} aria-describedby={describedBy} placeholder="Running, trail, hyrox…" />
        )}
      </Field>
    </div>
  ),
}

/** El mensaje va con `role="alert"`, así que un lector de pantalla lo anuncia al aparecer. */
export const ConError: Story = {
  name: 'Con error',
  args: { label: '', children: () => null },
  render: () => (
    <div style={{ maxWidth: 380 }}>
      <Field label="Tu correo" error="Escribe un correo válido para unirte a la lista.">
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            aria-describedby={describedBy}
            invalid={invalid}
            type="email"
            defaultValue="nombre@"
          />
        )}
      </Field>
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
        <Field label="Tu correo" error={error}>
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
        </Field>
      </div>
    )
  },
}
