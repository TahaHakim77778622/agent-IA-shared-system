"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/PageTransition"
import AnimatedLogo from "@/components/AnimatedLogo"
import { 
  CheckCircle, 
  Clock, 
  Zap, 
  Star, 
  ArrowRight,
  Calendar,
  Users,
  Globe,
  Shield,
  Bot,
  FileText,
  Download,
  BarChart3,
  MessageSquare,
  Smartphone,
  Palette,
  Languages,
  Database,
  Cloud,
  Target
} from "lucide-react"
import Link from "next/link"

interface RoadmapItem {
  id: string
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'planned' | 'future'
  category: 'core' | 'ai' | 'security' | 'ui' | 'integration'
  priority: 'high' | 'medium' | 'low'
  estimatedDate?: string
  icon: React.ComponentType<any>
  features: string[]
}

const roadmapItems: RoadmapItem[] = [
  // Étape 1 - Fonctionnalités de base (Terminé)
  {
    id: 'core-1',
    title: 'Génération d\'emails IA',
    description: 'Système de génération d\'emails avec intelligence artificielle',
    status: 'completed',
    category: 'core',
    priority: 'high',
    estimatedDate: 'Q1 2024',
    icon: Bot,
    features: [
      'Génération d\'emails personnalisés',
      'Multiples types d\'emails',
      'Interface intuitive'
    ]
  },
  {
    id: 'core-2',
    title: 'Gestion des templates',
    description: 'Système de création et gestion de templates',
    status: 'completed',
    category: 'core',
    priority: 'high',
    estimatedDate: 'Q1 2024',
    icon: FileText,
    features: [
      'Création de templates',
      'Modification et suppression',
      'Catégorisation'
    ]
  },
  {
    id: 'core-3',
    title: 'Historique et export',
    description: 'Système d\'historique et d\'export des emails',
    status: 'completed',
    category: 'core',
    priority: 'medium',
    estimatedDate: 'Q2 2024',
    icon: Download,
    features: [
      'Historique complet',
      'Export Word, PDF, Excel',
      'Recherche et filtres'
    ]
  },

  // Étape 2 - Fonctionnalités avancées (En cours)
  {
    id: 'ai-1',
    title: 'Recherche intelligente',
    description: 'Système de recherche avancée avec IA',
    status: 'in-progress',
    category: 'ai',
    priority: 'high',
    estimatedDate: 'Q3 2024',
    icon: Target,
    features: [
      'Recherche sémantique',
      'Filtres dynamiques',
      'Suggestions intelligentes'
    ]
  },
  {
    id: 'ai-2',
    title: 'Favoris et actions',
    description: 'Système de favoris et historique des actions',
    status: 'in-progress',
    category: 'ai',
    priority: 'medium',
    estimatedDate: 'Q3 2024',
    icon: Star,
    features: [
      'Marquage des favoris',
      'Historique des actions',
      'Statistiques avancées'
    ]
  },
  {
    id: 'security-1',
    title: 'Sécurité et RGPD',
    description: 'Système de sécurité avancé et conformité RGPD',
    status: 'in-progress',
    category: 'security',
    priority: 'high',
    estimatedDate: 'Q3 2024',
    icon: Shield,
    features: [
      'Double authentification',
      'Journal d\'accès',
      'Suppression automatique des données'
    ]
  },

  // Étape 3 - Fonctionnalités futures (Planifié)
  {
    id: 'ui-1',
    title: 'Design et branding',
    description: 'Amélioration du design et du branding',
    status: 'planned',
    category: 'ui',
    priority: 'medium',
    estimatedDate: 'Q4 2024',
    icon: Palette,
    features: [
      'Logo animé',
      'Page d\'accueil personnalisable',
      'Onboarding interactif'
    ]
  },
  {
    id: 'integration-1',
    title: 'Intégrations tierces',
    description: 'Intégration avec des services externes',
    status: 'planned',
    category: 'integration',
    priority: 'medium',
    estimatedDate: 'Q4 2024',
    icon: Cloud,
    features: [
      'Intégration Gmail',
      'Intégration Outlook',
      'API publique'
    ]
  },
  {
    id: 'ai-3',
    title: 'IA conversationnelle',
    description: 'Assistant IA conversationnel pour la génération',
    status: 'planned',
    category: 'ai',
    priority: 'high',
    estimatedDate: 'Q4 2024',
    icon: MessageSquare,
    features: [
      'Chat IA intégré',
      'Génération par conversation',
      'Suggestions contextuelles'
    ]
  },

  // Étape 4 - Fonctionnalités futures (Futur)
  {
    id: 'mobile-1',
    title: 'Application mobile',
    description: 'Application mobile native pour iOS et Android',
    status: 'future',
    category: 'ui',
    priority: 'medium',
    estimatedDate: 'Q1 2025',
    icon: Smartphone,
    features: [
      'App iOS native',
      'App Android native',
      'Synchronisation cloud'
    ]
  },
  {
    id: 'ai-4',
    title: 'IA multimodale',
    description: 'Support de l\'IA multimodale (texte, image, voix)',
    status: 'future',
    category: 'ai',
    priority: 'low',
    estimatedDate: 'Q2 2025',
    icon: Bot,
    features: [
      'Génération par image',
      'Reconnaissance vocale',
      'IA multimodale'
    ]
  },
  {
    id: 'global-1',
    title: 'Expansion internationale',
    description: 'Support multi-langues et expansion internationale',
    status: 'future',
    category: 'core',
    priority: 'medium',
    estimatedDate: 'Q2 2025',
    icon: Globe,
    features: [
      'Support 10+ langues',
      'Localisation complète',
      'Marchés internationaux'
    ]
  }
]

