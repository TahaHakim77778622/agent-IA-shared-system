from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas import Template, TemplateCreate, TemplateUpdate
from crud import create_template, get_templates, get_template, update_template, delete_template

router = APIRouter()

@router.get("/", response_model=List[Template])
def list_templates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_templates(db, skip=skip, limit=limit)

@router.post("/", response_model=Template)
def create_new_template(template: TemplateCreate, db: Session = Depends(get_db)):
    return create_template(db, template)

@router.get("/{template_id}", response_model=Template)
def read_template(template_id: int, db: Session = Depends(get_db)):
    template = get_template(db, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template non trouvé")
    return template

@router.put("/{template_id}", response_model=Template)
def update_existing_template(template_id: int, template_update: TemplateUpdate, db: Session = Depends(get_db)):
    template = update_template(db, template_id, template_update)
    if not template:
        raise HTTPException(status_code=404, detail="Template non trouvé")
    return template

@router.delete("/{template_id}")
def delete_existing_template(template_id: int, db: Session = Depends(get_db)):
    success = delete_template(db, template_id)
    if not success:
        raise HTTPException(status_code=404, detail="Template non trouvé")
    return {"message": "Template supprimé avec succès"} 