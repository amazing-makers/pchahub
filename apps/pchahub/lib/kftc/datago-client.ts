// 공공데이터포털(data.go.kr) KFTC API 클라이언트.
//
// KFTC(공정거래위원회) 가맹정보 API는 _type=json 파라미터를 무시하고
// 항상 EgovMap XML 형식으로 응답한다. 이 모듈은 XML을 파싱해
// 일관된 DataGoKrEnvelope<TItem>으로 변환한다.
//
//   <EgovMap>
//     <resultCode>00</resultCode>
//     <resultMsg>NORMAL SERVICE</resultMsg>
//     <numOfRows>100</numOfRows>
//     <pageNo>1</pageNo>
//     <totalCount>11834</totalCount>
//     <items>
//       <item><yr>2024</yr><brandNm>...</brandNm>...</item>
//       ...
//     </items>
//   </EgovMap>

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
 * KFTC API를 호출하고 DataGoKrEnvelope<TItem>으로 반환.
 * XML 응답을 자동 파싱 (fast-xml-parser 불필요 — 자체 경량 파서).
 *
 * @param endpointPath  예: 'FftcBrandFrcsStatsService/getBrandFrcsStats'
 * @param params        쿼리 파라미터 (serviceKey는 자동 추가)
 */
export async function callDataGoKrJson<TItem>(
  endpointPath: string,
  params: Record<string, string | number | undefined> = {},
): Promise<DataGoKrEnvelope<TItem>> {
  const serviceKey = getServiceKey()
  const url = new URL(`${SHARED_BASE}/${endpointPath.replace(/^\//, '')}`)
  url.searchParams.set('serviceKey', serviceKey)
  url.searchParams.set('pageNo', String(params.pageNo ?? 1))
  url.searchParams.set('numOfRows', String(params.numOfRows ?? 100))
  for (const [k, v] of Object.entries(params)) {
    if (k === 'pageNo' || k === 'numOfRows') continue
    if (v === undefined) continue
    url.searchParams.set(k, String(v))
  }

  const res = await fetch(url.toString(), {
    // 가맹 데이터는 연 단위 갱신 — 24시간 캐시
    next: { revalidate: 86_400 },
  })
  if (!res.ok) {
    throw new Error(`data.go.kr API 실패: ${res.status} ${res.statusText} (${endpointPath})`)
  }

  const text = await res.text()

  // JSON 응답 (일부 신형 API는 JSON 지원)
  if (text.trimStart().startsWith('{') || text.trimStart().startsWith('[')) {
    try {
      const raw = JSON.parse(text)
      return normalizeJsonEnvelope<TItem>(raw, endpointPath)
    } catch {
      // fall through to XML parse
    }
  }

  // XML 응답 (KFTC 기본 포맷)
  return parseEgovMapXml<TItem>(text, endpointPath)
}

// ─────────────────────────────────────────────────────────
// XML 파서 (EgovMap 포맷 전용 경량 구현)
// ─────────────────────────────────────────────────────────

/** XML/HTML 기본 엔터티 디코딩 (&amp; &lt; &gt; &quot; &apos; &nbsp;) */
function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

function xmlTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))
  return m?.[1]?.trim() ?? ''
}

function parseEgovMapXml<TItem>(xml: string, endpointPath: string): DataGoKrEnvelope<TItem> {
  const resultCode = xmlTag(xml, 'resultCode')
  const resultMsg = xmlTag(xml, 'resultMsg')

  if (resultCode && resultCode !== '00') {
    throw new Error(`KFTC API 오류 ${resultCode}: ${resultMsg} (${endpointPath})`)
  }

  const numOfRows = parseInt(xmlTag(xml, 'numOfRows') || '0', 10)
  const pageNo = parseInt(xmlTag(xml, 'pageNo') || '1', 10)
  const totalCount = parseInt(xmlTag(xml, 'totalCount') || '0', 10)

  // <items>...</items> 전체 추출
  const itemsBlock = xmlTag(xml, 'items')

  // matchAll로 각 <item> 내부 콘텐츠만 추출 (outer tag는 제외)
  const itemContentRe = /<item>([\s\S]*?)<\/item>/g
  const items: TItem[] = []
  for (const match of itemsBlock.matchAll(itemContentRe)) {
    const inner = match[1] ?? ''
    const obj: Record<string, unknown> = {}
    // 각 <key>value</key> 쌍 추출 (HTML 엔터티 디코딩 포함)
    const fieldRe = /<([a-zA-Z][a-zA-Z0-9_]*)>([^<]*)<\/\1>/g
    for (const fieldMatch of inner.matchAll(fieldRe)) {
      const key = fieldMatch[1]
      const rawVal = fieldMatch[2] ?? ''
      if (!key) continue
      const val = decodeXmlEntities(rawVal.trim())
      // 순수 숫자면 number, 아니면 string
      const num = Number(val)
      obj[key] = val !== '' && !isNaN(num) ? num : val
    }
    items.push(obj as TItem)
  }

  return {
    header: { resultCode: resultCode || '00', resultMsg },
    body: { items, numOfRows: numOfRows || items.length, pageNo, totalCount: totalCount || items.length },
  }
}

// ─────────────────────────────────────────────────────────
// JSON 응답 정규화 (일부 신형 API 대응)
// ─────────────────────────────────────────────────────────

function normalizeJsonEnvelope<TItem>(raw: unknown, endpointPath: string): DataGoKrEnvelope<TItem> {
  if (!raw || typeof raw !== 'object') {
    throw new Error(`data.go.kr 응답이 객체가 아님 (${endpointPath})`)
  }

  // { response: { header, body } }
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

  // 바로 배열
  if (Array.isArray(raw)) {
    return {
      header: { resultCode: '00', resultMsg: 'NORMAL_CODE' },
      body: { items: raw as TItem[], numOfRows: raw.length, pageNo: 1, totalCount: raw.length },
    }
  }

  throw new Error(`data.go.kr 응답 구조 인식 불가 (${endpointPath})`)
}
