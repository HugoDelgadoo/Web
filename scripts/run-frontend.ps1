Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$frontendPath = Join-Path $root "frontend"

Push-Location $frontendPath
npm.cmd start
Pop-Location
