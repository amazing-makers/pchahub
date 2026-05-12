// themyungdang의 외부 API 레지스트리.
//
// 부동산 통계(REB) + 실거래가(국토부) + 상권 정보(소상공인진흥공단)를
// 통합한다. 사용자가 활용신청한 API의 endpoint를 여기에 등록하면 fetcher
// 와 mapper가 자동 연결된다.

export type ThemyungdangEndpointKey =
  | 'RebRentStats'          // 한국부동산원 — 임대료 통계
  | 'RebSaleStats'          // 한국부동산원 — 매매가 통계
  | 'MoltApRtmsTrade'       // 국토부 — 아파트 실거래가
  | 'MoltRtmsCommercial'    // 국토부 — 상업용 부동산 실거래가
  | 'SosanginCommerce'      // 소상공인진흥공단 — 상권 정보
  | 'SosanginStores'        // 소상공인진흥공단 — 상가 점포 정보

export interface ExternalEndpointDef {
  key: ThemyungdangEndpointKey
  dataName: string
  endpoint: string
  format: 'JSON' | 'XML' | 'JSON+XML'
  priority: 'critical' | 'useful' | 'supplementary'
  fillsFields: string[]
  status: 'configured' | 'pending-endpoint' | 'not-applied'
}

export const ENDPOINTS: ExternalEndpointDef[] = [
  {
    key: 'RebRentStats',
    dataName: '한국부동산원_부동산통계_임대료',
    endpoint: 'https://www.reb.or.kr/r-one/openapi/SttsApiTbl.do',
    format: 'JSON',
    priority: 'critical',
    fillsFields: [
      'MockArea.avgMonthlyRentPerPyeong (실 평당 월세)',
      '/areas/[key] 페이지의 상권 평균 임대료',
    ],
    status: 'configured',
  },
  {
    key: 'RebSaleStats',
    dataName: '한국부동산원_부동산통계_매매가',
    endpoint: 'https://www.reb.or.kr/r-one/openapi/SttsApiTbl.do',
    format: 'JSON',
    priority: 'useful',
    fillsFields: [
      'MockListing.salePrice 검증 (시세 대비 표시)',
    ],
    status: 'pending-endpoint',
  },
  {
    key: 'MoltRtmsCommercial',
    dataName: '국토교통부_상업업무용부동산_실거래가',
    endpoint: 'https://apis.data.go.kr/1613000/RTMSDataSvcSHRent',
    format: 'XML',
    priority: 'critical',
    fillsFields: [
      'MockListing.deposit / monthlyRent 검증',
      'MockArea의 실시세 표시',
    ],
    status: 'pending-endpoint',
  },
  {
    key: 'MoltApRtmsTrade',
    dataName: '국토교통부_아파트매매_실거래',
    endpoint: 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev',
    format: 'XML',
    priority: 'supplementary',
    fillsFields: ['지역 부동산 시세 보조 지표'],
    status: 'pending-endpoint',
  },
  {
    key: 'SosanginCommerce',
    dataName: '소상공인시장진흥공단_상권정보',
    endpoint: 'https://apis.data.go.kr/B553077/api/open/sdsc2',
    format: 'JSON',
    priority: 'critical',
    fillsFields: [
      'MockArea.footTraffic / topCategories',
      '상권 분석 데이터 전체',
    ],
    status: 'pending-endpoint',
  },
  {
    key: 'SosanginStores',
    dataName: '소상공인시장진흥공단_상가(상권)정보',
    endpoint: 'https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInDong',
    format: 'JSON',
    priority: 'critical',
    fillsFields: [
      'MockListing의 주변 매장 정보',
      'bestplace의 매장 디렉토리 1차 소스',
    ],
    status: 'pending-endpoint',
  },
]

export function endpointFor(key: ThemyungdangEndpointKey): string {
  const def = ENDPOINTS.find((e) => e.key === key)
  if (!def) throw new Error(`Unknown endpoint key: ${key}`)
  return def.endpoint
}

export function isConfigured(key: ThemyungdangEndpointKey): boolean {
  const def = ENDPOINTS.find((e) => e.key === key)
  return def?.status === 'configured'
}

export function summarizeStatus() {
  const configured = ENDPOINTS.filter((e) => e.status === 'configured').length
  const pending = ENDPOINTS.filter((e) => e.status === 'pending-endpoint').length
  return { configured, pending, total: ENDPOINTS.length }
}
