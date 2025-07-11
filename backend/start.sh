#!/bin/bash

echo "🚀 Démarrage du backend FastAPI..."
echo

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 n'est pas installé"
    exit 1
fi

# Vérifier si le fichier requirements.txt existe
if [ ! -f "requirements.txt" ]; then
    echo "❌ Fichier requirements.txt non trouvé"
    exit 1
fi

# Installer les dépendances si nécessaire
echo "📦 Installation des dépendances..."
pip3 install -r requirements.txt

# Démarrer le serveur
echo "🚀 Démarrage du serveur..."
python3 run.py 