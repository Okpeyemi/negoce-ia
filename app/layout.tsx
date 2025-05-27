import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import { I18nProvider } from "../lib/i18n/hooks"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Negotiation Coach - Master the art of negotiation with AI",
  description: "Your personal AI-powered coach to perfect your negotiation skills and succeed in all your projects.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  )
}
