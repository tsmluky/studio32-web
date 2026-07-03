$ErrorActionPreference = "Stop"

Write-Host "==> Fixing Studio32 mojibake encoding..." -ForegroundColor Cyan

$files = @(
    ".\index.html",
    ".\styles.css",
    ".\script.js"
)

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

New-Item -ItemType Directory -Force -Path ".\_backups" | Out-Null

$win1252 = [System.Text.Encoding]::GetEncoding(1252)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        Write-Host "SKIP: $file not found" -ForegroundColor Yellow
        continue
    }

    Write-Host "==> Processing $file" -ForegroundColor Cyan

    Copy-Item $file ".\_backups\$($file.Replace('.\','')).before-mojibake-fix.$timestamp" -Force

    $text = [System.IO.File]::ReadAllText((Resolve-Path $file), [System.Text.Encoding]::UTF8)

    # Repair typical UTF-8 mojibake: "automatizaci??n" -> "automatizaci?n"
    $bytes = $win1252.GetBytes($text)
    $fixed = [System.Text.Encoding]::UTF8.GetString($bytes)

    [System.IO.File]::WriteAllText((Resolve-Path $file), $fixed, $utf8NoBom)
}

Write-Host ""
Write-Host "==> Checking first lines of index.html..." -ForegroundColor Cyan
Get-Content .\index.html -TotalCount 25

Write-Host ""
Write-Host "==> Searching remaining broken sequences..." -ForegroundColor Cyan

Get-ChildItem -File index.html, styles.css, script.js |
Select-String -Pattern "?|?|??" -ErrorAction SilentlyContinue |
Select-Object Path, LineNumber, Line

Write-Host ""
Write-Host "==> Done." -ForegroundColor Green
