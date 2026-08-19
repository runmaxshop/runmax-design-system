# RunMax Design System

Monorepo con dos paquetes: `@runmaxshop/tokens` (los tokens en formato DTCG y su compilador)
y `@runmaxshop/react` (los componentes). Se publica a npm y lo consume `runmaxshop-frontend`.

## Las reglas que no se negocian

1. **Ningún color, tamaño o radio escrito a mano.** Todo sale de `var(--rmx-*)`. Si el token no
   existe, la conversación es sobre añadirlo, no sobre escapar del sistema.
2. **Semánticos, nunca primitivos.** `var(--rmx-text-tertiary)`, no `var(--rmx-color-neutral-600)`.
3. **La accesibilidad va en el componente, no en quien lo usa.** Si puede cablear su propio
   `aria-*`, lo cablea él. `IconButton` exige `label` por eso.

El detalle completo está en [CONTRIBUTING.md](CONTRIBUTING.md), incluida la clasificación
**F / C / T** que hay que decidir *antes* de escribir el componente y anotar en su cabecera.

## La marca

**La acción es negra, no lima.** El lima (`#B8CE00`) es acento —superficie o tinta sobre
oscuro— y sobre claro da 1.8:1. No existe ningún token de marca llamado `primary`.

Vocabulario compartido entre componentes: `variant` es `primary | secondary | ghost`, `size` es
`s | m | l` (32 · 40 · 48, la escala `control.height`), `shape` es `rect | pill`. La esquina
viva es el carácter del sistema.

## Figma manda

Archivo: `Q22veVePKlAx80XsDDSTpt`. Cuando Figma y el código discrepen, **se corrige Figma
primero y después se trae al código** — no al revés. Componentes ya construidos: `Button`
(`1412:550`), `Input` (`1579:530`), `IconButton` (`1415:532`).

Antes de cualquier `use_figma` hay que cargar la skill `figma-use`; para crear componentes,
también `figma-generate-library`.

Dos trampas del archivo:

- **`Legacy · Oscuro` es la paleta de otro producto (Patt), con 1281 bindings vivos.** Comparte
  seis nombres con `2 · Semantic` y una búsqueda por nombre devuelve la equivocada primero.
  **Siempre filtrar por id de colección.** Las vivas de RunMax son `1 · Primitives`,
  `2 · Semantic` y `3 · Scale`.
- El code syntax de las variables usa `var(--rmx-*)`, que es el nombre real del CSS compilado.
  Quedan 13 variables sin contraparte en código —la rampa `max/*` y `bg/agent*`, el lenguaje del
  agente Max, que nunca entró a los tokens—: no inventarles nombre.

## Cómo se verifica

```bash
npm run build           # tokens -> CSS/TS/native, y luego styles.css
npm run check:contrast  # el gate de WCAG
npm run verify          # build + contraste + typecheck
```

**`npm ci` NO funciona en la máquina de desarrollo**: el registro público es inalcanzable desde
esa red y el proxy corporativo bloquea `@types/*` y `@storybook/*`. `build` y `check:contrast`
sí corren en local porque son node puro y sin dependencias. **El typecheck y Storybook solo se
verifican en CI**, que es el verificador real — no reportes el typecheck como pasado sin mirar
el run, y compruébalo por SHA, no por el estado del PR.

Nunca toques `package-lock.json`.

## El gate de contraste

`packages/tokens/src/contrast.config.json` declara los pares que el CI verifica. Todo color de
texto o de fondo nuevo necesita su par. Un texto pide 4.5:1 (WCAG 1.4.3); un gráfico no textual
—icono, borde, indicador de foco— pide 3:1 (1.4.11): son reglas distintas y por eso `icon.*`
existe separado de `text.*`.

Las excepciones conscientes van a `$known-gaps` **con su número y su porqué**. Hay cinco. No se
retira un par para hacer pasar el build sin anotarlo ahí.

## Estructura

```
packages/react/src/components/MiComponente/
  MiComponente.tsx  ·  .css  ·  .stories.tsx
```

Y exportarlo desde `src/index.ts`. El CSS se recoge solo. Si tiene estado, lleva un `play` que
compruebe su contrato — buscando por rol y nombre accesible, nunca por clase CSS.

## Sesiones en paralelo

Los componentes que comparten tokens o que tienen que coincidir entre sí van en la **misma**
sesión: si terminar B te obliga a volver a A, son la misma rebanada.

`packages/tokens/src/` **nunca en paralelo** — versiones, `contrast.config.json` y CHANGELOG son
la superficie compartida donde chocan las sesiones. Si hay varias a la vez, una `git worktree`
por sesión y una rama por sesión, siempre desde `main`.
