// franchise.ftc.go.kr 정보공개서 API 호출 클라이언트.
//
// 4개 엔드포인트가 한 세트:
//   listDisclosures(yr)            → 연도별 정보공개서 메타 목록
//   getDisclosureTOC(jngIfrmpSn)   → 특정 정보공개서 목차
//   getDisclosureContent(jngIfrmpSn) → 본문 (가맹비/보증금/매장 등)
//   viewerUrl(jngIfrmpSn)          → 정보공개서 PDF 뷰어 (URL만 생성)
//
// 모든 API는 동일한 KFTC_API_KEY를 사용한다.
//
// 키가 .env에 없으면 즉시 throw — 호출하는 코드는 try/catch로 mock 폴백.

import type {
  DisclosureSerialNumber,
  KftcDisclosureContent,
  KftcDisclosureListItem,
  KftcDisclosureListResponse,
  KftcDisclosureTOC,
} from './types'

const BASE_URL = 'https://franchise.ftc.go.kr/api/search.do'

function getServiceKey(): string {
  const key = process.env.KFTC_API_KEY
  if (!key) {
    throw new Error(
      'KFTC_API_KEY 환경변수가 설정되지 않았습니다. .env에 추가하거나 mock 모드로 fallback 하세요.',
    )
  }
  return key
}

/**
 * 정보공개서 공개본 목록 조회.
 *
 * 매년 1~2월에 호출하여 그 해의 모든 정보공개서 일련번호를 받는 진입점.
 *
 * @param yr 검색할 정보공개서 기준년도 (예: 2024)
 * @param opts 페이지·페이지당 개수
 */
export async function listDisclosures(
  yr: number,
  opts: { pageNo?: number; numOfRows?: number } = {},
): Promise<KftcDisclosureListResponse> {
  const serviceKey = getServiceKey()
  const params = new URLSearchParams({
    type: 'list',
    yr: String(yr),
    serviceKey,
    pageNo: String(opts.pageNo ?? 1),
    numOfRows: String(opts.numOfRows ?? 100),
  })
  const url = `${BASE_URL}?${params.toString()}`

  const res = await fetch(url, {
    next: { revalidate: 86_400 }, // 24시간 캐시 — 분기 갱신이라 충분
  })
  if (!res.ok) {
    throw new Error(`KFTC list API 실패: ${res.status} ${res.statusText}`)
  }
  const xml = await res.text()
  return parseListXml(xml)
}

/**
 * 특정 정보공개서의 목차 조회.
 *
 * 6장 구성(1장 본부 일반현황 ~ 6장 가맹점 부담)의 sectionId/title을 받음.
 * 본문 호출 전 어떤 섹션이 있는지 확인용.
 */
export async function getDisclosureTOC(
  jngIfrmpSn: DisclosureSerialNumber,
): Promise<KftcDisclosureTOC> {
  const serviceKey = getServiceKey()
  const params = new URLSearchParams({
    type: 'title',
    jngIfrmpSn,
    serviceKey,
  })
  const url = `${BASE_URL}?${params.toString()}`
  const res = await fetch(url, { next: { revalidate: 86_400 } })
  if (!res.ok) throw new Error(`KFTC title API 실패: ${res.status}`)
  return parseTitleXml(await res.text(), jngIfrmpSn)
}

/**
 * 정보공개서 본문 조회 — 가맹비·보증금·인테리어비·매장 현황·매출 정보 등
 * BrandCosts + BrandDisclosureExtras + BrandStoreHistory + BrandRevenue
 * 매핑에 필요한 핵심 데이터를 모두 받는다.
 */
export async function getDisclosureContent(
  jngIfrmpSn: DisclosureSerialNumber,
): Promise<KftcDisclosureContent> {
  const serviceKey = getServiceKey()
  const params = new URLSearchParams({
    type: 'content',
    jngIfrmpSn,
    serviceKey,
  })
  const url = `${BASE_URL}?${params.toString()}`
  const res = await fetch(url, { next: { revalidate: 86_400 } })
  if (!res.ok) throw new Error(`KFTC content API 실패: ${res.status}`)
  return parseContentXml(await res.text(), jngIfrmpSn)
}

