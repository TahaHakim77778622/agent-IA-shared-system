"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Mail, 
  Zap, 
  FileText, 
  History, 
  Download, 
  BarChart3, 
  Shield, 
  Bot,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  X
} from "lucide-react"

interface OnboardingModalProps {
  open: boolean
  onClose: () => void
  onComplete: () => void
}

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  features: string[]
  image?: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Bienvenue dans ProMail Assistant",
    description: "Découvrez comment notre IA peut révolutionner vos emails professionnels",
    icon: Sparkles,
    color: "text-primary",
    features: [
      "Génération d'emails en quelques secondes",
      "Personnalisation intelligente",
      "Templates professionnels"
    ]
  },
  {
    id: 2,
    title: "Générateur IA",
    description: "Créez des emails parfaits avec notre intelligence artificielle",
    icon: Bot,
    color: "text-blue-500",
    features: [
      "Sélectionnez le type d'email",
      "Ajoutez vos informations",
      "L'IA génère votre email"
    ]
  },
  {
    id: 3,
    title: "Templates & Historique",
    description: "Gérez vos modèles et retrouvez tous vos emails",
    icon: FileText,
    color: "text-green-500",
    features: [
      "Bibliothèque de templates",
      "Historique complet",
      "Recherche intelligente"
    ]
  },
  {
    id: 4,
    title: "Export & Statistiques",
    description: "Exportez vos emails et suivez vos performances",
    icon: Download,
    color: "text-purple-500",
    features: [
      "Export en Word, PDF, Excel",
      "Statistiques détaillées",
      "Suivi de productivité"
    ]
  },
  {
    id: 5,
    title: "Sécurité & RGPD",
    description: "Vos données sont protégées avec les meilleures pratiques",
    icon: Shield,
    color: "text-orange-500",
    features: [
      "Double authentification",
      "Conformité RGPD",
      "Chiffrement SSL/TLS"
    ]
  }
]

export default function OnboardingModal({ open, onClose, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setCompletedSteps([...completedSteps, currentStep])
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const currentStepData = onboardingSteps[currentStep]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          {/* Bouton fermer */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="absolute right-0 top-0"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Barre de progression */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Étape {currentStep + 1} sur {onboardingSteps.length}
              </span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Indicateurs d'étapes */}
          <div className="flex justify-center gap-2 mb-6">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-primary'
                    : completedSteps.includes(index)
                    ? 'bg-green-500'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contenu de l'étape */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Icône */}
              <div className="flex justify-center mb-6">
                <div className={`w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center ${currentStepData.color}`}>
                  <currentStepData.icon className="h-8 w-8" />
                </div>
              </div>

              {/* Titre */}
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {currentStepData.title}
              </h2>

              {/* Description */}
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {currentStepData.description}
              </p>

              {/* Fonctionnalités */}
              <div className="space-y-3">
                {currentStepData.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Précédent
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSkip}>
                Passer
              </Button>
              <Button onClick={handleNext} className="flex items-center gap-2">
                {currentStep === onboardingSteps.length - 1 ? (
                  <>
                    Terminer
                    <CheckCircle className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 