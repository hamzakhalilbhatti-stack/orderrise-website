@echo off
cd /d "%~dp0"
echo ============================================================
echo        STARTING ORDERRISE CLEAR COLORFUL 3D WEBSITE
echo ============================================================
echo.
echo Website:    http://localhost:8080/
echo Diagnostics: http://localhost:8080/diagnostics.html
echo.
echo Keep this window open. Press Ctrl+C to stop the website.
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:8080/'"
python -m http.server 8080
pause
