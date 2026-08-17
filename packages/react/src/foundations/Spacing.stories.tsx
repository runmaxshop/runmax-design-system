import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import tokens from '@runmaxshop/tokens/json'

const meta: Meta = {
  title: 'Fundamentos/Espaciado',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Espaciado, radios, bordes, elevación, foco y movimiento. Todo sale de la auditoría de las mesas de Figma, y el nombre del token **es** su valor en píxeles: `space.16` son 16px. Se prefiere eso a una escala t-shirt (`sm`, `md`, `lg`) porque elimina la traducción mental y hace evidente cuándo alguien está inventando un valor que no existe.',
      },
    },
  },
}
export default meta

// El JSON trae también números y arrays (pesos, interlineados, curvas de bezier),
// así que el valor se normaliza a texto antes de pintarlo: un array como hijo de
// JSX se renderizaría con sus elementos pegados.
const all = tokens as unknown as Record<string, unknown>
const format = (value: unknown): string =>
  Array.isArray(value) ? `cubic-bezier(${value.join(', ')})` : String(value)
const group = (prefix: string): [string, string][] =>
  Object.entries(all)
    .filter(([key]) => key.startsWith(prefix))
    .map(([key, value]) => [key, format(value)])

const mono = { fontFamily: 'ui-monospace, SF Mono, Menlo, monospace', fontSize: 12 } as const
const body = { fontFamily: 'Barlow, system-ui, sans-serif' } as const
const note = { ...body, fontSize: 13, color: 'var(--rmx-text-tertiary)', maxWidth: '68ch' } as const

function Section({
  title,
  children,
  intro,
}: {
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <section style={{ marginBottom: 48, maxWidth: 860 }}>
      <h2
        style={{
          ...body,
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 28,
          margin: '0 0 4px',
          color: 'var(--rmx-text-primary)',
        }}
      >
        {title}
      </h2>
      {intro && <p style={{ ...note, margin: '0 0 20px' }}>{intro}</p>}
      {children}
    </section>
  )
}

/** El espaciado se dibuja a escala real: la barra mide lo que dice el token. */
export const Espaciado: StoryObj = {
  render: () => (
    <Section
      title="Espaciado — base 4"
      intro="La auditoría encontró 41 usos de un gap de 10px fuera de escala. Van a 8 en agrupaciones apretadas (icono + texto, chips) y a 12 en el stack de contenido de la card (marca → nombre → precio). También caen el 6 (→ 8, lo que lleva el botón circular de 28 a 32px y lo mete en la grilla) y el 5 (→ 4)."
    >
      <div style={{ display: 'grid', gap: 6 }}>
        {group('space.').map(([key, value]) => (
          <div
            key={key}
            style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'center', gap: 12 }}
          >
            <code style={{ ...mono, color: 'var(--rmx-text-tertiary)' }}>
              {key.replace('space.', 'space/')}
            </code>
            <div
              style={{
                width: value,
                height: 14,
                minWidth: 1,
                background: 'var(--rmx-bg-inverse)',
              }}
              title={value}
            />
          </div>
        ))}
      </div>
    </Section>
  ),
}

export const Radios: StoryObj = {
  render: () => (
    <Section
      title="Radios"
      intro="De 6 valores observados (2, 5, 8, 20, 40, 75) a 5 tokens. El 20, el 40 y el 75 colapsan en `full` porque siempre se aplicaban a elementos que quedan completamente redondeados. `none` es el valor por defecto de cards e imágenes: las mesas son mayoritariamente de esquina viva y eso es carácter del sistema, no un descuido."
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {group('radius.').map(([key, value]) => (
          <div key={key} style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: value,
                border: '1px solid var(--rmx-border-strong)',
                background: 'var(--rmx-bg-surface)',
              }}
            />
            <code style={{ ...mono }}>{key.replace('radius.', 'radius/')}</code>
            <span style={{ ...mono, color: 'var(--rmx-text-tertiary)' }}>{value}</span>
          </div>
        ))}
      </div>
    </Section>
  ),
}

export const AlturasDeControl: StoryObj = {
  name: 'Alturas de control',
  render: () => (
    <Section
      title="Alturas de control"
      intro="Los tres tamaños de botón de las mesas. El tamaño `s` (32px) cumple WCAG 2.5.8 (AA, 24×24) pero NO 2.5.5 (AAA, 44×44): es una decisión de diseño consciente. Si un control `s` va a ser el único destino táctil de una acción importante en móvil, usá `m` o dale área con padding alrededor."
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        {group('control.height.').map(([key, value]) => (
          <div key={key} style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
            <div
              style={{
                height: value,
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                background: 'var(--rmx-bg-inverse)',
                color: 'var(--rmx-text-inverse)',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 500,
              }}
            >
              Agregar al carrito
            </div>
            <code style={{ ...mono, color: 'var(--rmx-text-tertiary)' }}>
              {key.replace('control.height.', 'control/height/')} · {value}
            </code>
          </div>
        ))}
      </div>
    </Section>
  ),
}

