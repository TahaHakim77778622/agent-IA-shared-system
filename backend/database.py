from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

load_dotenv()

# Forcer l'utilisation de MySQL + pymysql
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/agent_db")

try:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        echo=False,
        connect_args={"charset": "utf8mb4"}
    )
    logger.info("Moteur MySQL créé avec succès")
except Exception as e:
    logger.error(f"Erreur lors de la création du moteur de base de données: {e}")
    engine = None

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) if engine else None

Base = declarative_base()

def get_db():
    if SessionLocal is None:
        raise Exception("Base de données non configurée")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 