// Performance monitoring utilities

export interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timeToInteractive: number
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, PerformanceMetrics> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Mesurer le temps de chargement de la page
  measurePageLoad(): number {
    const startTime = performance.now()
    const pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
    return pageLoadTime
  }

  // Mesurer le First Contentful Paint (FCP)
  measureFCP(): Promise<number> {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
        if (fcpEntry) {
          resolve(fcpEntry.startTime)
          observer.disconnect()
        }
      })
      observer.observe({ entryTypes: ['paint'] })
    })
  }

  // Mesurer le Largest Contentful Paint (LCP)
  measureLCP(): Promise<number> {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lcpEntry = entries[entries.length - 1]
        if (lcpEntry) {
          resolve(lcpEntry.startTime)
          observer.disconnect()
        }
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    })
  }

  // Mesurer le Cumulative Layout Shift (CLS)
  measureCLS(): Promise<number> {
    return new Promise((resolve) => {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
      })
      observer.observe({ entryTypes: ['layout-shift'] })
      
      // Arrêter la mesure après 5 secondes
      setTimeout(() => {
        observer.disconnect()
        resolve(clsValue)
      }, 5000)
    })
  }

  // Mesurer le First Input Delay (FID)
  measureFID(): Promise<number> {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fidEntry = entries[0]
        if (fidEntry) {
          resolve(fidEntry.processingStart - fidEntry.startTime)
          observer.disconnect()
        }
      })
      observer.observe({ entryTypes: ['first-input'] })
    })
  }

  // Mesurer le Time to Interactive (TTI)
  async measureTTI(): Promise<number> {
    const tti = await import('tti-polyfill')
    return tti.getFirstConsistentlyInteractive()
  }

  // Collecter toutes les métriques
  async collectMetrics(pageName: string): Promise<PerformanceMetrics> {
    const [fcp, lcp, cls, fid, tti] = await Promise.all([
      this.measureFCP(),
      this.measureLCP(),
      this.measureCLS(),
      this.measureFID(),
      this.measureTTI()
    ])

    const metrics: PerformanceMetrics = {
      pageLoadTime: this.measurePageLoad(),
      firstContentfulPaint: fcp,
      largestContentfulPaint: lcp,
      cumulativeLayoutShift: cls,
      firstInputDelay: fid,
      timeToInteractive: tti
    }

    this.metrics.set(pageName, metrics)
    this.logMetrics(pageName, metrics)
    return metrics
  }

  // Logger les métriques
  private logMetrics(pageName: string, metrics: PerformanceMetrics) {
    console.group(`🚀 Performance Metrics - ${pageName}`)
    console.log(`📄 Page Load Time: ${metrics.pageLoadTime.toFixed(2)}ms`)
    console.log(`🎨 First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`)
    console.log(`📊 Largest Contentful Paint: ${metrics.largestContentfulPaint.toFixed(2)}ms`)
    console.log(`📐 Cumulative Layout Shift: ${metrics.cumulativeLayoutShift.toFixed(3)}`)
    console.log(`⚡ First Input Delay: ${metrics.firstInputDelay.toFixed(2)}ms`)
    console.log(`🔄 Time to Interactive: ${metrics.timeToInteractive.toFixed(2)}ms`)
    console.groupEnd()

    // Envoyer les métriques au serveur (optionnel)
    this.sendMetricsToServer(pageName, metrics)
  }

  // Envoyer les métriques au serveur
  private async sendMetricsToServer(pageName: string, metrics: PerformanceMetrics) {
    try {
      await fetch('/api/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: pageName,
          metrics,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      })
    } catch (error) {
      console.warn('Failed to send performance metrics:', error)
    }
  }

  // Obtenir les métriques stockées
  getMetrics(pageName: string): PerformanceMetrics | undefined {
    return this.metrics.get(pageName)
  }

  // Obtenir toutes les métriques
  getAllMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.metrics)
  }

  // Nettoyer les métriques
  clearMetrics(): void {
    this.metrics.clear()
  }
}

// Hook React pour utiliser le moniteur de performance
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance()

  const measurePage = async (pageName: string) => {
    return await monitor.collectMetrics(pageName)
  }

  const getPageMetrics = (pageName: string) => {
    return monitor.getMetrics(pageName)
  }

  return {
    measurePage,
    getPageMetrics,
    monitor
  }
} 