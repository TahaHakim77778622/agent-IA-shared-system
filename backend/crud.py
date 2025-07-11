from sqlalchemy.orm import Session
from models import User, Email, LoginHistory
from schemas import EmailCreate, EmailUpdate, UserCreate
from auth import get_password_hash
from datetime import datetime

# CRUD pour les utilisateurs
def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

# CRUD pour les emails
def create_email(db: Session, email: EmailCreate, user_id: int):
    db_email = Email(**email.dict(), userId=user_id)
    db.add(db_email)
    db.commit()
    db.refresh(db_email)
    return db_email

def get_emails(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Email).filter(Email.userId == user_id).offset(skip).limit(limit).all()

def get_email(db: Session, email_id: int, user_id: int):
    return db.query(Email).filter(Email.id == email_id, Email.userId == user_id).first()

def update_email(db: Session, email_id: int, user_id: int, email_update: EmailUpdate):
    db_email = get_email(db, email_id, user_id)
    if not db_email:
        return None
    
    update_data = email_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_email, field, value)
    
    db.commit()
    db.refresh(db_email)
    return db_email

def delete_email(db: Session, email_id: int, user_id: int):
    db_email = get_email(db, email_id, user_id)
    if not db_email:
        return False
    
    db.delete(db_email)
    db.commit()
    return True

# Enregistrement des connexions
def record_login(db: Session, user_id: int):
    login_record = LoginHistory(userId=user_id)
    db.add(login_record)
    db.commit()
    db.refresh(login_record)
    return login_record

def get_login_history(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(LoginHistory).filter(LoginHistory.userId == user_id).order_by(LoginHistory.loginAt.desc()).offset(skip).limit(limit).all() 