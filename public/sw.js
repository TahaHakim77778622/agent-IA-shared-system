// Service Worker pour ProMail Assistant PWA

const CACHE_NAME = 'promail-assistant-v1.0.0'
const STATIC_CACHE = 'promail-static-v1.0.0'
const DYNAMIC_CACHE = 'promail-dynamic-v1.0.0'

// Ressources à mettre en cache statiquement
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
]

// Stratégies de cache
const CACHE_STRATEGIES = {
  // Cache First pour les ressources statiques
  CACHE_FIRST: 'cache-first',
  // Network First pour les données dynamiques
  NETWORK_FIRST: 'network-first',
  // Stale While Revalidate pour les ressources importantes
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
}

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker: Installation en cours...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Mise en cache des ressources statiques')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('✅ Service Worker: Installation terminée')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('❌ Service Worker: Erreur lors de l\'installation', error)
      })
  )
})

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker: Activation en cours...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Supprimer les anciens caches
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Service Worker: Suppression de l\'ancien cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker: Activation terminée')
        return self.clients.claim()
      })
  )
})

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return
  }

  // Ignorer les requêtes vers l'API
  if (url.pathname.startsWith('/api/')) {
    return
  }

  // Ignorer les requêtes de développement
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return
  }

  event.respondWith(handleRequest(request))
})

// Gestion des requêtes selon leur type
async function handleRequest(request) {
  const url = new URL(request.url)

  try {
    // Ressources statiques (CSS, JS, images)
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request)
    }

    // Pages HTML
    if (request.headers.get('accept')?.includes('text/html')) {
      return await networkFirst(request)
    }

    // Données dynamiques
    return await staleWhileRevalidate(request)

  } catch (error) {
    console.error('❌ Service Worker: Erreur lors du traitement de la requête', error)
    
    // Retourner la page offline en cas d'erreur
    if (request.headers.get('accept')?.includes('text/html')) {
      return await getOfflinePage()
    }
    
    throw error
  }
}

// Stratégie Cache First
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.warn('⚠️ Service Worker: Impossible de récupérer la ressource', request.url)
    throw error
  }
}

// Stratégie Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('📱 Service Worker: Mode hors ligne, utilisation du cache')
    
    const cache = await caches.open(DYNAMIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    return await getOfflinePage()
  }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(() => {
    console.warn('⚠️ Service Worker: Échec de la mise à jour du cache')
  })

  return cachedResponse || fetchPromise
}

// Vérifier si c'est une ressource statique
function isStaticAsset(pathname) {
  return /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/.test(pathname)
}

// Obtenir la page offline
async function getOfflinePage() {
  const cache = await caches.open(STATIC_CACHE)
  const offlineResponse = await cache.match('/offline.html')
  
  if (offlineResponse) {
    return offlineResponse
  }
  
  // Page offline de fallback
  const fallbackHTML = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ProMail Assistant - Hors ligne</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          text-align: center;
          padding: 2rem;
          max-width: 400px;
        }
        .icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        h1 {
          margin-bottom: 1rem;
        }
        p {
          opacity: 0.9;
          line-height: 1.6;
        }
        .retry-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          margin-top: 1rem;
          transition: background 0.3s;
        }
        .retry-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📧</div>
        <h1>ProMail Assistant</h1>
        <p>Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent ne pas être disponibles.</p>
        <button class="retry-btn" onclick="window.location.reload()">
          Réessayer
        </button>
      </div>
    </body>
    </html>
  `
  
  return new Response(fallbackHTML, {
    headers: { 'Content-Type': 'text/html' }
  })
}

// Gestion des messages du client
self.addEventListener('message', (event) => {
  const { type, data } = event.data

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME })
      break
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true })
      })
      break
      
    default:
      console.log('📨 Service Worker: Message reçu', type, data)
  }
})

// Nettoyer tous les caches
async function clearAllCaches() {
  const cacheNames = await caches.keys()
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  )
}

// Gestion des notifications push (pour les futures fonctionnalités)
self.addEventListener('push', (event) => {
  console.log('📱 Service Worker: Notification push reçue')
  
  const options = {
    body: event.data?.text() || 'Nouvelle notification de ProMail Assistant',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ouvrir',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/icons/icon-72x72.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('ProMail Assistant', options)
  )
})

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Service Worker: Clic sur notification')
  
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    )
  }
}) 