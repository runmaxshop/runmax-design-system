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

Checklist antes de darlo por hecho:

- [ ] Todos los valores de CSS salen de `var(--rmx-*)`. Cero literales.
- [ ] Tiene estado de foco visible (`:focus-visible`) con el token de foco.
- [ ] Si es interactivo, empieza con `'use client'` — la app anfitriona es Next.
- [ ] Si tiene transiciones, las apaga bajo `@media (prefers-reduced-motion: reduce)`.
- [ ] Los estados se exponen con atributos ARIA reales (`aria-pressed`, `aria-expanded`),
      no con clases CSS.
- [ ] Tiene historia con controles, y la pestaña **Accessibility** de Storybook sale limpia.
- [ ] Las props llevan comentario cuando la elección no es evidente: esos comentarios
      **son** la documentación que se publica.
- [ ] `npm run verify` pasa.

## Preferir lo nativo

`SegmentedControl` usa `<input type="radio">` de verdad con un `<span>` encima, y no
`<div role="radio">`. El elemento nativo ya trae navegación con flechas, agrupado por `name` y
soporte de lectores de pantalla; reimplementar eso a mano casi siempre sale peor. Cuando exista
un elemento HTML para lo que necesitas, empieza por ahí.

## Versionado

[SemVer](https://semver.org/lang/es/). Cambiar el valor de un token que altera cómo se ve algo
en producción es un cambio *minor* como mínimo; quitar o renombrar un token o una prop es
*major*. Todo cambio va al [CHANGELOG.md](CHANGELOG.md).
