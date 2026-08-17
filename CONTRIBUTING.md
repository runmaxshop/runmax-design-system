# Cómo se contribuye

## Las tres reglas

1. **Nunca escribas un color, un tamaño o un radio a mano.** Si el token no existe, la
   conversación es sobre añadir el token, no sobre escapar del sistema.
2. **Usa los tokens semánticos, no los primitivos.** `var(--rmx-text-tertiary)`, no
   `var(--rmx-color-neutral-600)`. El semántico dice para qué sirve; el primitivo, cómo es.
3. **La accesibilidad va en el componente, no en quien lo usa.** Si un componente puede
   cablear su propio `aria-*`, lo cablea él.

## Añadir un token

1. Edítalo en `packages/tokens/src/<grupo>.tokens.json`. Formato DTCG: `$value`, `$type` y,
   cuando el porqué no sea obvio, `$description`.
2. Si es un color de texto o de fondo, añade el par correspondiente a
   `src/contrast.config.json`. Un color de texto sin par declarado es un color sin verificar.
3. `npm run verify`.

Los ficheros de `packages/tokens/dist/` están generados. No los edites: se sobrescriben.

## Añadir un componente

```
packages/react/src/components/MiComponente/
  MiComponente.tsx
  MiComponente.css
  MiComponente.stories.tsx
```

Y exportarlo desde `src/index.ts`. El CSS se recoge solo (`scripts/build-styles.mjs` recorre
la carpeta), no hay que registrarlo en ningún sitio.

### Clasificarlo primero: F, C o T

Antes de escribir una línea, decidí **cómo se adapta**. Hay tres respuestas y solo tres, y la
letra va anotada en la cabecera del archivo del componente.

| Letra | Nombre | Se adapta según | ¿Lleva breakpoints? |
|---|---|---|---|
| **F** | Fluido | su propio contenido | **No — nunca** |
| **C** | De contenedor | el ancho de su contenedor | No — usa `@container` |
| **T** | Transformacional | el viewport | Sí, y es una decisión de UX |

Ante la duda, el orden de preferencia es **F → C → T**. Cada escalón agrega complejidad y
superficie de error, y solo se sube cuando el anterior no alcanza. La mayoría de los
componentes de esta librería son **F**.

- **F** se resuelve con `clamp()`, `grid auto-fit`, `flex-wrap`, `aspect-ratio`, `min-width: 0`
  y unidades relativas. **Si un componente F tiene un `md:` o una media query, está mal
  clasificado.** Un botón no tiene "versión móvil": tiene `size` y un modo de ancho, y quien lo
  usa decide.
- **C** es obligatorio si el componente vive en contenedores de anchos distintos. Una media
  query ahí miente: pregunta por el ancho de la pantalla cuando lo que importa es el espacio
  disponible.
- **T** cambia *qué* se renderiza, no cuánto mide. Es el único que documenta dos estados, y
  tiene que hacerlo **sin duplicar el contenido en el DOM**: `hidden md:block` junto a
  `md:hidden` con lo mismo dentro rompe los lectores de pantalla y penaliza el SEO.

El rango soportado es **320–1920px**. Los cinco anchos de verificación —320, 375, 768, 1280 y
1920— están cargados en la barra de herramientas de Storybook: son un desplegable, no un
"después lo miro".

### Qué pertenece a esta librería

Lo que **no sabe nada del negocio**. Un componente de aquí recibe props y renderiza: no
importa stores, ni hooks de dominio, ni rutas, ni sabe que Max existe. Si necesita saber qué
hay en el carrito, no va aquí — va en la aplicación, compuesto con piezas de aquí.

La librería manda en el aspecto de la pieza; los márgenes y el layout de la página los pone la
página.

Checklist antes de darlo por hecho:

- [ ] Clasificado **F**, **C** o **T**, con la letra anotada en el archivo, e implementado
      según esa letra.
- [ ] Verificado en 320, 375, 768, 1280 y 1920.
- [ ] Todos los valores de CSS salen de `var(--rmx-*)`. Cero literales.
- [ ] Tiene estado de foco visible (`:focus-visible`) con el token de foco.
- [ ] Si es interactivo, empieza con `'use client'` — la app anfitriona es Next.
- [ ] Si tiene transiciones, las apaga bajo `@media (prefers-reduced-motion: reduce)`.
- [ ] Los estados se exponen con atributos ARIA reales (`aria-pressed`, `aria-expanded`),
      no con clases CSS.
- [ ] Tiene historia con controles, y la pestaña **Accessibility** de Storybook sale limpia.
- [ ] **Si tiene estado, tiene un `play`** que comprueba su contrato de comportamiento —
      ver abajo.
- [ ] Las props llevan comentario cuando la elección no es evidente: esos comentarios
      **son** la documentación que se publica.
- [ ] `npm run verify` pasa.

## Probar el comportamiento, no el aspecto

Un componente con estado tiene un contrato que no se ve en una captura: que `mode: 'single'`
cierre la respuesta anterior, que elegir una opción *mueva* la marca en vez de sumarla, que el
`aria-expanded` siga al estado real. Eso se comprueba con un `play` en la propia historia,
usando `storybook/test` (viene dentro de `storybook`, no hay que instalar nada):

```tsx
import { expect, userEvent, within } from 'storybook/test'

export const MiHistoria: Story = {
  args: { /* … */ },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('describe qué se comprueba', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Abrir' }))
      await expect(canvas.getByRole('button', { name: 'Abrir' })).toHaveAttribute(
        'aria-expanded',
        'true',
      )
    })
  },
}
```

Dos reglas que hacen que estas pruebas envejezcan bien:

1. **Buscá por rol y nombre accesible** (`getByRole('radio', { name: 'Vender' })`), nunca por
   clase CSS. Así la prueba comprueba lo que percibe quien usa un lector de pantalla, y no se
   rompe al renombrar una clase.
2. **Usá `step()`** con una frase que diga qué se espera. El panel de Storybook los muestra en
   orden, así que la prueba se lee como la descripción del comportamiento.

> **Falta el corredor headless.** Hoy los `play` se ejecutan al abrir la historia en Storybook,
> pero el CI no los corre: eso necesita `@storybook/test-runner` o el addon de Vitest, y añadir
> una dependencia exige regenerar `package-lock.json`. Está pendiente. Mientras tanto, un `play`
> en rojo se ve en el panel **Interactions** al revisar la preview de la PR.

## Preferir lo nativo

`SegmentedControl` usa `<input type="radio">` de verdad con un `<span>` encima, y no
`<div role="radio">`. El elemento nativo ya trae navegación con flechas, agrupado por `name` y
soporte de lectores de pantalla; reimplementar eso a mano casi siempre sale peor. Cuando exista
un elemento HTML para lo que necesitas, empieza por ahí.

## Versionado

[SemVer](https://semver.org/lang/es/). Cambiar el valor de un token que altera cómo se ve algo
en producción es un cambio *minor* como mínimo; quitar o renombrar un token o una prop es
*major*. Todo cambio va al [CHANGELOG.md](CHANGELOG.md).
