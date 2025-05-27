"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Forward, ListCollapse, SquarePen, Paperclip } from "lucide-react"
import { fetchAIResponse } from "../../../../lib/openrouter"
import { authService } from "../../../../lib/auth"
import { conversationService } from "../../../../lib/conversations"
import ReactMarkdown from "react-markdown"
import UserDropdown from "../../../../components/user-dropdown"
import ConversationsModal from "../../../../components/conversations-modal"
import { useI18n } from "../../../../lib/i18n/hooks"
import LanguageSwitcher from "../../../../components/language-switcher"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  created_at: string
}

const ChatPage = () => {
  const { t, locale, isLoading: i18nLoading } = useI18n()
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string

  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState("")
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null)
  const [conversation, setConversation] = useState<{ id: string; title: string } | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isConversationsModalOpen, setIsConversationsModalOpen] = useState(false)
  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false)

  // Vérifier l'authentification et charger les données au chargement
  useEffect(() => {
    const loadData = async () => {
      try {
        // Vérifier l'authentification
        const { user: currentUser } = await authService.getCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }

        // Récupérer le profil de l'utilisateur
        const { data: profile } = await authService.getProfile(currentUser.id)
        setUser({
          id: currentUser.id,
          email: currentUser.email || "",
          name: profile?.full_name || undefined,
        })

        // Gérer le cas spécial où l'ID est "new"
        if (conversationId === "new") {
          // Créer une nouvelle conversation avec titre automatique
          const { data: newConversation, error: createError } = await conversationService.createConversation(
            currentUser.id,
          )

          if (createError) {
            console.error("Erreur lors de la création de la conversation:", createError)
            // Essayer de récupérer une conversation existante
            const { data: existingConversations } = await conversationService.getUserConversations(currentUser.id)
            if (existingConversations && existingConversations.length > 0) {
              // Rediriger vers la conversation la plus récente
              router.replace(`/chat/${existingConversations[0].id}`)
              return
            } else {
              // En dernier recours, rediriger vers login
              router.push("/login")
              return
            }
          } else if (newConversation) {
            // Rediriger vers la nouvelle conversation créée
            router.replace(`/chat/${newConversation.id}`)
            return
          }
        }

        // Vérifier que la conversation existe et appartient à l'utilisateur
        const { data: conversationData, error: convError } = await conversationService.getConversation(
          conversationId,
          currentUser.id,
        )

        if (convError || !conversationData) {
          console.error("Conversation non trouvée:", convError)
          // Essayer de créer une nouvelle conversation si celle-ci n'existe pas
          const { data: newConversation, error: createError } = await conversationService.createConversation(
            currentUser.id,
          )

          if (createError || !newConversation) {
            router.push("/login")
            return
          } else {
            router.replace(`/chat/${newConversation.id}`)
            return
          }
        }

        setConversation(conversationData)

        // Charger les messages de la conversation
        const { data: messagesData, error: messagesError } = await conversationService.getMessages(conversationId)

        if (messagesError) {
          console.error("Erreur lors du chargement des messages:", messagesError)
        } else if (messagesData) {
          setMessages(messagesData)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        router.push("/login")
      } finally {
        setIsLoadingData(false)
      }
    }

    if (conversationId && !i18nLoading) {
      loadData()
    }
  }, [conversationId, router, i18nLoading])

  const handleNewConversation = async () => {
    if (!user || isCreatingNewChat) return

    setIsCreatingNewChat(true)

    try {
      const { data: newConversation, error } = await conversationService.createConversation(user.id)

      if (error) {
        console.error("Erreur lors de la création de la conversation:", error)
      } else if (newConversation) {
        // Rediriger vers la nouvelle conversation
        router.push(`/chat/${newConversation.id}`)
      }
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error)
    } finally {
      setIsCreatingNewChat(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user || !conversation) return

    const userMessage = messageInput.trim()
    setMessageInput("")
    setIsLoading(true)
    setStreamingMessage("")

    try {
      // Sauvegarder le message utilisateur en base
      const { data: userMessageData, error: userMessageError } = await conversationService.addMessage(
        conversation.id,
        userMessage,
        "user",
      )

      if (userMessageError) {
        console.error("Erreur lors de la sauvegarde du message utilisateur:", userMessageError)
        return
      }

      // Ajouter le message à l'état local
      if (userMessageData) {
        setMessages((prev) => [...prev, userMessageData])
      }

      // Préparer l'historique pour l'IA (format attendu par fetchAIResponse)
      const historyForAI = messages.map((msg) => ({
        sender: msg.role,
        text: msg.content,
      }))

      // Ajouter le nouveau message utilisateur à l'historique
      historyForAI.push({ sender: "user", text: userMessage })

      // Obtenir la réponse de l'IA avec streaming et la langue actuelle
      const aiResponse = await fetchAIResponse(userMessage, historyForAI, locale, (chunk) => {
        setStreamingMessage((prev) => prev + chunk)
      })

      // Sauvegarder la réponse de l'IA en base
      const { data: aiMessageData, error: aiMessageError } = await conversationService.addMessage(
        conversation.id,
        aiResponse,
        "assistant",
      )

      if (aiMessageError) {
        console.error("Erreur lors de la sauvegarde de la réponse IA:", aiMessageError)
      }

      // Ajouter la réponse IA à l'état local
      if (aiMessageData) {
        setMessages((prev) => [...prev, aiMessageData])
      }

      setStreamingMessage("")
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)

      // Ajouter un message d'erreur dans la langue appropriée
      const errorMessage = {
        id: `error-${Date.now()}`,
        content:
          locale === "en"
            ? "Sorry, I encountered a problem. Please try again."
            : "Désolé, j'ai rencontré un problème. Veuillez réessayer.",
        role: "assistant" as const,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setStreamingMessage("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const renderMessages = () => {
    if (messages.length === 0 && !isLoading) {
      return (
        <div className="flex h-[80vh] max-xl:h-[78vh] flex-col items-center justify-center max-w-4xl mx-auto px-6">
          {/* Logo/Title */}
          <div className="mb-12">
            <h1 className="text-6xl max-sm:text-5xl font-bold text-white mb-2 text-center">{t("chat.title")}</h1>
            <p className="text-gray-400 text-center text-lg">{t("chat.subtitle")}</p>
          </div>

          {/* Main Input */}
          <div className="w-full max-w-2xl">
            <div className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-4 backdrop-blur-sm">
              <textarea
          placeholder={t("chat.placeholder_initial")}
          className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[60px] text-lg"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
              />
              <div className="flex items-center justify-end mt-3">
          {/* <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Paperclip className="h-5 w-5" />
          </button> */}
          <button
            className={`p-3 ${
              isLoading ? "bg-gray-600" : messageInput.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600"
            } text-white rounded-xl transition-colors flex-shrink-0`}
            onClick={handleSendMessage}
            disabled={isLoading || !messageInput.trim()}
          >
            <Forward className="h-5 w-5" />
          </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mt-8 justify-center">
            <button
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-gray-600 transition-colors text-sm"
              onClick={() => setMessageInput(t("chat.quick_prompts.client"))}
            >
              {t("chat.quick_actions.client_negotiation")}
            </button>
            <button
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-gray-600 transition-colors text-sm"
              onClick={() => setMessageInput(t("chat.quick_prompts.investor"))}
            >
              {t("chat.quick_actions.investor_pitch")}
            </button>
            <button
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-gray-600 transition-colors text-sm"
              onClick={() => setMessageInput(t("chat.quick_prompts.salary"))}
            >
              {t("chat.quick_actions.salary_negotiation")}
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-6 w-full mx-auto py-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800/50 border border-gray-700 text-gray-100"
              }`}
            >
              {message.role === "user" ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <div className="markdown prose prose-invert max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {streamingMessage && (
          <div className="flex justify-start">
            <div className="bg-gray-800/50 border border-gray-700 text-gray-100 p-4 rounded-2xl max-w-[80%]">
              <div className="markdown prose prose-invert max-w-none">
                <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                <span className="inline-block w-2 h-5 bg-gray-400 animate-pulse ml-1"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Afficher un loader pendant le chargement des données
  if (i18nLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{i18nLoading ? "Loading..." : t("chat.loading_conversation")}</p>
        </div>
      </div>
    )
  }

  // Afficher un loader pendant la vérification d'auth
  if (!user || !conversation) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-900 flex flex-col">
      {/* Fixed Header avec Logo et Session */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          {/* Logo + Session Title */}
          <div className="flex items-center gap-4">
            {/* Espace réservé pour le logo */}
            <div className="w-10 h-10 bg-gray-700/50 border border-gray-600 rounded-xl flex items-center justify-center">
              {/* TODO: Remplacer par le logo */}
              <div className="w-6 h-6 bg-blue-500 rounded-md"></div>
            </div>

            {/* Titre de la session */}
            <div className="max-md:hidden bg-gray-700/50 border border-gray-600 rounded-xl px-3 py-1 flex flex-col justify-center">
              <h1 className="text-lg font-semibold text-white">{conversation.title}</h1>
            </div>
          </div>

          {/* Actions à droite */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={handleNewConversation}
              disabled={isCreatingNewChat}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title={t("chat.new_conversation")}
            >
              {isCreatingNewChat ? (
                <div className="w-5 h-5 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <SquarePen className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsConversationsModalOpen(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              title={t("chat.conversation_history")}
            >
              <ListCollapse className="h-5 w-5" />
            </button>
            <UserDropdown userEmail={user.email} userName={user.name} />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto mb-20 ${messages.length > 0 || isLoading ? "pt-20 pb-32" : "pt-20"}`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="min-h-full max-w-4xl p-4 mx-auto flex items-center justify-center">{renderMessages()}</div>
      </div>

      {/* Fixed Input Area - seulement quand il y a des messages */}
      {(messages.length > 0 || isLoading) && (
        <div className="fixed bottom-0 left-0 right-0 z-10 bg-gray-900/95 backdrop-blur-sm">
          <div className="p-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-4 backdrop-blur-sm">
                <textarea
                  placeholder={t("chat.placeholder_continue")}
                  className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[60px]"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <div className="flex items-center justify-end mt-3">
                  {/* <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <Paperclip className="h-5 w-5" />
                  </button> */}
                  <button
                    className={`p-3 ${
                      isLoading ? "bg-gray-600" : messageInput.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600"
                    } text-white rounded-xl transition-colors cursor-pointer flex-shrink-0`}
                    onClick={handleSendMessage}
                    disabled={isLoading || !messageInput.trim()}
                  >
                    <Forward className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversations Modal */}
      {user && (
        <ConversationsModal
          isOpen={isConversationsModalOpen}
          onClose={() => setIsConversationsModalOpen(false)}
          userId={user.id}
          currentConversationId={conversationId}
        />
      )}
    </div>
  )
}

export default ChatPage
