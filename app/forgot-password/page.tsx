"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre adresse email.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Appel réel à l'API backend
      const response = await fetch("http://localhost:8000/api/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || "Erreur lors de l'envoi de l'email")
      }
      setEmailSent(true)
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte de réception.",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'email. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-500 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-4">Email envoyé !</h2>
              <p className="text-muted-foreground mb-6">
                Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>. Vérifiez votre boîte de
                réception et suivez les instructions.
              </p>

              <div className="space-y-4">
                <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                  <Link href="/login">Retour à la connexion</Link>
                </Button>

                <Button variant="outline" className="w-full bg-transparent" onClick={() => setEmailSent(false)}>
                  Renvoyer l'email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/login" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la connexion
          </Link>

          <div className="flex justify-center mb-6">
            <div className="bg-primary p-3 rounded-full">
              <Mail className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-2">Mot de passe oublié</h2>
          <p className="text-muted-foreground">Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        {/* Formulaire */}
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-foreground">Réinitialiser</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Nous vous enverrons un lien pour créer un nouveau mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Adresse email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background border-border"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading} size="lg">
                {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
              </Button>
            </form>

            {/* Lien retour */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Vous vous souvenez de votre mot de passe ?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
