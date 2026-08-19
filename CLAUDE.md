# RunMax Design System

Monorepo con dos paquetes: `@runmaxshop/tokens` (los tokens en formato DTCG y su compilador)
y `@runmaxshop/react` (los componentes).

**Todavía no se publica en ningún registro y `runmaxshop-frontend` NO lo consume** — no hay
workflow de publicación ni dependencia declarada. La decisión de distribución sigue abierta en
[docs/integracion-nextjs.md](docs/integracion-nextjs.md), que recomienda GitHub Packages y
avisa de que un `"file:../runmax-design-system"` rompe el build de Vercel. Hasta que se
resuelva, no se puede integrar un componente en el frontend por mucho que esté terminado.

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

**El wordmark no está en el repo, y los SVG sueltos de `Documents/Runmax` NO sirven.**
`logo.svg` y `logoBlanco.svg` son otro lockup —«RUNMAX SHOP» en lima, con el elemento «SHOP»
debajo, proporciones 2.88:1 y 3.41:1—. El de Figma (`Logo Runmax`, `1562:5354`) es un wordmark
monocromo, sólo «RUNMAX», de 5.41:1. No son el mismo dibujo a otra escala: usarlos es cambiar
la marca por tu cuenta. Mientras no se pueda exportar desde Figma, el logo entra por el slot
`brand` y en las historias va un marcador de posición — que hay que decir que lo es.

## Figma manda

Archivo: `Q22veVePKlAx80XsDDSTpt`. Cuando Figma y el código discrepen, **se corrige Figma
primero y después se trae al código** — no al revés. Eso incluye bajar el tamaño de un estilo
de texto: se edita el estilo en Figma, se actualiza su etiqueta de especificación en la mesa de
Foundations, y recién ahí se toca el token. Cambiar el token y dejar una nota diciendo «Figma
tiene que bajarlo» es hacerlo al revés.

Componentes ya construidos: `Button` (`1412:550`), `Input` (`1579:530`), `IconButton`
(`1415:532`), `Navbar` (`1427:568`) y `MegaMenu` (`1428:580`).

El DS vive repartido en páginas `Runmax DS · …` — Foundations, Actions, Content, Product,
Navigation, Input—. Los estilos de texto son estilos, no variables: salen de
`getLocalTextStylesAsync()`, no de `getVariableDefs`.

Antes de cualquier `use_figma` hay que cargar la skill `figma-use`; para crear componentes,
también `figma-generate-library`.

**`get_design_context` está bloqueado** mientras no haya un directorio en *Dev Mode → MCP →
Allowed directories*. Sin él no hay CSS real ni exportación de assets, y sólo quedan
`get_metadata`, `get_variable_defs` y capturas — de los que hay que **inferir**. Eso ya produjo
dos bugs reales en el navbar, así que si aparece la ocasión de habilitarlo, pedirlo antes de
empezar.

Truco que sale de esos dos bugs: **comparar qué variables usa cada variante, no sólo qué
valores tienen.** Si una variante lista `radius-m` y otra lista `radius-m` **y** `radius-none`,
la segunda está poniendo algo a cero — en el navbar era la barra perdiendo sus esquinas
inferiores al abrirse, porque barra y panel son *una* tarjeta de 8 que se parte en dos. Una
lista de variables no dice a qué propiedad se aplica cada una; adivinarlo mal es fácil.

Dos trampas del archivo:

- **`Legacy · Oscuro` es la paleta de otro producto (Patt), con 1281 bindings vivos.** Comparte
  seis nombres con `2 · Semantic` y una búsqueda por nombre devuelve la equivocada primero.
  **Siempre filtrar por id de colección.** Las vivas de RunMax son `1 · Primitives`,
  `2 · Semantic` y `3 · Scale`.
- El code syntax de las variables usa `var(--rmx-*)`, que es el nombre real del CSS compilado.
  Quedan 13 variables sin contraparte en código —la rampa `max/*` y `bg/agent*`, el lenguaje del
  agente Max, que nunca entró a los tokens—: no inventarles nombre.

