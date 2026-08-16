import type { Meta, StoryObj } from '@storybook/react-vite'
import tokens from '@runmaxshop/tokens/json'

const meta: Meta = {
  title: 'Fundamentos/Colores',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Los primitivos son la paleta cruda y **no se usan directamente en un componente**. Lo que se usa son los tokens semánticos: dicen para qué sirve el color, no cómo es. Cuando llegue el tema oscuro, se re-mapean los semánticos y ningún componente cambia.',
      },
    },
  },
}
export default meta

// El JSON trae también números y arrays (duraciones, curvas de bezier);
// esta vista solo dibuja los que son color, así que se filtran más abajo.
const entries = Object.entries(tokens as unknown as Record<string, unknown>)
const isHex = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith('#')

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 300 }}>
      <div
        style={{
          width: 44,
          height: 44,
          flex: 'none',
          borderRadius: 10,
          background: value,
          border: '1px solid #DEDEDE',
        }}
      />
      <div style={{ fontFamily: 'Barlow, sans-serif', lineHeight: 1.3 }}>
        <code style={{ fontSize: 13, fontWeight: 500 }}>{name}</code>
        <div style={{ fontSize: 12, color: '#5C5A54', textTransform: 'uppercase' }}>{value}</div>
      </div>
    </div>
  )
}

function Group({ title, prefix, note }: { title: string; prefix: string; note?: string }) {
  // El predicado va sobre el par completo para que TypeScript estreche también
  // el valor: filtrar por `isHex(value)` dentro del callback no lo consigue.
  const items = entries.filter(
    (entry): entry is [string, string] => entry[0].startsWith(prefix) && isHex(entry[1]),
  )
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 28, margin: '0 0 4px' }}>
        {title}
      </h2>
      {note && (
        <p style={{ fontFamily: 'Barlow, sans-serif', color: '#5C5A54', margin: '0 0 16px', maxWidth: 640 }}>
          {note}
        </p>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {items.map(([key, value]) => (
          <Swatch key={key} name={key} value={value} />
        ))}
      </div>
    </section>
  )
}

export const Semanticos: StoryObj = {
  name: 'Semánticos (usa estos)',
  render: () => (
    <>
      <Group
        title="Texto"
        prefix="text."
        note="Color de texto por rol. Todos los pares texto/fondo de esta página están verificados contra WCAG 2.1 por `npm run check:contrast`, que corre en CI."
      />
      <Group title="Superficies" prefix="surface." />
      <Group title="Bordes" prefix="border." />
    </>
  ),
}

export const Primitivos: StoryObj = {
  name: 'Primitivos (no los uses directo)',
  render: () => (
    <>
      <Group
        title="Lime — verde de marca"
        prefix="color.lime"
        note="El 500 (#AAFF00) es el verde oficial de RunMax. El 600 es el hover. `lime.mist` es el verde pálido del fondo de la sección de registro: no está en la rampa porque no es una luminancia del mismo tono, pero producción depende de él."
      />
      <Group title="Neutrales" prefix="color.neutral" />
      <Group title="Feedback" prefix="color.danger" />
      <Group title="" prefix="color.success" />
      <Group title="" prefix="color.warning" />
    </>
  ),
}
