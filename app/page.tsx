"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Zap, Shield, Clock, CheckCircle, ArrowRight, Star, Users, Target, Sparkles } from "lucide-react"
import Link from "next/link"
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageTransition } from "@/components/PageTransition";

export default function HomePage() {
  return (
    <PageTransition>
      <Navbar />
      <div className="bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background via-background to-muted/20 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                <Sparkles className="h-4 w-4 mr-1" />
                Nouveau : IA GPT-4 intégrée
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Rédigez vos emails pros
                <span className="text-primary"> en quelques clics</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Notre assistant IA vous aide à générer des emails clairs, professionnels et adaptés à chaque situation.
                Gagnez du temps et harmonisez votre communication.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-3" asChild>
                  <Link href="/login">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent" asChild>
                  <Link href="/about">En savoir plus</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Comment ça marche ?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Trois étapes simples pour générer vos emails professionnels
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">1. Connectez-vous</h3>
                <p className="text-muted-foreground">
                  Créez votre compte et accédez à votre tableau de bord personnalisé avec tous les outils.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">2. Choisissez votre type</h3>
                <p className="text-muted-foreground">
                  Sélectionnez parmi nos templates : réclamation, relance, rendez-vous, commercial, et bien plus.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">3. Laissez l'IA générer</h3>
                <p className="text-muted-foreground">
                  Notre IA crée votre email professionnel en quelques secondes. Copiez, modifiez ou exportez !
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fonctionnalités */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Fonctionnalités disponibles</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tout ce dont vous avez besoin pour optimiser vos communications professionnelles
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Générateur IA",
                  description: "Créez des emails personnalisés avec l'IA",
                  icon: "🤖",
                  color: "border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5",
                },
                {
                  title: "Templates",
                  description: "Gérez vos modèles et prompts",
                  icon: "📝",
                  color: "border-green-500/20 hover:border-green-500/40 bg-green-500/5",
                },
                {
                  title: "Historique",
                  description: "Retrouvez tous vos emails générés",
                  icon: "📚",
                  color: "border-purple-500/20 hover:border-purple-500/40 bg-purple-500/5",
                },
                {
                  title: "Export",
                  description: "Exportez en Word, HTML ou EML",
                  icon: "📤",
                  color: "border-orange-500/20 hover:border-orange-500/40 bg-orange-500/5",
                },
              ].map((item, index) => (
                <Card key={index} className={`cursor-pointer transition-all hover:shadow-lg ${item.color} border`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Pourquoi choisir ProMail Assistant ?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Des avantages concrets pour votre productivité professionnelle
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Gain de temps</h3>
                <p className="text-muted-foreground">
                  Réduisez de 80% le temps de rédaction de vos emails professionnels
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Qualité garantie</h3>
                <p className="text-muted-foreground">Français impeccable et structure professionnelle à chaque fois</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Standardisation</h3>
                <p className="text-muted-foreground">Harmonisez le style de communication de toute votre équipe</p>
              </div>

              <div className="text-center">
                <div className="bg-orange-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Historique</h3>
                <p className="text-muted-foreground">
                  Sauvegardez et réutilisez vos emails pour gagner encore plus de temps
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ce que disent nos utilisateurs</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Rejoignez des milliers de professionnels qui font confiance à ProMail Assistant
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Marie Dubois",
                  role: "Directrice commerciale",
                  company: "TechCorp",
                  content:
                    "ProMail Assistant a révolutionné notre communication client. Nos emails sont plus professionnels et nous gagnons un temps précieux.",
                  rating: 5,
                },
                {
                  name: "Pierre Martin",
                  role: "Responsable RH",
                  company: "InnovateLab",
                  content:
                    "Excellent outil pour standardiser nos communications RH. L'IA comprend parfaitement le contexte et génère des emails adaptés.",
                  rating: 5,
                },
                {
                  name: "Sophie Laurent",
                  role: "Consultante",
                  company: "Freelance",
                  content:
                    "Indispensable pour mes relances clients ! Les emails générés sont toujours dans le bon ton et très efficaces.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-lg bg-card">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-primary">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Prêt à transformer vos emails ?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Rejoignez des milliers de professionnels qui utilisent déjà ProMail Assistant
            </p>
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-3" asChild>
              <Link href="/login">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
      <Footer />
    </PageTransition>
  )
}
