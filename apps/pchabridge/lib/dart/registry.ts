// pchabridge DART(금융감독원 전자공시시스템) API 레지스트리.
//
// 프랜차이즈 본사의 재무 공시 데이터를 활용해 투자 라운드·M&A 딜플로우에
// 실질적인 재무 근거를 제공한다.
//
// 발급: https://opendart.fss.or.kr → 인증키 신청/관리
// 환경변수: DART_API_KEY

export type DartEndpointKey =
  | 'CompanyInfo'         // 기업 기본정보
  | 'DisclosureList'      // 공시목록 조회
  | 'FinancialStatement'  // 단일회사 전체 재무제표
  | 'MultiFinancial'      // 다중회사 주요계정
  | 'CorpCode'            // 고유번호 전체 목록 (zip)
  | 'DividendInfo'        // 배당 정보
  | 'MajorHolder'         // 최대주주 현황
  | 'ExecutiveInfo'       // 임원 현황

export interface DartEndpointDef {
  key: DartEndpointKey
  name: string
  path: string
  format: 'JSON' | 'XML' | 'ZIP'
  priority: 'critical' | 'useful' | 'supplementary'
  fillsFields: string[]
  status: 'configured' | 'not-applied'
}

const BASE = 'https://opendart.fss.or.kr/api'

export const ENDPOINTS: DartEndpointDef[] = [
  {
    key: 'CompanyInfo',
    name: '기업 기본정보',
    path: `${BASE}/company.json`,
    format: 'JSON',
    priority: 'critical',
    fillsFields: [
      'MockBrand.corpNm (법인명)',
      'MockBrand 창업연도·대표자·업종',
      'M&A 매물의 본사 정보 검증',
    ],
    status: 'configured',
  },
  {
    key: 'DisclosureList',
    name: '공시목록 조회',
    path: `${BASE}/list.json`,
    format: 'JSON',
    priority: 'critical',
    fillsFields: [
      '투자 라운드 대상 기업의 최신 공시 여부',
      '딜플로우 "공시 없음" 위험 플래그',
    ],
    status: 'configured',
  },
  {
    key: 'FinancialStatement',
    name: '단일회사 전체 재무제표',
    path: `${BASE}/fnlttSinglAcnt.json`,
    format: 'JSON',
    priority: 'critical',
    fillsFields: [
      'MockRound.annualRevenue (연 매출)',
      'MockMaListing.annualRevenue 검증',
      '투자 라운드 재무 지표 (매출·영업이익·부채비율)',
    ],
    status: 'configured',
  },
  {
    key: 'MultiFinancial',
    name: '다중회사 주요계정',
    path: `${BASE}/fnlttMultiAcnt.json`,
    format: 'JSON',
    priority: 'useful',
    fillsFields: [
      '딜플로우 리포트 — 섹터별 재무 비교',
      'M&A 파이프라인 — 복수 기업 일괄 조회',
    ],
    status: 'configured',
  },
  {
    key: 'CorpCode',
    name: '고유번호 전체 목록',
    path: `${BASE}/corpCode.xml`,
    format: 'ZIP',
    priority: 'useful',
    fillsFields: [
      '브랜드명 → DART corp_code 매핑 캐시',
      '신규 상장 기업 감지',
    ],
    status: 'configured',
  },
  {
    key: 'DividendInfo',
    name: '배당 정보',
    path: `${BASE}/alotMatter.json`,
    format: 'JSON',
    priority: 'supplementary',
    fillsFields: ['투자 수익률 보조 지표'],
    status: 'configured',
  },
  {
    key: 'MajorHolder',
    name: '최대주주 현황',
    path: `${BASE}/hyslrSttus.json`,
    format: 'JSON',
    priority: 'supplementary',
    fillsFields: ['M&A 딜 — 지배구조 분석'],
    status: 'configured',
  },
  {
    key: 'ExecutiveInfo',
    name: '임원 현황',
    path: `${BASE}/exctvSttus.json`,
    format: 'JSON',
    priority: 'supplementary',
    fillsFields: ['M&A 딜 — 경영진 이력'],
    status: 'configured',
  },
]

export function endpointFor(key: DartEndpointKey): string {
  const def = ENDPOINTS.find((e) => e.key === key)
  if (!def) throw new Error(`Unknown DART endpoint key: ${key}`)
  return def.path
}

export function isConfigured(key: DartEndpointKey): boolean {
  return ENDPOINTS.find((e) => e.key === key)?.status === 'configured'
}

export function summarizeStatus() {
  const configured = ENDPOINTS.filter((e) => e.status === 'configured').length
  return { configured, total: ENDPOINTS.length }
}
