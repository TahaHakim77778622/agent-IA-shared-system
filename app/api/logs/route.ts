import { NextRequest, NextResponse } from 'next/server'

interface LogEntry {
  timestamp: string
  level: number
  message: string
  context?: Record<string, any>
  userId?: string
  sessionId?: string
  userAgent?: string
  url?: string
  stack?: string
}

interface LogRequest {
  logs: LogEntry[]
  sessionId: string
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LogRequest = await request.json()
    const { logs, sessionId, timestamp } = body

    // Valider les données reçues
    if (!Array.isArray(logs) || logs.length === 0) {
      return NextResponse.json(
        { error: 'Invalid logs data' },
        { status: 400 }
      )
    }

    // Traiter chaque log
    const processedLogs = logs.map(log => ({
      ...log,
      receivedAt: new Date().toISOString(),
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    }))

    // Ici, vous pouvez stocker les logs dans une base de données
    // Pour l'instant, on les affiche dans la console du serveur
    console.group(`📊 Logs from session ${sessionId}`)
    processedLogs.forEach(log => {
      const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
      const levelName = levelNames[log.level] || 'UNKNOWN'
      
      console.log(`[${levelName}] ${log.message}`, {
        timestamp: log.timestamp,
        context: log.context,
        userId: log.userId,
        url: log.url,
        ip: log.ip
      })
    })
    console.groupEnd()

    // En production, vous pourriez stocker dans une base de données
    // await db.logs.insertMany(processedLogs)

    // Analyser les logs pour détecter des problèmes
    const errorLogs = processedLogs.filter(log => log.level >= 3) // ERROR et FATAL
    if (errorLogs.length > 0) {
      console.warn(`🚨 ${errorLogs.length} error(s) detected in session ${sessionId}`)
      
      // Ici, vous pourriez envoyer une alerte (email, Slack, etc.)
      // await sendAlert(errorLogs)
    }

    // Statistiques de performance
    const performanceLogs = processedLogs.filter(log => 
      log.context?.type === 'performance'
    )
    if (performanceLogs.length > 0) {
      const avgResponseTime = performanceLogs
        .filter(log => log.context?.metric === 'api_response_time')
        .reduce((sum, log) => sum + (log.context?.value || 0), 0) / performanceLogs.length

      if (avgResponseTime > 1000) { // Plus de 1 seconde
        console.warn(`🐌 Slow performance detected: ${avgResponseTime.toFixed(2)}ms average response time`)
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedLogs.length,
      sessionId
    })

  } catch (error) {
    console.error('Error processing logs:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Endpoint pour récupérer les logs (optionnel)
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  const level = searchParams.get('level')
  const limit = parseInt(searchParams.get('limit') || '100')

  try {
    // Ici, vous pourriez récupérer les logs depuis la base de données
    // const logs = await db.logs.find({
    //   ...(sessionId && { sessionId }),
    //   ...(level && { level: parseInt(level) })
    // }).limit(limit).sort({ timestamp: -1 })

    return NextResponse.json({
      success: true,
      logs: [], // logs from database
      count: 0
    })

  } catch (error) {
    console.error('Error retrieving logs:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 