/**
 * A speaker is a DiceBear avatar: the style (e.g. `lorelei`), the seed that
 * defines its look and optional DiceBear options (hair, colors, …).
 */
export type SpeakerDef = {
  style: string
  seed: string
  options?: Record<string, unknown>
  name?: string
}

export type Config = {
  /** the speaker of all comments without a speaker annotation */
  default?: Partial<SpeakerDef>
  /** named speakers, referenced by `@VirtualSpeaker.speaker(id)` or by the
   * name of a narrator voice, e.g. `"Deutsch Male"` */
  speakers?: Record<string, Partial<SpeakerDef>>
}

/** The attributes LiaScript passes to the avatar element. */
export type Attributes = {
  voice?: string | null
  speaker?: string | null
  style?: string | null
  seed?: string | null
}

const DEFAULT: SpeakerDef = { style: 'avataaars', seed: '' }

let defaultSpeaker: Partial<SpeakerDef> = {}
const registry = new Map<string, Partial<SpeakerDef>>()
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((fn) => fn())
}

export function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function config(cfg: Config = {}) {
  if (cfg.default) {
    defaultSpeaker = { ...cfg.default }
  }

  for (const [id, def] of Object.entries(cfg.speakers || {})) {
    registry.set(key(id), { ...def })
  }

  notify()
}

export function define(id: string, def: Partial<SpeakerDef>) {
  registry.set(key(id), { ...def })
  notify()
}

/** Forget all speakers and the default (used by the tests). */
export function reset() {
  defaultSpeaker = {}
  registry.clear()
  notify()
}

function key(id: string) {
  return id.trim().toLowerCase()
}

/**
 * Find the speaker for the attributes of the current comment:
 *
 * 1. `data-speaker-style` (+ `data-speaker-seed`): an ad-hoc DiceBear avatar
 * 2. `data-speaker`: a registered speaker, `style:seed`, or otherwise the
 *    default style with the given name as seed
 * 3. a speaker registered for the narrator voice (`data-voice`)
 * 4. the default speaker, if it has no seed, the voice is used, thus
 *    different voices get different avatars
 */
export function resolve(attr: Attributes): SpeakerDef {
  const voice = attr.voice?.trim() || ''
  const base: SpeakerDef = {
    ...DEFAULT,
    seed: voice || 'LiaScript',
    ...defaultSpeaker,
  } as SpeakerDef

  if (attr.style?.trim()) {
    return {
      style: attr.style.trim(),
      seed: attr.seed?.trim() || base.seed,
    }
  }

  const speaker = attr.speaker?.trim()
  if (speaker) {
    const registered = registry.get(key(speaker))
    if (registered) {
      return { ...base, seed: speaker, name: undefined, ...registered } as SpeakerDef
    }

    const match = speaker.match(/^([\w-]+)\s*:\s*(.+)$/)
    if (match) {
      return { style: match[1], seed: match[2].trim() }
    }

    return { style: base.style, options: base.options, seed: speaker, name: speaker }
  }

  const byVoice = voice ? registry.get(key(voice)) : undefined
  if (byVoice) {
    return { ...base, name: undefined, ...byVoice } as SpeakerDef
  }

  return base
}
