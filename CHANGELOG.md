# Changelog

Formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), versionado [SemVer](https://semver.org/lang/es/).

## [0.7.0] — 2026-08-19

Nuevo componente: `Navbar`, la navegación del sitio. Es el primer componente **T**
(transformacional) de la librería.

### Añadido

- **`Navbar`.** Barra con logo, navegación y acciones, y mega menú desplegable en los ítems que
  traen `columns`. Reúne en un solo componente los dos *component sets* de Figma —`Navbar`
  (`Type=Default` / `Type=Active`) y `MegaMenu` (`Columns=3` / `Columns=4`)—.
- **El número de columnas no es una prop:** sale de `columns.length`. Las dos variantes de Figma
  son el mismo código y una tercera de 5 columnas no necesitaría tocar nada.
- **`renderLink`,** la escotilla para el enrutador de la aplicación. Por defecto son `<a>`; en
  Next se pasa `({ href, ...rest }) => <Link href={href} {...rest} />`. La librería no importa
  `next/link` porque no sabe en qué framework vive.
- **`brand`, `actions` y `promo` son slots.** Igual que los iconos de `IconButton`: la librería
  no empaqueta assets de marca ni sabe cuántos productos hay en el carrito.
- **Token `font.size.heading-xs` (16px) y su `line-height` (1.25).** Es el estilo `heading/xs`
  de Figma, que la escala no tenía: el encabezado de columna del mega menú. Coincide en medida
  con `label-l` y `body-l`, y eso es justo lo que la escala por rol permite.

### Notas

- **Es un componente T y el DOM es el mismo en los dos estados.** Por encima de `md` es una
  barra horizontal con paneles que caen; por debajo, un cajón desde la hamburguesa donde cada
  mega menú se pliega en acordeón. Solo cambia el CSS: duplicar la navegación en dos árboles
  (`hidden md:block` junto a `md:hidden`) haría que un lector de pantalla anunciara los enlaces
  dos veces y duplicaría el mapa del sitio para el buscador.
- **El cajón va en flujo, no flotando.** Empuja el contenido de la página en vez de taparlo. Un
  cajón absoluto más alto que la pantalla se sale por abajo sin forma de llegar a lo último, y
  obliga a inventar un `max-height` en unidades de viewport que ningún token tiene.
- **Abierto ≠ sección actual.** El subrayado del ítem dice «este menú está desplegado»
  (`aria-expanded`) y desaparece al cerrarlo; `currentHref` marca dónde estás
  (`aria-current="page"`) y se dibuja con peso, no con subrayado. Los dos pueden coincidir en el
  mismo ítem, así que tienen que poder distinguirse.
- **El encabezado de columna no es un `<h2>`.** El navbar aparece en todas las páginas del
  sitio, y meter cuatro encabezados de sección en cada una destroza el esquema del documento.
  Va como `<p>` y da nombre a su lista con `aria-labelledby`.
- **El panel cerrado lleva `hidden`, no `opacity: 0`.** Sale del orden de tabulación y del árbol
  de accesibilidad de verdad. Un panel escondido con opacidad sigue siendo tabulable, y ese es
  el fallo clásico del mega menú.
- **El cajón no es un diálogo modal.** No atrapa el foco ni bloquea el scroll: es una
  divulgación (`aria-expanded` + `aria-controls`) porque es el mismo nodo que la navegación de
  escritorio. Escape cierra de dentro hacia fuera —primero el panel, luego el cajón— y devuelve
  el foco a lo que abrió cada cosa.
- **El mega menú abre con hover y también con clic.** Las dos cosas, porque el hover es lo que
  espera quien viene con ratón y el clic es lo único que existe en táctil y con teclado. El
  hover se filtra por `pointerType === 'mouse'` y no por una media query de ancho: lo que
  decide no es el tamaño de la pantalla sino si hay un puntero de verdad. En táctil el
  navegador emula un `pointerenter` justo antes del `click`, y sin ese filtro el primer toque
  abriría el panel y el clic lo cerraría acto seguido.
- **Cierra al salir de la barra entera, no del ítem, y no hace falta retardo.** El panel cuelga
  del `<li>` y arranca justo donde acaba la barra, así que bajar el ratón hacia los enlaces
  nunca lo atraviesa. Si el foco está dentro del panel, el ratón no lo cierra: dejaría el foco
  en un nodo recién desaparecido.
- **El ancho y el `position: sticky` los pone la página.** El componente ocupa el 100% de su
  contenedor: en Figma la barra son 1200 dentro de 1280, y esos 40 de margen son layout de
  página, no del componente.

## [0.5.0] — 2026-08-18

Las dos cosas salieron de probar el componente en Storybook, no de leerlo.

### Cambiado — roturas

- **`Field` pasa a llamarse `TextField`.** Con él, el tipo `FieldProps` → `TextFieldProps`, las
  clases `rmx-field*` → `rmx-textfield*` y la ruta del módulo. `Input` no cambia. Los ficheros
  se movieron con `git mv`, así que el historial de cada uno sigue entero. En Figma la capa
  interna del componente se renombró igual, para que las dos partes se llamen lo mismo.
- **`border.hover` pasa de `neutral.600` (#6B6660) a `neutral.500` (#918C84).** A 1px, el
  #6B6660 y el negro del foco se leían idénticos: el hover no informaba de nada. Ahora es un
  gris claramente por debajo del negro.
- **Ese cambio tiene un costo declarado.** `neutral.500` da 3.17:1 sobre el relleno del campo y
  3.34:1 sobre blanco —los dos por encima del 3:1 de WCAG 1.4.11—, pero **2.88:1 sobre el fondo
  de página**, que no llega. El par contra `bg.page` se retira de `contrast.config.json` y pasa
  a `$known-gaps`. Se prefirió que hover y foco se distingan a ganar los 0.12 que faltaban:
  un hover indistinguible del foco no informa de nada, por mucho contraste que tenga.

## [0.4.1] — 2026-08-18

### Cambiado

- **El campo enfocado deja de dibujar el anillo de foco.** El foco es ahora el borde negro y
  nada más, que es lo que muestra Figma. El anillo tenía sentido cuando el borde en reposo era
  transparente —el foco era «aparece un borde»—; desde 0.4.0 el borde se ve en reposo, así que
  el foco pasó a ser un cambio de color y el anillo encima se leía como un segundo contorno.
- **Es una decisión consciente con un costo, anotado en `$known-gaps`.** El contraste entre
  enfocado y reposo sobra (#D5D2CB → #000000), pero WCAG 2.2 (2.4.11, *Focus Appearance*) pide
  además que el indicador ocupe al menos el equivalente a un perímetro de 2px, y 1px no llega.
- **El `Button` conserva su anillo**, porque ahí es el único indicador de foco que existe.
- En modo de colores forzados el anillo del campo vuelve: ahí el sistema pisa todos los colores,
  el negro del foco pasa a ser el mismo que el del reposo y el borde dejaría de señalar nada.

## [0.4.0] — 2026-08-18

Le toca al `Input`, y con el mismo criterio que al `Button`: primero se construyó el
componente en Figma —que no existía— y después se trajo el código a lo que dice el archivo.

### Añadido

- **`border.hover` (`neutral.600`, #6B6660)**, el escalón que faltaba. En reposo el campo lleva
  `border.default`, que da 1.43:1 sobre su relleno y apenas se insinúa; el foco es negro. Sin
  nada en medio, el hover no tenía dónde caer. Este da **5.40:1** sobre el relleno y **4.90:1**
  sobre el fondo de página, los dos por encima del 3:1 que pide WCAG 1.4.11. `neutral.500`
  —más parecido al gris de la referencia— se descartó por 2.88:1 sobre el fondo de página.
- **`bg.disabled` (`neutral.200`)**, relleno de control inactivo. Comparte valor con
  `bg.field-hover` y `border.subtle`: tres roles distintos que hoy caen en el mismo gris.
- **Estado hover y estado deshabilitado en el campo**, que no existían.
- **El botón `secondary` recupera un contorno al hacer hover.** Desde que se le quitó el borde
  en 0.3.0, su único hover era pasar de blanco a `bg.subtle`: 1.03:1, imperceptible, y encima
  era la única señal de que el botón era interactivo. Ahora el borde aparece en hover con
  `border.hover` —5.68:1 sobre blanco—. En reposo sigue sin contorno, que es como se pidió, y
  no hay salto de layout porque la clase base ya reservaba 1px transparente.
- Los dos pares de `border.hover` entran en `contrast.config.json`. Son 29 pares verificados.

### Cambiado — roturas

- **El campo mide 48, no 40.** Pasa de `control.height.m` a `control.height.l`. El motivo es
  que un campo de texto necesita más aire que un botón, y es el alto con el que está dibujado.
- **Esquina viva**: `radius.none` en vez de `radius.m`. La esquina viva es el carácter del
  sistema y es lo que pide el archivo de diseño.
- **En reposo el borde se ve.** Antes era `1px solid transparent`; ahora es `border.default`.
- **El botón que alinea con un campo pasa de `m` a `l`.** Es consecuencia directa de lo
  anterior, y corrige lo que decía la documentación de `Button` en 0.3.0: mientras el campo
  midió 40, el que alineaba era `m`.

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
