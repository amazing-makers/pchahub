/**
 * fetch-myfranchise-extras.mjs
 *
 * 사용자 명시 동의(option C, 위험 감수 / 2026-05-15)로 진행.
 * V2 카탈로그 253개 브랜드의 brandDetailPageOne GraphQL 호출 → 인테리어·메뉴
 * 사진 URL 추출 → 우리 도메인(themyungdang public/brand-assets)에 다운로드 →
 * packages/listings/data/myfranchise-extras.json 로 메타 저장.
 *
 * UI에는 "마이프차" 단어·URL·링크 0 — 사진은 우리 도메인 경로(/brand-assets/...)
 * 로만 노출.
 *
 * polite: 호출 간 800ms delay, 표준 헤더 (Origin/Referer/UA).
 *
 * 실행:
 *   --probe : 토프레소 1건만 응답 구조 확인
 *   기본    : 전체 253건 수집
 */

import { mkdir, writeFile, access, readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const V2_JSON = join(ROOT, 'apps', 'pchahub', 'lib', 'v2-brands.json')
const PHOTO_DIR = join(ROOT, 'apps', 'themyungdang', 'public', 'brand-assets')
const OUT_JSON = join(ROOT, 'packages', 'listings', 'data', 'myfranchise-extras.json')
const TMP_DIR = join(ROOT, 'tmp')

const GQL_URL = 'https://b2c-backend.myfranchise.kr/graphql'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'

const QUERY = `query brandDetailPageOne($filter: FilterFindOneBrandDetailPageInput) {
  result: brandDetailPageOne(filter: $filter) {
    registrationNumber
    brandInformationSectionList
    brandInformationSectionV2List
    brandInformationSectionFranchisingList
    brandRecommendedStoreList
    menuOptions
  }
}`

const PROBE_MODE = process.argv.includes('--probe')

async function exists(p) { try { await access(p); return true } catch { return false } }

async function callGraphQL(regNum) {
  const body = JSON.stringify({
    operationName: 'brandDetailPageOne',
    variables: { filter: { registrationNumber: regNum } },
    query: QUERY,
  })
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://myfranchise.kr',
      Referer: 'https://myfranchise.kr/',
      'User-Agent': UA,
    },
    body,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

async function downloadPhoto(url, destPath) {
  if (await exists(destPath)) return { skipped: true }
  const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://myfranchise.kr/' } })
  if (!res.ok) return { ok: false, error: `HTTP ${res.status}` }
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 500) return { ok: false, error: 'too small' }
  await writeFile(destPath, buf)
  return { ok: true, bytes: buf.length }
}

/**
 * 응답 트리에서 URL을 카테고리별로 수집.
 *
 * 마이프차 응답 구조 (확인됨, 2026-05-15):
 *   brandInformationSectionList[i].menus = [{ name, price, originalUrl, thumbUrl }]
 *   brandInformationSectionList[i].interiors = [{ name, originalUrl, thumbUrl }]
 *   brandInformationSectionList[i].videos = [{ url }]
 *   brandInformationSectionV2List도 동일 구조 가능성
 *
 * 핵심 분류 기준 = 부모 array key name (menus / interiors / signatures …).
 * originalUrl 우선, 없으면 thumbUrl.
 */
function extractCategorizedPhotos(data) {
  const out = { menu: [], interior: [], store: [], other: [] }
  // 메뉴는 이름·가격도 같이 저장 (디테일 페이지의 MenuSection에서 사용)
  const menuItems = [] // [{ name, price, url }]
  const seen = new Set()

  const isImg = (s) => typeof s === 'string'
    && /cdn\.myfranchise|prod-myfranchise|s3\.[a-z0-9-]+\.amazonaws/.test(s)
    && !/icon_|favicon|placeholder|svg$/.test(s)

  function bucketForKey(key) {
    const k = String(key ?? '').toLowerCase()
    if (/^menus?$|^signature/.test(k) || /menu(items|list)?$/i.test(k)) return 'menu'
    if (/^interiors?$|^exteriors?$/.test(k) || /interior(items|list)?$/i.test(k)) return 'interior'
    if (/^stores?$|^shops?$/.test(k)) return 'store'
    return null
  }

  function pickUrl(item) {
    if (!item || typeof item !== 'object') return ''
    const v = item.originalUrl ?? item.imageUrl ?? item.url ?? item.src ?? item.thumbUrl ?? ''
    return typeof v === 'string' && isImg(v) ? v.split('?')[0] : ''
  }

  function walk(node) {
    if (!node) return
    if (Array.isArray(node)) {
      for (const v of node) walk(v)
      return
    }
    if (typeof node !== 'object') return

    for (const [k, v] of Object.entries(node)) {
      const bucket = bucketForKey(k)
      if (bucket && Array.isArray(v)) {
        for (const item of v) {
          const url = pickUrl(item)
          if (!url || seen.has(url)) continue
          seen.add(url)
          out[bucket].push(url)
          if (bucket === 'menu' && item && typeof item === 'object') {
            menuItems.push({
              name: item.name ?? '',
              price: typeof item.price === 'number' ? item.price : undefined,
              url,
            })
          }
        }
        continue
      }
      walk(v)
    }
  }

  walk(data)
  return { ...out, menuItems }
}

