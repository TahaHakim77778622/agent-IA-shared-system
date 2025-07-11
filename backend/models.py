from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from typing import Optional
from database import Base

class User(Base):
    __tablename__ = "User"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    last_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Relations
    emails: Mapped[list["Email"]] = relationship("Email", back_populates="user", cascade="all, delete-orphan")
    logins: Mapped[list["LoginHistory"]] = relationship("LoginHistory", back_populates="user", cascade="all, delete-orphan")

class Email(Base):
    __tablename__ = "Email"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    createdAt: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    userId: Mapped[int] = mapped_column(Integer, ForeignKey("User.id"), nullable=False)
    
    # Relations
    user: Mapped["User"] = relationship("User", back_populates="emails")

class LoginHistory(Base):
    __tablename__ = "LoginHistory"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    loginAt: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    userId: Mapped[int] = mapped_column(Integer, ForeignKey("User.id"), nullable=False)
    
    # Relations
    user: Mapped["User"] = relationship("User", back_populates="logins") 