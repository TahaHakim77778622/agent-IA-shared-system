#!/usr/bin/env python3
"""
Script de test pour vérifier que l'API fonctionne correctement
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:8000"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "testpassword123"

def test_health_check():
    """Test de la route racine"""
    print("🔍 Test de la route racine...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Route racine fonctionne")
            return True
        else:
            print(f"❌ Erreur: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return False

def test_register():
    """Test d'enregistrement d'utilisateur"""
    print("🔍 Test d'enregistrement...")
    try:
        data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        response = requests.post(f"{BASE_URL}/register", json=data)
        if response.status_code == 200:
            print("✅ Enregistrement réussi")
            return True
        elif response.status_code == 400:
            print("⚠️  Utilisateur déjà existant")
            return True
        else:
            print(f"❌ Erreur: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_login():
    """Test de connexion"""
    print("🔍 Test de connexion...")
    try:
        data = {
            "username": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        response = requests.post(f"{BASE_URL}/login", data=data)
        if response.status_code == 200:
            token_data = response.json()
            print("✅ Connexion réussie")
            return token_data["access_token"]
        else:
            print(f"❌ Erreur: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

def test_create_email(token):
    """Test de création d'email"""
    print("🔍 Test de création d'email...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        data = {
            "subject": "Test Email",
            "body": "Ceci est un email de test"
        }
        response = requests.post(f"{BASE_URL}/emails", json=data, headers=headers)
        if response.status_code == 200:
            email_data = response.json()
            print("✅ Email créé avec succès")
            return email_data["id"]
        else:
            print(f"❌ Erreur: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

def test_get_emails(token):
    """Test de récupération des emails"""
    print("🔍 Test de récupération des emails...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/users/me/emails", headers=headers)
        if response.status_code == 200:
            emails = response.json()
            print(f"✅ {len(emails)} emails récupérés")
            return True
        else:
            print(f"❌ Erreur: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_login_history(token):
    """Test de récupération de l'historique des connexions"""
    print("🔍 Test de l'historique des connexions...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/users/me/login-history", headers=headers)
        if response.status_code == 200:
            history = response.json()
            print(f"✅ {len(history)} connexions dans l'historique")
            return True
        else:
            print(f"❌ Erreur: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    print("🚀 Démarrage des tests de l'API")
    print("=" * 50)
    
    # Test de santé
    if not test_health_check():
        print("❌ Le serveur n'est pas accessible")
        return
    
    # Test d'enregistrement
    if not test_register():
        print("❌ Échec de l'enregistrement")
        return
    
    # Test de connexion
    token = test_login()
    if not token:
        print("❌ Échec de la connexion")
        return
    
    # Test de création d'email
    email_id = test_create_email(token)
    if not email_id:
        print("❌ Échec de la création d'email")
        return
    
    # Test de récupération des emails
    if not test_get_emails(token):
        print("❌ Échec de la récupération des emails")
        return
    
    # Test de l'historique des connexions
    if not test_login_history(token):
        print("❌ Échec de la récupération de l'historique")
        return
    
    print("=" * 50)
    print("🎉 Tous les tests sont passés avec succès!")
    print("✅ L'API fonctionne correctement")

if __name__ == "__main__":
    main() 