import { preview, styles } from './avatar'
import { LiaDicebearAvatar, TAG } from './element'
import { PRESETS } from './presets'
import { config, define, resolve, type Config, type SpeakerDef } from './speakers'

const VirtualSpeaker = {
  /** the custom element, LiaScript shows within the narrator overlay */
  tag: TAG,

  /** set the default speaker and named speakers */
  config,

  /** add or replace a single named speaker */
  define,

  /** all available DiceBear styles */
  styles,

  /** the ids of all predefined speakers, e.g. `albert-einstein` */
  presets() {
    return Object.keys(PRESETS)
  },

  /** the resting face of a speaker as data URI, either a DiceBear style and
   * seed, or only the id of a named speaker, e.g. `preview('confucius')` */
  preview(style: string, seed?: string, options?: Record<string, unknown>) {
    return preview(seed === undefined ? resolve({ speaker: style }) : { style, seed, options })
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
