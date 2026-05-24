// 장사노트 정보 허브 — 레시피·축제/박람회·지원/이벤트 집계 데이터.
// 커뮤니티(채널/게시글/모임)에 더해 점주에게 유용한 정보를 모아 보여준다.
import { festivalCoverFor, recipeCoverFor, userAvatarFor } from './community-images'
import { userById } from './mock-data'

/**
 * 데이터 출처.
 * - official : amakers 큐레이션(공식 확인) 시드 데이터
 * - api      : 공공데이터포털(data.go.kr) 등 외부 공개 API 수집
 * - community: 실제 점주·관계자가 직접 제보/작성 (UGC)
 */
export type ContentSource = 'official' | 'api' | 'community'

export const SOURCE_LABEL: Record<ContentSource, string> = {
  official: '공식',
  api: '공공데이터',
  community: '점주 제보',
}

// ── 레시피 ───────────────────────────────────────────────────────────────────

export type RecipeDifficulty = '쉬움' | '보통' | '어려움'

export interface MockRecipe {
  id: string
  title: string
  summary: string
  /** 업종/요리 분류 */
  category: string
  authorId: string
  difficulty: RecipeDifficulty
  /** 조리 시간(분) */
  cookTimeMin: number
  /** 분량 — 예: '2인분', '매장 1배치(20인분)' */
  servings: string
  /** 1인분(또는 1배치) 원가 — 만원 아님, 원 단위 */
  costPerWon: number
  ingredients: string[]
  steps: string[]
  tags: string[]
  likes: number
  saves: number
  coverImage: string
  createdAt: string
  source?: ContentSource
}

type RawRecipe = Omit<MockRecipe, 'coverImage'>

