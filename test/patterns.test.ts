import { describe, expect, it } from 'vitest'
import { render } from '../src/avatar'
import { applyPatterns, PATTERNS } from '../src/patterns'
import { PRESETS } from '../src/presets'

describe('applyPatterns', () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg"><path fill="#010203"/><path fill="#FFFFFF"/></svg>'

  it('replaces the color by a pattern and defines it', () => {
    const result = applyPatterns(svg, { '010203': 'plaid-blue' })
    expect(result).toContain('fill="url(#vs-pattern-plaid-blue)"')
    expect(result).toContain('<defs><pattern id="vs-pattern-plaid-blue"')
    expect(result).toContain('fill="#FFFFFF"')
    expect(result).not.toContain('#010203')
  })

  it('accepts colors with # and in upper case', () => {
    expect(applyPatterns(svg, { '#ffffff': 'plaid-red' })).toContain(
      'fill="url(#vs-pattern-plaid-red)"'
    )
  })

  it('rotates patterns', () => {
    const result = applyPatterns(svg, { '010203': { name: 'plaid-red', rotate: 45 } })
    expect(result).toContain('fill="url(#vs-pattern-plaid-red-45)"')
    expect(result).toContain('patternTransform="rotate(45)"')
  })

  it('ignores unknown patterns', () => {
    expect(applyPatterns(svg, { '010203': 'nope' })).toBe(svg)
  })

  it('offers several plaids', () => {
    expect(Object.keys(PATTERNS)).toEqual(['plaid-red', 'plaid-blue', 'plaid-green'])
  })
})

describe('andre-dietrich', () => {
  it('wears a checkered shirt in every frame', () => {
    const frames = render(PRESETS['andre-dietrich'])
    for (const images of Object.values(frames.faces)) {
      for (const uri of images!) {
        expect(decodeURIComponent(uri)).toContain('url(#vs-pattern-plaid-blue-45)')
      }
    }
  })
})
