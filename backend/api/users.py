from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserUpdate, PasswordChange
from auth import get_current_user
from crud import update_user, update_user_password
import bcrypt

router = APIRouter()
security = HTTPBearer()

@router.get("/me")
def get_user_profile(current_user: User = Depends(get_current_user)):
    """Récupérer le profil de l'utilisateur connecté"""
    return current_user

@router.put("/me")
def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mettre à jour le profil de l'utilisateur connecté"""
    try:
        updated_user = update_user(db, current_user.id, user_update)
        return {
            "message": "Profil mis à jour avec succès",
            "user": {
                "id": updated_user.id,
                "email": updated_user.email,
                "first_name": updated_user.first_name,
                "last_name": updated_user.last_name
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la mise à jour du profil: {str(e)}"
        )

@router.post("/change-password")
def change_password(
    password_change: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Changer le mot de passe de l'utilisateur connecté"""
    try:
        # Vérifier l'ancien mot de passe
        if not bcrypt.checkpw(
            password_change.current_password.encode('utf-8'),
            current_user.password.encode('utf-8')
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mot de passe actuel incorrect"
            )
        
        # Mettre à jour le mot de passe
        updated_user = update_user_password(db, current_user.id, password_change.new_password)
        return {
            "message": "Mot de passe changé avec succès",
            "user": {
                "id": updated_user.id,
                "email": updated_user.email
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors du changement de mot de passe: {str(e)}"
        ) 