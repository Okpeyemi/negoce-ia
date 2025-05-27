"use client"

import { useState, useRef, useEffect } from "react"
import { UserRound, User, LogOut } from "lucide-react"
import { authService } from "../lib/auth"
import { useRouter } from "next/navigation"
import { useI18n } from "../lib/i18n/hooks"

interface UserDropdownProps {
  userEmail?: string
  userName?: string
}

export default function UserDropdown({ userEmail, userName }: UserDropdownProps) {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await authService.signOut()
      if (!error) {
        router.push("/login")
      }
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  const handleProfile = () => {
    setIsOpen(false)
    router.push("/profile")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton utilisateur */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
      >
        <UserRound className="h-5 w-5" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50">
          {/* Header avec info utilisateur */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{userName || "Utilisateur"}</p>
                <p className="text-gray-400 text-sm truncate">{userEmail || "email@example.com"}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <button
              onClick={handleProfile}
              className="w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer flex items-center gap-3"
            >
              <User className="h-4 w-4" />
              {t("navigation.profile")}
            </button>

            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="h-4 w-4" />
              {isLoading ? `${t("navigation.logout")}...` : t("navigation.logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
