"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Mail, Save, Camera, CreditCard } from "lucide-react"
import { authService } from "../../../lib/auth"
import { useI18n } from "../../../lib/i18n/hooks"
import LanguageSwitcher from "../../../components/language-switcher"
import UserDropdown from "../../../components/user-dropdown"
import SubscriptionModal from "../../../components/subscription-modal"
import { supabase } from "../../../lib/supabase"

interface ProfileData {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role?: string
}

interface Subscription {
  plan: string
  status: string
  expires_at: string
}

const ProfilePage = () => {
  const { t, isLoading: i18nLoading } = useI18n()
  const router = useRouter()
  const [user, setUser] = useState<ProfileData | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState("")

  // Charger les données utilisateur au montage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { user: currentUser } = await authService.getCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }

        // Récupérer le profil complet
        const { data: profile, error } = await authService.getProfile(currentUser.id)
        if (error) {
          console.error("Erreur lors du chargement du profil:", error)
        }

        const userData = {
          id: currentUser.id,
          email: currentUser.email || "",
          full_name: profile?.full_name || "",
          avatar_url: profile?.avatar_url || undefined,
          role: profile?.role || "user",
        }

        setUser(userData)
        setFormData({
          full_name: userData.full_name,
          email: userData.email,
        })

        // Charger la souscription
        const { data: subscriptionData } = await supabase
          .from("subscriptions")
          .select("plan, status, expires_at")
          .eq("user_id", currentUser.id)
          .single()

        if (subscriptionData) {
          setSubscription(subscriptionData)
        }

      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    if (!i18nLoading) {
      loadUserData()
    }
  }, [router, i18nLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Effacer l'erreur quand l'utilisateur tape
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Effacer le message de succès
    if (successMessage) {
      setSuccessMessage("")
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = t("auth.errors.name_required")
    }

    if (!formData.email.trim()) {
      newErrors.email = t("auth.errors.email_required")
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("auth.errors.email_invalid")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user) return

    setIsSaving(true)
    setErrors({})

    try {
      // Mettre à jour le profil
      const { error: profileError } = await authService.updateProfile(user.id, {
        full_name: formData.full_name.trim(),
      })

      if (profileError) {
        setErrors({ general: t("profile.error") })
        console.error("Erreur profil:", profileError)
        return
      }

      // Mettre à jour l'état local
      setUser((prev) => (prev ? { ...prev, full_name: formData.full_name.trim() } : null))
      setSuccessMessage(t("profile.success"))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      setErrors({ general: t("auth.errors.unexpected_error") })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarClick = () => {
    // TODO: Implémenter l'upload d'avatar
    console.log("Upload d'avatar à implémenter")
  }

  const handlePlanUpdated = (subscriptionData: any) => {
    setSubscription(subscriptionData) // Utiliser directement les données complètes
    setSuccessMessage(t("profile.subscription.updated_success"))
  }

  // Afficher un loader pendant le chargement
  if (i18nLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{i18nLoading ? "Loading..." : t("profile.loading")}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900/95 border-b border-gray-800 fixed top-0 left-0 right-0 z-10 items-center justify-center backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-white">{t("profile.title")}</h1>
            </div>
            
            {/* Navigation avec UserDropdown */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {user && (
                <UserDropdown 
                  userEmail={user.email} 
                  userName={user.full_name} 
                  profileRole={user.role || "user"} 
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 pb-8 pt-40 max-md:pt-30">
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
          {/* Messages */}
          {errors.general && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {errors.general}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              {successMessage}
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url || "/placeholder.svg"}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-4 right-0 p-2 bg-gray-700 hover:bg-gray-600 rounded-full border-2 border-gray-800 transition-colors"
                title={t("profile.change_avatar")}
              >
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
            <p className="text-gray-400 text-sm">{t("profile.click_to_change")}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
                {t("profile.full_name")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-700/50 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.full_name ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-500"
                  }`}
                  placeholder={t("profile.full_name")}
                />
              </div>
              {errors.full_name && <p className="mt-1 text-sm text-red-400">{errors.full_name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                {t("profile.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={true} // Désactivé pour l'instant
                  className={`w-full bg-gray-700/30 border rounded-xl pl-10 pr-4 py-3 text-gray-400 placeholder-gray-500 cursor-not-allowed ${
                    errors.email ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              <p className="mt-1 text-xs text-gray-500">{t("profile.email_change_disabled")}</p>
            </div>

            {/* Account Info */}
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
              <h3 className="text-white font-medium mb-2">{t("profile.account_info")}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t("profile.user_id")}</span>
                  <span className="text-gray-300 font-mono text-xs">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t("profile.account_type")}</span>
                  <span className="text-gray-300">
                    {user.role === "admin" ? t("profile.admin") : t("profile.user")}
                  </span>
                </div>
              </div>
            </div>

            {/* Subscription Info */}
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">{t("profile.subscription.title")}</h3>
                {/* <button
                  type="button"
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <CreditCard className="h-4 w-4" />
                  {t("profile.subscription.manage")}
                </button> */}
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed opacity-75"
                  title={t("profile.subscription.coming_soon")}
                >
                  <CreditCard className="h-4 w-4" />
                  {t("profile.subscription.coming_soon")}
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t("profile.subscription.current_plan")}</span>
                  <span className="text-gray-300">
                    {subscription?.plan === "basic" 
                      ? t("subscription.plans.basic.name") 
                      : subscription?.plan === "premium" 
                      ? t("subscription.plans.premium.name") 
                      : t("profile.subscription.undefined")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t("profile.subscription.status")}</span>
                  <span className={`text-sm font-medium ${
                    subscription?.status === "active" ? "text-green-400" : "text-yellow-400"
                  }`}>
                    {subscription?.status === "active" 
                      ? t("profile.subscription.active") 
                      : subscription?.status || t("profile.subscription.inactive")}
                  </span>
                </div>
                {subscription?.plan === "premium" && subscription?.expires_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("profile.subscription.expires_on")}</span>
                    <span className="text-gray-300">
                      {new Date(subscription.expires_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex max-sm:flex-col gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors cursor-pointer font-medium"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  isSaving ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    {t("profile.saving")}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {t("profile.save")}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Subscription Modal */}
      {user && (
        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
          userId={user.id}
          currentPlan={subscription?.plan as "basic" | "premium" | undefined}
          onPlanUpdated={handlePlanUpdated}
        />
      )}
    </div>
  )
}

export default ProfilePage
