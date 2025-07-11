#!/usr/bin/env python3
"""
Script de test des imports sans base de données
"""

import sys
import os

def test_imports():
    """Test des imports de base"""
    print("🧪 Test des imports")
    print("=" * 30)
    
    try:
        # Test des imports de base
        print("📦 Test des imports de base...")
        import fastapi
        import uvicorn
        import sqlalchemy
        import pymysql
        import jose
        import passlib
        import dotenv
        import pydantic
        print("✅ Tous les imports de base réussis")
        
        # Test des imports locaux
        print("\n📁 Test des imports locaux...")
        from config import settings
        print("✅ Import config réussi")
        
        from models import User, Email, LoginHistory
        print("✅ Import models réussi")
        
        from schemas import UserCreate, EmailCreate
        print("✅ Import schemas réussi")
        
        from auth import get_password_hash, verify_password
        print("✅ Import auth réussi")
        
        from crud import create_user, get_user_by_email
        print("✅ Import crud réussi")
        
        print("\n🎉 Tous les imports sont réussis!")
        return True
        
    except ImportError as e:
        print(f"❌ Erreur d'import: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return False

def test_config():
    """Test de la configuration"""
    print("\n🔧 Test de la configuration")
    print("=" * 30)
    
    try:
        from config import settings
        
        print(f"📝 Nom de l'application: {settings.APP_NAME}")
        print(f"📝 Version: {settings.APP_VERSION}")
        print(f"📝 Hôte: {settings.HOST}")
        print(f"📝 Port: {settings.PORT}")
        print(f"📝 URL de base de données: {settings.DATABASE_URL}")
        
        print("✅ Configuration chargée avec succès")
        return True
        
    except Exception as e:
        print(f"❌ Erreur de configuration: {e}")
        return False

def test_schemas():
    """Test des schémas Pydantic"""
    print("\n📋 Test des schémas Pydantic")
    print("=" * 30)
    
    try:
        from schemas import UserCreate, EmailCreate, EmailUpdate
        
        # Test de création d'un utilisateur
        user_data = UserCreate(email="test@example.com", password="testpassword")
        print(f"✅ Utilisateur créé: {user_data.email}")
        
        # Test de création d'un email
        email_data = EmailCreate(subject="Test", body="Test body")
        print(f"✅ Email créé: {email_data.subject}")
        
        # Test de mise à jour d'un email
        email_update = EmailUpdate(subject="Updated subject")
        print(f"✅ Mise à jour d'email créée: {email_update.subject}")
        
        print("✅ Tous les schémas fonctionnent correctement")
        return True
        
    except Exception as e:
        print(f"❌ Erreur de schéma: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Démarrage des tests d'imports")
    
    tests = [
        test_imports(),
        test_config(),
        test_schemas()
    ]
    
    if all(tests):
        print("\n🎉 Tous les tests sont passés!")
        sys.exit(0)
    else:
        print("\n❌ Certains tests ont échoué")
        sys.exit(1) 