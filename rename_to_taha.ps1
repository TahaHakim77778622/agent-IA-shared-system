Write-Host "🔄 Renommage du projet de ZABBA vers TAHA..." -ForegroundColor Yellow
Write-Host ""

# Étape 1: Arrêter les serveurs en cours
Write-Host "1. Arrêt des serveurs en cours..." -ForegroundColor Blue
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force

# Étape 2: Renommer le dossier
Write-Host "2. Renommage du dossier..." -ForegroundColor Blue
$currentPath = Get-Location
$parentPath = Split-Path $currentPath -Parent
$newPath = Join-Path $parentPath "taha"

if (Test-Path $newPath) {
    Write-Host "❌ Le dossier 'taha' existe déjà. Suppression..." -ForegroundColor Red
    Remove-Item $newPath -Recurse -Force
}

Rename-Item $currentPath "taha"

# Étape 3: Aller dans le nouveau dossier
Write-Host "3. Navigation vers le nouveau dossier..." -ForegroundColor Blue
Set-Location $newPath

Write-Host ""
Write-Host "✅ Projet renommé avec succès !" -ForegroundColor Green
Write-Host "📁 Nouveau nom du dossier : taha" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Pour redémarrer :" -ForegroundColor Cyan
Write-Host "   - Frontend : npm run dev" -ForegroundColor White
Write-Host "   - Backend : python main.py" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 