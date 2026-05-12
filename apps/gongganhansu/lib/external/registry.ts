// gongganhansu의 외부 API 레지스트리.
//
// 인테리어 시공·공간 설계 도메인 — 건축물대장, 시설물 통계 등을 활용해
// 시공 후보지·평가 데이터를 보강한다.

export type GongganhansuEndpointKey =
  | 'FacilStat'   // 국토안전관리원 — 시설물 통계

export interface ExternalEndpointDef {
  key: GongganhansuEndpointKey
  dataName: string
  endpoint: string
  format: 'JSON' | 'XML' | 'JSON+XML'
  priority: 'critical' | 'useful' | 'supplementary'
  fillsFields: string[]
  status: 'configured' | 'pending-endpoint' | 'not-applied'
}

export const ENDPOINTS: ExternalEndpointDef[] = [
  {
    key: 'FacilStat',
    dataName: '국토안전관리원_시설물 통계 정보조회 서비스',
    endpoint: 'https://apis.data.go.kr/B552016/FacilStatService/getFacilStatInfo',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsFields: ['TBD — 시설물 종류별 통계, 지역별 분포'],
    status: 'configured',
  },
]

export function endpointFor(key: GongganhansuEndpointKey): string {
  const def = ENDPOINTS.find((e) => e.key === key)
  if (!def) throw new Error(`Unknown endpoint key: ${key}`)
  return def.endpoint
}

export function isConfigured(key: GongganhansuEndpointKey): boolean {
  return ENDPOINTS.find((e) => e.key === key)?.status === 'configured'
}

export function summarizeStatus() {
  const configured = ENDPOINTS.filter((e) => e.status === 'configured').length
  const pending = ENDPOINTS.filter((e) => e.status === 'pending-endpoint').length
  return { configured, pending, total: ENDPOINTS.length }
}
