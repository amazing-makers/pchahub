// 공공데이터포털(data.go.kr) JSON API 표준 클라이언트.
//
// data.go.kr의 모든 REST API는 동일한 envelope 형식을 따른다:
//
//   {
//     "response": {
//       "header": { "resultCode": "00", "resultMsg": "NORMAL_CODE" },
//       "body": {
//         "items": { "item": [...] }  또는 [...]
//         "numOfRows": 10,
//         "pageNo": 1,
//         "totalCount": 1500
//       }
//     }
//   }
//
// 또는 응답 포맷이 XML이면 위 구조의 XML 버전.
// 일부 페어데이터 API는 envelope 없이 바로 items 배열을 반환하기도 한다.
//
// 모든 KFTC JSON API는 이 클라이언트를 통해 호출 → 일관된 에러 처리,
// 표준 페이지네이션, fetch 캐시 정책 (24시간) 적용.

const SHARED_BASE = 'https://apis.data.go.kr/1130000'

function getServiceKey(): string {
  const key = process.env.KFTC_API_KEY
  if (!key) {
    throw new Error('KFTC_API_KEY 환경변수가 설정되지 않았습니다.')
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
 * data.go.kr 표준 envelope를 가진 응답을 정규화해서 반환.
 *
 * @param endpointPath FftcIndutyBrandStatsService 같은 경로 (앞에 / 없이)
 * @param params 쿼리 파라미터 (serviceKey는 자동 추가)
 */
export async function callDataGoKrJson<TItem>(
  endpointPath: string,
  params: Record<string, string | number | undefined> = {},
): Promise<DataGoKrEnvelope<TItem>> {
  const serviceKey = getServiceKey()
  const url = new URL(`${SHARED_BASE}/${endpointPath.replace(/^\//, '')}`)
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
    // 분기마다 갱신되는 가맹 데이터 — 24시간 캐시 충분
    next: { revalidate: 86_400 },
  })
  if (!res.ok) {
    throw new Error(`data.go.kr API 실패: ${res.status} ${res.statusText} (${endpointPath})`)
  }

  // data.go.kr은 응답을 두 가지 형태로 줄 수 있음
  const raw = await res.json()
  return normalizeEnvelope<TItem>(raw, endpointPath)
}

function normalizeEnvelope<TItem>(raw: unknown, endpointPath: string): DataGoKrEnvelope<TItem> {
  if (!raw || typeof raw !== 'object') {
    throw new Error(`data.go.kr 응답이 객체가 아님 (${endpointPath})`)
  }

  // case 1: { response: { header, body } } — 표준 envelope
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

  // case 2: 페어데이터 — 바로 items 배열
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

  throw new Error(`data.go.kr 응답 구조 인식 불가 (${endpointPath})`)
}
