from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Schémas pour User
class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

# Schémas pour Email
class EmailBase(BaseModel):
    subject: str
    body: str

class EmailCreate(EmailBase):
    pass

class EmailUpdate(BaseModel):
    subject: Optional[str] = None
    body: Optional[str] = None

class Email(EmailBase):
    id: int
    createdAt: datetime
    userId: int
    
    class Config:
        from_attributes = True

# Schémas pour LoginHistory
class LoginHistoryBase(BaseModel):
    pass

class LoginHistory(LoginHistoryBase):
    id: int
    loginAt: datetime
    userId: int
    
    class Config:
        from_attributes = True

# Schémas pour les réponses
class UserWithEmails(User):
    emails: List[Email] = []
    logins: List[LoginHistory] = []

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 