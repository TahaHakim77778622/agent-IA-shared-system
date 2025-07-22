from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, User as UserSchema
from auth import get_password_hash, verify_password, get_current_user
from crud import create_user, get_user_by_email
import logging
import smtplib
from email.mime.text import MIMEText
import secrets
from datetime import datetime, timedelta
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()

# Stockage temporaire des tokens de reset (en prod, utiliser la base !)
reset_tokens = {}  # email: {token, expires}

class EmailRequest(BaseModel):
    email: str

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

# Nouveau : Modifier nom/prénom utilisateur connecté
@router.put("/me", response_model=UserSchema)
def update_me(
    first_name: str = Body(...),
    last_name: str = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        current_user.first_name = first_name
        current_user.last_name = last_name
        db.commit()
        db.refresh(current_user)
        return current_user
    except Exception as e:
        logger.error(f"Erreur lors de la modification du profil: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la modification du profil")

# Nouveau : Changer le mot de passe utilisateur connecté
@router.post("/me/change-password")
def change_password(
    old_password: str = Body(...),
    new_password: str = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(old_password, current_user.password):
        raise HTTPException(status_code=400, detail="Ancien mot de passe incorrect")
    if old_password == new_password:
        raise HTTPException(status_code=400, detail="Le nouveau mot de passe doit être différent de l'ancien")
    try:
        current_user.password = get_password_hash(new_password)
        db.commit()
        return {"message": "Mot de passe modifié avec succès"}
    except Exception as e:
        logger.error(f"Erreur lors du changement de mot de passe: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors du changement de mot de passe")

# Endpoint: demander la réinitialisation du mot de passe
@router.post("/forgot-password/")
def forgot_password(data: EmailRequest):
    email = data.email
    print(">>> Endpoint /forgot-password/ appelé avec email:", email)
    # Générer un token sécurisé
    token = secrets.token_urlsafe(32)
    expires = datetime.utcnow() + timedelta(hours=1)
    reset_tokens[email] = {"token": token, "expires": expires}

    # Construire le lien de reset (à adapter selon le frontend)
    reset_link = f"http://localhost:3000/reset-password?token={token}&email={email}"
    subject = "Réinitialisation de votre mot de passe"
    body = f"Bonjour,\n\nPour réinitialiser votre mot de passe, cliquez sur ce lien : {reset_link}\nCe lien expire dans 1h.\n\nSi vous n'avez pas demandé ce changement, ignorez cet email."

    # Envoyer l'email via Gmail SMTP
    try:
        print("Envoi email...")
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        smtp_user = "th082919@gmail.com"  # Ton adresse Gmail
        smtp_password = "ibnd ssmx gzza ifpq"  # Mot de passe d'application généré
        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = smtp_user
        msg["To"] = email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [email], msg.as_string())
        print("Email envoyé via FastAPI")
    except Exception as e:
        print("Erreur SMTP:", e)
        logger.error(f"Erreur lors de l'envoi de l'email de reset: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'envoi de l'email")
    return {"message": "Email de réinitialisation envoyé"}

# Endpoint: réinitialiser le mot de passe avec le token
@router.post("/reset-password/")
def reset_password(email: str = Body(...), token: str = Body(...), new_password: str = Body(...), db: Session = Depends(get_db)):
    # Vérifier le token
    entry = reset_tokens.get(email)
    if not entry or entry["token"] != token or entry["expires"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token invalide ou expiré")
    user = get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    user.password = get_password_hash(new_password)
    db.commit()
    # Invalider le token
    del reset_tokens[email]
    return {"message": "Mot de passe réinitialisé avec succès"} 