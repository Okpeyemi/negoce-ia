import { supabase } from "./supabase"

export const authService = {
  // Inscription
  // async signUp(email: string, password: string, fullName: string) {
  //   const { data, error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       data: {
  //         full_name: fullName,
  //       },
  //     },
  //   })
  //   return { data, error }
  // },

  // Connexion
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Reset de mot de passe
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  },

  // Mettre à jour le mot de passe
  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { data, error }
  },

  // Vérifier si l'utilisateur a une session valide
  async verifyResetToken() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    return { session, error }
  },

  // Déconnexion
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Créer une souscription par défaut
  async createDefaultSubscription(userId: string) {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan: "basic",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    return { data, error };
  },

  // Inscription (mise à jour pour inclure la création de la souscription)
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    // Si l'inscription réussit, créer une souscription "free"
    if (!error && data.user) {
      const { error: subError } = await authService.createDefaultSubscription(
        data.user.id
      );
      if (subError) {
        console.error("Erreur lors de la création de la souscription:", subError);
        // Optionnel : tu peux gérer cette erreur comme tu veux
      }
    }

    return { data, error };
  },

  // Connexion avec Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    // Si la connexion OAuth réussit, vérifier et créer une souscription si nécessaire
    if (!error && data) {
      const { user } = await authService.getCurrentUser();
      if (user) {
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!subscription && !subError) {
          await authService.createDefaultSubscription(user.id);
        }
      }
    }

    return { data, error }
  },

  // Récupérer l'utilisateur actuel
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    return { user, error }
  },

  // Récupérer le profil de l'utilisateur
  async getProfile(userId: string) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
    return { data, error }
  },

  async getAllProfiles() {
    const { data, error } = await supabase.from("profiles").select("*")
    return { data, error }
  },

  // Mettre à jour le profil
  async updateProfile(userId: string, updates: Partial<{ full_name: string; avatar_url: string }>) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single()
    return { data, error }
  },

  // Créer ou mettre à jour le profil après connexion OAuth
  async upsertProfile(user: any) {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        },
      )
      .select()
      .single()

    return { data, error }
  }
}
