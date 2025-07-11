"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-background text-foreground">
        <ConditionalNavbar />
        <main>{children}</main>
        <ConditionalFooter />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

function ConditionalNavbar() {
  const pathname = usePathname()

  // Ne pas afficher la navbar sur le dashboard
  if (pathname?.startsWith("/dashboard")) {
    return null
  }

  return <Navbar />
}

function ConditionalFooter() {
  const pathname = usePathname()

  // Ne pas afficher le footer sur le dashboard
  if (pathname?.startsWith("/dashboard")) {
    return null
  }

  return <Footer />
}
