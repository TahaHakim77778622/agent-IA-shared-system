#!/usr/bin/env python3
"""
Script de test pour vérifier que les modèles SQLAlchemy fonctionnent correctement
"""

import sys
import os
from datetime import datetime
from sqlalchemy import text

# Ajouter le répertoire courant au path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
from models import Base, User, Email, LoginHistory
from auth import get_password_hash

def test_models():
    """Test des modèles SQLAlchemy"""
    print("🧪 Test des modèles SQLAlchemy")
    print("=" * 50)
    
    # Créer les tables
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables créées avec succès")
    except Exception as e:
        print(f"❌ Erreur lors de la création des tables: {e}")
        return False
    
    # Créer une session de base de données
    db = SessionLocal()
    
    try:
        # Test 1: Créer un utilisateur
        print("\n📝 Test 1: Création d'un utilisateur")
        test_user = User(
            email="test@example.com",
            password=get_password_hash("testpassword")
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        print(f"✅ Utilisateur créé avec ID: {test_user.id}")
        print(f"   Email: {test_user.email}")
        print(f"   Type de l'ID: {type(test_user.id)}")
        
        # Test 2: Créer un email
        print("\n📧 Test 2: Création d'un email")
        test_email = Email(
            subject="Test Email",
            body="Ceci est un email de test",
            userId=test_user.id
        )
        db.add(test_email)
        db.commit()
        db.refresh(test_email)
        print(f"✅ Email créé avec ID: {test_email.id}")
        print(f"   Sujet: {test_email.subject}")
        print(f"   User ID: {test_email.userId}")
        
        # Test 3: Créer un historique de connexion
        print("\n🔐 Test 3: Création d'un historique de connexion")
        test_login = LoginHistory(
            userId=test_user.id
        )
        db.add(test_login)
        db.commit()
        db.refresh(test_login)
        print(f"✅ Historique créé avec ID: {test_login.id}")
        print(f"   User ID: {test_login.userId}")
        print(f"   Date de connexion: {test_login.loginAt}")
        
        # Test 4: Vérifier les relations
        print("\n🔗 Test 4: Vérification des relations")
        user_with_relations = db.query(User).filter(User.id == test_user.id).first()
        print(f"✅ Utilisateur récupéré: {user_with_relations.email}")
        print(f"   Nombre d'emails: {len(user_with_relations.emails)}")
        print(f"   Nombre de connexions: {len(user_with_relations.logins)}")
        
        # Test 5: Vérifier les types
        print("\n🔍 Test 5: Vérification des types")
        print(f"   user.id type: {type(user_with_relations.id)}")
        print(f"   user.id value: {user_with_relations.id}")
        print(f"   user.id is int: {isinstance(user_with_relations.id, int)}")
        
        # Nettoyer les données de test
        print("\n🧹 Nettoyage des données de test")
        db.delete(test_email)
        db.delete(test_login)
        db.delete(test_user)
        db.commit()
        print("✅ Données de test supprimées")
        
        print("\n🎉 Tous les tests sont passés avec succès!")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors des tests: {e}")
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        db.close()

def test_database_connection():
    """Test de la connexion à la base de données"""
    print("\n🔌 Test de la connexion à la base de données")
    print("=" * 50)
    
    try:
        # Tester la connexion
        db = SessionLocal()
        result = db.execute(text("SELECT 1"))
        print("✅ Connexion à la base de données réussie")
        db.close()
        return True
    except Exception as e:
        print(f"❌ Erreur de connexion à la base de données: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Démarrage des tests des modèles")
    
    # Test de la connexion
    if not test_database_connection():
        print("❌ Impossible de se connecter à la base de données")
        sys.exit(1)
    
    # Test des modèles
    if test_models():
        print("\n✅ Tous les tests sont passés!")
        sys.exit(0)
    else:
        print("\n❌ Certains tests ont échoué")
        sys.exit(1) 