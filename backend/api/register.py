from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, User as UserSchema
from auth import get_password_hash
from crud import create_user, get_user_by_email
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=UserSchema)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Enregistrer un nouvel utilisateur avec prénom et nom"""
    try:
        db_user = get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email déjà enregistré"
            )
        created_user = create_user(db=db, user=user)
        logger.info(f"Utilisateur créé avec succès: {created_user.email}")
        return created_user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors de l'enregistrement: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur interne du serveur"
        ) 