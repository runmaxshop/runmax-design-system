import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { IconButton } from './IconButton'

/**
 * En una aplicación real esto es `import { Heart } from 'lucide-react'`. Aquí va
 * escrito a mano porque la librería no depende de Lucide: lo que importa es que
 * cumpla su contrato —`stroke="currentColor"`, sin relleno, y sin `width` propio
 * para que el tamaño lo mande el botón—.
 */
const Heart = (props: { fill?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" {...props} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)

const meta = {
  title: 'Componentes/IconButton',
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component:
          'Botón circular de solo icono. No es una variante de `Button` porque su contrato es más ' +
          'estricto: sin texto visible no hay nombre accesible, así que `label` es **obligatoria** y el ' +
          'componente la cablea como `aria-label`. Los iconos son de [Lucide](https://lucide.dev/icons/) ' +
          'y los trae quien usa la librería — no se empaquetan aquí.',
      },
    },
  },
  args: { label: 'Añadir a favoritos', icon: <Heart />, variant: 'primary', size: 'm' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['s', 'm'] },
    icon: { control: false },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('el botón tiene nombre accesible sin texto visible', async () => {
      const b = canvas.getByRole('button', { name: 'Añadir a favoritos' })
      await expect(b).toHaveAttribute('aria-label', 'Añadir a favoritos')
      await expect(b).toHaveTextContent('')
    })
  },
}

export const Variantes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <IconButton {...args} variant="primary" label="Primary" />
      <IconButton {...args} variant="secondary" label="Secondary" />
      <IconButton {...args} variant="ghost" label="Ghost" />
    </div>
  ),
}

/** `s` son 32 y `m` 40. Ninguno llega a los 44×44 de WCAG 2.5.5: en móvil, `m`. */
export const Tamanos: Story = {
  name: 'Tamaños',
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <IconButton {...args} size="s" label="Small · 32px" />
      <IconButton {...args} size="m" label="Medium · 40px" />
    </div>
  ),
}

/**
 * El caso de uso real: sobre la foto de una tarjeta de producto. Fijate en el
 * `secondary`: en reposo es un círculo blanco sin contorno y contra la zona
 * clara del degradado casi desaparece. Pasale el ratón por encima y el borde
 * aparece. Es el mismo compromiso que el `secondary` de `Button`, y está
 * anotado en `$known-gaps`.
 */
export const SobreFoto: Story = {
  name: 'Sobre foto',
  parameters: { layout: 'padded' },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: 260,
        height: 200,
        borderRadius: 0,
        background: 'linear-gradient(135deg, #E8E4DC 0%, #FFFFFF 45%, #C9C3B8 100%)',
      }}
    >
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
        <IconButton {...args} variant="secondary" label="Añadir a favoritos" />
        <IconButton {...args} variant="primary" label="Añadir al carrito" />
      </div>
    </div>
  ),
}

export const Deshabilitado: Story = {
  args: { disabled: true },
}

/**
 * El caso que motiva `pressed`: sin él, quien abre la lista no sabe qué productos
 * ya guardó. Fijate en tres cosas.
 *
 * El relleno **no es cosa del botón**: es un atributo del icono de Lucide, así
 * que el par es `<Heart />` y `<Heart fill="currentColor" />`.
 *
 * La etiqueta **no cambia** entre estados. Es «Favorito» siempre, y el estado lo
 * lleva `aria-pressed`. Si además cambiara a «Quitar de favoritos», un lector de
 * pantalla anunciaría el estado dos veces.
 *
 * Y el botón **no cambia de color al marcarse**: la variante es la que sea y se
 * queda como está. Marcar un favorito no es cambiar de jerarquía visual, y si el
 * contenedor cambiase de color, en una parrilla de productos las tarjetas
 * guardadas parecerían tener una acción distinta a las demás.
 */
export const Favoritos: Story = {
  args: { label: 'Favorito', variant: 'secondary' },
  render: function Favoritos(args) {
    const [favorito, setFavorito] = useState(false)
    return (
      <IconButton
        {...args}
        icon={<Heart />}
        iconPressed={<Heart fill="currentColor" />}
        pressed={favorito}
        onClick={() => setFavorito((v) => !v)}
      />
    )
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const boton = canvas.getByRole('button', { name: 'Favorito' })

    await step('arranca apagado, y lo anuncia', async () => {
      await expect(boton).toHaveAttribute('aria-pressed', 'false')
    })

    // Se mide el color real y no la clase: la prueba comprueba lo que se ve,
    // y no se rompe al renombrar una clase.
    const fondoAntes = getComputedStyle(boton).backgroundColor

    await step('al pulsarlo queda marcado', async () => {
      await userEvent.click(boton)
      await expect(boton).toHaveAttribute('aria-pressed', 'true')
    })

    await step('pero el fondo del botón no cambia al marcarlo', async () => {
      await expect(getComputedStyle(boton).backgroundColor).toBe(fondoAntes)
    })

    await step('la etiqueta no cambia entre estados', async () => {
      await expect(boton).toHaveAttribute('aria-label', 'Favorito')
    })
  },
}

/** Sin `pressed`, el botón es una acción normal y no emite `aria-pressed`. */
export const SinEstado: Story = {
  name: 'Sin estado',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('un botón de acción no miente diciendo que está apagado', async () => {
      const b = canvas.getByRole('button', { name: 'Añadir a favoritos' })
      await expect(b).not.toHaveAttribute('aria-pressed')
    })
  },
}
