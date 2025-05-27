"use client"

import { FileText, AlertTriangle, CheckCircle } from "lucide-react"
import { useI18n } from "../../lib/i18n/hooks"
import Header from "../../components/header"
import Footer from "../../components/footer"

export default function TermsPage() {
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
            <FileText className="h-12 w-12 text-blue-500" />
            <h1 className="text-5xl md:text-6xl font-bold">{t("terms.title")}</h1>
          </div>
          <p className="text-xl text-gray-300 mb-4">{t("terms.subtitle")}</p>
          <p className="text-gray-400">
            <strong>{t("terms.last_updated")}</strong> 15 janvier 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                {t("terms.acceptance.title")}
              </h2>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed">{t("terms.acceptance.content")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">{t("terms.service_description.title")}</h2>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <p className="text-gray-300 mb-4">{t("terms.service_description.subtitle")}</p>
                <ul className="space-y-2 text-gray-300">
                  <li>• {t("terms.service_description.ai_assistant")}</li>
                  <li>• {t("terms.service_description.simulations")}</li>
                  <li>• {t("terms.service_description.advice")}</li>
                  <li>• {t("terms.service_description.tracking")}</li>
                  <li>• {t("terms.service_description.platform")}</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">{t("terms.acceptable_use.title")}</h2>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-400">{t("terms.acceptable_use.you_can")}</h3>
                <ul className="space-y-2 text-gray-300 mb-6">
                  <li>• {t("terms.acceptable_use.learning")}</li>
                  <li>• {t("terms.acceptable_use.conversations")}</li>
                  <li>• {t("terms.acceptable_use.feedback")}</li>
                  <li>• {t("terms.acceptable_use.professional")}</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {t("terms.acceptable_use.you_cannot")}
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• {t("terms.acceptable_use.illegal")}</li>
                  <li>• {t("terms.acceptable_use.security")}</li>
                  <li>• {t("terms.acceptable_use.sharing")}</li>
                  <li>• {t("terms.acceptable_use.bots")}</li>
                  <li>• {t("terms.acceptable_use.copying")}</li>
                  <li>• {t("terms.acceptable_use.harassment")}</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">{t("terms.liability.title")}</h2>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-200 font-medium mb-2">{t("terms.liability.important")}</p>
                      <p className="text-yellow-100 text-sm">{t("terms.liability.disclaimer")}</p>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li>• {t("terms.liability.as_is")}</li>
                  <li>• {t("terms.liability.accuracy")}</li>
                  <li>• {t("terms.liability.own_risk")}</li>
                  <li>• {t("terms.liability.limited")}</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">{t("terms.contact.title")}</h2>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <p className="text-gray-300 mb-4">{t("terms.contact.subtitle")}</p>
                <ul className="space-y-2 text-gray-300">
                  <li>• {t("terms.contact.email")}</li>
                  <li>
                    • {t("terms.contact.form")}{" "}
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
