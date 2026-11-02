---
kind: upgrade-guide
description: "本地语音 Provider 的包名、配置行 id 与 Provider id 均已重命名，并且在 SenseVoice 之外新增 Whisper 语言。"
---

# 本地语音 Provider 同时服务 SenseVoice 与 Whisper

[English](guide.md) | 中文

## 变更

包 `@deepseek-ai/dsh-experimental-speech-to-text-sensevoice` 重命名为 `@deepseek-ai/dsh-experimental-speech-to-text-local`。其 Loader 行 id 从 `speech-to-text-sensevoice` 改为 `speech-to-text-local`，默认 Provider id 从 `sensevoice-local` 改为 `local`。不提供兼容别名。

一个 Provider 现在承载两个模型家族，并按所请求语言选用家族：SenseVoice 服务 `auto`、`zh`、`yue`、`en`、`ja` 和 `ko`；WhisperSmall 服务 `fr`、`de`、`es`、`pt` 和 `ru`。准备跟随所选语言，因此只会下载该家族的权重。`whisperModelDirectory` 为离线部署提供已有的 Whisper 目录，与 SenseVoice 的 `modelDirectory` 并列。

`SpeechPreparation` 按语言工作：`snapshot()` / `prepare(options)` 变为 `snapshot(language)` / `prepare(language, options)`。`ctx.speechToText.prepare(id, options)` 的签名不变，并转发本服务当前所选语言。

## 迁移

1. 在 profile、`cordis.patch.yml` 与 `--patch` 覆盖中替换包名、行 id 与 Provider id；沿用旧包名的行会加载失败。
2. 把已保存的 `defaultProvider` 覆盖值改为 `local`。残留的 `sensevoice-local` 会因没有 Provider 注册该 id 而失败。
3. 选择 Whisper 语言后重新执行准备：德语、西班牙语、葡萄牙语、俄语和法语录音需要该家族的权重。
4. 离线部署继续使用 `modelDirectory` 与 `vadModelPath`；只有当 Whisper 语言必须无下载可用时才添加 `whisperModelDirectory`。
5. 自定义语音 Provider 把 `snapshot()` 改为 `snapshot(language)`、把 `prepare(options)` 改为 `prepare(language, options)`，并验证语言选择器对每种语言显示正确的就绪状态。
