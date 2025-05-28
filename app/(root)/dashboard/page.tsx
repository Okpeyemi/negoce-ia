"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, Mail, Calendar, ArrowLeft, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { authService } from "../../../lib/auth";
import { useI18n } from "../../../lib/i18n/hooks";
import LanguageSwitcher from "../../../components/language-switcher";
import UserDropdown from "../../../components/user-dropdown";

interface ProfileData {
  id: string;
  avatar_url: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

type SortOrder = 'asc' | 'desc' | null;

const Dashboard = () => {
  const { t, isLoading: i18nLoading } = useI18n();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // États pour le tri
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // Trier les profils par rôle
  const sortedProfiles = React.useMemo(() => {
    if (!sortOrder) return profiles;

    return [...profiles].sort((a, b) => {
      // Définir l'ordre de priorité des rôles
      const roleOrder = { admin: 1, user: 2 };
      const roleA = roleOrder[a.role as keyof typeof roleOrder] || 999;
      const roleB = roleOrder[b.role as keyof typeof roleOrder] || 999;

      if (sortOrder === 'asc') {
        return roleA - roleB;
      } else {
        return roleB - roleA;
      }
    });
  }, [profiles, sortOrder]);

  // Calculer les données de pagination avec les profils triés
  const totalPages = Math.ceil(sortedProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProfiles = sortedProfiles.slice(startIndex, endIndex);

  // Charger les données utilisateur et profils au montage
  useEffect(() => {
    const fetchUserAndProfiles = async () => {
      try {
        // Vérifier l'authentification
        const { user: currentUser, error: userError } =
          await authService.getCurrentUser();
        if (userError || !currentUser) {
          router.push("/login");
          return;
        }

        // Récupérer le profil de l'utilisateur connecté
        const { data: profile, error: profileError } =
          await authService.getProfile(currentUser.id);
        if (profileError || !profile) {
          router.push("/login");
          return;
        }

        // Vérifier les permissions admin
        if (profile.role !== "admin") {
          setError(t("dashboard.access_denied"));
          setTimeout(() => {
            router.push("/");
          }, 2000);
          return;
        }

        // Stocker les données utilisateur avec toutes les informations nécessaires
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          name: profile.full_name,
          role: profile.role
        });

        // Récupérer tous les profils (seuls les admins peuvent faire cela grâce à la politique RLS)
        const { data: allProfiles, error: profilesError } =
          await authService.getAllProfiles();

        if (profilesError) {
          console.error(
            "Erreur lors du chargement des profils:",
            profilesError
          );
          setError(t("dashboard.loading_error"));
          return;
        }

        setProfiles(allProfiles || []);

      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(t("dashboard.unexpected_error"));
      } finally {
        setIsLoading(false);
      }
    };

    if (!i18nLoading) {
      fetchUserAndProfiles();
    }
  }, [router, i18nLoading, t]);

  // Réinitialiser la page courante quand les profils changent
  useEffect(() => {
    setCurrentPage(1);
  }, [sortedProfiles]);

  // Fonction pour gérer le tri par rôle
  const handleRoleSort = () => {
    if (sortOrder === null) {
      setSortOrder('asc'); // Admin en premier
    } else if (sortOrder === 'asc') {
      setSortOrder('desc'); // User en premier
    } else {
      setSortOrder(null); // Pas de tri
    }
  };

  // Fonctions de navigation de la pagination
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Générer les numéros de pages à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Afficher toutes les pages si on en a moins de 5
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Logique pour afficher les pages avec "..."
      if (currentPage <= 3) {
        // Début: 1, 2, 3, 4, ..., last
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Fin: 1, ..., last-3, last-2, last-1, last
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Milieu: 1, ..., current-1, current, current+1, ..., last
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Fonction pour afficher l'icône de tri
  const getSortIcon = () => {
    if (sortOrder === null) {
      return <ArrowUpDown className="h-4 w-4" />;
    } else if (sortOrder === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    } else {
      return <ArrowDown className="h-4 w-4" />;
    }
  };

  // Afficher un loader pendant le chargement de l'i18n
  if (i18nLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Afficher un loader pendant le chargement des données
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{t("dashboard.loading")}</p>
        </div>
      </div>
    );
  }

  // Afficher l'erreur d'accès
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            {t("dashboard.access_denied_title")}
          </h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors cursor-pointer"
          >
            {t("dashboard.back_home")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header fixe */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-white">
              {t("dashboard.title")}
            </h1>
          </div>
          
          {/* Navigation avec UserDropdown */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {user && (
              <UserDropdown 
                userEmail={user.email} 
                userName={user.name} 
                profileRole={user.role} 
              />
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="pt-40 max-md:pt-30 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-400">
                    {t("dashboard.total_users")}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {profiles.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-400">
                    {t("dashboard.admins")}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {profiles.filter((p) => p.role === "admin").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-400">
                    {t("dashboard.regular_users")}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {profiles.filter((p) => p.role === "user").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des utilisateurs */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  {t("dashboard.users_list")}
                </h2>
                <div className="text-sm text-gray-400">
                  {t("dashboard.pagination.showing")} {startIndex + 1}-{Math.min(endIndex, sortedProfiles.length)} {t("dashboard.pagination.of")} {sortedProfiles.length} {t("dashboard.pagination.users")}
                  {sortOrder && (
                    <span className="ml-2 text-blue-400">
                      ({t("dashboard.sorted_by_role")})
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t("dashboard.user")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t("dashboard.email")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <button
                        onClick={handleRoleSort}
                        className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                        title={t("dashboard.sort_by_role")}
                      >
                        {t("dashboard.role")}
                        {getSortIcon()}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t("dashboard.created_at")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentProfiles.map((profile) => (
                    <tr
                      key={profile.id}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            {profile.avatar_url ? (
                              <img
                                src={profile.avatar_url}
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-4 w-4 text-gray-300" />
                            )}
                          </div>
                          <span className="text-white font-medium">
                            {profile.full_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{profile.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            profile.role === "admin"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {profile.role === "admin"
                            ? t("dashboard.admin")
                            : t("dashboard.user")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">
                            {new Date(profile.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  {/* Informations de pagination */}
                  <div className="text-sm text-gray-400">
                    {t("dashboard.pagination.page")} {currentPage} {t("dashboard.pagination.of")} {totalPages}
                  </div>

                  {/* Contrôles de pagination */}
                  <div className="flex items-center gap-2">
                    {/* Bouton précédent */}
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        currentPage === 1
                          ? "text-gray-600 cursor-not-allowed"
                          : "text-gray-400 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Numéros de pages */}
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((pageNumber, index) => (
                        <React.Fragment key={index}>
                          {pageNumber === '...' ? (
                            <span className="px-3 py-2 text-gray-400">...</span>
                          ) : (
                            <button
                              onClick={() => goToPage(pageNumber as number)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                currentPage === pageNumber
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-400 hover:text-white hover:bg-gray-700"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Bouton suivant */}
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        currentPage === totalPages
                          ? "text-gray-600 cursor-not-allowed"
                          : "text-gray-400 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
