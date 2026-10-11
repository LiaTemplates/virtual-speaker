import type { PatternRef } from './patterns'
import { PRESETS } from './presets'

/**
 * A speaker is a DiceBear avatar: the style (e.g. `lorelei`), the seed that
 * defines its look and optional DiceBear options (hair, colors, …).
 */
export type SpeakerDef = {
  style: string
  seed: string
  options?: Record<string, unknown>
  name?: string
  /** colors of the options replaced by patterns, e.g. `{ '010203': 'plaid-blue' }` */
  patterns?: Record<string, PatternRef>
}

export type Config = {
  /** the speaker of all comments without a speaker annotation, either a
   * definition or the id of a named speaker, e.g. `'sebastian-zug'` */
  default?: Partial<SpeakerDef> | string
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

let defaultSpeaker: Partial<SpeakerDef> | string = {}
const registry = new Map<string, Partial<SpeakerDef>>()
const listeners = new Set<() => void>()

function presets() {
  for (const [id, def] of Object.entries(PRESETS)) {
    registry.set(key(id), def)
  }
}

presets()

function notify() {
  listeners.forEach((fn) => fn())
}

export function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function config(cfg: Config = {}) {
  if (cfg.default) {
    defaultSpeaker =
      typeof cfg.default === 'string' ? cfg.default : { ...cfg.default }
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

/** Forget all speakers except the presets and the default (for tests). */
export function reset() {
  defaultSpeaker = {}
  registry.clear()
  presets()
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
    ...(typeof defaultSpeaker === 'string'
      ? registry.get(key(defaultSpeaker)) || { seed: defaultSpeaker }
      : defaultSpeaker),
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
