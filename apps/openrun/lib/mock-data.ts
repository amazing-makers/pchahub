// Mock data for openrun — franchise marketing agency services.

import { caseImageFor, testimonialAvatarFor } from './campaign-images'

export type ServiceSlug = 'grand-open' | 'recruit' | 'brand-marketing'

export interface MockService {
  slug: ServiceSlug
  title: string
  subtitle: string
  description: string
  /** Who this service is for */
  audience: string
  /** Major problem this solves */
  problem: string
  /** Color used in service hero */
  accentColor: string
  /** Pricing summary string */
  priceLabel: string
  /** Typical project duration */
  duration: string
  /** Included items */
  includes: string[]
  /** Outcomes — bullets */
  outcomes: string[]
  /** Process steps */
  process: Array<{ title: string; body: string }>
  /** Related portfolio case ids */
  portfolioIds: string[]
}

export interface MockPortfolioCase {
  id: string
  title: string
  /** Client brand name */
  client: string
  brandColor: string
  service: ServiceSlug
  serviceLabel: string
  /** Brand category like '치킨' */
  industry: string
  region: string
  /** Duration label like '30일' or '6개월' */
  duration: string
  startedAt: string
  /** One-liner summary */
  hook: string
  /** Multi-paragraph case content */
  body: string[]
  /** Key result numbers shown in hero */
  metrics: Array<{ label: string; value: string; delta?: string }>
  /** Image accent colors (gradient placeholder) */
  imageColors: string[]
  /** Real cover photo — auto-filled. */
  coverImage: string
  /** Tags */
  tags: string[]
  featured: boolean
}

export interface MockTestimonial {
  id: string
  quote: string
  author: string
  role: string
  brand: string
  avatarColor: string
  /** Real avatar — auto-filled. */
  avatarUrl: string
}

