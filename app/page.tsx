"use client"

import Link from "next/link"
import { ArrowRight, Target, Users, Zap, CheckCircle, Star } from "lucide-react"
import { useI18n } from "../lib/i18n/hooks"
import Header from "../components/header"
import Footer from "../components/footer"

export default function HomePage() {
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
      <section className="pt-32 pb-20 px-6 h-[100vh] flex items-center">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
              {t("home.hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">{t("home.hero.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl transition-colors font-semibold text-lg flex items-center justify-center gap-2"
              >
                {t("home.hero.cta_primary")}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-xl transition-colors font-semibold text-lg"
              >
                {t("home.hero.cta_secondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("home.features.title")}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t("home.features.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("home.features.realistic_simulations.title")}</h3>
              <p className="text-gray-300 leading-relaxed">{t("home.features.realistic_simulations.description")}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("home.features.instant_feedback.title")}</h3>
              <p className="text-gray-300 leading-relaxed">{t("home.features.instant_feedback.description")}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("home.features.personalized_coaching.title")}</h3>
              <p className="text-gray-300 leading-relaxed">{t("home.features.personalized_coaching.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("home.use_cases.title")}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t("home.use_cases.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "💼",
                title: t("home.use_cases.commercial"),
                description: t("home.use_cases.commercial_desc"),
              },
              {
                icon: "💰",
                title: t("home.use_cases.funding"),
                description: t("home.use_cases.funding_desc"),
              },
              {
                icon: "📈",
                title: t("home.use_cases.salary"),
                description: t("home.use_cases.salary_desc"),
              },
              {
                icon: "🤝",
                title: t("home.use_cases.partnerships"),
                description: t("home.use_cases.partnerships_desc"),
              },
              {
                icon: "🏢",
                title: t("home.use_cases.b2b"),
                description: t("home.use_cases.b2b_desc"),
              },
              {
                icon: "🎯",
                title: t("home.use_cases.personal"),
                description: t("home.use_cases.personal_desc"),
              },
            ].map((useCase, index) => (
              <div
                key={index}
                className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 transition-colors"
              >
                <div className="text-3xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-gray-300">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("home.benefits.title")}</h2>
              <p className="text-xl text-gray-300 mb-8">{t("home.benefits.subtitle")}</p>

              <div className="space-y-4">
                {[
                  t("home.benefits.measurable_improvement"),
                  t("home.benefits.increased_confidence"),
                  t("home.benefits.adapted_techniques"),
                  t("home.benefits.real_time_tracking"),
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl italic mb-4">"{t("home.benefits.testimonial")}"</blockquote>
                <cite className="text-gray-300">— {t("home.benefits.testimonial_author")}</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("home.cta.title")}</h2>
          <p className="text-xl text-gray-300 mb-8">{t("home.cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              {t("home.cta.cta_primary")}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-xl transition-colors font-semibold text-lg"
            >
              {t("home.cta.cta_secondary")}
            </Link>
          </div>
          <p className="text-gray-400 mt-4">{t("home.cta.guarantee")}</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
