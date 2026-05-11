// Mock data for gongganhansu — interior + contractor directory.

export interface MockContractor {
  id: string
  name: string
  region: string
  /** Specialty franchise categories */
  specialties: string[]
  /** Established year */
  foundedYear: number
  /** Total projects completed */
  projectCount: number
  /** Average price per pyeong (만원) */
  avgPricePerPyeong: number
  /** Project budget range */
  budgetRange: string
  rating: number
  reviewCount: number
  /** Logo/brand color */
  brandColor: string
  /** 짧은 소개 */
  tagline: string
  /** Multi-paragraph description */
  bio: string[]
  /** Strengths */
  highlights: string[]
  /** What's included by default */
  includes: string[]
  /** Featured / verified status */
  verified: boolean
  featured: boolean
  /** Portfolio ids */
  portfolioIds: string[]
}

export interface MockPortfolioItem {
  id: string
  title: string
  /** Brand category like '카페', '치킨' */
  category: string
  contractorId: string
  /** Location */
  region: string
  district: string
  /** Project specs */
  area: number // 평
  budget: number // 만원
  durationDays: number
  completedAt: string
  /** Visual gradient placeholder */
  imageColors: string[]
  /** Hook */
  excerpt: string
  /** Multi-paragraph case body */
  body: string[]
  /** Style tags */
  tags: string[]
  /** Specific design challenges + how they were solved */
  challenges: Array<{ problem: string; solution: string }>
  featured: boolean
  /** Image count for gallery hint */
  imageCount: number
}

export interface MockInsight {
  id: string
  title: string
  subtitle: string
  category: '단가' | '디자인' | '시공 관리' | '본사 vs 직접 발주' | '트렌드'
  authorName: string
  authorRole: string
  authorAvatarColor: string
  coverColors: string[]
  excerpt: string
  body: string[]
  keyPoints: string[]
  readTime: number
  publishedAt: string
  tags: string[]
  featured: boolean
}

export const CATEGORIES = [
  { key: 'cafe', label: '카페' },
  { key: 'chicken', label: '치킨' },
  { key: 'korean', label: '한식' },
  { key: 'japanese', label: '일식' },
  { key: 'snack', label: '분식' },
  { key: 'dessert', label: '디저트' },
  { key: 'beverage', label: '음료' },
  { key: 'bar', label: '주점' },
]

