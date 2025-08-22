import requests
import json

def fix_email_generation():
    print("🔧 Fix de la génération d'email")
    print("=" * 40)
    
    # Configuration
    base_url = "http://localhost:8000"
    email = "th082919@gmail.com"
    password = input("🔑 Entrez votre mot de passe: ")
    
    print(f"\n📧 Email: {email}")
    print(f"🔐 Mot de passe: {'*' * len(password)}")
    
    # Étape 1: Connexion
    print("\n🔐 Étape 1: Connexion...")
    try:
        login_response = requests.post(f"{base_url}/api/login/", json={
            "email": email,
            "password": password
        })
        
        if login_response.status_code == 200:
            login_data = login_response.json()
            token = login_data.get('access_token')
            print(f"✅ Connexion réussie! Token: {token[:20]}...")
            
            # Étape 2: Test de génération
            print("\n📧 Étape 2: Test de génération d'email...")
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            }
            
            test_data = {
                "prompt": "Rédige un email professionnel de remerciement",
                "subject": "Test de génération",
                "type": "remerciement",
                "recipient": "test@example.com",
                "company": "Test Company"
            }
            
            gen_response = requests.post(
                f"{base_url}/api/generate-email/generate-email",
                json=test_data,
                headers=headers
            )
            
            print(f"📥 Status: {gen_response.status_code}")
            
            if gen_response.status_code == 200:
                result = gen_response.json()
                print("🎉 SUCCÈS! Email généré:")
                print(f"📧 {result.get('email', 'Non trouvé')}")
                print("\n✅ Le problème est résolu! Vérifiez maintenant le dashboard.")
            else:
                print(f"❌ Échec: {gen_response.text}")
                print("\n🔍 Vérifiez les logs du backend pour plus de détails.")
                
        else:
            print(f"❌ Échec de connexion: {login_response.status_code}")
            print(f"Réponse: {login_response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    fix_email_generation() 