import { preview, styles } from './avatar'
import { LiaDicebearAvatar, TAG } from './element'
import { config, define, type Config, type SpeakerDef } from './speakers'

const VirtualSpeaker = {
  /** the custom element, LiaScript shows within the narrator overlay */
  tag: TAG,

  /** set the default speaker and named speakers */
  config,

  /** add or replace a single named speaker */
  define,

  /** all available DiceBear styles */
  styles,

  /** the resting face of a speaker as data URI */
  preview(style: string, seed: string, options?: Record<string, unknown>) {
    return preview({ style, seed, options })
  },

  /** show the avatar again, after `disable()` */
  enable() {
    window.LIA?.narrator?.registerAvatar(TAG)
  },

  /** hide the avatar, the narrator overlay falls back to videos only */
  disable() {
    window.LIA?.narrator?.registerAvatar(null)
  },
}

declare global {
  interface Window {
    VirtualSpeaker: typeof VirtualSpeaker
    /** configuration that can be set before this script is loaded */
    VirtualSpeakerConfig?: Config
    LIA: any
  }
}

export type { Config, SpeakerDef }

if (!customElements.get(TAG)) {
  customElements.define(TAG, LiaDicebearAvatar)
  window.VirtualSpeaker = VirtualSpeaker

  // `@onload` is not delayed until `script:` resources are loaded, thus a
  // course sets `window.VirtualSpeakerConfig`, which is applied either now
  // or as soon as it is set
  let current = window.VirtualSpeakerConfig
  if (current) config(current)

  Object.defineProperty(window, 'VirtualSpeakerConfig', {
    configurable: true,
    get: () => current,
    set: (value: Config) => {
      current = value
      config(value)
    },
  })

  if (window.LIA?.narrator) {
    VirtualSpeaker.enable()
  } else {
    console.warn(
      'VirtualSpeaker: this LiaScript version has no narrator hook (window.LIA.narrator), the avatar cannot be shown'
    )
  }
}
