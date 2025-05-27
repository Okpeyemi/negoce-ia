"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Locale } from "./config"
import { defaultLocale } from "./config"
import type { Dictionary } from "./dictionaries"
import { getDictionary } from "./dictionaries"

interface I18nContextType {
  locale: Locale
  dictionary: Dictionary | null
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
  isLoading: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [dictionary, setDictionary] = useState<Dictionary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Charger la locale depuis localStorage au montage (côté client uniquement)
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && ["fr", "en"].includes(savedLocale)) {
      setLocaleState(savedLocale)
    }
  }, [])

  // Charger le dictionnaire quand la locale change
  useEffect(() => {
    const loadDictionary = async () => {
      setIsLoading(true)
      try {
        const dict = await getDictionary(locale)
        setDictionary(dict)
      } catch (error) {
        console.error("Erreur lors du chargement du dictionnaire:", error)
        // Fallback vers le dictionnaire français
        const fallbackDict = await getDictionary("fr")
        setDictionary(fallbackDict)
      } finally {
        setIsLoading(false)
      }
    }
    loadDictionary()
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  // Fonction de traduction avec support des paramètres
  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!dictionary) return key

    const keys = key.split(".")
    let value: any = dictionary

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        return key // Retourner la clé si la traduction n'est pas trouvée
      }
    }

    if (typeof value !== "string") {
      return key
    }

    // Remplacer les paramètres dans la chaîne
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }

    return value
  }

  return (
    <I18nContext.Provider value={{ locale, dictionary, setLocale, t, isLoading }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