const RAW_RECIPES: RawRecipe[] = [
  {
    id: 'rc1',
    title: '원가 800원 시그니처 흑임자 라떼',
    summary: '재료비 800원으로 5,500원에 파는 카페 시그니처. 흑임자 페이스트 직접 배합 비율 공개.',
    category: '카페',
    authorId: 'u2',
    difficulty: '쉬움',
    cookTimeMin: 5,
    servings: '1잔',
    costPerWon: 800,
    ingredients: ['우유 250ml', '흑임자 페이스트 20g', '연유 15ml', '에스프레소 1샷', '얼음'],
    steps: [
      '흑임자 페이스트와 연유를 먼저 섞어 베이스를 만든다.',
      '우유를 붓고 잘 저어 흑임자 베이스를 완전히 풀어준다.',
      '얼음을 채운 잔에 따르고 에스프레소 1샷을 위에 올린다.',
      '흑임자 가루를 살짝 뿌려 마무리.',
    ],
    tags: ['카페', '시그니처', '원가절감', '음료'],
    likes: 342,
    saves: 198,
    createdAt: '2026-05-12',
  },
  {
    id: 'rc2',
    title: '회전율 높이는 5분 컷 김치우동',
    summary: '점심 피크에 5분 안에 나가는 분식집 효자 메뉴. 미리 준비하는 육수·고명 세팅법까지.',
    category: '분식',
    authorId: 'u5',
    difficulty: '쉬움',
    cookTimeMin: 5,
    servings: '1인분',
    costPerWon: 1400,
    ingredients: ['우동면 200g', '익은 김치 80g', '멸치다시 육수 400ml', '대파', '계란', '어묵'],
    steps: [
      '아침에 멸치다시 육수를 넉넉히 끓여 보온한다.',
      '주문 시 육수에 김치와 어묵을 넣고 30초 끓인다.',
      '데친 우동면을 그릇에 담고 육수를 붓는다.',
      '반숙 계란과 대파를 올려 완성.',
    ],
    tags: ['분식', '회전율', '점심', '면요리'],
    likes: 271,
    saves: 156,
    createdAt: '2026-05-09',
  },
  {
    id: 'rc3',
    title: '재고 소진용 마감 할인 도시락 구성법',
    summary: '마감 2시간 전 남은 반찬으로 만드는 할인 도시락. 폐기율을 12%→3%로 줄인 구성 공식.',
    category: '한식',
    authorId: 'u8',
    difficulty: '보통',
    cookTimeMin: 15,
    servings: '도시락 4개',
    costPerWon: 2200,
    ingredients: ['당일 남은 메인 반찬 2종', '밑반찬 3종', '밥', '계란', '도시락 용기'],
    steps: [
      '메인 반찬을 4등분으로 소분한다.',
      '밑반찬을 색 대비가 되도록 배치한다.',
      '계란말이로 빈 칸을 채워 풍성하게 보이게 한다.',
      '마감 할인 스티커를 붙여 진열.',
    ],
    tags: ['한식', '재고관리', '폐기율', '도시락'],
    likes: 419,
    saves: 312,
    createdAt: '2026-05-06',
  },
  {
    id: 'rc4',
    title: '테이크아웃 안 무너지는 크림 파스타',
    summary: '배달·포장 시 면이 불지 않는 크림 파스타 농도·면 삶기 타이밍 노하우.',
    category: '양식',
    authorId: 'u3',
    difficulty: '보통',
    cookTimeMin: 12,
    servings: '1인분',
    costPerWon: 2600,
    ingredients: ['생면 180g', '생크림 120ml', '우유 80ml', '파마산', '베이컨', '마늘'],
    steps: [
      '면은 표시 시간보다 1분 짧게 삶아 알덴테로 둔다.',
      '크림 소스는 평소보다 살짝 되직하게 졸인다.',
      '면과 소스를 버무린 뒤 바로 포장 용기에 담는다.',
      '소스를 면 위에 한 국자 더 덮어 수분 증발을 막는다.',
    ],
    tags: ['양식', '배달', '포장', '면요리'],
    likes: 188,
    saves: 134,
    createdAt: '2026-05-03',
  },
  {
    id: 'rc5',
    title: '여름 한정 수익률 70% 수제 에이드',
    summary: '청 직접 담가 원가 600원, 6,000원에 파는 시즌 에이드. 청 보관·소진 관리까지.',
    category: '카페',
    authorId: 'u6',
    difficulty: '쉬움',
    cookTimeMin: 3,
    servings: '1잔',
    costPerWon: 600,
    ingredients: ['수제 청 40ml', '탄산수 250ml', '레몬 슬라이스', '허브', '얼음'],
    steps: [
      '주 1회 제철 과일로 청을 담가 냉장 보관한다.',
      '잔에 얼음과 청을 넣는다.',
      '탄산수를 천천히 부어 층을 만든다.',
      '레몬과 허브로 비주얼을 살린다.',
    ],
    tags: ['카페', '시즌메뉴', '고마진', '음료'],
    likes: 256,
    saves: 201,
    createdAt: '2026-04-28',
  },
  {
    id: 'rc6',
    title: '폐기 없는 치킨 부산물 활용 사이드',
    summary: '닭 손질 부산물로 만드는 원가 0원 서비스 사이드. 단골 만드는 무료 안주.',
    category: '치킨/주점',
    authorId: 'u9',
    difficulty: '보통',
    cookTimeMin: 20,
    servings: '4인분',
    costPerWon: 0,
    ingredients: ['닭 손질 부산물', '간장', '마늘', '청양고추', '물엿'],
    steps: [
      '부산물을 깨끗이 손질해 데친다.',
      '간장·마늘·물엿으로 양념을 만든다.',
      '약불에서 조려 윤기를 낸다.',
      '서비스 안주로 제공해 재방문을 유도.',
    ],
    tags: ['치킨', '주점', '서비스', '단골관리'],
    likes: 203,
    saves: 145,
    createdAt: '2026-04-22',
  },
]

export const RECIPES: MockRecipe[] = RAW_RECIPES.map((r) => ({
  ...r,
  coverImage: recipeCoverFor(r.id, r.category),
}))

export const RECIPE_CATEGORIES = ['전체', '카페', '분식', '한식', '양식', '치킨/주점']

// ── 축제 · 박람회 ─────────────────────────────────────────────────────────────

export type FestivalType = 'expo' | 'festival' | 'market'

export const FESTIVAL_TYPE_LABEL: Record<FestivalType, string> = {
  expo: '박람회',
  festival: '축제',
  market: '장터/플리마켓',
}

export interface MockFestival {
  id: string
  title: string
  type: FestivalType
  summary: string
  venue: string
  region: string
  startDate: string
  endDate: string
  organizer: string
  isFree: boolean
  feeNote: string
  website: string
  tags: string[]
  coverImage: string
  source?: ContentSource
}

type RawFestival = Omit<MockFestival, 'coverImage'>