// ============================================================
// XML 파싱 — 외부 라이브러리 없이 순수 regex 기반 구현.
// KFTC XML은 구조가 단순하고 예측 가능하므로 regex로 충분히 처리 가능.
// ============================================================

/**
 * 태그 하나의 텍스트 내용을 추출한다.
 * <tagName>value</tagName> → "value"
 */
function tag(xml: string, tagName: string): string {
  const m = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`))
  return m ? m[1]!.trim() : ''
}

/**
 * 반복 태그 블록을 배열로 추출한다.
 * <item>...</item> 여러 개 → string[]
 */
function allTags(xml: string, tagName: string): string[] {
  const re = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, 'g')
  const results: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(xml)) !== null) {
    results.push(m[1]!.trim())
  }
  return results
}

/** 한국 공공API 금액 문자열 → 만원 (숫자). "0" / "" → 0 */
function toMan(s: string): number {
  const n = parseInt(s.replace(/,/g, ''), 10)
  return isFinite(n) ? n : 0
}

/** yyyy-MM-dd → yyyy 연도만 */
function yearOf(s: string): number {
  return parseInt(s.substring(0, 4), 10) || 0
}

function parseListXml(xml: string): KftcDisclosureListResponse {
  const header = tag(xml, 'header') || xml
  const body = tag(xml, 'body') || xml
  const items: KftcDisclosureListItem[] = allTags(xml, 'item').map((item) => ({
    jngIfrmpSn: tag(item, 'jngIfrmpSn'),
    brandNm:    tag(item, 'brandNm'),
    crpoNm:     tag(item, 'crpoNm'),
    regDt:      tag(item, 'regDt'),
    bizCondCd:  tag(item, 'bizCondCd') || undefined,
    indutyClsfNm: tag(item, 'indutyClsfNm') || undefined,
    fcCrpoMngNo: tag(item, 'fcCrpoMngNo') || undefined,
    bizRgNo:    tag(item, 'bizRgNo') || undefined,
  }))
  return {
    resultCode: tag(header, 'resultCode'),
    resultMsg:  tag(header, 'resultMsg'),
    totalCount: parseInt(tag(body, 'totalCount'), 10) || 0,
    pageNo:     parseInt(tag(body, 'pageNo'), 10) || 1,
    numOfRows:  parseInt(tag(body, 'numOfRows'), 10) || 0,
    items,
  }
}

function parseTitleXml(xml: string, jngIfrmpSn: DisclosureSerialNumber): KftcDisclosureTOC {
  const entries = allTags(xml, 'item').map((item, i) => ({
    sectionId: tag(item, 'sectionId') || `s${i + 1}`,
    title:     tag(item, 'title') || tag(item, 'sectionNm') || `섹션 ${i + 1}`,
    level:     parseInt(tag(item, 'level') || '1', 10),
  }))
  return { jngIfrmpSn, entries }
}

function parseContentXml(xml: string, jngIfrmpSn: DisclosureSerialNumber): KftcDisclosureContent {
  // ── 1장. 본부 일반현황 ──
  const ch1 = tag(xml, 'ch1') || xml
  const ch1_hqInfo = {
    crpoNm:              tag(ch1, 'crpoNm') || tag(xml, 'crpoNm'),
    repNm:               tag(ch1, 'repNm') || tag(xml, 'repNm'),
    estbsDt:             tag(ch1, 'estbsDt') || '',
    fcStartDt:           tag(ch1, 'fcStartDt') || '',
    addr:                tag(ch1, 'addr') || tag(xml, 'addr'),
    telNo:               tag(ch1, 'telNo') || '',
    homepageUrl:         tag(ch1, 'homepageUrl') || undefined,
    bizRgNo:             tag(ch1, 'bizRgNo') || tag(xml, 'bizRgNo') || '',
    trademarkRegistered: tag(ch1, 'trdmarkRgsYn') === 'Y',
  }

  // ── 2장. 가맹사업자의 부담 ──
  const ch2 = tag(xml, 'ch2') || xml
  const royaltyStr = tag(ch2, 'royaltyType') || tag(xml, 'royaltyType')
  let royaltyType: 'fixed' | 'percentage' | 'none' = 'none'
  if (royaltyStr === 'fixed' || royaltyStr === '고정') royaltyType = 'fixed'
  else if (royaltyStr === 'percentage' || royaltyStr === '매출비례' || royaltyStr === '비율') royaltyType = 'percentage'
  const ch2_costs = {
    franchiseFee:     toMan(tag(ch2, 'jngFee') || tag(xml, 'jngFee')),
    deposit:          toMan(tag(ch2, 'dpst') || tag(xml, 'dpst')),
    educationFee:     toMan(tag(ch2, 'eduFee') || tag(xml, 'eduFee')),
    interiorFee:      toMan(tag(ch2, 'intrFee') || tag(xml, 'intrFee')),
    interiorPerPyeong: toMan(tag(ch2, 'intrFeePerPyeong') || '0'),
    otherFees:        toMan(tag(ch2, 'etcFee') || tag(xml, 'etcFee')),
    standardArea:     toMan(tag(ch2, 'stdArea') || tag(xml, 'stdArea')),
    royaltyType,
    royaltyValue:     toMan(tag(ch2, 'royaltyValue') || tag(xml, 'royaltyValue')),
  }

  // ── 3장. 영업활동 조건 ──
  const ch3 = tag(xml, 'ch3') || xml
  const ch3_terms = {
    contractYears:       parseInt(tag(ch3, 'ctrctYears') || tag(xml, 'ctrctYears') || '2', 10),
    renewalTerms:        tag(ch3, 'renewalTerms') || '협의',
    territoryProtection: tag(ch3, 'terrtProtect') || '미지정',
    hqAdvertisingShare:  parseInt(tag(ch3, 'hqAdvShare') || '100', 10),
    storeAdvertisingShare: parseFloat(tag(ch3, 'storeAdvShare') || '0'),
  }

  // ── 4장. 매장 현황 ──
  const ch4 = tag(xml, 'ch4') || xml
  const storeYearItems = allTags(ch4 || xml, 'storeYearItem')
  const byYear = storeYearItems.map((it) => ({
    year:              parseInt(tag(it, 'yr'), 10) || 0,
    totalStores:       toMan(tag(it, 'totalCnt')),
    newStores:         toMan(tag(it, 'newCnt')),
    closedStores:      toMan(tag(it, 'closedCnt')),
    contractTerminated: toMan(tag(it, 'ctrctTermCnt')),
    ownershipChanged:  toMan(tag(it, 'ownrChgCnt')),
  })).filter((r) => r.year > 2010)
  const ch4_stores = {
    totalStoresLastYear: byYear.at(-1)?.totalStores ?? toMan(tag(ch4, 'totalStoreCnt')),
    byYear,
  }

  // ── 5장. 매출 정보 ──
  const ch5 = tag(xml, 'ch5') || xml
  const regionItems = allTags(ch5 || xml, 'regionItem')
  const byRegion = regionItems.map((it) => ({
    region: tag(it, 'regionNm'),
    share:  parseFloat(tag(it, 'share')) || 0,
  })).filter((r) => r.region)
  const ch5_revenue = {
    averageMonthly:         toMan(tag(ch5, 'avgMonthlySales') || tag(xml, 'avgMonthlySales')),
    averageOperatingProfit: toMan(tag(ch5, 'avgOpProfit') || tag(xml, 'avgOpProfit')),
    byRegion: byRegion.length > 0 ? byRegion : [],
  }

  return {
    jngIfrmpSn,
    ch1_hqInfo,
    ch2_costs,
    ch3_terms,
    ch4_stores,
    ch5_revenue,
    meta: {
      registrationNumber: tag(xml, 'regNo') || tag(xml, 'jngIfrmpSn') || jngIfrmpSn,
      publishedAt:        tag(xml, 'pubDt') || tag(xml, 'regDt') || '',
    },
  }
}

export type { KftcDisclosureListItem, KftcDisclosureContent }
