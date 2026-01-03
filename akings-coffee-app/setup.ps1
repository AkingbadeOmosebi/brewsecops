# BrewSecOps - Simple Setup Script
# This starts everything with Docker Compose

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "           BrewSecOps - Aking's Coffee                      " -ForegroundColor Cyan
Write-Host "        Brew Beautifully, Deploy Securely                   " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Docker
$dockerRunning = docker ps 2>$null
if (!$dockerRunning) {
    Write-Host "[ERROR] Docker is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "  1. Start Docker Desktop" -ForegroundColor White
    Write-Host "  2. Wait until the icon stops animating (~1-2 minutes)" -ForegroundColor White
    Write-Host "  3. Run this script again" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "[OK] Docker is running" -ForegroundColor Green
Write-Host ""

Write-Host "Starting services with Docker Compose..." -ForegroundColor Yellow
Write-Host "(This will take 2-3 minutes on first run)" -ForegroundColor Gray
Write-Host ""

docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Failed to start services" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Make sure ports 5173, 3001, 5432 are not in use" -ForegroundColor White
    Write-Host "  2. Check Docker Desktop has enough resources (Settings > Resources)" -ForegroundColor White
    Write-Host "  3. Try: docker-compose down -v && docker-compose up -d" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Write-Host ""

Start-Sleep -Seconds 15

# Check backend health
$maxRetries = 30
$retries = 0
$healthy = $false

while ($retries -lt $maxRetries -and !$healthy) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -TimeoutSec 2 2>$null
        if ($response.StatusCode -eq 200) {
            $healthy = $true
        }
    } catch {
        $retries++
        if ($retries % 5 -eq 0) {
            Write-Host "  Still waiting... ($retries/$maxRetries)" -ForegroundColor Gray
        }
        Start-Sleep -Seconds 2
    }
}

Write-Host ""

if ($healthy) {
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "                   Setup Complete!                          " -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "All services are running:" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Frontend:   http://localhost:5173" -ForegroundColor White
    Write-Host "  Backend:    http://localhost:3001" -ForegroundColor White
    Write-Host "  Database:   localhost:5432" -ForegroundColor White
    Write-Host ""
    Write-Host "  Health:     http://localhost:3001/api/health" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Useful commands:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  View logs:       docker-compose logs -f" -ForegroundColor White
    Write-Host "  View status:     docker-compose ps" -ForegroundColor White
    Write-Host "  Stop services:   docker-compose down" -ForegroundColor White
    Write-Host "  Fresh restart:   docker-compose down -v && docker-compose up -d" -ForegroundColor White
    Write-Host ""
    Write-Host "Test the API:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  curl http://localhost:3001/api/products" -ForegroundColor White
    Write-Host "  curl http://localhost:3001/api/orders" -ForegroundColor White
    Write-Host ""
    Write-Host "Happy coding!" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "[WARNING] Services started but backend health check failed" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Check logs:" -ForegroundColor White
    Write-Host "  docker-compose logs backend" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Services may still be starting. Wait 30 seconds and check:" -ForegroundColor White
    Write-Host "  http://localhost:3001/api/health" -ForegroundColor Gray
    Write-Host ""
}
