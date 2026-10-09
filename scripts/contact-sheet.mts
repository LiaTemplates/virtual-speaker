/**
 * Renders all mouth and eye variants of every DiceBear style into
 * `contact-sheet.html`, used to maintain the mapping in `src/faces.ts`.
 *
 *     npm run contact-sheet -- [seed]
 */
import * as styles from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'
import { writeFileSync } from 'node:fs'

const seed = process.argv[2] || 'Mika'
const KEYS = ['mouth', 'lips', 'face', 'eyes']

let html = `<!doctype html><meta charset="utf-8"><title>DiceBear contact sheet</title>
<style>
  body { font: 12px sans-serif; margin: 16px }
  h2 { margin: 24px 0 4px } h3 { margin: 8px 0 4px; color: #555 }
  .row { display: flex; flex-wrap: wrap; gap: 6px }
  figure { margin: 0; text-align: center; width: 84px }
  img { width: 80px; height: 80px; background: #eee; border-radius: 50% }
</style>
<h1>seed: ${seed}</h1>`

for (const [name, style] of Object.entries(styles) as [string, any][]) {
  const props = style.schema?.properties ?? {}
  const keys = KEYS.filter((key) => props[key]?.items?.enum)
  if (keys.length === 0) continue

  const extra = createAvatar(style, { seed }).toJson().extra
  html += `<h2 id="${name}">${name}</h2>`

  for (const key of keys) {
    html += `<h3>${key} (natural: ${extra[key]})</h3><div class="row">`
    for (const variant of props[key].items.enum) {
      const uri = createAvatar(style, {
        seed,
        [key]: [variant],
        [key + 'Probability']: 100,
      }).toDataUri()
      html += `<figure><img src="${uri}"><figcaption>${variant}</figcaption></figure>`
    }
    html += `</div>`
  }
}

writeFileSync('contact-sheet.html', html)
console.log('written contact-sheet.html')
