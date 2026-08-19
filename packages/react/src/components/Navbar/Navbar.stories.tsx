import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Navbar, type NavbarItem } from './Navbar'

const meta: Meta<typeof Navbar> = {
  title: 'Componentes/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'La navegación del sitio. Es el único componente **T** de la librería: por encima de `md` es una barra con mega menús que caen; por debajo, un cajón con acordeones. El DOM es el mismo en los dos casos —cambiá el ancho en la barra de herramientas y comprobalo con el inspector—. Que un ítem abra mega menú es una propiedad del ítem (`columns`), no una variante del componente: las variantes `Columns=3` y `Columns=4` de Figma son el mismo código.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Navbar>

/** El wordmark va como slot: la librería no empaqueta assets de marca. */
function Wordmark() {
  return (
    <span
      style={{
        fontFamily: 'var(--rmx-font-family-display)',
        fontWeight: 'var(--rmx-font-weight-extrabold)',
        fontSize: 'var(--rmx-font-size-heading-s)',
        fontStyle: 'italic',
        letterSpacing: '0.02em',
      }}
    >
      RUNMAX
    </span>
  )
}

/** Igual que los iconos: los trae quien usa la librería. Aquí van a mano para la historia. */
function Icono({ label, d }: { label: string; d: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      style={{
        display: 'flex',
        border: 0,
        padding: 0,
        background: 'none',
        color: 'var(--rmx-icon-primary)',
        cursor: 'pointer',
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={d} />
      </svg>
    </button>
  )
}

const USUARIO = 'M18 20a6 6 0 0 0-12 0M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8'
const CARRITO = 'M8 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2M19 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2M2 2h2l2.6 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6'

function Promo() {
  return (
    <div
      style={{
        width: 320,
        height: 240,
        background: 'var(--rmx-bg-subtle)',
      }}
      role="img"
      aria-label="Nueva colección de running"
    />
  )
}

const ITEMS: readonly NavbarItem[] = [
  {
    label: 'Deportes',
    columns: [
      {
        heading: 'Ropa',
        links: [
          { label: 'Camisetas', href: '/deportes/camisetas' },
          { label: 'Chaquetas', href: '/deportes/chaquetas' },
          { label: 'Licras', href: '/deportes/licras' },
          { label: 'Pantalonetas', href: '/deportes/pantalonetas' },
        ],
        viewAll: { label: 'Ver todo', href: '/deportes/ropa' },
      },
      {
        heading: 'Calzado',
        links: [
          { label: 'Running', href: '/deportes/running' },
          { label: 'Trail', href: '/deportes/trail' },
          { label: 'Training', href: '/deportes/training' },
          { label: 'Ciclismo', href: '/deportes/ciclismo' },
        ],
        viewAll: { label: 'Ver todo', href: '/deportes/calzado' },
      },
      {
        heading: 'Accesorios',
        links: [
          { label: 'Gorras', href: '/deportes/gorras' },
          { label: 'Medias', href: '/deportes/medias' },
          { label: 'Gafas', href: '/deportes/gafas' },
          { label: 'Mochilas', href: '/deportes/mochilas' },
        ],
        viewAll: { label: 'Ver todo', href: '/deportes/accesorios' },
      },
    ],
    promo: <Promo />,
  },
  { label: 'Hombres', href: '/hombres' },
  { label: 'Mujeres', href: '/mujeres' },
  {
    label: 'Nutrición y accesorios',
    columns: [
      {
        heading: 'Ropa',
        links: [
          { label: 'Camisetas', href: '/nutricion/camisetas' },
          { label: 'Chaquetas', href: '/nutricion/chaquetas' },
          { label: 'Licras', href: '/nutricion/licras' },
          { label: 'Pantalonetas', href: '/nutricion/pantalonetas' },
        ],
        viewAll: { label: 'Ver todo', href: '/nutricion/ropa' },
      },
      {
        heading: 'Calzado',
        links: [
          { label: 'Running', href: '/nutricion/running' },
          { label: 'Trail', href: '/nutricion/trail' },
          { label: 'Training', href: '/nutricion/training' },
          { label: 'Ciclismo', href: '/nutricion/ciclismo' },
        ],
        viewAll: { label: 'Ver todo', href: '/nutricion/calzado' },
      },
      {
        heading: 'Accesorios',
        links: [
          { label: 'Gorras', href: '/nutricion/gorras' },
          { label: 'Medias', href: '/nutricion/medias' },
          { label: 'Gafas', href: '/nutricion/gafas' },
          { label: 'Mochilas', href: '/nutricion/mochilas' },
        ],
        viewAll: { label: 'Ver todo', href: '/nutricion/accesorios' },
      },
      {
        heading: 'Nutrición',
        links: [
          { label: 'Geles', href: '/nutricion/geles' },
          { label: 'Bebidas', href: '/nutricion/bebidas' },
          { label: 'Barras', href: '/nutricion/barras' },
          { label: 'Electrolitos', href: '/nutricion/electrolitos' },
        ],
        viewAll: { label: 'Ver todo', href: '/nutricion' },
      },
    ],
    promo: <Promo />,
  },
  { label: 'Nosotros', href: '/nosotros' },
]

const ARGS_BASE = {
  items: ITEMS,
  brand: <Wordmark />,
  actions: (
    <>
      <Icono label="Mi cuenta" d={USUARIO} />
      <Icono label="Carrito" d={CARRITO} />
    </>
  ),
} as const

/**
 * En reposo la barra va sobre el fondo de página; al abrir un menú se vuelve
 * blanca para fundirse con el panel. Es el par `Type=Default` / `Type=Active`
 * de Figma, y no son dos componentes: es un solo estado visto desde los dos
 * lados.
 */
export const Predeterminado: Story = {
  args: ARGS_BASE,
  // El contrato de este componente no se ve en una captura: que abrir mueva
  // `aria-expanded`, que abrir el segundo cierre el primero y que Escape
  // devuelva el foco a donde estaba. Si algún día alguien lo "simplifica" a
  // clases CSS, esto se pone en rojo.
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const deportes = canvas.getByRole('button', { name: 'Deportes' })

    await step('los mega menús arrancan cerrados y fuera del árbol', async () => {
      await expect(deportes).toHaveAttribute('aria-expanded', 'false')
      await expect(canvas.queryByRole('link', { name: 'Camisetas' })).not.toBeInTheDocument()
    })

    await step('abrir despliega el panel y lo anuncia', async () => {
      await userEvent.click(deportes)
      await expect(deportes).toHaveAttribute('aria-expanded', 'true')
      await expect(canvas.getByRole('link', { name: 'Camisetas' })).toBeVisible()
    })

    await step('abrir otro cierra el anterior', async () => {
      const nutricion = canvas.getByRole('button', { name: 'Nutrición y accesorios' })
      await userEvent.click(nutricion)
      await expect(nutricion).toHaveAttribute('aria-expanded', 'true')
      await expect(deportes).toHaveAttribute('aria-expanded', 'false')
    })

    await step('Escape cierra y devuelve el foco al ítem que abrió', async () => {
      await userEvent.keyboard('{Escape}')
      const nutricion = canvas.getByRole('button', { name: 'Nutrición y accesorios' })
      await expect(nutricion).toHaveAttribute('aria-expanded', 'false')
      await expect(nutricion).toHaveFocus()
    })
  },
}

/**
 * Un ítem sin `columns` es un enlace normal, no un botón. `currentHref` marca
 * dónde estás con `aria-current="page"`: es un estado distinto del menú
 * abierto y por eso se dibuja distinto —peso, no subrayado—.
 */
export const SeccionActual: Story = {
  name: 'Sección actual',
  args: { ...ARGS_BASE, currentHref: '/mujeres' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('el ítem de la sección actual lo dice en el atributo', async () => {
      await expect(canvas.getByRole('link', { name: 'Mujeres' })).toHaveAttribute(
        'aria-current',
        'page',
      )
      await expect(canvas.getByRole('link', { name: 'Hombres' })).not.toHaveAttribute('aria-current')
    })
  },
}

/**
 * Debajo de `md` la barra se pliega. Mirá el inspector: los enlaces son los
 * mismos nodos que en escritorio, no una segunda copia escondida.
 *
 * Se ve en el desplegable de anchos de la barra de herramientas —320, 375—.
 */
export const Cajon: Story = {
  name: 'Cajón (móvil)',
  args: ARGS_BASE,
  globals: { viewport: { value: 'movil375', isRotated: false } },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('button', { name: 'Menú' })

    await step('el cajón arranca cerrado', async () => {
      await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })

    await step('la hamburguesa lo abre y mueve el foco dentro', async () => {
      await userEvent.click(toggle)
      await expect(toggle).toHaveAttribute('aria-expanded', 'true')
      await expect(canvas.getByRole('button', { name: 'Deportes' })).toHaveFocus()
    })

    await step('dentro del cajón el mega menú es un acordeón', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Deportes' }))
      await expect(canvas.getByRole('link', { name: 'Camisetas' })).toBeVisible()
    })

    await step('Escape cierra el acordeón y luego el cajón', async () => {
      await userEvent.keyboard('{Escape}')
      await expect(canvas.getByRole('button', { name: 'Deportes' })).toHaveAttribute(
        'aria-expanded',
        'false',
      )
      await userEvent.keyboard('{Escape}')
      await expect(toggle).toHaveAttribute('aria-expanded', 'false')
      await expect(toggle).toHaveFocus()
    })
  },
}

/** Sin `promo` y con menos columnas el panel se reparte solo: no hay prop de columnas. */
export const SinPieza: Story = {
  name: 'Panel sin pieza gráfica',
  args: {
    ...ARGS_BASE,
    items: [
      { ...ITEMS[0], promo: undefined },
      ...ITEMS.slice(1).map((item) => ({ ...item, promo: undefined })),
    ],
  },
}
