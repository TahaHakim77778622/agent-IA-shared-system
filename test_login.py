import requests
import json

# Test de l'endpoint de login
def test_login():
    url = "http://localhost:8000/api/login/"
    
    # Données de test avec email et password
    data = {
        "email": "th082919@gmail.com",
        "password": "votre_mot_de_passe"  # Remplacez par le vrai mot de passe
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print("🧪 Test de l'endpoint de login...")
        print(f"URL: {url}")
        print(f"Données: {json.dumps(data, indent=2)}")
        
        response = requests.post(url, json=data, headers=headers)
        
        print(f"\n📊 Réponse:")
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Login réussi!")
            response_data = response.json()
            print(f"Réponse complète: {json.dumps(response_data, indent=2)}")
            
            # Vérifier la structure de la réponse
            if "access_token" in response_data:
                print(f"✅ Token trouvé: {response_data['access_token'][:20]}...")
            else:
                print("❌ Pas de token dans la réponse")
                
        else:
            print("❌ Login échoué")
            print(f"Réponse: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur backend")
        print("Assurez-vous que le serveur backend est démarré sur le port 8000")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_login() 