export const SERVICES: MockService[] = [
  {
    slug: 'grand-open',
    title: '그랜드 오픈 캠페인',
    subtitle: '신규 매장 오픈 첫 30일을 빠르게 정착시킵니다',
    description:
      '오픈 직후 30일은 매장이 단골을 만드는 결정적 시기입니다. 오픈런이 SNS 셋업·인플루언서 협업·배달앱 광고·오픈 이벤트 운영을 패키지로 묶어 한 번에 진행합니다.',
    audience: '신규 오픈 가맹점주, 직영 매장 오픈 본사',
    problem: '오픈했는데 손님이 안 옵니다. 단골 만드는 데 너무 오래 걸립니다.',
    accentColor: '#F97316',
    priceLabel: '300만원 ~ 800만원',
    duration: '오픈 7일 전 ~ 오픈 후 30일',
    includes: [
      '인스타그램 셋업 + 첫 30개 콘텐츠 제작',
      '블로그 후기 5건 + 네이버 플레이스 등록 최적화',
      '인플루언서 협업 3 ~ 5명 (지역 + 카테고리 매칭)',
      '배달앱 광고 운영 (배민·요기요·쿠팡이츠)',
      '오픈 이벤트 기획 + 운영',
      '주간 성과 리포트 4회',
    ],
    outcomes: [
      '오픈 30일 안에 인스타 팔로워 1,500명 이상',
      '평균 일 방문객 평균 대비 +120%',
      '단골(재방문) 비율 30% 이상 확보',
      'amakers 표준 매장 손익분기 평균보다 60% 빠른 안정화',
    ],
    process: [
      {
        title: '오픈 D-7 사전 셋업',
        body: '인스타·블로그·네이버 플레이스 셋업 + 메뉴 사진 촬영 + 콘텐츠 30개 일괄 제작',
      },
      {
        title: '오픈 D-Day 라이브',
        body: '오픈 이벤트 운영 + 인플루언서 5명 동시 방문 + 라이브 콘텐츠 업로드',
      },
      {
        title: 'D+7 ~ D+21 회전',
        body: '배달앱 광고 + 인플루언서 후속 협업 + 매주 신규 콘텐츠 4-6개',
      },
      {
        title: 'D+30 인수인계',
        body: '성과 리포트 + 점주에게 인스타 운영 매뉴얼 + 콘텐츠 캘린더 인수인계',
      },
    ],
    portfolioIds: ['c1', 'c3', 'c6'],
  },
  {
    slug: 'recruit',
    title: '가맹 모집 캠페인',
    subtitle: '본사가 진짜 적합한 예비 점주를 만나도록',
    description:
      'CPC 광고는 비싸고 박람회는 효율이 낮습니다. 오픈런은 가맹 랜딩 페이지부터 SEO·SEM·SNS 광고·박람회 후속까지 통합 운영해 실제 계약으로 이어지는 후보를 본사에 전달합니다.',
    audience: '가맹점주 모집이 시급한 본사, 신규 브랜드 본사',
    problem: '광고비는 늘어가는데 진지한 가맹 후보가 안 들어옵니다.',
    accentColor: '#F97316',
    priceLabel: '월 500만원 ~ 1,500만원',
    duration: '최소 3개월 ~ 6개월 약정',
    includes: [
      '가맹 모집 랜딩 페이지 제작 + AB 테스트',
      'SEO 키워드 30개 우선 노출',
      '구글·네이버·페이스북·인스타 광고 운영',
      '박람회 사전·사후 캠페인 + 부스 컨설팅',
      '가맹 문의 응대 자동화 + 자격 검증',
      '월간 ROI 리포트',
    ],
    outcomes: [
      'CPC 단가 평균 35% 절감',
      '실제 계약 전환율 평균 8%',
      '신규 가맹 계약 월 3-15건',
      '본사 인지도 (브랜드 검색량) 평균 2.4배 증가',
    ],
    process: [
      { title: '시장 + 경쟁 분석', body: '동 업종 본사 광고 패턴 + 키워드 점유율 + 박람회 효과 분석' },
      { title: '랜딩 + 광고 셋업', body: '가맹 모집 랜딩 제작 + AB 테스트 + 광고 캠페인 셋업' },
      { title: '운영 + 최적화', body: '주간 입찰가 조정 + 콘텐츠 교체 + 응대 자동화 검수' },
      { title: '월간 평가 + 다음 분기 계획', body: 'ROI 리포트 + 본사 미팅 + 다음 분기 캠페인 조정' },
    ],
    portfolioIds: ['c2', 'c4'],
  },
  {
    slug: 'brand-marketing',
    title: '본사 브랜드 마케팅',
    subtitle: '본사 인지도와 트렌드 포지션을 만듭니다',
    description:
      '신규·중급 단계 본사가 인지도를 키우려면 단발성 광고가 아니라 일관된 브랜드 자산이 필요합니다. 오픈런이 브랜드 비주얼·콘텐츠·PR·KOL 협업까지 6개월 단위로 운영합니다.',
    audience: '인지도가 부족한 중급 본사, 트렌드 진입 준비 중인 본사',
    problem: '브랜드는 좋은데 사람들이 잘 모릅니다. 매장 수가 늘어도 인지도가 안 올라요.',
    accentColor: '#F97316',
    priceLabel: '월 800만원 ~ 2,500만원',
    duration: '6개월 ~ 12개월',
    includes: [
      '브랜드 비주얼 가이드 정비 + 매장 비주얼 통일',
      '월 콘텐츠 12-20개 (인스타·블로그·릴스 통합)',
      '미디어 PR (트렌드 매거진 노출 3건/분기)',
      'KOL/인플루언서 협업 (월 2-5명)',
      '본사 매장 자산화 (사진·영상 라이브러리)',
      '분기 브랜드 헬스 리포트',
    ],
    outcomes: [
      '브랜드 검색량 평균 3배 증가',
      '인스타 팔로워 12개월 후 평균 +50,000',
      '신규 매장 오픈 후 손익분기 도달 평균 2.4개월',
      '경쟁 브랜드 대비 SNS 활동량 점유율 2위 이상 진입',
    ],
    process: [
      { title: '브랜드 진단', body: '현재 자산 + 톤 + 경쟁 포지션 분석' },
      { title: '비주얼 + 톤 정비', body: '브랜드 가이드 업데이트 + 매장 비주얼 표준화' },
      { title: '콘텐츠 + PR 운영', body: '월 콘텐츠 일정 + 미디어 노출 + KOL 협업' },
      { title: '분기 점검', body: '브랜드 헬스 리포트 + 본사 KPI 점검 + 다음 분기 조정' },
    ],
    portfolioIds: ['c5', 'c7', 'c8'],
  },
]

