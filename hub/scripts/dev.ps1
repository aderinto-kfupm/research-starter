# Local dev server: downloads PocketBase once, loads ../.env, serves pb_public on :8090.
# Usage (from anywhere): powershell -File hub/scripts/dev.ps1
$ErrorActionPreference = 'Stop'
$hub = Split-Path $PSScriptRoot -Parent
$ver = '0.40.6'   # keep in sync with Dockerfile PB_VERSION
$bin = Join-Path $hub '.pb\pocketbase.exe'

if (-not (Test-Path $bin)) {
  New-Item -ItemType Directory -Force (Split-Path $bin) | Out-Null
  $zip = Join-Path $env:TEMP "pb_$ver.zip"
  Invoke-WebRequest "https://github.com/pocketbase/pocketbase/releases/download/v$ver/pocketbase_${ver}_windows_amd64.zip" -OutFile $zip
  Expand-Archive $zip (Split-Path $bin) -Force
  Remove-Item $zip
}

$envFile = Join-Path $hub '.env'
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([A-Z_]+)=(.*?)\s*(#.*)?$') { Set-Item "env:$($Matches[1])" $Matches[2] }
  }
} else { Write-Warning ".env missing (copy .env.example); sign-in emails won't send." }

Write-Host "Hub: http://localhost:8090   Admin: http://localhost:8090/_/"
& $bin serve --http=127.0.0.1:8090 --dir (Join-Path $hub '.pb\pb_data') --publicDir (Join-Path $hub 'pb_public') --migrationsDir (Join-Path $hub 'pb_migrations') --hooksDir (Join-Path $hub 'pb_hooks')
