from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging
from auth import get_current_user
from models import User
from schemas import User as UserSchema
from fastapi import Depends
import importlib.util
import sys

# Charger les variables d'environnement
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Email Management API",
    version="1.0.0",
    description="API pour la gestion des emails et l'historique de connexion utilisateur."
)

# Configuration CORS (à adapter selon ton frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Remplace par l'URL de ton frontend en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Créer les tables au démarrage
from database import engine
from models import Base

@app.on_event("startup")
async def startup_event():
    try:
        if engine is not None:
            Base.metadata.create_all(bind=engine)
            logger.info("✅ Tables créées avec succès")
        else:
            logger.warning("⚠️ Moteur de base de données non disponible")
    except Exception as e:
        logger.error(f"❌ Erreur lors de la création des tables: {e}")

# Importer et inclure les routes
from api import emails, login, register, login_history
from api import generate_email  # Import du nouveau router
from api import templates  # Import du router templates
from api import chatbot  # Import du router chatbot

app.include_router(emails.router, prefix="/api/emails", tags=["emails"])
app.include_router(login.router, prefix="/api/login", tags=["login"])
app.include_router(register.router, prefix="/api/register", tags=["register"])
app.include_router(register.router, prefix="/api", tags=["register"])
app.include_router(login_history.router, prefix="/api/login-history", tags=["login-history"])
app.include_router(generate_email.router, prefix="/api/generate-email", tags=["generate-email"])
app.include_router(templates.router, prefix="/api/templates", tags=["templates"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["chatbot"])

# Route racine
@app.get("/")
def root():
    return {"message": "Bienvenue sur l'API Email Management!"}

@app.get("/users/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user 