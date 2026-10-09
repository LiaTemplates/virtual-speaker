/**
 * Decides which mouth is shown while the narrator speaks. `setMouth(-1)`
 * closes the mouth, `setMouth(i)` shows the i-th open variant.
 *
 * - speech synthesis: every word boundary opens the mouth for a moment; if
 *   the browser does not report boundaries, the mouth flaps randomly
 * - audio recordings: the mouth follows the loudness (Web Audio analyser),
 *   if the recording can be analysed, otherwise it flaps as well
 */
export type Clock = {
  setTimeout: (fn: () => void, ms: number) => any
  clearTimeout: (id: any) => void
  now: () => number
  random: () => number
}

export const defaultClock: Clock = {
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (id) => clearTimeout(id),
  now: () => Date.now(),
  random: Math.random,
}

/** how long a word boundary opens the mouth */
const WORD_OPEN = 130
/** without boundaries for this time, the mouth flaps on its own */
const BOUNDARY_TIMEOUT = 400

export type Status = 'idle' | 'speaking' | 'paused'

export class LipSync {
  status: Status = 'idle'

  private open = 0
  private timer: any = null
  private lastBoundary = -Infinity
  private stopAnalyser: (() => void) | null = null

  constructor(
    private setMouth: (index: number) => void,
    private variants: () => number,
    private clock: Clock = defaultClock
  ) {}

  start() {
    this.status = 'speaking'
    this.lastBoundary = -Infinity
    this.flap()
  }

  /** a word boundary reported by the speech synthesis */
  boundary() {
    if (this.status !== 'speaking' || this.stopAnalyser) return

    this.lastBoundary = this.clock.now()
    this.show(true)
    this.schedule(() => {
      this.show(false)
      this.schedule(() => this.flap(), BOUNDARY_TIMEOUT)
    }, WORD_OPEN)
  }

  /** follow the loudness of a media element instead of flapping */
  follow(attach: (level: (value: number) => void) => (() => void) | null) {
    this.detach()

    let peak = 0.05
    const stop = attach((value) => {
      if (this.status !== 'speaking') return

      // adaptive threshold, recordings differ in their volume
      peak = Math.max(value, peak * 0.995)
      this.show(value > Math.max(0.02, peak * 0.3))
    })

    if (stop) {
      this.clear()
      this.stopAnalyser = stop
    }
  }

  pause() {
    if (this.status === 'idle') return
    this.status = 'paused'
    this.clear()
    this.show(false)
  }

  resume() {
    if (this.status !== 'paused') return
    this.status = 'speaking'
    if (!this.stopAnalyser) this.flap()
  }

  stop() {
    this.status = 'idle'
    this.detach()
    this.clear()
    this.show(false)
  }

  private detach() {
    if (this.stopAnalyser) {
      this.stopAnalyser()
      this.stopAnalyser = null
    }
  }

  private flap() {
    if (this.status !== 'speaking' || this.stopAnalyser) return

    // boundaries are reported, flap only if they stay away
    const elapsed = this.clock.now() - this.lastBoundary
    if (elapsed < BOUNDARY_TIMEOUT) {
      this.schedule(() => this.flap(), BOUNDARY_TIMEOUT - elapsed)
      return
    }

    this.show(!this.open)
    this.schedule(() => this.flap(), 90 + this.clock.random() * 100)
  }

  private show(open: boolean) {
    const variants = this.variants()

    if (open && variants > 0) {
      this.open = 1
      this.setMouth(Math.floor(this.clock.random() * variants))
    } else {
      this.open = 0
      this.setMouth(-1)
    }
  }

  private schedule(fn: () => void, ms: number) {
    this.clear()
    this.timer = this.clock.setTimeout(() => {
      this.timer = null
      fn()
    }, ms)
  }

  private clear() {
    if (this.timer !== null) {
      this.clock.clearTimeout(this.timer)
      this.timer = null
    }
  }
}

// --------------------------------------------------------------------------
// Web Audio analyser

let context: AudioContext | null = null
const sources = new WeakMap<HTMLMediaElement, AnalyserNode>()

/**
 * Only recordings from the same origin (or served with CORS) can be
 * analysed, otherwise the analyser would mute them.
 */
export function canAnalyse(media: HTMLMediaElement): boolean {
  if (sources.has(media)) return true
  if (typeof AudioContext === 'undefined') return false

  const src =
    media.currentSrc ||
    media.src ||
    (media.querySelector('source') as HTMLSourceElement | null)?.src ||
    ''

  if (!src) return false
  if (src.startsWith('blob:') || src.startsWith('data:')) return true
  if (media.crossOrigin !== null) return true

  try {
    return new URL(src, location.href).origin === location.origin
  } catch (e) {
    return false
  }
}

/**
 * Report the loudness (RMS, 0..1) of a playing media element on every frame.
 * Returns a function to stop, or `null` if the element cannot be analysed.
 */
export function analyse(
  media: HTMLMediaElement,
  level: (value: number) => void
): (() => void) | null {
  if (!canAnalyse(media)) return null

  try {
    context = context || new AudioContext()

    // routing a media element into a context that is not running would
    // mute it, so only connect while the context runs
    if (context.state !== 'running') {
      context.resume().catch(() => {})
      if (!sources.has(media)) return null
    }

    let analyser = sources.get(media)
    if (!analyser) {
      analyser = context.createAnalyser()
      analyser.fftSize = 1024
      const source = context.createMediaElementSource(media)
      source.connect(analyser)
      analyser.connect(context.destination)
      sources.set(media, analyser)
    }

    const data = new Float32Array(analyser.fftSize)
    let frame = 0

    const loop = () => {
      analyser!.getFloatTimeDomainData(data)
      let sum = 0
      for (let i = 0; i < data.length; i++) sum += data[i] * data[i]
      level(Math.sqrt(sum / data.length))
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(frame)
  } catch (e) {
    console.warn('VirtualSpeaker: cannot analyse recording', e)
    return null
  }
}
