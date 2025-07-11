#!/usr/bin/env python3
"""
Script de démarrage du serveur FastAPI
"""

import uvicorn
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

if __name__ == "__main__":
    # Configuration du serveur
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    
    print(f"🚀 Démarrage du serveur FastAPI sur {host}:{port}")
    print(f"📚 Documentation: http://{host}:{port}/docs")
    print(f"🔗 API: http://{host}:{port}")
    
    # Démarrer le serveur
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,  # Rechargement automatique en développement
        log_level="info"
    ) 