const RAW_FESTIVALS: RawFestival[] = [
  {
    id: 'fs1',
    title: '2026 대한민국 프랜차이즈 창업박람회',
    type: 'expo',
    summary: '국내 최대 규모 프랜차이즈 창업박람회. 300여 개 브랜드 부스, 창업 상담, 무료 세미나 동시 진행.',
    venue: 'COEX A·B홀',
    region: '서울',
    startDate: '2026-06-12',
    endDate: '2026-06-14',
    organizer: '한국프랜차이즈산업협회',
    isFree: true,
    feeNote: '사전등록 시 무료입장',
    website: 'https://franchise.ftc.go.kr',
    tags: ['프랜차이즈', '창업', '박람회', '서울'],
  },
  {
    id: 'fs2',
    title: '서울카페쇼 2026',
    type: 'expo',
    summary: '아시아 최대 커피·디저트 박람회. 신규 원두·머신·베이커리 트렌드와 바리스타 시연.',
    venue: 'COEX 전관',
    region: '서울',
    startDate: '2026-11-04',
    endDate: '2026-11-07',
    organizer: '서울카페쇼 조직위',
    isFree: false,
    feeNote: '입장료 13,000원 (사전등록 8,000원)',
    website: 'https://www.cafeshow.com',
    tags: ['카페', '커피', '디저트', '트렌드'],
  },
  {
    id: 'fs3',
    title: '대구 치맥페스티벌',
    type: 'festival',
    summary: '여름밤 치킨·맥주 축제. 점주 부스 참가 신청 가능, 지역 외식업체 홍보 기회.',
    venue: '두류공원 일대',
    region: '대구',
    startDate: '2026-07-01',
    endDate: '2026-07-05',
    organizer: '대구광역시',
    isFree: true,
    feeNote: '입장 무료 · 부스 참가비 별도',
    website: 'https://www.chimacfestival.com',
    tags: ['치킨', '맥주', '축제', '부스참가'],
  },
  {
    id: 'fs4',
    title: '경기 푸드테크·외식산업전',
    type: 'expo',
    summary: '주방 자동화·키오스크·배달 솔루션 등 외식 운영 효율화 기술을 모은 박람회.',
    venue: '킨텍스 제2전시장',
    region: '경기',
    startDate: '2026-09-23',
    endDate: '2026-09-25',
    organizer: '경기도·킨텍스',
    isFree: true,
    feeNote: '사전등록 무료',
    website: 'https://www.kintex.com',
    tags: ['푸드테크', '키오스크', '자동화', '운영'],
  },
  {
    id: 'fs5',
    title: '전주 로컬푸드 플리마켓',
    type: 'market',
    summary: '지역 소상공인·청년 창업가 대상 주말 장터. 신메뉴 테스트와 고객 반응 수집에 적합.',
    venue: '한옥마을 광장',
    region: '전북',
    startDate: '2026-05-31',
    endDate: '2026-06-01',
    organizer: '전주시 소상공인지원센터',
    isFree: true,
    feeNote: '셀러 참가 무료 (선착순 모집)',
    website: 'https://www.jeonju.go.kr',
    tags: ['플리마켓', '로컬푸드', '청년창업', '테스트'],
  },
  {
    id: 'fs6',
    title: '부산 베이커리 페어',
    type: 'expo',
    summary: '제과·제빵 재료, 설비, 신제품 트렌드를 한자리에. 베이커리 창업·운영자 필수 박람회.',
    venue: 'BEXCO 제1전시장',
    region: '부산',
    startDate: '2026-08-20',
    endDate: '2026-08-22',
    organizer: 'BEXCO',
    isFree: false,
    feeNote: '입장료 10,000원',
    website: 'https://www.bexco.co.kr',
    tags: ['베이커리', '제과제빵', '재료', '부산'],
  },
]

export const FESTIVALS: MockFestival[] = RAW_FESTIVALS.map((f) => ({
  ...f,
  coverImage: festivalCoverFor(f.id),
}))

// ── 지원 · 이벤트 ─────────────────────────────────────────────────────────────

export type SupportType = 'support' | 'subsidy' | 'contest' | 'event'

export const SUPPORT_TYPE_LABEL: Record<SupportType, string> = {
  support: '지원사업',
  subsidy: '보조금',
  contest: '공모전',
  event: '이벤트',
}

export interface MockSupport {
  id: string
  title: string
  type: SupportType
  summary: string
  /** 주관 기관 */
  agency: string
  /** 지원 대상 */
  target: string
  /** 지원 규모 */
  amount: string
  applyStart: string
  /** 마감일 (ISO) */
  applyEnd: string
  link: string
  tags: string[]
  source?: ContentSource
}

