// 공공 API 키 읽기 헬퍼.
// process.env에서 키를 읽고, 없으면 throw 또는 null 반환.
// 값 자체는 절대 로그/에러 메시지에 포함하지 않는다.

function requiredEnv(name: string): string {
  const val = process.env[name]
  if (!val) throw new Error(`환경변수 ${name}가 설정되지 않았습니다.`)
  return val
}

export const env = {
  /** apis.data.go.kr/1130000/* 공정거래위원회 가맹정보 */
  kftcApiKey: () => requiredEnv('KFTC_API_KEY'),
  /** apis.data.go.kr/{1240000,1613000,B553077,B552016}/* */
  datagoApiKey: () => requiredEnv('DATAGO_API_KEY'),
  /** reb.or.kr 한국부동산원 — 없으면 null (graceful fallback) */
  rebApiKey: () => process.env.REB_API_KEY ?? null,
  /** api.odcloud.kr 국세청 사업자등록 진위 — 없으면 null */
  ntsApiKey: () => process.env.NTS_API_KEY ?? null,
}
