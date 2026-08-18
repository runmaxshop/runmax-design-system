# Integrar la librería en el frontend de RunMax

## 1. Configurar Next para transpilar el paquete

`@runmaxshop/react` se distribuye como TypeScript sin compilar, así que Next tiene que
transpilarlo. En `next.config.ts`:

```ts
const nextConfig = {
  transpilePackages: ['@runmaxshop/react', '@runmaxshop/tokens'],
}
```

Es a propósito: evita un paso de build intermedio y hace que el "ir a definición" desde la app
caiga en el código real de la librería, no en un `.d.ts` generado.

## 2. Cargar los estilos y las fuentes

En `src/app/layout.tsx`:

```tsx
import { Barlow, Barlow_Condensed } from 'next/font/google'
import '@runmaxshop/react/styles.css'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow-condensed',
})
```

La librería declara las familias en sus tokens pero **no importa las fuentes**: eso es cosa de
la app, que es quien sabe qué pesos necesita y cómo servirlas sin salto de layout.

`styles.css` trae los tokens dentro, así que con ese único import ya están disponibles las
variables `--rmx-*` en toda la app.

## 3. Usarla

```tsx
import { Button, TextField, Input, Chip, ChipGroup } from '@runmaxshop/react'
```

## 4. Convivencia con lo que ya existe

La librería **no pisa nada**. Todas sus clases van con prefijo `rmx-` y no hay reset global
(ver `src/styles/base.css`). Los componentes de `src/presentation/components/ui/` y el
`waitlist.css` siguen funcionando exactamente igual mientras se migran.

La migración recomendada es por pantallas, no de golpe: cada vez que se toque una, se
sustituyen sus componentes por los de la librería y se borran las clases equivalentes del CSS
viejo. Así ninguna sesión de trabajo deja la app a medio migrar.

---

## Decisión pendiente: cómo llega el paquete a producción

**Esto está sin resolver y hay que resolverlo antes de usar la librería en una pantalla que
se despliegue.**

Durante el desarrollo local se puede enlazar el paquete con una ruta de fichero:

```jsonc
// package.json del frontend — SOLO desarrollo local
"@runmaxshop/react": "file:../runmax-design-system/packages/react"
```

Pero **eso rompe el build en Vercel**: Vercel solo clona el repo del frontend, y la ruta
`../runmax-design-system` no existe en su máquina. No hay que commitear esa línea sin haber
resuelto antes lo de abajo.

Las tres opciones reales, de más a menos recomendable:

### A. Publicar en GitHub Packages (recomendado)

Registro privado de npm, incluido en el plan de GitHub que ya se usa para los repos.

- **A favor**: es el mecanismo estándar; versionado con SemVer de verdad; la app fija qué
  versión consume, así que un cambio en la librería no puede romper producción sin que alguien
  suba la versión a propósito.
- **Requiere**: un `NPM_TOKEN` (un Personal Access Token de GitHub con permiso
  `read:packages`) como variable de entorno en Vercel, y un `.npmrc` en el frontend. El token
  es un secreto: va en el panel de Vercel, nunca en el repo.
- **Trabajo**: un workflow de publicación en el repo de la librería y el `.npmrc` en el
  frontend. Un rato.

### B. Dependencia de git

```jsonc
"@runmaxshop/react": "github:runmaxshop/runmax-design-system"
```

- **A favor**: no hace falta registro ni token nuevo si Vercel ya tiene acceso al repo.
- **En contra**: npm **no sabe instalar desde una subcarpeta** de un repo. Habría que aplanar
  este monorepo a un único paquete, y se pierde poder versionar los tokens por separado — que
  es justo lo que la app móvil va a querer consumir sola.

### C. Copiar la carpeta al frontend

- **A favor**: funciona hoy sin tocar nada.
- **En contra**: deja de haber una fuente única de verdad, que es el problema que este
  repositorio viene a resolver. No se recomienda ni como paso intermedio.

**Recomendación: la A.** La B solo si se descarta que móvil consuma los tokens por separado.