export const SUPPORTS: MockSupport[] = [
  {
    id: 'sp1',
    title: '소상공인 스마트상점 기술보급 지원',
    type: 'support',
    summary: '키오스크·테이블오더·서빙로봇 등 스마트 기술 도입 비용을 최대 70% 지원.',
    agency: '소상공인시장진흥공단',
    target: '상시근로자 5인 미만 소상공인',
    amount: '점포당 최대 500만원 (자부담 30%)',
    applyStart: '2026-05-01',
    applyEnd: '2026-06-30',
    link: 'https://www.semas.or.kr',
    tags: ['스마트상점', '키오스크', '소상공인', '디지털'],
  },
  {
    id: 'sp2',
    title: '청년 창업 임차료 지원사업',
    type: 'subsidy',
    summary: '만 39세 이하 청년 창업자의 점포 임차료를 월 최대 50만원, 1년간 지원.',
    agency: '중소벤처기업부',
    target: '만 39세 이하 예비·초기 창업자',
    amount: '월 최대 50만원 × 12개월',
    applyStart: '2026-05-15',
    applyEnd: '2026-07-15',
    link: 'https://www.k-startup.go.kr',
    tags: ['청년창업', '임차료', '보조금'],
  },
  {
    id: 'sp3',
    title: '전통시장·상점가 디지털 전환 바우처',
    type: 'subsidy',
    summary: '온라인 주문·배달 입점, SNS 마케팅 비용을 바우처로 지원.',
    agency: '지자체·소진공',
    target: '전통시장·상점가 입점 점포',
    amount: '점포당 200만원 바우처',
    applyStart: '2026-06-01',
    applyEnd: '2026-08-31',
    link: 'https://www.semas.or.kr',
    tags: ['디지털전환', '바우처', '배달', '마케팅'],
  },
  {
    id: 'sp4',
    title: '백년가게·백년소공인 공모',
    type: 'contest',
    summary: '30년 이상 운영 또는 우수 기술 보유 점포 선정. 인증 시 컨설팅·홍보·금융 우대.',
    agency: '소상공인시장진흥공단',
    target: '업력 30년 이상 또는 숙련 소공인',
    amount: '인증 + 컨설팅·금융 우대',
    applyStart: '2026-05-10',
    applyEnd: '2026-06-20',
    link: 'https://www.semas.or.kr',
    tags: ['백년가게', '인증', '공모', '컨설팅'],
  },
  {
    id: 'sp5',
    title: '소상공인 정책자금 융자 (저신용 특별)',
    type: 'support',
    summary: '저신용 소상공인 대상 연 2%대 저금리 운전자금 융자. 한도 상향 운영.',
    agency: '소상공인시장진흥공단',
    target: '신용점수 하위 소상공인',
    amount: '업체당 최대 3,000만원',
    applyStart: '2026-05-02',
    applyEnd: '2026-12-31',
    link: 'https://ols.semas.or.kr',
    tags: ['정책자금', '융자', '저금리', '운전자금'],
  },
  {
    id: 'sp6',
    title: '우리 동네 가게 응원 소비 캠페인',
    type: 'event',
    summary: '캠페인 참여 점포 대상 지역화폐 페이백·홍보 노출 이벤트. 신청만 하면 참여.',
    agency: '지방자치단체',
    target: '지역 내 모든 자영업 점포',
    amount: '지역화폐 페이백 + 홍보 노출',
    applyStart: '2026-05-20',
    applyEnd: '2026-06-10',
    link: 'https://www.jangsanote.amakers.co.kr',
    tags: ['지역화폐', '페이백', '캠페인', '이벤트'],
  },
]

// ── 헬퍼 ─────────────────────────────────────────────────────────────────────

export function recipeAuthor(authorId: string) {
  const u = userById(authorId)
  return {
    handle: u?.handle ?? '점주',
    avatarUrl: u?.avatarUrl ?? userAvatarFor(authorId),
  }
}

export function recipeById(id: string): MockRecipe | undefined {
  return RECIPES.find((r) => r.id === id)
}

/** 마감 임박 순(가까운 마감 먼저), 마감 지난 건 뒤로. */
export function supportsByDeadline(): MockSupport[] {
  const today = new Date().toISOString().slice(0, 10)
  return [...SUPPORTS].sort((a, b) => {
    const aOpen = a.applyEnd >= today
    const bOpen = b.applyEnd >= today
    if (aOpen !== bOpen) return aOpen ? -1 : 1
    return a.applyEnd.localeCompare(b.applyEnd)
  })
}

/** 시작일이 가까운 순. */
export function festivalsByDate(): MockFestival[] {
  return [...FESTIVALS].sort((a, b) => a.startDate.localeCompare(b.startDate))
}

export function daysUntil(iso: string): number {
  const target = new Date(iso + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}
