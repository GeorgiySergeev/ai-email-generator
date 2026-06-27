'use client'

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

type NestedMessages = { [key: string]: string | NestedMessages }

type I18nContextValue = {
  locale: string
  messages: NestedMessages
  t: (namespace: string, key: string) => string
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  messages: {},
  t: (_ns, key) => key,
})

export const useI18n = () => useContext(I18nContext)

type I18nProviderProps = {
  locale: string
  messages: NestedMessages
  children: ReactNode
}

export const I18nProvider = ({ locale, messages, children }: I18nProviderProps) => {
  const t = (namespace: string, key: string): string => {
    const ns = messages[namespace]
    if (ns && typeof ns === 'object' && !Array.isArray(ns)) {
      const val = (ns as Record<string, string>)[key]
      return val ?? key
    }
    return key
  }

  return <I18nContext.Provider value={{ locale, messages, t }}>{children}</I18nContext.Provider>
}
