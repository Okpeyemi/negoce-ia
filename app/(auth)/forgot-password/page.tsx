"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { authService } from "../../../lib/auth";
import { useI18n } from "../../../lib/i18n/hooks";
import LanguageSwitcher from "../../../components/language-switcher";

const ForgotPasswordPage = () => {
  const { t, isLoading: i18nLoading } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError(t("auth.errors.email_required"));
      return;
    }

    if (!validateEmail(email)) {
      setError(t("auth.errors.email_invalid"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error: resetError } = await authService.resetPassword(email);
      
      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(t("auth.errors.unexpected_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError("");
    }
  };

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

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Header avec sélecteur de langue */}
        <div className="flex fixed top-0 left-0 right-0 justify-end items-center p-2">
          <LanguageSwitcher />
        </div>

        {/* Contenu principal */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Logo/Title */}
            <div className="text-center mb-8">
              <Link href="/" className="flex items-center justify-center gap-2">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {t("chat.title")}
                </h1>
              </Link>
            </div>

            {/* Success Message */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {t("auth.forgot_password.success_title")}
                </h2>
                <p className="text-gray-400 mb-6 text-sm">
                  {t("auth.forgot_password.success_message")} <span className="text-blue-400 font-medium">{email}</span>
                </p>
                <p className="text-gray-500 text-xs mb-6">
                  {t("auth.forgot_password.check_spam")}
                </p>
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="w-full inline-block py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-center"
                  >
                    {t("auth.forgot_password.back_to_login")}
                  </Link>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    className="w-full py-3 px-4 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-colors"
                  >
                    {t("auth.forgot_password.resend_email")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header avec sélecteur de langue */}
      <div className="flex fixed top-0 left-0 right-0 justify-end items-center p-2">
        <LanguageSwitcher />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center gap-2">
              <h1 className="text-4xl font-bold text-white mb-2">
                {t("chat.title")}
              </h1>
            </Link>
            <p className="text-gray-400">{t("auth.forgot_password.subtitle")}</p>
          </div>

          {/* Form */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
            {/* Back to login link */}
            <div className="mb-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("auth.forgot_password.back_to_login")}
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
                <h2 className="text-xl font-semibold text-white mb-2">
                  {t("auth.forgot_password.title")}
                </h2>
                <p className="text-gray-400 text-sm">
                  {t("auth.forgot_password.description")}
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("auth.forgot_password.email_label")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full bg-gray-700/50 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                      error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:ring-blue-500"
                    }`}
                    placeholder="votre@email.com"
                  />
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
                    {t("auth.forgot_password.sending")}
                  </div>
                ) : (
                  t("auth.forgot_password.send_button")
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {t("auth.forgot_password.remember_password")}{" "}
                <Link
                  href="/login"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  {t("auth.forgot_password.sign_in")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;