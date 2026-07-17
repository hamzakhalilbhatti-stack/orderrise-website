$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "       STARTING ORDERRISE CLEAR COLORFUL 3D WEBSITE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Website:     http://localhost:8080/" -ForegroundColor Green
Write-Host "Diagnostics: http://localhost:8080/diagnostics.html" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the website." -ForegroundColor Gray
Start-Process powershell -ArgumentList '-NoProfile','-WindowStyle','Hidden','-Command',"Start-Sleep -Seconds 2; Start-Process 'http://localhost:8080/'"
python -m http.server 8080
