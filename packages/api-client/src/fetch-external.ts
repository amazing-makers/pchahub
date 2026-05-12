// 공공데이터포털(data.go.kr) 범용 fetcher.
//
// 요구사항:
//   - serviceKey URL param 자동 추가 (로그/에러엔 *** 마스킹)
//   - data.go.kr 표준 envelope 자동 정규화
//   - 4xx/5xx → { ok: false } 반환 (호출자가 mock fallback)
//   - AbortController 타임아웃 (기본 10s) + 자동 1회 재시도

export interface FetchOpts {
  /** 전체 엔드포인트 URL (https://apis.data.go.kr/...) */
  endpoint: string
  /** API 서비스 키 — 절대 로그에 출력 금지 */
  key: string
  /** 추가 쿼리 파라미터 */
  query?: Record<string, string | number | undefined>
  /** 응답 포맷. 기본 'json' */
  format?: 'json' | 'xml' | 'auto'
  /** 타임아웃 (ms). 기본 10_000 */
  timeoutMs?: number
  /** Next.js ISR revalidate (초). 기본 86_400 (24h) */
  revalidate?: number
}

export type FetchResult<T> = { ok: true; data: T } | { ok: false; error: string }

/** URL에서 serviceKey / KEY 값을 *** 로 치환한 문자열 반환. */
function maskUrl(url: URL): string {
  const copy = new URL(url.toString())
  if (copy.searchParams.has('serviceKey')) copy.searchParams.set('serviceKey', '***')
  if (copy.searchParams.has('KEY')) copy.searchParams.set('KEY', '***')
  return copy.toString()
}

async function doFetch(url: URL, timeoutMs: number, revalidate: number): Promise<Response> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    return await fetch(url.toString(), {
      signal: ctrl.signal,
      next: { revalidate },
    })
  } finally {
    clearTimeout(timer)
  }
}

/** data.go.kr 표준 envelope → 정규화된 객체 반환. */
function normalizeEnvelope<T>(raw: unknown): T {
  if (!raw || typeof raw !== 'object') return raw as T

  // 표준 envelope: { response: { header, body } }
  const r = (raw as Record<string, unknown>).response
  if (r && typeof r === 'object') {
    const env = r as {
      header?: { resultCode?: string; resultMsg?: string }
      body?: {
        items?: { item?: unknown[] } | unknown[]
        numOfRows?: number
        pageNo?: number
        totalCount?: number
      }
    }
    const rawItems = env.body?.items
    const items: unknown[] = Array.isArray(rawItems)
      ? rawItems
      : ((rawItems as { item?: unknown[] } | undefined)?.item ?? [])
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
    } as T
  }

  // 페어데이터 — 바로 배열
  if (Array.isArray(raw)) {
    return {
      header: { resultCode: '00', resultMsg: 'NORMAL_CODE' },
      body: { items: raw, numOfRows: raw.length, pageNo: 1, totalCount: raw.length },
    } as T
  }

  return raw as T
}

/**
 * 공공데이터포털 API 호출.
 * 키 없이 빌드 가능 — .env 미설정이면 호출 전에 hasKey() 체크 후 건너뜀.
 */
export async function fetchExternal<T>(opts: FetchOpts): Promise<FetchResult<T>> {
  const {
    endpoint,
    key,
    query = {},
    format = 'json',
    timeoutMs = 10_000,
    revalidate = 86_400,
  } = opts

  const url = new URL(endpoint)
  url.searchParams.set('serviceKey', key)
  if (format !== 'xml') url.searchParams.set('type', 'json')
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined) continue
    url.searchParams.set(k, String(v))
  }

  const maskedUrl = maskUrl(url)

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await doFetch(url, timeoutMs, revalidate)

      if (!res.ok) {
        if (attempt === 0) {
          console.warn(`[api-client] HTTP ${res.status} — 재시도 (${maskedUrl})`)
          continue
        }
        return { ok: false, error: `HTTP ${res.status} (${maskedUrl})` }
      }

      let raw: unknown
      const contentType = res.headers.get('content-type') ?? ''
      if (format === 'xml' || (format === 'auto' && contentType.includes('xml'))) {
        raw = await res.text()
      } else {
        raw = await res.json()
      }

      return { ok: true, data: normalizeEnvelope<T>(raw) }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (attempt === 0) {
        console.warn(`[api-client] 오류 — 재시도 (${maskedUrl}):`, msg)
        continue
      }
      return { ok: false, error: msg }
    }
  }

  return { ok: false, error: `최대 재시도 초과 (${maskedUrl})` }
}
