import * as collection from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'
import { describe, expect, it } from 'vitest'
import { render, styleName } from '../src/avatar'
import { FACES } from '../src/faces'

const STYLES = collection as unknown as Record<string, any>

describe('styleName', () => {
  it('accepts camelCase, kebab-case and spaces', () => {
    expect(styleName('bigSmile')).toBe('bigSmile')
    expect(styleName('big-smile')).toBe('bigSmile')
    expect(styleName('Big Smile')).toBe('bigSmile')
    expect(styleName('pixel-art-neutral')).toBe('pixelArtNeutral')
    expect(styleName('AVATAAARS')).toBe('avataaars')
  })

  it('returns null for unknown styles', () => {
    expect(styleName('does-not-exist')).toBeNull()
  })
})

describe('face mapping', () => {
  for (const [name, face] of Object.entries(FACES)) {
    it(`${name} only uses existing variants`, () => {
      const props = STYLES[name]?.schema?.properties
      expect(props, `style ${name}`).toBeDefined()

      if (face.mouth) {
        const variants = props[face.mouth.key].items.enum
        for (const v of [...face.mouth.open, ...(face.mouth.closed || [])]) {
          expect(variants).toContain(v)
        }
      }

      if (face.eyes) {
        const { open, blink, left, right, up } = face.eyes
        for (const v of [...open, blink, left, right, up].filter(Boolean)) {
          expect(props.eyes.items.enum).toContain(v)
        }
      }
    })
  }

  it('changing mouth or eyes does not change other features', () => {
    for (const [name, face] of Object.entries(FACES)) {
      const style = STYLES[name]
      const base = createAvatar(style, { seed: 'Mika' }).toJson().extra
      const changes: [string, string][] = [
        ...(face.mouth?.open || []).map((v) => [face.mouth!.key, v] as [string, string]),
        ...(face.eyes?.blink ? [['eyes', face.eyes.blink] as [string, string]] : []),
      ]

      for (const [key, value] of changes) {
        const other = createAvatar(style, {
          seed: 'Mika',
          [key]: [value],
          [key + 'Probability']: 100,
        }).toJson().extra
        expect({ ...other, [key]: null }).toEqual({ ...base, [key]: null })
      }
    }
  })
})

describe('render', () => {
  it('creates resting, blinking and looking faces with all mouths', () => {
    const frames = render({ style: 'avataaars', seed: 'Mika', name: 'Mika' })

    expect(frames.mouths).toBeGreaterThan(0)
    expect(frames.looks).toEqual(['left', 'up'])
    for (const eyes of ['rest', 'blink', 'left', 'up'] as const) {
      expect(frames.faces[eyes]).toHaveLength(frames.mouths + 1)
      expect(frames.faces[eyes]![0]).toMatch(/^data:image\/svg\+xml/)
    }
    expect(frames.faces.right).toBeUndefined()
    expect(frames.title).toContain('Mika')
    expect(frames.title).toContain('Avataaars')
  })

  it('rests with open eyes', () => {
    // with this seed lorelei would otherwise choose closed eyes
    const natural = createAvatar(STYLES.lorelei, { seed: 'Mika' }).toJson().extra.eyes
    expect(FACES.lorelei.eyes!.open).not.toContain(natural)

    const frames = render({ style: 'lorelei', seed: 'Mika' })
    const rest = frames.faces.rest![0]
    const expected = createAvatar(STYLES.lorelei, {
      seed: 'Mika',
      eyes: FACES.lorelei.eyes!.open,
    }).toJson().extra.eyes as string
    expect(FACES.lorelei.eyes!.open).toContain(expected)
    expect(rest).toBe(
      createAvatar(STYLES.lorelei, {
        seed: 'Mika',
        eyes: [expected],
        eyesProbability: 100,
        mouth: [createAvatar(STYLES.lorelei, { seed: 'Mika', eyes: FACES.lorelei.eyes!.open }).toJson().extra.mouth],
        mouthProbability: 100,
        backgroundColor: ['transparent'],
      }).toDataUri()
    )
    expect(frames.faces.blink).toBeDefined()
  })

  it('does not blink with eyes chosen by the author, e.g. glasses', () => {
    const frames = render({
      style: 'personas',
      seed: 'Mika',
      options: { eyes: ['sunglasses'] },
    })
    expect(frames.faces.blink).toBeUndefined()
  })

  it('draws the background separately and keeps the avatar unchanged', () => {
    const options = { seed: 'Mika' }
    const original = createAvatar(STYLES.funEmoji, options).toJson().extra
    const transparent = createAvatar(STYLES.funEmoji, {
      ...options,
      backgroundColor: ['transparent'],
    }).toJson().extra

    for (const key of ['mouth', 'eyes']) {
      expect(transparent[key]).toBe(original[key])
    }

    const frames = render({ style: 'fun-emoji', seed: 'Mika' })
    expect(frames.background).toBe(original.primaryBackgroundColor)
    expect(decodeURIComponent(frames.faces.rest![0])).not.toContain(
      original.primaryBackgroundColor as string
    )
  })

  it('translates gradients into CSS', () => {
    const frames = render({
      style: 'shapes',
      seed: 'x',
      options: { backgroundType: ['gradientLinear'], backgroundColor: ['ff0000', '0000ff'] },
    })
    expect(frames.background).toMatch(/^linear-gradient\(\d+deg, #(ff0000|0000ff), #(ff0000|0000ff)\)$/)
  })

  it('has no background for transparent styles', () => {
    expect(render({ style: 'avataaars', seed: 'Mika' }).background).toBeNull()
  })

  it('is deterministic and cached', () => {
    const a = render({ style: 'lorelei', seed: 'Anna' })
    const b = render({ style: 'lorelei', seed: 'Anna' })
    expect(a).toBe(b)
  })

  it('styles without mapping have only a resting face', () => {
    const frames = render({ style: 'shapes', seed: 'x' })
    expect(frames.mouths).toBe(0)
    expect(Object.keys(frames.faces)).toEqual(['rest'])
    expect(frames.looks).toEqual([])
  })

  it('falls back to avataaars for unknown styles', () => {
    const frames = render({ style: 'nope', seed: 'x' })
    expect(frames.title).toContain('Avataaars')
  })

  it('respects a mouth chosen by the author', () => {
    const frames = render({
      style: 'avataaars',
      seed: 'Mika',
      options: { mouth: ['vomit'] },
    })
    const extra = createAvatar(STYLES.avataaars, {
      seed: 'Mika',
      mouth: ['vomit'],
      eyes: FACES.avataaars.eyes!.open,
    }).toJson().extra
    expect(extra.mouth).toBe('vomit')
    expect(frames.faces.rest![0]).toBe(
      createAvatar(STYLES.avataaars, {
        seed: 'Mika',
        mouth: ['vomit'],
        mouthProbability: 100,
        eyes: [extra.eyes],
        eyesProbability: 100,
        backgroundColor: ['transparent'],
      }).toDataUri()
    )
  })
})