export const CONTRACTORS: MockContractor[] = [
  {
    id: 'c1',
    name: '한수디자인',
    region: '서울',
    specialties: ['cafe', 'dessert', 'beverage'],
    foundedYear: 2018,
    projectCount: 184,
    avgPricePerPyeong: 95,
    budgetRange: '3,000만 ~ 1억 5천만원',
    rating: 4.8,
    reviewCount: 162,
    brandColor: '#64748B',
    tagline: 'F&B 카페·디저트 매장 시공 전문',
    bio: [
      'F&B 매장 시공 8년차 디자인 스튜디오. 강남·홍대·연남·성수 등 트렌드 상권 매장 184건 시공 경험.',
      '저가형 카페부터 프리미엄 디저트 매장까지 폭넓은 가격대를 다루며, 본사 지정 시공 + 직접 발주 모두 가능합니다.',
    ],
    highlights: [
      '카페·디저트 카테고리 매장 시공 124건',
      '평균 시공 일수 30일',
      '본사 가이드라인 통과 보장',
      '시공 후 6개월 무상 AS',
    ],
    includes: ['디자인 컨설팅', '평면 도면 + 3D 시뮬', '시공 + 감리', '간판·가구·조명 일괄', '6개월 무상 AS'],
    verified: true,
    featured: true,
    portfolioIds: ['p1', 'p3', 'p7', 'p10'],
  },
  {
    id: 'c2',
    name: '플레인스페이스',
    region: '서울',
    specialties: ['korean', 'japanese', 'bar'],
    foundedYear: 2020,
    projectCount: 96,
    avgPricePerPyeong: 110,
    budgetRange: '4,000만 ~ 2억원',
    rating: 4.9,
    reviewCount: 88,
    brandColor: '#475569',
    tagline: '한식·일식 다이닝 매장 전문',
    bio: [
      '한식·일식 다이닝 매장 시공 5년차. 정성 들인 마감과 공간 동선 효율로 점주 추천 비율 92%.',
      '점심 + 저녁 + 심야 다목적 운영 매장에 특화된 동선 설계가 강점입니다.',
    ],
    highlights: [
      '한식·일식 다이닝 매장 시공 68건',
      '주방 동선 최적화 컨설팅 포함',
      '점심·저녁·심야 멀티타임 운영 매장 전문',
      '점주 추천 비율 92%',
    ],
    includes: ['디자인 + 도면', '주방 동선 컨설팅', '시공 + 감리', '주방 설비', '12개월 무상 AS'],
    verified: true,
    featured: true,
    portfolioIds: ['p2', 'p4', 'p11'],
  },
  {
    id: 'c3',
    name: '오픈하우스',
    region: '경기',
    specialties: ['chicken', 'snack', 'korean'],
    foundedYear: 2016,
    projectCount: 248,
    avgPricePerPyeong: 75,
    budgetRange: '2,000만 ~ 8,000만원',
    rating: 4.6,
    reviewCount: 218,
    brandColor: '#64748B',
    tagline: '치킨·분식 가맹점 시공 가성비 1위',
    bio: [
      '가성비 + 빠른 시공이 강점인 가맹점 전문 시공사. 치킨·분식 카테고리 매장 시공 156건.',
      '평당 75만원의 합리적 단가로 가맹 본사 + 점주 양측 모두에게 신뢰받는 시공사입니다.',
    ],
    highlights: [
      '평당 75만원 가성비 단가',
      '평균 시공 일수 21일',
      '치킨·분식 카테고리 매장 156건',
      '본사 지정 + 직접 발주 모두 가능',
    ],
    includes: ['평면 + 도면', '시공 + 감리', '간판·기본 가구', '3개월 무상 AS'],
    verified: true,
    featured: false,
    portfolioIds: ['p5', 'p6', 'p13'],
  },
  {
    id: 'c4',
    name: '메이드인스튜디오',
    region: '서울',
    specialties: ['dessert', 'cafe', 'beverage'],
    foundedYear: 2021,
    projectCount: 52,
    avgPricePerPyeong: 130,
    budgetRange: '5,000만 ~ 2억 5천만원',
    rating: 4.9,
    reviewCount: 46,
    brandColor: '#94A3B8',
    tagline: 'SNS 핫플 디저트·카페 비주얼 시공',
    bio: [
      'SNS 노출 효과를 극대화하는 디저트·카페 시공 전문. 성수·연남·해운대 인스타 핫플 매장 32건.',
      '평당 130만원의 프리미엄 단가지만 SNS 노출 효과로 평균 ROI 2.4배.',
    ],
    highlights: [
      'SNS 핫플 매장 32건',
      '인스타그램 그리드 컨설팅 포함',
      'SNS 노출 효과 평균 ROI 2.4배',
      '점주 인터뷰 동영상 제작 무료',
    ],
    includes: ['디자인 + 도면', '시공 + 감리', 'SNS 콘텐츠 자산 라이브러리', '6개월 AS + SNS 컨설팅'],
    verified: true,
    featured: true,
    portfolioIds: ['p8', 'p9', 'p15'],
  },
  {
    id: 'c5',
    name: '나무공방',
    region: '경기',
    specialties: ['cafe', 'korean'],
    foundedYear: 2015,
    projectCount: 312,
    avgPricePerPyeong: 90,
    budgetRange: '2,500만 ~ 1억 2천만원',
    rating: 4.7,
    reviewCount: 286,
    brandColor: '#A16207',
    tagline: '원목 가구·자연 톤 매장 시공 전문',
    bio: [
      '원목 + 자연 톤을 활용한 따뜻한 매장 시공 9년차. 카페 + 한식 분야 매장 248건.',
      '동네 단골 매장에 어울리는 따뜻하고 오래 가는 시공이 강점.',
    ],
    highlights: [
      '원목·자연 톤 매장 248건',
      '5년 후에도 컨디션 유지하는 마감',
      '자체 가구 공방 운영',
      '경기·인천 지역 출장 무료',
    ],
    includes: ['디자인 + 도면', '원목 가구 자체 제작', '시공 + 감리', '6개월 AS'],
    verified: true,
    featured: false,
    portfolioIds: ['p12', 'p14'],
  },
  {
    id: 'c6',
    name: '부산매장솔루션',
    region: '부산',
    specialties: ['bar', 'japanese', 'chicken'],
    foundedYear: 2017,
    projectCount: 142,
    avgPricePerPyeong: 80,
    budgetRange: '2,500만 ~ 1억원',
    rating: 4.6,
    reviewCount: 124,
    brandColor: '#7C3AED',
    tagline: '부산·울산·경남 매장 시공 전문',
    bio: [
      '부산·울산·경남 지역 전문 시공사. 야간 상권 + 관광 상권 매장 시공 86건.',
      '지역 자재상 + 시공팀 직접 운영으로 단가 + 일정 모두 안정적.',
    ],
    highlights: [
      '부산·울산·경남 출장 무료',
      '지역 자재상 직거래로 단가 절감',
      '야간 상권 매장 시공 86건',
      '시공 일수 보장제 (지연 시 일당 5만원 배상)',
    ],
    includes: ['디자인 + 도면', '시공 + 감리', '주방 설비', '6개월 AS + 지연 보장'],
    verified: true,
    featured: false,
    portfolioIds: [],
  },
  {
    id: 'c7',
    name: '리얼인테리어',
    region: '서울',
    specialties: ['snack', 'beverage', 'chicken'],
    foundedYear: 2019,
    projectCount: 108,
    avgPricePerPyeong: 70,
    budgetRange: '1,500만 ~ 6,000만원',
    rating: 4.5,
    reviewCount: 94,
    brandColor: '#0EA5E9',
    tagline: '저자본 가맹점 시공 — 평당 70만원',
    bio: [
      '평당 70만원 이하 저자본 가맹점 시공 전문. 분식·음료·치킨 카테고리 소형 매장 108건.',
      '소형 매장 (10-20평) 위주로 빠른 시공 + 합리적 단가를 추구합니다.',
    ],
    highlights: [
      '평당 70만원 이하 단가',
      '10-20평 소형 매장 전문',
      '평균 시공 일수 18일',
      '본사 지정 시공 통과율 95%',
    ],
    includes: ['평면 + 도면', '시공 + 감리', '간판·기본 가구', '3개월 AS'],
    verified: true,
    featured: false,
    portfolioIds: [],
  },
  {
    id: 'c8',
    name: '대구공간',
    region: '대구',
    specialties: ['snack', 'korean', 'cafe'],
    foundedYear: 2018,
    projectCount: 96,
    avgPricePerPyeong: 78,
    budgetRange: '2,000만 ~ 8,000만원',
    rating: 4.5,
    reviewCount: 88,
    brandColor: '#16A34A',
    tagline: '대구·경북 지역 가맹점 전문',
    bio: [
      '대구·경북 지역 가맹점 시공 7년차. 동성로·수성구·구미 등 지역 상권 매장 96건.',
      '지역 시공팀 + 자재상 직접 운영으로 수도권보다 평당 단가 15% 낮게 시공 가능.',
    ],
    highlights: [
      '대구·경북 출장 무료',
      '평당 78만원 안정 단가',
      '학원가·상권 매장 다수',
      '6개월 AS',
    ],
    includes: ['디자인 + 도면', '시공 + 감리', '간판·가구', '6개월 AS'],
    verified: true,
    featured: false,
    portfolioIds: [],
  },
]

