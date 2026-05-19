// Mock data for gongganhansu — interior + contractor directory.

import { contractorHero, portfolioPhotoSet } from './portfolio-images'

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
  /** Real cover image — auto-filled below. */
  heroImage: string
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
  /** Real hero image — auto-filled below. */
  heroImage: string
  /** Real gallery images — auto-filled below. */
  gallery: string[]
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

type RawContractor = Omit<MockContractor, 'heroImage'>

const RAW_CONTRACTORS: RawContractor[] = [
  {
    id: 'c1',
    name: '씨에스인테리어',
    region: '서울',
    specialties: ['cafe', 'dessert', 'beverage'],
    foundedYear: 2014,
    projectCount: 217,
    avgPricePerPyeong: 95,
    budgetRange: '3,000만 ~ 1억 5천만원',
    rating: 4.8,
    reviewCount: 194,
    brandColor: '#64748B',
    tagline: 'F&B 카페·디저트 매장 시공 전문',
    bio: [
      'F&B 매장 시공 11년차 상업 공간 전문 시공사. 강남·홍대·연남·성수 등 핵심 상권 매장 217건 시공 경험을 보유하고 있습니다.',
      '저가형 카페부터 프리미엄 디저트 매장까지 폭넓은 가격대를 다루며, 본사 지정 시공과 직접 발주 모두 처리 가능합니다. 본사 가이드라인 통과율 98%.',
    ],
    highlights: [
      '카페·디저트 카테고리 시공 153건',
      '평균 시공 일수 30일 (지연 시 일당 5만원 배상)',
      '본사 가이드라인 통과율 98%',
      '시공 후 6개월 무상 AS',
    ],
    includes: ['디자인 컨설팅', '평면 도면 + 3D 시뮬레이션', '시공 + 감리', '간판·가구·조명 일괄', '6개월 무상 AS'],
    verified: true,
    featured: true,
    portfolioIds: ['p1', 'p3', 'p7', 'p10'],
  },
  {
    id: 'c2',
    name: '동문공간디자인',
    region: '서울',
    specialties: ['korean', 'japanese', 'bar'],
    foundedYear: 2016,
    projectCount: 142,
    avgPricePerPyeong: 110,
    budgetRange: '4,000만 ~ 2억원',
    rating: 4.9,
    reviewCount: 127,
    brandColor: '#475569',
    tagline: '한식·일식 다이닝 매장 주방 동선 전문',
    bio: [
      '한식·일식 다이닝 매장 시공 9년차. 주방 동선 효율과 정성 들인 마감으로 점주 추천 비율 94%를 달성하고 있습니다.',
      '점심·저녁·심야 멀티타임 운영 매장에 특화된 zone 설계가 강점이며, 배달·홀·단체석 복합 운영도 전문입니다.',
    ],
    highlights: [
      '한식·일식 다이닝 시공 98건',
      '주방 동선 최적화 컨설팅 포함',
      '멀티타임 운영 매장 설계 전문',
      '점주 추천 비율 94% · 12개월 무상 AS',
    ],
    includes: ['디자인 + 도면', '주방 동선 컨설팅', '시공 + 감리', '주방 설비', '12개월 무상 AS'],
    verified: true,
    featured: true,
    portfolioIds: ['p2', 'p4', 'p11'],
  },
  {
    id: 'c3',
    name: '한강인테리어',
    region: '경기',
    specialties: ['chicken', 'snack', 'korean'],
    foundedYear: 2013,
    projectCount: 318,
    avgPricePerPyeong: 75,
    budgetRange: '2,000만 ~ 8,000만원',
    rating: 4.6,
    reviewCount: 281,
    brandColor: '#64748B',
    tagline: '치킨·분식 가맹점 가성비 시공 1위',
    bio: [
      '가성비 + 빠른 시공이 강점인 가맹점 전문 시공사. 치킨·분식·한식 카테고리 매장 시공 196건을 완료했습니다.',
      '경기 지역 자재상과 직거래·시공팀 직영 체계로 평당 75만원의 합리적 단가를 유지합니다. 본사 지정 + 직접 발주 모두 가능.',
    ],
    highlights: [
      '평당 75만원 가성비 단가',
      '평균 시공 일수 21일',
      '치킨·분식·한식 카테고리 196건',
      '경기·인천 지역 출장비 무료',
    ],
    includes: ['평면 + 도면', '시공 + 감리', '간판·기본 가구', '3개월 무상 AS'],
    verified: true,
    featured: false,
    portfolioIds: ['p5', 'p6', 'p13'],
  },
  {
    id: 'c4',
    name: '비주얼스튜디오',
    region: '서울',
    specialties: ['dessert', 'cafe', 'beverage'],
    foundedYear: 2019,
    projectCount: 74,
    avgPricePerPyeong: 130,
    budgetRange: '5,000만 ~ 2억 5천만원',
    rating: 4.9,
    reviewCount: 67,
    brandColor: '#94A3B8',
    tagline: 'SNS 핫플 디저트·카페 비주얼 시공 전문',
    bio: [
      'SNS 노출 효과를 극대화하는 디저트·카페 시공 전문 스튜디오. 성수·연남·해운대 인스타 핫플 매장 48건 시공.',
      '시공과 동시에 매장 비주얼 자산(사진 60장+영상 8개)을 제작하여 오픈 당일부터 SNS 콘텐츠를 보유할 수 있습니다.',
    ],
    highlights: [
      'SNS 핫플 매장 48건',
      '인스타그램 그리드 컨설팅 포함',
      '시공 완료 시 사진 자산 60장 + 영상 8개 제공',
      '6개월 AS + SNS 컨설팅',
    ],
    includes: ['디자인 + 도면', '시공 + 감리', 'SNS 사진·영상 자산', '6개월 AS + SNS 컨설팅'],
    verified: true,
    featured: true,
    portfolioIds: ['p8', 'p9', 'p15'],
  },
  {
    id: 'c5',
    name: '나무와공간',
    region: '경기',
    specialties: ['cafe', 'korean'],
    foundedYear: 2012,
    projectCount: 384,
    avgPricePerPyeong: 90,
    budgetRange: '2,500만 ~ 1억 2천만원',
    rating: 4.7,
    reviewCount: 352,
    brandColor: '#A16207',
    tagline: '원목 가구·자연 톤 상업 공간 시공',
    bio: [
      '원목 + 자연 톤을 활용한 따뜻한 매장 시공 13년차. 카페 + 한식 분야 매장 302건을 시공했으며 자체 가구 공방을 운영합니다.',
      '오래 가는 마감과 자체 제작 원목 가구로 5년 후에도 컨디션 유지되는 매장을 만듭니다.',
    ],
    highlights: [
      '원목·자연 톤 매장 302건',
      '5년 후에도 컨디션 유지하는 마감 보증',
      '자체 가구 공방 직영 — 외주 없음',
      '경기·인천 출장비 무료',
    ],
    includes: ['디자인 + 도면', '원목 가구 자체 제작', '시공 + 감리', '6개월 AS'],
    verified: true,
    featured: false,
    portfolioIds: ['p12', 'p14'],
  },
  {
    id: 'c6',
    name: '부산공간랩',
    region: '부산',
    specialties: ['bar', 'japanese', 'chicken'],
    foundedYear: 2015,
    projectCount: 178,
    avgPricePerPyeong: 80,
    budgetRange: '2,500만 ~ 1억원',
    rating: 4.7,
    reviewCount: 159,
    brandColor: '#7C3AED',
    tagline: '부산·울산·경남 상업 공간 시공 전문',
    bio: [
      '부산·울산·경남 지역 전문 시공사 10년차. 야간 상권 + 관광 상권 매장 시공 112건을 완료했습니다.',
      '지역 자재상 + 시공팀 직영으로 수도권 대비 단가 경쟁력을 유지하며 시공 일수 보장제를 운영합니다.',
    ],
    highlights: [
      '부산·울산·경남 출장비 무료',
      '지역 자재상 직거래로 단가 절감',
      '야간 상권·관광 상권 매장 112건',
      '시공 일수 보장제 (지연 시 일당 5만원 배상)',
    ],
    includes: ['디자인 + 도면', '시공 + 감리', '주방 설비', '6개월 AS + 지연 보장'],
    verified: true,
    featured: false,
    portfolioIds: ['p16', 'p17'],
  },
  {
    id: 'c7',
    name: '원팩인테리어',
    region: '서울',
    specialties: ['snack', 'beverage', 'chicken'],
    foundedYear: 2018,
    projectCount: 163,
    avgPricePerPyeong: 70,
    budgetRange: '1,500만 ~ 6,000만원',
    rating: 4.5,
    reviewCount: 148,
    brandColor: '#0EA5E9',
    tagline: '소형 가맹점 시공 — 평당 70만원·18일',
    bio: [
      '평당 70만원 이하 소형 가맹점 시공 전문. 분식·음료·치킨 카테고리 10~20평 매장 163건을 시공했습니다.',
      '빠른 시공·합리적 단가를 핵심 경쟁력으로, 본사 지정 시공 통과율 95%를 유지합니다.',
    ],
    highlights: [
      '평당 70만원 이하 단가',
      '10~20평 소형 매장 전문',
      '평균 시공 일수 18일',
      '본사 지정 시공 통과율 95%',
    ],
    includes: ['평면 + 도면', '시공 + 감리', '간판·기본 가구', '3개월 AS'],
    verified: true,
    featured: false,
    portfolioIds: ['p18'],
  },
  {
    id: 'c8',
    name: '대경인테리어',
    region: '대구',
    specialties: ['snack', 'korean', 'cafe'],
    foundedYear: 2016,
    projectCount: 134,
    avgPricePerPyeong: 78,
    budgetRange: '2,000만 ~ 8,000만원',
    rating: 4.5,
    reviewCount: 118,
    brandColor: '#16A34A',
    tagline: '대구·경북 가맹점 전문 시공',
    bio: [
      '대구·경북 지역 가맹점 시공 9년차. 동성로·수성구·구미·포항 등 지역 상권 매장 134건을 시공했습니다.',
      '지역 시공팀 + 자재상 직영으로 수도권보다 평당 단가 15% 낮게 시공 가능합니다.',
    ],
    highlights: [
      '대구·경북 출장비 무료',
      '평당 78만원 안정 단가',
      '학원가·상업 상권 다수',
      '6개월 AS 보장',
    ],
    includes: ['디자인 + 도면', '시공 + 감리', '간판·가구', '6개월 AS'],
    verified: true,
    featured: false,
    portfolioIds: [],
  },
  {
    id: 'c9',
    name: '케이앤씨인테리어',
    region: '인천',
    specialties: ['cafe', 'beverage', 'dessert'],
    foundedYear: 2017,
    projectCount: 108,
    avgPricePerPyeong: 85,
    budgetRange: '2,500만 ~ 1억원',
    rating: 4.6,
    reviewCount: 97,
    brandColor: '#0891B2',
    tagline: '인천·부천·김포 카페·음료 시공 전문',
    bio: [
      '인천·부천·김포 서부권 카페·음료 매장 시공 8년차. 신도시 상권 + 구도심 상권 매장 108건을 완료했습니다.',
      '인천 검단·청라·송도 신도시 카페 매장 시공 경험이 특히 풍부하며 지역 자재상 직거래로 단가 경쟁력을 확보합니다.',
    ],
    highlights: [
      '인천·부천·김포 출장비 무료',
      '신도시 카페 매장 시공 68건',
      '평당 85만원 합리적 단가',
      '6개월 무상 AS',
    ],
    includes: ['디자인 + 도면', '시공 + 감리', '가구·조명', '6개월 AS'],
    verified: true,
    featured: false,
    portfolioIds: [],
  },
  {
    id: 'c10',
    name: '에이치디자인스튜디오',
    region: '서울',
    specialties: ['bar', 'japanese', 'cafe'],
    foundedYear: 2020,
    projectCount: 62,
    avgPricePerPyeong: 120,
    budgetRange: '4,000만 ~ 2억원',
    rating: 4.8,
    reviewCount: 54,
    brandColor: '#1E293B',
    tagline: '이태원·홍대·강남 야간 상권 다이닝 전문',
    bio: [
      '야간 다이닝 + 주점 매장 인테리어 전문 스튜디오. 이태원·홍대·강남 핵심 상권 야간 매장 62건을 시공했습니다.',
      '조명 연출·분위기 설계에 특히 강하며, 낮과 밤 두 가지 분위기를 내는 조명 시스템 설계가 대표 강점입니다.',
    ],
    highlights: [
      '이태원·홍대·강남 야간 상권 62건',
      '조명 시스템 설계 전문 (낮/밤 2-mode)',
      '야간 영업 분위기 연출 특화',
      '12개월 AS',
    ],
    includes: ['디자인 + 도면', '시공 + 감리', '조명 시스템 설계', '12개월 AS'],
    verified: true,
    featured: false,
    portfolioIds: ['p19'],
  },
  {
    id: 'c11',
    name: '이노스페이스',
    region: '서울',
    specialties: ['korean', 'snack', 'beverage'],
    foundedYear: 2015,
    projectCount: 198,
    avgPricePerPyeong: 88,
    budgetRange: '3,000만 ~ 1억 2천만원',
    rating: 4.7,
    reviewCount: 176,
    brandColor: '#059669',
    tagline: '서울 전 지역 가맹점 일괄 시공',
    bio: [
      '서울 전 지역 가맹점 시공 11년차. 강북·노원·도봉·은평 등 서울 외곽 상권부터 강남·서초·송파 핵심 상권까지 198건을 시공했습니다.',
      '한식·분식·음료 카테고리 본사 지정 시공 통과 경험이 풍부하며 일괄 시공 + AS 체계를 직영으로 운영합니다.',
    ],
    highlights: [
      '서울 전 지역 출장비 무료',
      '본사 지정 시공 통과율 97%',
      '한식·분식 카테고리 148건',
      '6개월 무상 AS',
    ],
    includes: ['디자인 + 도면', '시공 + 감리', '간판·가구', '6개월 AS'],
    verified: true,
    featured: false,
    portfolioIds: [],
  },
  {
    id: 'c12',
    name: '그린앤스페이스',
    region: '경기',
    specialties: ['cafe', 'korean', 'dessert'],
    foundedYear: 2019,
    projectCount: 87,
    avgPricePerPyeong: 92,
    budgetRange: '3,000만 ~ 1억 2천만원',
    rating: 4.6,
    reviewCount: 78,
    brandColor: '#15803D',
    tagline: '식물·자연 소재 친환경 매장 인테리어',
    bio: [
      '식물 + 자연 소재를 활용한 친환경 매장 인테리어 전문. 경기 수원·용인·화성·평택 신도시 매장 87건을 시공했습니다.',
      '친환경 자재 + 실내 식물 배치 설계가 특화되어 있으며, 건강·웰니스 콘셉트 매장에 특히 강합니다.',
    ],
    highlights: [
      '경기 남부·서부 출장비 무료',
      '친환경 자재 + 식물 배치 설계 포함',
      '웰니스·건강 콘셉트 매장 전문',
      '6개월 AS',
    ],
    includes: ['디자인 + 도면', '친환경 자재 시공', '식물 배치 설계', '6개월 AS'],
    verified: true,
    featured: false,
    portfolioIds: [],
  },
  {
    id: 'c13',
    name: '광주공간디자인',
    region: '광주',
    specialties: ['korean', 'cafe', 'snack'],
    foundedYear: 2014,
    projectCount: 156,
    avgPricePerPyeong: 72,
    budgetRange: '1,800만 ~ 7,000만원',
    rating: 4.5,
    reviewCount: 138,
    brandColor: '#DC2626',
    tagline: '광주·전남·전북 가맹점 전문',
    bio: [
      '광주·전남·전북 지역 가맹점 시공 12년차. 충장로·상무지구·첨단지구 등 광주 핵심 상권 매장 156건을 시공했습니다.',
      '지역 자재상 직거래 + 시공팀 직영으로 수도권 대비 단가 경쟁력을 확보하며 지역 본사 가이드라인 통과 경험이 풍부합니다.',
    ],
    highlights: [
      '광주·전남·전북 출장비 무료',
      '평당 72만원 지역 가성비 단가',
      '지역 상권 매장 156건',
      '6개월 AS',
    ],
    includes: ['디자인 + 도면', '시공 + 감리', '간판·가구', '6개월 AS'],
    verified: false,
    featured: false,
    portfolioIds: [],
  },
  {
    id: 'c14',
    name: '프라임인테리어',
    region: '서울',
    specialties: ['cafe', 'dessert', 'bar'],
    foundedYear: 2011,
    projectCount: 452,
    avgPricePerPyeong: 100,
    budgetRange: '3,500만 ~ 2억원',
    rating: 4.8,
    reviewCount: 416,
    brandColor: '#B45309',
    tagline: '15년 경력 · 누적 시공 452건',
    bio: [
      '15년 경력 상업 공간 전문 시공사. 카페·디저트·주점 카테고리 누적 452건 시공으로 서울 최다 시공 실적을 보유합니다.',
      '대형 가맹 본사(메가커피·이디야·컴포즈 등) 지정 시공 파트너로 등록되어 있으며 월 최대 22건 동시 시공 체계를 운영합니다.',
    ],
    highlights: [
      '누적 시공 452건 — 서울 최다',
      '메가커피·이디야·컴포즈 지정 파트너',
      '월 22건 동시 시공 체계',
      '12개월 무상 AS',
    ],
    includes: ['디자인 + 도면', '시공 + 감리', '간판·가구·조명 일괄', '12개월 무상 AS'],
    verified: true,
    featured: true,
    portfolioIds: ['p20'],
  },
  {
    id: 'c15',
    name: '스페이스온',
    region: '경기',
    specialties: ['chicken', 'bar', 'snack'],
    foundedYear: 2018,
    projectCount: 124,
    avgPricePerPyeong: 82,
    budgetRange: '2,500만 ~ 9,000만원',
    rating: 4.6,
    reviewCount: 109,
    brandColor: '#7C3AED',
    tagline: '경기 북부·의정부·양주·동두천 가맹점',
    bio: [
      '경기 북부 지역 가맹점 시공 전문. 의정부·양주·동두천·포천·연천 등 경기 북부 상권 124건을 시공했습니다.',
      '수도권 시공사가 잘 커버하지 않는 경기 북부 외곽 지역을 전문적으로 담당하며 주한미군 주둔 지역 상권 경험도 보유합니다.',
    ],
    highlights: [
      '경기 북부 전 지역 출장비 무료',
      '의정부·양주·동두천·포천 매장 124건',
      '주한미군 주둔 상권 시공 경험',
      '6개월 AS',
    ],
    includes: ['디자인 + 도면', '시공 + 감리', '간판·가구', '6개월 AS'],
    verified: false,
    featured: false,
    portfolioIds: [],
  },
]

