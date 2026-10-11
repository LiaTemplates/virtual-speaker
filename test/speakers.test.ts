import { beforeEach, describe, expect, it, vi } from 'vitest'
import { config, define, reset, resolve, subscribe } from '../src/speakers'

beforeEach(() => reset())

describe('resolve', () => {
  it('uses avataaars and the voice as seed without configuration', () => {
    expect(resolve({ voice: 'Deutsch Female' })).toEqual({
      style: 'avataaars',
      seed: 'Deutsch Female',
    })
  })

  it('uses the configured default', () => {
    config({ default: { style: 'lorelei', seed: 'Mika', name: 'Mika' } })
    expect(resolve({ voice: 'Deutsch Female' })).toEqual({
      style: 'lorelei',
      seed: 'Mika',
      name: 'Mika',
    })
  })

  it('a default without seed still uses the voice', () => {
    config({ default: { style: 'micah' } })
    expect(resolve({ voice: 'US English Male' }).seed).toBe('US English Male')
  })

  it('finds registered speakers case-insensitively', () => {
    config({ speakers: { Anna: { style: 'micah', seed: 'Anna', name: 'Anna' } } })
    expect(resolve({ voice: 'x', speaker: 'anna' })).toMatchObject({
      style: 'micah',
      seed: 'Anna',
      name: 'Anna',
    })
  })

  it('a registered speaker without seed uses its id', () => {
    define('bob', { style: 'adventurer' })
    expect(resolve({ speaker: 'bob' })).toMatchObject({
      style: 'adventurer',
      seed: 'bob',
    })
  })

  it('accepts style:seed as speaker', () => {
    expect(resolve({ speaker: 'bottts: R2' })).toEqual({
      style: 'bottts',
      seed: 'R2',
    })
  })

  it('unknown speakers are drawn in the default style', () => {
    config({ default: { style: 'notionists', seed: 'Lia' } })
    expect(resolve({ speaker: 'Zoe' })).toEqual({
      style: 'notionists',
      seed: 'Zoe',
      name: 'Zoe',
      options: undefined,
    })
  })

  it('ad-hoc style wins over everything else', () => {
    config({ speakers: { anna: { style: 'micah', seed: 'Anna' } } })
    expect(
      resolve({ speaker: 'anna', style: 'bottts', seed: 'R2', voice: 'v' })
    ).toEqual({ style: 'bottts', seed: 'R2' })
  })

  it('speakers can be registered for a voice', () => {
    config({ speakers: { 'US English Male': { style: 'avataaars', seed: 'Felix' } } })
    expect(resolve({ voice: 'US English Male' })).toMatchObject({
      style: 'avataaars',
      seed: 'Felix',
    })
  })
})

describe('presets', () => {
  it('sebastian-zug is predefined', () => {
    expect(resolve({ speaker: 'sebastian-zug' })).toMatchObject({
      style: 'avataaars',
      name: 'Sebastian Zug',
    })
  })

  it('andre-dietrich is predefined', () => {
    expect(resolve({ speaker: 'andre-dietrich' })).toMatchObject({
      style: 'avataaars',
      name: 'André Dietrich',
    })
  })

  it('can be used as default speaker', () => {
    config({ default: 'sebastian-zug' })
    expect(resolve({ voice: 'Deutsch Male' })).toMatchObject({
      style: 'avataaars',
      name: 'Sebastian Zug',
    })
  })

  it('can be overridden by a course and survive a reset', () => {
    define('sebastian-zug', { style: 'micah', seed: 'x' })
    expect(resolve({ speaker: 'sebastian-zug' }).style).toBe('micah')
    reset()
    expect(resolve({ speaker: 'sebastian-zug' }).style).toBe('avataaars')
  })
})

describe('subscribe', () => {
  it('is notified on configuration changes', () => {
    const fn = vi.fn()
    const unsubscribe = subscribe(fn)
    config({ default: { style: 'lorelei' } })
    define('anna', { style: 'micah' })
    unsubscribe()
    config({})
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
