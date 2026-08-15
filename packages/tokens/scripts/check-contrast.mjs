/**
 * Verificador de contraste WCAG 2.1.
 *
 * Lee los pares declarados en src/contrast.config.json contra los tokens ya
 * resueltos y falla si alguno no llega a su mínimo. Corre en CI, así que un
 * cambio de color que rompa la legibilidad no puede llegar a producción sin
 * que alguien lo vea primero.
 *
 * Fórmula: WCAG 2.1, luminancia relativa (§ definiciones) y ratio de contraste.
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const tokens = JSON.parse(readFileSync(join(HERE, '..', 'dist', 'tokens.json'), 'utf8'))
const config = JSON.parse(readFileSync(join(HERE, '..', 'src', 'contrast.config.json'), 'utf8'))

/** '#AABBCC' | '#ABC' -> [r, g, b] en 0..255 */
function parseHex(hex) {
  const clean = hex.trim().replace('#', '')
  const full = clean.length === 3 ? [...clean].map((c) => c + c).join('') : clean
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`No es un color hexadecimal válido: "${hex}"`)
  }
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}

/** Luminancia relativa según WCAG. */
function luminance(hex) {
  const [r, g, b] = parseHex(hex).map((channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

let failures = 0
const rows = []

for (const pair of config.pairs) {
  const fg = tokens[pair.text]
  const bg = tokens[pair.background]

  if (!fg || !bg) {
    console.error(`✗ Par con token inexistente: ${pair.text} sobre ${pair.background}`)
    failures++
    continue
  }

  const ratio = contrastRatio(fg, bg)
  const ok = ratio >= pair.min
  if (!ok) failures++

  rows.push({
    ok,
    label: `${pair.text} sobre ${pair.background}`,
    ratio: ratio.toFixed(2),
    min: pair.min.toFixed(1),
    colors: `${fg} / ${bg}`,
  })
}

const width = Math.max(...rows.map((r) => r.label.length))
for (const row of rows) {
  const mark = row.ok ? '✓' : '✗'
  console.log(
    `${mark} ${row.label.padEnd(width)}  ${row.ratio.padStart(6)}:1  (mín ${row.min})  ${row.colors}`,
  )
}

console.log()
if (failures > 0) {
  console.error(`${failures} de ${config.pairs.length} pares no cumplen el contraste mínimo.`)
  process.exit(1)
}
console.log(`✓ Los ${config.pairs.length} pares cumplen WCAG 2.1.`)
