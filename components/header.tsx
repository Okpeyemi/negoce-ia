"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MessageSquare, Menu, X } from "lucide-react"
import { useI18n } from "../lib/i18n/hooks"
import { authService } from "../lib/auth"
import LanguageSwitcher from "./language-switcher"
import UserDropdown from "./user-dropdown"

export default function Header() {
  const { t } = useI18n()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user: currentUser } = await authService.getCurrentUser()
        if (currentUser) {
          // Récupérer le profil pour avoir le role et full_name
          const { data: profile } = await authService.getProfile(currentUser.id)
          setUser({
            id: currentUser.id,
            email: currentUser.email,
            name: profile?.full_name,
            role: profile?.role || "user"
          })
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [])

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fermer le menu lors du redimensionnement vers desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Désactiver le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Désactiver le scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Réactiver le scroll
      document.body.style.overflow = 'unset'
    }

    // Cleanup : réactiver le scroll quand le composant est démonté
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Composant pour la navigation desktop
  const DesktopNavigation = () => {
    if (user) {
      return (
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <UserDropdown 
            userEmail={user.email} 
            userName={user.name} 
            profileRole={user.role} 
          />
        </div>
      )
    }

    return (
      <div className="hidden md:flex items-center gap-4">
        <LanguageSwitcher />
        <Link href="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
          {t("navigation.login")}
        </Link>
        <Link
          href="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-medium"
        >
          {t("navigation.register")}
        </Link>
      </div>
    )
  }

  // Composant pour la navigation mobile
  const MobileNavigation = () => {
    if (user) {
      return (
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <UserDropdown 
            userEmail={user.email} 
            userName={user.name} 
            profileRole={user.role} 
          />
        </div>
      )
    }

    return (
      <div className="md:hidden flex items-center gap-2">
        <LanguageSwitcher />
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Mobile Full Screen Menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 top-16 bg-gray-900/95 backdrop-blur-sm z-40">
              <div className="h-full w-full bg-gray-800/50 border-t border-gray-700">
                <div className="flex flex-col h-full">
                  {/* Menu Items */}
                  <div className="flex-1 flex flex-col justify-center items-center space-y-8 px-6">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full max-w-sm text-center py-4 px-6 text-xl font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors"
                    >
                      {t("navigation.login")}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full max-w-sm text-center py-4 px-6 text-xl font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                    >
                      {t("navigation.register")}
                    </Link>
                  </div>
                  
                  {/* Footer */}
                  <div className="p-6 border-t border-gray-700">
                    <p className="text-center text-gray-400 text-sm">
                      © 2024 {t("chat.title")}. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* <MessageSquare className="h-8 w-8 text-blue-500" /> */}
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="hidden md:block" />
            <span className="text-xl font-bold">{t("chat.title")}</span>
          </Link>
          
          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* Mobile Navigation */}
          <MobileNavigation />
        </div>
      </div>
    </nav>
  )
}
