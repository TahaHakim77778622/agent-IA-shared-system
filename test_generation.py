#!/usr/bin/env python3
"""
Script de test pour vérifier la génération d'emails
"""

import requests
import json

def test_email_generation():
    # URL de l'endpoint
    url = "http://localhost:8000/api/generate-email/generate-email"
    
    # Données de test
    test_data = {
        "prompt": "Rédige un email professionnel de remerciement",
        "subject": "Email de test",
        "type": "remerciement",
        "recipient": "test@example.com",
        "company": "Test Company"
    }
    
    # Test 1: Sans token (devrait retourner 401)
    print("🔍 Test 1: Sans token d'authentification")
    try:
        response = requests.post(url, json=test_data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Erreur: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 2: Avec un token invalide (devrait retourner 401)
    print("🔍 Test 2: Avec un token invalide")
    headers = {"Authorization": "Bearer invalid_token"}
    try:
        response = requests.post(url, json=test_data, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Erreur: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 3: Vérifier la documentation de l'endpoint
    print("🔍 Test 3: Vérifier la documentation")
    try:
        docs_url = "http://localhost:8000/docs"
        response = requests.get(docs_url)
        print(f"Documentation accessible: {response.status_code == 200}")
    except Exception as e:
        print(f"Erreur accès documentation: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 4: Vérifier les routes disponibles
    print("🔍 Test 4: Vérifier les routes disponibles")
    try:
        openapi_url = "http://localhost:8000/openapi.json"
        response = requests.get(openapi_url)
        if response.status_code == 200:
            openapi_data = response.json()
            paths = openapi_data.get('paths', {})
            print("Endpoints disponibles:")
            for path in paths.keys():
                if 'generate-email' in path:
                    print(f"  ✅ {path}")
                else:
                    print(f"  📍 {path}")
        else:
            print(f"Impossible d'accéder à l'API: {response.status_code}")
    except Exception as e:
        print(f"Erreur accès OpenAPI: {e}")

if __name__ == "__main__":
    print("🧪 Test de l'endpoint de génération d'email\n")
    test_email_generation() 