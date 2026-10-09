import type { Eyes } from './avatar'
import type { Look } from './faces'
import { defaultClock, type Clock } from './lipsync'

/**
 * Makes the avatar look alive: it blinks every few seconds (sometimes twice)
 * and looks around from time to time. The head turns via CSS, the eyes only
 * follow, if the style has eyes looking into that direction.
 */
export class Behavior {
  /** the direction the head is turned to */
  look: Look | null = null

  private blinking = false
  private blinkTimer: any = null
  private lookTimer: any = null
  private running = false

  constructor(
    private update: () => void,
    private abilities: () => { blink: boolean; looks: Look[] },
    private speaking: () => boolean,
    private clock: Clock = defaultClock
  ) {}

  /** the eyes to show right now */
  get eyes(): Eyes {
    const { blink, looks } = this.abilities()

    if (this.blinking && blink) return 'blink'
    if (this.look && looks.includes(this.look)) return this.look
    return 'rest'
  }

  start() {
    if (this.running) return
    this.running = true
    this.scheduleBlink()
    this.scheduleLook()
  }

  stop() {
    this.running = false
    this.clock.clearTimeout(this.blinkTimer)
    this.clock.clearTimeout(this.lookTimer)
    this.blinking = false
    this.look = null
  }

  private between(min: number, max: number) {
    return min + this.clock.random() * (max - min)
  }

  private scheduleBlink() {
    this.blinkTimer = this.clock.setTimeout(() => {
      this.blink(this.clock.random() < 0.2)
    }, this.between(2500, 6000))
  }

  private blink(twice: boolean) {
    if (!this.running) return

    this.blinking = true
    this.update()

    this.blinkTimer = this.clock.setTimeout(() => {
      this.blinking = false
      this.update()

      if (twice) {
        this.blinkTimer = this.clock.setTimeout(() => this.blink(false), 180)
      } else {
        this.scheduleBlink()
      }
    }, 140)
  }

  private scheduleLook() {
    // while speaking the avatar mostly looks at the audience
    const wait = this.speaking()
      ? this.between(7000, 14000)
      : this.between(4000, 10000)

    this.lookTimer = this.clock.setTimeout(() => this.lookAround(), wait)
  }

  private lookAround() {
    if (!this.running) return

    const { looks } = this.abilities()
    const r = this.clock.random()

    this.look = looks.includes('up') && r < 0.15 ? 'up' : r < 0.575 ? 'left' : 'right'
    this.update()

    this.lookTimer = this.clock.setTimeout(
      () => {
        this.look = null
        this.update()
        this.scheduleLook()
      },
      this.speaking() ? this.between(500, 1000) : this.between(800, 1800)
    )
  }
}
