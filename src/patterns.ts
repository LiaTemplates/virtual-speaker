/**
 * Patterns that DiceBear does not offer, e.g. a checkered shirt. A speaker
 * uses a unique color for a component and maps it onto a pattern:
 *
 * ```js
 * { style: 'avataaars', seed: 'x',
 *   options: { clothing: ['collarAndSweater'], clothesColor: ['010203'] },
 *   patterns: { '010203': 'plaid-blue' } }
 * ```
 *
 * Instead of the name, `{ name: 'plaid-blue', rotate: 45 }` rotates the
 * pattern by the given degrees.
 */
const plaid = (base: string, dark: string, light: string) =>
  `<rect width="28" height="28" fill="${base}"/>` +
  `<rect y="9" width="28" height="10" fill="${dark}" opacity=".55"/>` +
  `<rect x="9" width="10" height="28" fill="${dark}" opacity=".55"/>` +
  `<rect y="22" width="28" height="2" fill="${light}" opacity=".5"/>` +
  `<rect x="22" width="2" height="28" fill="${light}" opacity=".5"/>`

export const PATTERNS: Record<string, { size: number; body: string }> = {
  'plaid-red': { size: 28, body: plaid('#b3262b', '#1d1d35', '#f2e6c9') },
  'plaid-blue': { size: 28, body: plaid('#2f5d9e', '#14213d', '#e8eef7') },
  'plaid-green': { size: 28, body: plaid('#2e6b45', '#1a2a1f', '#e9d8a6') },
}

export type PatternRef = string | { name: string; rotate?: number }

/**
 * Replace all fills with the given colors by patterns.
 */
export function applyPatterns(svg: string, patterns: Record<string, PatternRef>): string {
  let defs = ''

  for (const [color, ref] of Object.entries(patterns)) {
    const { name, rotate = 0 } = typeof ref === 'string' ? { name: ref } : ref
    const pattern = PATTERNS[name]
    if (!pattern) {
      console.warn('VirtualSpeaker: unknown pattern ->', name)
      continue
    }

    const id = `vs-pattern-${name}${rotate ? '-' + rotate : ''}`
    const transform = rotate ? ` patternTransform="rotate(${rotate})"` : ''
    const hex = color.replace(/^#/, '').replace(/[^0-9a-f]/gi, '')
    svg = svg.replace(new RegExp(`fill="#${hex}"`, 'gi'), `fill="url(#${id})"`)
    defs += `<pattern id="${id}" width="${pattern.size}" height="${pattern.size}" patternUnits="userSpaceOnUse"${transform}>${pattern.body}</pattern>`
  }

  return defs ? svg.replace(/(<svg[^>]*>)/, `$1<defs>${defs}</defs>`) : svg
}

export function toDataUri(svg: string): string {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
