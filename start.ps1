# PrimeLens AI - Start Script

# Check if port 8001 is in use
$port8001 = Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue
if ($port8001) {
    Write-Host "Port 8001 (Backend) is already in use. Please close the process using it." -ForegroundColor Red
}

# Check if port 3000 is in use
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "Port 3000 (Frontend) is already in use. Shifting to available port..." -ForegroundColor Yellow
}

Write-Host "--- Launching PrimeLens AI Full Stack ---" -ForegroundColor Magenta

# Start Backend
Write-Host "1. Starting FastAPI Vision Engine on http://localhost:8001..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; uvicorn index:app --reload --port 8001"

# Start Frontend
Write-Host "2. Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "`nAll services starting! Check the new windows for logs." -ForegroundColor Yellow
Write-Host "Local Dashboard: http://localhost:3000" -ForegroundColor White
