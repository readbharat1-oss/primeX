# PrimeLens AI Deployment Master Script (Ultra-Sync Edition)

Write-Host "--- Preparing PrimeLens AI for Production ---" -ForegroundColor Magenta

# 1. Verification
if (!(Test-Path "package.json")) {
    Write-Host "Error: Not in the root directory!" -ForegroundColor Red
    exit
}

# 2. Hard Cleanup
Write-Host "1. Deep cleaning build artifacts..." -ForegroundColor Cyan
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path .vercel -Recurse -Force -ErrorAction SilentlyContinue

# 3. Git Force Sync
Write-Host "2. Force-syncing latest code changes..." -ForegroundColor Green
git init -q
git add .
git commit -m "CRITICAL: Fix jsPDF instantiation on line 6" --allow-empty
git branch -M main

# 4. Deployment
Write-Host "3. Pushing to Vercel (Cloud Build)..." -ForegroundColor Yellow
Write-Host "----------------------------------------------------"
Write-Host "WATCH FOR THE NEW URL AT THE END" -ForegroundColor Cyan
Write-Host "----------------------------------------------------"

vercel deploy --prod --force --yes

Write-Host "`n--- Deployment Process Complete ---" -ForegroundColor Magenta
