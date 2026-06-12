param(
    [string]$ProjectRoot = 'E:\参考图\麻将\项目\01_游戏源码_可运行Demo\mahjong-v3',
    [string]$BackupRoot = 'E:\参考图\麻将\项目\99_可能可删除_过程归档\代码返修备份\mahjong-v3_UI返修前_20260612_1438'
)

$ErrorActionPreference = 'Stop'

function Add-Result {
    param(
        [string]$Check,
        [bool]$Passed,
        [string]$Detail
    )

    [PSCustomObject]@{
        Check  = $Check
        Passed = $Passed
        Detail = $Detail
    }
}

$results = @()

foreach ($file in @('ui.js', 'main.js', 'data.js', 'engine.js')) {
    $path = Join-Path $ProjectRoot $file
    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    $output = & node --check $path 2>&1
    $exitCode = $LASTEXITCODE
    $ErrorActionPreference = $previousErrorActionPreference
    $results += Add-Result "JavaScript syntax: $file" ($exitCode -eq 0) ($output -join "`n")
}

$style = Get-Content -Raw -Encoding UTF8 (Join-Path $ProjectRoot 'style.css')
$ui = Get-Content -Raw -Encoding UTF8 (Join-Path $ProjectRoot 'ui.js')
$main = Get-Content -Raw -Encoding UTF8 (Join-Path $ProjectRoot 'main.js')

$results += Add-Result 'Fixed 9:20 shell retained' (
    $style -match 'aspect-ratio:\s*9\s*/\s*20'
) 'style.css must retain a fixed 9:20 app shell.'

$results += Add-Result 'Daily label is ASCII' (
    $main -match "renderGameScreen\('DAILY'"
) 'main.js should render DAILY on one line.'

$results += Add-Result 'Daily Chinese label removed' (
    $main -notmatch "renderGameScreen\('每日挑战'"
) 'The Daily HUD must not render the Chinese label.'

$results += Add-Result 'Home no longer calls pause-only alias' (
    $main -notmatch 'btnHome\)\s*btnHome\.onclick\s*=\s*\(\)\s*=>\s*this\.pauseAndShowMenu'
) 'Home and Pause must not execute the same action.'

$results += Add-Result 'Five-column level grid removed' (
    $style -notmatch 'grid-template-columns:\s*repeat\(5'
) 'Level grid should use four columns.'

$results += Add-Result 'Reduced-motion support present' (
    $style -match 'prefers-reduced-motion'
) 'style.css should include reduced-motion behavior.'

$results += Add-Result 'Focus-visible support present' (
    $style -match ':focus-visible'
) 'Interactive controls need a visible keyboard focus state.'

$results += Add-Result 'Toast live region present' (
    $ui -match 'aria-live'
) 'Dynamic toast messages should announce state changes.'

$results += Add-Result 'Toggle state accessibility present' (
    $ui -match 'aria-pressed'
) 'Settings toggles need aria-pressed.'

Add-Type -AssemblyName System.Drawing
$dimensionMismatches = @()
$currentAssets = Get-ChildItem -Recurse -File (Join-Path $ProjectRoot 'assets') -Filter *.png
foreach ($current in $currentAssets) {
    $relative = $current.FullName.Substring($ProjectRoot.Length + 1)
    $backup = Join-Path $BackupRoot $relative
    if (-not (Test-Path -LiteralPath $backup)) {
        continue
    }

    $currentImage = [System.Drawing.Image]::FromFile($current.FullName)
    $backupImage = [System.Drawing.Image]::FromFile($backup)
    try {
        if ($currentImage.Width -ne $backupImage.Width -or $currentImage.Height -ne $backupImage.Height) {
            $dimensionMismatches += "$relative current=$($currentImage.Width)x$($currentImage.Height) backup=$($backupImage.Width)x$($backupImage.Height)"
        }
    }
    finally {
        $currentImage.Dispose()
        $backupImage.Dispose()
    }
}

$dimensionDetail = if ($dimensionMismatches.Count -eq 0) {
    'All checked PNG dimensions match the backup.'
}
else {
    $dimensionMismatches -join '; '
}

$results += Add-Result 'PNG dimensions preserved' (
    $dimensionMismatches.Count -eq 0
) $dimensionDetail

$failed = @($results | Where-Object { -not $_.Passed })
$results | Format-Table -AutoSize

Write-Host ''
Write-Host "Checks: $($results.Count); Passed: $($results.Count - $failed.Count); Failed: $($failed.Count)"

if ($failed.Count -gt 0) {
    exit 1
}
