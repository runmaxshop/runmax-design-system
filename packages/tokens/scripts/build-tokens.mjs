/**
 * Compilador de tokens: JSON (formato DTCG) -> CSS, TypeScript y React Native.
 *
 * Por qué un script propio y no Style Dictionary: el set de tokens es pequeño y
 * cerrado, y aquí lo que importa es que cualquiera del equipo pueda abrir este
 * fichero y entender en cinco minutos exactamente qué sale de qué. El *formato*
 * de entrada sí es el estándar del W3C (`$value` / `$type`), así que si algún
 * día conviene cambiar a Style Dictionary o conectar Figma Tokens, los JSON de
 * `src/` se pueden consumir tal cual sin reescribirlos.
 *
 * Sin dependencias: una librería de diseño que se rompe porque se movió una
 * dependencia de build es una librería que no se puede mantener.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const SRC = join(HERE, '..', 'src')
const DIST = join(HERE, '..', 'dist')

/** Prefijo de todas las variables CSS. Evita choques con las de la app. */
const PREFIX = 'rmx'

// --- 1. Cargar --------------------------------------------------------------

/** Une todos los *.tokens.json de src/ en un solo árbol. */
function loadTokens() {
  const files = readdirSync(SRC).filter((f) => f.endsWith('.tokens.json')).sort()
  const tree = {}
  for (const file of files) {
    const content = JSON.parse(readFileSync(join(SRC, file), 'utf8'))
    for (const [key, value] of Object.entries(content)) {
      if (key.startsWith('$')) continue // metadatos del fichero, no tokens
      if (tree[key]) throw new Error(`Token duplicado en la raíz: "${key}" (${file})`)
      tree[key] = value
    }
  }
  return tree
}

// --- 2. Aplanar y resolver referencias ---------------------------------------

const isToken = (node) =>
  node && typeof node === 'object' && Object.hasOwn(node, '$value')

/** Recorre el árbol y devuelve [{ path, value, type, description }]. */
function flatten(tree) {
  const out = []
  const walk = (node, path) => {
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) continue
      const next = [...path, key]
      if (isToken(child)) {
        out.push({
          path: next,
          value: child.$value,
          type: child.$type,
          description: child.$description,
        })
      } else if (child && typeof child === 'object') {
        walk(child, next)
      }
    }
  }
  walk(tree, [])
  return out
}

/**
 * Resuelve `{color.neutral.950}` al valor real. Detecta ciclos: un alias que
 * apunta a sí mismo colgaría el build en vez de dar un error legible.
 */
function resolveAliases(tokens) {
  const byPath = new Map(tokens.map((t) => [t.path.join('.'), t]))

  const resolve = (token, seen = new Set()) => {
    if (typeof token.value !== 'string') return token.value
    const match = /^\{([^}]+)\}$/.exec(token.value.trim())
    if (!match) return token.value

    const targetPath = match[1]
    if (seen.has(targetPath)) {
      throw new Error(`Referencia circular de tokens: ${[...seen, targetPath].join(' -> ')}`)
    }
    const target = byPath.get(targetPath)
    if (!target) {
      throw new Error(
        `El token "${token.path.join('.')}" apunta a "{${targetPath}}", que no existe.`,
      )
    }
    return resolve(target, new Set([...seen, targetPath]))
  }

  return tokens.map((token) => ({
    ...token,
    /** El alias original, para poder emitir `var(--otro-token)` en CSS. */
    alias: typeof token.value === 'string' ? /^\{([^}]+)\}$/.exec(token.value.trim())?.[1] : undefined,
    value: resolve(token),
  }))
}

// --- 3. Formatos de salida ---------------------------------------------------

const cssName = (path) => `--${PREFIX}-${path.join('-')}`

/** Los valores compuestos (familias, cubic-bezier) necesitan su propia forma. */
function toCssValue(token) {
  const { value, type } = token
  if (Array.isArray(value)) {
    if (type === 'cubicBezier') return `cubic-bezier(${value.join(', ')})`
    if (type === 'fontFamily') {
      return value.map((f) => (f.includes(' ') ? `'${f}'` : f)).join(', ')
    }
    return value.join(', ')
  }
  return String(value)
}

