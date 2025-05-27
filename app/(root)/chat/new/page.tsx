"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "../../../../lib/auth"
import { conversationService } from "../../../../lib/conversations"
import { useI18n } from "../../../../lib/i18n/hooks"

export default function NewChatPage() {
  const { t, isLoading: i18nLoading } = useI18n()
  const router = useRouter()

  useEffect(() => {
    const createNewConversation = async () => {
      try {
        // Vérifier l'authentification
        const { user } = await authService.getCurrentUser()
        if (!user) {
          router.push("/login")
          return
        }

        // Attendre un peu pour s'assurer que l'authentification est complètement établie
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Créer une nouvelle conversation avec titre automatique
        const { data: conversation, error } = await conversationService.createConversation(user.id)

        if (error) {
          console.error("Erreur lors de la création de la conversation:", error)
          // Si la création échoue, essayer de récupérer une conversation existante
          const { data: existingConversations } = await conversationService.getUserConversations(user.id)
          if (existingConversations && existingConversations.length > 0) {
            // Rediriger vers la conversation la plus récente
            router.push(`/chat/${existingConversations[0].id}`)
          } else {
            // Créer une conversation avec un titre de fallback
            const { data: fallbackConversation } = await conversationService.createConversation(
              user.id,
              `Session ${Date.now()}`,
            )
            if (fallbackConversation) {
              router.push(`/chat/${fallbackConversation.id}`)
            } else {
              // En dernier recours, rediriger vers login
              router.push("/login")
            }
          }
        } else if (conversation) {
          router.push(`/chat/${conversation.id}`)
        }
      } catch (error) {
        console.error("Erreur lors de la création de conversation:", error)
        router.push("/login")
      }
    }

    if (!i18nLoading) {
      createNewConversation()
    }
  }, [router, i18nLoading])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">{i18nLoading ? "Loading..." : t("chat.creating_conversation")}</p>
      </div>
    </div>
  )
}
