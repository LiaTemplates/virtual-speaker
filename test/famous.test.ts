import * as collection from '@dicebear/collection'
import { schema as core } from '@dicebear/core'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { styleName } from '../src/avatar'
import { FAMOUS } from '../src/famous'
import { PRESETS } from '../src/presets'

const STYLES = collection as unknown as Record<string, any>
const README = readFileSync(new URL('../README.md', import.meta.url), 'utf8')

describe('famous people', () => {
  it('are predefined', () => {
    for (const id of Object.keys(FAMOUS)) {
      expect(PRESETS[id], id).toBe(FAMOUS[id])
    }
  })

  it('use the id as seed', () => {
    for (const [id, def] of Object.entries(FAMOUS)) {
      expect(def.seed, id).toBe(id)
    }
  })

  // DiceBear silently ignores unknown options and variants
  it('only use options and variants of their style', () => {
    for (const [id, def] of Object.entries(FAMOUS)) {
      const name = styleName(def.style)
      expect(name, id).not.toBeNull()

      const properties = STYLES[name!].schema.properties
      for (const [key, value] of Object.entries(def.options || {})) {
        expect(properties[key] || (core as any).properties[key], `${id}: ${key}`).toBeDefined()

        const variants = properties[key]?.items?.enum
        if (variants) {
          for (const variant of value as string[]) {
            expect(variants, `${id}: ${key}`).toContain(variant)
          }
        }
      }
    }
  })

  it('are listed in the README with a link to Wikipedia', () => {
    for (const [id, def] of Object.entries(FAMOUS)) {
      const row = README.split('\n').find((line) => line.startsWith(`| \`${id}\``))
      expect(row, id).toBeDefined()
      expect(row, id).toContain(def.name)
      expect(row, id).toContain(`\`${def.style}\``)
      expect(row, id).toMatch(/\]\(https:\/\/en\.wikipedia\.org\/wiki\/[^)\s]+\)/)
    }
  })
})
