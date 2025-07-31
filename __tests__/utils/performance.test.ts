import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PerformanceMonitor } from '@/lib/performance'

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => 1000),
  timing: {
    loadEventEnd: 2000,
    navigationStart: 1000
  }
}

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true
})

// Mock PerformanceObserver
const mockObserver = {
  observe: vi.fn(),
  disconnect: vi.fn()
}

global.PerformanceObserver = vi.fn().mockImplementation(() => mockObserver)

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor

  beforeEach(() => {
    monitor = PerformanceMonitor.getInstance()
    vi.clearAllMocks()
  })

  it('should be a singleton', () => {
    const instance1 = PerformanceMonitor.getInstance()
    const instance2 = PerformanceMonitor.getInstance()
    expect(instance1).toBe(instance2)
  })

  it('should measure page load time', () => {
    const loadTime = monitor.measurePageLoad()
    expect(loadTime).toBe(1000) // 2000 - 1000
  })

  it('should measure FCP', async () => {
    const fcpPromise = monitor.measureFCP()
    
    // Simuler l'événement FCP
    setTimeout(() => {
      const observer = (PerformanceObserver as any).mock.results[0].value
      const callback = observer.observe.mock.calls[0][0]
      callback({
        getEntries: () => [{
          name: 'first-contentful-paint',
          startTime: 1500
        }]
      })
    }, 100)

    const fcp = await fcpPromise
    expect(fcp).toBe(1500)
  })

  it('should measure LCP', async () => {
    const lcpPromise = monitor.measureLCP()
    
    // Simuler l'événement LCP
    setTimeout(() => {
      const observer = (PerformanceObserver as any).mock.results[0].value
      const callback = observer.observe.mock.calls[0][0]
      callback({
        getEntries: () => [{
          startTime: 2500
        }]
      })
    }, 100)

    const lcp = await lcpPromise
    expect(lcp).toBe(2500)
  })

  it('should measure CLS', async () => {
    const clsPromise = monitor.measureCLS()
    
    // Simuler les événements de layout shift
    setTimeout(() => {
      const observer = (PerformanceObserver as any).mock.results[0].value
      const callback = observer.observe.mock.calls[0][0]
      callback({
        getEntries: () => [{
          hadRecentInput: false,
          value: 0.1
        }]
      })
    }, 100)

    const cls = await clsPromise
    expect(cls).toBeGreaterThanOrEqual(0)
  })

  it('should measure FID', async () => {
    const fidPromise = monitor.measureFID()
    
    // Simuler l'événement FID
    setTimeout(() => {
      const observer = (PerformanceObserver as any).mock.results[0].value
      const callback = observer.observe.mock.calls[0][0]
      callback({
        getEntries: () => [{
          processingStart: 3000,
          startTime: 2800
        }]
      })
    }, 100)

    const fid = await fidPromise
    expect(fid).toBe(200) // 3000 - 2800
  })

  it('should collect all metrics', async () => {
    // Mock fetch pour éviter les erreurs réseau
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    })

    const metrics = await monitor.collectMetrics('test-page')
    
    expect(metrics).toHaveProperty('pageLoadTime')
    expect(metrics).toHaveProperty('firstContentfulPaint')
    expect(metrics).toHaveProperty('largestContentfulPaint')
    expect(metrics).toHaveProperty('cumulativeLayoutShift')
    expect(metrics).toHaveProperty('firstInputDelay')
    expect(metrics).toHaveProperty('timeToInteractive')
  })

  it('should store and retrieve metrics', async () => {
    const mockMetrics = {
      pageLoadTime: 1000,
      firstContentfulPaint: 1500,
      largestContentfulPaint: 2500,
      cumulativeLayoutShift: 0.1,
      firstInputDelay: 200,
      timeToInteractive: 3000
    }

    // Simuler la collecte de métriques
    vi.spyOn(monitor, 'measureFCP').mockResolvedValue(1500)
    vi.spyOn(monitor, 'measureLCP').mockResolvedValue(2500)
    vi.spyOn(monitor, 'measureCLS').mockResolvedValue(0.1)
    vi.spyOn(monitor, 'measureFID').mockResolvedValue(200)
    vi.spyOn(monitor, 'measureTTI').mockResolvedValue(3000)

    await monitor.collectMetrics('test-page')
    
    const retrievedMetrics = monitor.getMetrics('test-page')
    expect(retrievedMetrics).toBeDefined()
    expect(retrievedMetrics?.pageLoadTime).toBe(1000)
  })

  it('should clear metrics', () => {
    monitor.clearMetrics()
    const metrics = monitor.getAllMetrics()
    expect(metrics.size).toBe(0)
  })
}) 