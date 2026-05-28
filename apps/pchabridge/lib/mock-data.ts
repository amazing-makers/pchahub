// Mock data for pchabridge — franchise investment + M&A platform.

export type RoundType = 'seed' | 'series-a' | 'series-b' | 'ma' | 'crowd' | 'store-fund'
export type RoundStatus = 'open' | 'closing-soon' | 'completed' | 'cancelled'

export interface MockBrand {
  id: string
  name: string
  category: string
  categoryLabel: string
  logoColor: string
  storeCount: number
  foundedYear: number
  /** Brand HQ city */
  region: string
}

export interface MockInvestmentRound {
  id: string
  type: RoundType
  brandId: string
  status: RoundStatus
  /** DART 고유번호 — 설정 시 실 재무제표로 연 매출 보강 */
  dartCorpCode?: string
  /** Target raise (만원 — 10K KRW) */
  targetAmount: number
  /** Already committed (만원) */
  currentAmount: number
  /** Minimum investment per investor (만원) */
  minInvestment: number
  /** Pre-money valuation (만원) */
  valuation: number
  /** ROI estimate (per year) */
  expectedAnnualROI: number
  /** Close date (ISO) */
  closeDate: string
  /** Pitch hook */
  hook: string
  /** Multi-paragraph pitch */
  pitch: string[]
  /** Key financial highlights */
  highlights: Array<{ label: string; value: string }>
  /** Tags / categories */
  tags: string[]
  /** Risk factors */
  risks: string[]
  /** Use of funds */
  useOfFunds: Array<{ label: string; share: number }>
  featured: boolean
}

export interface MockMAListing {
  id: string
  brandId: string
  /** DART 고유번호 — 설정 시 실 재무제표로 연 매출 보강 */
  dartCorpCode?: string
  /** Asking price (만원) */
  askingPrice: number
  /** TTM revenue (만원/year) */
  annualRevenue: number
  /** TTM operating profit (만원/year) */
  annualProfit: number
  /** Number of stores */
  storeCount: number
  /** Years operating */
  yearsOperating: number
  /** Sale rationale */
  rationale: string
  /** What's included in the deal */
  includes: string[]
  /** Story */
  body: string[]
  /** Confidentiality required (NDA before details) */
  ndaRequired: boolean
  status: 'open' | 'under-negotiation' | 'closed'
  /** Listing date */
  listedAt: string
  inquiryCount: number
}

export const BRANDS: MockBrand[] = [
  { id: 'b1', name: '치킨다이스', category: 'chicken', categoryLabel: '치킨', logoColor: '#F97316', storeCount: 84, foundedYear: 2022, region: '서울' },
  { id: 'b2', name: '데일리브루', category: 'cafe', categoryLabel: '카페', logoColor: '#92400E', storeCount: 312, foundedYear: 2021, region: '서울' },
  { id: 'b3', name: '한솥미식', category: 'korean', categoryLabel: '한식', logoColor: '#16A34A', storeCount: 56, foundedYear: 2020, region: '서울' },
  { id: 'b4', name: '스시키친', category: 'japanese', categoryLabel: '일식', logoColor: '#0EA5E9', storeCount: 22, foundedYear: 2023, region: '서울' },
  { id: 'b5', name: '스윗스튜디오', category: 'dessert', categoryLabel: '디저트', logoColor: '#EC4899', storeCount: 41, foundedYear: 2022, region: '서울' },
  { id: 'b6', name: '크리스피네스트', category: 'chicken', categoryLabel: '치킨', logoColor: '#EAB308', storeCount: 18, foundedYear: 2024, region: '경기' },
  { id: 'b7', name: '주스레인', category: 'beverage', categoryLabel: '음료', logoColor: '#10B981', storeCount: 67, foundedYear: 2021, region: '경기' },
  { id: 'b8', name: '라멘이치고', category: 'japanese', categoryLabel: '일식', logoColor: '#991B1B', storeCount: 47, foundedYear: 2022, region: '서울' },
]

