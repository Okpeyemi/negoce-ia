"use client"

import { Search, HelpCircle, Book, Mail } from "lucide-react"
import { useState } from "react"
import { useI18n } from "../../lib/i18n/hooks"
import Header from "../../components/header"
import Footer from "../../components/footer"

export default function HelpPage() {
  const { t, isLoading } = useI18n()
  const [searchQuery, setSearchQuery] = useState("")

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

  const guides = [
    {
      title: t("help.guides.quick_start.title"),
      description: t("help.guides.quick_start.description"),
      icon: "🚀",
    },
    {
      title: t("help.guides.advanced_techniques.title"),
      description: t("help.guides.advanced_techniques.description"),
      icon: "🎯",
    },
    {
      title: t("help.guides.preparation.title"),
      description: t("help.guides.preparation.description"),
      icon: "📋",
    },
    {
      title: t("help.guides.analytics.title"),
      description: t("help.guides.analytics.description"),
      icon: "📊",
    },
  ]

  const faqItems = [
    {
      question: t("help.faq_items.getting_started.question"),
      answer: t("help.faq_items.getting_started.answer"),
    },
    {
      question: t("help.faq_items.privacy.question"),
      answer: t("help.faq_items.privacy.answer"),
    },
    {
      question: t("help.faq_items.types.question"),
      answer: t("help.faq_items.types.answer"),
    },
    {
      question: t("help.faq_items.improvement.question"),
      answer: t("help.faq_items.improvement.answer"),
    },
    {
      question: t("help.faq_items.limits.question"),
      answer: t("help.faq_items.limits.answer"),
    },
    {
      question: t("help.faq_items.export.question"),
      answer: t("help.faq_items.export.answer"),
    },
  ]

  const filteredFaq = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <HelpCircle className="h-12 w-12 text-blue-500" />
            <h1 className="text-5xl md:text-6xl font-bold">{t("help.title")}</h1>
          </div>
          <p className="text-xl text-gray-300 mb-8">{t("help.subtitle")}</p>
        </div>
      </section>

      {/* Search */}
      <section className="pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t("help.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-6 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t("help.quick_guides")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer"
              >
                <div className="text-3xl mb-4">{guide.icon}</div>
                <h3 className="font-semibold mb-2">{guide.title}</h3>
                <p className="text-gray-400 text-sm">{guide.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center flex items-center justify-center gap-3">
            <Book className="h-10 w-10 text-blue-500" />
            {t("help.faq")}
          </h2>

          <div className="space-y-4">
            {filteredFaq.map((item, index) => (
              <details
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
              >
                <summary className="font-semibold cursor-pointer text-lg mb-4 hover:text-blue-400 transition-colors">
                  {item.question}
                </summary>
                <p className="text-gray-300 leading-relaxed pl-4 border-l-2 border-blue-500/30">{item.answer}</p>
              </details>
            ))}
          </div>

          {filteredFaq.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-400">{t("help.no_results", { query: searchQuery })}</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-6 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30 text-center">
            <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">{t("help.need_more_help")}</h3>
            <p className="text-gray-300 mb-6">{t("help.contact_team")}</p>
            <a
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium inline-flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              {t("help.contact_us")}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
