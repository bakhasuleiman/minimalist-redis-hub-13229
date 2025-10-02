Write-Host "Starting Minimalist Redis Hub - Full Stack Application" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""

# Check if ports are available
Write-Host "Checking port availability..." -ForegroundColor Yellow
$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue

if ($port3001) {
    Write-Host "Port 3001 is occupied. Attempting to free it..." -ForegroundColor Yellow
    $processId = (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Select-Object -First 1
    if ($processId) {
        try {
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            Write-Host "Port 3001 freed successfully" -ForegroundColor Green
        } catch {
            Write-Host "Could not free port 3001. Please manually stop the process using port 3001" -ForegroundColor Red
        }
    }
}

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd backend; `$env:PORT=3002; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 5

Write-Host "Starting Frontend Development Server..." -ForegroundColor Yellow  
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:3002" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:8081 (or next available port)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: If ports are occupied, the servers will automatically use the next available ports." -ForegroundColor Yellow
Write-Host "Check the terminal windows for the actual URLs." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")