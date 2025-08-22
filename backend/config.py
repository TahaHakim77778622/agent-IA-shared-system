"""
Configuration centralisée pour l'application FastAPI
"""

import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

class Settings:
    # Base de données (forcer MySQL+pymysql)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/taha_db")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Serveur
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",  # Frontend Next.js
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]
    
    # Application
    APP_NAME: str = "TAHA Email Management API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "API de gestion des emails avec authentification JWT"
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info")
    
    @classmethod
    def get_database_url(cls) -> str:
        """Obtenir l'URL de la base de données"""
        return cls.DATABASE_URL
    
    @classmethod
    def get_secret_key(cls) -> str:
        """Obtenir la clé secrète"""
        return cls.SECRET_KEY
    
    @classmethod
    def get_cors_origins(cls) -> list:
        """Obtenir les origines CORS autorisées"""
        return cls.ALLOWED_ORIGINS

# Instance globale des paramètres
settings = Settings() 