import requests
import json

def test_email_generation_with_auth():
    base_url = "http://localhost:8000"
    
    # Étape 1: Se connecter pour obtenir un token
    print("🔐 Étape 1: Connexion pour obtenir un token")
    login_data = {
        "email": "th082919@gmail.com",
        "password": "votre_mot_de_passe"  # Remplacez par votre vrai mot de passe
    }
    
    try:
        login_response = requests.post(f"{base_url}/api/login/", json=login_data)
        print(f"Status de connexion: {login_response.status_code}")
        
        if login_response.status_code == 200:
            login_result = login_response.json()
            token = login_result.get('access_token')
            if token:
                print(f"✅ Token obtenu: {token[:20]}...")
                
                # Étape 2: Tester la génération d'email avec le token
                print("\n📧 Étape 2: Test de génération d'email avec authentification")
                
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {token}"
                }
                
                test_data = {
                    "prompt": "Rédige un email professionnel de remerciement pour une réunion",
                    "subject": "Remerciements pour la réunion",
                    "type": "remerciement",
                    "recipient": "client@example.com",
                    "company": "Test Company"
                }
                
                generation_response = requests.post(
                    f"{base_url}/api/generate-email/generate-email",
                    json=test_data,
                    headers=headers
                )
                
                print(f"Status de génération: {generation_response.status_code}")
                print(f"Réponse: {generation_response.text}")
                
                if generation_response.status_code == 200:
                    result = generation_response.json()
                    print("\n🎉 SUCCÈS! Email généré:")
                    print(f"📧 Contenu: {result.get('email', 'Non trouvé')}")
                else:
                    print(f"\n❌ Échec de la génération: {generation_response.text}")
                    
            else:
                print("❌ Pas de token dans la réponse de connexion")
                print(f"Réponse complète: {login_result}")
        else:
            print(f"❌ Échec de la connexion: {login_response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("🧪 Test de génération d'email avec authentification\n")
    print("⚠️  IMPORTANT: Remplacez 'votre_mot_de_passe' par votre vrai mot de passe dans le script!")
    print("=" * 60)
    test_email_generation_with_auth() 