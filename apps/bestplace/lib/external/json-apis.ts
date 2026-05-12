// bestplace 외부 JSON API fetcher들.
//
// 1. 소상공인시장진흥공단 — 상권 영역 (SosanginCommerceArea)
// 2. 국세청 사업자등록 진위확인 (BizRegLookup, POST)
//    - endpoint: https://api.odcloud.kr/api/nts-businessman/v1/status
//    - key: NTS_API_KEY (serviceKey query param)

import { callDataGoKrJson } from './datago-client'

// ============================================================
// 1. 소상공인시장진흥공단 — 상권 영역
// ============================================================

export interface SosanginCommerceAreaItem {
  /** 상권코드 */
  trarNo: string
  /** 상권명 */
  trarNm: string
  /** 상권유형 (지정상권/주요상권 등) */
  trarTypeCd?: string
  /** 시도명 */
  ctprvnNm?: string
  /** 시군구명 */
  signguNm?: string
  /** 면적 (㎡) */
  ar?: number
}

export async function fetchCommerceAreas(params: {
  ctprvnCd?: string
  pageNo?: number
  numOfRows?: number
}) {
  return callDataGoKrJson<SosanginCommerceAreaItem>(
    'https://apis.data.go.kr/B553077/api/open/sdsc2/commercialDistrict',
    {
      ctprvnCd: params.ctprvnCd,
      pageNo: params.pageNo,
      numOfRows: params.numOfRows ?? 100,
    },
  )
}

// ============================================================
// 2. 국세청 사업자등록 진위확인 (POST)
//    api.odcloud.kr/api/nts-businessman/v1/status
//    key 위치: serviceKey query param (GET 방식과 동일)
// ============================================================

export interface BizRegStatus {
  /** 사업자등록번호 (하이픈 없이) */
  b_no: string
  /** 처리 코드: "01"=유효, "02"=없음, "03"=폐업 */
  b_stt_cd: string
  /** 처리 메시지 */
  b_stt: string
  /** 과세 유형 코드 */
  tax_type_cd?: string
  /** 과세 유형명 */
  tax_type?: string
  /** 폐업일 (yyyymmdd, 폐업 시만) */
  end_dt?: string
  /** 최근 수정일 */
  utcc_yn?: string
  /** 처리 결과 코드 */
  request_param?: string
  status?: {
    b_no: string
    b_stt: string
    b_stt_cd: string
    tax_type: string
    tax_type_cd: string
    end_dt: string
    utcc_yn: string
    tax_type_change_dt?: string
    invoice_apply_dt?: string
    rbf_tax_type?: string
    rbf_tax_type_cd?: string
  }
}

export interface BizRegLookupResponse {
  status_code: string
  match_cnt: number
  request_cnt: number
  data: BizRegStatus[]
}

/**
 * 사업자등록번호 진위확인 (최대 100건 일괄 조회).
 * NTS_API_KEY 환경변수 필요.
 * key 없으면 null 반환.
 */
export async function fetchBizRegStatus(
  bizNumbers: string[],
): Promise<BizRegLookupResponse | null> {
  const key = process.env.NTS_API_KEY
  if (!key || bizNumbers.length === 0) return null

  const url = new URL('https://api.odcloud.kr/api/nts-businessman/v1/status')
  url.searchParams.set('serviceKey', key)

  try {
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ businesses: bizNumbers.map((b_no) => ({ b_no })) }),
      next: { revalidate: 3_600 }, // 사업자 상태는 1시간 캐시
    })
    if (!res.ok) {
      console.error('[bestplace] BizRegLookup 실패:', res.status)
      return null
    }
    return (await res.json()) as BizRegLookupResponse
  } catch (err) {
    console.error('[bestplace] BizRegLookup 오류:', (err as Error).message)
    return null
  }
}
