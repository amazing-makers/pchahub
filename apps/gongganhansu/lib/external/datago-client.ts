// 공공데이터포털(data.go.kr) JSON API 클라이언트 (gongganhansu용).
// bestplace / themyungdang과 동일 패턴.

interface FetchOptions {
  revalidate?: number
}

function getServiceKey(): string {
  const key = process.env.DATAGO_API_KEY ?? process.env.KFTC_API_KEY
  if (!key) throw new Error('DATAGO_API_KEY 환경변수 미설정')
  return key
}

export interface DataGoKrEnvelope<TItem> {
  header: { resultCode: string; resultMsg: string }
  body: { items: TItem[]; numOfRows: number; pageNo: number; totalCount: number }
}

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
  if (!res.ok) throw new Error(`data.go.kr API 실패: ${res.status} (${fullUrl})`)
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
      body: { items: raw as TItem[], numOfRows: raw.length, pageNo: 1, totalCount: raw.length },
    }
  }
  throw new Error(`응답 구조 인식 불가 (${endpointPath})`)
}
