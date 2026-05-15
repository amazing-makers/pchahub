/**
 * enrich-v2-with-kftc.mjs
 *
 * V2 카탈로그(v* 브랜드) 253개의 이름을 KFTC 공정거래위원회 정보공개서 API
 * 응답과 매칭해, 매장 수·평균 매출·창업비 등 정확한 정부 공개 자료로 보강.
 *
 * 입력:  apps/pchahub/lib/v2-brands.json (253 brands with regNum/name/category)
 * 출력:  packages/listings/data/v2-kftc-enrichments.json
 *
 * KFTC API 3종을 모두 호출 후, brandNm + corpNm 기준 인덱스 작성. V2 브랜드 이름을
 * normalize(공백/특수문자 제거 + 한글 우선)해서 매칭.
 *
 * 실행:
 *   .tools\node-v22.12.0-win-x64\node.exe scripts\enrich-v2-with-kftc.mjs
 */

import { mkdir, writeFile, readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config as loadEnv } from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const V2_JSON = join(ROOT, 'apps', 'pchahub', 'lib', 'v2-brands.json')
const OUT = join(ROOT, 'packages', 'listings', 'data', 'v2-kftc-enrichments.json')

// .env 로드
async function loadDotEnv() {
  try {
    const t = await readFile(join(ROOT, '.env'), 'utf8')
    for (const line of t.split(/\r?\n/)) {
      const m = line.match(/^([A-Z_]+)\s*=\s*"?([^"\r\n]+)"?\s*$/)
      if (m) process.env[m[1]] = m[2]
    }
  } catch {}
}

const DATA_GO_KR = 'https://apis.data.go.kr'

// KFTC EgovMap XML 파서 (datago-client.ts와 동일 패턴)
function parseEgovMap(xml) {
  const items = []
  const itemsBlock = xml.match(/<items>([\s\S]*?)<\/items>/)?.[1] ?? ''
  for (const m of itemsBlock.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const inner = m[1]
    const obj = {}
    for (const f of inner.matchAll(/<([a-zA-Z][a-zA-Z0-9_]*)>([^<]*)<\/\1>/g)) {
      const v = f[2].trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      const n = Number(v)
      obj[f[1]] = v !== '' && !isNaN(n) ? n : v
    }
    items.push(obj)
  }
  const total = parseInt(xml.match(/<totalCount>(\d+)<\/totalCount>/)?.[1] ?? '0', 10)
  return { items, totalCount: total }
}

async function callKftc(service, params) {
  const u = new URL(`${DATA_GO_KR}/1130000/${service}`)
  u.searchParams.set('serviceKey', process.env.KFTC_API_KEY)
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, String(v))
  const res = await fetch(u.toString())
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const txt = await res.text()
  if (txt.trimStart().startsWith('{')) {
    const j = JSON.parse(txt)
    const env = j?.response ?? j
    const items = Array.isArray(env?.body?.items) ? env.body.items : (env?.body?.items?.item ?? [])
    return { body: { items, totalCount: env?.body?.totalCount ?? items.length } }
  }
  const { items, totalCount } = parseEgovMap(txt)
  return { body: { items, totalCount } }
}

