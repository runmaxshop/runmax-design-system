# Changelog

Formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), versionado [SemVer](https://semver.org/lang/es/).

## [0.1.0] — 2026-08-15

Primera versión. Extrae el lenguaje visual de la landing del waitlist a una librería propia.

### Añadido

- **`@runmax/tokens`**: 118 tokens en formato DTCG (color, tipografía, espaciado, radios,
  alturas de control, foco, movimiento, elevación y breakpoints), compilados a CSS, TypeScript
  y React Native.
- **`@runmax/react`**: `Button`, `Field`, `Input`, `Chip`, `ChipGroup`, `SegmentedControl`,
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
