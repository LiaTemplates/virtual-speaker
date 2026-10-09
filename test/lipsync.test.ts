import { beforeEach, describe, expect, it } from 'vitest'
import { LipSync } from '../src/lipsync'
import { fakeClock } from './clock'

describe('LipSync', () => {
  let mouths: number[]
  let clock: ReturnType<typeof fakeClock>
  let lips: LipSync

  beforeEach(() => {
    mouths = []
    clock = fakeClock()
    lips = new LipSync((i) => mouths.push(i), () => 3, clock)
  })

  it('flaps while speaking without boundaries', () => {
    lips.start()
    clock.tick(1000)
    expect(mouths.filter((m) => m >= 0).length).toBeGreaterThan(3)
    expect(mouths.filter((m) => m === -1).length).toBeGreaterThan(3)
  })

  it('opens the mouth on word boundaries and stops flapping', () => {
    lips.start()
    mouths = []
    lips.boundary()
    expect(mouths).toEqual([1])
    clock.tick(130)
    expect(mouths).toEqual([1, -1])
    // no flapping while boundaries are reported
    clock.tick(300)
    expect(mouths).toEqual([1, -1])
    // flapping resumes, if boundaries stay away
    clock.tick(1000)
    expect(mouths.length).toBeGreaterThan(2)
  })

  it('closes the mouth and stays quiet when paused', () => {
    lips.start()
    clock.tick(500)
    lips.pause()
    expect(mouths.at(-1)).toBe(-1)
    const count = mouths.length
    clock.tick(2000)
    expect(mouths.length).toBe(count)
    lips.resume()
    clock.tick(500)
    expect(mouths.length).toBeGreaterThan(count)
  })

  it('stop closes the mouth for good', () => {
    lips.start()
    clock.tick(300)
    lips.stop()
    expect(lips.status).toBe('idle')
    expect(mouths.at(-1)).toBe(-1)
    const count = mouths.length
    clock.tick(2000)
    lips.boundary()
    expect(mouths.length).toBe(count)
  })

  it('follows the loudness of a recording instead of flapping', () => {
    let report: (v: number) => void = () => {}
    let stopped = false
    lips.start()
    lips.follow((level) => {
      report = level
      return () => (stopped = true)
    })
    mouths = []
    clock.tick(1000)
    expect(mouths).toEqual([]) // no flapping

    report(0.3)
    expect(mouths.at(-1)).toBeGreaterThanOrEqual(0)
    report(0.001)
    expect(mouths.at(-1)).toBe(-1)

    lips.stop()
    expect(stopped).toBe(true)
  })

  it('keeps flapping, if the recording cannot be analysed', () => {
    lips.start()
    lips.follow(() => null)
    mouths = []
    clock.tick(1000)
    expect(mouths.length).toBeGreaterThan(3)
  })

  it('never opens the mouth of styles without variants', () => {
    lips = new LipSync((i) => mouths.push(i), () => 0, clock)
    lips.start()
    clock.tick(1000)
    expect(mouths.every((m) => m === -1)).toBe(true)
  })
})
