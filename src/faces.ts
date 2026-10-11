/**
 * Mouth and eye variants per DiceBear style, used to animate the avatar.
 *
 * `mouth`
 * - `key`: the component that forms the mouth (`mouth` or `lips`)
 * - `open`: variants with an open mouth, shown alternately while speaking
 * - `closed`: if defined, the resting mouth is chosen from these variants,
 *   unless the author has explicitly set one (avoids e.g. a "vomit" mouth)
 *
 * `eyes`
 * - `open`: the resting eyes are chosen from these variants, unless the
 *   author has set them (avoids avatars with permanently closed eyes)
 * - `blink`: closed eyes, used for blinking
 * - `left`, `right`, `up`: eyes looking into a direction, used when the
 *   avatar looks around (the head turns in any case)
 *
 * Blinking and looking are only used, if the resting eyes are one of the
 * `open` variants, otherwise e.g. glasses would vanish while blinking.
 *
 * Styles without an entry only bob while speaking. The variants were
 * selected visually, run `npm run contact-sheet` to review them.
 */
export type Face = {
  mouth?: {
    key: 'mouth' | 'lips'
    open: string[]
    closed?: string[]
  }
  eyes?: {
    open: string[]
    blink?: string
    left?: string
    right?: string
    up?: string
  }
}

export type Look = 'left' | 'right' | 'up'

const adventurer: Face = {
  mouth: { key: 'mouth', open: ['variant25', 'variant26', 'variant27', 'variant15'] },
  eyes: {
    open: ['variant26', 'variant25', 'variant24', 'variant21', 'variant12', 'variant10', 'variant09', 'variant03', 'variant02', 'variant01'],
    blink: 'variant20',
  },
}

const avataaars: Face = {
  mouth: {
    key: 'mouth',
    open: ['default', 'disbelief'],
    closed: ['twinkle', 'smile', 'serious'],
  },
  eyes: {
    open: ['default', 'squint', 'surprised'],
    blink: 'closed',
    left: 'side',
    up: 'eyeRoll',
  },
}

const bigEars: Face = {
  mouth: { key: 'mouth', open: ['variant0101', 'variant0103', 'variant0105', 'variant0404'] },
  eyes: {
    open: ['variant30', 'variant28', 'variant26', 'variant24', 'variant21', 'variant20', 'variant15', 'variant14', 'variant05', 'variant03'],
    blink: 'variant31',
  },
}

const bottts: Face = {
  mouth: {
    key: 'mouth',
    open: ['smile02', 'square01'],
    closed: ['smile01', 'square02', 'grill01', 'grill02', 'grill03'],
  },
}

const croodles: Face = {
  mouth: { key: 'mouth', open: ['variant10', 'variant11', 'variant12', 'variant17'] },
  eyes: {
    open: ['variant16', 'variant11', 'variant06', 'variant04', 'variant02', 'variant01'],
    blink: 'variant03',
  },
}

const lorelei: Face = {
  mouth: { key: 'mouth', open: ['happy07', 'happy08', 'sad01'] },
  eyes: {
    open: ['variant24', 'variant23', 'variant21', 'variant20', 'variant16', 'variant14', 'variant13', 'variant10', 'variant06', 'variant04', 'variant02'],
    blink: 'variant01',
  },
}

const notionists: Face = {
  mouth: { key: 'lips', open: ['variant29', 'variant25', 'variant14', 'variant11'] },
}

const pixelArt: Face = {
  mouth: { key: 'mouth', open: ['happy01', 'happy12', 'happy13'] },
}

export const FACES: Record<string, Face> = {
  adventurer,
  adventurerNeutral: adventurer,
  avataaars,
  avataaarsNeutral: avataaars,
  bigEars,
  bigEarsNeutral: bigEars,
  bigSmile: {
    mouth: {
      key: 'mouth',
      open: ['openedSmile', 'gapSmile', 'openSad'],
      closed: ['unimpressed', 'kawaii', 'teethSmile', 'awkwardSmile'],
    },
    eyes: { open: ['normal', 'cheery', 'confused'], blink: 'sleepy' },
  },
  bottts,
  botttsNeutral: bottts,
  croodles,
  croodlesNeutral: croodles,
  funEmoji: {
    mouth: {
      key: 'mouth',
      open: ['shout', 'smileLol', 'smileTeeth'],
      closed: ['plain', 'lilSmile', 'cute', 'wideSmile', 'shy'],
    },
    eyes: { open: ['plain', 'cute', 'sad', 'pissed'], blink: 'closed' },
  },
  lorelei,
  loreleiNeutral: lorelei,
  micah: {
    mouth: {
      key: 'mouth',
      open: ['surprised', 'laughing'],
      closed: ['smile', 'smirk', 'pucker'],
    },
    eyes: { open: ['eyes', 'round', 'eyesShadow'], blink: 'smiling' },
  },
  miniavs: {
    eyes: { open: ['normal', 'confident'] },
  },
  notionists,
  notionistsNeutral: notionists,
  personas: {
    mouth: {
      key: 'mouth',
      open: ['surprise', 'bigSmile'],
      closed: ['smile', 'smirk', 'lips'],
    },
    eyes: { open: ['open'], blink: 'sleep' },
  },
  pixelArt,
  pixelArtNeutral: pixelArt,
  thumbs: {
    mouth: {
      key: 'mouth',
      open: ['variant2', 'variant1'],
      closed: ['variant3', 'variant4'],
    },
    eyes: { open: ['variant5W14', 'variant6W14', 'variant8W14'], blink: 'variant2W14' },
  },
  toonHead: {
    mouth: {
      key: 'mouth',
      open: ['agape', 'laugh'],
      closed: ['smile', 'sad'],
    },
    eyes: { open: ['happy', 'wide'], blink: 'humble' },
  },
}
