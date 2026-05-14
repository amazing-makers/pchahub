/**
 * download-brand-assets.mjs
 *
 * Uses specific registration numbers (discovered via franchise.kr GraphQL)
 * to download logos, store photos, and extract video URLs for 12 mock brands.
 *
 * Run:
 *   .tools/node-v22.12.0-win-x64/node.exe scripts/download-brand-assets.mjs
 */

import { mkdir, writeFile } from 'fs/promises'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC_DIR = join(ROOT, 'apps', 'pchahub', 'public', 'brands')
const GQL_URL = 'https://b2c-backend.myfranchise.kr/graphql'

// Confirmed mapping: mock brand → real Korean franchise with V2 photo data
// Each real brand has isBrandInformationV2 = true (confirmed via GraphQL)
const BRAND_MAP = [
  { id: 'b1',  regNum: '20120100525', realName: '호치킨',              ourName: '치킨다이스'    },
  { id: 'b2',  regNum: '20180244',    realName: '텐퍼센트스페셜티커피',  ourName: '데일리브루'    },
  { id: 'b3',  regNum: '20213078',    realName: '육칠이',               ourName: '한솥미식'      },
  { id: 'b4',  regNum: '20211853',    realName: '백소정',               ourName: '스시키친'      },
  { id: 'b5',  regNum: '20220073',    realName: '헬키푸키',             ourName: '분식나라'      },
  { id: 'b6',  regNum: '20211504',    realName: '과일에반하다.프루타',   ourName: '스윗스튜디오'  },
  { id: 'b7',  regNum: '20212429',    realName: '슬로우캘리',           ourName: '주스레인'      },
  { id: 'b8',  regNum: '20240481',    realName: '숯토리',               ourName: '포차모임'      },
  { id: 'b9',  regNum: '20213267',    realName: '기영이숯불두마리치킨', ourName: '크리스피네스트' },
  { id: 'b10', regNum: '20181157',    realName: '동경에서먹었던규동',   ourName: '카페모먼트'    },
  { id: 'b11', regNum: '20250859',    realName: '9504 양평칼국수',      ourName: '한그릇진심'    },
  { id: 'b12', regNum: '20220296',    realName: '국민매운찜갈비',       ourName: '라멘이치고'    },
]

async function fetchBrandAssets(regNum) {
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    body: JSON.stringify({
      query: `query GetBrand($regNum: String) {
        franchiseOne(filter: { registrationNumber: $regNum }) {
          name registrationNumber
          brandDetailPage { brandInformationSectionV2List }
        }
      }`,
      variables: { regNum },
    }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0]?.message)
  const brand = json?.data?.franchiseOne
  if (!brand) return null

  let raw = brand.brandDetailPage?.brandInformationSectionV2List
  if (typeof raw === 'string') { try { raw = JSON.parse(raw) } catch { raw = null } }
  if (Array.isArray(raw)) raw = Object.assign({}, ...raw)

  const templateKey = raw ? Object.keys(raw).find((k) => k.endsWith('_v2')) : null
  const template = raw?.[templateKey]

  return {
    name: brand.name,
    logo: template?.basicInfo_v2?.logo ?? null,
    thumbnail: template?.basicInfo_v2?.thumbnail ?? null,
    coverImages: template?.intro_v2?.coverImages ?? [],
    videos: template?.intro_v2?.videos ?? [],
  }
}

function guessExt(url, fallback = 'jpg') {
  try {
    const p = new URL(url).pathname
    const ext = extname(p).slice(1).toLowerCase().split('?')[0]
    return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)
      ? (ext === 'jpeg' ? 'jpg' : ext) : fallback
  } catch { return fallback }
}

async function download(url, dest, label) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://myfranchise.kr/',
        'Origin': 'https://myfranchise.kr',
      },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = await res.arrayBuffer()
    await writeFile(dest, Buffer.from(buf))
    console.log(`   ✓ ${label}`)
    return true
  } catch (e) {
    console.log(`   ✗ ${label}: ${e.message}`)
    return false
  }
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true })
  const results = []

  for (const target of BRAND_MAP) {
    console.log(`\n─── ${target.id} (${target.ourName} → ${target.realName}) ───`)

    let assets
    try {
      assets = await fetchBrandAssets(target.regNum)
    } catch (e) {
      console.log(`   ✗ GQL error: ${e.message}`)
      results.push({ id: target.id, error: e.message })
      continue
    }

    if (!assets) {
      console.log(`   ✗ No data`)
      results.push({ id: target.id, error: 'no_data' })
      continue
    }

    console.log(`   logo: ${!!assets.logo}  photos: ${assets.coverImages.length}  videos: ${assets.videos.length}`)

    const dir = join(PUBLIC_DIR, target.id)
    await mkdir(dir, { recursive: true })
    const paths = { storeImages: [] }

    // Logo (prefer logo, fallback to thumbnail)
    const logoUrl = assets.logo || assets.thumbnail
    if (logoUrl) {
      const ext = guessExt(logoUrl)
      const ok = await download(logoUrl, join(dir, `logo.${ext}`), 'logo')
      if (ok) paths.logo = `/brands/${target.id}/logo.${ext}`
    }

    // Cover photos: first goes to hero + storeImages; up to 3 total
    const covers = assets.coverImages.slice(0, 3)
    for (let i = 0; i < covers.length; i++) {
      const url = covers[i].originalUrl ?? covers[i].thumbUrl
      if (!url) continue
      const ext = guessExt(url)
      const filename = `store-${i}.${ext}`
      const ok = await download(url, join(dir, filename), `store-${i}`)
      if (ok) paths.storeImages.push(`/brands/${target.id}/${filename}`)
    }
    if (paths.storeImages.length > 0) paths.heroImage = paths.storeImages[0]

    // Extra photos → menu images (photos 3-6)
    paths.menuImages = []
    for (let i = 3; i < Math.min(assets.coverImages.length, 7); i++) {
      const url = assets.coverImages[i]?.originalUrl ?? assets.coverImages[i]?.thumbUrl
      if (!url) continue
      const ext = guessExt(url)
      const filename = `menu-${i - 3}.${ext}`
      const ok = await download(url, join(dir, filename), `menu-${i - 3}`)
      if (ok) paths.menuImages.push(`/brands/${target.id}/${filename}`)
    }

    // Video URL (YouTube — no download needed)
    if (assets.videos.length > 0) {
      paths.videoUrl = assets.videos[0].url
      console.log(`   ✓ video: ${paths.videoUrl}`)
    }

    results.push({
      id: target.id,
      ourName: target.ourName,
      realName: assets.name,
      regNum: target.regNum,
      paths,
    })
  }

  // Save JSON result
  await writeFile(
    join(__dirname, 'brand-assets-result.json'),
    JSON.stringify(results, null, 2),
    'utf8',
  )

  console.log('\n\n✅ Complete! brand-assets-result.json written.\n')
  console.log('═══ Copy these into mock-data.ts ═══')
  for (const r of results) {
    if (r.error) { console.log(`\n// ${r.id} FAILED: ${r.error}`); continue }
    const p = r.paths
    console.log(`\n// ${r.id} (${r.ourName} — real: ${r.realName})`)
    if (p.logo)       console.log(`  logo: '${p.logo}',`)
    if (p.heroImage)  console.log(`  heroImage: '${p.heroImage}',`)
    if (p.storeImages?.length) console.log(`  storeImages: ${JSON.stringify(p.storeImages)},`)
    if (p.videoUrl)   console.log(`  videoUrl: '${p.videoUrl}',`)
  }
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1) })
