"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { authService } from "@/lib/auth"
import { useI18n } from "@/lib/i18n/hooks"
import LanguageSwitcher from "@/components/language-switcher"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function SelectPlanPage() {
  const { t, isLoading: i18nLoading } = useI18n()
  const router = useRouter()
  // Initialiser à null au lieu de "basic"
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [currentSubscription, setCurrentSubscription] = useState<any>(null)
  const [isLoadingData, setIsLoadingData] = useState(true) // Ajouter un état de chargement

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Vérifier l'authentification
        const { user: currentUser } = await authService.getCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }
        
        setUser(currentUser)
        
        // Récupérer la souscription actuelle
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", currentUser.id)
          .single()
          
        if (subscription) {
          setCurrentSubscription(subscription)
          setSelectedPlan(subscription.plan) // Maintenant on définit le plan sélectionné
        } else {
          // Si pas de souscription, sélectionner basic par défaut
          setSelectedPlan("basic")
        }
      } catch (error) {
        console.error("Erreur:", error)
        router.push("/login")
      } finally {
        setIsLoadingData(false) // Chargement terminé
      }
    }

    if (!i18nLoading) {
      loadUserData()
    }
  }, [router, i18nLoading])

  const handleSubmit = async () => {
    if (!user || !currentSubscription || !selectedPlan) return

    setIsSubmitting(true)
    try {
      // Utiliser la fonction updateSubscription du service auth
      const { data, error } = await authService.updateSubscription(user.id, selectedPlan)

      if (error) {
        console.error("Erreur lors de la mise à jour:", error)
        return
      }

      if (data) {
        console.log("Souscription mise à jour avec succès:", data)
        setCurrentSubscription(data) // Mettre à jour l'état local
      }

      // Rediriger vers le profil avec un message de succès
      router.push("/profile?message=subscription_updated")
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Vérifier si le plan actuel est différent du plan sélectionné
  const isPlanChanged = currentSubscription && selectedPlan && currentSubscription.plan !== selectedPlan
  const isButtonDisabled = isSubmitting || !isPlanChanged || !selectedPlan

  if (i18nLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header avec sélecteur de langue */}
      <div className="flex fixed top-0 left-0 right-0 justify-end items-center p-2">
        <LanguageSwitcher />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center gap-2">
              <h1 className="text-4xl font-bold text-white mb-2">
                {t("chat.title")}
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-white mb-2">
              Gérer votre abonnement
            </h2>
            <p className="text-gray-400">
              {currentSubscription 
                ? `Plan actuel : ${currentSubscription.plan === "basic" ? "Gratuit" : "Premium"}`
                : "Sélectionnez le plan qui correspond le mieux à vos besoins"
              }
            </p>
          </div>

          {/* Plans */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Plan Basic */}
              <div 
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  selectedPlan === "basic" 
                    ? "border-blue-500 bg-blue-500/10 shadow-lg scale-105" 
                    : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/30"
                } ${currentSubscription?.plan === "basic" ? "ring-2 ring-green-500/50" : ""}`}
                onClick={() => setSelectedPlan("basic")}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-white">Plan Gratuit</h3>
                    {currentSubscription?.plan === "basic" && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                        Actuel
                      </span>
                    )}
                  </div>
                  {selectedPlan === "basic" && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-3xl font-bold text-white mb-4">
                  0€<span className="text-sm font-normal text-gray-400">/mois</span>
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>10 messages par jour</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Modèles de base</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Support communautaire</span>
                  </li>
                </ul>
              </div>

              {/* Plan Premium */}
              <div 
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 relative ${
                  selectedPlan === "premium" 
                    ? "border-blue-500 bg-blue-500/10 shadow-lg scale-105" 
                    : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/30"
                } ${currentSubscription?.plan === "premium" ? "ring-2 ring-green-500/50" : ""}`}
                onClick={() => setSelectedPlan("premium")}
              >
                {/* Badge Populaire */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Populaire
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-white">Plan Premium</h3>
                    {currentSubscription?.plan === "premium" && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                        Actuel
                      </span>
                    )}
                  </div>
                  {selectedPlan === "premium" && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-3xl font-bold text-white mb-4">
                  9€<span className="text-sm font-normal text-gray-400">/mois</span>
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Messages illimités</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Tous les modèles IA</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Support prioritaire</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Fonctionnalités avancées</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bouton de confirmation */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={isButtonDisabled}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-colors min-w-[200px] ${
                  isButtonDisabled
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Mise à jour...
                  </div>
                ) : !isPlanChanged ? (
                  "Plan déjà sélectionné"
                ) : selectedPlan ? (
                  `Passer au plan ${selectedPlan === "basic" ? "Gratuit" : "Premium"}`
                ) : (
                  "Sélectionnez un plan"
                )}
              </button>
              
              <p className="text-gray-400 text-sm mt-4">
                {isPlanChanged 
                  ? "Le changement sera effectif immédiatement"
                  : "Vous êtes déjà sur ce plan"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}