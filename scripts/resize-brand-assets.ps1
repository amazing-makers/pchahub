#requires -Version 5.1
<#
.SYNOPSIS
  마이프차에서 받은 브랜드 사진 (apps/themyungdang/public/brand-assets/v*/{menu|interior}/*.jpg|png|webp)을
  1200px 최대 변·JPEG q80으로 in-place 리사이즈. V2 사진에 썼던 패턴 그대로.

.DESCRIPTION
  System.Drawing(GDI+)으로 단일 스레드 처리. 1평균 100~150장/분.
  webp 입력은 GDI+가 지원 안 함 — 실패하면 skip (해당 파일 그대로 둠).
  200KB 미만 작은 파일은 스킵 (이미 사이즈 OK).
#>

[CmdletBinding()]
param(
  [string]$Root = "D:\Users\help\Projects\Franchise\apps\themyungdang\public\brand-assets",
  [string]$ExtrasJson = "D:\Users\help\Projects\Franchise\packages\listings\data\myfranchise-extras.json",
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

$folders = Get-ChildItem -Path $Root -Directory -Filter 'v*' | Sort-Object Name
$totalProcessed = 0; $totalSkipped = 0; $totalFailed = 0; $totalSavedBytes = 0L
$sw = [System.Diagnostics.Stopwatch]::StartNew()

foreach ($brandFolder in $folders) {
  $catFolders = Get-ChildItem -Path $brandFolder.FullName -Directory
  foreach ($catFolder in $catFolders) {
    $files = Get-ChildItem -Path $catFolder.FullName -File | Where-Object {
      $_.Extension -match '\.(jpe?g|png|webp)$'
    }
    foreach ($f in $files) {
      $oldSize = $f.Length
      if ($oldSize -lt $SkipUnderBytes -and $f.Extension -match '\.jpe?g$') {
        $totalSkipped++
        continue
      }
      $newPath = [System.IO.Path]::ChangeExtension($f.FullName, '.jpg')
      $tmpPath = "$newPath.tmp"
      $img = $null; $bmp = $null; $g = $null
      try {
        $img = [System.Drawing.Image]::FromFile($f.FullName)
        $w = $img.Width; $h = $img.Height
        $maxDim = [Math]::Max($w, $h)
        if ($maxDim -le $MaxEdge) { $newW = $w; $newH = $h }
        else {
          $scale = $MaxEdge / $maxDim
          $newW = [int]([Math]::Round($w * $scale))
          $newH = [int]([Math]::Round($h * $scale))
        }
        $bmp = New-Object System.Drawing.Bitmap $newW, $newH, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.Clear([System.Drawing.Color]::White)
        $g.DrawImage($img, 0, 0, $newW, $newH)
        $bmp.Save($tmpPath, $jpegEncoder, $qualityParam)
      } catch {
        Write-Warning "[$($brandFolder.Name)/$($catFolder.Name)/$($f.Name)] $_"
        if (Test-Path $tmpPath) { Remove-Item $tmpPath -Force -ErrorAction SilentlyContinue }
        $totalFailed++
        if ($g) { $g.Dispose() }; if ($bmp) { $bmp.Dispose() }; if ($img) { $img.Dispose() }
        continue
      }
      if ($g) { $g.Dispose() }; if ($bmp) { $bmp.Dispose() }; if ($img) { $img.Dispose() }
      if ($f.FullName -ne $newPath) { Remove-Item $f.FullName -Force }
      if (Test-Path $newPath) { Remove-Item $newPath -Force }
      Move-Item -Path $tmpPath -Destination $newPath -Force
      $newSize = (Get-Item $newPath).Length
      $totalSavedBytes += ($oldSize - $newSize)
      $totalProcessed++
      if ($totalProcessed % 100 -eq 0) {
        $mbSaved = [Math]::Round($totalSavedBytes / 1MB, 1)
        Write-Host "  [$totalProcessed] saved ${mbSaved}MB (elapsed: $([Math]::Round($sw.Elapsed.TotalSeconds))s)"
      }
    }
  }
}

$sw.Stop()
$mbSaved = [Math]::Round($totalSavedBytes / 1MB, 1)
Write-Host ""
Write-Host "===== DONE ====="
Write-Host "Processed: $totalProcessed | Skipped: $totalSkipped | Failed: $totalFailed"
Write-Host "Saved: ${mbSaved}MB | Elapsed: $([Math]::Round($sw.Elapsed.TotalSeconds))s"

# myfranchise-extras.json의 photos·menuItems의 .png/.webp 경로를 .jpg로 갱신
if (Test-Path $ExtrasJson) {
  Write-Host ""
  Write-Host "Updating myfranchise-extras.json paths..."
  $j = Get-Content -Raw -Encoding UTF8 $ExtrasJson | ConvertFrom-Json
  foreach ($b in $j.brands) {
    if ($b.photos) {
      foreach ($cat in @('menu','interior','store','other')) {
        if ($b.photos.$cat) {
          $b.photos.$cat = @($b.photos.$cat | ForEach-Object { [System.IO.Path]::ChangeExtension($_, '.jpg') })
        }
      }
    }
    if ($b.menuItems) {
      foreach ($mi in $b.menuItems) {
        if ($mi.image) {
          $mi.image = [System.IO.Path]::ChangeExtension($mi.image, '.jpg')
        }
      }
    }
  }
  $j | ConvertTo-Json -Depth 8 | Set-Content -Path $ExtrasJson -Encoding UTF8
  Write-Host "Done."
}
