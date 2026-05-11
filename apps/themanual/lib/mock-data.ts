// Mock data for themanual (franchise operations education).
// Shape mirrors the eventual Course + Mentor + Curriculum tables.

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export interface CourseCategory {
  key: string
  label: string
  description: string
}

export interface CourseLesson {
  id: string
  title: string
  durationMin: number
  preview?: boolean
}

export interface CourseSection {
  id: string
  title: string
  lessons: CourseLesson[]
}

export interface MockCourse {
  id: string
  title: string
  subtitle: string
  category: string
  level: CourseLevel
  thumbnailColor: string
  instructorIds: string[]
  /** Total runtime in minutes. */
  durationMin: number
  lessonCount: number
  /** 원 (KRW). 0 = free */
  price: number
  /** Original price for strikethrough effect. */
  originalPrice?: number
  rating: number
  reviewCount: number
  enrollment: number
  featured: boolean
  tags: string[]
  description: string
  targetAudience: string[]
  takeaways: string[]
  /** Set of franchise category keys this course applies to (links to pchahub). */
  brandCategories: string[]
  curriculum: CourseSection[]
  createdAt: string
}

export interface MockMentor {
  id: string
  name: string
  role: string
  /** Specialty / 분야 — used as tag. */
  specialties: string[]
  bio: string
  avatarColor: string
  hourlyRate: number
  rating: number
  totalConsultations: number
  yearsOfExperience: number
  featured: boolean
}

export const COURSE_CATEGORIES: CourseCategory[] = [
  { key: 'gateway', label: '가맹창업 입문', description: '협회 등록 정보공개서를 비롯한 기초' },
  { key: 'ops', label: '매장 운영', description: '인력·재고·고객 응대까지 일상 운영' },
  { key: 'marketing', label: '마케팅', description: 'SNS·배달앱·재방문 유도 전략' },
  { key: 'finance', label: '회계·세무', description: '부가세·종합소득세·매출 관리' },
  { key: 'legal', label: '법률·계약', description: '가맹사업법·계약 분쟁 대비' },
  { key: 'interior', label: '인테리어·시공', description: '시공 단가·본사 vs 직접 발주' },
  { key: 'staff', label: '인력·고용', description: '채용·근로기준법·인력 비용 관리' },
  { key: 'digital', label: '디지털·POS', description: 'POS·배달앱·데이터 분석' },
]

export const LEVEL_LABEL: Record<CourseLevel, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
}

