// VWorld (국토교통부 공간정보 오픈플랫폼) API 클라이언트.
//
// 주요상권(LT_C_DGMAINBIZ) GIS 레이어 조회에 사용.
// 발급: https://www.vworld.kr → API Key 신청
// 환경변수: VWORLD_API_KEY
//
// 서버사이드: GetFeature (WFS) — 상권 경계·속성 데이터
// 클라이언트사이드: 타일 지도 표시 시 NEXT_PUBLIC_VWORLD_API_KEY 사용

const BASE = 'https://api.vworld.kr/req/data'

function getKey(): string {
  const key = process.env.VWORLD_API_KEY
  if (!key) throw new Error('VWORLD_API_KEY 환경변수가 설정되지 않았습니다.')
  return key
}

export function hasVWorldKey(): boolean {
  return Boolean(process.env.VWORLD_API_KEY)
}

// ──────────────────────────────────────────────
// 주요 상권 레이어 (LT_C_DGMAINBIZ)
// ──────────────────────────────────────────────

export interface VWorldMainBizFeature {
  /** 상권 번호 */
  no: string
  /** 상권명 */
  biz_nm: string
  /** 시도명 */
  sido_nm: string
  /** 시군구명 */
  sgg_nm: string
  /** 읍면동명 */
  emd_nm: string
  /** 상권 면적 (제곱미터) */
  biz_ar: string
  /** 상권 유형 */
  biz_type: string
}

export interface VWorldFeatureCollection {
  type: 'FeatureCollection'
  totalCount: number
  page: { total: number; current: number; size: number }
  features: Array<{
    type: 'Feature'
    id: string
    geometry: {
      type: string
      coordinates: unknown
    }
    properties: VWorldMainBizFeature
  }>
}

/**
 * 좌표 기준 주변 주요 상권 조회.
 *
 * @param lng 경도 (WGS84)
 * @param lat 위도 (WGS84)
 * @param size 결과 개수 (기본 10)
 */
export async function fetchNearbyMainBiz(params: {
  lng: number
  lat: number
  size?: number
  page?: number
}): Promise<VWorldFeatureCollection> {
  const key = getKey()
  const url = new URL(BASE)
  url.searchParams.set('service', 'data')
  url.searchParams.set('version', '2.0')
  url.searchParams.set('request', 'GetFeature')
  url.searchParams.set('key', key)
  url.searchParams.set('format', 'json')
  url.searchParams.set('errorformat', 'json')
  url.searchParams.set('size', String(params.size ?? 10))
  url.searchParams.set('page', String(params.page ?? 1))
  url.searchParams.set('data', 'LT_C_DGMAINBIZ')
  url.searchParams.set('geomfilter', `POINT(${params.lng} ${params.lat})`)
  url.searchParams.set('attribute', 'true')
  url.searchParams.set('crs', 'EPSG:4326')

  const res = await fetch(url.toString(), { next: { revalidate: 86_400 } })
  if (!res.ok) throw new Error(`VWorld API 실패: ${res.status}`)
  const raw = await res.json()

  // VWorld response: { response: { status, result: { featureCollection: ... } } }
  const fc = raw?.response?.result?.featureCollection
  if (!fc) throw new Error('VWorld 응답 구조 인식 불가')
  return fc as VWorldFeatureCollection
}

/**
 * 상권명으로 주요 상권 속성 조회.
 *
 * @param bizNm 상권명 (부분 일치)
 */
export async function fetchMainBizByName(params: {
  bizNm: string
  size?: number
}): Promise<VWorldFeatureCollection> {
  const key = getKey()
  const url = new URL(BASE)
  url.searchParams.set('service', 'data')
  url.searchParams.set('version', '2.0')
  url.searchParams.set('request', 'GetFeature')
  url.searchParams.set('key', key)
  url.searchParams.set('format', 'json')
  url.searchParams.set('errorformat', 'json')
  url.searchParams.set('size', String(params.size ?? 20))
  url.searchParams.set('page', '1')
  url.searchParams.set('data', 'LT_C_DGMAINBIZ')
  url.searchParams.set('attrfilter', `biz_nm:like:${params.bizNm}`)
  url.searchParams.set('attribute', 'true')
  url.searchParams.set('crs', 'EPSG:4326')

  const res = await fetch(url.toString(), { next: { revalidate: 86_400 } })
  if (!res.ok) throw new Error(`VWorld API 실패: ${res.status}`)
  const raw = await res.json()
  const fc = raw?.response?.result?.featureCollection
  if (!fc) throw new Error('VWorld 응답 구조 인식 불가')
  return fc as VWorldFeatureCollection
}
