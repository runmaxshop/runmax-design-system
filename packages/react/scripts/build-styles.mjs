/**
 * Empaqueta el CSS de la librería en un único `dist/styles.css`.
 *
 * Concatenar en vez de dejar `@import` sueltos: un solo fichero es una sola
 * petición, y evita que el orden de los imports dependa del bundler de quien
 * nos instale. El primero de la lista son los tokens, porque todo lo demás los
 * usa vía `var()`.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const SRC = join(HERE, '..', 'src')
const DIST = join(HERE, '..', 'dist')
const TOKENS_CSS = join(HERE, '..', '..', 'tokens', 'dist', 'tokens.css')

if (!existsSync(TOKENS_CSS)) {
  console.error('Faltan los tokens compilados. Ejecuta antes: npm run build -w @runmaxshop/tokens')
  process.exit(1)
}

const parts = [
  '/**\n * @runmaxshop/react — hoja de estilos completa.\n * GENERADO por scripts/build-styles.mjs — no editar a mano.\n */\n',
  readFileSync(TOKENS_CSS, 'utf8'),
  readFileSync(join(SRC, 'styles', 'base.css'), 'utf8'),
]

// Los componentes van en orden alfabético: es arbitrario, pero es estable, y un
// orden estable hace que el diff del fichero generado sea legible.
const componentsDir = join(SRC, 'components')
const components = readdirSync(componentsDir).sort()

for (const name of components) {
  const cssPath = join(componentsDir, name, `${name}.css`)
  if (existsSync(cssPath)) parts.push(readFileSync(cssPath, 'utf8'))
}

mkdirSync(DIST, { recursive: true })
writeFileSync(join(DIST, 'styles.css'), parts.join('\n'))

console.log(`✓ styles.css (tokens + base + ${components.length} componentes)`)
