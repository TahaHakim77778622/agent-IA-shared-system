import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Users, Shield, Zap, Heart, Target } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">À propos de ProMail Assistant</h1>
          <p className="text-xl text-gray-600 mb-8">
            Notre mission : révolutionner la communication professionnelle grâce à l'intelligence artificielle
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Pourquoi ProMail Assistant existe ?</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Dans un monde professionnel où la communication par email reste essentielle, nous avons constaté que de
              nombreux professionnels perdent un temps précieux à rédiger des emails répétitifs. ProMail Assistant a été
              créé pour résoudre ce problème en combinant l'efficacité de l'IA avec l'expertise en communication
              professionnelle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre vision</h3>
              <p className="text-gray-600 mb-6">
                Nous croyons que chaque professionnel devrait pouvoir se concentrer sur l'essentiel de son travail, sans
                perdre de temps sur la rédaction d'emails routiniers. Notre IA vous aide à maintenir une communication
                de qualité tout en gagnant un temps précieux.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Productivité maximisée</span>
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Qualité garantie</span>
                </li>
                <li className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Communication harmonisée</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-8 rounded-2xl">
              <div className="text-center">
                <Mail className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Plus de 10,000 emails générés</h4>
                <p className="text-gray-600">Faites confiance à notre expertise éprouvée</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos valeurs</h2>
            <p className="text-xl text-gray-600">Les principes qui guident notre développement et notre service</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Transparence</h3>
                <p className="text-gray-600">
                  Nous sommes transparents sur le fonctionnement de notre IA et sur l'utilisation de vos données. Aucune
                  information personnelle n'est stockée sans votre consentement.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Innovation</h3>
                <p className="text-gray-600">
                  Nous utilisons les dernières avancées en IA pour vous offrir la meilleure expérience possible. Notre
                  technologie évolue constamment pour s'améliorer.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Bienveillance</h3>
                <p className="text-gray-600">
                  Nous mettons l'humain au centre de notre approche. Notre IA est conçue pour vous assister, pas pour
                  vous remplacer, dans votre communication professionnelle.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Qui sommes-nous ?</h2>
          <p className="text-lg text-gray-600 mb-12">
            ProMail Assistant est développé par une équipe passionnée de développeurs, de spécialistes en IA et
            d'experts en communication professionnelle. Notre objectif commun : vous faire gagner du temps tout en
            améliorant la qualité de vos échanges professionnels.
          </p>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Une question ? Un besoin spécifique ?</h3>
            <p className="text-blue-100 mb-6">
              Notre équipe est à votre écoute pour améliorer continuellement ProMail Assistant
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <a href="mailto:contact@promail-assistant.com">Nous contacter</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Protection des données */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Protection des données</h2>
            <p className="text-xl text-gray-600">Votre confidentialité est notre priorité absolue</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">🔒 Sécurité maximale</h3>
                <p className="text-gray-600">
                  Toutes vos données sont chiffrées et sécurisées. Nous n'accédons jamais au contenu de vos emails sans
                  votre autorisation explicite.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">🗑️ Suppression automatique</h3>
                <p className="text-gray-600">
                  Les données temporaires utilisées pour la génération sont automatiquement supprimées après traitement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">🇪🇺 Conformité RGPD</h3>
                <p className="text-gray-600">
                  Nous respectons scrupuleusement le Règlement Général sur la Protection des Données européen.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">👤 Contrôle total</h3>
                <p className="text-gray-600">
                  Vous gardez le contrôle total sur vos données : accès, modification, suppression à tout moment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Prêt à optimiser vos emails ?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez les milliers de professionnels qui font déjà confiance à ProMail Assistant
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/use-cases">Commencer maintenant</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
