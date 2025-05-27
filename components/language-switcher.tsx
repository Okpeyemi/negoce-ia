"use client"

import { useState, useRef, useEffect } from "react"
import { Globe } from "lucide-react"
import { useI18n } from "../lib/i18n/hooks"
import { locales, localeNames, localeFlags } from "../lib/i18n/config"
import type { Locale } from "../lib/i18n/config"

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton de langue */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        title="Change language"
      >
        {/* <Globe className="h-5 w-5" /> */}
        <span className="text-sm font-medium">{localeFlags[locale]}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50">
          <div className="py-2">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`w-full px-4 py-3 text-left transition-colors flex items-center gap-3 cursor-pointer ${
                  locale === loc ? "bg-blue-600/20 text-blue-400" : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <span className="text-lg">{localeFlags[loc]}</span>
                <span className="font-medium">{localeNames[loc]}</span>
                {locale === loc && <span className="ml-auto text-blue-400">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
