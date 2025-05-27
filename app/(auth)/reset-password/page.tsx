"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { supabase } from "../../../lib/supabase"
import { useI18n } from "../../../lib/i18n/hooks"
import LanguageSwitcher from "../../../components/language-switcher"

const ResetPasswordPage = () => {
  const { t, isLoading: i18nLoading } = useI18n()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isValidating, setIsValidating] = useState(true)

  // Vérifier et traiter les tokens de reset password
  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        // Récupérer les paramètres depuis le hash fragment (après #)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")
        const type = hashParams.get("type")

        console.log("Hash params:", {
          accessToken: accessToken ? "présent" : "absent",
          refreshToken: refreshToken ? "présent" : "absent",
          type,
        })

        // Vérifier que c'est bien un reset password
        if (type !== "recovery") {
          setError("Type de lien invalide")
          setIsValidating(false)
          return
        }

        if (!accessToken || !refreshToken) {
          setError("Lien de réinitialisation invalide ou expiré")
          setIsValidating(false)
          return
        }

        // Établir la session avec les tokens
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (sessionError) {
          console.error("Erreur session:", sessionError)
          setError("Lien de réinitialisation invalide ou expiré")
        } else {
          console.log("Session établie avec succès")
          // Session valide, l'utilisateur peut maintenant changer son mot de passe
        }
      } catch (err) {
        console.error("Erreur lors de la validation:", err)
        setError("Erreur lors de la validation du lien")
      } finally {
        setIsValidating(false)
      }
    }

    if (typeof window !== "undefined") {
      handlePasswordReset()
    }
  }, [])

  const validateForm = () => {
    if (!password.trim()) {
      setError(t("auth.errors.password_required"))
      return false
    }

    if (password.length < 8) {
      setError(t("auth.errors.password_min_length"))
      return false
    }

    if (password !== confirmPassword) {
      setError(t("auth.errors.passwords_no_match"))
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      // Mettre à jour le mot de passe
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        console.error("Erreur update:", updateError)
        setError(updateError.message)
      } else {
        setSuccess(true)
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err)
      setError(t("auth.errors.unexpected_error"))
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (error) {
      setError("")
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (error) {
      setError("")
    }
  }

  if (i18nLoading || isValidating) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{i18nLoading ? "Loading..." : "Validation du lien de réinitialisation..."}</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <div className="flex fixed top-0 left-0 right-0 justify-end items-center p-2">
          <LanguageSwitcher />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link href="/" className="flex items-center justify-center gap-2">
                <h1 className="text-4xl font-bold text-white mb-2">{t("chat.title")}</h1>
              </Link>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Mot de passe mis à jour !</h2>
                <p className="text-gray-400 mb-6 text-sm">
                  Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page de connexion.
                </p>
                <Link
                  href="/login"
                  className="w-full inline-block py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-center"
                >
                  Se connecter maintenant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex fixed top-0 left-0 right-0 justify-end items-center p-2">
        <LanguageSwitcher />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center gap-2">
              <h1 className="text-4xl font-bold text-white mb-2">{t("chat.title")}</h1>
            </Link>
            <p className="text-gray-400">Créer un nouveau mot de passe</p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
            <div className="mb-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </Link>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Nouveau mot de passe</h2>
                <p className="text-gray-400 text-sm">Choisissez un mot de passe sécurisé d'au moins 8 caractères.</p>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    className={`w-full bg-gray-700/50 border rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                      error ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-500"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`w-full bg-gray-700/50 border rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                      error ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-500"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${
                  isLoading
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Mise à jour...
                  </div>
                ) : (
                  "Mettre à jour le mot de passe"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
