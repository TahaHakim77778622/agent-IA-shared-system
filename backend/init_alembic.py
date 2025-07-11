#!/usr/bin/env python3
"""
Script pour initialiser Alembic et créer la première migration
"""

import os
import subprocess
import sys

def run_command(command):
    """Exécuter une commande et afficher le résultat"""
    print(f"🔄 Exécution: {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    
    if result.stdout:
        print(f"✅ Sortie: {result.stdout}")
    
    if result.stderr:
        print(f"⚠️  Erreurs: {result.stderr}")
    
    if result.returncode != 0:
        print(f"❌ Erreur lors de l'exécution de: {command}")
        return False
    
    return True

def main():
    print("🚀 Initialisation d'Alembic pour les migrations de base de données")
    
    # Vérifier si Alembic est installé
    if not run_command("alembic --version"):
        print("❌ Alembic n'est pas installé. Installez-le avec: pip install alembic")
        return
    
    # Initialiser Alembic
    if not run_command("alembic init alembic"):
        print("❌ Erreur lors de l'initialisation d'Alembic")
        return
    
    print("✅ Alembic initialisé avec succès!")
    print("\n📝 Prochaines étapes:")
    print("1. Modifiez le fichier alembic.ini avec votre URL de base de données")
    print("2. Modifiez alembic/env.py pour importer vos modèles")
    print("3. Créez votre première migration: alembic revision --autogenerate -m 'Initial migration'")
    print("4. Appliquez la migration: alembic upgrade head")

if __name__ == "__main__":
    main() 