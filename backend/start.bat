@echo off
echo 🚀 Démarrage du backend FastAPI...
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python n'est pas installé ou n'est pas dans le PATH
    pause
    exit /b 1
)

REM Vérifier si les dépendances sont installées
if not exist "requirements.txt" (
    echo ❌ Fichier requirements.txt non trouvé
    pause
    exit /b 1
)

REM Installer les dépendances si nécessaire
echo 📦 Installation des dépendances...
pip install -r requirements.txt

REM Démarrer le serveur
echo 🚀 Démarrage du serveur...
python run.py

pause 