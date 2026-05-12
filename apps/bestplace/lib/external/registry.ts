// bestplace의 외부 API 레지스트리.
//
// 매장 디렉토리·어워드 사이트라 1차 데이터 소스는:
//   - 소상공인시장진흥공단 — 상가/상권정보 (가장 풍부한 매장 데이터)
//   - 카카오/네이버 플레이스 API (민간) — 매장 검색 보조
//   - 통계청 KOSIS — 지역별 상권 인구 통계
//
// data.go.kr API들과 자체 등록 매장 데이터를 머지해서 매장 디렉토리 구성.

export type BestplaceEndpointKey =
  | 'SosanginStoreList'      // 소상공인 — 상가 점포 정보
  | 'SosanginCommerceArea'   // 소상공인 — 상권 영역
  | 'StatKosisPopulation'    // 통계청 KOSIS — 지역 인구
  | 'BizRegLookup'           // 국세청 — 사업자등록 조회

export interface ExternalEndpointDef {
  key: BestplaceEndpointKey
  dataName: string
  endpoint: string
  format: 'JSON' | 'XML' | 'JSON+XML'
  priority: 'critical' | 'useful' | 'supplementary'
  fillsFields: string[]
  status: 'configured' | 'pending-endpoint' | 'not-applied'
}

export const ENDPOINTS: ExternalEndpointDef[] = [
  {
    key: 'SosanginStoreList',
    dataName: '소상공인시장진흥공단_상가(상권)정보_API',
    endpoint: 'https://apis.data.go.kr/B553077/api/open/sdsc2',
    format: 'JSON',
    priority: 'critical',
    fillsFields: [
      'MockStore 1차 디렉토리 (이름·업종·주소·전화)',
      'storeListInDong / storeListInBuilding / storeListInUpjong 등 다중 경로',
    ],
    status: 'configured',
  },
  {
    key: 'SosanginCommerceArea',
    dataName: '소상공인시장진흥공단_상권정보',
    endpoint: 'https://apis.data.go.kr/B553077/api/open/sdsc2/commercialDistrict',
    format: 'JSON',
    priority: 'useful',
    fillsFields: [
      '상권 단위 정보 (지정상권/주요상권)',
      '/rankings 페이지의 지역별 상권 활성도',
    ],
    status: 'pending-endpoint',
  },
  {
    key: 'StatKosisPopulation',
    dataName: '국가데이터처_KOSIS 통계자료 조회 서비스',
    endpoint: 'https://apis.data.go.kr/1240000/statisticsData',
    format: 'JSON',
    priority: 'supplementary',
    fillsFields: ['지역 인구 통계 (매장 입지 분석)'],
    status: 'configured',
  },
  {
    key: 'BizRegLookup',
    dataName: '국세청_사업자등록정보 진위확인 및 상태조회 서비스',
    endpoint: '',
    format: 'JSON',
    priority: 'supplementary',
    fillsFields: ['MockStore.verified — 사업자번호 진위 검증'],
    status: 'configured',
  },
]

export function endpointFor(key: BestplaceEndpointKey): string {
  const def = ENDPOINTS.find((e) => e.key === key)
  if (!def) throw new Error(`Unknown endpoint key: ${key}`)
  return def.endpoint
}

export function summarizeStatus() {
  const configured = ENDPOINTS.filter((e) => e.status === 'configured').length
  const pending = ENDPOINTS.filter((e) => e.status === 'pending-endpoint').length
  return { configured, pending, total: ENDPOINTS.length }
}
