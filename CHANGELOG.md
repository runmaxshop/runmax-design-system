# Changelog

Formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), versionado [SemVer](https://semver.org/lang/es/).

## [0.3.0] — 2026-08-17

`Button` pasa a decir lo mismo que Figma, y la escala de alturas de control queda escrita como
regla en los dos lados. El disparador fue un choque real: el componente de Figma estaba
construido por padding y daba 32 · 42 · 52, mientras `control.height` decía 32 · 40 · 48. Los
dos declaraban venir de las mesas. Se resolvió a favor de la escala —es la que hace que un
botón `m` alinee con un input, que también mide 40— y **se corrigió el archivo de Figma**, no
el token.

### Añadido

- **`control/height/s|m|l` existe ahora también como variable de Figma**, en la colección
  `3 · Scale`, junto a `space/*` y `radius/*`. Las 18 variantes de `Button` tienen el alto
  atado a ella: el número dejó de estar suelto en el archivo de diseño.
- **`font.size.label-s` (12px) y `font.size.label-l` (16px)**, con sus interlineados
  (1.33 y 1.25). La rampa de label tenía un solo escalón y el botón necesitaba los tres.
- **Variante `secondary`**: solo relleno blanco, sin contorno. Estaba dibujada en Figma y no
  existía en código. Se apoya en su relleno igual que el input, así que **no va sobre
  `bg.surface`**: blanco sobre blanco no se distingue. Sobre `bg.page` da 1.16:1, por debajo
  del 3:1 que pide WCAG 1.4.11 para el contorno de un control — queda anotado en
  `$known-gaps`.

### Cambiado — roturas

- **`Button` renombra sus tres props para que se lean igual que el archivo de diseño.**
  `variant`: `inverse` → `primary`, y entra `secondary`. `size`: `sm|md|lg` → `s|m|l`, los
  nombres de `control.height`. `shape`: `rounded` → `rect`.
- **Se van las variantes `brand` y `subtle`.** `brand` era un botón lima, justo lo que el
  sistema dice no hacer: la acción es negra y el lima es acento. Ninguna de las dos está
  dibujada en Figma.
- **El defecto de `shape` pasa de `pill` a `rect`**, y el de `size` de `md` a `m` (mismo alto).
  La esquina viva es el carácter del sistema y es el defecto del componente de Figma; `pill`
  queda para lo que va sobre foto. El botón del waitlist ahora pasa `shape="pill"` explícito.
- **El alto del botón deja de derivarse del padding.** Sale de `control.height` y el padding
  vertical es 0; centra el flexbox. En Figma se hizo el mismo cambio.

## [0.2.0] — 2026-08-17

Los tokens pasan a salir de Figma. Los valores de 0.1.0 se habían extraído del CSS de la
landing del waitlist —era lo único escrito que había— y esta versión los reemplaza por los de
una auditoría de las mesas **Componentes site** y **Principales** (306 nodos). A partir de
ahora el sentido del flujo es Figma → JSON → CSS, no al revés.

Es una versión con roturas. Está en pre-1.0 y solo `Button` corre en producción, así que se
prefiere renombrar bien ahora a arrastrar dos vocabularios.

### Cambiado — roturas

- **El lima deja de ser la acción.** En las mesas el botón primario es negro y el lima es un
  acento de destaque. No es un cambio de valor sino de rol: los semánticos pasan a llamarse
  `bg.highlight` y `text.accent`, y no existe ningún token de marca llamado `primary`.
- **El lima de marca es `#B8CE00`**, no `#AAFF00`. Es el valor de las mesas y el que ya corría
  en la landing de producción.
- **Los semánticos de superficie se renombran `surface.*` → `bg.*`**, con los nombres de la
  colección Semantic de Figma: `bg.page`, `bg.surface`, `bg.subtle`, `bg.inverse`,
  `bg.highlight`. Que el código y Figma usen el mismo nombre es lo que evita mantener una
  tabla de traducción entre los dos.
- **Los roles de texto se reducen de siete a los tres reales.** `text.default`, `text.strong` y
  `text.deep` eran el mismo rol en tres luminancias: pasan a `text.primary`. `text.subtle` →
  `text.secondary`, `text.muted` → `text.tertiary`, `text.on-inverse` → `text.inverse`.
- **`bg.page` es `#EFEEEC`, no blanco.** El fondo de página es un off-white cálido; el blanco
  queda para lo que se levanta sobre él (cards, navbar, modales).
- **La escala tipográfica pasa a ser por rol.** `font.size.14` → `font.size.body-m`, y cada rol
  trae su interlineado (`font.line-height.body-m`). Con ello cambian las props de `Heading` y
  `Text`: `size="30"` → `size="display-m"`, `size="13"` → `size="body-s"`, y los tonos siguen
  a los nuevos nombres. El `weight` de `Text` ya no tiene valor por defecto: manda el del rol.
- **La escala de espaciado pasa a base 4.** Desaparecen 10, 14, 18, 22 y 26 — el 10 tenía 41
  usos y va a 8 o 12 según el caso. Con 16 pasos tan juntos, «cero valores mágicos» se cumplía
  solo de nombre: siempre había un token a 2px del que querías.
- **Los radios pasan de 6 valores a 5 tokens**: `none`, `xs` 2, `s` 4, `m` 8, `full`. El 20, el
  40 y el 75 colapsan en `full` porque siempre se aplicaban a elementos completamente
  redondeados. `Card` pasa a esquina viva: las mesas son mayoritariamente de radio 0 y eso es
  carácter, no descuido.
- **Las alturas de control pasan a 32 · 40 · 48** (antes 44 · 52 · 56), los tres tamaños de
  botón de las mesas. Ojo: el tamaño `s` cumple WCAG 2.5.8 (AA, 24×24) pero **no** 2.5.5
  (AAA, 44×44). Es una decisión consciente y está anotada en el token.
- **`elevation.*` → `shadow.none` y `shadow.overlay`.** No hay una sola sombra en las mesas: la
  separación se hace con borde y superficie. La única excepción es lo que flota de verdad
  (megamenú, drawer, modal, toast).

### Añadido

- `text.accent`, `bg.highlight`, `bg.highlight-hover`, `border.focus-inverse`, `scrim.solid`,
  `text.disabled`, `text.success`, `text.warning` y los roles `label-m`, `price-m` y
  `overline-m` de la escala tipográfica.
- Tono `inverse` en `Badge`.
- El verificador de contraste pasa de 16 a **27 pares**, e incorpora los indicadores de foco
  con el mínimo de 3:1 de WCAG 1.4.11, que antes no se comprobaban.

### Corregido

- **El placeholder no puede ser `neutral/500`.** La auditoría le asignaba ese valor a ese rol,
  pero sobre el relleno del campo da 3.17:1 y el placeholder es texto: pasa a `neutral/600`,
  que da 5.40:1.
- **El anillo de foco no puede ser lima.** Sobre el fondo de página daría 1.5:1 y WCAG 1.4.11
  pide 3:1 para un indicador de foco. Sobre claro es negro (18.11:1); el lima queda para el
  foco sobre oscuro (`border.focus-inverse`, 14.62:1).
- **`success` y `warning` no llegaban a AA sobre el fondo de página** (4.33:1 los dos). Se
  oscurecen a `#126B33` y `#9A4708`. Siguen siendo provisionales: no hay ningún nodo de estado
  dibujado en las mesas.

### Pendiente

- `docs/presentacion.html` es la presentación del 2026-08-15 y describe el sistema anterior
  (`#AAFF00`, `surface.*`, los 16 pares). Se deja como está por ser el registro de esa charla;
  si va a seguir enlazada desde el README, hay que rehacerla.
- Las variantes de `Button` siguen siendo `inverse · brand · subtle · ghost`. La taxonomía de
  las mesas es `primary · secondary · ghost` con `shape` y `width`, y los 18 componentes del
  catálogo de Figma todavía no existen aquí. Va en la siguiente.
- `package.json` declara `UNLICENSED` en un paquete que se publica público.

## [0.1.0] — 2026-08-15

Primera versión. Extrae el lenguaje visual de la landing del waitlist a una librería propia.

### Añadido

- **`@runmaxshop/tokens`**: 118 tokens en formato DTCG (color, tipografía, espaciado, radios,
  alturas de control, foco, movimiento, elevación y breakpoints), compilados a CSS, TypeScript
  y React Native.
- **`@runmaxshop/react`**: `Button`, `Field`, `Input`, `Chip`, `ChipGroup`, `SegmentedControl`,
  `Accordion`, `Card`, `Badge`, `Heading`, `Text` y `VisuallyHidden`.
- Verificador de contraste WCAG 2.1 sobre 16 pares declarados de texto/fondo, integrado en CI.
- Documentación interactiva en Storybook con auditoría de accesibilidad por historia.

### Decidido

- **El verde de RunMax es `#AAFF00`.** Convivían cuatro en el repo del frontend: `#AAFF00`
  (38 archivos), `#88CC00` (22, usado como hover), `#C5E500` (6, el que declaraba `CLAUDE.md`)
  y `#B8CE00` (1, el de la landing en producción). Se elige `#AAFF00` por ser el más extendido
  y el del material de marca original; `#88CC00` se conserva como `lime.600` para el hover.
- **Los componentes no se comparten con móvil; los tokens sí.** Se descartó React Native Web
  y Tamagui: habrían obligado a reescribir la web actual con peor resultado para ganar una
  reutilización que los tokens ya dan donde importa.
- **Se abandona la migración a Astryx** que planteaba el `CLAUDE.md` del frontend.

### Cambios respecto a lo que hay hoy en producción

Ninguno es accidental. Al portar los componentes se normalizaron tres cosas:

- Los botones medían 57px (hero) y 56px (bloque). Ahora ambos son **56px**: la diferencia de
  1px no era una decisión de diseño.
- El texto del chip sin seleccionar pasa de `#4a4841` a `text.subtle`, que es ese mismo valor.
  Sin cambio visual; ahora tiene nombre.
- El placeholder pasa de `#6e6c64` a `text.placeholder`, mismo valor, ahora con su contraste
  (4.69:1) verificado automáticamente en cada build.