## Los iconos son de Lucide

El diseño usa [Lucide](https://lucide.dev/icons/) y las instancias de Figma llevan su nombre
literal (`user-round`, `shopping-cart`, `menu`). **La librería no depende de `lucide-react` a
propósito**: quien la usa trae los iconos y no carga un set entero. `IconButton` los recibe por
la prop `icon`; `Navbar`, por el slot `actions`.

Pero cuando haya que dibujar un icono —en una historia, o como cromo del propio componente—
**el trazado tiene que ser el de Lucide literal, no uno parecido**. Copiarlo de
`node_modules/lucide-react/dist/esm/icons/<nombre>.mjs`, que es donde está el dato exacto. Los
atributos por defecto del set son cuadro de 24, `stroke-width` **2** y extremos redondeados.

Dos errores ya cometidos, para no repetirlos:

- Dibujar «de memoria» un `user-round` con el círculo en (12,6) r=4 cuando el real lo tiene en
  (12,8) r=5, y a `stroke-width` 1.5.
- Confundir el **cuadro** del icono con el **dibujo**: la `menu` de Lucide mide 16 de ancho
  dentro del cuadro de 24, no 24. El cromo dibujado en CSS —la hamburguesa, el chevron— tiene
  que salir de `icon-size.s` y llevar extremos redondeados, o desentona al lado de los iconos
  Lucide de verdad que entran por el slot.

## Lo que la escala de Figma tiene y los tokens no

`heading/l` (32), `price/l` (24) y `overline/s` (10) existen como estilos de texto en Figma
pero no tienen token. No es una lista cerrada: conviene comparar
`getLocalTextStylesAsync()` contra `typography.tokens.json` antes de dar por hecho que un rol
no existe.

Tampoco hay **escala de capas**: no existe ningún token de `z-index`, y el mega menú se apoya
en un `10` escrito a mano. Lo coherente sería un `z-index.overlay` que acompañe a
`shadow.overlay`, cuyo `$description` ya nombra el grupo —«megamenú, drawer, modal y toast»—.
Está sin resolver.

## Cómo se verifica

```bash
npm run build           # tokens -> CSS/TS/native, y luego styles.css
npm run check:contrast  # el gate de WCAG
npm run verify          # build + contraste + typecheck
```

**`npm ci` NO funciona en la máquina de desarrollo**: el registro público es inalcanzable desde
esa red y el proxy corporativo bloquea `@types/*` y `@storybook/*`. No lo intentes: además de
tardar varios minutos, deja un `node_modules` a medias, sin `.bin`, que hace fallar cualquier
script posterior con `command not found`. `build` y `check:contrast` sí corren en local porque
son node puro y sin dependencias.

**CI es el verificador real** — no reportes el typecheck como pasado sin mirar el run, y
compruébalo por SHA, no por el estado del PR. Pero hay dos cosas que sí se pueden comprobar en
local antes de empujar, y que ya cazaron bugs reales:

**Typecheck**, con el TypeScript que tiene instalado el repo vecino:

```bash
FE=../runmaxshop-frontend/node_modules
# tsconfig en el scratchpad, con "paths" mapeando react y react-dom a $FE/@types,
# "ignoreDeprecations": "6.0", y excluyendo *.stories.tsx y foundations/ (piden Storybook)
$FE/typescript/bin/tsc -p /ruta/al/tsconfig.check.json
```

Cazó que el `PointerEvent` de React tapaba al del DOM y que un `data-*` no entra en un literal
de objeto tipado. Ninguno de los dos se ve leyendo el código.

**Píxeles**, sin Storybook: una página estática con el DOM real del componente y el
`dist/styles.css` compilado, servida con `python3 -m http.server` vía `preview_start`, y medida
con `javascript_tool` contra las medidas de Figma. Comparar números —`getBoundingClientRect`,
`getComputedStyle`— es mucho más fiable que mirar una captura: así salieron los 1200 × 50 de la
barra y los 320 × 240 de la pieza gráfica.

Lo único que no hay forma de verificar en local son los `play` de Storybook.

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