export const CONTRACTORS: MockContractor[] = RAW_CONTRACTORS.map((c) => ({
  ...c,
  heroImage: contractorHero(c.id),
}))

type RawPortfolio = Omit<MockPortfolioItem, 'heroImage' | 'gallery'>

const RAW_PORTFOLIO: RawPortfolio[] = [
  {
    id: 'p1',
    title: '메가커피 홍대입구점',
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
      '메가커피 홍대입구점은 저가형 스페셜티 카페 콘셉트로 14평 매장에 평당 매출 +30%를 만들어야 했습니다.',
      '회전율을 위해 카운터 + 셀프 픽업 동선을 입구에서 5초 안에 끝나도록 설계했고, 좌석은 좁고 짧은 체류를 유도하는 카운터형으로 배치했습니다.',
      'SNS 비주얼은 노출 콘크리트 벽 + 우드 톤 가구 + 따뜻한 조명으로 인스타그램 그리드에 어울리도록 통일했습니다. 오픈 3주 만에 인근 매장 대비 매출 1.3배.',
    ],
    tags: ['저가형카페', 'SNS', '회전율', '14평'],
    challenges: [
      {
        problem: '14평에서 점심 피크 객수 +60% 처리',
        solution: '입구 → 카운터 → 픽업 → 카운터 좌석으로 직선 동선, 평균 응대 시간 90초 단축',
      },
      {
        problem: 'SNS 노출용 비주얼 자산 부족',
        solution: '시공 마지막 1주 사진작가 동행 → 매장 자산 라이브러리 60장 + 영상 8개 확보',
      },
    ],
    featured: true,
    imageCount: 18,
  },
  {
    id: 'p2',
    title: '한솥도시락 판교테크노밸리점',
    category: 'korean',
    contractorId: 'c2',
    region: '경기',
    district: '성남시 분당구',
    area: 22,
    budget: 6800,
    durationDays: 34,
    completedAt: '2026-01-25',
    imageColors: ['#16A34A', '#22C55E', '#4ADE80'],
    excerpt: 'IT 단지 점심 객수 최대화 — 22평 + 동선 + 주방 효율.',
    body: [
      '판교 테크노밸리 한식 도시락 매장. 점심 1시간에 평균 객수 90명을 받아야 손익이 맞는 위치였습니다.',
      '주방 + 카운터 + 셀프 픽업 + 홀 4개 zone을 분리하고, 각 zone 동선이 겹치지 않도록 설계했습니다.',
      '주방은 90명/시간 처리량을 기준으로 그릴 + 보온고 + 포장 라인을 평행 배치했고, 인력 2명으로 운영 가능합니다. 오픈 첫 주 점심 최대 객수 96명 달성.',
    ],
    tags: ['한식', '도시락', '점심', '주방동선', '판교'],
    challenges: [
      {
        problem: '점심 1시간 동안 90명 객수 처리',
        solution: '주방·카운터·픽업·홀 4-zone 분리. 동선 겹침 0건',
      },
      {
        problem: '배달 + 매장 객수 동시 처리',
        solution: '배달 픽업 zone 별도 분리 — 매장 객수 동선과 겹침 없음',
      },
    ],
    featured: true,
    imageCount: 22,
  },
  {
    id: 'p3',
    title: '카페봄봄 성수점',
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
      '시공 마지막 주 사진작가가 동행해 매장 자산 80장 + 영상 12개를 확보했습니다. 오픈 2주차 인스타그램 팔로워 3,800명 돌파.',
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
    title: '하코야 광화문점',
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
      '광화문 오피스 상권 이자카야. 점심에는 회전율, 저녁에는 술 + 요리 다이닝 두 가지 모드로 운영되어야 했습니다.',
      '카운터 + 4인 좌석 + 6인 단체석을 분리하여 시간대별 유연 운영이 가능하도록 했습니다. 점심엔 카운터 위주, 저녁엔 좌석 위주로 자연스럽게 객층이 분리됩니다.',
      '조명은 점심 2,700K 밝은 톤, 저녁 1,800K 어두운 따뜻한 톤으로 자동 전환되도록 시스템을 구성했습니다.',
    ],
    tags: ['일식', '이자카야', '오피스상권', '멀티타임'],
    challenges: [
      {
        problem: '점심·저녁 다른 객층 동시 매장',
        solution: '카운터·4인·6인 3-zone 분리 + 조명 자동 전환 시스템',
      },
    ],
    featured: false,
    imageCount: 16,
  },
  {
    id: 'p5',
    title: '교촌치킨 화곡점',
    category: 'chicken',
    contractorId: 'c3',
    region: '서울',
    district: '강서구',
    area: 24,
    budget: 4800,
    durationDays: 21,
    completedAt: '2026-03-08',
    imageColors: ['#F97316', '#FB923C', '#FED7AA'],
    excerpt: '교촌 본사 가이드라인 통과 — 21일 시공',
    body: [
      '강서구 화곡동 교촌치킨 가맹점. 교촌 본사 지정 가이드라인을 통과하면서 단가를 낮추는 것이 과제였습니다.',
      '본사 지정 자재는 준수하면서 시공 효율을 높이기 위해 경기 지역 자재상 직거래 + 시공팀 직영 체계를 활용했습니다. 평당 200만원, 21일 시공 완료.',
    ],
    tags: ['치킨', '교촌', '본사가이드라인', '강서'],
    challenges: [
      {
        problem: '본사 가이드라인 + 저단가 동시 달성',
        solution: '자재 직거래 + 시공팀 직영으로 평당 단가 -28%',
      },
    ],
    featured: false,
    imageCount: 12,
  },
  {
    id: 'p6',
    title: '죠스떡볶이 평촌점',
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
      '18일 시공 완료. 오픈 첫 날 200명 이상 객수 처리 성공.',
    ],
    tags: ['분식', '학원가', '회전율', '안양'],
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
    title: '이디야커피 송도센트럴파크점',
    category: 'cafe',
    contractorId: 'c1',
    region: '인천',
    district: '연수구',
    area: 28,
    budget: 5800,
    durationDays: 26,
    completedAt: '2026-01-30',
    imageColors: ['#A16207', '#CA8A04', '#FACC15'],
    excerpt: '신도시 동네 단골 카페 — 따뜻한 우드 톤 + 단골 좌석',
    body: [
      '송도 국제도시 주거 단지 인근 이디야커피 가맹점. 단골 위주 매출이 목표였습니다.',
      '4인 단체석 + 2인 좌석 + 1인 카운터를 균형 있게 배치해 다양한 객층이 편하게 머물 수 있도록 했습니다. 우드 톤 + 자연 조명으로 따뜻한 분위기를 완성했습니다.',
      '이디야 본사 지정 시공 통과 완료. 오픈 1개월 만에 지역 맛집 앱 TOP 5 진입.',
    ],
    tags: ['카페', '이디야', '신도시', '단골', '송도'],
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
    title: '쥬시 영등포점',
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
      '영등포 오피스 상권 1인 운영 과일주스 매장. 본인 혼자 운영 가능하면서도 SNS 노출이 잘 되도록 설계.',
      '주방 + 카운터 + 셀프 픽업이 본인 1명의 동선 안에 모두 들어오도록 압축 설계했고, 매장 비주얼은 SNS 그리드에 맞는 그린 + 화이트 톤으로 통일했습니다.',
      '시공 완료 동시에 매장 사진 자산 60장 + 릴스 4개 제공. 오픈 2주 만에 인스타그램 팔로워 1,200명.',
    ],
    tags: ['음료', '1인운영', 'SNS', '10평', '영등포'],
    challenges: [
      {
        problem: '1인 운영 + SNS 노출 동시',
        solution: '동선 압축 + 그린/화이트 톤 통일 + 오픈 동시 사진 자산 제공',
      },
    ],
    featured: true,
    imageCount: 16,
  },
  {
    id: 'p9',
    title: '설빙 강남역점',
    category: 'dessert',
    contractorId: 'c4',
    region: '서울',
    district: '강남구',
    area: 26,
    budget: 9200,
    durationDays: 38,
    completedAt: '2025-12-15',
    imageColors: ['#EC4899', '#A78BFA', '#FBCFE8'],
    excerpt: '강남역 핵심 상권 프리미엄 디저트 — 평당 354만원',
    body: [
      '강남역 5번 출구 인근 설빙 프리미엄 가맹점. 평당 354만원의 고급 인테리어로 강남 상권 경쟁력을 확보했습니다.',
      '벽 + 천장 + 가구 + 조명이 모두 화이트 + 라일락 톤으로 통일되어 어느 자리에서 찍어도 동일한 무드의 사진이 나옵니다.',
      '오픈 1개월 만에 카카오맵 별점 4.6점, 네이버 지도 방문자 리뷰 200건 돌파.',
    ],
    tags: ['디저트', '설빙', '프리미엄', '강남역', 'SNS'],
    challenges: [
      {
        problem: '강남역 상권 단가 + SNS 노출 효과 정당화',
        solution: '평당 354만원이지만 SNS 노출 ROI 2.6배로 회수',
      },
    ],
    featured: false,
    imageCount: 32,
  },
  {
    id: 'p10',
    title: '컴포즈커피 판교점',
    category: 'cafe',
    contractorId: 'c1',
    region: '경기',
    district: '성남시 분당구',
    area: 18,
    budget: 4500,
    durationDays: 25,
    completedAt: '2026-02-05',
    imageColors: ['#92400E', '#A16207'],
    excerpt: '컴포즈 본사 가이드라인 통과 — IT 단지 18평',
    body: [
      '판교 IT 단지 컴포즈커피 가맹점. 점심 + 오후 카페 + 저녁 직장인 두 모드로 운영.',
      '컴포즈 본사 지정 시공 가이드라인을 사전에 협의 후 도면 확정 → 시공 통과율 100%. 25일 완공.',
    ],
    tags: ['카페', '컴포즈', '판교', 'IT단지'],
    challenges: [
      {
        problem: '판교 건물 층고 제약으로 천장 시공 복잡',
        solution: '낮은 층고 활용 매립 조명 + 반사 천장으로 개방감 확보',
      },
    ],
    featured: false,
    imageCount: 14,
  },
  {
    id: 'p11',
    title: '봉추찜닭 부산서면점',
    category: 'korean',
    contractorId: 'c2',
    region: '부산',
    district: '부산진구',
    area: 32,
    budget: 7500,
    durationDays: 36,
    completedAt: '2025-11-20',
    imageColors: ['#B45309', '#D97706'],
    excerpt: '찜닭 + 단체석 — 점심 회전 + 저녁 단체',
    body: [
      '부산 서면 찜닭 매장. 점심 직장인 회전 + 저녁 단체 손님 동시 수용이 목표였습니다.',
      '6인 단체석 + 4인 좌석 + 2인 좌석을 zone별 분리하여 저녁 단체 예약이 있어도 나머지 좌석 운영에 영향이 없도록 설계.',
    ],
    tags: ['한식', '찜닭', '부산', '단체석'],
    challenges: [
      {
        problem: '단체석 zone이 일반석 동선 방해',
        solution: 'zone 분리 + 분리형 커튼 파티션으로 단체석 독립 운영',
      },
    ],
    featured: false,
    imageCount: 16,
  },
  {
    id: 'p12',
    title: '이디야커피 일산백석점',
    category: 'cafe',
    contractorId: 'c5',
    region: '경기',
    district: '고양시 일산동구',
    area: 30,
    budget: 5500,
    durationDays: 28,
    completedAt: '2026-01-10',
    imageColors: ['#A16207', '#FACC15'],
    excerpt: '원목 자체 제작 가구 + 자연 톤 동네 카페',
    body: [
      '일산 백석동 주거 단지 이디야커피. 원목 자체 제작 가구로 따뜻한 동네 카페 분위기를 완성했습니다.',
      '테이블·의자·카운터를 자체 공방에서 제작해 통일된 원목 톤을 완성했으며, 5년 후에도 컨디션 유지되는 마감을 보증합니다.',
    ],
    tags: ['카페', '이디야', '원목', '일산', '동네카페'],
    challenges: [
      {
        problem: '30평 매장 원목 가구 비용 절감',
        solution: '자체 공방 직제작으로 외주 대비 가구 단가 -35%',
      },
    ],
    featured: false,
    imageCount: 18,
  },
  {
    id: 'p13',
    title: '굽네치킨 안산고잔점',
    category: 'chicken',
    contractorId: 'c3',
    region: '경기',
    district: '안산시 단원구',
    area: 26,
    budget: 4200,
    durationDays: 19,
    completedAt: '2026-02-15',
    imageColors: ['#F97316', '#FB923C'],
    excerpt: '굽네 본사 가이드라인 통과 — 19일 빠른 시공',
    body: [
      '안산 고잔 신도시 굽네치킨 가맹점. 평당 162만원 가성비로 굽네 본사 가이드라인을 통과했습니다.',
      '경기 지역 자재 직거래 체계를 활용해 19일 만에 시공 완료. 본사 감리 1회 통과.',
    ],
    tags: ['치킨', '굽네', '저자본', '안산', '신도시'],
    challenges: [
      {
        problem: '주방 환기 시스템 건물 제약',
        solution: '건물 관리사 사전 협의 → 외벽 환기구 추가 설치로 해결',
      },
    ],
    featured: false,
    imageCount: 12,
  },
  {
    id: 'p14',
    title: '한솥도시락 일산탄현점',
    category: 'korean',
    contractorId: 'c5',
    region: '경기',
    district: '고양시 일산서구',
    area: 24,
    budget: 5800,
    durationDays: 30,
    completedAt: '2025-12-05',
    imageColors: ['#16A34A', '#B45309'],
    excerpt: '도시락 + 한식 — 주거 단지 배달 65%',
    body: [
      '일산 탄현 주거 단지 한솥도시락 가맹점. 배달 비중 65%로 배달·매장 동선 분리가 핵심이었습니다.',
      '배달 픽업 창구를 별도 운영하고, 배달 라이더 동선이 매장 홀과 교차하지 않도록 설계해 피크 시간 혼잡도를 최소화했습니다.',
    ],
    tags: ['한식', '도시락', '일산', '배달'],
    challenges: [
      {
        problem: '배달 + 매장 동시 피크 혼잡',
        solution: '배달 픽업 창구 분리 + 배달 라이더 전용 대기 공간 설계',
      },
    ],
    featured: false,
    imageCount: 14,
  },
  {
    id: 'p15',
    title: '블루보틀 광화문점',
    category: 'cafe',
    contractorId: 'c4',
    region: '서울',
    district: '종로구',
    area: 16,
    budget: 5200,
    durationDays: 24,
    completedAt: '2026-03-30',
    imageColors: ['#92400E', '#EC4899'],
    excerpt: '오피스 + SNS 동시 — 광화문 프리미엄 카페',
    body: [
      '광화문 프리미엄 카페 매장. 오피스 점심 객수 + SNS 노출 두 가지를 동시에 달성해야 했습니다.',
      '카운터 + 픽업 동선은 점심 회전율 최우선으로, 벽·가구·조명은 SNS 그리드 통일성 최우선으로 설계했습니다. 상충되는 두 목표를 zone 분리로 해결했습니다.',
      '오픈 첫 주 인스타그램 태그 1,400건 달성.',
    ],
    tags: ['카페', '프리미엄', '오피스', 'SNS', '광화문'],
    challenges: [
      {
        problem: '점심 회전율 + SNS 비주얼 두 마리 토끼',
        solution: '카운터/픽업은 직선 동선 최적화, 홀은 SNS 비주얼 최적화로 zone 분리',
      },
    ],
    featured: false,
    imageCount: 20,
  },
  {
    id: 'p16',
    title: '역전할머니맥주 해운대점',
    category: 'bar',
    contractorId: 'c6',
    region: '부산',
    district: '해운대구',
    area: 38,
    budget: 8400,
    durationDays: 35,
    completedAt: '2026-02-18',
    imageColors: ['#F59E0B', '#D97706', '#92400E'],
    excerpt: '해운대 관광 상권 — 야간 주점 + 단체석',
    body: [
      '해운대 관광 상권 역전할머니맥주 가맹점. 관광객 단체 + 지역 단골 두 객층을 동시에 수용해야 했습니다.',
      '8인 단체석 3개 + 4인 좌석 + 바 좌석을 배치하여 관광객 단체와 2인 지역 단골 모두 수용 가능하도록 설계.',
      '해운대 건물 특성상 외관 간판 제약이 있어 내부 노출 간판 + 입구 LED 사이니지로 시인성을 확보했습니다.',
    ],
    tags: ['주점', '해운대', '단체석', '관광상권'],
    challenges: [
      {
        problem: '관광객 단체 + 지역 단골 동시 수용',
        solution: '8인·4인·바 3-zone 분리 + 단체석 예약 전용 QR 시스템 도입',
      },
    ],
    featured: false,
    imageCount: 20,
  },
  {
    id: 'p17',
    title: '노랑통닭 부산남포점',
    category: 'chicken',
    contractorId: 'c6',
    region: '부산',
    district: '중구',
    area: 20,
    budget: 3600,
    durationDays: 22,
    completedAt: '2026-01-08',
    imageColors: ['#FBBF24', '#F59E0B', '#D97706'],
    excerpt: '남포동 구도심 — 노랑통닭 22일 시공',
    body: [
      '부산 남포동 구도심 노랑통닭 가맹점. 구도심 상권 특성상 저자본 빠른 시공이 핵심이었습니다.',
      '22일 만에 시공 완료, 부산 지역 자재 직거래로 단가를 절감했습니다. 노랑통닭 본사 가이드라인 1회 통과.',
    ],
    tags: ['치킨', '부산', '구도심', '저자본'],
    challenges: [
      {
        problem: '구도심 건물 노후화로 전기 용량 부족',
        solution: '건물주 협의 + 전기 용량 증설 비용 시공비 포함 처리',
      },
    ],
    featured: false,
    imageCount: 10,
  },
  {
    id: 'p18',
    title: '써브웨이 노원점',
    category: 'snack',
    contractorId: 'c7',
    region: '서울',
    district: '노원구',
    area: 12,
    budget: 2800,
    durationDays: 17,
    completedAt: '2026-03-05',
    imageColors: ['#16A34A', '#22C55E', '#86EFAC'],
    excerpt: '12평 써브웨이 — 17일 소형 매장 시공',
    body: [
      '노원구 써브웨이 소형 매장. 12평에서 최대 객수 처리 + 본사 가이드라인 통과가 목표였습니다.',
      '써브웨이 특유의 오더 라인 + 픽업 동선을 12평에 최적화해 혼잡 없이 운영 가능하도록 설계. 17일 완공.',
    ],
    tags: ['분식', '써브웨이', '소형매장', '노원'],
    challenges: [
      {
        problem: '12평에 오더 라인 + 좌석 동시 확보',
        solution: '오더 라인 벽면 배치 + 폴딩 좌석으로 피크 외 좌석 확장',
      },
    ],
    featured: false,
    imageCount: 10,
  },
  {
    id: 'p19',
    title: '호프야 이태원점',
    category: 'bar',
    contractorId: 'c10',
    region: '서울',
    district: '용산구',
    area: 42,
    budget: 9600,
    durationDays: 40,
    completedAt: '2026-03-12',
    imageColors: ['#1E293B', '#334155', '#64748B'],
    excerpt: '이태원 야간 상권 — 낮/밤 2-mode 조명 시스템',
    body: [
      '이태원 야간 상권 호프집. 저녁 6시 전후로 분위기가 완전히 바뀌는 2-mode 매장이 목표였습니다.',
      '낮에는 2,700K 밝은 조명으로 가볍게 한잔 가능한 비어바 분위기, 밤에는 1,800K 어두운 조명 + 스팟 조명으로 클럽형 분위기로 자동 전환되도록 시스템을 구성했습니다.',
      '42평에 4인·6인·8인 좌석과 스탠딩 바 zone을 혼합 배치해 다양한 그룹 규모 수용 가능.',
    ],
    tags: ['주점', '이태원', '야간상권', '조명시스템'],
    challenges: [
      {
        problem: '낮/밤 완전히 다른 분위기 구현',
        solution: '스마트 조명 시스템 + 색온도 자동 전환으로 사람 손 안 거치고 2-mode 전환',
      },
    ],
    featured: false,
    imageCount: 24,
  },
  {
    id: 'p20',
    title: '메가커피 역삼직영점',
    category: 'cafe',
    contractorId: 'c14',
    region: '서울',
    district: '강남구',
    area: 34,
    budget: 7800,
    durationDays: 30,
    completedAt: '2026-04-05',
    imageColors: ['#B45309', '#92400E', '#D97706'],
    excerpt: '메가커피 지정 파트너 — 34평 강남 플래그십',
    body: [
      '메가커피 역삼동 플래그십 가맹점. 메가커피 본사 지정 시공 파트너로서 표준 시공 가이드라인을 가장 빠르게 반영했습니다.',
      '34평 대형 매장으로 홀·테이크아웃·배달 3-channel을 동시 운영 가능하도록 설계했습니다. 30일 완공, 본사 감리 1회 통과.',
      '오픈 2주차 일 매출 240만원 달성.',
    ],
    tags: ['카페', '메가커피', '플래그십', '강남', '본사파트너'],
    challenges: [
      {
        problem: '홀·테이크아웃·배달 3-channel 동시 혼잡',
        solution: '입구 → 테이크아웃, 홀 → 별도 카운터, 배달 → 후문 전용 동선 분리',
      },
    ],
    featured: false,
    imageCount: 22,
  },
]

