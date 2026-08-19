# Sistema de diseño de RunMax

Fuente única de verdad del color, la tipografía, el espaciado y los componentes de RunMax.
Hoy alimenta la web; está construido para alimentar también la app móvil sin duplicar la marca.

```
packages/
  tokens/   @runmaxshop/tokens   Las decisiones de diseño en JSON neutro (formato DTCG del W3C).
                             Se compilan a CSS, TypeScript y React Native.
  react/    @runmaxshop/react    Los componentes de web. Consumen los tokens y nada más.
```

## Por qué existe

Una auditoría del repo del frontend encontró **113 colores hexadecimales escritos a mano** y
cuatro verdes de marca compitiendo. Ninguno estaba mal a propósito: no había un sitio donde
mirar.

Ese sitio es Figma. Los valores de este repositorio salen de una auditoría de las mesas
**Componentes site** y **Principales** (306 nodos), y el flujo va en un solo sentido: si un
token tiene que cambiar, cambia primero en Figma.

**El lima de marca es `#B8CE00`** — y no es la acción. En las mesas el botón primario es
negro y el lima es un acento de destaque, así que el token se llama `bg.highlight` y
`text.accent`, nunca `primary`. La regla que lo protege: **el lima no es color de texto sobre
claro** (1.8:1 sobre blanco). Es superficie, o tinta sobre oscuro.

> ¿Primera vez que ves este repo? [`docs/presentacion.html`](docs/presentacion.html) lo cuenta
> entero en 18 diapositivas: arquitectura, cómo se crea un componente, cómo se publica y quién
> tiene acceso a qué. Se abre en el navegador, sin instalar nada.

## Arranque rápido

```bash
npm install
npm run storybook      # documentación interactiva en http://localhost:6006
```

Otros comandos:

| Comando | Qué hace |
| --- | --- |
| `npm run build` | Compila los tokens y la hoja de estilos. |
| `npm run check:contrast` | Verifica todos los pares texto/fondo contra WCAG 2.1. |
| `npm run typecheck` | TypeScript en modo estricto sobre la librería. |
| `npm run verify` | Los tres anteriores. Es lo que corre en CI. |
| `npm run build:storybook` | Genera la documentación estática en `packages/react/storybook-static`. |

## La arquitectura, y por qué es así

### Los tokens no saben qué es la web

`packages/tokens/src/*.tokens.json` son ficheros neutros: no mencionan CSS, ni React, ni
píxeles de navegador. Un script (`scripts/build-tokens.mjs`) los compila a tres formatos:

| Salida | Para qué |
| --- | --- |
| `dist/tokens.css` | Variables CSS (`--rmx-bg-highlight`) que consumen los componentes web. |
| `dist/index.ts` | Objeto de TypeScript tipado, para interpolar valores en código. |
| `dist/native.ts` | La versión de React Native: dimensiones como número, sin sombras CSS. |

**Esa separación es la que hace posible la app móvil.** Cuando llegue, importará
`@runmaxshop/tokens/native` y pintará sus propios componentes nativos. El verde, los radios y los
tamaños serán idénticos a los de la web porque salen del mismo fichero. Lo que no se comparte
es el HTML, que en móvil no existe — y forzar componentes universales para compartirlo
habría obligado a reescribir la web entera con peor resultado.

El formato de entrada es el estándar [DTCG](https://tr.designtokens.org/) del W3C, así que
esos JSON los puede consumir Style Dictionary o Figma Tokens tal cual, sin reescribirlos, si
algún día conviene.

### Primitivos y semánticos

```jsonc
// primitivo: dice CÓMO es
"color.lime.500": "#B8CE00"

// semántico: dice PARA QUÉ sirve
"bg.highlight": "{color.lime.100}"
```

Los componentes usan **solo semánticos**. Los alias se compilan a `var()` encadenados, así que
re-mapear un semántico cambia todo lo que cuelga de él sin tocar un solo componente. Es lo que
permitirá añadir un tema oscuro más adelante.

### El contraste es una prueba, no una intención

`packages/tokens/src/contrast.config.json` declara los pares de texto y fondo que la librería
promete legibles. `npm run check:contrast` los calcula con la fórmula de WCAG 2.1 y **falla el
build** si alguno baja del mínimo.

Existe porque el CSS del waitlist ya arrastraba correcciones hechas a mano — un placeholder que
estaba en 2.28:1, una nota en 4.06:1. La única forma de que eso no vuelva a colarse es que lo
revise una máquina en cada cambio. Hoy pasan los 27 pares.

Además, cada historia de Storybook se audita con axe-core en el navegador
(addon `@storybook/addon-a11y`), así que los fallos se ven mientras se diseña.

### Cero dependencias de runtime

`@runmaxshop/react` no arrastra ninguna dependencia a quien lo instale. El helper `cn` son seis
líneas en vez de `clsx`, y los estilos son CSS plano con variables en vez de una librería de
CSS-en-JS. Una librería de diseño que rompe la app por una dependencia transitiva es una
librería que nadie quiere mantener.

## Usarla desde una app

```tsx
// una sola vez, en el layout raíz
import '@runmaxshop/react/styles.css'

// donde haga falta
import { Button, Field, Input } from '@runmaxshop/react'

<Field label="Tu correo">
  {({ id, describedBy, invalid }) => (
    <Input id={id} aria-describedby={describedBy} invalid={invalid} type="email" />
  )}
</Field>
<Button size="lg" fullWidth>Quiero mi acceso anticipado</Button>
```

Las fuentes (Barlow y Barlow Condensed) **las carga la app**, no la librería: es la app la que
sabe qué pesos necesita y cómo evitar el salto de layout. En Next se hace con `next/font`.

Ver [`docs/integracion-nextjs.md`](docs/integracion-nextjs.md) para el paso a paso completo,
incluida la decisión pendiente sobre cómo se distribuye el paquete a producción.

## Componentes disponibles (v0.7.0)

| Componente | Notas |
| --- | --- |
| `Button` | 4 variantes, 3 tamaños. `sm` son 44px, el área táctil mínima de WCAG. |
| `Field` + `Input` | Cablea `htmlFor`, `aria-describedby` y `aria-invalid` por ti. |
| `Chip` + `ChipGroup` | Botón de dos estados vía `aria-pressed`. |
| `SegmentedControl` | Radios nativos por debajo: navegación con flechas gratis. |
| `Accordion` | Encabezados reales y `aria-controls`. Modo simple o múltiple. |
| `Card` | Superficie contenedora. |
| `Badge` | Etiqueta de estado. |
| `IconButton` | Botón circular de solo icono. `label` es obligatoria; los iconos los trae quien lo usa. |
| `Navbar` | Navegación con mega menú. Componente **T**: barra en escritorio, cajón en móvil. |
| `Heading` / `Text` | Nivel semántico y tamaño visual como props separadas. |
| `VisuallyHidden` | Contenido solo para lectores de pantalla. |

Todos salen de componentes que ya existían en la landing del waitlist. La historia
**Fundamentos → Ejemplo · Formulario del waitlist** reconstruye el formulario de producción
usando solo la librería: si una pantalla real no se puede armar desde aquí, la librería
está incompleta.

## Cómo se contribuye

Ver [CONTRIBUTING.md](CONTRIBUTING.md).
