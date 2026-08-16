import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Chip, ChipGroup } from '../components/Chip/Chip'
import { Field, Input } from '../components/Field/Field'
import { Heading, Text } from '../components/Text/Text'
import { SegmentedControl } from '../components/SegmentedControl/SegmentedControl'

/**
 * El formulario real de runmaxshop.com, reconstruido usando solo la librería.
 *
 * No es una demo bonita: es la prueba de que los componentes cubren de verdad
 * la pantalla que hoy está en producción. Si algo del waitlist no se puede
 * armar desde aquí, es que a la librería le falta ese componente.
 */
const meta: Meta = {
  title: 'Fundamentos/Ejemplo · Formulario del waitlist',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Reconstrucción del formulario que hoy está en producción, montado únicamente con componentes de `@runmaxshop/react`. Sirve de prueba de cobertura: si una pantalla real no se puede armar desde la librería, la librería está incompleta.',
      },
    },
  },
}
export default meta

const INTENTS = [
  { value: 'comprar', label: 'Comprar' },
  { value: 'vender', label: 'Vender' },
  { value: 'ambos', label: 'Ambos' },
] as const

const SPORTS = ['Running', 'Triatlón', 'Ciclismo', 'Hyrox', 'Trail', 'Gym', 'Natación', 'Otro']

export const Completo: StoryObj = {
  render: function Completo() {
    const [intent, setIntent] = useState<string>('comprar')
    const [email, setEmail] = useState('')
    const [sport, setSport] = useState('')
    const [error, setError] = useState<string | undefined>()
    const [sending, setSending] = useState(false)

    function submit(event: React.FormEvent) {
      event.preventDefault()
      if (!email.includes('@')) {
        setError('Escribe un correo válido para unirte a la lista.')
        return
      }
      setError(undefined)
      setSending(true)
      setTimeout(() => setSending(false), 1200)
    }

    return (
      <Card style={{ width: 380, maxWidth: '100%' }}>
        <Heading level={2} size="30" style={{ marginBottom: 22 }}>
          Aparta tu lugar
        </Heading>

        <form onSubmit={submit} noValidate>
          <SegmentedControl
            label="Vas a usar RunMaxShop para"
            options={INTENTS}
            value={intent}
            onChange={setIntent}
          />

          <Field label="Tu correo" error={error}>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                type="email"
                placeholder="nombre@correo.com"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(undefined)
                }}
              />
            )}
          </Field>

          <Field label="¿Qué deporte practicas?" optionalText="(opcional)">
            {({ id }) => (
              <>
                <Input
                  id={id}
                  placeholder="Escríbelo a tu manera"
                  maxLength={80}
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                />
                <div style={{ marginTop: 10 }}>
                  <ChipGroup label="Sugerencias de deporte">
                    {SPORTS.map((option) => (
                      <Chip
                        key={option}
                        selected={sport.trim() === option}
                        onClick={() => setSport((s) => (s.trim() === option ? '' : option))}
                      >
                        {option}
                      </Chip>
                    ))}
                  </ChipGroup>
                </div>
              </>
            )}
          </Field>

          <div style={{ marginTop: 26 }}>
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={sending}
              loadingText="Apartando tu lugar…"
            >
              Quiero mi acceso anticipado
            </Button>
          </div>

          <Text size="13" tone="muted" align="center" style={{ marginTop: 14 }}>
            Al unirte, autorizas el uso de tus datos para enviarte tu invitación y novedades
            exclusivas.
          </Text>
        </form>
      </Card>
    )
  },
}
