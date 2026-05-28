// 공공데이터포털(data.go.kr) JSON API 표준 클라이언트.
//
// themyungdang은 부동산 통계(REB) + 실거래가(국토부) + 상권 정보(소상공인진흥공단)를
// 통합한다. 모든 외부 API는 이 클라이언트를 통해 호출.
//
// 주의: REB(한국부동산원)은 data.go.kr이 아닌 자체 도메인을 사용한다.
// REB 호출은 별도 함수 callRebApi 사용.

interface FetchOptions {
  /** 캐시 TTL (초). 기본 24시간. */
  revalidate?: number
}

function getServiceKey(): string {
  const key = process.env.DATAGO_API_KEY ?? process.env.KFTC_API_KEY
  if (!key) {
    throw new Error('DATAGO_API_KEY 환경변수가 설정되지 않았습니다.')
  }
  return key
}

export interface DataGoKrEnvelope<TItem> {
  header: {
    resultCode: string
    resultMsg: string
  }
  body: {
    items: TItem[]
    numOfRows: number
    pageNo: number
    totalCount: number
  }
}

/**
 * data.go.kr 표준 envelope JSON API 호출.
 *
 * @param fullUrl 전체 URL (https://apis.data.go.kr/...) 또는 상대경로
 * @param params 쿼리 파라미터 (serviceKey/type 자동 추가)
 */
export async function callDataGoKrJson<TItem>(
  fullUrl: string,
  params: Record<string, string | number | undefined> = {},
  opts: FetchOptions = {},
): Promise<DataGoKrEnvelope<TItem>> {
  const serviceKey = getServiceKey()
  const url = new URL(
    fullUrl.startsWith('http') ? fullUrl : `https://apis.data.go.kr/${fullUrl.replace(/^\//, '')}`,
  )
  url.searchParams.set('serviceKey', serviceKey)
  url.searchParams.set('type', 'json')
  url.searchParams.set('pageNo', String(params.pageNo ?? 1))
  url.searchParams.set('numOfRows', String(params.numOfRows ?? 100))
  for (const [k, v] of Object.entries(params)) {
    if (k === 'pageNo' || k === 'numOfRows') continue
    if (v === undefined) continue
    url.searchParams.set(k, String(v))
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: opts.revalidate ?? 86_400 },
  })
  if (!res.ok) {
    throw new Error(`data.go.kr API 실패: ${res.status} ${res.statusText} (${fullUrl})`)
  }
  return normalizeEnvelope<TItem>(await res.json(), fullUrl)
}

function normalizeEnvelope<TItem>(raw: unknown, endpointPath: string): DataGoKrEnvelope<TItem> {
  if (!raw || typeof raw !== 'object') {
    throw new Error(`응답이 객체가 아님 (${endpointPath})`)
  }
  const r = (raw as { response?: unknown }).response
  if (r && typeof r === 'object') {
    const env = r as {
      header?: { resultCode?: string; resultMsg?: string }
      body?: {
        items?: { item?: TItem[] } | TItem[]
        numOfRows?: number
        pageNo?: number
        totalCount?: number
      }
    }
    const items = Array.isArray(env.body?.items)
      ? env.body.items
      : (env.body?.items?.item ?? [])
    return {
      header: {
        resultCode: env.header?.resultCode ?? '00',
        resultMsg: env.header?.resultMsg ?? 'NORMAL_CODE',
      },
      body: {
        items,
        numOfRows: env.body?.numOfRows ?? items.length,
        pageNo: env.body?.pageNo ?? 1,
        totalCount: env.body?.totalCount ?? items.length,
      },
    }
  }
  if (Array.isArray(raw)) {
    return {
      header: { resultCode: '00', resultMsg: 'NORMAL_CODE' },
      body: {
        items: raw as TItem[],
        numOfRows: raw.length,
        pageNo: 1,
        totalCount: raw.length,
      },
    }
  }
  throw new Error(`응답 구조 인식 불가 (${endpointPath})`)
}

// ============================================================
// 한국부동산원 (REB) — data.go.kr이 아닌 자체 도메인
// ============================================================

const REB_BASE = 'https://www.reb.or.kr/r-one/openapi'

function getRebKey(): string {
  // REB는 reb.or.kr R-ONE 포털에서 별도 발급.
  // data.go.kr 키는 REB API에서 작동하지 않음.
  const key = process.env.REB_API_KEY
  if (!key) {
    throw new Error('REB_API_KEY가 설정되지 않았습니다. https://www.reb.or.kr/r-one/openapi/openApiApply.do 에서 발급하세요.')
  }
  return key
}

/**
 * 한국부동산원 (REB) 통계 API 호출.
 * URL 형식: https://www.reb.or.kr/r-one/openapi/{Service}.do?KEY={key}&...
 */
export async function callRebApi<TItem>(
  serviceName: string,
  params: Record<string, string | number | undefined> = {},
  opts: FetchOptions = {},
): Promise<TItem[]> {
  const key = getRebKey()
  const url = new URL(`${REB_BASE}/${serviceName}.do`)
  url.searchParams.set('KEY', key)
  url.searchParams.set('Type', 'json')
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue
    url.searchParams.set(k, String(v))
  }
  const res = await fetch(url.toString(), {
    next: { revalidate: opts.revalidate ?? 86_400 },
  })
  if (!res.ok) {
    throw new Error(`REB API 실패: ${res.status} (${serviceName})`)
  }
  const raw = await res.json()
  // REB는 별도 envelope 형태 — 일반적으로 { SttsApiTblData: [{ head: [...], row: [...] }] }
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, { row?: TItem[] }[]>
    const first = Object.values(r)[0]
    if (Array.isArray(first)) {
      // 보통 [{ head: [...] }, { row: [...] }] 구조
      const rowsBlock = first.find((b) => 'row' in b)
      if (rowsBlock?.row) return rowsBlock.row
    }
  }
  return []
}
