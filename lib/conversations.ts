import { supabase } from "./supabase"

export const conversationService = {
  // Générer un titre automatique basé sur le nombre de conversations
  async generateConversationTitle(userId: string): Promise<string> {
    const { data, error } = await supabase.from("conversations").select("id").eq("user_id", userId)

    if (error) {
      console.error("Erreur lors du comptage des conversations:", error)
      return "Session n°1" // Fallback
    }

    const count = data ? data.length : 0
    return `Session n°${count + 1}`
  },

  // Créer une nouvelle conversation
  async createConversation(userId: string, title?: string) {
    // Si aucun titre n'est fourni, générer automatiquement
    const conversationTitle = title || (await this.generateConversationTitle(userId))

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        title: conversationTitle,
      })
      .select()
      .single()

    return { data, error }
  },

  // Récupérer toutes les conversations d'un utilisateur
  async getUserConversations(userId: string) {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    return { data, error }
  },

  // Récupérer une conversation spécifique
  async getConversation(conversationId: string, userId: string) {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .single()

    return { data, error }
  },

  // Mettre à jour le titre d'une conversation
  async updateConversationTitle(conversationId: string, title: string, userId: string) {
    const { data, error } = await supabase
      .from("conversations")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", conversationId)
      .eq("user_id", userId)
      .select()
      .single()

    return { data, error }
  },

  // Supprimer une conversation
  async deleteConversation(conversationId: string, userId: string) {
    const { error } = await supabase.from("conversations").delete().eq("id", conversationId).eq("user_id", userId)

    return { error }
  },

  // Ajouter un message à une conversation
  async addMessage(conversationId: string, content: string, role: "user" | "assistant") {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        content,
        role,
      })
      .select()
      .single()

    return { data, error }
  },

  // Récupérer tous les messages d'une conversation
  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    return { data, error }
  },
}
