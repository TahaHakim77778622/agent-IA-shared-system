"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Zap, Sparkles } from 'lucide-react'

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

export default function AnimatedLogo({ size = 'md', showText = true, className = '' }: AnimatedLogoProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)

  // Tailles du logo
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  // Animation au survol
  const handleMouseEnter = () => {
    setIsAnimating(true)
    setShowSparkles(true)
  }

  const handleMouseLeave = () => {
    setIsAnimating(false)
    setTimeout(() => setShowSparkles(false), 500)
  }

  // Animation automatique au chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true)
      setShowSparkles(true)
      setTimeout(() => {
        setIsAnimating(false)
        setTimeout(() => setShowSparkles(false), 500)
      }, 2000)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={`flex items-center gap-3 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo animé */}
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}
          animate={{
            scale: isAnimating ? [1, 1.1, 1] : 1,
            rotate: isAnimating ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
        >
          {/* Icône Mail */}
          <motion.div
            animate={{
              y: isAnimating ? [-2, 2, -2] : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: isAnimating ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <Mail className={`${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : size === 'lg' ? 'h-8 w-8' : 'h-12 w-12'} text-white`} />
          </motion.div>

          {/* Effet de brillance */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: isAnimating ? [-100, 100] : -100,
            }}
            transition={{
              duration: 1,
              repeat: isAnimating ? Infinity : 0,
              ease: "easeInOut"
            }}
          />

          {/* Étincelles */}
          <AnimatePresence>
            {showSparkles && (
              <>
                <motion.div
                  className="absolute -top-1 -right-1"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles className="h-3 w-3 text-yellow-400" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -left-1"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Sparkles className="h-3 w-3 text-yellow-400" />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Icône Zap flottante */}
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{
            scale: isAnimating ? [1, 1.2, 1] : 1,
            rotate: isAnimating ? [0, 360] : 0,
          }}
          transition={{
            duration: 2,
            repeat: isAnimating ? Infinity : 0,
            ease: "linear"
          }}
        >
          <Zap className="h-4 w-4 text-yellow-400 bg-white rounded-full p-0.5 shadow-md" />
        </motion.div>
      </div>

      {/* Texte du logo */}
      {showText && (
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.h1 
            className={`font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent ${textSizes[size]}`}
            animate={{
              backgroundPosition: isAnimating ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
            }}
            transition={{
              duration: 2,
              repeat: isAnimating ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            ProMail
          </motion.h1>
          <motion.p 
            className="text-xs text-muted-foreground font-medium"
            animate={{
              opacity: isAnimating ? [0.7, 1, 0.7] : 0.7,
            }}
            transition={{
              duration: 1.5,
              repeat: isAnimating ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            Assistant IA
          </motion.p>
        </motion.div>
      )}
    </div>
  )
} 