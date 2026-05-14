/**
 * seed-brand-assets.mjs
 *
 * Downloads real franchise assets from myfranchise.kr (logo, store photos,
 * video URL) and saves them to apps/pchahub/public/brands/{id}/.
 *
 * Run:
 *   .tools/node-v22.12.0-win-x64/node.exe scripts/seed-brand-assets.mjs
 */

import { mkdir, writeFile, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC_DIR = join(ROOT, 'apps', 'pchahub', 'public', 'brands')
const GQL_URL = 'https://b2c-backend.myfranchise.kr/graphql'
const SITEMAP_URL =
  'https://prod-myfranchise-cdn.s3.ap-northeast-2.amazonaws.com/sitemap.xml'

// Our mock brand ID → real Korean franchise to use as photo source
const BRAND_TARGETS = [
  { id: 'b1',  ourName: '치킨다이스',    search: '교촌치킨',      category: 'chicken'  },
  { id: 'b2',  ourName: '데일리브루',    search: '메가MGC커피',    category: 'cafe'     },
  { id: 'b3',  ourName: '한솥미식',      search: '본죽',           category: 'korean'   },
  { id: 'b4',  ourName: '스시키친',      search: '스시로',         category: 'japanese' },
  { id: 'b5',  ourName: '분식나라',      search: '신전떡볶이',     category: 'snack'    },
  { id: 'b6',  ourName: '스윗스튜디오', search: '배스킨라빈스',   category: 'dessert'  },
  { id: 'b7',  ourName: '주스레인',      search: '공차',           category: 'beverage' },
  { id: 'b8',  ourName: '포차모임',      search: '놀부부대찌개',   category: 'bar'      },
  { id: 'b9',  ourName: '크리스피네스트', search: 'bhc치킨',       category: 'chicken'  },
  { id: 'b10', ourName: '카페모먼트',    search: '이디야커피',     category: 'cafe'     },
  { id: 'b11', ourName: '한그릇진심',    search: '원할머니보쌈',   category: 'korean'   },
  { id: 'b12', ourName: '라멘이치고',    search: '하남돼지집',     category: 'japanese' },
]

// ── Sitemap ─────────────────────────────────────────────────────────────────

async function fetchSitemapUrls() {
  console.log('📋 Fetching sitemap...')
  const res = await fetch(SITEMAP_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bot)' },
  })
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`)
  const xml = await res.text()
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/gs)].map((m) => m[1].trim())
  console.log(`   Found ${locs.length} URLs`)
  return locs
}

function findRegNum(urls, searchName) {
  const normalise = (s) =>
    decodeURIComponent(s)
      .replace(/[-_\s]/g, '')
      .toLowerCase()
  const needle = normalise(searchName)

  for (const url of urls) {
    try {
      const parts = new URL(url).pathname.split('/').filter(Boolean)
      if (parts.length < 2) continue
      const slug = normalise(parts[1])
      if (slug === needle || slug.startsWith(needle) || slug.includes(needle)) {
        return parts[0]
      }
    } catch {
      // skip malformed
    }
  }
  return null
}

// ── GraphQL ──────────────────────────────────────────────────────────────────

async function fetchBrandAssets(regNum) {
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; bot)',
    },
    body: JSON.stringify({
      query: `query GetBrand($regNum: String) {
        franchiseOne(filter: { registrationNumber: $regNum }) {
          name
          registrationNumber
          brandDetailPage {
            brandInformationSectionV2List
          }
        }
      }`,
      variables: { regNum },
    }),
  })
  const json = await res.json()
  if (json.errors) {
    console.error('   GQL errors:', json.errors)
    return null
  }
  const brand = json?.data?.franchiseOne
  if (!brand) return null

  // brandInformationSectionV2List may be a JSON string or already an object
  let raw = brand.brandDetailPage?.brandInformationSectionV2List
  if (typeof raw === 'string') {
    try { raw = JSON.parse(raw) } catch { raw = null }
  }

  // May be an array of section objects or a direct object
  if (Array.isArray(raw)) {
    raw = Object.assign({}, ...raw)
  }

  const template = raw?.foodTemplate_v2
  if (!template) {
    // Some brands use different template keys — try to grab any template
    const firstKey = raw ? Object.keys(raw).find((k) => k.endsWith('_v2')) : null
    if (!firstKey) return null
    const alt = raw[firstKey]
    return {
      name: brand.name,
      logo: alt?.basicInfo_v2?.logo ?? null,
      thumbnail: alt?.basicInfo_v2?.thumbnail ?? null,
      coverImages: alt?.intro_v2?.coverImages ?? [],
      videos: alt?.intro_v2?.videos ?? [],
    }
  }

  return {
    name: brand.name,
    logo: template.basicInfo_v2?.logo ?? null,
    thumbnail: template.basicInfo_v2?.thumbnail ?? null,
    coverImages: template.intro_v2?.coverImages ?? [],
    videos: template.intro_v2?.videos ?? [],
  }
}

// ── Download ─────────────────────────────────────────────────────────────────

async function downloadFile(url, destPath) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bot)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = await res.arrayBuffer()
  await writeFile(destPath, Buffer.from(buffer))
}

function guessExt(url, fallback = 'jpg') {
  try {
    const pathname = new URL(url).pathname
    const ext = extname(pathname).replace('.', '').split('?')[0].toLowerCase()
    return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)
      ? (ext === 'jpeg' ? 'jpg' : ext)
      : fallback
  } catch {
    return fallback
  }
}

async function tryDownload(url, destPath, label) {
  if (!url) return false
  try {
    await downloadFile(url, destPath)
    console.log(`   ✓ ${label}`)
    return true
  } catch (e) {
    console.log(`   ✗ ${label}: ${e.message}`)
    return false
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true })

  const sitemapUrls = await fetchSitemapUrls()
  const results = []

  for (const target of BRAND_TARGETS) {
    console.log(`\n─── ${target.id} (${target.ourName} → ${target.search}) ───`)

    const regNum = findRegNum(sitemapUrls, target.search)
    if (!regNum) {
      console.log(`   ⚠ "${target.search}" not found in sitemap`)
      results.push({ id: target.id, error: 'not_in_sitemap', search: target.search })
      continue
    }
    console.log(`   regNum: ${regNum}`)

    const assets = await fetchBrandAssets(regNum)
    if (!assets) {
      console.log(`   ⚠ No brand data from GraphQL`)
      results.push({ id: target.id, error: 'no_gql_data', regNum })
      continue
    }
    console.log(`   realName: ${assets.name}  logo: ${!!assets.logo}  photos: ${assets.coverImages.length}  videos: ${assets.videos.length}`)

    const dir = join(PUBLIC_DIR, target.id)
    await mkdir(dir, { recursive: true })

    const paths = {}

    // Logo
    if (assets.logo) {
      const ext = guessExt(assets.logo)
      const dest = join(dir, `logo.${ext}`)
      const ok = await tryDownload(assets.logo, dest, 'logo')
      if (ok) paths.logo = `/brands/${target.id}/logo.${ext}`
    }
    // Fallback logo → thumbnail
    if (!paths.logo && assets.thumbnail) {
      const ext = guessExt(assets.thumbnail)
      const dest = join(dir, `logo.${ext}`)
      const ok = await tryDownload(assets.thumbnail, dest, 'logo (thumbnail fallback)')
      if (ok) paths.logo = `/brands/${target.id}/logo.${ext}`
    }

    // Store / cover photos (up to 3)
    paths.storeImages = []
    for (let i = 0; i < Math.min(assets.coverImages.length, 3); i++) {
      const img = assets.coverImages[i]
      const url = img.originalUrl ?? img.thumbUrl
      if (!url) continue
      const ext = guessExt(url)
      const dest = join(dir, `store-${i}.${ext}`)
      const ok = await tryDownload(url, dest, `store-${i}`)
      if (ok) paths.storeImages.push(`/brands/${target.id}/store-${i}.${ext}`)
    }

    // Hero = first store photo
    if (paths.storeImages.length > 0) {
      paths.heroImage = paths.storeImages[0]
    }

    // Menu photos (additional cover images beyond first 3)
    paths.menuImages = []
    for (let i = 3; i < Math.min(assets.coverImages.length, 7); i++) {
      const img = assets.coverImages[i]
      const url = img.originalUrl ?? img.thumbUrl
      if (!url) continue
      const ext = guessExt(url)
      const dest = join(dir, `menu-${i - 3}.${ext}`)
      const ok = await tryDownload(url, dest, `menu-${i - 3}`)
      if (ok) paths.menuImages.push(`/brands/${target.id}/menu-${i - 3}.${ext}`)
    }

    // Video URL — keep as-is (YouTube/Vimeo embed in player)
    if (assets.videos.length > 0) {
      paths.videoUrl = assets.videos[0].url
      console.log(`   ✓ video: ${paths.videoUrl}`)
    }

    results.push({
      id: target.id,
      ourName: target.ourName,
      realName: assets.name,
      regNum,
      paths,
    })
  }

  // Save result JSON
  const resultPath = join(__dirname, 'brand-assets-result.json')
  await writeFile(resultPath, JSON.stringify(results, null, 2), 'utf8')
  console.log(`\n\n✅ Done. Result written to ${resultPath}`)

  // Print mock-data snippet
  console.log('\n═══ Mock-data update (paths) ═══')
  for (const r of results) {
    if (r.error) {
      console.log(`\n// ${r.id}: FAILED — ${r.error}`)
      continue
    }
    const p = r.paths
    console.log(`\n// ${r.id} (${r.ourName} — uses ${r.realName}):`)
    if (p.logo)      console.log(`  logo: '${p.logo}',`)
    if (p.heroImage) console.log(`  heroImage: '${p.heroImage}',`)
    if (p.storeImages?.length) console.log(`  storeImages: ${JSON.stringify(p.storeImages)},`)
    if (p.videoUrl)  console.log(`  videoUrl: '${p.videoUrl}',`)
  }
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
