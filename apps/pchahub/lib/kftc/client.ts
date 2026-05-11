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
// XML 파싱 — 정식 fast-xml-parser는 Supabase 연결 시점에 추가.
// 지금은 throw하는 placeholder. (런타임에는 호출되지 않음 — KFTC_API_KEY가
// 없으면 client 함수 진입 시점에 throw되어 polled 페이지가 mock으로 fallback)
// ============================================================

function parseListXml(_xml: string): KftcDisclosureListResponse {
  // TODO(amakers): fast-xml-parser로 <item> 노드 추출 → KftcDisclosureListItem[] 변환
  throw new Error('KFTC XML parser 미구현 — Supabase 연결 시점에 fast-xml-parser 추가 예정')
}

function parseTitleXml(_xml: string, jngIfrmpSn: DisclosureSerialNumber): KftcDisclosureTOC {
  throw new Error('KFTC XML parser 미구현')
}

function parseContentXml(_xml: string, jngIfrmpSn: DisclosureSerialNumber): KftcDisclosureContent {
  throw new Error('KFTC XML parser 미구현')
}

export type { KftcDisclosureListItem, KftcDisclosureContent }
