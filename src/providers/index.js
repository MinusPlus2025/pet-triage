// Provider selection. VITE_MODEL_PROVIDER=deepseek|qwen|gemini chooses the
// backend; defaults to deepseek. All providers expose an identical generate()
// contract, so the shared layer (src/chat.js) and all business code are
// provider-agnostic. (§2 — DeepSeek primary, switchable)
import * as deepseek from './deepseek'
import * as qwen from './qwen'
import * as gemini from './gemini'

const PROVIDERS = { deepseek, qwen, gemini }

export const PROVIDER_NAME = import.meta.env.VITE_MODEL_PROVIDER || 'deepseek'

const active = PROVIDERS[PROVIDER_NAME] || deepseek

export const generate = active.generate

// Whether the active model can read uploaded photos. The UI uses this to be
// honest when a text-only model (e.g. DeepSeek) is active. (§2)
export const PROVIDER_SUPPORTS_IMAGES = active.supportsImages ?? false
