---
kind: upgrade-guide
description: "The local speech provider package, row id and provider id are renamed, and it now serves Whisper languages beside SenseVoice."
---

# Local speech provider serves SenseVoice and Whisper

English | [中文](guide.zh.md)

## Change

The package `@deepseek-ai/dsh-experimental-speech-to-text-sensevoice` is renamed to `@deepseek-ai/dsh-experimental-speech-to-text-local`. Its Loader row id changes from `speech-to-text-sensevoice` to `speech-to-text-local`, and its default provider id from `sensevoice-local` to `local`. There is no compatibility alias.

One provider now hosts two model families and selects the family from the requested language: SenseVoice serves `auto`, `zh`, `yue`, `en`, `ja` and `ko`; WhisperSmall serves `fr`, `de`, `es`, `pt` and `ru`. Preparation follows the selected language, so only that family's weights download. `whisperModelDirectory` supplies an existing Whisper directory for offline deployments, beside the SenseVoice `modelDirectory`.

`SpeechPreparation` is language-scoped: `snapshot()` / `prepare(options)` become `snapshot(language)` / `prepare(language, options)`. `ctx.speechToText.prepare(id, options)` keeps its signature and forwards this service's selected language.

## Migration

1. Replace the package name, row id and provider id in profiles, `cordis.patch.yml` files and `--patch` overlays; a row that keeps the old package name fails to load.
2. Update any saved `defaultProvider` override to `local`. A stale `sensevoice-local` selection fails because no provider registers that id.
3. Re-run preparation after selecting a Whisper language: German, Spanish, Portuguese, Russian and French recordings need that family's weights.
4. Offline deployments keep `modelDirectory` and `vadModelPath`. Add `whisperModelDirectory` only when a Whisper language must work without downloads.
5. Custom speech providers replace `snapshot()` with `snapshot(language)` and `prepare(options)` with `prepare(language, options)`, then verify that the language selector shows the correct readiness for each language.
