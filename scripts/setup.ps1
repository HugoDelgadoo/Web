Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$backendPath = Join-Path $root "backend"
$frontendPath = Join-Path $root "frontend"
$venvPath = Join-Path $root ".venv"
$pythonExe = Join-Path $venvPath "Scripts\python.exe"
$pipExe = Join-Path $venvPath "Scripts\pip.exe"

Write-Host "==> Preparando entorno del proyecto..."

if (-not (Test-Path $venvPath)) {
  Write-Host "==> Creando entorno virtual Python en .venv"
  python -m venv $venvPath
}

Write-Host "==> Instalando dependencias backend"
& $pythonExe -m pip install --upgrade pip
& $pipExe install -r (Join-Path $backendPath "requirements.txt")

Write-Host "==> Instalando dependencias frontend"
Push-Location $frontendPath
npm.cmd install
Pop-Location

$envExample = Join-Path $backendPath ".env.example"
$envFile = Join-Path $backendPath ".env"
if ((Test-Path $envExample) -and -not (Test-Path $envFile)) {
  Copy-Item $envExample $envFile
  Write-Host "==> Se ha creado backend/.env a partir de .env.example"
}

Write-Host ""
Write-Host "Listo. Siguiente paso:"
Write-Host "1) Editar backend/.env con credenciales reales de Supabase"
Write-Host "2) Ejecutar scripts/run-backend.ps1 y scripts/run-frontend.ps1"