export const BordesYElevacion: StoryObj = {
  name: 'Bordes y elevación',
  render: () => (
    <Section
      title="Bordes y elevación"
      intro="No hay una sola sombra en las dos mesas: la separación se hace con borde y superficie. Que no haya sombras no es un olvido, es el carácter del sistema —plano, editorial, de hairline— y está escrito para que no se filtren las sombras suaves que traen las librerías por defecto."
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
        {group('border-width.').map(([key, value]) => (
          <div key={key} style={{ display: 'grid', gap: 6 }}>
            <div
              style={{
                width: 180,
                height: 56,
                border: `${value} solid var(--rmx-border-strong)`,
                background: 'var(--rmx-bg-surface)',
              }}
            />
            <code style={{ ...mono, color: 'var(--rmx-text-tertiary)' }}>
              {key.replace('border-width.', 'border-width/')} · {value}
            </code>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
        {group('shadow.').map(([key, value]) => (
          <div key={key} style={{ display: 'grid', gap: 6 }}>
            <div
              style={{
                width: 180,
                height: 88,
                boxShadow: value,
                background: 'var(--rmx-bg-surface)',
              }}
            />
            <code style={{ ...mono, color: 'var(--rmx-text-tertiary)' }}>
              {key.replace('shadow.', 'shadow/')}
            </code>
          </div>
        ))}
      </div>
      <p style={{ ...note, marginTop: 12 }}>
        <code style={mono}>shadow/overlay</code> es la única excepción: megamenú, drawer, modal y
        toast, que flotan sobre contenido y necesitan despegarse.
      </p>
    </Section>
  ),
}

export const Foco: StoryObj = {
  render: () => (
    <Section
      title="Foco"
      intro="El anillo de foco es un token, no una decisión por componente: si cada uno lo dibuja a su manera, la navegación por teclado se vuelve impredecible. Sobre claro es negro (18.11:1 sobre el fondo de página); el lima se reserva para el foco sobre oscuro, porque sobre claro daría 1.5:1 y WCAG 1.4.11 exige 3:1 para un indicador de foco."
    >
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
        <div
          style={{
            padding: '12px 20px',
            background: 'var(--rmx-bg-surface)',
            outline: 'var(--rmx-focus-width) solid var(--rmx-border-focus)',
            outlineOffset: 'var(--rmx-focus-offset)',
            ...body,
          }}
        >
          Foco sobre claro
        </div>
        <div style={{ background: 'var(--rmx-bg-inverse)', padding: 20 }}>
          <div
            style={{
              padding: '12px 20px',
              color: 'var(--rmx-text-inverse)',
              outline: 'var(--rmx-focus-width) solid var(--rmx-border-focus-inverse)',
              outlineOffset: 'var(--rmx-focus-offset)',
              ...body,
            }}
          >
            Foco sobre oscuro
          </div>
        </div>
      </div>
    </Section>
  ),
}

export const Movimiento: StoryObj = {
  render: () => (
    <Section
      title="Movimiento y breakpoints"
      intro="Las duraciones y las curvas existen para que dos componentes que hacen lo mismo tarden lo mismo. Todo componente con transición la apaga bajo `prefers-reduced-motion`."
    >
      <table style={{ ...body, borderCollapse: 'collapse', fontSize: 13.5, minWidth: 380 }}>
        <tbody>
          {[...group('duration.'), ...group('easing.'), ...group('breakpoint.')].map(
            ([key, value]) => (
              <tr key={key} style={{ borderBottom: '1px solid var(--rmx-border-subtle)' }}>
                <td style={{ ...mono, padding: '7px 20px 7px 0' }}>{key}</td>
                <td style={{ ...mono, padding: '7px 0', color: 'var(--rmx-text-tertiary)' }}>
                  {value}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      <p style={{ ...note, marginTop: 16 }}>
        Los breakpoints son los únicos valores de esta página que <strong>no</strong> salen de
        Figma: vienen de <code style={mono}>docs/design-system/responsive.md</code> del frontend.
        Son de viewport y solo los usa un componente transformacional; un componente de contenedor
        usa <code style={mono}>@container</code>.
      </p>
    </Section>
  ),
}
