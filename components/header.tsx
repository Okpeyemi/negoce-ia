"use client"

import Link from "next/link"
import { MessageSquare } from "lucide-react"
import { useI18n } from "../lib/i18n/hooks"
import LanguageSwitcher from "./language-switcher"

export default function Header() {
  const { t } = useI18n()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">{t("chat.title")}</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
              {t("navigation.login")}
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-medium"
            >
              {t("navigation.register")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
