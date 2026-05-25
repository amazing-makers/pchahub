// Mock event data for themanual — live webinars, workshops, special lectures, mentor Q&A

export type EventType = 'webinar' | 'workshop' | 'lecture' | 'qa'
export type EventFormat = 'online' | 'offline' | 'hybrid'

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  webinar: '웨비나',
  workshop: '워크샵',
  lecture: '특강',
  qa: '멘토 Q&A',
}

export const EVENT_FORMAT_LABEL: Record<EventFormat, string> = {
  online: '온라인',
  offline: '오프라인',
  hybrid: '온·오프라인',
}

export interface MockEvent {
  id: string
  title: string
  type: EventType
  host: string
  hostTitle: string
  date: string
  endDate: string
  durationMin: number
  format: EventFormat
  location?: string
  price: number
  maxAttendees: number
  currentAttendees: number
  category: string
  categoryLabel: string
  excerpt: string
  highlights: string[]
  tags: string[]
  coverColor: string
  featured: boolean
  registrationOpen: boolean
  registrationDeadline: string
}

export const EVENTS: MockEvent[] = [
  {
    id: 'ev1',
    title: '정보공개서 완전 정복 웨비나',
    type: 'webinar',
    host: '김지훈',
    hostTitle: '전직 공정위 조사관 · 프랜차이즈 법률 자문',
    date: '2026-06-10T19:00:00',
    endDate: '2026-06-10T21:00:00',
    durationMin: 120,
    format: 'online',
    price: 0,
    maxAttendees: 200,
    currentAttendees: 143,
    category: 'legal',
    categoryLabel: '법률·계약',
    excerpt: '가맹 계약 전 반드시 읽어야 하는 정보공개서. 폐점율·광고비·로열티 항목에서 놓치기 쉬운 독소 조항을 공정위 전직 조사관이 직접 짚어드립니다.',
    highlights: [
      '정보공개서 14개 필수 항목 체계적 해석',
      '폐점율 수치 제대로 읽는 법',
      '광고·판촉비 별도 징수 조항 확인하기',
      '본사 분쟁 이력 조회하는 실전 방법',
      '계약서 서명 전 변호사 활용 타이밍',
    ],
    tags: ['정보공개서', '계약', '법률', '무료'],
    coverColor: '#7C3AED',
    featured: true,
    registrationOpen: true,
    registrationDeadline: '2026-06-09',
  },
  {
    id: 'ev2',
    title: '배달앱 광고비 절반으로 줄이기',
    type: 'lecture',
    host: '박서연',
    hostTitle: '치킨 프랜차이즈 3년차 점주 · 월 ROI 310%',
    date: '2026-06-17T20:00:00',
    endDate: '2026-06-17T21:30:00',
    durationMin: 90,
    format: 'online',
    price: 29000,
    maxAttendees: 150,
    currentAttendees: 87,
    category: 'marketing',
    categoryLabel: '마케팅',
    excerpt: '배달의민족·쿠팡이츠 광고 예산을 줄이면서도 주문수를 유지한 실전 사례. A/B 테스트로 검증된 광고 세팅 방법을 그대로 공개합니다.',
    highlights: [
      '배달앱 3사 광고 상품 구조와 실제 효과',
      '스마트플러스 vs 깃발 — 매장 상황별 최적 선택',
      '오프 피크 시간 광고비 절감 전략',
      '리뷰·별점 관리와 광고 효율의 상관관계',
      '월 광고비 30% 절감 세팅 실습',
    ],
    tags: ['배달앱', '마케팅', '광고비', '실전'],
    coverColor: '#DC2626',
    featured: true,
    registrationOpen: true,
    registrationDeadline: '2026-06-16',
  },
  {
    id: 'ev3',
    title: '가맹 계약서 체크리스트 워크샵',
    type: 'workshop',
    host: '이민수',
    hostTitle: '가맹거래사 · 프랜차이즈 계약 전문 법무사',
    date: '2026-06-21T10:00:00',
    endDate: '2026-06-21T16:00:00',
    durationMin: 360,
    format: 'offline',
    location: '서울 강남구 테헤란로 (상세 주소는 신청 후 안내)',
    price: 59000,
    maxAttendees: 30,
    currentAttendees: 22,
    category: 'legal',
    categoryLabel: '법률·계약',
    excerpt: '실제 가맹 계약서를 인쇄해서 직접 체크해보는 오프라인 워크샵. 법무사와 함께 20개 체크리스트를 하나씩 짚어가며, 계약 전에 발견해야 할 문제를 찾는 연습을 합니다.',
    highlights: [
      '표준 가맹 계약서 20개 체크리스트 실습',
      '독소 조항 사례 + 수정 협상 전략',
      '가맹비·보증금 반환 조건 분석',
      '상권 보호 범위 조항 해석',
      '소그룹 Q&A (최대 5인 1팀)',
    ],
    tags: ['계약서', '워크샵', '오프라인', '소그룹'],
    coverColor: '#0891B2',
    featured: true,
    registrationOpen: true,
    registrationDeadline: '2026-06-18',
  },
  {
    id: 'ev4',
    title: '멘토 Q&A: 폐업·양도 실전 전략',
    type: 'qa',
    host: '최현우',
    hostTitle: '전직 본사 SV · 가맹점 컨설턴트 8년',
    date: '2026-06-28T15:00:00',
    endDate: '2026-06-28T16:30:00',
    durationMin: 90,
    format: 'online',
    price: 0,
    maxAttendees: 100,
    currentAttendees: 41,
    category: 'operations',
    categoryLabel: '매장 운영',
    excerpt: '매출이 줄거나 계약 갱신 여부를 고민 중이라면. 폐업·양도를 실제로 경험한 멘토가 가장 많이 받는 질문에 생생하게 답해드립니다.',
    highlights: [
      '계약 만료 전 양도 가능 여부와 절차',
      '양도가 산정 기준과 협상 전략',
      '폐업 시 보증금 회수 방법',
      '본사와의 분쟁 없이 계약 종료하는 법',
      '실시간 질의응답 (사전 질문 수집)',
    ],
    tags: ['폐업', '양도', 'Q&A', '무료'],
    coverColor: '#059669',
    featured: false,
    registrationOpen: true,
    registrationDeadline: '2026-06-27',
  },
  {
    id: 'ev5',
    title: 'SNS·단골 마케팅 실전 특강',
    type: 'lecture',
    host: '강미래',
    hostTitle: '카페 프랜차이즈 4호점 운영 · SNS 팔로워 12만',
    date: '2026-07-05T19:30:00',
    endDate: '2026-07-05T21:00:00',
    durationMin: 90,
    format: 'online',
    price: 39000,
    maxAttendees: 200,
    currentAttendees: 58,
    category: 'marketing',
    categoryLabel: '마케팅',
    excerpt: '4개 매장을 운영하며 SNS로 실제 단골을 만든 점주의 전략. 인스타그램·블로그·카카오채널을 동시에 활용해 광고비 없이 재방문율을 높이는 방법.',
    highlights: [
      '인스타그램 릴스 매장 콘텐츠 알고리즘 이해',
      '단골 만드는 카카오채널 쿠폰·소식 전략',
      '네이버 블로그 상위노출 점주가 직접 쓰는 법',
      '리뷰 요청 없이 자연스럽게 후기 받기',
      '월 2시간으로 SNS 운영하는 루틴',
    ],
    tags: ['SNS', '마케팅', '단골', '인스타그램'],
    coverColor: '#F59E0B',
    featured: false,
    registrationOpen: true,
    registrationDeadline: '2026-07-04',
  },
  {
    id: 'ev6',
    title: '점주 손익 계산법 실전 워크샵',
    type: 'workshop',
    host: '윤성준',
    hostTitle: '공인회계사 · 소상공인 세무 전문',
    date: '2026-07-12T14:00:00',
    endDate: '2026-07-12T17:00:00',
    durationMin: 180,
    format: 'online',
    price: 59000,
    maxAttendees: 80,
    currentAttendees: 34,
    category: 'finance',
    categoryLabel: '회계·세무',
    excerpt: '월 매출은 알지만 정작 손에 남는 돈이 얼마인지 모르는 점주를 위한 실습형 워크샵. 엑셀 손익계산서를 직접 작성하며 숫자 감각을 키웁니다.',
    highlights: [
      '매출·원가·인건비·임차료 항목 분리 방법',
      '배달 수수료·카드 수수료 실제 반영법',
      '부가세 신고 전 손익 최적화',
      '월·분기·연간 손익 템플릿 제공 (엑셀)',
      '절세 포인트 5가지 체크',
    ],
    tags: ['손익', '회계', '세무', '워크샵'],
    coverColor: '#0EA5E9',
    featured: false,
    registrationOpen: true,
    registrationDeadline: '2026-07-10',
  },
  {
    id: 'ev7',
    title: '그랜드 오픈 마케팅 전략 특강',
    type: 'lecture',
    host: '박서연',
    hostTitle: '치킨 프랜차이즈 3년차 점주 · 월 ROI 310%',
    date: '2026-05-10T19:00:00',
    endDate: '2026-05-10T20:30:00',
    durationMin: 90,
    format: 'online',
    price: 29000,
    maxAttendees: 180,
    currentAttendees: 180,
    category: 'marketing',
    categoryLabel: '마케팅',
    excerpt: '오픈 첫 달이 매출의 모든 것을 결정합니다. SNS·배달앱·오픈런 이벤트를 동시에 터뜨리는 그랜드 오픈 마케팅 전략.',
    highlights: [
      '오픈 D-7부터 D+30 마케팅 타임라인',
      '배달앱 오픈 혜택 최대한 활용하기',
      '인플루언서 협업 비용 절약 방법',
      '오픈런 이벤트 기획 실전 사례',
    ],
    tags: ['오픈', '마케팅', '그랜드오픈'],
    coverColor: '#DC2626',
    featured: false,
    registrationOpen: false,
    registrationDeadline: '2026-05-09',
  },
]

export const UPCOMING_EVENTS = EVENTS.filter(
  (e) => new Date(e.date) > new Date('2026-05-25'),
)
export const PAST_EVENTS = EVENTS.filter(
  (e) => new Date(e.date) <= new Date('2026-05-25'),
)
export const FEATURED_EVENTS = EVENTS.filter((e) => e.featured)

export function eventById(id: string): MockEvent | undefined {
  return EVENTS.find((e) => e.id === id)
}

export function spotsLeft(event: MockEvent): number {
  return Math.max(0, event.maxAttendees - event.currentAttendees)
}

export function isFull(event: MockEvent): boolean {
  return event.currentAttendees >= event.maxAttendees
}

export function formatEventDate(isoDate: string): string {
  const d = new Date(isoDate)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const weekday = weekdays[d.getDay()]
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${month}월 ${day}일 (${weekday}) ${hours}:${minutes}`
}
