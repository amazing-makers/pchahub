// DART API HTTP 클라이언트.
//
// 모든 요청에 crtfcKey(인증키)를 자동 주입한다.
// DART API는 GET 방식 + 쿼리스트링으로만 동작.

const BASE = 'https://opendart.fss.or.kr/api'

function apiKey(): string {
  const key = process.env.DART_API_KEY
  if (!key) throw new Error('DART_API_KEY is not set')
  return key
}

// ──────────────────────────────────────────────
// 공통 타입
// ──────────────────────────────────────────────

export interface DartListResponse<T> {
  status: string      // '000' = 정상
  message: string
  total_count: number
  page_no: number
  page_count: number
  list: T[]
}

export interface DartSingleResponse<T> extends Record<string, unknown> {
  status: string
  message: string
  corp_code?: string
  corp_name?: string
  data?: T[]
}

// ──────────────────────────────────────────────
// 기업 기본정보
// ──────────────────────────────────────────────

export interface DartCompanyInfo {
  corp_code: string
  corp_name: string
  corp_name_eng: string
  stock_name: string
  stock_code: string
  ceo_nm: string
  corp_cls: string       // Y=유가, K=코스닥, N=비상장 등
  jurir_no: string
  bizr_no: string
  adres: string
  hm_url: string
  ir_url: string
  phn_no: string
  fax_no: string
  induty_code: string
  est_dt: string         // 설립일 YYYYMMDD
  acc_mt: string         // 결산월 MM
}

export async function fetchCompanyInfo(corpCode: string): Promise<DartCompanyInfo> {
  const url = new URL(`${BASE}/company.json`)
  url.searchParams.set('crtfcKey', apiKey())
  url.searchParams.set('corp_code', corpCode)

  const res = await fetch(url.toString(), {
    next: { revalidate: 86400 }, // 24h
  })
  if (!res.ok) throw new Error(`DART company.json HTTP ${res.status}`)
  const data = await res.json() as Record<string, string>
  if (data.status !== '000') throw new Error(`DART company.json: ${data.message}`)
  return data as unknown as DartCompanyInfo
}

// ──────────────────────────────────────────────
// 공시목록 조회
// ──────────────────────────────────────────────

export interface DartDisclosureItem {
  corp_code: string
  corp_name: string
  stock_code: string
  corp_cls: string
  report_nm: string
  rcept_no: string
  flr_nm: string
  rcept_dt: string       // YYYYMMDD
  rm: string
}

export async function fetchDisclosureList(params: {
  corpCode?: string
  bgDt?: string          // YYYYMMDD
  edDt?: string
  lastReprtAt?: 'Y' | 'N'
  pblntfTy?: string      // A=정기공시, B=주요사항 등
  pageNo?: number
  pageCount?: number
}): Promise<DartListResponse<DartDisclosureItem>> {
  const url = new URL(`${BASE}/list.json`)
  url.searchParams.set('crtfcKey', apiKey())
  if (params.corpCode) url.searchParams.set('corp_code', params.corpCode)
  if (params.bgDt) url.searchParams.set('bgdt', params.bgDt)
  if (params.edDt) url.searchParams.set('eddt', params.edDt)
  if (params.lastReprtAt) url.searchParams.set('last_reprt_at', params.lastReprtAt)
  if (params.pblntfTy) url.searchParams.set('pblntf_ty', params.pblntfTy)
  url.searchParams.set('page_no', String(params.pageNo ?? 1))
  url.searchParams.set('page_count', String(params.pageCount ?? 40))

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`DART list.json HTTP ${res.status}`)
  const data = await res.json()
  if (data.status !== '000') throw new Error(`DART list.json: ${data.message}`)
  return data
}

// ──────────────────────────────────────────────
// 단일회사 전체 재무제표
// ──────────────────────────────────────────────

export interface DartFinancialItem {
  rcept_no: string
  reprt_code: string
  bsns_year: string
  corp_code: string
  sj_div: string         // BS=재무상태표, IS=손익계산서, CF=현금흐름표 등
  sj_nm: string
  account_id: string
  account_nm: string
  account_detail: string
  thstrm_nm: string
  thstrm_amount: string
  frmtrm_nm: string
  frmtrm_amount: string
  ord: string
  currency: string
}

export async function fetchFinancialStatement(params: {
  corpCode: string
  bsnsYear: string       // YYYY
  reprtCode: '11011' | '11012' | '11013' | '11014'  // 사업보고서·반기·1분기·3분기
  fsDiv?: 'OFS' | 'CFS'  // 개별/연결 (default: OFS)
}): Promise<DartSingleResponse<DartFinancialItem>> {
  const url = new URL(`${BASE}/fnlttSinglAcnt.json`)
  url.searchParams.set('crtfcKey', apiKey())
  url.searchParams.set('corp_code', params.corpCode)
  url.searchParams.set('bsns_year', params.bsnsYear)
  url.searchParams.set('reprt_code', params.reprtCode)
  url.searchParams.set('fs_div', params.fsDiv ?? 'OFS')

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } })
  if (!res.ok) throw new Error(`DART fnlttSinglAcnt.json HTTP ${res.status}`)
  const data = await res.json()
  if (data.status !== '000') throw new Error(`DART fnlttSinglAcnt: ${data.message}`)
  return data
}

// ──────────────────────────────────────────────
// 다중회사 주요계정
// ──────────────────────────────────────────────

export interface DartMultiAccountItem {
  rcept_no: string
  corp_code: string
  corp_name: string
  stock_code: string
  reprt_code: string
  bsns_year: string
  fs_div: string
  fs_nm: string
  sj_div: string
  sj_nm: string
  account_id: string
  account_nm: string
  thstrm_nm: string
  thstrm_amount: string
  frmtrm_nm: string
  frmtrm_amount: string
  bfefrmtrm_nm: string
  bfefrmtrm_amount: string
  ord: string
  currency: string
}

export async function fetchMultiFinancial(params: {
  corpCode: string       // 쉼표로 구분 최대 100개
  bsnsYear: string
  reprtCode: '11011' | '11012' | '11013' | '11014'
  fsDiv?: 'OFS' | 'CFS'
}): Promise<DartSingleResponse<DartMultiAccountItem>> {
  const url = new URL(`${BASE}/fnlttMultiAcnt.json`)
  url.searchParams.set('crtfcKey', apiKey())
  url.searchParams.set('corp_code', params.corpCode)
  url.searchParams.set('bsns_year', params.bsnsYear)
  url.searchParams.set('reprt_code', params.reprtCode)
  url.searchParams.set('fs_div', params.fsDiv ?? 'OFS')

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } })
  if (!res.ok) throw new Error(`DART fnlttMultiAcnt.json HTTP ${res.status}`)
  const data = await res.json()
  if (data.status !== '000') throw new Error(`DART fnlttMultiAcnt: ${data.message}`)
  return data
}