export const SERVICE_LABEL: Record<ServiceSlug, string> = {
  'grand-open': '그랜드 오픈',
  recruit: '가맹 모집',
  'brand-marketing': '본사 마케팅',
}

type RawCase = Omit<MockPortfolioCase, 'coverImage'>

const RAW_PORTFOLIO: RawCase[] = [
  {
    id: 'c1',
    title: '치킨다이스 강남역점 그랜드 오픈 30일 캠페인',
    client: '치킨다이스',
    brandColor: '#F97316',
    service: 'grand-open',
    serviceLabel: '그랜드 오픈',
    industry: '치킨',
    region: '서울 강남',
    duration: '30일',
    startedAt: '2026-01-12',
    hook: '오픈 30일 만에 단골 비율 38%, 인스타 팔로워 4,800명 확보',
    body: [
      '치킨다이스 강남역점은 인근에 동일 카테고리 매장이 5개 있는 치열한 상권에서 오픈했습니다. 오픈런은 D-7부터 인스타·블로그·네이버 플레이스 셋업과 메뉴 사진 촬영을 진행했습니다.',
      'D-Day에는 강남 인근 푸드 인플루언서 5명을 동시 초청해 라이브 콘텐츠를 만들었습니다. 이 콘텐츠가 인스타 + 유튜브 숏츠 두 채널에서 합산 320만 노출을 받았습니다.',
      'D+7부터 배달앱 광고를 시작하면서 평일 점심 객수가 안정화되었고, D+21쯤 단골(재방문 2회 이상) 비율이 30%를 넘어섰습니다. 30일 시점에 매장 평균 일 객수는 같은 브랜드 신규 매장 평균보다 +120%였습니다.',
    ],
    metrics: [
      { label: '인스타 팔로워', value: '4,820명', delta: '+4,820' },
      { label: '단골 비율', value: '38%', delta: '평균 +13%p' },
      { label: '오픈 30일 일 객수', value: '평균 대비 +120%' },
      { label: 'ROI', value: '380%' },
    ],
    imageColors: ['#F97316', '#FB923C'],
    tags: ['치킨', '강남', 'SNS', '인플루언서'],
    featured: true,
  },
  {
    id: 'c2',
    title: '데일리브루 50개 매장 동시 SNS 캠페인',
    client: '데일리브루',
    brandColor: '#92400E',
    service: 'recruit',
    serviceLabel: '가맹 모집',
    industry: '카페',
    region: '전국',
    duration: '6개월',
    startedAt: '2025-11-04',
    hook: '6개월 + 5천만 노출 + 신규 가맹 문의 240건 + 계약 28건',
    body: [
      '데일리브루는 저가형 스페셜티 카페로 가맹 사업을 빠르게 확장하고자 했지만 박람회와 CPC 광고만으로는 한계가 명확했습니다. 오픈런은 6개월 동안 SNS 광고 + 가맹 랜딩 + 박람회 사전·사후 캠페인을 통합 운영했습니다.',
      '월별 캠페인 콘셉트를 다르게 가져갔습니다. 1-2월: 저자본 창업 강조, 3-4월: 1인 운영 가능성 강조, 5-6월: 매출 데이터 + 점주 후기 강조. 각 콘셉트별 랜딩 페이지를 별도로 만들어 AB 테스트를 했습니다.',
      '6개월 누적 5,200만 노출, 1만 4천 클릭, 가맹 문의 240건이 들어왔고 그 중 28건이 실제 계약으로 이어졌습니다. CPC가 분기마다 평균 32% 감소했고 본사 인지도(브랜드 검색량)는 2.4배 증가했습니다.',
    ],
    metrics: [
      { label: '누적 노출', value: '5,200만', delta: '+5,200만' },
      { label: '가맹 문의', value: '240건' },
      { label: '계약 전환', value: '28건', delta: '전환율 11.7%' },
      { label: '본사 검색량', value: '2.4배', delta: '+140%' },
    ],
    imageColors: ['#92400E', '#A16207'],
    tags: ['카페', '전국', '가맹모집', 'SNS광고'],
    featured: true,
  },
  {
    id: 'c3',
    title: '스윗스튜디오 성수 인스타 핫플 만들기',
    client: '스윗스튜디오',
    brandColor: '#EC4899',
    service: 'grand-open',
    serviceLabel: '그랜드 오픈',
    industry: '디저트',
    region: '서울 성수',
    duration: '45일',
    startedAt: '2026-02-20',
    hook: '오픈 45일 만에 인스타 팔로워 0 → 15,200명, 주말 객수 평균 대비 +210%',
    body: [
      '스윗스튜디오 성수점은 디저트 카페로 SNS 매출 의존도가 높은 곳이었습니다. 오픈 전 45일부터 콘텐츠 자산을 미리 쌓아 SNS 핫플 포지션을 만드는 게 목표였습니다.',
      'D-30부터 매장 인테리어 진행 과정을 인스타 스토리로 매일 업데이트했습니다. "성수에 새로운 디저트 카페가 들어옵니다" 콘셉트로 팔로워를 미리 모은 결과 오픈 전 이미 6,200명을 확보했습니다.',
      'D-Day에는 디저트 인플루언서 8명을 동시 초청해 인스타 그리드 콘텐츠를 한꺼번에 만들었습니다. 그리드 8개 콘텐츠가 각자 인플루언서 채널에서 동시 노출되며 노출 폭증을 만들었습니다.',
      '오픈 후 30일 시점 매장은 주말마다 줄을 서는 곳이 되었고, 인스타 팔로워는 15,200명에 도달했습니다.',
    ],
    metrics: [
      { label: '인스타 팔로워', value: '15,200명', delta: '+15,200' },
      { label: '주말 객수', value: '평균 대비 +210%' },
      { label: '인플루언서 협업', value: '8명' },
      { label: '오픈 전 사전 팬', value: '6,200명' },
    ],
    imageColors: ['#EC4899', '#F472B6'],
    tags: ['디저트', '성수', 'SNS', '인플루언서'],
    featured: true,
  },
  {
    id: 'c4',
    title: '한솥미식 가맹점주 모집 6개월 캠페인',
    client: '한솥미식',
    brandColor: '#16A34A',
    service: 'recruit',
    serviceLabel: '가맹 모집',
    industry: '한식',
    region: '수도권',
    duration: '6개월',
    startedAt: '2025-10-15',
    hook: '6개월 + 신규 가맹 18건 + CPC 38% 절감',
    body: [
      '한솥미식은 도시락 콘셉트로 본격적인 가맹 확장을 준비하고 있었습니다. 다만 동일 카테고리 본사 대비 인지도가 낮아 CPC가 높았고, 박람회 효율도 낮았습니다.',
      '오픈런은 한솥미식의 "도시락 + 배달 비중 70%" 특성을 강조한 랜딩 페이지를 만들었습니다. 기존 점주 후기 + 매장당 평균 매출 데이터 + 입지 추천 데이터를 시각적으로 정리한 형태였습니다.',
      '6개월 동안 신규 가맹 계약 18건이 성사되었고 CPC가 38% 절감되었습니다.',
    ],
    metrics: [
      { label: '신규 계약', value: '18건' },
      { label: 'CPC 절감', value: '38%' },
      { label: '가맹 문의', value: '162건' },
      { label: '평균 클릭율', value: '2.8%', delta: '업계 평균 1.4%' },
    ],
    imageColors: ['#16A34A', '#22C55E'],
    tags: ['한식', '가맹모집', '랜딩'],
    featured: false,
  },
  {
    id: 'c5',
    title: '라멘이치고 본사 PR — 트렌드 매거진 노출 + 신규 매장 23개 오픈',
    client: '라멘이치고',
    brandColor: '#991B1B',
    service: 'brand-marketing',
    serviceLabel: '본사 마케팅',
    industry: '일식',
    region: '전국',
    duration: '12개월',
    startedAt: '2025-05-01',
    hook: '12개월 + 트렌드 매거진 노출 8건 + 신규 매장 23개 오픈',
    body: [
      '라멘이치고는 일식 라멘 카테고리에서 인지도 부족이 본사 확장의 가장 큰 병목이었습니다. 오픈런이 12개월 단위 본사 브랜드 마케팅 캠페인을 진행했습니다.',
      '핵심은 미디어 PR이었습니다. F&B 트렌드 매거진 3곳에 분기마다 노출되도록 콘텐츠를 기획했고, 매장 사진·영상 자산을 본사 라이브러리화했습니다.',
      '12개월 후 브랜드 검색량이 3.1배 증가했고 신규 매장이 23개 오픈했습니다.',
    ],
    metrics: [
      { label: '미디어 노출', value: '8건' },
      { label: '신규 매장', value: '23개' },
      { label: '브랜드 검색량', value: '3.1배' },
      { label: '인스타 팔로워', value: '+62,000' },
    ],
    imageColors: ['#991B1B', '#DC2626'],
    tags: ['일식', '본사마케팅', 'PR', '12개월'],
    featured: false,
  },
  {
    id: 'c6',
    title: '분식나라 동성로 그랜드 오픈',
    client: '분식나라',
    brandColor: '#DC2626',
    service: 'grand-open',
    serviceLabel: '그랜드 오픈',
    industry: '분식',
    region: '대구 동성로',
    duration: '21일',
    startedAt: '2026-03-10',
    hook: '학생 객수 빠른 안정화 + 일 객수 평균 대비 +95%',
    body: [
      '분식나라 동성로점은 학생 객수가 핵심인 입지였습니다. 인플루언서보다 인근 학교 동아리·커뮤니티 협업이 더 효율적이라 판단했습니다.',
      '학교 동아리 SNS 5곳에 오픈 이벤트 협업 + 학생 단체 할인 쿠폰을 결합했습니다. 인스타 광고는 동성로 5km 반경에 한정해 집중 노출했습니다.',
      '21일 만에 일 객수가 평균 대비 +95% 안정화되었습니다.',
    ],
    metrics: [
      { label: '일 객수', value: '평균 대비 +95%' },
      { label: '학생 단체 협업', value: '5건' },
      { label: '인스타 팔로워', value: '2,100명' },
      { label: '21일 매출', value: '평균 대비 +88%' },
    ],
    imageColors: ['#DC2626', '#F87171'],
    tags: ['분식', '대구', '학생상권'],
    featured: false,
  },
  {
    id: 'c7',
    title: '스시키친 송도 일식 트렌드 캠페인',
    client: '스시키친',
    brandColor: '#0EA5E9',
    service: 'brand-marketing',
    serviceLabel: '본사 마케팅',
    industry: '일식',
    region: '전국',
    duration: '6개월',
    startedAt: '2025-09-01',
    hook: '6개월 + 인스타 팔로워 +28,000 + 신규 가맹 7건',
    body: [
      '스시키친은 프리미엄 일식 카테고리에서 인지도를 다지는 단계였습니다. 오픈런이 6개월 동안 비주얼 자산 정비 + 콘텐츠 마케팅을 진행했습니다.',
      '매장 인테리어가 강점이라 프로 사진작가를 통해 매장 자산을 라이브러리화했고, 이 자산이 신규 매장 오픈 시마다 일관된 비주얼을 만들어주었습니다.',
    ],
    metrics: [
      { label: '인스타 팔로워', value: '+28,000' },
      { label: '신규 가맹', value: '7건' },
      { label: '본사 검색량', value: '+85%' },
      { label: '미디어 노출', value: '4건' },
    ],
    imageColors: ['#0EA5E9', '#22D3EE'],
    tags: ['일식', '프리미엄', '비주얼'],
    featured: false,
  },
  {
    id: 'c8',
    title: '포차모임 야간 상권 SNS 캠페인',
    client: '포차모임',
    brandColor: '#7C3AED',
    service: 'brand-marketing',
    serviceLabel: '본사 마케팅',
    industry: '주점',
    region: '전국',
    duration: '6개월',
    startedAt: '2025-08-10',
    hook: '야간 상권 매장 인스타 평균 팔로워 +8,500 + 주말 객수 +45%',
    body: [
      '포차모임은 야간 매장 특성상 SNS 노출이 어려운 카테고리였습니다. 오픈런이 6개월 동안 "야간 상권 + 분위기" 콘셉트로 콘텐츠 마케팅을 진행했습니다.',
      '매장 인테리어·조명·안주 비주얼을 야간 분위기 톤으로 통일했고, 매주 신규 콘텐츠 6개를 본사 + 매장 채널 동시 운영했습니다.',
    ],
    metrics: [
      { label: '매장당 팔로워', value: '+8,500' },
      { label: '주말 객수', value: '+45%' },
      { label: '본사 검색량', value: '+62%' },
      { label: '주간 콘텐츠', value: '6개' },
    ],
    imageColors: ['#7C3AED', '#A78BFA'],
    tags: ['주점', '야간', '본사마케팅'],
    featured: false,
  },
]

