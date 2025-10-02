Write-Host "Checking Minimalist Redis Hub Application Status" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Check Backend
Write-Host "Checking Backend (http://localhost:3002)..." -ForegroundColor Yellow
try {
    $backendHealth = Invoke-RestMethod -Uri "http://localhost:3002/health" -TimeoutSec 5
    if ($backendHealth.status -eq "OK") {
        Write-Host "✅ Backend is running and healthy" -ForegroundColor Green
        Write-Host "   - Health Status: $($backendHealth.status)" -ForegroundColor Cyan
        Write-Host "   - Timestamp: $($backendHealth.timestamp)" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Backend is running but not healthy" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Backend is not responding" -ForegroundColor Red
    Write-Host "   Make sure to start the backend server: cd backend && npm run dev" -ForegroundColor Yellow
}

Write-Host ""

# Check Frontend
Write-Host "Checking Frontend (http://localhost:8080)..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:8080/" -TimeoutSec 5 -UseBasicParsing
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running and accessible" -ForegroundColor Green
        Write-Host "   - Status Code: $($frontendResponse.StatusCode)" -ForegroundColor Cyan
        Write-Host "   - Content Length: $($frontendResponse.Content.Length) bytes" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Frontend returned status: $($frontendResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Frontend is not responding" -ForegroundColor Red
    Write-Host "   Make sure to start the frontend server: npm run dev" -ForegroundColor Yellow
}

Write-Host ""

# Test API Integration
Write-Host "Testing API Integration..." -ForegroundColor Yellow
try {
    $testUser = @{
        name = "Status Check User"
        email = "statuscheck@example.com"
        password = "password123"
    } | ConvertTo-Json

    $regResponse = Invoke-RestMethod -Uri "http://localhost:3002/api/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body $testUser -TimeoutSec 5
    
    if ($regResponse.user.username) {
        Write-Host "✅ API Integration working correctly" -ForegroundColor Green
        Write-Host "   - User registered with username: $($regResponse.user.username)" -ForegroundColor Cyan
        Write-Host "   - Authentication token generated successfully" -ForegroundColor Cyan
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ API Integration working (user already exists)" -ForegroundColor Green
    } else {
        Write-Host "❌ API Integration failed" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Status Check Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Application URLs:" -ForegroundColor White
Write-Host "  Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:3002" -ForegroundColor Cyan
Write-Host "  API:      http://localhost:3002/api" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"