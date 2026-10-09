import type { Clock } from '../src/lipsync'

/** a manual clock, `tick(ms)` runs all timers that are due */
export function fakeClock() {
  let now = 0
  // deterministic pseudo random numbers (LCG)
  let seed = 42
  let id = 0
  const timers = new Map<number, { at: number; fn: () => void }>()

  const clock: Clock & { tick: (ms: number) => void } = {
    now: () => now,
    random: () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296,
    setTimeout: (fn, ms) => {
      timers.set(++id, { at: now + ms, fn })
      return id
    },
    clearTimeout: (t) => timers.delete(t),
    tick(ms) {
      const end = now + ms
      for (;;) {
        const next = [...timers.entries()]
          .filter(([, t]) => t.at <= end)
          .sort((a, b) => a[1].at - b[1].at)[0]
        if (!next) break
        timers.delete(next[0])
        now = next[1].at
        next[1].fn()
      }
      now = end
    },
  }
  return clock
}
