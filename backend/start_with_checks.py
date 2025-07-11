#!/usr/bin/env python3
"""
Script de démarrage avec vérifications préalables
"""

import sys
import os
import subprocess
import importlib.util
from pathlib import Path

def check_python_version():
    """Vérifier la version de Python"""
    print("🐍 Vérification de la version Python...")
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ requis. Version actuelle:", sys.version)
        return False
    print(f"✅ Python {sys.version.split()[0]} détecté")
    return True

def check_dependencies():
    """Vérifier les dépendances requises"""
    print("\n📦 Vérification des dépendances...")
    required_packages = [
        'fastapi',
        'uvicorn',
        'sqlalchemy',
        'pymysql',
        'python-jose',
        'passlib',
        'python-dotenv',
        'pydantic'
    ]
    
    missing_packages = []
    for package in required_packages:
        if importlib.util.find_spec(package) is None:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Dépendances manquantes: {', '.join(missing_packages)}")
        print("💡 Installez-les avec: pip install -r requirements.txt")
        return False
    
    print("✅ Toutes les dépendances sont installées")
    return True

def check_environment_file():
    """Vérifier le fichier d'environnement"""
    print("\n🔧 Vérification du fichier d'environnement...")
    env_file = Path(".env")
    env_example = Path("env_example.txt")
    
    if not env_file.exists():
        if env_example.exists():
            print("⚠️  Fichier .env non trouvé")
            print("💡 Copiez env_example.txt vers .env et configurez vos paramètres")
            return False
        else:
            print("⚠️  Aucun fichier d'environnement trouvé")
            return False
    
    print("✅ Fichier .env trouvé")
    return True

def check_database_connection():
    """Vérifier la connexion à la base de données"""
    print("\n🗄️  Vérification de la connexion à la base de données...")
    try:
        from database import SessionLocal
        db = SessionLocal()
        result = db.execute("SELECT 1")
        db.close()
        print("✅ Connexion à la base de données réussie")
        return True
    except Exception as e:
        print(f"❌ Erreur de connexion à la base de données: {e}")
        print("💡 Vérifiez votre configuration DATABASE_URL dans .env")
        return False

def run_tests():
    """Exécuter les tests de base"""
    print("\n🧪 Exécution des tests de base...")
    try:
        result = subprocess.run([sys.executable, "test_models.py"], 
                              capture_output=True, text=True, cwd=os.getcwd())
        if result.returncode == 0:
            print("✅ Tests de base réussis")
            return True
        else:
            print("❌ Tests de base échoués")
            print("Sortie d'erreur:", result.stderr)
            return False
    except Exception as e:
        print(f"❌ Erreur lors de l'exécution des tests: {e}")
        return False

def start_server():
    """Démarrer le serveur FastAPI"""
    print("\n🚀 Démarrage du serveur FastAPI...")
    try:
        import uvicorn
        from config import settings
        
        print(f"📍 Serveur accessible sur: http://{settings.HOST}:{settings.PORT}")
        print(f"📚 Documentation: http://{settings.HOST}:{settings.PORT}/docs")
        print(f"🔗 API: http://{settings.HOST}:{settings.PORT}")
        print("\n🔄 Appuyez sur Ctrl+C pour arrêter le serveur")
        
        uvicorn.run(
            "main:app",
            host=settings.HOST,
            port=settings.PORT,
            reload=True,
            log_level=settings.LOG_LEVEL
        )
    except KeyboardInterrupt:
        print("\n👋 Serveur arrêté")
    except Exception as e:
        print(f"❌ Erreur lors du démarrage du serveur: {e}")

def main():
    """Fonction principale"""
    print("🔍 Vérifications préalables au démarrage")
    print("=" * 50)
    
    checks = [
        check_python_version(),
        check_dependencies(),
        check_environment_file(),
        check_database_connection(),
        run_tests()
    ]
    
    if all(checks):
        print("\n🎉 Toutes les vérifications sont passées!")
        start_server()
    else:
        print("\n❌ Certaines vérifications ont échoué")
        print("💡 Corrigez les problèmes ci-dessus avant de redémarrer")
        sys.exit(1)

if __name__ == "__main__":
    main() 