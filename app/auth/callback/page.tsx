"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabase"
import { authService } from "../../../lib/auth"
import { conversationService } from "../../../lib/conversations"
import { useI18n } from "../../../lib/i18n/hooks"

export default function AuthCallback() {
  const { t, isLoading: i18nLoading } = useI18n()
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Récupérer la session depuis l'URL
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Erreur lors de la récupération de la session:", error)
          router.push("/login?error=auth_error")
          return
        }

        if (session?.user) {
          // Créer ou mettre à jour le profil utilisateur
          const { error: profileError } = await authService.upsertProfile(session.user)

          if (profileError) {
            console.error("Erreur lors de la création du profil:", profileError)
          }

          // Créer une nouvelle conversation pour l'utilisateur
          const { data: conversation, error: convError } = await conversationService.createConversation(session.user.id)

          if (convError) {
            console.error("Erreur lors de la création de la conversation:", convError)
            // Rediriger vers chat/new qui gérera la création
            router.push("/chat/new")
          } else if (conversation) {
            // Rediriger vers la nouvelle conversation
            router.push(`/chat/${conversation.id}`)
          } else {
            // Fallback vers chat/new
            router.push("/chat/new")
          }
        } else {
          // Pas de session, rediriger vers login
          router.push("/login")
        }
      } catch (error) {
        console.error("Erreur lors du callback d'authentification:", error)
        router.push("/login?error=callback_error")
      }
    }

    if (!i18nLoading) {
      handleAuthCallback()
    }
  }, [router, i18nLoading])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">{i18nLoading ? "Loading..." : t("auth.callback.connecting")}</p>
        <p className="text-gray-500 text-sm mt-2">{!i18nLoading && t("auth.callback.please_wait")}</p>
      </div>
    </div>
  )
}
