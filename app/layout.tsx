import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// 👇 NEW – import the client-side wrapper
import ClientLayout from "./ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProMail Assistant - Boostez vos emails professionnels grâce à l'IA",
  description:
    "Rédigez vos emails pros en quelques clics. Notre assistant IA vous aide à générer des emails clairs, professionnels et adaptés à chaque situation.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
