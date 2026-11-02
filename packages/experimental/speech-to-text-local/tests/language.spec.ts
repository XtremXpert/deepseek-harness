/** Language routing selects the model family that recognizes each accepted hint. */
import { expect, it } from 'vitest'
import { familyOf, languages, sensevoiceLanguages, whisperLanguages } from '../src/input.ts'

it('routes every accepted language to the model that recognizes it', () => {
  expect(languages).toEqual([...sensevoiceLanguages, ...whisperLanguages])
  for (const language of ['auto', 'zh', 'yue', 'en', 'ja', 'ko']) expect(familyOf(language)).toBe('sensevoice')
  for (const language of ['fr', 'de', 'es', 'pt', 'ru']) expect(familyOf(language)).toBe('whisper')
})

it('offers French beside the languages the bundled models recognize', () => {
  expect(whisperLanguages).toContain('fr')
  expect(sensevoiceLanguages).not.toContain('fr')
})