export const PORTFOLIO: MockPortfolioItem[] = [
  {
    id: 'p1',
    title: '데일리브루 홍대점',
    category: 'cafe',
    contractorId: 'c1',
    region: '서울',
    district: '마포구',
    area: 14,
    budget: 4200,
    durationDays: 28,
    completedAt: '2026-02-10',
    imageColors: ['#92400E', '#A16207', '#D97706'],
    excerpt: '14평 저가형 카페. 회전율 우선 동선 + SNS 비주얼.',
    body: [
      '데일리브루 홍대점은 저가형 스페셜티 카페 콘셉트로 14평 매장에 평당 매출 +30%를 만들어야 했습니다.',
      '회전율을 위해 카운터 + 셀프 픽업 동선을 입구에서 5초 안에 끝나도록 설계했고, 좌석은 좁고 짧은 체류를 유도하는 카운터형으로 배치했습니다.',
      'SNS 비주얼은 노출 콘크리트 벽 + 우드 톤 가구 + 따뜻한 조명으로 인스타그램 그리드에 어울리도록 통일했습니다.',
    ],
    tags: ['저가형카페', 'SNS', '회전율', '14평'],
    challenges: [
      {
        problem: '14평에서 점심 피크 객수 +60% 처리',
        solution: '입구 → 카운터 → 픽업 → 카운터 좌석으로 직선 동선, 평균 응대 시간 90초로 단축',
      },
      {
        problem: 'SNS 노출용 비주얼 자산 부족',
        solution: '시공 마지막 1주에 사진작가 동행 → 매장 자산 라이브러리 60장 + 영상 8개 확보',
      },
    ],
    featured: true,
    imageCount: 18,
  },
  {
    id: 'p2',
    title: '한솥미식 판교점',
    category: 'korean',
    contractorId: 'c2',
    region: '경기',
    district: '성남시 분당구',
    area: 22,
    budget: 6800,
    durationDays: 34,
    completedAt: '2026-01-25',
    imageColors: ['#16A34A', '#22C55E', '#4ADE80'],
    excerpt: '오피스 점심 객수 최대화 — 22평 + 동선 + 주방 효율.',
    body: [
      '판교 IT 단지 한식 도시락 매장. 점심 1시간에 평균 객수 90명을 받아야 손익이 맞는 위치였습니다.',
      '주방 + 카운터 + 셀프 픽업 + 좌석 4개 zone을 분리하고, 각 zone 동선이 겹치지 않도록 설계했습니다. 배달 픽업 동선이 매장 객수 동선과 분리되어 양쪽 다 막히지 않습니다.',
      '주방은 90명/시간 처리량을 기준으로 그릴 + 보온고 + 포장 라인을 평행 배치했고, 인력 2명으로 운영 가능합니다.',
    ],
    tags: ['한식', '도시락', '점심', '주방동선'],
    challenges: [
      {
        problem: '점심 1시간 동안 90명 객수 처리',
        solution: '주방·카운터·픽업·좌석 4-zone 분리. 동선 겹침 0건',
      },
      {
        problem: '배달 + 매장 객수 동시 처리',
        solution: '배달 픽업 zone 별도 분리, 매장 객수 동선과 겹침 없음',
      },
    ],
    featured: true,
    imageCount: 22,
  },
  {
    id: 'p3',
    title: '스윗스튜디오 성수점',
    category: 'dessert',
    contractorId: 'c1',
    region: '서울',
    district: '성동구',
    area: 22,
    budget: 7200,
    durationDays: 32,
    completedAt: '2026-03-15',
    imageColors: ['#EC4899', '#F472B6', '#FBCFE8'],
    excerpt: 'SNS 인스타 핫플 — 그리드 통일성 + 우드 + 핑크 톤.',
    body: [
      '성수동 디저트 카페. 인스타그램에서 줄 서는 매장을 만들어야 했습니다.',
      '인스타그램 그리드에서 통일감을 만들기 위해 매장 모든 좌석에서 같은 톤의 사진이 나오도록 조명 + 벽 톤 + 가구를 통일했습니다.',
      'SNS 마케팅 자산을 시공과 동시에 만들기 위해 시공 마지막 주 사진작가가 동행해 매장 자산 80장 + 영상 12개를 확보했습니다.',
    ],
    tags: ['디저트', 'SNS', '핫플', '성수'],
    challenges: [
      {
        problem: '인스타그램 그리드에서 통일감 만들기',
        solution: '조명·벽 톤·가구 통일 → 어느 자리 사진을 찍어도 같은 무드',
      },
    ],
    featured: true,
    imageCount: 28,
  },
  {
    id: 'p4',
    title: '라멘이치고 광화문점',
    category: 'japanese',
    contractorId: 'c2',
    region: '서울',
    district: '종로구',
    area: 26,
    budget: 6500,
    durationDays: 30,
    completedAt: '2026-02-20',
    imageColors: ['#991B1B', '#DC2626', '#EF4444'],
    excerpt: '점심 회전율 + 야간 다이닝 — 멀티타임 운영 매장',
    body: [
      '광화문 오피스 상권 라멘 매장. 점심에는 회전율, 저녁에는 술 + 라멘 다이닝 두 가지 모드로 운영되어야 했습니다.',
      '카운터 + 4인 좌석 + 6인 단체석을 분리하여 시간대별 유연 운영이 가능하도록 했습니다. 점심엔 카운터 위주, 저녁엔 좌석 위주로 자연스럽게 객층이 분리됩니다.',
    ],
    tags: ['일식', '라멘', '오피스', '멀티타임'],
    challenges: [
      {
        problem: '점심·저녁 다른 객층 동시 매장',
        solution: '카운터·4인·6인 3-zone 분리. 시간대별 자연 분리 운영',
      },
    ],
    featured: false,
    imageCount: 16,
  },
  {
    id: 'p5',
    title: '치킨다이스 강서점',
    category: 'chicken',
    contractorId: 'c3',
    region: '서울',
    district: '강서구',
    area: 24,
    budget: 4800,
    durationDays: 21,
    completedAt: '2026-03-08',
    imageColors: ['#F97316', '#FB923C', '#FED7AA'],
    excerpt: '저자본 치킨 매장 — 평당 200만원으로 21일 시공',
    body: [
      '강서구 치킨 가맹점. 저자본 창업자의 요구에 맞춰 평당 200만원, 21일 시공으로 끝냈습니다.',
      '본사 지정 인테리어 가이드라인을 통과시키면서도 단가를 낮추기 위해 자재 직거래 + 시공팀 직접 운영을 활용했습니다.',
    ],
    tags: ['치킨', '저자본', '본사가이드라인'],
    challenges: [
      {
        problem: '본사 가이드라인 + 저단가 동시 달성',
        solution: '자재 직거래 + 시공팀 직접 운영으로 평당 단가 -30%',
      },
    ],
    featured: false,
    imageCount: 12,
  },
  {
    id: 'p6',
    title: '분식나라 평촌점',
    category: 'snack',
    contractorId: 'c3',
    region: '경기',
    district: '안양시 동안구',
    area: 16,
    budget: 3200,
    durationDays: 18,
    completedAt: '2026-02-28',
    imageColors: ['#DC2626', '#F87171', '#FECACA'],
    excerpt: '학원가 분식 — 회전율 최우선 16평 매장',
    body: [
      '안양 평촌 학원가 분식 매장. 학생 객수 회전율이 손익을 결정하는 위치였습니다.',
      '주방을 매장 입구 쪽에 배치하고, 카운터 + 픽업이 입구 5초 안에 끝나도록 설계했습니다. 좌석은 단시간 체류 유도형 카운터 + 2인 테이블 위주.',
    ],
    tags: ['분식', '학원가', '회전율'],
    challenges: [
      {
        problem: '학생 단시간 회전 + 객수 처리',
        solution: '주방·카운터를 입구 5초 동선에 집중, 좌석은 단시간 체류형',
      },
    ],
    featured: false,
    imageCount: 14,
  },
  {
    id: 'p7',
    title: '카페모먼트 송도점',
    category: 'cafe',
    contractorId: 'c1',
    region: '인천',
    district: '연수구',
    area: 28,
    budget: 5800,
    durationDays: 26,
    completedAt: '2026-01-30',
    imageColors: ['#A16207', '#CA8A04', '#FACC15'],
    excerpt: '동네 단골 카페 — 따뜻한 우드 톤 + 단골 좌석',
    body: [
      '송도 신도시 주거 단지 인근 카페. 단골 위주 매출이 목표였습니다.',
      '4인 단체석 + 2인 좌석 + 1인 카운터를 균형 있게 배치해 다양한 객층이 편하게 머물 수 있도록 했습니다. 우드 톤 + 자연 조명으로 따뜻한 분위기를 만들었습니다.',
    ],
    tags: ['카페', '동네', '단골', '우드'],
    challenges: [
      {
        problem: '다양한 객층의 체류 시간 동시 수용',
        solution: '4인·2인·1인 좌석 균형 + 자연 조명으로 객층 편안함',
      },
    ],
    featured: false,
    imageCount: 18,
  },
  {
    id: 'p8',
    title: '주스레인 영등포점',
    category: 'beverage',
    contractorId: 'c4',
    region: '서울',
    district: '영등포구',
    area: 10,
    budget: 3800,
    durationDays: 22,
    completedAt: '2026-03-22',
    imageColors: ['#10B981', '#34D399', '#A7F3D0'],
    excerpt: '1인 운영 + SNS 노출 — 10평 음료 매장',
    body: [
      '영등포 오피스 상권 1인 운영 음료 매장. 본인 혼자 운영 가능하면서도 SNS 노출이 잘 되도록 시공.',
      '주방 + 카운터 + 셀프 픽업이 본인 1명의 동선 안에 모두 들어오도록 압축 설계했고, 매장 비주얼은 SNS 그리드에 맞는 그린 + 화이트 톤으로 통일했습니다.',
    ],
    tags: ['음료', '1인운영', 'SNS', '10평'],
    challenges: [
      {
        problem: '1인 운영 + SNS 노출 동시',
        solution: '동선 압축 + 그린/화이트 톤 통일',
      },
    ],
    featured: true,
    imageCount: 16,
  },
  {
    id: 'p9',
    title: '스윗스튜디오 강남점',
    category: 'dessert',
    contractorId: 'c4',
    region: '서울',
    district: '강남구',
    area: 26,
    budget: 9200,
    durationDays: 38,
    completedAt: '2025-12-15',
    imageColors: ['#EC4899', '#A78BFA', '#FBCFE8'],
    excerpt: '강남 한복판 프리미엄 디저트 — 평당 354만원',
    body: [
      '강남 한복판 프리미엄 디저트 카페. 평당 354만원의 고급 인테리어로 SNS 핫플을 노렸습니다.',
      '벽 + 천장 + 가구 + 조명이 모두 핑크 + 라일락 + 화이트 톤으로 통일되어 어느 자리에서 찍어도 동일한 무드의 사진이 나옵니다.',
    ],
    tags: ['디저트', '프리미엄', '강남', 'SNS'],
    challenges: [
      {
        problem: '강남 단가 + SNS 노출 효과 정당화',
        solution: '평당 354만원 단가지만 SNS 노출 ROI 2.4배로 회수',
      },
    ],
    featured: false,
    imageCount: 32,
  },
  {
    id: 'p10',
    title: '데일리브루 판교점',
    category: 'cafe',
    contractorId: 'c1',
    region: '경기',
    district: '성남시 분당구',
    area: 18,
    budget: 4500,
    durationDays: 25,
    completedAt: '2026-02-05',
    imageColors: ['#92400E', '#A16207'],
    excerpt: 'IT 단지 점심 + 카페 — 18평 멀티타임',
    body: [
      '판교 IT 단지 카페 매장. 점심 + 오후 카페 + 저녁 직장인 한정 두 모드로 운영.',
    ],
    tags: ['카페', 'IT', '판교', '멀티타임'],
    challenges: [],
    featured: false,
    imageCount: 14,
  },
  {
    id: 'p11',
    title: '한그릇진심 부산서면점',
    category: 'korean',
    contractorId: 'c2',
    region: '부산',
    district: '부산진구',
    area: 32,
    budget: 7500,
    durationDays: 36,
    completedAt: '2025-11-20',
    imageColors: ['#B45309', '#D97706'],
    excerpt: '국밥 + 곰탕 — 점심 회전율 + 야간 단체',
    body: ['부산 서면 국밥 매장. 점심 + 저녁 단체 동시 처리.'],
    tags: ['한식', '국밥', '부산', '회전율'],
    challenges: [],
    featured: false,
    imageCount: 16,
  },
  {
    id: 'p12',
    title: '카페모먼트 일산점',
    category: 'cafe',
    contractorId: 'c5',
    region: '경기',
    district: '고양시 일산동구',
    area: 30,
    budget: 5500,
    durationDays: 28,
    completedAt: '2026-01-10',
    imageColors: ['#A16207', '#FACC15'],
    excerpt: '원목 + 자연 톤 동네 카페',
    body: ['일산 신도시 주거 단지 카페. 원목 자체 제작 가구.'],
    tags: ['카페', '원목', '일산'],
    challenges: [],
    featured: false,
    imageCount: 18,
  },
  {
    id: 'p13',
    title: '치킨다이스 안산점',
    category: 'chicken',
    contractorId: 'c3',
    region: '경기',
    district: '안산시',
    area: 26,
    budget: 4200,
    durationDays: 19,
    completedAt: '2026-02-15',
    imageColors: ['#F97316', '#FB923C'],
    excerpt: '저자본 치킨 — 19일 빠른 시공',
    body: ['안산 치킨 가맹점. 평당 162만원 가성비.'],
    tags: ['치킨', '저자본', '경기'],
    challenges: [],
    featured: false,
    imageCount: 12,
  },
  {
    id: 'p14',
    title: '한솥미식 일산점',
    category: 'korean',
    contractorId: 'c5',
    region: '경기',
    district: '고양시 일산서구',
    area: 24,
    budget: 5800,
    durationDays: 30,
    completedAt: '2025-12-05',
    imageColors: ['#16A34A', '#B45309'],
    excerpt: '도시락 + 한식 — 주거 단지',
    body: ['일산 주거 단지 한식 도시락. 배달 비중 65%.'],
    tags: ['한식', '도시락', '일산'],
    challenges: [],
    featured: false,
    imageCount: 14,
  },
  {
    id: 'p15',
    title: '데일리브루 광화문점',
    category: 'cafe',
    contractorId: 'c4',
    region: '서울',
    district: '종로구',
    area: 16,
    budget: 5200,
    durationDays: 24,
    completedAt: '2026-03-30',
    imageColors: ['#92400E', '#EC4899'],
    excerpt: '오피스 + SNS 동시 — 광화문 프리미엄 데일리브루',
    body: ['오피스 점심 객수 + SNS 노출 동시. 평당 단가 +25% 프리미엄.'],
    tags: ['카페', '오피스', 'SNS', '프리미엄'],
    challenges: [],
    featured: false,
    imageCount: 20,
  },
]