async function main() {
  await mkdir(TMP_DIR, { recursive: true })
  const v2 = JSON.parse(await readFile(V2_JSON, 'utf8'))
  const targets = PROBE_MODE
    ? [{ regNum: '20080100482', name: '토프레소' }]
    : v2.map((b) => ({ regNum: b.regNum, name: b.name }))

  console.log(`🚀 ${targets.length} brands ${PROBE_MODE ? '(PROBE)' : ''}\n`)
  await mkdir(PHOTO_DIR, { recursive: true })
  await mkdir(dirname(OUT_JSON), { recursive: true })

  const results = []
  for (let i = 0; i < targets.length; i++) {
    const { regNum, name } = targets[i]
    try {
      const json = await callGraphQL(regNum)
      const data = json?.data?.result
      if (!data) {
        console.log(`  [${i + 1}/${targets.length}] ${regNum} ${name} — no data`)
        results.push({ regNum, name, found: false })
      } else {
        const { menuItems, ...categorized } = extractCategorizedPhotos(data)
        const counts = Object.fromEntries(Object.entries(categorized).map(([k, v]) => [k, v.length]))
        console.log(`  [${i + 1}/${targets.length}] ${regNum} ${name} —`, counts, `+ menuItems:${menuItems.length}`)

        if (PROBE_MODE) {
          await writeFile(join(TMP_DIR, `probe-${regNum}.json`), JSON.stringify(data, null, 2), 'utf8')
          results.push({ regNum, name, categorized, menuItems, raw: '(omitted in probe summary)' })
          break
        }

        // download photos by category
        const localPaths = { menu: [], interior: [], store: [], other: [] }
        const localMenuItems = []
        for (const cat of Object.keys(categorized)) {
          const urls = categorized[cat].slice(0, 8)
          if (urls.length === 0) continue
          const catDir = join(PHOTO_DIR, `v${regNum}`, cat)
          await mkdir(catDir, { recursive: true })
          for (let j = 0; j < urls.length; j++) {
            const url = urls[j]
            const ext = (url.match(/\.(jpe?g|png|webp)$/i)?.[1] ?? 'jpg').toLowerCase().replace('jpeg', 'jpg')
            const dst = join(catDir, `${j + 1}.${ext}`)
            const r = await downloadPhoto(url, dst)
            if (r.ok || r.skipped) {
              const localPath = `/brand-assets/v${regNum}/${cat}/${j + 1}.${ext}`
              localPaths[cat].push(localPath)
              if (cat === 'menu') {
                const mi = menuItems.find((m) => m.url === url)
                if (mi) localMenuItems.push({ name: mi.name, price: mi.price, image: localPath })
              }
            }
          }
        }
        results.push({ regNum, name, found: true, photos: localPaths, menuItems: localMenuItems })
      }
    } catch (e) {
      console.warn(`  [${i + 1}/${targets.length}] ${regNum} ${name} FAIL: ${e.message}`)
      results.push({ regNum, name, error: e.message })
    }
    if (!PROBE_MODE && i < targets.length - 1) await new Promise((r) => setTimeout(r, 800))
  }

  await writeFile(
    OUT_JSON,
    JSON.stringify({
      fetchedAt: new Date().toISOString(),
      count: results.filter((r) => r.found).length,
      brands: results,
    }, null, 2),
    'utf8',
  )
  console.log(`\n✅ saved → ${OUT_JSON}`)
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1) })
