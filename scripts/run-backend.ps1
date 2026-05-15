Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$pythonExe = Join-Path $root ".venv\Scripts\python.exe"

if (-not (Test-Path $pythonExe)) {
  Write-Error "No existe .venv. Ejecuta primero: .\scripts\setup.ps1"
}

Push-Location $root
& $pythonExe -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
Pop-Location
