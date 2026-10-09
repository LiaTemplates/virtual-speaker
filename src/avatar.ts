import * as collection from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'
import { FACES, type Look } from './faces'
import type { SpeakerDef } from './speakers'

const STYLES = collection as unknown as Record<string, any>

export type Eyes = 'rest' | 'blink' | Look

/**
 * The images of one speaker as data URIs. For every state of the eyes there
 * is one image per mouth: index 0 is the resting mouth, the others are open.
 * `rest` is always defined, the other states only if the style supports them.
 */
export type Frames = {
  faces: Partial<Record<Eyes, string[]>>
  /** number of open mouths */
  mouths: number
  /** directions with eyes looking that way */
  looks: Look[]
  /** the background of the avatar as CSS, the images are transparent, such
   * that the background stays in place while the avatar moves */
  background: string | null
  /** shown as tooltip, contains the name and the license of the style */
  title: string
}

/**
 * `big-smile`, `bigSmile`, `Big Smile` → `bigSmile`
 */
export function styleName(name: string): string | null {
  const camel = name
    .trim()
    .replace(/[-_\s]+(\w)/g, (_, c: string) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toLowerCase())

  if (STYLES[camel]) return camel

  const lower = camel.toLowerCase()
  return Object.keys(STYLES).find((key) => key.toLowerCase() === lower) || null
}

export function styles(): string[] {
  return Object.keys(STYLES)
}

const cache = new Map<string, Frames>()

export function render(speaker: SpeakerDef): Frames {
  const id = JSON.stringify(speaker)
  let frames = cache.get(id)

  if (!frames) {
    frames = create(speaker)
    cache.set(id, frames)
  }

  return frames
}

/**
 * The resting face of a speaker as data URI, e.g. for a gallery.
 */
export function preview(speaker: SpeakerDef): string {
  const { style, options } = prepare(speaker)
  return createAvatar(style, options).toDataUri()
}

function prepare(speaker: SpeakerDef) {
  let name = styleName(speaker.style)

  if (!name) {
    console.warn('VirtualSpeaker: unknown DiceBear style ->', speaker.style)
    name = 'avataaars'
  }

  const face = FACES[name] || {}
  const options: Record<string, unknown> = { ...speaker.options, seed: speaker.seed }

  // restrict the resting mouth and eyes, if the author has not chosen them
  if (face.mouth?.closed && options[face.mouth.key] === undefined) {
    options[face.mouth.key] = face.mouth.closed
  }
  if (face.eyes && options.eyes === undefined) {
    options.eyes = face.eyes.open
  }

  return { style: STYLES[name], face, options }
}

function create(speaker: SpeakerDef): Frames {
  const { style, face, options } = prepare(speaker)
  const { mouth, eyes } = face

  const resting = createAvatar(style, options).toJson().extra
  const background = toCSS(resting)
  // the background is drawn separately, see `Frames.background`
  options.backgroundColor = ['transparent']

  // overriding single components does not change the others, since the
  // random generator is consumed in the same order (checked in the tests)
  const mouths: Record<string, unknown>[] = mouth
    ? [resting[mouth.key], ...mouth.open.filter((v) => v !== resting[mouth.key])].map(
        (value) => ({ [mouth.key]: [value], [mouth.key + 'Probability']: 100 })
      )
    : [{}]

  const states: Partial<Record<Eyes, string>> = { rest: resting.eyes as string }

  // blinking and looking around only with open eyes, not e.g. with glasses
  if (eyes && eyes.open.includes(resting.eyes as string)) {
    states.blink = eyes.blink
    states.left = eyes.left
    states.right = eyes.right
    states.up = eyes.up
  }

  const faces: Frames['faces'] = {}
  for (const [state, value] of Object.entries(states) as [Eyes, string][]) {
    if (state !== 'rest' && !value) continue

    const eyeOptions = value ? { eyes: [value], eyesProbability: 100 } : {}
    faces[state] = mouths.map((m) =>
      createAvatar(style, { ...options, ...eyeOptions, ...m }).toDataUri()
    )
  }

  return {
    faces,
    mouths: mouths.length - 1,
    looks: (['left', 'right', 'up'] as Look[]).filter((look) => faces[look]),
    background,
    title: title(speaker, style),
  }
}

/**
 * The DiceBear background as CSS, `null` if it is transparent. A linear
 * gradient in DiceBear runs from left to right and is rotated clockwise.
 */
function toCSS(extra: Record<string, unknown>): string | null {
  const primary = extra.primaryBackgroundColor as string | undefined

  if (!primary || primary === 'transparent') return null

  if (extra.backgroundType === 'gradientLinear') {
    const rotation = Number(extra.backgroundRotation) || 0
    return `linear-gradient(${90 + rotation}deg, ${primary}, ${extra.secondaryBackgroundColor})`
  }

  return primary
}

function title(speaker: SpeakerDef, style: any): string {
  const meta = style.meta || {}
  const credit = [
    meta.title && `"${meta.title}"`,
    meta.creator && `by ${meta.creator}`,
    meta.license?.name && `licensed under ${meta.license.name}`,
  ]
    .filter(Boolean)
    .join(' ')

  return [speaker.name, credit && `Avatar: ${credit} (via DiceBear)`]
    .filter(Boolean)
    .join(' – ')
}
