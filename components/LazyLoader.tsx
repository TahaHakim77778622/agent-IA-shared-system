"use client"

import { useState, useEffect, Suspense } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface LazyLoaderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  delay?: number
  threshold?: number
}

export default function LazyLoader({ 
  children, 
  fallback = <LoadingSpinner text="Chargement..." />, 
  delay = 0,
  threshold = 0.1 
}: LazyLoaderProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasLoaded(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    const element = document.createElement('div')
    observer.observe(element)

    return () => observer.disconnect()
  }, [isVisible, threshold])

  if (!isVisible) {
    return <LoadingSpinner text="Initialisation..." />
  }

  if (!hasLoaded) {
    return <>{fallback}</>
  }

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
} 