from fastapi import APIRouter, HTTPException, status, Request, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import User as UserSchema
from crud import get_user_by_email
from auth import get_password_hash
import secrets, datetime
from typing import Dict
import os
import smtplib
from email.mime.text import MIMEText
from pydantic import BaseModel

router = APIRouter()

# Stockage temporaire des tokens de reset (en prod, utiliser une table !)
reset_tokens: Dict[str, Dict] = {}

# Fonction d'envoi d'email via Gmail
GMAIL_USER = os.environ.get("GMAIL_USER")
GMAIL_PASS = os.environ.get("GMAIL_PASS")

def send_reset_email(to_email, reset_link):
    msg = MIMEText(f"Cliquez ici pour réinitialiser votre mot de passe : {reset_link}")
    msg['Subject'] = "Réinitialisation de votre mot de passe"
    msg['From'] = GMAIL_USER
    msg['To'] = to_email
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(GMAIL_USER, GMAIL_PASS)
        server.send_message(msg)

class EmailRequest(BaseModel):
    email: str

@router.post("/forgot-password/")
def forgot_password(request: Request, data: EmailRequest, db: Session = Depends(get_db)):
    """Envoie un email de réinitialisation de mot de passe (Gmail)"""
    email = data.email
    user = get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="Aucun utilisateur avec cet email")
    token = secrets.token_urlsafe(32)
    reset_tokens[token] = {
        "user_id": user.id,
        "expires": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    reset_link = f"http://localhost:3000/reset-password?token={token}"
    try:
        print(f"Envoi de l'email de reset à {email} via Gmail...")
        send_reset_email(email, reset_link)
        print("Email envoyé (ou pas d'erreur levée)")
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'envoi de l'email")
    return {"message": "Email de réinitialisation envoyé", "reset_link": reset_link}

@router.post("/reset-password/")
def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    """Réinitialise le mot de passe via le token"""
    data = reset_tokens.get(token)
    if not data:
        raise HTTPException(status_code=400, detail="Token invalide ou expiré")
    if data["expires"] < datetime.datetime.utcnow():
        del reset_tokens[token]
        raise HTTPException(status_code=400, detail="Token expiré")
    user = db.query(User).filter(User.id == data["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    user.password = get_password_hash(new_password)
    db.commit()
    del reset_tokens[token]
    return {"message": "Mot de passe réinitialisé avec succès"} 