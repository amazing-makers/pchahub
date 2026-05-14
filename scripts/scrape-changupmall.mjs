/**
 * scrape-changupmall.mjs
 *
 * www.changupmall.com 매물 정보 수집기.
 *
 * 구조:
 * - /GAGE_LIST.asp?P_PAGE={n} — 페이지당 ~16 매물, COM_DETAIL('{J_ID}') onclick
 * - /GAGE_VIEW.asp?J_ID={id} — 매물 상세
 * - /upload/jumpo_real/{J_ID}_{n}.jpg — 매물 사진 (n=1~수 변동)
 *
 * 추출 필드: 제목, 사업체위치, 사업체크기, 현업종, 평균 월 매출/지출/수익,
 *           권리금(제목 파싱), 거래형태(양도/매각/신규)
 *
 * 출력:
 *   apps/themyungdang/public/listings/cm{J_ID}/*.jpg (사진 원본)
 *   apps/themyungdang/lib/cm-listings.json (파싱된 매물 메타)
 *
 * 실행:
 *   .tools/node-v22.12.0-win-x64/node.exe scripts/scrape-changupmall.mjs
 *   .tools/node-v22.12.0-win-x64/node.exe scripts/scrape-changupmall.mjs --pages 20
 *
 * 사후 리사이즈: scripts/resize-listing-photos.ps1 (V2 사진과 동일 패턴)
 */

import { mkdir, writeFile, access } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC_DIR = join(ROOT, 'apps', 'themyungdang', 'public', 'listings')
const OUT_JSON = join(ROOT, 'apps', 'themyungdang', 'lib', 'cm-listings.json')

const BASE = 'http://www.changupmall.com'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'

const argPages = parseInt((process.argv.find((a) => a.startsWith('--pages='))?.split('=')[1]) ?? '10', 10)
const MAX_PAGES = Math.max(1, Math.min(50, argPages))
const CONCURRENCY = 4
const PHOTO_MAX_PROBE = 10 // _1.jpg ~ _10.jpg 까지 시도

async function exists(p) { try { await access(p); return true } catch { return false } }

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Referer: BASE + '/' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
  // 사이트는 charset=utf-8 응답
  return await res.text()
}

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Referer: BASE + '/' },
  })
  if (!res.ok) return null
  return Buffer.from(await res.arrayBuffer())
}

function parseListIds(html) {
  const re = /COM_DETAIL\('(\d+)'\)/g
  const ids = new Set()
  let m
  while ((m = re.exec(html)) !== null) ids.add(m[1])
  return [...ids]
}

// ─────────────────────────────────────────────────────────────────
// 상세 페이지 파싱
// ─────────────────────────────────────────────────────────────────

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종', '제주', '강원', '충북', '충남', '전북', '전남', '경북', '경남']

