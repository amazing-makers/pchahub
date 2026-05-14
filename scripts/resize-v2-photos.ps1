#requires -Version 5.1
<#
.SYNOPSIS
  V2 브랜드 사진을 1200px 최대 변·JPEG q80으로 in-place 리사이즈.

.DESCRIPTION
  apps/pchahub/public/brands/v* 폴더의 모든 .jpg/.jpeg/.png/.webp 파일을
  System.Drawing으로 처리: max 1200px 변 유지, JPEG quality 80, 원본을
  덮어쓴다. 로고는 작은 그대로 둔다 (크기 < 200KB는 스킵).

  실행 후 png 입력은 .jpg로 확장자 변경되며, v2-local-paths.json은 자동 업데이트.

.NOTES
  - 단일 스레드 (System.Drawing은 GDI+로 멀티스레드 안전 안 함).
  - 처리량: 약 100~150장/분.
#>

[CmdletBinding()]
param(
  [string]$Root = "D:\Users\help\Projects\Franchise\apps\pchahub\public\brands",
  [string]$LocalPathsJson = "D:\Users\help\Projects\Franchise\apps\pchahub\lib\v2-local-paths.json",
  [int]$MaxEdge = 1200,
  [int]$Quality = 80,
  [int]$SkipUnderBytes = 200KB
)

Add-Type -AssemblyName System.Drawing

$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1

$qualityParam = New-Object System.Drawing.Imaging.EncoderParameters(1)
$qualityParam.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [long]$Quality
)

function Resize-Image {
  param([string]$Src, [string]$Dst, [int]$MaxEdge)

  $img = $null
  $resized = $null
  $g = $null
  try {
    $img = [System.Drawing.Image]::FromFile($Src)
    $w = $img.Width
    $h = $img.Height
    $maxDim = [Math]::Max($w, $h)
    if ($maxDim -le $MaxEdge) {
      # 큰 변이 이미 작으면 재인코딩만 (jpg 변환 위해)
      $newW = $w; $newH = $h
    } else {
      $scale = $MaxEdge / $maxDim
      $newW = [int]([Math]::Round($w * $scale))
      $newH = [int]([Math]::Round($h * $scale))
    }

    $resized = New-Object System.Drawing.Bitmap $newW, $newH, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($resized)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::White)
    $g.DrawImage($img, 0, 0, $newW, $newH)

    $resized.Save($Dst, $jpegEncoder, $qualityParam)
    return [pscustomobject]@{ ok = $true; newW = $newW; newH = $newH }
  } catch {
    return [pscustomobject]@{ ok = $false; error = $_.Exception.Message }
  } finally {
    if ($g) { $g.Dispose() }
    if ($resized) { $resized.Dispose() }
    if ($img) { $img.Dispose() }
  }
}

# v2-local-paths.json 로드
$paths = $null
if (Test-Path $LocalPathsJson) {
  $paths = Get-Content -Raw -Encoding UTF8 $LocalPathsJson | ConvertFrom-Json
}

$folders = Get-ChildItem -Path $Root -Directory -Filter 'v*' | Sort-Object Name
$totalProcessed = 0
$totalSkipped = 0
$totalFailed = 0
$totalSavedBytes = 0L
$sw = [System.Diagnostics.Stopwatch]::StartNew()

foreach ($folder in $folders) {
  $files = Get-ChildItem -Path $folder.FullName -File | Where-Object {
    $_.Extension -match '\.(jpe?g|png|webp)$'
  }
  foreach ($f in $files) {
    $oldSize = $f.Length
    if ($oldSize -lt $SkipUnderBytes -and $f.Extension -match '\.jpe?g$') {
      $totalSkipped++
      continue
    }

    # 새 경로: 항상 .jpg로 통일
    $newPath = [System.IO.Path]::ChangeExtension($f.FullName, '.jpg')
    $tmpPath = "$newPath.tmp"

    $result = Resize-Image -Src $f.FullName -Dst $tmpPath -MaxEdge $MaxEdge
    if (-not $result.ok) {
      Write-Warning "[$($folder.Name)/$($f.Name)] resize failed: $($result.error)"
      if (Test-Path $tmpPath) { Remove-Item $tmpPath -Force -ErrorAction SilentlyContinue }
      $totalFailed++
      continue
    }

    # 원본 삭제 후 tmp → 최종 이름
    if ($f.FullName -ne $newPath) {
      Remove-Item $f.FullName -Force
    }
    if (Test-Path $newPath) { Remove-Item $newPath -Force }
    Move-Item -Path $tmpPath -Destination $newPath -Force

    $newSize = (Get-Item $newPath).Length
    $totalSavedBytes += ($oldSize - $newSize)
    $totalProcessed++

    if ($totalProcessed % 50 -eq 0) {
      $mbSaved = [Math]::Round($totalSavedBytes / 1MB, 1)
      Write-Host "  [$totalProcessed] saved ${mbSaved}MB so far (elapsed: $([Math]::Round($sw.Elapsed.TotalSeconds))s)"
    }
  }
}

$sw.Stop()
$mbSaved = [Math]::Round($totalSavedBytes / 1MB, 1)
Write-Host ""
Write-Host "===== DONE ====="
Write-Host "Processed: $totalProcessed | Skipped: $totalSkipped | Failed: $totalFailed"
Write-Host "Saved: ${mbSaved}MB"
Write-Host "Elapsed: $([Math]::Round($sw.Elapsed.TotalSeconds))s"

# v2-local-paths.json 갱신: 모든 path를 .jpg로 변경
if ($paths) {
  Write-Host ""
  Write-Host "Updating v2-local-paths.json (.png/.webp -> .jpg)..."
  $updated = @{}
  foreach ($key in $paths.PSObject.Properties.Name) {
    $entry = $paths.$key
    $newEntry = @{}
    if ($entry.logo) {
      $newEntry.logo = [System.IO.Path]::ChangeExtension($entry.logo, '.jpg')
    }
    if ($entry.heroImage) {
      $newEntry.heroImage = [System.IO.Path]::ChangeExtension($entry.heroImage, '.jpg')
    }
    if ($entry.storeImages) {
      $newEntry.storeImages = @($entry.storeImages | ForEach-Object { [System.IO.Path]::ChangeExtension($_, '.jpg') })
    }
    $updated[$key] = $newEntry
  }
  $updated | ConvertTo-Json -Depth 5 | Set-Content -Path $LocalPathsJson -Encoding UTF8
  Write-Host "v2-local-paths.json updated."
}
