from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User
from schemas import Email, EmailCreate, EmailUpdate
from crud import create_email, get_emails, get_email, update_email, delete_email
from auth import get_current_user
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=List[Email])
def list_emails(
    skip: int = 0, 
    limit: int = 100, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtenir tous les emails de l'utilisateur connecté"""
    try:
        emails = get_emails(db, user_id=current_user.id, skip=skip, limit=limit)
        return emails
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des emails: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des emails"
        )

@router.post("/", response_model=Email)
def create_user_email(
    email: EmailCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Créer un nouvel email pour l'utilisateur connecté"""
    try:
        return create_email(db=db, email=email, user_id=current_user.id)
    except Exception as e:
        logger.error(f"Erreur lors de la création de l'email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la création de l'email"
        )

@router.get("/{email_id}", response_model=Email)
def read_email(
    email_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtenir un email spécifique de l'utilisateur connecté"""
    try:
        email = get_email(db, email_id=email_id, user_id=current_user.id)
        if email is None:
            raise HTTPException(status_code=404, detail="Email non trouvé")
        return email
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors de la récupération de l'email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération de l'email"
        )

@router.put("/{email_id}", response_model=Email)
def update_user_email(
    email_id: int,
    email_update: EmailUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Modifier un email de l'utilisateur connecté"""
    try:
        email = update_email(db, email_id=email_id, user_id=current_user.id, email_update=email_update)
        if email is None:
            raise HTTPException(status_code=404, detail="Email non trouvé")
        return email
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors de la modification de l'email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la modification de l'email"
        )

@router.delete("/{email_id}")
def delete_user_email(
    email_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Supprimer un email de l'utilisateur connecté"""
    try:
        success = delete_email(db, email_id=email_id, user_id=current_user.id)
        if not success:
            raise HTTPException(status_code=404, detail="Email non trouvé")
        return {"message": "Email supprimé avec succès"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors de la suppression de l'email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la suppression de l'email"
        ) 