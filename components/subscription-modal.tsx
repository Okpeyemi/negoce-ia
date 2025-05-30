"use client"

import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import { authService } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { useI18n } from "@/lib/i18n/hooks"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  currentPlan?: string
  onPlanUpdated: (newPlan: string) => void
}

export default function SubscriptionModal({ 
  isOpen, 
  onClose, 
  userId, 
  currentPlan,
  onPlanUpdated 
}: SubscriptionModalProps) {
  const { t } = useI18n()
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">(currentPlan as "basic" | "premium" || "basic")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (currentPlan) {
      setSelectedPlan(currentPlan as "basic" | "premium")
    }
  }, [currentPlan])

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!selectedPlan || selectedPlan === currentPlan) return

    setIsSubmitting(true)
    try {
      const { data, error } = await authService.updateSubscription(userId, selectedPlan)

      if (error) {
        console.error("Erreur lors de la mise à jour:", error)
        return
      }

      if (data) {
        onPlanUpdated(selectedPlan)
        onClose()
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isPlanChanged = selectedPlan !== currentPlan
  const isButtonDisabled = isSubmitting || !isPlanChanged

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            Gérer votre abonnement
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentPlan && (
            <p className="text-center text-gray-400 mb-6">
              Plan actuel : <span className="text-white font-medium">
                {currentPlan === "basic" ? "Gratuit" : "Premium"}
              </span>
            </p>
          )}

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Plan Basic */}
            <div 
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                selectedPlan === "basic" 
                  ? "border-blue-500 bg-blue-500/10 shadow-lg scale-105" 
                  : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/30"
              } ${currentPlan === "basic" ? "ring-2 ring-green-500/50" : ""}`}
              onClick={() => setSelectedPlan("basic")}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-white">Plan Gratuit</h3>
                  {currentPlan === "basic" && (
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
              } ${currentPlan === "premium" ? "ring-2 ring-green-500/50" : ""}`}
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
                  {currentPlan === "premium" && (
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

          {/* Footer avec boutons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isButtonDisabled}
              className={`px-8 py-3 rounded-xl font-semibold transition-colors min-w-[200px] ${
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
          </div>
        </div>
      </div>
    </div>
  )
}