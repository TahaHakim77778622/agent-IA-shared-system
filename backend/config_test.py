"""
Configuration de test pour éviter les erreurs d'importation
"""

import os

# Configuration par défaut pour les tests
os.environ.setdefault("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/agent_db")
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-development")
os.environ.setdefault("HOST", "0.0.0.0")
os.environ.setdefault("PORT", "8000")
os.environ.setdefault("LOG_LEVEL", "info") 