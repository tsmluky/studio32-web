$ErrorActionPreference = "Stop"

Write-Host "==> Studio32 root deploy fix" -ForegroundColor Cyan

if (-not (Test-Path ".\Agencia-Portfolio\index.html")) {
    throw "Missing .\Agencia-Portfolio\index.html"
}

if (-not (Test-Path ".\Agencia-Portfolio\styles.css")) {
    throw "Missing .\Agencia-Portfolio\styles.css"
}

if (-not (Test-Path ".\Agencia-Portfolio\script.js")) {
    throw "Missing .\Agencia-Portfolio\script.js"
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

New-Item -ItemType Directory -Force -Path ".\_backups" | Out-Null

Write-Host "==> Backup current root files" -ForegroundColor Cyan

if (Test-Path ".\index.html") {
    Copy-Item ".\index.html" ".\_backups\index.$timestamp.html" -Force
}

if (Test-Path ".\styles.css") {
    Copy-Item ".\styles.css" ".\_backups\styles.$timestamp.css" -Force
}

if (Test-Path ".\script.js") {
    Copy-Item ".\script.js" ".\_backups\script.$timestamp.js" -Force
}

Write-Host "==> Copy landing files from Agencia-Portfolio to root" -ForegroundColor Cyan

Copy-Item ".\Agencia-Portfolio\index.html" ".\index.html" -Force
Copy-Item ".\Agencia-Portfolio\styles.css" ".\styles.css" -Force
Copy-Item ".\Agencia-Portfolio\script.js" ".\script.js" -Force

Write-Host "==> Replace old public paths" -ForegroundColor Cyan

$files = @(".\index.html", ".\styles.css", ".\script.js")

foreach ($file in $files) {
    $content = Get-Content $file -Raw

    $content = $content -replace "https://studio-32\.netlify\.app/agencia-portfolio/?", "https://www.studio32.es/"
    $content = $content -replace "https://studio-32\.netlify\.app/Agencia-Portfolio/?", "https://www.studio32.es/"
    $content = $content -replace "https://www\.studio32\.es/agencia-portfolio/?", "https://www.studio32.es/"
    $content = $content -replace "https://www\.studio32\.es/Agencia-Portfolio/?", "https://www.studio32.es/"
    $content = $content -replace "/agencia-portfolio/", "/"
    $content = $content -replace "/Agencia-Portfolio/", "/"
    $content = $content -replace "agencia-portfolio/", ""
    $content = $content -replace "Agencia-Portfolio/", ""

    Set-Content -Path $file -Value $content -Encoding UTF8
}

Write-Host "==> Add canonical URL" -ForegroundColor Cyan

$index = Get-Content ".\index.html" -Raw

$index = $index -replace '<link\s+rel="canonical"[^>]*>\s*', ''
$index = $index -replace '<meta\s+property="og:url"[^>]*>\s*', ''

$seoBlock = @"
    <link rel="canonical" href="https://www.studio32.es/" />
    <meta property="og:url" content="https://www.studio32.es/" />
"@

$index = $index -replace "</head>", "$seoBlock`r`n</head>"

Set-Content -Path ".\index.html" -Value $index -Encoding UTF8

Write-Host "==> Create Netlify redirects" -ForegroundColor Cyan

$redirects = @"
/agencia-portfolio/ / 301
/Agencia-Portfolio/ / 301
/agencia-portfolio/* /:splat 301
/Agencia-Portfolio/* /:splat 301
"@

Set-Content -Path ".\_redirects" -Value $redirects -Encoding UTF8

Write-Host "==> Search remaining bad references" -ForegroundColor Cyan

Get-ChildItem -Recurse -File |
Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\.git\\" -and
    $_.FullName -notmatch "\\_backups\\" -and
    $_.FullName -notmatch "\\Agencia-Portfolio\\" -and
    $_.FullName -notmatch "\\docs\\" -and
    $_.Name -ne "studio32_FULL_RAW_CONTEXT_FOR_CLAUDE_CODE.txt" -and
    $_.Name -ne "file_inventory.json" -and
    $_.Name -ne "repo_tree.txt"
} |
Select-String -Pattern "studio-32\.netlify\.app|/agencia-portfolio|/Agencia-Portfolio" -ErrorAction SilentlyContinue |
Select-Object Path, LineNumber, Line

Write-Host ""
Write-Host "==> Git status" -ForegroundColor Cyan
git status

Write-Host ""
Write-Host "==> Done" -ForegroundColor Green
