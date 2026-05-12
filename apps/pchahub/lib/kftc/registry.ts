// pchahub이 호출할 모든 공정위 가맹정보 API 레지스트리.
//
// 사용자가 data.go.kr에서 활용신청한 API들을 여기에 한 줄씩 등록하면
// 1) endpoint URL이 자동 인식되고
// 2) 응답 매퍼와 mock 구조 매핑이 자동 연결되며
// 3) 빠진 API는 mock으로 graceful fallback된다.
//
// 사용자가 캡처/링크로 신규 API를 알려주면 이 파일에 한 줄 추가하는 것
// 만으로 통합 끝.

export type KftcEndpointKey =
  | 'IndutyBrandStats'   // 업종별 브랜드 변동 현황 (트렌드)
  | 'BrandList'           // 브랜드 목록 (디렉토리)
  | 'BrandStoreStats'     // 페어데이터 — 가맹점/직영점/평균매출
  | 'HqInfo'              // 가맹본부 일반 정보
  | 'HqRegistrations'     // 가맹본부 등록 목록 (사업자번호)
  | 'DisclosureList'      // 정보공개서 목록 (franchise.ftc.go.kr)
  | 'DisclosureContent'   // 정보공개서 본문 (franchise.ftc.go.kr)
  | 'HqFinance'
  | 'AvgSaleByRegion'

export interface KftcEndpointDef {
  key: KftcEndpointKey
  /** data.go.kr 활용신청 페이지 화면에 표시되는 정확한 데이터명. */
  dataName: string
  /** 전체 URL — apis.data.go.kr 또는 franchise.ftc.go.kr. */
  endpoint: string
  /** 응답 포맷 */
  format: 'JSON' | 'XML' | 'JSON+XML'
  /** pchahub 가치 기여도 — 🔴 필수 / 🟡 유용 / 🟢 보완. */
  priority: 'critical' | 'useful' | 'supplementary'
  /** 이 API가 채워주는 우리 mock 필드 (사람이 읽는 설명). */
  fillsMockFields: string[]
  /** 활용신청·연결 상태. */
  status: 'configured' | 'pending-endpoint' | 'not-applied'
}

/**
 * 사용자가 활용신청한 API 등록부.
 *
 * 새 API 추가하는 방법:
 *   1. data.go.kr 마이페이지 → 해당 API → "개발계정 상세보기"
 *   2. "데이터명"과 "End Point" 복사
 *   3. 아래 ENDPOINTS 배열에 한 줄 추가
 *      (status: 'configured'로 설정)
 *
 * 응답 포맷이 다른 새 API라면 lib/kftc/json-apis.ts에 타입+fetcher
 * 한 쌍을 추가하면 됨.
 */
export const ENDPOINTS: KftcEndpointDef[] = [
  {
    key: 'IndutyBrandStats',
    dataName: '공정거래위원회_가맹정보_업종별 브랜드변동현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcIndutyBrandStatsService',
    format: 'JSON+XML',
    priority: 'useful',
    fillsMockFields: [
      'CategoryTrend (전체 카테고리 트렌드)',
      '/categories/[key]의 "올해 신규 N개" 표시',
    ],
    status: 'configured',
  },
  {
    key: 'BrandStoreStats',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 및 직영점정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandFrcsDropInfo2_Service',
    format: 'JSON',
    priority: 'critical',
    fillsMockFields: [
      'MockBrand.storeCount',
      'MockBrand.growthRate',
      'BrandRevenue.averageMonthly',
      'BrandStoreHistory[]',
    ],
    status: 'configured',
  },
  {
    key: 'BrandList',
    dataName: '공정거래위원회_가맹정보_브랜드 목록 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandRlsInfo2_Service',
    format: 'JSON',
    priority: 'critical',
    fillsMockFields: [
      'MockBrand.name',
      'MockBrand.category',
      'MockBrand.categoryLabel',
    ],
    status: 'configured',
  },
  {
    key: 'HqInfo',
    dataName: '공정거래위원회_가맹정보_가맹본부 일반 정보 상세 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcJnghdqrtrsGnrlDtl2_Service',
    format: 'JSON',
    priority: 'useful',
    fillsMockFields: [
      'BrandHQ.companyName',
      'BrandHQ.ceo',
      'BrandHQ.address',
      'BrandHQ.phone',
      'MockBrand.hqRegion',
    ],
    status: 'configured',
  },
  {
    key: 'HqRegistrations',
    dataName: '공정거래위원회_가맹정보_가맹본부 등록 목록 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcJnghdqrtrsRgsInfo2_Service',
    format: 'JSON',
    priority: 'supplementary',
    fillsMockFields: [
      'BrandHQ.bizNumber',
      'BrandDisclosureExtras.registrationNumber',
    ],
    status: 'configured',
  },
  {
    key: 'DisclosureList',
    dataName: '공정거래위원회_가맹정보_정보공개서_목록_조회',
    endpoint: 'https://franchise.ftc.go.kr/api/search.do?type=list',
    format: 'XML',
    priority: 'critical',
    fillsMockFields: [
      'BrandDetail 전체 (가맹비/보증금/계약조건/매장 변동)',
    ],
    status: 'configured',
  },
  {
    key: 'DisclosureContent',
    dataName: '공정거래위원회_가맹정보_정보공개서_본문_조회',
    endpoint: 'https://franchise.ftc.go.kr/api/search.do?type=content',
    format: 'XML',
    priority: 'critical',
    fillsMockFields: [
      'BrandCosts (가맹비/보증금/인테리어/교육비)',
      'BrandDisclosureExtras (계약기간/광고비/영업지역)',
      'BrandHQ.foundedYear / franchiseStartYear',
    ],
    status: 'configured',
  },
  {
    key: 'HqFinance',
    dataName: '공정거래위원회_가맹정보_가맹본부 재무정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrsFnnrInfo2_Service',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'AvgSaleByRegion',
    dataName: '공정거래위원회_가맹정보_지역별 업종별 평균 매출액 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcAreaIndutyAvrStatsService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
]

export function endpointFor(key: KftcEndpointKey): string {
  const def = ENDPOINTS.find((e) => e.key === key)
  if (!def) throw new Error(`Unknown KFTC endpoint key: ${key}`)
  return def.endpoint
}

export function isConfigured(key: KftcEndpointKey): boolean {
  const def = ENDPOINTS.find((e) => e.key === key)
  return def?.status === 'configured'
}

/** 진행 현황 요약 — 로그·디버깅용. */
export function summarizeStatus() {
  const configured = ENDPOINTS.filter((e) => e.status === 'configured').length
  const pending = ENDPOINTS.filter((e) => e.status === 'pending-endpoint').length
  const notApplied = ENDPOINTS.filter((e) => e.status === 'not-applied').length
  return { configured, pending, notApplied, total: ENDPOINTS.length }
}
