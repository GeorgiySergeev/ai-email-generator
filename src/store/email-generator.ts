import { create } from 'zustand'
import type { GeneratedEmail } from '@/types'

type GeneratorState = {
  lastResult: GeneratedEmail | null
  isGenerating: boolean
  error: string | null
}

type GeneratorActions = {
  setResult: (email: GeneratedEmail | null) => void
  setGenerating: (value: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const INITIAL_STATE: GeneratorState = {
  lastResult: null,
  isGenerating: false,
  error: null,
}

export const useEmailGeneratorStore = create<GeneratorState & GeneratorActions>((set) => ({
  ...INITIAL_STATE,
  setResult: (email) => set({ lastResult: email, error: null }),
  setGenerating: (value) => set({ isGenerating: value }),
  setError: (error) => set({ error }),
  reset: () => set(INITIAL_STATE),
}))