const statusConfig = {
  completed: {
    label: 'Terminé',
    color: 'bg-green-500',
    icon: CheckCircle,
    textColor: 'text-green-600'
  },
  'in-progress': {
    label: 'En cours',
    color: 'bg-blue-500',
    icon: Clock,
    textColor: 'text-blue-600'
  },
  planned: {
    label: 'Planifié',
    color: 'bg-orange-500',
    icon: Calendar,
    textColor: 'text-orange-600'
  },
  future: {
    label: 'Futur',
    color: 'bg-purple-500',
    icon: Star,
    textColor: 'text-purple-600'
  }
}

const categoryConfig = {
  core: { label: 'Fonctionnalités', color: 'bg-primary/10 text-primary' },
  ai: { label: 'Intelligence Artificielle', color: 'bg-blue-500/10 text-blue-600' },
  security: { label: 'Sécurité', color: 'bg-green-500/10 text-green-600' },
  ui: { label: 'Interface', color: 'bg-purple-500/10 text-purple-600' },
  integration: { label: 'Intégrations', color: 'bg-orange-500/10 text-orange-600' }
}

export default function RoadmapPage() {
  const completedItems = roadmapItems.filter(item => item.status === 'completed')
  const inProgressItems = roadmapItems.filter(item => item.status === 'in-progress')
  const plannedItems = roadmapItems.filter(item => item.status === 'planned')
  const futureItems = roadmapItems.filter(item => item.status === 'future')

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-8"
            >
              <AnimatedLogo size="lg" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            >
              Roadmap de développement
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            >
              Découvrez notre vision et les fonctionnalités à venir pour ProMail Assistant. 
              Nous travaillons constamment à améliorer votre expérience.
            </motion.p>

            {/* Statistiques */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{completedItems.length}</div>
                <div className="text-sm text-muted-foreground">Terminé</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{inProgressItems.length}</div>
                <div className="text-sm text-muted-foreground">En cours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">{plannedItems.length}</div>
                <div className="text-sm text-muted-foreground">Planifié</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{futureItems.length}</div>
                <div className="text-sm text-muted-foreground">Futur</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Roadmap Content */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Terminé */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Terminé</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <RoadmapCard item={item} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* En cours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">En cours</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <RoadmapCard item={item} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Planifié */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Planifié</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plannedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <RoadmapCard item={item} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Futur */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Futur</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {futureItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <RoadmapCard item={item} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Contribuez à notre roadmap
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Vos suggestions et retours nous aident à prioriser les fonctionnalités
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/register">
                    Tester les fonctionnalités
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about">
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  )
}

function RoadmapCard({ item }: { item: RoadmapItem }) {
  const status = statusConfig[item.status]
  const category = categoryConfig[item.category]

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
            <item.icon className="h-6 w-6" />
          </div>
          <Badge className={status.textColor}>
            <status.icon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </div>
        <CardTitle className="text-lg">{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Catégorie:</span>
            <Badge variant="outline" className="text-xs">
              {category.label}
            </Badge>
          </div>
          {item.estimatedDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Date estimée:</span>
              <span className="font-medium">{item.estimatedDate}</span>
            </div>
          )}
          <div className="pt-3 border-t">
            <p className="text-sm font-medium mb-2">Fonctionnalités:</p>
            <ul className="space-y-1">
              {item.features.map((feature, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${status.color}`} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 