export const PORTFOLIO: MockPortfolioItem[] = RAW_PORTFOLIO.map((p) => {
  const photos = portfolioPhotoSet(p.id, p.category)
  return {
    ...p,
    heroImage: photos.hero,
    gallery: photos.gallery,
  }
})

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
      '점주의 선택 기준: 본사 가이드라인이 명확하고 시공사가 통과 경험이 있다면 직접 발주. 가이드라인이 모호하거나 시공사 경험이 부족하다면 본사 지정 시공으로 안전.',
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
    authorRole: '비주얼스튜디오 대표',
    authorAvatarColor: '#94A3B8',
    coverColors: ['#EC4899', '#A78BFA'],
    excerpt: 'SNS 노출이 매출의 30% 이상인 매장에는 인스타그램 그리드 통일성이 시공 단계에서 결정됩니다.',
    body: [
      '디저트·카페·음료 핫플 매장의 SNS 노출은 시공 단계에서 결정됩니다. 어느 자리에서 사진을 찍어도 같은 무드가 나오게 만들어야 인스타그램 그리드에서 통일감이 만들어집니다.',
      '통일감을 만드는 3가지 축은 1) 조명 색온도 (전 매장 4000K 통일 등), 2) 벽·천장 톤 (한 컬러 팔레트 안에서만), 3) 가구·소품 (3가지 색상 안에서만 선택)입니다.',
      '시공 마지막 1주는 사진 자산 라이브러리 만드는 데 사용하시는 게 좋습니다. 매장이 비어있을 때 60~80장의 매장 자산 사진을 미리 찍어두면 향후 1년 동안 SNS 콘텐츠로 활용 가능합니다.',
    ],
    keyPoints: [
      'SNS 통일감 = 조명 색온도 + 벽 톤 + 가구 색상 3축 통일',
      '시공 마지막 1주는 사진 자산 라이브러리 작업에 할애',
      '60~80장 자산이면 향후 1년 SNS 콘텐츠 충분',
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
    authorRole: '한강인테리어 시공팀장',
    authorAvatarColor: '#64748B',
    coverColors: ['#A16207', '#64748B'],
    excerpt: '시공 일수 1주 지연은 단순 시간 손실이 아닙니다. 매장 오픈 시기 + 임대료 + 광고 일정이 모두 어긋납니다.',
    body: [
      '시공 일정 지연은 점주에게 단순한 시간 문제가 아닙니다. 임대차 계약상 오픈 예정일이 정해져 있고, 광고 + 인플루언서 협업 일정이 짜여 있는 경우가 많아 1주 지연이 매장 매출 -300만원으로 이어지는 경우가 흔합니다.',
      '시공 일수 보장제는 시공사가 약속한 일수를 넘기면 일당 비례 배상금을 지급하는 제도입니다. 보장이 있는 시공사의 시공 일수 준수율은 평균 96%, 보장이 없는 시공사는 78%로 차이가 큽니다.',
      '점주가 보장을 요구하면 시공사는 마진을 1~2%p 더 받지만, 평균적으로 점주가 얻는 이익이 더 큽니다. 견적 단계에서 반드시 보장 여부를 확인하세요.',
    ],
    keyPoints: [
      '시공 1주 지연 = 매장 매출 -300만원 (평균)',
      '시공 일수 보장 있음 96% 준수, 없음 78%',
      '보장 요구 시 마진 +1~2%p지만 점주 이익이 더 큼',
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
    excerpt: '2024~2025의 콘크리트 + 메탈 인더스트리얼이 저물고 2026은 자연 톤 + 우드 + 곡선이 떠오릅니다.',
    body: [
      '카페·디저트 매장 시공 트렌드는 2024년 콘크리트 + 메탈의 인더스트리얼 톤이 정점을 찍었고, 2025년부터 자연 톤 + 우드로 이동하기 시작했습니다.',
      '2026 트렌드 3가지: 1) 따뜻한 우드 톤 — 원목 가구 + 자연광 강조. 2) 곡선 강조 — 모서리 라운드, 곡선 벽 마감. 3) 식물 — 매장 내 자연 식물 통합.',
      '이 트렌드는 단순 비주얼 변화가 아닙니다. 인스타그램 노출 알고리즘에서 "따뜻한 톤"이 노출 가중치가 높아지는 패턴이 확인되고 있어 매출에도 영향을 미칩니다.',
    ],
    keyPoints: [
      '2024 인더스트리얼 → 2025~2026 자연 톤',
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
