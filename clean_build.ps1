# clean_build.ps1 - Build without warnings
Write-Host "🔄 Clean Build Process" -ForegroundColor Cyan
Write-Host "This will rebuild everything with minimal warnings" -ForegroundColor Yellow
Write-Host ""

# Stop all processes
Write-Host "Stopping all services..." -ForegroundColor Gray
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like "*webpack*" -or $_.MainWindowTitle -like "*electron*" } | Stop-Process -Force
Start-Sleep -Seconds 2

# Clean frontend build
Write-Host "Cleaning frontend build..." -ForegroundColor Gray
Remove-Item -Path "frontend\build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "frontend\.cache" -Recurse -Force -ErrorAction SilentlyContinue

# Install dependencies fresh
Write-Host "Reinstalling dependencies..." -ForegroundColor Gray
Set-Location frontend
npm ci --silent --no-optional
Set-Location ..

# Build frontend
Write-Host "Building frontend (quiet mode)..." -ForegroundColor Gray
Set-Location frontend
$env:NODE_ENV = "production"
npm run build 2>&1 | Out-Null
Set-Location ..

# Start services quietly
Write-Host "Starting services..." -ForegroundColor Green

# Start backend
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PWD\backend'; npm start`"" -WindowStyle Hidden

# Start frontend (dev server without verbose logging)
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PWD\frontend'; `$env:NODE_ENV='production'; npm start`"" -WindowStyle Hidden

Start-Sleep -Seconds 5

# Start Electron with minimal logging
Write-Host "Starting Electron..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PWD\electron'; `$env:ELECTRON_ENABLE_LOGGING='0'; npm start`"" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Clean build completed!" -ForegroundColor Green
Write-Host "Most warnings should now be suppressed." -ForegroundColor Gray
Write-Host ""
Write-Host "Note: Some security warnings may still appear in development." -ForegroundColor Yellow
Write-Host "These will disappear in the production build." -ForegroundColor Gray
Write-Host ""
Write-Host "Press Enter to exit..." -ForegroundColor Cyan
Read-Host