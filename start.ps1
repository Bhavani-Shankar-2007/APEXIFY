# APEXIFY Full Stack Startup Script
# This script launches both the Frontend and Backend simultaneously.

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "         STARTING APEXIFY SYSTEM          " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Start the FastAPI Backend
Write-Host "[BACKEND] Starting FastAPI Server on port 8000..." -ForegroundColor Green
Start-Process powershell -WorkingDirectory "d:\SIH\APEXIFY\BACKEND" -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle='APEXIFY BACKEND'; uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# Wait a moment to ensure backend initializes first
Start-Sleep -Seconds 3

# 2. Start the Frontend
Write-Host "[FRONTEND] Starting Frontend Server on port 8080..." -ForegroundColor Yellow
Start-Process powershell -WorkingDirectory "d:\SIH\APEXIFY\FRONTEND" -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle='APEXIFY FRONTEND'; python main.py"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " All services started in separate windows." -ForegroundColor White
Write-Host " Backend: http://localhost:8000/docs      " -ForegroundColor White
Write-Host " Frontend: http://localhost:8080/         " -ForegroundColor White
Write-Host "==========================================" -ForegroundColor Cyan
