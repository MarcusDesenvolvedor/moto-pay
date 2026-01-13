# Script para limpar todos os caches relacionados ao React Native e Expo

Write-Host "🧹 Limpando caches..." -ForegroundColor Yellow

# Parar processos
Write-Host "⏹️  Parando processos..." -ForegroundColor Cyan
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*expo*" -or $_.ProcessName -like "*metro*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Limpar caches do Metro
Write-Host "🗑️  Limpando cache do Metro..." -ForegroundColor Cyan
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $env:TEMP\metro-* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $env:TEMP\haste-* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $env:TEMP\react-* -ErrorAction SilentlyContinue

# Limpar cache do Expo
Write-Host "🗑️  Limpando cache do Expo..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo-shared -ErrorAction SilentlyContinue

# Limpar builds nativos
Write-Host "🗑️  Limpando builds nativos..." -ForegroundColor Cyan
Remove-Item -Recurse -Force android\app\build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android\.gradle -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ios\build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ios\Pods -ErrorAction SilentlyContinue

# Limpar cache do npm
Write-Host "🗑️  Limpando cache do npm..." -ForegroundColor Cyan
npm cache clean --force

Write-Host "✅ Limpeza concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Execute: npm install" -ForegroundColor White
Write-Host "   2. Execute: npx expo start --clear" -ForegroundColor White
Write-Host "   3. Se o erro persistir, recompile o app nativo:" -ForegroundColor White
Write-Host "      - Android: npx expo run:android" -ForegroundColor White
Write-Host "      - iOS: npx expo run:ios" -ForegroundColor White






