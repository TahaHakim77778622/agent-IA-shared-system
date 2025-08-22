@echo off
echo Renommage du projet de ZABBA vers TAHA...
echo.

echo 1. Arret des serveurs en cours...
taskkill /f /im node.exe 2>nul
taskkill /f /im python.exe 2>nul

echo 2. Renommage du dossier...
cd ..
ren "zabba" "taha"

echo 3. Redemarrage dans le nouveau dossier...
cd "taha"

echo.
echo ✅ Projet renommé avec succès !
echo 📁 Nouveau nom du dossier : taha
echo.
echo 🚀 Pour redemarrer :
echo    - Frontend : npm run dev
echo    - Backend : python main.py
echo.
pause 