export const ROUND_TYPE_LABEL: Record<RoundType, string> = {
  seed: 'Seed',
  'series-a': 'Series A',
  'series-b': 'Series B',
  ma: 'M&A',
  crowd: '크라우드펀딩',
  'store-fund': '다점포 펀딩',
}

export const ROUND_STATUS_LABEL: Record<RoundStatus, string> = {
  open: '모집중',
  'closing-soon': '마감 임박',
  completed: '모집 완료',
  cancelled: '취소',
}

export const ROUND_STATUS_COLOR: Record<RoundStatus, 'default' | 'success' | 'warning' | 'error'> = {
  open: 'success',
  'closing-soon': 'warning',
  completed: 'default',
  cancelled: 'error',
}

export const ROUNDS: MockInvestmentRound[] = [
  {
    id: 'r1',
    type: 'series-a',
    brandId: 'b1',
    status: 'open',
    targetAmount: 1500000,
    currentAmount: 980000,
    minInvestment: 30000,
    valuation: 18000000,
    expectedAnnualROI: 32,
    closeDate: '2026-06-30',
    hook: '치킨다이스 Series A — 4년 80호점, 다음 24개월에 200호점 목표',
    pitch: [
      '치킨다이스는 2022년 첫 매장 이후 4년 만에 80개 매장으로 성장했습니다. 본 라운드 자금은 다음 24개월 안에 200개 매장으로 확대하는 데 사용됩니다.',
      '매장 1개당 평균 연 매출 3.6억, 영업이익률 18%로 동업계 평균을 상회합니다. 점주 만족도 4.7/5, 폐점율 3%로 본사 운영 안정성도 확인되었습니다.',
      '본 라운드 후 24개월 내 IPO 또는 전략적 인수 검토 가능 단계로 진입할 것으로 예상합니다.',
    ],
    highlights: [
      { label: '현재 매장', value: '80개' },
      { label: '연 매출 (본사)', value: '124억' },
      { label: '영업이익률', value: '21%' },
      { label: '예상 ROI (연)', value: '32%' },
    ],
    tags: ['Series A', '치킨', '본사', '확장'],
    risks: [
      '동일 카테고리 신규 진입자 5건/연 등장으로 경쟁 심화 가능',
      '매장 수 200개 진입 시 본사 SV 인력 추가 채용 필요',
      '본사 영업이익률이 매장 확장 속도에 따라 변동 가능',
    ],
    useOfFunds: [
      { label: '신규 매장 출점 자금', share: 45 },
      { label: '본사 운영 시스템 확장', share: 22 },
      { label: '마케팅·브랜드 자산', share: 18 },
      { label: '인력 채용', share: 10 },
      { label: '예비비', share: 5 },
    ],
    featured: true,
  },
  {
    id: 'r2',
    type: 'series-b',
    brandId: 'b2',
    status: 'open',
    targetAmount: 3500000,
    currentAmount: 1820000,
    minInvestment: 100000,
    valuation: 65000000,
    expectedAnnualROI: 28,
    closeDate: '2026-07-15',
    hook: '데일리브루 Series B — 5년 300+ 매장의 저가형 카페 카테고리 리더',
    pitch: [
      '데일리브루는 저가형 스페셜티 커피 카테고리의 절대 강자입니다. 5년 만에 312개 매장으로 성장했고, 동 카테고리 시장 점유율 32%로 1위.',
      '본 라운드 자금은 1) 자체 원두 가공 시설 설립, 2) 매장 IoT POS 통합, 3) 해외 진출 준비 (베트남·태국)에 사용됩니다.',
      '시리즈 B 마감 후 18개월 내 IPO 추진을 검토 중입니다.',
    ],
    highlights: [
      { label: '현재 매장', value: '312개' },
      { label: '연 매출 (본사)', value: '518억' },
      { label: '시장 점유율', value: '32%' },
      { label: '예상 ROI (연)', value: '28%' },
    ],
    tags: ['Series B', '카페', '해외진출', 'IPO'],
    risks: [
      '경쟁 본사 3곳이 동시 확장 중',
      '해외 진출 (베트남·태국) 자금 회수 불확실성',
      '원두 가공 시설 설립 후 가동율 의존',
    ],
    useOfFunds: [
      { label: '원두 가공 시설 설립', share: 38 },
      { label: '매장 IoT POS', share: 22 },
      { label: '해외 진출 준비', share: 18 },
      { label: '인력 채용', share: 12 },
      { label: '예비비', share: 10 },
    ],
    featured: true,
  },
  {
    id: 'r3',
    type: 'seed',
    brandId: 'b6',
    status: 'open',
    targetAmount: 300000,
    currentAmount: 142000,
    minInvestment: 5000,
    valuation: 2400000,
    expectedAnnualROI: 45,
    closeDate: '2026-05-30',
    hook: '크리스피네스트 Seed — 신생 저칼로리 치킨 본사, 18개 매장에서 시작',
    pitch: [
      '크리스피네스트는 2024년 설립된 저칼로리 에어프라이 치킨 본사입니다. 18개월 만에 18개 매장으로 빠르게 확장했고, 20-30대 여성 객층 점유율이 60% 이상.',
      '본 라운드 자금은 1) 본사 운영 시스템 정비, 2) 매장 50개까지 확장 자금, 3) SNS 마케팅 자산화에 사용됩니다.',
    ],
    highlights: [
      { label: '현재 매장', value: '18개' },
      { label: '월 성장률', value: '+3.2개/월' },
      { label: '여성 객수 비중', value: '60%+' },
      { label: '예상 ROI (연)', value: '45%' },
    ],
    tags: ['Seed', '치킨', '신생', '여성고객'],
    risks: [
      '본사 시스템이 빠르게 성숙해야 안정성 확보',
      '저칼로리 콘셉트의 시장 지속성 검증 필요',
      '50개 매장 진입까지 본사 SV 인력 확보 필수',
    ],
    useOfFunds: [
      { label: '본사 운영 시스템', share: 35 },
      { label: '매장 출점 자금', share: 30 },
      { label: 'SNS 마케팅', share: 20 },
      { label: '인력 채용', share: 10 },
      { label: '예비비', share: 5 },
    ],
    featured: true,
  },
  {
    id: 'r4',
    type: 'store-fund',
    brandId: 'b3',
    status: 'open',
    targetAmount: 80000,
    currentAmount: 64000,
    minInvestment: 1000,
    valuation: 0,
    expectedAnnualROI: 18,
    closeDate: '2026-05-25',
    hook: '한솥미식 다점포 펀딩 — 판교 + 강남 + 여의도 3개점 동시 오픈',
    pitch: [
      '한솥미식 본사가 5년 운영 경험을 바탕으로 직접 운영하는 다점포 펀딩입니다. 판교 IT 단지·강남역·여의도 오피스 상권 3개점을 동시에 오픈합니다.',
      '각 매장의 평균 연 매출 4.2억, 영업이익률 18%를 기준으로 펀딩 회수를 계산합니다. 투자자는 매장 운영 손익에 비례한 수익을 분배받습니다.',
    ],
    highlights: [
      { label: '오픈 매장', value: '3개점' },
      { label: '예상 매장당 연매출', value: '4.2억' },
      { label: '예상 영업이익률', value: '18%' },
      { label: '예상 ROI (연)', value: '18%' },
    ],
    tags: ['다점포', '한식', '오피스', '단기'],
    risks: [
      '매장 운영 손익이 투자자 수익을 결정',
      '입지·인력·식자재 등 운영 변수 영향',
      '3개점 동시 오픈으로 인한 본사 운영 부담',
    ],
    useOfFunds: [
      { label: '매장 인테리어 시공', share: 38 },
      { label: '보증금·권리금', share: 32 },
      { label: '주방 설비', share: 15 },
      { label: '초기 운영 자금', share: 12 },
      { label: '예비비', share: 3 },
    ],
    featured: false,
  },
  {
    id: 'r5',
    type: 'crowd',
    brandId: 'b5',
    status: 'closing-soon',
    targetAmount: 200000,
    currentAmount: 184000,
    minInvestment: 300,
    valuation: 1800000,
    expectedAnnualROI: 24,
    closeDate: '2026-05-20',
    hook: '스윗스튜디오 크라우드펀딩 — 41호점, 100호점 향한 디저트 본사',
    pitch: [
      '스윗스튜디오는 41개 매장 SNS 핫플 디저트 브랜드입니다. 크라우드펀딩을 통해 100호점 달성과 IPO 준비를 위한 자금을 모집합니다.',
      '소액 (30만원부터) 투자가 가능해 일반 투자자가 디저트 카테고리 성장에 참여할 수 있습니다.',
    ],
    highlights: [
      { label: '현재 매장', value: '41개' },
      { label: '월 성장률', value: '+2개/월' },
      { label: '최소 투자', value: '300만원' },
      { label: '예상 ROI (연)', value: '24%' },
    ],
    tags: ['크라우드', '디저트', 'SNS', '소액투자'],
    risks: [
      '디저트 트렌드 변화 위험',
      '경쟁 SNS 핫플 매장 증가로 객수 분산 가능',
      '본사 운영 안정성이 100호점 달성에 결정적',
    ],
    useOfFunds: [
      { label: '매장 출점 자금', share: 45 },
      { label: 'SNS 마케팅', share: 25 },
      { label: '본사 시스템', share: 15 },
      { label: '인력 채용', share: 10 },
      { label: '예비비', share: 5 },
    ],
    featured: true,
  },
  {
    id: 'r6',
    type: 'seed',
    brandId: 'b4',
    status: 'open',
    targetAmount: 500000,
    currentAmount: 145000,
    minInvestment: 20000,
    valuation: 4200000,
    expectedAnnualROI: 38,
    closeDate: '2026-08-10',
    hook: '스시키친 Seed — 신생 프리미엄 일식 본사, 22개 매장',
    pitch: [
      '스시키친은 2023년 설립된 신생 프리미엄 일식 본사입니다. 22개 매장으로 빠르게 자리잡았고, 매장당 평균 월매출 5,800만원으로 동 카테고리 상위권.',
      '본 라운드 자금은 1) 프리미엄 일식 자재 공급망, 2) 본사 운영 시스템, 3) 50개점까지 확장에 사용됩니다.',
    ],
    highlights: [
      { label: '현재 매장', value: '22개' },
      { label: '매장당 월매출', value: '5,800만' },
      { label: '예상 ROI (연)', value: '38%' },
      { label: '목표 매장', value: '50개 (24개월)' },
    ],
    tags: ['Seed', '일식', '프리미엄'],
    risks: [
      '프리미엄 일식 시장 객수 한계',
      '인테리어·자재 단가가 점주 부담으로 작용',
    ],
    useOfFunds: [
      { label: '매장 출점', share: 40 },
      { label: '자재 공급망', share: 25 },
      { label: '본사 시스템', share: 18 },
      { label: '인력', share: 12 },
      { label: '예비비', share: 5 },
    ],
    featured: false,
  },
  {
    id: 'r7',
    type: 'series-b',
    brandId: 'b8',
    status: 'completed',
    targetAmount: 400000,
    currentAmount: 400000,
    minInvestment: 10000,
    valuation: 3800000,
    expectedAnnualROI: 30,
    closeDate: '2026-02-28',
    hook: '라멘이치고 Pre-A 완료 — 47개 매장 일식 본사',
    pitch: ['2026년 2월 완료된 Pre-A 라운드. 47개 매장 일식 본사의 다음 단계.'],
    highlights: [
      { label: '현재 매장', value: '47개' },
      { label: '모집 완료', value: '40억' },
      { label: '예상 ROI (연)', value: '30%' },
    ],
    tags: ['Pre-A', '일식', '완료'],
    risks: [],
    useOfFunds: [],
    featured: false,
  },
]