export const MENTORS: MockMentor[] = [
  {
    id: 'm1',
    name: '김민호',
    role: '15년차 가맹 컨설턴트',
    specialties: ['창업 컨설팅', '본사 검증', '입지 분석'],
    bio: '대형 프랜차이즈 본사 + 점주 양측 모두 자문 경험. 가맹 사업의 양면을 모두 이해합니다.',
    avatarColor: '#3B82F6',
    hourlyRate: 250000,
    rating: 4.9,
    totalConsultations: 412,
    yearsOfExperience: 15,
    featured: true,
  },
  {
    id: 'm2',
    name: '박지영',
    role: '5년차 카페 다점포 점주',
    specialties: ['카페 운영', '소형 매장', '여성 창업'],
    bio: '서울·경기 3호점 운영. 1인 카페에서 시작해 직원 8명 매장까지 키워본 실전 경험.',
    avatarColor: '#92400E',
    hourlyRate: 120000,
    rating: 4.8,
    totalConsultations: 186,
    yearsOfExperience: 5,
    featured: true,
  },
  {
    id: 'm3',
    name: '이상훈',
    role: '회계사 · 자영업 세무 전문',
    specialties: ['세무', '회계', '매출 분석'],
    bio: '연 매출 1억-50억 자영업·가맹점 300여 곳 자문. 부가세·종합소득세 절세 솔루션.',
    avatarColor: '#10B981',
    hourlyRate: 180000,
    rating: 4.9,
    totalConsultations: 254,
    yearsOfExperience: 12,
    featured: false,
  },
  {
    id: 'm4',
    name: '정민철',
    role: '변호사 · 가맹사업법 전문',
    specialties: ['가맹사업법', '계약 분쟁', '권리금 분쟁'],
    bio: '가맹사업법·상가건물 임대차보호법 전문. 점주 측 분쟁 사례 200건 이상 자문.',
    avatarColor: '#7C3AED',
    hourlyRate: 300000,
    rating: 4.9,
    totalConsultations: 138,
    yearsOfExperience: 10,
    featured: true,
  },
  {
    id: 'm5',
    name: '최서윤',
    role: '분식 다점포 운영자',
    specialties: ['저자본 창업', '회전율', '학원가 상권'],
    bio: '5년간 분식 매장 4개점 운영. 저자본 + 회전율 중심 운영 노하우.',
    avatarColor: '#F59E0B',
    hourlyRate: 100000,
    rating: 4.7,
    totalConsultations: 92,
    yearsOfExperience: 5,
    featured: false,
  },
  {
    id: 'm6',
    name: '강현우',
    role: '디지털 마케팅 디렉터',
    specialties: ['SNS 마케팅', '배달앱', '브랜딩'],
    bio: 'F&B 브랜드 인스타그램 + 배달앱 마케팅 10년. 신규 매장 SNS 노출 가속화 전문.',
    avatarColor: '#EC4899',
    hourlyRate: 160000,
    rating: 4.8,
    totalConsultations: 178,
    yearsOfExperience: 10,
    featured: false,
  },
  {
    id: 'm7',
    name: '윤다은',
    role: '상업 공간 디자이너',
    specialties: ['인테리어', '시공 견적', '공간 효율'],
    bio: '카페·식음료 매장 시공 80건 이상. 본사 vs 직접 발주 비용 분석에 강점.',
    avatarColor: '#64748B',
    hourlyRate: 140000,
    rating: 4.7,
    totalConsultations: 64,
    yearsOfExperience: 8,
    featured: false,
  },
  {
    id: 'm8',
    name: '한유진',
    role: '7년차 치킨 점주',
    specialties: ['치킨 가맹', '인력 운영', '심야 매출'],
    bio: '치킨 가맹 3개 브랜드 운영 경험. 본사 갈등·SV 대응·심야 인력 관리 실전.',
    avatarColor: '#EA580C',
    hourlyRate: 100000,
    rating: 4.8,
    totalConsultations: 108,
    yearsOfExperience: 7,
    featured: false,
  },
]

