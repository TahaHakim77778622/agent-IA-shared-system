from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
import os
import cohere
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from models import User
from schemas import EmailCreate
from crud import create_email

router = APIRouter()

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
print("COHERE_API_KEY =", COHERE_API_KEY)

class EmailPrompt(BaseModel):
    prompt: str
    subject: str = "Email généré par IA"
    type: str | None = None
    recipient: str | None = None
    company: str | None = None
    # Tu peux ajouter d'autres champs si besoin (destinataire, etc.)

def generate_email_with_cohere(prompt: str) -> str:
    if not COHERE_API_KEY:
        raise HTTPException(status_code=500, detail="Clé API Cohere manquante.")
    co = cohere.Client(COHERE_API_KEY)
    try:
        response = co.generate(
            model="command",
            prompt=prompt,
            max_tokens=300,
            temperature=0.7,
        )
        return response.generations[0].text.strip()
    except Exception as e:
        print("Erreur Cohere:", e)
        raise HTTPException(status_code=500, detail=f"Erreur Cohere: {e}")

@router.post("/generate-email")
async def generate_email(
    prompt: EmailPrompt,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        print("Prompt envoyé :", prompt.prompt)
        email_body = generate_email_with_cohere(prompt.prompt)
        # Utiliser le type comme sujet si subject n'est pas fourni
        subject = prompt.subject or (prompt.type or "Email généré par IA").capitalize()
        email_obj = EmailCreate(
            subject=subject,
            body=email_body,
            type=prompt.type,
            recipient=prompt.recipient,
            company=prompt.company,
        )
        create_email(db=db, email=email_obj, user_id=current_user.id)
        return {"email": email_body}
    except Exception as e:
        print("Erreur lors de la génération de l'email :", e)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e)) 