export const MA_LISTINGS: MockMAListing[] = [
  {
    id: 'ma1',
    brandId: 'b7',
    askingPrice: 8500000,
    annualRevenue: 32400000,
    annualProfit: 5400000,
    storeCount: 67,
    yearsOperating: 5,
    rationale: '본사 대표가 다른 사업 진출을 위해 안정화된 본사를 매각',
    includes: [
      '본사 운영권 전체',
      '67개 가맹점 운영 계약 승계',
      '본사 사옥 + 자재 창고 임대차 승계',
      '본사 직원 12명 (희망 시 승계)',
      '브랜드 자산 + 메뉴 레시피',
    ],
    body: [
      '주스레인 본사는 5년간 67개 매장으로 성장한 음료 카테고리 본사입니다. 본사 대표가 다른 사업 진출을 위해 안정화된 본사를 매각합니다.',
      '연 매출 324억, 영업이익 54억으로 매각가 대비 P/E 약 1.6배. 동 카테고리 본사 평균 P/E 2.2배 대비 합리적인 가격입니다.',
      '본사 직원 12명, 매장 운영 시스템, 자재 공급망이 모두 안정화되어 있어 인수 후 즉시 운영 가능합니다.',
    ],
    ndaRequired: true,
    status: 'open',
    listedAt: '2026-04-10',
    inquiryCount: 8,
  },
  {
    id: 'ma2',
    brandId: 'b4',
    askingPrice: 12000000,
    annualRevenue: 18400000,
    annualProfit: 3600000,
    storeCount: 22,
    yearsOperating: 3,
    rationale: '본사 확장 가속을 위한 전략적 파트너 모집 (50% 지분)',
    includes: [
      '본사 지분 50%',
      '경영 참여권 (이사회 2석)',
      '확장 전략 공동 수립',
    ],
    body: [
      '스시키친 본사가 확장 가속을 위해 50% 지분 매각 + 전략적 파트너를 모집합니다. 100% 매각이 아닌 파트너십 형태입니다.',
      '연 매출 184억, 영업이익 36억, 매장 22개의 신생 프리미엄 일식 본사. 매장 확장 + 자재 공급망 강화에 함께 참여할 파트너를 찾고 있습니다.',
    ],
    ndaRequired: true,
    status: 'open',
    listedAt: '2026-03-22',
    inquiryCount: 5,
  },
  {
    id: 'ma3',
    brandId: 'b3',
    askingPrice: 6800000,
    annualRevenue: 28200000,
    annualProfit: 4200000,
    storeCount: 56,
    yearsOperating: 5,
    rationale: '본사 대표 은퇴 — 매장 운영 안정화 후 매각',
    includes: [
      '본사 운영권 100%',
      '56개 가맹점 계약 승계',
      '본사 사옥 (자가)',
      '자재 공급 계약 + 거래처',
      '본사 직원 18명',
    ],
    body: ['한솥미식 본사 대표가 은퇴를 결정하면서 안정화된 본사를 매각합니다. 56개 매장 한식 도시락 본사.'],
    ndaRequired: true,
    status: 'under-negotiation',
    listedAt: '2026-03-05',
    inquiryCount: 14,
  },
]

export const FEATURED_ROUNDS = ROUNDS.filter((r) => r.featured && r.status !== 'completed')
export const OPEN_ROUNDS = ROUNDS.filter((r) => r.status === 'open' || r.status === 'closing-soon')

export function brandById(id: string): MockBrand | undefined {
  return BRANDS.find((b) => b.id === id)
}

export function roundById(id: string): MockInvestmentRound | undefined {
  return ROUNDS.find((r) => r.id === id)
}

export function maListingById(id: string): MockMAListing | undefined {
  return MA_LISTINGS.find((m) => m.id === id)
}

export function progressPercent(round: MockInvestmentRound): number {
  if (round.targetAmount === 0) return 0
  return Math.min(100, Math.round((round.currentAmount / round.targetAmount) * 100))
}

export function daysUntil(iso: string): number {
  const target = new Date(iso).getTime()
  const now = Date.now()
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)))
}

export const STATS = {
  totalRaised: '142억',
  fundedBrands: 28,
  averageROI: 26,
  activeInvestors: 1240,
}
