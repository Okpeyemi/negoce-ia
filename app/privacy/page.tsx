"use client"

import { Shield, Eye, Lock, Database } from "lucide-react"
import { useI18n } from "../../lib/i18n/hooks"
import Header from "../../components/header"
import Footer from "../../components/footer"

export default function PrivacyPage() {
  const { t, isLoading } = useI18n()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="h-12 w-12 text-blue-500" />
            <h1 className="text-5xl md:text-6xl font-bold">{t("privacy.title")}</h1>
          </div>
          <p className="text-xl text-gray-300 mb-4">{t("privacy.subtitle")}</p>
          <p className="text-gray-400">
            <strong>{t("privacy.last_updated")}</strong> 15 janvier 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Database className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl font-bold">{t("privacy.data_collected.title")}</h2>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">{t("privacy.data_collected.subtitle")}</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t("privacy.data_collected.account_info")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t("privacy.data_collected.conversations")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t("privacy.data_collected.usage_data")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t("privacy.data_collected.technical_data")}</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Eye className="h-6 w-6 text-green-500" />
                <h2 className="text-2xl font-bold">{t("privacy.data_usage.title")}</h2>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">{t("privacy.data_usage.subtitle")}</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t("privacy.data_usage.provide_services")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t("privacy.data_usage.personalize")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t("privacy.data_usage.security")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t("privacy.data_usage.support")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t("privacy.data_usage.analytics")}</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Lock className="h-6 w-6 text-purple-500" />
                <h2 className="text-2xl font-bold">{t("privacy.data_protection.title")}</h2>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">{t("privacy.data_protection.subtitle")}</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t("privacy.data_protection.encryption")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t("privacy.data_protection.limited_access")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t("privacy.data_protection.monitoring")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t("privacy.data_protection.audits")}</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">{t("privacy.your_rights.title")}</h2>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <p className="text-gray-300 mb-4">{t("privacy.your_rights.subtitle")}</p>
                <ul className="space-y-2 text-gray-300">
                  <li>• {t("privacy.your_rights.access")}</li>
                  <li>• {t("privacy.your_rights.rectification")}</li>
                  <li>• {t("privacy.your_rights.erasure")}</li>
                  <li>• {t("privacy.your_rights.portability")}</li>
                  <li>• {t("privacy.your_rights.objection")}</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">{t("privacy.contact.title")}</h2>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <p className="text-gray-300 mb-4">{t("privacy.contact.subtitle")}</p>
                <ul className="space-y-2 text-gray-300">
                  <li>• {t("privacy.contact.email")}</li>
                  <li>
                    • {t("privacy.contact.form")}{" "}
                    <a href="/contact" className="text-blue-400 hover:text-blue-300">
                      page contact
                    </a>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
