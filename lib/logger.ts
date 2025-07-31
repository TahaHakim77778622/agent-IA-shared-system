// Système de logging avancé pour le monitoring

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  userId?: string
  sessionId?: string
  userAgent?: string
  url?: string
  stack?: string
}

export interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableRemote: boolean
  remoteEndpoint?: string
  maxBufferSize: number
  flushInterval: number
}

class Logger {
  private config: LoggerConfig
  private buffer: LogEntry[] = []
  private sessionId: string
  private userId?: string

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableRemote: true,
      maxBufferSize: 100,
      flushInterval: 5000,
      ...config
    }

    this.sessionId = this.generateSessionId()
    this.setupAutoFlush()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private setupAutoFlush(): void {
    if (this.config.enableRemote) {
      setInterval(() => {
        this.flush()
      }, this.config.flushInterval)
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    if (this.userId) {
      entry.userId = this.userId
    }

    if (level >= LogLevel.ERROR) {
      entry.stack = new Error().stack
    }

    return entry
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level)) return

    const entry = this.formatMessage(level, message, context)

    // Log dans la console
    if (this.config.enableConsole) {
      this.logToConsole(level, entry)
    }

    // Ajouter au buffer pour envoi distant
    if (this.config.enableRemote) {
      this.buffer.push(entry)
      
      if (this.buffer.length >= this.config.maxBufferSize) {
        this.flush()
      }
    }
  }

  private logToConsole(level: LogLevel, entry: LogEntry): void {
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
    const levelName = levelNames[level]
    const timestamp = new Date(entry.timestamp).toLocaleTimeString()

    const consoleMethod = level >= LogLevel.ERROR ? 'error' : 
                         level >= LogLevel.WARN ? 'warn' : 
                         level >= LogLevel.INFO ? 'info' : 'debug'

    const prefix = `[${timestamp}] [${levelName}]`
    
    if (entry.context) {
      console[consoleMethod](prefix, entry.message, entry.context)
    } else {
      console[consoleMethod](prefix, entry.message)
    }
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0 || !this.config.enableRemote) return

    const logsToSend = [...this.buffer]
    this.buffer = []

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: logsToSend,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.warn('Failed to send logs to server:', error)
      // Remettre les logs dans le buffer en cas d'échec
      this.buffer.unshift(...logsToSend)
    }
  }

  // Méthodes publiques de logging
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context)
  }

  fatal(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context)
  }

  // Méthodes spécialisées
  userAction(action: string, details?: Record<string, any>): void {
    this.info(`User Action: ${action}`, {
      type: 'user_action',
      action,
      ...details
    })
  }

  apiCall(endpoint: string, method: string, status: number, duration: number, error?: string): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO
    this.log(level, `API Call: ${method} ${endpoint}`, {
      type: 'api_call',
      endpoint,
      method,
      status,
      duration,
      error
    })
  }

  performance(metric: string, value: number, unit: string = 'ms'): void {
    this.info(`Performance: ${metric}`, {
      type: 'performance',
      metric,
      value,
      unit
    })
  }

  security(event: string, details?: Record<string, any>): void {
    this.warn(`Security Event: ${event}`, {
      type: 'security',
      event,
      ...details
    })
  }

  // Configuration
  setUserId(userId: string): void {
    this.userId = userId
  }

  setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config }
  }

  // Force flush
  async forceFlush(): Promise<void> {
    await this.flush()
  }

  // Obtenir les logs du buffer
  getBuffer(): LogEntry[] {
    return [...this.buffer]
  }

  // Nettoyer le buffer
  clearBuffer(): void {
    this.buffer = []
  }
}

// Instance singleton
export const logger = new Logger()

// Hook React pour utiliser le logger
export function useLogger() {
  return {
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
    fatal: logger.fatal.bind(logger),
    userAction: logger.userAction.bind(logger),
    apiCall: logger.apiCall.bind(logger),
    performance: logger.performance.bind(logger),
    security: logger.security.bind(logger),
    setUserId: logger.setUserId.bind(logger)
  }
}

// Middleware pour intercepter les erreurs globales
export function setupErrorHandling(): void {
  // Intercepter les erreurs JavaScript
  window.addEventListener('error', (event) => {
    logger.error('JavaScript Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack
    })
  })

  // Intercepter les promesses rejetées
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled Promise Rejection', {
      reason: event.reason,
      promise: event.promise
    })
  })

  // Intercepter les erreurs de chargement de ressources
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      logger.error('Resource Loading Error', {
        target: event.target,
        type: event.type
      })
    }
  }, true)
}

// Intercepteur pour les appels API
export function createApiInterceptor(): void {
  const originalFetch = window.fetch

  window.fetch = async (...args) => {
    const startTime = performance.now()
    const [url, options] = args

    try {
      const response = await originalFetch(...args)
      const duration = performance.now() - startTime

      logger.apiCall(
        typeof url === 'string' ? url : url.toString(),
        options?.method || 'GET',
        response.status,
        duration
      )

      return response
    } catch (error) {
      const duration = performance.now() - startTime

      logger.apiCall(
        typeof url === 'string' ? url : url.toString(),
        options?.method || 'GET',
        0,
        duration,
        error instanceof Error ? error.message : String(error)
      )

      throw error
    }
  }
} 