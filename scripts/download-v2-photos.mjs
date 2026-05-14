/**
 * download-v2-photos.mjs
 *
 * v2-brands.json의 253개 브랜드 로고+사진을 로컬에 다운로드합니다.
 * Outputs: apps/pchahub/public/brands/v{id}/ 및 apps/pchahub/lib/v2-local-paths.json
 *
 * Run:
 *   .tools/node-v22.12.0-win-x64/node.exe scripts/download-v2-photos.mjs
 */

import { mkdir, writeFile, access } from 'fs/promises'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC_DIR = join(ROOT, 'apps', 'pchahub', 'public', 'brands')
const V2_JSON = join(ROOT, 'apps', 'pchahub', 'lib', 'v2-brands.json')
const OUT_JSON = join(ROOT, 'apps', 'pchahub', 'lib', 'v2-local-paths.json')

const require = createRequire(import.meta.url)

const CONCURRENCY = 8

function guessExt(url, fallback = 'jpg') {
  try {
    const pathname = new URL(url).pathname
    const ext = extname(pathname).replace('.', '').split('?')[0].toLowerCase()
    return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)
      ? (ext === 'jpeg' ? 'jpg' : ext)
      : fallback
  } catch {
    return fallback
  }
}

async function exists(path) {
  try { await access(path); return true } catch { return false }
}

async function downloadFile(url, dest, label) {
  if (await exists(dest)) {
    return { ok: true, skipped: true }
  }
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://myfranchise.kr/',
        Origin: 'https://myfranchise.kr',
      },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = await res.arrayBuffer()
    await writeFile(dest, Buffer.from(buf))
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

async function processBrand(b, i) {
  const id = `v${1000 + i}`
  const dir = join(PUBLIC_DIR, id)
  await mkdir(dir, { recursive: true })

  const paths = { storeImages: [] }
  let downloaded = 0, skipped = 0, failed = 0

  // Logo
  const logoUrl = b.logo || b.thumbnail
  if (logoUrl) {
    const ext = guessExt(logoUrl)
    const dest = join(dir, `logo.${ext}`)
    const r = await downloadFile(logoUrl, dest, `${id}/logo`)
    if (r.ok) {
      paths.logo = `/brands/${id}/logo.${ext}`
      r.skipped ? skipped++ : downloaded++
    } else {
      failed++
    }
  }

  // Store photos (up to 3)
  for (let j = 0; j < Math.min(b.photos.length, 3); j++) {
    const url = b.photos[j]
    const ext = guessExt(url)
    const dest = join(dir, `store-${j}.${ext}`)
    const r = await downloadFile(url, dest, `${id}/store-${j}`)
    if (r.ok) {
      paths.storeImages.push(`/brands/${id}/store-${j}.${ext}`)
      r.skipped ? skipped++ : downloaded++
    } else {
      failed++
    }
  }

  if (paths.storeImages.length > 0) {
    paths.heroImage = paths.storeImages[0]
  }

  return { id, paths, downloaded, skipped, failed }
}

async function runConcurrent(items, fn, concurrency) {
  const results = []
  let idx = 0

  async function worker() {
    while (idx < items.length) {
      const i = idx++
      results[i] = await fn(items[i], i)
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker())
  await Promise.all(workers)
  return results
}

async function main() {
  const brands = require(V2_JSON)
  console.log(`📥 Downloading photos for ${brands.length} V2 brands (concurrency: ${CONCURRENCY})...\n`)

  let totalDownloaded = 0, totalSkipped = 0, totalFailed = 0
  const progress = { count: 0 }

  const results = await runConcurrent(brands, async (b, i) => {
    const r = await processBrand(b, i)
    progress.count++
    totalDownloaded += r.downloaded
    totalSkipped += r.skipped
    totalFailed += r.failed
    if (progress.count % 25 === 0 || progress.count === brands.length) {
      console.log(`  [${String(progress.count).padStart(3)}/${brands.length}] downloaded:${totalDownloaded} skipped:${totalSkipped} failed:${totalFailed}`)
    }
    return r
  }, CONCURRENCY)

  // Build local-paths JSON
  const localPaths = {}
  for (const r of results) {
    if (r.paths.logo || r.paths.storeImages.length > 0) {
      localPaths[r.id] = r.paths
    }
  }

  await writeFile(OUT_JSON, JSON.stringify(localPaths, null, 2), 'utf8')

  console.log(`\n✅ Download complete!`)
  console.log(`   Downloaded: ${totalDownloaded} files`)
  console.log(`   Skipped (existing): ${totalSkipped} files`)
  console.log(`   Failed: ${totalFailed} files`)
  console.log(`   Local paths written to: ${OUT_JSON}`)
  console.log(`\n⚠️  REQUIRED next step: 원본은 압축 안 됨(최대 ~100MB/장).`)
  console.log(`   git에 넣기 전 또는 페이지 로딩 전 반드시 리사이즈:`)
  console.log(`   PowerShell:  $s = Get-Content -Raw scripts/resize-v2-photos.ps1; $s | iex`)
  console.log(`   결과: 1200px·JPEG q80, 합 ~100MB로 줄어듦.`)
}

main().catch(e => { console.error('Fatal:', e); process.exit(1) })
