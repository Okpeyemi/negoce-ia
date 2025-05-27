"use client"

import { useState, useEffect } from "react"
import { X, Edit2, Trash2, Check, XIcon, MessageSquare, Plus } from "lucide-react"
import { conversationService } from "../lib/conversations"
import { useRouter } from "next/navigation"
import { useI18n } from "../lib/i18n/hooks"

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface ConversationsModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  currentConversationId: string
}

export default function ConversationsModal({
  isOpen,
  onClose,
  userId,
  currentConversationId,
}: ConversationsModalProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Charger les conversations quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && userId) {
      loadConversations()
    }
  }, [isOpen, userId])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await conversationService.getUserConversations(userId)
      if (error) {
        console.error("Erreur lors du chargement des conversations:", error)
      } else if (data) {
        setConversations(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditStart = (conversation: Conversation) => {
    setEditingId(conversation.id)
    setEditingTitle(conversation.title || "")
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditingTitle("")
  }

  const handleEditSave = async (conversationId: string) => {
    if (!editingTitle.trim()) return

    try {
      const { error } = await conversationService.updateConversationTitle(conversationId, editingTitle.trim(), userId)

      if (error) {
        console.error("Erreur lors de la mise à jour:", error)
      } else {
        // Mettre à jour l'état local
        setConversations((prev) =>
          prev.map((conv) => (conv.id === conversationId ? { ...conv, title: editingTitle.trim() } : conv)),
        )
        setEditingId(null)
        setEditingTitle("")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const handleDelete = async (conversationId: string) => {
    setDeletingId(conversationId)

    try {
      const { error } = await conversationService.deleteConversation(conversationId, userId)

      if (error) {
        console.error("Erreur lors de la suppression:", error)
      } else {
        // Retirer de l'état local
        setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))

        // Si on supprime la conversation actuelle, rediriger vers une nouvelle
        if (conversationId === currentConversationId) {
          const { data: newConversation } = await conversationService.createConversation(userId)
          if (newConversation) {
            router.push(`/chat/${newConversation.id}`)
            onClose()
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleConversationClick = (conversationId: string) => {
    if (conversationId !== currentConversationId) {
      router.push(`/chat/${conversationId}`)
      onClose()
    }
  }

  const handleNewConversation = async () => {
    try {
      const { data: newConversation, error } = await conversationService.createConversation(userId)

      if (error) {
        console.error("Erreur lors de la création:", error)
      } else if (newConversation) {
        router.push(`/chat/${newConversation.id}`)
        onClose()
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return t("conversations.today")
    if (diffDays === 2) return t("conversations.yesterday")
    if (diffDays <= 7) return t("conversations.days_ago", { days: diffDays - 1 })
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[80vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">{t("conversations.title")}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* New Conversation Button */}
          <button
            onClick={handleNewConversation}
            className="w-full mb-4 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            {t("conversations.new_conversation")}
          </button>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Conversations List */}
          {!isLoading && conversations.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{t("conversations.no_conversations")}</p>
            </div>
          )}

          {!isLoading && conversations.length > 0 && (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group p-4 rounded-xl border transition-all ${
                    conversation.id === currentConversationId
                      ? "bg-blue-600/20 border-blue-500/50"
                      : "bg-gray-700/30 border-gray-600 hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Title and Date */}
                    <div className="flex-1 min-w-0 mr-3">
                      {editingId === conversation.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleEditSave(conversation.id)
                              if (e.key === "Escape") handleEditCancel()
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleEditSave(conversation.id)}
                            className="p-1 text-green-400 hover:text-green-300 transition-colors"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="cursor-pointer" onClick={() => handleConversationClick(conversation.id)}>
                          <h3 className="text-white font-medium truncate group-hover:text-blue-300 transition-colors">
                            {conversation.title || t("conversations.untitled")}
                          </h3>
                          <p className="text-gray-400 text-sm">{formatDate(conversation.updated_at)}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {editingId !== conversation.id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditStart(conversation)
                          }}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-600 rounded-lg transition-colors"
                          title={t("conversations.edit_title")}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(conversation.id)
                          }}
                          disabled={deletingId === conversation.id}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                          title={t("conversations.delete")}
                        >
                          {deletingId === conversation.id ? (
                            <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
