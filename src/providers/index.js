// Provider selection. VITE_MODEL_PROVIDER=gemini|qwen chooses the backend;
// defaults to gemini. Both providers expose an identical generate() contract,
// so the shared layer (src/chat.js) and all business code are provider-agnostic.
import * as gemini from './gemini'
import * as qwen from './qwen'

const PROVIDERS = { gemini, qwen }

export const PROVIDER_NAME = import.meta.env.VITE_MODEL_PROVIDER || 'gemini'

const active = PROVIDERS[PROVIDER_NAME] || gemini

export const generate = active.generate
