from fastapi import APIRouter, HTTPException, Request
import os
import cohere
from dotenv import load_dotenv

load_dotenv()

COHERE_API_KEY = os.getenv("COHERE_API_KEY")

router = APIRouter()

@router.post("/", summary="Chatbot IA Cohere", tags=["chatbot"])
async def chatbot_endpoint(request: Request):
    if not COHERE_API_KEY:
        raise HTTPException(status_code=500, detail="Clé API Cohere manquante.")
    data = await request.json()
    message = data.get("message", "")
    if not message:
        raise HTTPException(status_code=400, detail="Message manquant.")
    try:
        co = cohere.Client(COHERE_API_KEY)
        response = co.chat(
            model="command-r-plus",
            message=message,
            temperature=0.7,
            max_tokens=256,
        )
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur IA: {str(e)}") 