function normalize(s) {
  return String(s ?? '')
    .replace(/[\s\(\)\[\]【】《》「」『』·.,'"·~`!@#$%^&*=+|;:?/\\<>{}-]/g, '')
    .replace(/주식회사/g, '')
    .toLowerCase()
}

/** 한 KFTC 호출 패턴 (FrcsStats, FntnStats, BrandStats)을 3페이지로 풀스캔 */
async function fetchAllPages(service, paramsBase) {
  const items = []
  for (const pageNo of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    try {
      const r = await callKftc(service, { ...paramsBase, pageNo, numOfRows: 1000 })
      const arr = r?.body?.items ?? []
      items.push(...arr)
      const total = r?.body?.totalCount ?? 0
      if (items.length >= total || arr.length < 1000) break
    } catch (e) {
      console.warn(`  ${service} page ${pageNo} fail: ${e.message}`)
      break
    }
  }
  return items
}

async function main() {
  await loadDotEnv()
  if (!process.env.KFTC_API_KEY) {
    console.error('KFTC_API_KEY missing in .env')
    process.exit(1)
  }

  const v2 = JSON.parse(await readFile(V2_JSON, 'utf8'))
  console.log(`📋 V2 catalog: ${v2.length} brands\n`)

  const prevYear = new Date().getFullYear() - 1
  console.log(`📡 fetching KFTC year=${prevYear} 3종 API...`)

  const [frcs, fntn, brand] = await Promise.all([
    fetchAllPages('FftcBrandFrcsStatsService/getBrandFrcsStats', { yr: prevYear }),
    fetchAllPages('FftcBrandFntnStatsService/getBrandFntnStats', { yr: prevYear }),
    fetchAllPages('FftcBrandBrandStatsService/getBrandBrandStats', { yr: prevYear }),
  ])
  console.log(`  frcs: ${frcs.length}, fntn: ${fntn.length}, brand: ${brand.length}`)

  // brandNm + corpNm 기반 인덱스 (normalize 후 키)
  const frcsByName = new Map()
  for (const r of frcs) {
    const k = normalize(r.brandNm) || normalize(r.corpNm)
    if (k) frcsByName.set(k, r)
  }
  const fntnByName = new Map()
  for (const r of fntn) {
    const k = normalize(r.brandNm) || normalize(r.corpNm)
    if (k) fntnByName.set(k, r)
  }
  const brandByName = new Map()
  for (const r of brand) {
    const k = normalize(r.brandNm) || normalize(r.corpNm)
    if (k) brandByName.set(k, r)
  }

  // V2 브랜드 매칭
  const enrichments = {}
  let matched = 0
  for (const v of v2) {
    const norm = normalize(v.name)
    if (!norm) continue

    const frcsRow = frcsByName.get(norm)
    const fntnRow = fntnByName.get(norm)
    const brandRow = brandByName.get(norm)

    if (!frcsRow && !fntnRow && !brandRow) continue
    matched++

    const e = {
      regNum: v.regNum,
      name: v.name,
      matchedNames: [
        frcsRow?.brandNm,
        fntnRow?.brandNm,
        brandRow?.brandNm,
      ].filter((x, i, a) => x && a.indexOf(x) === i),
    }

    if (frcsRow) {
      // KFTC FrcsStats 필드(확인됨, 2025년 응답 기준):
      //   frcsCnt(가맹점수), newFrcsRgsCnt(신규), ctrtEndCnt(폐점),
      //   avrgSlsAmt(평균 연매출, 만원 단위 — 큰 브랜드 sample 5억 7000만 = 571726 확인)
      if (frcsRow.frcsCnt != null) e.storeCount = Number(frcsRow.frcsCnt)
      if (frcsRow.newFrcsRgsCnt != null) e.newOpenCount = Number(frcsRow.newFrcsRgsCnt)
      if (frcsRow.ctrtEndCnt != null) e.closedCount = Number(frcsRow.ctrtEndCnt)
      if (frcsRow.avrgSlsAmt != null) e.avgAnnualSales = Number(frcsRow.avrgSlsAmt)
      if (frcsRow.arUnitAvrgSlsAmt != null) e.avgSalesPerSqm = Number(frcsRow.arUnitAvrgSlsAmt)
      e.corpNm = frcsRow.corpNm
    }
    if (fntnRow) {
      if (fntnRow.jngBzmnJngAmt != null) e.fntnFranchiseFee = Number(fntnRow.jngBzmnJngAmt)
      if (fntnRow.jngBzmnAssrncAmt != null) e.fntnDeposit = Number(fntnRow.jngBzmnAssrncAmt)
      if (fntnRow.jngBzmnEduAmt != null) e.fntnEducationFee = Number(fntnRow.jngBzmnEduAmt)
      if (fntnRow.jngBzmnEtcAmt != null) e.fntnOtherFees = Number(fntnRow.jngBzmnEtcAmt)
      if (fntnRow.smtnAmt != null) e.startupCost = Number(fntnRow.smtnAmt)
    }
    if (brandRow) {
      if (brandRow.jngBizStrtDate) {
        const yr = parseInt(String(brandRow.jngBizStrtDate).slice(0, 4), 10)
        if (!isNaN(yr)) e.jngBizStartYear = yr
      }
      if (brandRow.indutyMlsfcNm) e.indutyNm = brandRow.indutyMlsfcNm
      if (brandRow.empCnt != null) e.hqEmpCount = Number(brandRow.empCnt)
    }

    enrichments[v.regNum] = e
  }

  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(
    OUT,
    JSON.stringify({
      fetchedAt: new Date().toISOString(),
      year: prevYear,
      v2Total: v2.length,
      matched,
      enrichments,
    }, null, 2),
    'utf8',
  )

  console.log(`\n✅ matched ${matched} / ${v2.length} V2 brands → ${OUT}`)
  console.log('\n--- 매칭 sample ---')
  Object.values(enrichments).slice(0, 5).forEach((e) => {
    console.log(`  ${e.name}: store ${e.storeCount ?? '-'}, sales ${e.avgAnnualSales ?? '-'}만, startup ${e.startupCost ?? '-'}만, since ${e.jngBizStartYear ?? '-'}`)
  })
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1) })
