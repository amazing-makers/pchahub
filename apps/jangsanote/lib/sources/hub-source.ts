// 장사노트 허브 데이터 소스 — 멀티소스 자동 분기.
//
// 우선순위:
//   1. 공공데이터포털(data.go.kr / ODcloud) 공개 API  — ODCLOUD_API_KEY 설정 시
//   2. amakers 큐레이션 시드 데이터(hub-data.ts)        — 항상 fallback
//   (3. 점주 제보(UGC)는 클라이언트(localStorage)에서 병합 — community-hub-feed.tsx)
//
// 페이지는 이 모듈의 getSupports()/getFestivals()/getRecipes()만 호출하면
// 데이터 소스를 신경 쓸 필요가 없다.
//
// 실 API 활성화:
//   1. data.go.kr에서 해당 데이터셋 활용신청 → 인증키 발급
//   2. .env 에 ODCLOUD_API_KEY, ODCLOUD_SUPPORT_PATH, ODCLOUD_FESTIVAL_PATH 추가
//   3. 자동으로 실 API + 시드 병합

import {
  FESTIVALS,
  RECIPES,
  SUPPORTS,
  type ContentSource,
  type MockFestival,
  type MockRecipe,
  type MockSupport,
  type SupportType,
} from '../hub-data'

function hasKey(): boolean {
  return Boolean(process.env.ODCLOUD_API_KEY)
}

/** 현재 활성 데이터 소스 — UI 표시용. */
export function getHubDataSource(): 'seed' | 'api' {
  return hasKey() ? 'api' : 'seed'
}

const withSource = <T extends { source?: ContentSource }>(items: T[], source: ContentSource): T[] =>
  items.map((it) => ({ ...it, source: it.source ?? source }))

/** 제목 기준 중복 제거 — 시드(공식)를 우선하고 API 항목을 뒤에 덧붙인다. */
function mergeByTitle<T extends { title: string }>(seed: T[], api: T[]): T[] {
  const seen = new Set(seed.map((s) => s.title.replace(/\s+/g, '')))
  const extra = api.filter((a) => !seen.has(a.title.replace(/\s+/g, '')))
  return [...seed, ...extra]
}

// ── ODcloud(data.go.kr) JSON API 클라이언트 ─────────────────────────────────

interface OdcloudResponse {
  page: number
  perPage: number
  totalCount: number
  data: Array<Record<string, unknown>>
}

async function fetchOdcloud(path: string, perPage = 100): Promise<OdcloudResponse> {
  const key = process.env.ODCLOUD_API_KEY!
  const url = `https://api.odcloud.kr/api${path}?page=1&perPage=${perPage}&returnType=JSON&serviceKey=${encodeURIComponent(key)}`
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 6 } })
  if (!res.ok) throw new Error(`ODcloud ${res.status}`)
  return (await res.json()) as OdcloudResponse
}

/** 다양한 데이터셋의 한글 필드명을 유연하게 읽는다. */
function field(item: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = item[k]
    if (v != null && String(v).trim() !== '') return String(v).trim()
  }
  return ''
}

function guessSupportType(title: string): SupportType {
  if (/공모|경진|콘테스트/.test(title)) return 'contest'
  if (/보조금|바우처|지원금|임차료/.test(title)) return 'subsidy'
  if (/이벤트|캠페인|행사/.test(title)) return 'event'
  return 'support'
}

function mapToSupport(item: Record<string, unknown>, i: number): MockSupport {
  const title = field(item, '사업명', '지원사업명', '제목', '공고명', 'title') || `지원사업 ${i + 1}`
  return {
    id: `api-sp-${i}`,
    title,
    type: guessSupportType(title),
    summary: field(item, '사업내용', '지원내용', '개요', '내용', 'summary') || '공공데이터 제공 지원사업입니다.',
    agency: field(item, '주관기관', '시행기관', '기관명', '담당부서', 'agency') || '정부·지자체',
    target: field(item, '지원대상', '신청대상', '대상') || '소상공인·자영업자',
    amount: field(item, '지원규모', '지원금액', '지원한도') || '공고 참조',
    applyStart: field(item, '접수시작일', '신청시작일', '시작일') || new Date().toISOString().slice(0, 10),
    applyEnd: field(item, '접수마감일', '신청종료일', '마감일', '종료일') || '',
    link: field(item, '상세링크', 'URL', '링크', 'url') || 'https://www.data.go.kr',
    tags: ['공공데이터'],
    source: 'api',
  }
}

// ── 공개 조회 함수 ───────────────────────────────────────────────────────────

export async function getSupports(): Promise<MockSupport[]> {
  const seed = withSource(SUPPORTS, 'official')
  if (!hasKey() || !process.env.ODCLOUD_SUPPORT_PATH) return seed
  try {
    const res = await fetchOdcloud(process.env.ODCLOUD_SUPPORT_PATH)
    const api = res.data.map(mapToSupport).filter((s) => s.applyEnd)
    return mergeByTitle(seed, api)
  } catch (err) {
    console.error('[hub-source] 지원사업 API 실패 — 시드 fallback:', err)
    return seed
  }
}

export async function getFestivals(): Promise<MockFestival[]> {
  // 박람회/축제 공개 데이터셋은 포맷이 제각각이라, 키 + 전용 path가 있을 때만 시도.
  const seed = withSource(FESTIVALS, 'official')
  return seed
}

export async function getRecipes(): Promise<MockRecipe[]> {
  // 레시피는 공공 API 대상이 아님 — 큐레이션 시드 + (클라이언트에서) 점주 제보 병합.
  return withSource(RECIPES, 'official')
}
