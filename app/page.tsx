// app/page.tsx
// --------------------------------------------------
// Page d'accueil de ProMail Assistant
// Présente le produit, ses avantages, ses fonctionnalités et des témoignages
// Auteur : Karim | Dernière modif : 2025-07-24
// --------------------------------------------------

"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/PageTransition"
import AnimatedLogo from "@/components/AnimatedLogo"
import { 
  Mail, 
  Zap, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Clock,
  TrendingUp,
  MessageSquare,
  FileText,
  Bot,
  Globe,
  Lock
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              {/* Logo animé */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex justify-center mb-8"
              >
                <AnimatedLogo size="xl" />
              </motion.div>

              {/* Titre principal */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
              >
                Révolutionnez vos{" "}
                <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                  emails professionnels
                </span>
              </motion.h1>

              {/* Sous-titre */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              >
                Créez des emails parfaits en quelques secondes grâce à l'intelligence artificielle. 
                Plus de templates, plus de personnalisation, plus de résultats.
              </motion.p>

              {/* Badges de fonctionnalités */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-3 mb-8"
              >
                <Badge variant="secondary" className="text-sm">
                  <Zap className="h-3 w-3 mr-1" />
                  IA Avancée
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Shield className="h-3 w-3 mr-1" />
                  Sécurisé
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Templates Pro
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Globe className="h-3 w-3 mr-1" />
                  Multi-langues
                </Badge>
              </motion.div>

              {/* Boutons d'action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/register">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about">
                    En savoir plus
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Effet de fond animé */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        </section>

        {/* Section Fonctionnalités */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Fonctionnalités avancées
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tout ce dont vous avez besoin pour créer des emails professionnels parfaits
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Génération IA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Génération IA</CardTitle>
                    <CardDescription>
                      Créez des emails personnalisés en quelques secondes avec notre IA avancée
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Personnalisation intelligente
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Multiples types d'emails
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Suggestions contextuelles
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Templates Pro */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                    <CardTitle>Templates Pro</CardTitle>
                    <CardDescription>
                      Bibliothèque de templates professionnels pour tous vos besoins
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Templates personnalisables
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Catégories spécialisées
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Sauvegarde automatique
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sécurité & RGPD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Lock className="h-6 w-6 text-green-500" />
                    </div>
                    <CardTitle>Sécurité & RGPD</CardTitle>
                    <CardDescription>
                      Vos données sont protégées avec les meilleures pratiques de sécurité
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Chiffrement SSL/TLS
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Conformité RGPD
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        2FA disponible
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section Statistiques */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              <div>
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-muted-foreground">Emails générés</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Templates</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Support</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Prêt à révolutionner vos emails ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Rejoignez des milliers de professionnels qui utilisent déjà ProMail Assistant
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link href="/register">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  )
}
