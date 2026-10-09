import css from 'bundle-text:./ui/style.css'
import { render, type Eyes, type Frames } from './avatar'
import { Behavior } from './behavior'
import { analyse, LipSync } from './lipsync'
import { resolve, subscribe } from './speakers'

export const TAG = 'lia-dicebear-avatar'

/** the event LiaScript dispatches on `window`, see `LIA.narrator` */
export const EVENT = 'lia-narrator'

export type NarratorDetail = {
  type:
    | 'start'
    | 'stop'
    | 'pause'
    | 'resume'
    | 'boundary'
    | 'progress'
    | 'media'
    | 'error'
  status: 'idle' | 'speaking' | 'paused'
  source: 'tts' | 'audio' | 'video' | null
  media: HTMLMediaElement | null
}

/**
 * The narrator avatar, rendered by LiaScript within the overlay of the
 * narrator comments. LiaScript passes the narrator voice and the `data-*`
 * annotations of the current comments as attributes.
 */
export class LiaDicebearAvatar extends HTMLElement {
  static observedAttributes = [
    'data-voice',
    'data-speaker',
    'data-speaker-style',
    'data-speaker-seed',
  ]

  private stage: HTMLDivElement
  private body: HTMLDivElement
  /** one image per state of the eyes and mouth */
  private images: Partial<Record<Eyes, HTMLImageElement[]>> = {}
  private visible: HTMLImageElement | null = null
  private frames: Frames | null = null
  private speaker = ''
  private mouth = -1
  private pending = false
  private unsubscribe: (() => void) | null = null
  private lipsync: LipSync
  private behavior: Behavior

  constructor() {
    super()

    const root = this.attachShadow({ mode: 'open' })
    root.innerHTML =
      `<style>${css}</style>` +
      `<div class="stage" part="stage"><div class="head"><div class="body"></div></div></div>`

    this.stage = root.querySelector('.stage') as HTMLDivElement
    this.body = root.querySelector('.body') as HTMLDivElement

    this.lipsync = new LipSync(
      (index) => {
        this.mouth = index
        this.show()
      },
      () => this.frames?.mouths || 0
    )

    this.behavior = new Behavior(
      () => this.show(),
      () => ({
        blink: !!this.frames?.faces.blink,
        looks: this.frames?.looks || [],
      }),
      () => this.lipsync.status === 'speaking'
    )
  }

  connectedCallback() {
    window.addEventListener(EVENT, this.onNarrator as EventListener)
    this.unsubscribe = subscribe(() => {
      this.speaker = ''
      this.update()
    })
    this.update()

    // the playback might have started before this element was created
    const state = window.LIA?.narrator?.state
    if (state && state.status !== 'idle' && state.source !== 'video') {
      this.onNarrator({
        detail: { ...state, type: 'start' },
      } as CustomEvent<NarratorDetail>)
    }

    this.behavior.start()
  }

  disconnectedCallback() {
    window.removeEventListener(EVENT, this.onNarrator as EventListener)
    this.unsubscribe?.()
    this.lipsync.stop()
    this.behavior.stop()
  }

  attributeChangedCallback() {
    // several attributes change at once, render only once
    if (this.pending) return
    this.pending = true
    queueMicrotask(() => {
      this.pending = false
      this.update()
    })
  }

  private update() {
    const speaker = resolve({
      voice: this.getAttribute('data-voice'),
      speaker: this.getAttribute('data-speaker'),
      style: this.getAttribute('data-speaker-style'),
      seed: this.getAttribute('data-speaker-seed'),
    })

    const id = JSON.stringify(speaker)
    if (id === this.speaker) return
    this.speaker = id

    this.frames = render(speaker)

    this.body.replaceChildren()
    this.images = {}
    this.visible = null

    for (const [eyes, sources] of Object.entries(this.frames.faces)) {
      this.images[eyes as Eyes] = sources!.map((src) => {
        const img = document.createElement('img')
        img.alt = ''
        img.draggable = false
        img.hidden = true
        img.src = src
        this.body.appendChild(img)
        return img
      })
    }

    this.stage.style.background = this.frames.background || ''
    this.title = this.frames.title
    this.setAttribute('role', 'img')
    this.setAttribute('aria-label', speaker.name || speaker.seed)
    this.stage.classList.toggle('no-mouth', this.frames.mouths === 0)
    this.show()
  }

  /** show the image for the current eyes and mouth, turn the head */
  private show() {
    const eyes = this.images[this.behavior.eyes] || this.images.rest
    const img = eyes?.[this.mouth + 1] || eyes?.[0] || null

    if (img !== this.visible) {
      if (this.visible) this.visible.hidden = true
      if (img) img.hidden = false
      this.visible = img
    }

    for (const look of ['left', 'right', 'up']) {
      this.stage.classList.toggle('look-' + look, this.behavior.look === look)
    }
  }

  private onNarrator = (event: CustomEvent<NarratorDetail>) => {
    const detail = event.detail

    // videos are shown by LiaScript itself
    if (!detail || detail.source === 'video') return

    switch (detail.type) {
      case 'start':
        this.lipsync.start()
        this.follow(detail)
        break
      case 'media':
        this.follow(detail)
        break
      case 'boundary':
        this.lipsync.boundary()
        break
      case 'pause':
        this.lipsync.pause()
        break
      case 'resume':
        this.lipsync.resume()
        break
      case 'stop':
      case 'error':
        this.lipsync.stop()
        break
      default:
        return
    }

    this.stage.classList.toggle('speaking', this.lipsync.status !== 'idle')
    this.stage.classList.toggle('paused', this.lipsync.status === 'paused')
  }

  /** audio recordings are analysed, the mouth follows their loudness */
  private follow(detail: NarratorDetail) {
    const media = detail.media
    if (detail.source === 'audio' && media) {
      this.lipsync.follow((level) => analyse(media, level))
    }
  }
}