export const PORTFOLIO: MockPortfolioCase[] = RAW_PORTFOLIO.map((c) => ({
  ...c,
  coverImage: caseImageFor(c.id, c.industry),
}))

export const FEATURED_PORTFOLIO = PORTFOLIO.filter((c) => c.featured)

export function serviceBySlug(slug: string): MockService | undefined {
  return SERVICES.find((s) => s.slug === slug)
}

export function caseById(id: string): MockPortfolioCase | undefined {
  return PORTFOLIO.find((c) => c.id === id)
}

export function casesByService(slug: ServiceSlug): MockPortfolioCase[] {
  return PORTFOLIO.filter((c) => c.service === slug)
}

type RawTestimonial = Omit<MockTestimonial, 'avatarUrl'>

const RAW_TESTIMONIALS: RawTestimonial[] = [
  {
    id: 't1',
    quote:
      '오픈 첫 30일이 가장 두려웠는데, 매장이 비어 있는 시간이 거의 없었습니다. 인플루언서 협업이 정말 결정적이었어요.',
    author: '이상훈',
    role: '치킨다이스 강남역점 점주',
    brand: '치킨다이스',
    avatarColor: '#F97316',
  },
  {
    id: 't2',
    quote:
      '6개월 캠페인 끝나고 보니 박람회 한 번 안 갔는데 가맹 계약이 18건 들어왔어요. CPC도 처음 대비 38% 떨어졌고요.',
    author: '김민호',
    role: '한솥미식 본사 마케팅팀장',
    brand: '한솥미식',
    avatarColor: '#16A34A',
  },
  {
    id: 't3',
    quote:
      '오픈 전부터 팬을 만들어두니 D-Day에 매장이 이미 단골이 있는 느낌이었어요. 디저트 매장은 SNS가 매출이라 큰 효과 봤습니다.',
    author: '윤다은',
    role: '스윗스튜디오 성수점 점주',
    brand: '스윗스튜디오',
    avatarColor: '#EC4899',
  },
]

export const TESTIMONIALS: MockTestimonial[] = RAW_TESTIMONIALS.map((t) => ({
  ...t,
  avatarUrl: testimonialAvatarFor(t.id),
}))

export const STATS = {
  campaigns: 480,
  averageROI: 312, // %
  partneredHQ: 84,
  grandOpenSuccess: 94, // %
}
