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
      <Group
        title="Superficies"
        prefix="bg."
        note="`bg.page` es un off-white cálido, no blanco: el blanco queda para las superficies que se levantan sobre la página (cards, navbar, modales). `bg.inverse` es negro y es la acción; `bg.highlight` es el lima y es destaque."
      />
      <Group title="Bordes" prefix="border." />
      <Group title="Velos" prefix="scrim." />
    </>
  ),
}

export const Primitivos: StoryObj = {
  name: 'Primitivos (no los uses directo)',
  render: () => (
    <>
      <Group
        title="Lime — acento de marca"
        prefix="color.lime"
        note="El 500 (#B8CE00) es el lima de marca, tomado de las mesas de Figma. Es **acento, no acción**: sobre blanco da 1.8:1 y no se puede usar como texto sobre claro. El 100 es la superficie del badge de destaque; el 400 es la tinta y el foco sobre oscuro."
      />
      <Group title="Neutrales" prefix="color.neutral" />
      <Group title="Feedback" prefix="color.danger" />
      <Group title="" prefix="color.success" />
      <Group title="" prefix="color.warning" />
    </>
  ),
}
