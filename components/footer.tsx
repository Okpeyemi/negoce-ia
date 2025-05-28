"use client"

import Link from "next/link"
import Image from "next/image"
import { MessageSquare } from "lucide-react"
import { useI18n } from "../lib/i18n/hooks"

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-gray-800 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
            {/* <MessageSquare className="h-8 w-8 text-blue-500" /> */}
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="hidden md:block" />
              <span className="text-xl font-bold">{t("chat.title")}</span>
            </div>
            <p className="text-gray-400 max-w-md">{t("home.footer.description")}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("home.footer.product")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  {t("home.footer.start")}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  {t("home.footer.login")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t("home.footer.features")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t("home.footer.pricing")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("home.footer.support")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  {t("home.footer.help_center")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t("home.footer.contact")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t("home.footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t("home.footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 {t("chat.title")}. {t("home.footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}
