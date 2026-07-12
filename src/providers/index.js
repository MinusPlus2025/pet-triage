// Provider selection. VITE_MODEL_PROVIDER=qwen|gemini|deepseek chooses the
// backend; defaults to qwen (visual model for demo). All providers expose an
// identical generate() contract, so the shared layer (src/chat.js) and all
// business code are provider-agnostic.
import * as deepseek from './deepseek'
import * as qwen from './qwen'
import * as gemini from './gemini'

const PROVIDERS = { deepseek, qwen, gemini }

export const PROVIDER_NAME = import.meta.env.VITE_MODEL_PROVIDER || 'qwen'

const active = PROVIDERS[PROVIDER_NAME] || PROVIDERS.qwen

export const generate = active.generate

// Whether the active model can read uploaded photos.
// qwen / gemini: vision models — images are sent.
// deepseek: text-only — images are never sent.
export const SUPPORTS_IMAGES = active.supportsImages ?? false