export const INSIGHTS: MockInsight[] = [
  {
    id: 'i1',
    title: '평당 시공 단가의 진짜 의미',
    subtitle: '평당 80만원 vs 130만원, 차이는 어디서 오나',
    category: '단가',
    authorName: '윤다은',
    authorRole: '상업 공간 디자이너 · 8년차',
    authorAvatarColor: '#64748B',
    coverColors: ['#64748B', '#94A3B8'],
    excerpt: '평당 단가는 단순 비교가 어렵습니다. 단가에 포함되는 항목·자재 등급·시공 일수까지 함께 봐야 합니다.',
    body: [
      '카페 가맹 점주 분들이 시공사를 비교할 때 가장 흔히 묻는 질문이 "평당 얼마예요?"입니다. 답을 들어도 실제 비교는 어렵습니다. 같은 80만원이라도 포함되는 항목이 천차만별입니다.',
      '평당 80만원 시공사 A: 디자인·도면·시공·간판·기본 가구·6개월 AS 포함, 주방 설비 + 조명 + 가구 업그레이드 옵션 별도. 평당 130만원 시공사 B: 위 모든 항목 + 주방 설비 + 프리미엄 조명 + 사진 자산 + 12개월 AS 포함.',
      '결과적으로 동일한 30평 매장을 동일한 결과물로 완성한다면 A는 평당 95만원, B는 평당 130만원 정도가 됩니다. 비교 시작점이 같지 않으면 평당 단가 차이는 사실상 의미가 없습니다.',
      '평당 단가를 비교할 때 반드시 1) 포함 항목 리스트 받기, 2) 시공 일수 보장 여부 확인, 3) AS 기간과 범위 확인 — 이 3가지를 같은 기준으로 맞춰서 봐야 합니다.',
    ],
    keyPoints: [
      '평당 단가는 포함 항목·자재 등급·시공 일수의 함수',
      '같은 평당 80만원도 시공사마다 의미가 다르다',
      '포함 항목 리스트 / 시공 일수 보장 / AS 범위 3가지를 같은 기준으로 비교',
      '결과적으로 평당 95만 ~ 130만이 합리적 범위',
    ],
    readTime: 8,
    publishedAt: '2026-05-04',
    tags: ['단가', '시공', '비교'],
    featured: true,
  },
  {
    id: 'i2',
    title: '본사 지정 vs 직접 발주 — 점주가 알아야 할 5가지',
    subtitle: '본사 시공이 비싼 이유와 직접 발주가 어려운 이유',
    category: '본사 vs 직접 발주',
    authorName: '김민호',
    authorRole: '15년차 가맹 컨설턴트',
    authorAvatarColor: '#3B82F6',
    coverColors: ['#3B82F6', '#60A5FA'],
    excerpt: '본사 지정 시공은 평균 시장가보다 25% 비싸지만 통과 보장이 됩니다. 그 트레이드오프를 분석합니다.',
    body: [
      '본사 지정 시공은 평균 시장가보다 약 25% 비쌉니다. 본사가 마진을 가져가기 때문이라고 알려져 있지만, 실제는 좀 더 복잡합니다.',
      '본사 입장에서 본사 지정 시공은 1) 브랜드 가이드라인 통과 보장, 2) 시공 품질의 일정 수준 유지, 3) 점주 분쟁 발생 시 본사가 책임지지 않는 보호장치 역할을 합니다. 그 비용을 점주가 부담합니다.',
      '직접 발주는 단가 25% 절감이 가능하지만, 1) 본사 가이드라인 통과까지 점주가 책임, 2) 통과 안 되면 재시공 발생 가능, 3) 본사 분쟁 시 점주에게 불리하게 작용 가능 — 위험이 있습니다.',
      '점주의 선택은 1) 본사 가이드라인이 명확하고 시공사가 가이드라인 통과 경험이 있다 → 직접 발주, 2) 본사가 가이드라인 통과 기준이 모호하다 → 본사 지정 시공으로 안전.',
    ],
    keyPoints: [
      '본사 지정 시공은 시장가 +25% — 본사 마진 + 통과 보장의 비용',
      '직접 발주는 -25% 가능하지만 통과 위험 부담',
      '시공사의 본사 가이드라인 통과 경험 + 본사 가이드라인 명확성으로 결정',
      '본사 분쟁 시 본사 지정 시공이 점주에게 유리',
    ],
    readTime: 10,
    publishedAt: '2026-04-12',
    tags: ['본사', '직접발주', '가맹'],
    featured: true,
  },
  {
    id: 'i3',
    title: 'SNS 핫플 매장의 비주얼 통일성',
    subtitle: '인스타그램 그리드에서 같은 무드가 나오는 시공의 비결',
    category: '디자인',
    authorName: '이상훈',
    authorRole: '메이드인스튜디오 대표',
    authorAvatarColor: '#94A3B8',
    coverColors: ['#EC4899', '#A78BFA'],
    excerpt: 'SNS 노출이 매출의 30% 이상인 매장에는 인스타그램 그리드 통일성이 시공 단계에서 결정됩니다.',
    body: [
      '디저트·카페·디저트 핫플 매장의 SNS 노출은 시공 단계에서 결정됩니다. 어느 자리에서 사진을 찍어도 같은 무드가 나오게 만들어야 인스타그램 그리드에서 통일감이 만들어집니다.',
      '통일감을 만드는 3가지 축은 1) 조명 색온도 (전 매장 4000K 통일 등), 2) 벽·천장 톤 (한 컬러 팔레트 안에서만), 3) 가구·소품 (3가지 색상 안에서만 선택)입니다.',
      '시공 마지막 1주는 사진 자산 라이브러리 만드는 데 사용하시는 게 좋습니다. 매장이 비어있을 때 60-80장의 매장 자산 사진을 미리 찍어두면 향후 1년 동안 SNS 콘텐츠로 활용 가능합니다.',
    ],
    keyPoints: [
      'SNS 통일감 = 조명 색온도 + 벽 톤 + 가구 색상 3축 통일',
      '시공 마지막 1주는 사진 자산 라이브러리 작업에 할애',
      '60-80장 자산이면 향후 1년 SNS 콘텐츠 충분',
    ],
    readTime: 7,
    publishedAt: '2026-03-22',
    tags: ['디자인', 'SNS', '인스타'],
    featured: false,
  },
  {
    id: 'i4',
    title: '시공 일수 보장제의 진짜 가치',
    subtitle: '시공 1주 지연 = 매장 매출 -300만원',
    category: '시공 관리',
    authorName: '강현우',
    authorRole: '오픈하우스 시공팀장',
    authorAvatarColor: '#64748B',
    coverColors: ['#A16207', '#64748B'],
    excerpt: '시공 일수 1주 지연은 단순 시간 손실이 아닙니다. 매장 오픈 시기 + 임대료 + 광고 일정이 모두 어긋납니다.',
    body: [
      '시공 일정 지연은 점주에게 단순한 시간 문제가 아닙니다. 임대차 계약상 오픈 예정일이 정해져 있고, 광고 + 인플루언서 협업 일정이 짜여 있는 경우가 많아 1주 지연이 매장 매출 -300만원으로 이어지는 경우가 흔합니다.',
      '시공 일수 보장제는 시공사가 약속한 일수를 넘기면 일당 비례 배상금을 지급하는 제도입니다. 보장이 있는 시공사의 시공 일수 준수율은 평균 96%, 보장이 없는 시공사는 78%로 차이가 큽니다.',
      '점주가 보장을 요구하면 시공사는 마진을 1-2%p 더 받지만, 평균적으로 점주가 얻는 이익이 더 큽니다. 견적 단계에서 반드시 보장 여부를 확인하세요.',
    ],
    keyPoints: [
      '시공 1주 지연 = 매장 매출 -300만원 (평균)',
      '시공 일수 보장 있음 96% 준수, 없음 78%',
      '보장 요구 시 마진 +1-2%p지만 점주 이익이 더 큼',
      '견적 단계에서 보장 여부 확인 필수',
    ],
    readTime: 6,
    publishedAt: '2026-04-02',
    tags: ['시공관리', '일수', '보장'],
    featured: false,
  },
  {
    id: 'i5',
    title: '2026 매장 인테리어 트렌드',
    subtitle: '자연 톤·우드·곡선의 부상',
    category: '트렌드',
    authorName: '윤다은',
    authorRole: '상업 공간 디자이너',
    authorAvatarColor: '#64748B',
    coverColors: ['#16A34A', '#A16207'],
    excerpt: '2024-2025의 콘크리트 + 메탈 인더스트리얼이 저물고 2026은 자연 톤 + 우드 + 곡선이 떠오릅니다.',
    body: [
      '카페·디저트 매장 시공 트렌드는 2024년 콘크리트 + 메탈의 인더스트리얼 톤이 정점을 찍었고, 2025년부터 자연 톤 + 우드로 이동하기 시작했습니다.',
      '2026 트렌드 3가지: 1) 따뜻한 우드 톤 — 원목 가구 + 자연광 강조. 2) 곡선 강조 — 모서리 라운드, 곡선 벽 마감. 3) 식물 — 매장 내 자연 식물 통합.',
      '이 트렌드는 단순 비주얼 변화가 아닙니다. 인스타그램 노출 알고리즘에서 "따뜻한 톤"이 노출 가중치가 높아지는 패턴이 확인되고 있어 매출에도 영향을 미칩니다.',
    ],
    keyPoints: [
      '2024 인더스트리얼 → 2025-2026 자연 톤',
      '따뜻한 우드 + 곡선 + 식물 3축',
      'SNS 알고리즘 패턴이 트렌드 형성에 기여',
    ],
    readTime: 5,
    publishedAt: '2026-03-15',
    tags: ['트렌드', '디자인', '2026'],
    featured: false,
  },
]

export const FEATURED_CONTRACTORS = CONTRACTORS.filter((c) => c.featured)
export const FEATURED_PORTFOLIO = PORTFOLIO.filter((p) => p.featured)
export const FEATURED_INSIGHTS = INSIGHTS.filter((i) => i.featured)

export function contractorById(id: string): MockContractor | undefined {
  return CONTRACTORS.find((c) => c.id === id)
}

export function portfolioById(id: string): MockPortfolioItem | undefined {
  return PORTFOLIO.find((p) => p.id === id)
}

export function insightById(id: string): MockInsight | undefined {
  return INSIGHTS.find((i) => i.id === id)
}

export function portfolioByContractor(contractorId: string): MockPortfolioItem[] {
  return PORTFOLIO.filter((p) => p.contractorId === contractorId)
}
