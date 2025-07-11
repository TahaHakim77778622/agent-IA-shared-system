#!/usr/bin/env python3
"""
Script de démarrage simple pour le serveur FastAPI
"""

import uvicorn
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

if __name__ == "__main__":
    print("🚀 Démarrage du serveur FastAPI...")
    print("📚 Documentation: http://localhost:8000/docs")
    print("🔗 API: http://localhost:8000")
    
    # Démarrer le serveur
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 