function buildCss(tokens) {
  const lines = [
    '/**',
    ' * GENERADO AUTOMÁTICAMENTE por scripts/build-tokens.mjs — no editar a mano.',
    ' * La fuente de verdad son los ficheros de packages/tokens/src/*.tokens.json.',
    ' */',
    '',
    ':root {',
  ]

  let lastGroup = null
  for (const token of tokens) {
    const group = token.path[0]
    if (group !== lastGroup) {
      lines.push(`${lastGroup ? '\n' : ''}  /* ${group} */`)
      lastGroup = group
    }
    // Si es un alias, se emite como var() para que el tema siga siendo
    // re-mapeable en runtime: cambiar el primitivo cambia todo lo que cuelga.
    const value = token.alias
      ? `var(${cssName(token.alias.split('.'))})`
      : toCssValue(token)
    lines.push(`  ${cssName(token.path)}: ${value};`)
  }

  lines.push('}', '')
  return lines.join('\n')
}

/** Reconstruye el árbol anidado con los valores ya resueltos. */
function nest(tokens) {
  const root = {}
  for (const token of tokens) {
    let node = root
    for (const key of token.path.slice(0, -1)) {
      node[key] ??= {}
      node = node[key]
    }
    node[token.path.at(-1)] = token.value
  }
  return root
}

function buildTypeScript(tokens) {
  const nested = nest(tokens)
  return `/**
 * GENERADO AUTOMÁTICAMENTE por scripts/build-tokens.mjs — no editar a mano.
 */

export const tokens = ${JSON.stringify(nested, null, 2)} as const

export type Tokens = typeof tokens

/**
 * Nombre de la variable CSS de un token, para interpolarla en estilos:
 *   \`color: var(\${cssVar('text.tertiary')})\`
 */
export function cssVar(path: string): string {
  return '--${PREFIX}-' + path.split('.').join('-')
}

/** Todas las rutas de token válidas, como unión de literales. */
export type TokenPath =
${tokens.map((t) => `  | '${t.path.join('.')}'`).join('\n')}
`
}

/**
 * React Native no entiende ni 'px' ni cubic-bezier ni las sombras de CSS.
 * Las dimensiones salen como número y las familias como string suelto, que es
 * lo que espera StyleSheet. Lo que no tiene equivalente se omite a propósito en
 * vez de emitir algo que reventaría en runtime.
 */
function buildNative(tokens) {
  const usable = tokens.filter((t) => {
    if (t.type === 'shadow' || t.type === 'cubicBezier') return false
    if (t.type === 'dimension' && String(t.value).endsWith('%')) return false
    return true
  })

  const converted = usable.map((token) => {
    let value = token.value
    if (token.type === 'dimension') value = parseFloat(String(value))
    if (token.type === 'duration') value = parseFloat(String(value))
    if (token.type === 'fontFamily') value = Array.isArray(value) ? value[0] : value
    return { ...token, value }
  })

  const skipped = tokens.length - usable.length
  return `/**
 * GENERADO AUTOMÁTICAMENTE por scripts/build-tokens.mjs — no editar a mano.
 *
 * Tokens para React Native: dimensiones y duraciones como número, familias
 * tipográficas como string. Se omiten ${skipped} tokens sin equivalente nativo
 * (sombras CSS, curvas de bezier y porcentajes).
 */

export const tokens = ${JSON.stringify(nest(converted), null, 2)} as const

export type Tokens = typeof tokens
`
}

// --- 4. Ejecutar -------------------------------------------------------------

const tokens = resolveAliases(flatten(loadTokens()))

mkdirSync(DIST, { recursive: true })
writeFileSync(join(DIST, 'tokens.css'), buildCss(tokens))
writeFileSync(join(DIST, 'index.ts'), buildTypeScript(tokens))
writeFileSync(join(DIST, 'native.ts'), buildNative(tokens))
writeFileSync(
  join(DIST, 'tokens.json'),
  JSON.stringify(
    Object.fromEntries(tokens.map((t) => [t.path.join('.'), t.value])),
    null,
    2,
  ) + '\n',
)

console.log(`✓ ${tokens.length} tokens -> tokens.css, index.ts, native.ts, tokens.json`)