export const COURSES: MockCourse[] = [
  {
    id: 'c1',
    title: '가맹창업 첫걸음 — 정보공개서 읽는 법',
    subtitle: '협회 등록 정보공개서를 30분 만에 해석할 수 있게',
    category: 'gateway',
    level: 'beginner',
    thumbnailColor: '#3B82F6',
    instructorIds: ['m1'],
    durationMin: 95,
    lessonCount: 8,
    price: 0,
    rating: 4.7,
    reviewCount: 382,
    enrollment: 4820,
    featured: true,
    tags: ['무료', '정보공개서', '입문', '가맹창업'],
    description:
      '가맹창업을 처음 검토하시는 분이라면 반드시 봐야 할 무료 강의입니다. 협회 등록 정보공개서가 어떻게 구성되는지, 어디를 봐야 본사의 진짜 모습을 알 수 있는지 차근차근 설명합니다.',
    targetAudience: ['처음 가맹창업을 검토하는 분', '정보공개서 항목이 어렵게 느껴지는 분', '본사 자료의 함정을 알고 싶은 분'],
    takeaways: ['정보공개서 8개 항목의 의미', '평균 매출의 통계적 한계', '본사 폐점율 추이로 보는 안정성', '가맹비·인테리어 단가 비교법'],
    brandCategories: ['chicken', 'cafe', 'korean', 'japanese', 'snack', 'dessert', 'beverage', 'bar'],
    curriculum: [
      {
        id: 's1',
        title: '정보공개서란 무엇인가',
        lessons: [
          { id: 'l1', title: '왜 정보공개서를 봐야 하나', durationMin: 8, preview: true },
          { id: 'l2', title: '필수 8개 항목 한눈에', durationMin: 12 },
        ],
      },
      {
        id: 's2',
        title: '본사 현황 읽기',
        lessons: [
          { id: 'l3', title: '직영점·가맹점 수의 의미', durationMin: 14 },
          { id: 'l4', title: '폐점율 추이로 보는 안정성', durationMin: 12 },
        ],
      },
      {
        id: 's3',
        title: '비용 항목 해석',
        lessons: [
          { id: 'l5', title: '가맹비·보증금·로열티 비교', durationMin: 14 },
          { id: 'l6', title: '인테리어 단가의 함정', durationMin: 10 },
        ],
      },
      {
        id: 's4',
        title: '매출 자료 검증',
        lessons: [
          { id: 'l7', title: '평균 매출이 보장이 아닌 이유', durationMin: 13 },
          { id: 'l8', title: '본사 자료 vs 점주 실제 데이터', durationMin: 12 },
        ],
      },
    ],
    createdAt: '2026-02-12',
  },
  {
    id: 'c2',
    title: '점주가 알아야 할 핵심 회계',
    subtitle: '매출·매입·재고·인건비를 매일 30분만으로 관리하기',
    category: 'finance',
    level: 'beginner',
    thumbnailColor: '#10B981',
    instructorIds: ['m3'],
    durationMin: 240,
    lessonCount: 16,
    price: 89000,
    originalPrice: 129000,
    rating: 4.8,
    reviewCount: 218,
    enrollment: 1820,
    featured: true,
    tags: ['회계', '세무', '운영'],
    description:
      '회계사 자격 없이도 매장 손익을 정확히 관리할 수 있는 실전 회계 강의. 부가세·종합소득세 신고까지 한 번에.',
    targetAudience: ['처음 매장을 시작한 점주', '세무사 없이 운영하는 점주', '월 손익을 정확히 모르고 있는 분'],
    takeaways: ['일·주·월 단위 매출 관리법', '재고 회전율 계산', '인건비 적정 비율', '부가세 신고 흐름'],
    brandCategories: ['chicken', 'cafe', 'korean', 'japanese', 'snack', 'dessert', 'beverage', 'bar'],
    curriculum: [
      { id: 's1', title: '매장 회계 기본', lessons: [
        { id: 'l1', title: '매장 회계의 5가지 축', durationMin: 14, preview: true },
        { id: 'l2', title: '하루 마감 30분 루틴', durationMin: 16 },
      ]},
      { id: 's2', title: '비용 관리', lessons: [
        { id: 'l3', title: '식자재 원가율 계산', durationMin: 18 },
        { id: 'l4', title: '인건비 적정 비율', durationMin: 16 },
      ]},
      { id: 's3', title: '세무 신고 흐름', lessons: [
        { id: 'l5', title: '부가세 신고 한눈에', durationMin: 20 },
        { id: 'l6', title: '종합소득세 + 절세 전략', durationMin: 18 },
      ]},
    ],
    createdAt: '2026-03-04',
  },
  {
    id: 'c3',
    title: '가맹점 인테리어 시공 가이드',
    subtitle: '본사 지정 vs 직접 발주 — 비용·품질 균형 잡기',
    category: 'interior',
    level: 'intermediate',
    thumbnailColor: '#64748B',
    instructorIds: ['m7'],
    durationMin: 180,
    lessonCount: 12,
    price: 119000,
    originalPrice: 159000,
    rating: 4.7,
    reviewCount: 96,
    enrollment: 540,
    featured: true,
    tags: ['인테리어', '시공', '비용'],
    description:
      '인테리어 비용은 창업비의 30-40%를 차지합니다. 본사 지정 시공의 합리적 비용 범위, 직접 발주가 가능한 항목, 견적서 검토 포인트까지.',
    targetAudience: ['창업 준비 중인 분', '인테리어 견적이 비싸게 느껴지는 분', '본사 시공 vs 직접 발주를 고민하는 분'],
    takeaways: ['평당 시공 단가 검증법', '본사 지정의 합리성 검토', '직접 발주 가능 항목', '시공 일정 + 추가비 관리'],
    brandCategories: ['chicken', 'cafe', 'korean', 'japanese', 'snack', 'dessert'],
    curriculum: [
      { id: 's1', title: '시공 비용의 구성', lessons: [
        { id: 'l1', title: '평당 단가는 어떻게 결정되나', durationMin: 18, preview: true },
        { id: 'l2', title: '간판·전기·배관·가구 항목별', durationMin: 16 },
      ]},
      { id: 's2', title: '본사 시공 검증', lessons: [
        { id: 'l3', title: '본사 지정 시공의 합리적 가격대', durationMin: 18 },
        { id: 'l4', title: '추가 견적이 발생하는 패턴', durationMin: 14 },
      ]},
      { id: 's3', title: '직접 발주 전략', lessons: [
        { id: 'l5', title: '직접 발주 가능 항목 체크리스트', durationMin: 16 },
        { id: 'l6', title: '본사 기준 통과시키는 법', durationMin: 14 },
      ]},
    ],
    createdAt: '2026-02-25',
  },
  {
    id: 'c4',
    title: '매장 인력 관리 실전',
    subtitle: '채용·교육·해고까지 — 작은 매장도 알아야 할 노동법',
    category: 'staff',
    level: 'intermediate',
    thumbnailColor: '#F97316',
    instructorIds: ['m2', 'm8'],
    durationMin: 200,
    lessonCount: 14,
    price: 109000,
    rating: 4.6,
    reviewCount: 124,
    enrollment: 720,
    featured: false,
    tags: ['인력', '노동법', '운영'],
    description:
      '5인 이하 사업장도 근로기준법 적용을 받습니다. 채용 공고 작성부터 부당해고 분쟁 방지까지.',
    targetAudience: ['직원·알바를 처음 채용하는 점주', '인력 비용 비중이 높은 매장', '근로기준법이 막막한 분'],
    takeaways: ['시급·주휴수당 계산', '근로계약서 표준 양식', '4대 보험 가입', '분쟁 방지 체크리스트'],
    brandCategories: ['chicken', 'cafe', 'korean', 'japanese', 'snack', 'bar'],
    curriculum: [
      { id: 's1', title: '채용·계약', lessons: [
        { id: 'l1', title: '근로계약서 표준 양식', durationMin: 16, preview: true },
        { id: 'l2', title: '시급·주휴수당 계산', durationMin: 14 },
      ]},
      { id: 's2', title: '교육·운영', lessons: [
        { id: 'l3', title: '신입 직원 7일 교육 매뉴얼', durationMin: 14 },
      ]},
      { id: 's3', title: '분쟁 방지', lessons: [
        { id: 'l4', title: '부당해고 분쟁 사례', durationMin: 18 },
        { id: 'l5', title: '직장 내 괴롭힘 예방', durationMin: 14 },
      ]},
    ],
    createdAt: '2026-03-15',
  },
  {
    id: 'c5',
    title: '카페 창업 A to Z',
    subtitle: '브랜드 선택부터 첫 영업일까지 — 90일 카페 창업 로드맵',
    category: 'gateway',
    level: 'beginner',
    thumbnailColor: '#A16207',
    instructorIds: ['m2', 'm1'],
    durationMin: 300,
    lessonCount: 20,
    price: 149000,
    originalPrice: 199000,
    rating: 4.8,
    reviewCount: 314,
    enrollment: 2410,
    featured: false,
    tags: ['카페', '입문', '창업'],
    description:
      '카페 창업을 90일 안에 완료하는 단계별 로드맵. 브랜드 비교부터 첫 영업일 안정화까지.',
    targetAudience: ['카페 창업을 처음 검토하는 분', '브랜드 비교 단계인 분', '카페 운영 경험이 없는 분'],
    takeaways: ['브랜드 비교 체크리스트', '입지 분석법', '인테리어 시공 일정', '오픈 첫 90일 안정화 전략'],
    brandCategories: ['cafe', 'dessert', 'beverage'],
    curriculum: [
      { id: 's1', title: '브랜드 선택', lessons: [
        { id: 'l1', title: '카페 브랜드 5가지 유형', durationMin: 16, preview: true },
        { id: 'l2', title: '저가 vs 중가 vs 프리미엄', durationMin: 14 },
      ]},
      { id: 's2', title: '입지·시공', lessons: [
        { id: 'l3', title: '카페 입지의 7가지 기준', durationMin: 18 },
        { id: 'l4', title: '시공 일정 90일 관리', durationMin: 16 },
      ]},
      { id: 's3', title: '오픈 후 안정화', lessons: [
        { id: 'l5', title: '오픈 첫 30일 매출 흐름', durationMin: 14 },
        { id: 'l6', title: 'SNS 노출로 단골 만들기', durationMin: 16 },
      ]},
    ],
    createdAt: '2026-01-28',
  },
  {
    id: 'c6',
    title: '치킨 가맹 운영 비법',
    subtitle: '본사 의존을 줄이고 매장의 자생력을 키우는 법',
    category: 'ops',
    level: 'intermediate',
    thumbnailColor: '#EA580C',
    instructorIds: ['m8'],
    durationMin: 220,
    lessonCount: 15,
    price: 119000,
    rating: 4.7,
    reviewCount: 156,
    enrollment: 980,
    featured: false,
    tags: ['치킨', '운영', '실전'],
    description:
      '7년차 치킨 다점포 점주가 직접 강의. 본사 SV에만 의존하지 않고 매장 자체의 매출 동력을 만드는 운영 노하우.',
    targetAudience: ['치킨 가맹 점주', '본사 의존도가 너무 높다고 느끼는 분', '심야 인력 운영이 고민인 분'],
    takeaways: ['주방 동선 최적화', '심야 인력 채용', '단골 관리 5단계', '본사와 협상하는 법'],
    brandCategories: ['chicken'],
    curriculum: [
      { id: 's1', title: '주방·운영', lessons: [
        { id: 'l1', title: '주방 동선 최적화', durationMin: 18, preview: true },
        { id: 'l2', title: '피크 시간대 회전율', durationMin: 14 },
      ]},
      { id: 's2', title: '인력', lessons: [
        { id: 'l3', title: '심야 인력 채용 노하우', durationMin: 16 },
      ]},
      { id: 's3', title: '본사 협상', lessons: [
        { id: 'l4', title: '본사와 협상할 때 활용할 데이터', durationMin: 18 },
      ]},
    ],
    createdAt: '2026-03-22',
  },
  {
    id: 'c7',
    title: '본사와 효과적으로 협상하기',
    subtitle: '가맹점주가 자주 놓치는 협상 카드 9가지',
    category: 'legal',
    level: 'intermediate',
    thumbnailColor: '#7C3AED',
    instructorIds: ['m4', 'm1'],
    durationMin: 160,
    lessonCount: 10,
    price: 99000,
    rating: 4.8,
    reviewCount: 87,
    enrollment: 450,
    featured: false,
    tags: ['협상', '본사', '가맹사업법'],
    description:
      '가맹계약 갱신·인테리어 재시공·광고 분담금 등 본사와 대립하기 쉬운 9가지 시점에서 점주가 활용할 수 있는 협상 카드.',
    targetAudience: ['가맹계약 갱신 앞둔 점주', '본사 지원이 부족하다고 느끼는 분', '광고 분담금 부담이 큰 분'],
    takeaways: ['협상 전 준비 자료', '본사가 양보할 수 있는 항목', '협의회 활용법', '법적 분쟁 회피 전략'],
    brandCategories: ['chicken', 'cafe', 'korean', 'japanese', 'snack', 'bar'],
    curriculum: [
      { id: 's1', title: '협상 준비', lessons: [
        { id: 'l1', title: '본사가 가장 신경 쓰는 지표', durationMin: 14, preview: true },
        { id: 'l2', title: '협상 자료 수집 체크리스트', durationMin: 16 },
      ]},
      { id: 's2', title: '시점별 협상 카드', lessons: [
        { id: 'l3', title: '갱신 시점의 9가지 카드', durationMin: 22 },
        { id: 'l4', title: '인테리어 재시공 협상', durationMin: 18 },
      ]},
    ],
    createdAt: '2026-04-02',
  },
  {
    id: 'c8',
    title: 'SNS 마케팅으로 신규 매장 자리잡기',
    subtitle: '인스타·블로그·배달앱 3단 콤보로 오픈 30일 정착',
    category: 'marketing',
    level: 'intermediate',
    thumbnailColor: '#EC4899',
    instructorIds: ['m6'],
    durationMin: 180,
    lessonCount: 12,
    price: 99000,
    rating: 4.7,
    reviewCount: 145,
    enrollment: 1020,
    featured: false,
    tags: ['SNS', '마케팅', '오픈'],
    description:
      'F&B 매장 디지털 마케팅 10년 전문가가 설계한 신규 매장 30일 정착 플랜. 인스타·블로그·배달앱 3채널 통합.',
    targetAudience: ['신규 오픈 점주', '주변 경쟁 매장이 많은 분', '마케팅 외주 비용이 부담스러운 분'],
    takeaways: ['인스타그램 SEO 기본', '블로그 후기 유도법', '배달앱 광고 운영', '30일 콘텐츠 캘린더'],
    brandCategories: ['cafe', 'dessert', 'beverage', 'chicken', 'snack'],
    curriculum: [
      { id: 's1', title: '오픈 전 준비', lessons: [
        { id: 'l1', title: '오픈 7일 전 인스타 셋업', durationMin: 14, preview: true },
        { id: 'l2', title: '블로그 첫 글 작성법', durationMin: 16 },
      ]},
      { id: 's2', title: '오픈 후 30일', lessons: [
        { id: 'l3', title: '배달앱 광고 운영', durationMin: 18 },
        { id: 'l4', title: '리뷰 1,000개 만드는 법', durationMin: 16 },
      ]},
    ],
    createdAt: '2026-03-08',
  },
  {
    id: 'c9',
    title: '점주를 위한 부가세·종합소득세',
    subtitle: '세무사 도움 없이도 신고할 수 있는 단계별 가이드',
    category: 'finance',
    level: 'beginner',
    thumbnailColor: '#16A34A',
    instructorIds: ['m3'],
    durationMin: 120,
    lessonCount: 8,
    price: 0,
    rating: 4.5,
    reviewCount: 192,
    enrollment: 2850,
    featured: false,
    tags: ['무료', '세무', '신고'],
    description:
      '부가세·종합소득세 신고는 점주가 직접 할 수 있습니다. 단계별 화면 캡처와 함께 실제 신고 과정을 보여드립니다.',
    targetAudience: ['세무사 없이 운영하는 점주', '세무 신고가 막막한 분', '신고 비용을 줄이고 싶은 분'],
    takeaways: ['부가세 신고 흐름', '종합소득세 신고 흐름', '경비 처리 가능 항목', '절세 기본 전략'],
    brandCategories: ['chicken', 'cafe', 'korean', 'japanese', 'snack', 'dessert', 'beverage', 'bar'],
    curriculum: [
      { id: 's1', title: '부가세', lessons: [
        { id: 'l1', title: '부가세 기본 개념', durationMin: 12, preview: true },
        { id: 'l2', title: '신고 화면 단계별', durationMin: 18 },
      ]},
      { id: 's2', title: '종합소득세', lessons: [
        { id: 'l3', title: '종합소득세 기본', durationMin: 14 },
        { id: 'l4', title: '신고 화면 단계별', durationMin: 18 },
      ]},
    ],
    createdAt: '2026-02-18',
  },
  {
    id: 'c10',
    title: 'POS와 배달앱 운영 효율화',
    subtitle: '데이터로 매출 + 인건비를 동시에 관리하는 법',
    category: 'digital',
    level: 'intermediate',
    thumbnailColor: '#0EA5E9',
    instructorIds: ['m6', 'm3'],
    durationMin: 150,
    lessonCount: 10,
    price: 89000,
    rating: 4.6,
    reviewCount: 78,
    enrollment: 380,
    featured: false,
    tags: ['POS', '배달앱', '데이터'],
    description:
      'POS 데이터를 활용해 시간대별 매출 + 인건비 효율을 분석하고, 배달앱 광고 ROI를 측정하는 실전 가이드.',
    targetAudience: ['POS 데이터를 활용 못하는 점주', '배달앱 광고 효과 측정이 어려운 분'],
    takeaways: ['POS 데이터 추출법', '시간대별 매출 분석', '배달앱 ROI 측정', '인력 시급 배정 최적화'],
    brandCategories: ['chicken', 'cafe', 'korean', 'japanese', 'snack', 'dessert'],
    curriculum: [
      { id: 's1', title: 'POS 데이터', lessons: [
        { id: 'l1', title: 'POS 데이터 추출법', durationMin: 14, preview: true },
        { id: 'l2', title: '시간대별 매출 분석', durationMin: 16 },
      ]},
      { id: 's2', title: '배달앱', lessons: [
        { id: 'l3', title: '배달앱 광고 ROI 측정', durationMin: 18 },
      ]},
    ],
    createdAt: '2026-04-05',
  },
  {
    id: 'c11',
    title: '1인 매장 운영의 실제',
    subtitle: '인건비를 매출의 30%로 묶고 본인 시간도 지키는 법',
    category: 'ops',
    level: 'beginner',
    thumbnailColor: '#3B82F6',
    instructorIds: ['m2', 'm5'],
    durationMin: 140,
    lessonCount: 10,
    price: 79000,
    rating: 4.7,
    reviewCount: 213,
    enrollment: 1480,
    featured: false,
    tags: ['1인 운영', '저자본', '실전'],
    description:
      '1인 운영의 매출 천장과 인건비 균형을 어떻게 잡을지, 본인 휴무·자동화·하루 8시간 안에 끝내는 운영 루틴까지.',
    targetAudience: ['1인 매장 점주', '인건비 부담이 큰 분', '자영업 번아웃을 피하고 싶은 분'],
    takeaways: ['1인 운영 매출 천장', '메뉴 단순화', 'POS·결제 자동화', '본인 휴무 운영법'],
    brandCategories: ['cafe', 'snack', 'dessert', 'beverage'],
    curriculum: [
      { id: 's1', title: '운영 효율', lessons: [
        { id: 'l1', title: '메뉴 단순화', durationMin: 14, preview: true },
        { id: 'l2', title: '결제·POS 자동화', durationMin: 14 },
      ]},
      { id: 's2', title: '시간 관리', lessons: [
        { id: 'l3', title: '하루 8시간 루틴', durationMin: 14 },
        { id: 'l4', title: '본인 휴무 + 임시 인력', durationMin: 16 },
      ]},
    ],
    createdAt: '2026-03-12',
  },
  {
    id: 'c12',
    title: '가맹계약서 분쟁 사례 분석',
    subtitle: '실제 분쟁 30건에서 배우는 가맹점주 보호 전략',
    category: 'legal',
    level: 'advanced',
    thumbnailColor: '#A78BFA',
    instructorIds: ['m4'],
    durationMin: 280,
    lessonCount: 18,
    price: 159000,
    originalPrice: 199000,
    rating: 4.9,
    reviewCount: 64,
    enrollment: 320,
    featured: false,
    tags: ['법률', '분쟁', '심화'],
    description:
      '가맹사업법·상가건물 임대차보호법 실제 분쟁 30건을 사례 분석. 어느 시점에 어떤 자료를 모아야 했는지 점주 관점에서 정리.',
    targetAudience: ['가맹사업 운영 중인 점주', '본사와 갈등이 있는 분', '계약 갱신을 앞둔 분'],
    takeaways: ['주요 분쟁 사례 30건', '점주 측 자료 확보법', '분쟁 단계별 대응', '소송 회피 전략'],
    brandCategories: ['chicken', 'cafe', 'korean', 'japanese', 'snack', 'dessert', 'beverage', 'bar'],
    curriculum: [
      { id: 's1', title: '인테리어 분쟁', lessons: [
        { id: 'l1', title: '강제 재시공 분쟁 10건', durationMin: 22, preview: true },
      ]},
      { id: 's2', title: '권리금 분쟁', lessons: [
        { id: 'l2', title: '권리금 회수 분쟁 10건', durationMin: 22 },
      ]},
      { id: 's3', title: '계약 갱신 분쟁', lessons: [
        { id: 'l3', title: '갱신 거절 분쟁 10건', durationMin: 22 },
      ]},
    ],
    createdAt: '2026-04-12',
  },
]

export const FEATURED_COURSES = COURSES.filter((c) => c.featured)
export const FREE_COURSES = COURSES.filter((c) => c.price === 0)
export const FEATURED_MENTORS = MENTORS.filter((m) => m.featured)

export function popularCourses(limit = 6): MockCourse[] {
  return [...COURSES].sort((a, b) => b.enrollment - a.enrollment).slice(0, limit)
}

export function coursesByCategory(category: string): MockCourse[] {
  return COURSES.filter((c) => c.category === category)
}

export function coursesByInstructor(instructorId: string): MockCourse[] {
  return COURSES.filter((c) => c.instructorIds.includes(instructorId))
}
