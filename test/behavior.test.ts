import { beforeEach, describe, expect, it } from 'vitest'
import { Behavior } from '../src/behavior'
import type { Look } from '../src/faces'
import { fakeClock } from './clock'

describe('Behavior', () => {
  let clock: ReturnType<typeof fakeClock>
  let log: string[]
  let abilities: { blink: boolean; looks: Look[] }
  let speaking: boolean
  let behavior: Behavior

  beforeEach(() => {
    clock = fakeClock()
    log = []
    abilities = { blink: true, looks: ['left'] }
    speaking = false
    behavior = new Behavior(
      () => log.push(behavior.eyes + '/' + (behavior.look || '-')),
      () => abilities,
      () => speaking,
      clock
    )
  })

  it('looks at the audience with open eyes at first', () => {
    behavior.start()
    expect(behavior.eyes).toBe('rest')
    expect(behavior.look).toBeNull()
  })

  it('blinks every few seconds and opens the eyes again', () => {
    behavior.start()
    clock.tick(20000)
    const blinks = log.filter((l) => l.startsWith('blink')).length
    expect(blinks).toBeGreaterThanOrEqual(3)
    expect(blinks).toBeLessThanOrEqual(10)
    // every blink is followed by open eyes
    log.forEach((l, i) => {
      if (l.startsWith('blink')) expect(log[i + 1]).not.toMatch(/^blink/)
    })
  })

  it('looks around and back again', () => {
    behavior.start()
    clock.tick(30000)
    expect(log.some((l) => l.endsWith('/left') || l.endsWith('/right'))).toBe(true)
    expect(log.at(-1)).toMatch(/\/-$|\/left$|\/right$/)
  })

  it('only turns the eyes, if the style can', () => {
    behavior.start()
    clock.tick(30000)
    clock.tick(60000)
    // the head turns right, but there are no eyes looking right
    const right = log.filter((l) => l.endsWith('/right'))
    expect(right.length).toBeGreaterThan(0)
    expect(right.every((l) => !l.startsWith('right'))).toBe(true)
    expect(log.filter((l) => l === 'left/left').length).toBeGreaterThan(0)
  })

  it('does not blink without closed eyes', () => {
    abilities = { blink: false, looks: [] }
    behavior.start()
    clock.tick(20000)
    expect(log.every((l) => l.startsWith('rest'))).toBe(true)
  })

  it('stop resets everything', () => {
    behavior.start()
    clock.tick(5000)
    behavior.stop()
    const count = log.length
    clock.tick(20000)
    expect(log.length).toBe(count)
    expect(behavior.eyes).toBe('rest')
    expect(behavior.look).toBeNull()
  })
})