function parseTitle(html) {
  // 매물 상세 페이지에는 <li class="d_tit">제목</li> 형태로 표시됨
  const m = html.match(/<li\s+class="d_tit"\s*>\s*([\s\S]*?)\s*<\/li>/)
  if (m) {
    return m[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
  }
  // fallback: S_MSG 폼 hidden input
  const s = html.match(/-물건제목\\n([^"\\]+)/)
  if (s) return s[1].trim()
  return ''
}

function detectListingType(title) {
  if (/매각/.test(title)) return 'sale'
  if (/신규|임대|오픈/.test(title)) return 'new'
  return 'transfer'
}

function splitLocation(text) {
  // 사업체위치 필드 → region/district. e.g. "서울 강서구", "인천", "청주시"
  const t = text.trim()
  for (const r of REGIONS) {
    if (t.startsWith(r)) {
      const rest = t.slice(r.length).trim()
      return { region: r, district: rest }
    }
  }
  // 시·군 단위로 떨어진 경우 (도가 빠진 표기)
  return { region: '기타', district: t }
}

function extractFieldNearLabel(html, label) {
  // <th>label</th><td>...</td> 패턴
  const labelEsc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`<th[^>]*>\\s*${labelEsc}\\s*</th>\\s*<td[^>]*>([\\s\\S]*?)</td>`, 'i')
  const m = html.match(re)
  if (!m) return ''
  return m[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
}

function extractChartData(html) {
  // JS 차트의 ["평균 월 매출", 숫자, ...] 패턴 (단위: 만원)
  const find = (label) => {
    const re = new RegExp(`\\[\\s*"${label}"\\s*,\\s*(\\d+)`, 'i')
    return parseInt(html.match(re)?.[1] ?? '0', 10) || 0
  }
  return {
    monthlyRevenue: find('평균 월 매출'),
    monthlyExpense: find('평균 월 지출'),
    monthlyProfit: find('평균 월 수익'),
  }
}

function extractRightFeeAndMonthlyProfit(html) {
  // <li class="d_tit40"> 박스 안에 "권리금 : 1억1천만원", "월수익 : 1,030만원"
  const block = html.match(/<li\s+class="d_tit40"\s*>([\s\S]*?)<\/li>/)?.[1] ?? ''
  const rightFee = parseKoreanMoney(block.match(/권리금\s*:\s*([^<\n]+)/)?.[1] ?? '')
  const monthlyProfit = parseKoreanMoney(block.match(/월수익\s*:\s*([^<\n]+)/)?.[1] ?? '')
  return { rightFee, monthlyProfit }
}

function parseKoreanMoney(text) {
  // "1억1천만원", "5,000만원", "2억8000만" → 만원 단위 정수
  if (!text) return 0
  const t = text.replace(/[,\s원]/g, '')
  if (!t) return 0
  let total = 0
  const eok = t.match(/(\d+)억/)
  if (eok) total += parseInt(eok[1], 10) * 10000
  const cheonman = t.replace(/\d+억/, '').match(/(\d+)천만/)
  if (cheonman) total += parseInt(cheonman[1], 10) * 1000
  const man = t.replace(/\d+억\d*천?만?/, '').match(/(\d+)만?$/)
  if (man) total += parseInt(man[1], 10)
  if (total === 0) {
    const raw = parseInt(t.replace(/[^\d]/g, ''), 10)
    if (raw > 0) total = raw
  }
  return total
}

function extractAreaPyeong(sizeText) {
  // "50㎡이상~100㎡미만" 같은 ㎡ 범위 → 중간값을 평으로 변환 (1평 ≈ 3.305㎡)
  const m = sizeText.match(/(\d+)\s*㎡(?:이상)?\s*~?\s*(\d+)?\s*㎡?/)
  if (m) {
    const low = parseInt(m[1], 10)
    const high = m[2] ? parseInt(m[2], 10) : low + 50
    const midSqm = (low + high) / 2
    return Math.round(midSqm / 3.305)
  }
  // "26평" 형태
  const py = sizeText.match(/(\d+)\s*평/)
  if (py) return parseInt(py[1], 10)
  return 0
}

function categorizeFitFromTitle(title, industry) {
  const tags = []
  const map = [
    [/치킨|닭/, 'chicken'],
    [/카페|커피|coffee/i, 'cafe'],
    [/베이커리|빵|디저트|아이스크림|빙수/, 'dessert'],
    [/한식|밥집|국밥|찌개|불고기/, 'korean'],
    [/일식|초밥|돈가스|라멘|우동/, 'japanese'],
    [/분식|떡볶이|김밥|순대/, 'snack'],
    [/주점|호프|이자카야|포차|술집/, 'bar'],
    [/편의점/, 'convenience'],
    [/학원|교육|공부|스터디/, 'education'],
    [/음료|버블티|쥬스/, 'beverage'],
  ]
  const subject = `${title} ${industry}`
  for (const [pat, key] of map) {
    if (pat.test(subject)) tags.push(key)
  }
  return [...new Set(tags)]
}

async function parseDetail(jId) {
  const url = `${BASE}/GAGE_VIEW.asp?J_ID=${jId}`
  let html
  try {
    html = await fetchText(url)
  } catch (e) {
    return null
  }

  const title = parseTitle(html)
  const location = extractFieldNearLabel(html, '사업체위치')
  const size = extractFieldNearLabel(html, '사업체크기')
  const industry = extractFieldNearLabel(html, '현업종')
  const chart = extractChartData(html)
  const moneyBox = extractRightFeeAndMonthlyProfit(html)
  const { region, district } = splitLocation(location)
  const area = extractAreaPyeong(size)
  const fitCategories = categorizeFitFromTitle(title, industry)
  const type = detectListingType(title)

  return {
    sourceId: String(jId),
    url,
    title,
    type,
    region,
    district,
    fullAddress: location,
    area,
    rawSize: size,
    rawIndustry: industry,
    rightFee: moneyBox.rightFee || undefined,
    // 차트의 평균 월 수익 vs 박스의 월수익은 보통 일치 — 박스 우선
    monthlyRevenue: chart.monthlyRevenue || undefined,
    monthlyExpense: chart.monthlyExpense || undefined,
    monthlyProfit: moneyBox.monthlyProfit || chart.monthlyProfit || undefined,
    fitCategories,
    currentBusiness: industry,
  }
}

// ─────────────────────────────────────────────────────────────────
// 사진 다운로드
// ─────────────────────────────────────────────────────────────────

async function downloadPhotos(jId) {
  const dir = join(PUBLIC_DIR, `cm${jId}`)
  await mkdir(dir, { recursive: true })
  const saved = []
  for (let n = 1; n <= PHOTO_MAX_PROBE; n++) {
    const url = `${BASE}/upload/jumpo_real/${jId}_${n}.jpg`
    const dst = join(dir, `${n}.jpg`)
    if (await exists(dst)) {
      saved.push(`/listings/cm${jId}/${n}.jpg`)
      continue
    }
    const buf = await fetchBuffer(url)
    if (!buf || buf.length < 500) break // 더 이상 사진 없음
    await writeFile(dst, buf)
    saved.push(`/listings/cm${jId}/${n}.jpg`)
  }
  return saved
}

// ─────────────────────────────────────────────────────────────────
// 동시성 헬퍼
// ─────────────────────────────────────────────────────────────────

async function runConcurrent(items, fn, n) {
  const out = []
  let i = 0
  async function worker() {
    while (i < items.length) {
      const idx = i++
      out[idx] = await fn(items[idx], idx)
    }
  }
  await Promise.all(Array.from({ length: n }, worker))
  return out
}

// ─────────────────────────────────────────────────────────────────
// 메인
// ─────────────────────────────────────────────────────────────────

async function main() {
  console.log(`📋 Scraping ${MAX_PAGES} pages from changupmall.com (concurrency ${CONCURRENCY})...\n`)

  // 1) 매물 ID 수집
  const allIds = new Set()
  for (let p = 1; p <= MAX_PAGES; p++) {
    try {
      const html = await fetchText(`${BASE}/GAGE_LIST.asp?P_PAGE=${p}`)
      const ids = parseListIds(html)
      ids.forEach((id) => allIds.add(id))
      console.log(`  page ${p}: +${ids.length} ids (total ${allIds.size})`)
    } catch (e) {
      console.warn(`  page ${p} failed: ${e.message}`)
    }
  }
  const idList = [...allIds]
  console.log(`\n🔗 ${idList.length} unique listings to fetch\n`)

  // 2) 상세 + 사진 (동시성 4)
  let done = 0
  const results = await runConcurrent(idList, async (jId) => {
    const detail = await parseDetail(jId)
    if (!detail) return null
    try {
      detail.photos = await downloadPhotos(jId)
    } catch (e) {
      detail.photos = []
    }
    done++
    if (done % 20 === 0 || done === idList.length) {
      console.log(`  [${done}/${idList.length}] ${jId} — ${detail.photos.length} photos`)
    }
    return detail
  }, CONCURRENCY)

  const ok = results.filter(Boolean)
  await mkdir(dirname(OUT_JSON), { recursive: true })
  await writeFile(OUT_JSON, JSON.stringify({
    source: 'changupmall',
    label: '창업몰',
    fetchedAt: new Date().toISOString(),
    listings: ok,
  }, null, 2), 'utf8')

  console.log(`\n✅ Done!`)
  console.log(`   Parsed: ${ok.length} / ${idList.length}`)
  console.log(`   Total photos: ${ok.reduce((s, r) => s + (r.photos?.length ?? 0), 0)}`)
  console.log(`   JSON: ${OUT_JSON}`)
  console.log(`\n⚠️  REQUIRED next step: 사진 리사이즈`)
  console.log(`   PowerShell:  scripts/resize-listing-photos.ps1`)
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1) })
