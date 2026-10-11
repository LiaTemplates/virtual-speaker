import { FAMOUS } from './famous'
import type { SpeakerDef } from './speakers'

/**
 * Speakers that are always available, e.g. via
 * `@VirtualSpeaker.speaker(sebastian-zug)`. A course can override them with
 * its own configuration.
 */
export const PRESETS: Record<string, SpeakerDef> = {
  'andre-dietrich': {
    name: 'André Dietrich',
    style: 'avataaars',
    seed: 'andre-dietrich',
    options: {
      top: ['shortFlat'],
      hairColor: ['5a3a2e'],
      facialHairProbability: 0,
      skinColor: ['ffdbb4'],
      eyebrows: ['defaultNatural'],
      eyes: ['default'],
      mouth: ['twinkle'],
      clothing: ['collarAndSweater'],
      clothesColor: ['010203'],
      accessoriesProbability: 0,
    },
    patterns: { '010203': { name: 'plaid-blue', rotate: 45 } },
  },
  'sebastian-zug': {
    name: 'Sebastian Zug',
    style: 'avataaars',
    seed: 'sebastian-zug',
    options: {
      top: ['shortCurly'],
      hairColor: ['4a312c'],
      facialHair: ['beardMedium'],
      facialHairColor: ['4a312c'],
      facialHairProbability: 100,
      skinColor: ['ffdbb4'],
      eyebrows: ['defaultNatural'],
      eyes: ['default'],
      mouth: ['smile'],
      clothing: ['blazerAndShirt'],
      clothesColor: ['262e33'],
      accessoriesProbability: 0,
    },
  },
  ...FAMOUS,
}
