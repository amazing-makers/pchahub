import { USERS } from './mock-data'

export type FootTraffic = 'high' | 'medium' | 'low'
export type RentLevel = 'high' | 'medium' | 'low'
export type IntelTrend = 'up' | 'stable' | 'down'
export type IntelCategory = 'cafe' | 'chicken' | 'korean' | 'japanese' | 'snack' | 'dessert' | 'beverage' | 'bar'

export interface MockIntel {
  id: string
  title: string
  region: string
  district: string
  category: IntelCategory
  summary: string
  body: string[]
  footTraffic: FootTraffic
  rentLevel: RentLevel
  trend: IntelTrend
  keyPoints: string[]
  authorId: string
  createdAt: string
  views: number
  likes: number
  tags: string[]
}

export const INTEL_CATEGORY_LABEL: Record<IntelCategory, string> = {
  cafe: '카페',
  chicken: '치킨',
  korean: '한식',
  japanese: '일식',
  snack: '분식',
  dessert: '디저트',
  beverage: '음료',
  bar: '주점',
}

export const FOOT_TRAFFIC_LABEL: Record<FootTraffic, string> = {
  high: '유동인구 많음',
  medium: '유동인구 보통',
  low: '유동인구 적음',
}

export const RENT_LEVEL_LABEL: Record<RentLevel, string> = {
  high: '임대료 높음',
  medium: '임대료 보통',
  low: '임대료 낮음',
}

export const TREND_LABEL: Record<IntelTrend, string> = {
  up: '상권 성장 중',
  stable: '상권 안정',
  down: '상권 침체',
}

export const INTELS: MockIntel[] = [
  {
    id: 'it1',
    title: '홍대 카페 상권 분석 — 2025 하반기 리포트',
    region: '서울',
    district: '마포구 홍대',
    category: 'cafe',
    summary: '홍대 카페 거리는 임대료 상승에도 불구, 외국인 관광객 증가로 유동인구가 꾸준히 유지되고 있습니다. 다만 골목 안쪽 진입은 여전히 경쟁 치열.',
    body: [
      '홍대 정문 ~ 홍익사거리 메인 스트리트는 평균 임대료가 3.3㎡당 월 40~60만원 수준으로 전년 대비 8% 상승했습니다. 주말 낮 12~18시 대 유동인구는 시간당 8,000명 이상이며, 외국인 비율이 전체의 35%까지 높아졌습니다.',
      '특히 홍대입구역 9번 출구 인근 골목은 스페셜티 카페 중심으로 재편되는 추세입니다. 최근 6개월 내 오픈한 카페 14곳 중 10곳이 스페셜티·로스터리 컨셉입니다. 단가는 음료 1잔 8,000~15,000원대가 표준.',
      '반면 피카디리 삼거리 이면도로는 권리금 없는 빈 점포가 4곳 이상 확인되었습니다. 낮은 임대료(3.3㎡당 25만원대)와 접근성을 고려하면 베이커리+카페 복합 형태로 진입할 만합니다.',
    ],
    keyPoints: [
      '메인 스트리트 임대료 3.3㎡당 월 40~60만원 (전년비 +8%)',
      '주말 피크 유동인구 시간당 8,000명+, 외국인 35%',
      '스페셜티 카페 트렌드 강세 — 단가 8,000~15,000원',
      '이면도로 권리금 없는 공실 다수 — 진입 기회',
    ],
    footTraffic: 'high',
    rentLevel: 'high',
    trend: 'stable',
    authorId: 'u2',
    createdAt: '2026-05-10',
    views: 2841,
    likes: 156,
    tags: ['홍대', '카페', '서울', '임대료', '상권분석'],
  },
  {
    id: 'it2',
    title: '강남역 분식 상권 — 점심 수요 중심으로 재편',
    region: '서울',
    district: '강남구 강남역',
    category: 'snack',
    summary: '강남역 직장인 밀집 지역은 점심 단품 수요가 핵심. 2,000원 인상 후에도 1만원 이하 분식·도시락 형태는 여전히 경쟁력 있습니다.',
    body: [
      '강남역 9~12번 출구 인근 업무 빌딩 밀집 구역은 점심 시간대(11:30~13:30) 기준 테이블 회전수가 하루 전체 매출의 65~70%를 차지합니다. 저녁 장사보다 점심에 집중하는 전략이 유효합니다.',
      '평균 객단가는 9,500원으로 전년 대비 약 2,000원 올랐음에도 이용객 수는 줄지 않았습니다. 떡볶이·김밥 조합 세트 1만원 이하 구성이 매출 상위 메뉴입니다. 배달 비중이 매출의 약 30%.',
      '새로 오픈한 경쟁 점포가 최근 3개월 5곳 증가. 스탠딩 바 형태로 좌석 수를 줄이고 회전율을 높이는 트렌드가 뚜렷합니다.',
    ],
    keyPoints: [
      '점심 시간대 매출 집중 — 하루 매출의 65~70%',
      '평균 객단가 9,500원, 세트 메뉴 경쟁력 핵심',
      '배달 비중 30% — 배달 플랫폼 최적화 필수',
      '스탠딩 바 형태로 회전율 극대화 트렌드',
    ],
    footTraffic: 'high',
    rentLevel: 'high',
    trend: 'stable',
    authorId: 'u5',
    createdAt: '2026-05-05',
    views: 1930,
    likes: 98,
    tags: ['강남', '분식', '점심', '직장인상권'],
  },
  {
    id: 'it3',
    title: '수원 광교 치킨 상권 — 배달 의존도 높은 신흥 주거지',
    region: '경기',
    district: '수원시 영통구 광교',
    category: 'chicken',
    summary: '광교신도시는 30~40대 가족 세대 중심으로 치킨 수요 탄탄. 배달 비중 70%+이며 브랜드 인지도보다 리뷰 관리가 핵심 경쟁력입니다.',
    body: [
      '광교신도시 아파트 단지 주변 치킨 점포는 배달 비중이 전체 매출의 70~80%에 달합니다. 주말 저녁(18~22시)에 매출이 집중되며 이 시간대 주문 수가 평일 대비 2.5배 수준입니다.',
      '경쟁 점포 수는 반경 1km 내 14개로 포화 상태이나, 최근 1년간 브랜드 직영점 3곳이 철수하면서 개인 가맹점 생존율이 높아지는 추세입니다.',
      '리뷰 평점 4.5 이상 유지 여부가 주문 수와 직결됩니다. 현장 확인 결과 상위 매출 점포 모두 최신 리뷰 50개 이상, 사장 답글 응답률 90%+를 유지하고 있습니다.',
    ],
    keyPoints: [
      '배달 비중 70~80% — 배달앱 관리가 전부',
      '주말 저녁 주문 집중, 평일 대비 2.5배',
      '리뷰 관리가 핵심 경쟁력 — 4.5점 유지 필수',
      '반경 1km 14개 경쟁점 중 직영 3곳 최근 철수',
    ],
    footTraffic: 'medium',
    rentLevel: 'medium',
    trend: 'stable',
    authorId: 'u8',
    createdAt: '2026-04-28',
    views: 1543,
    likes: 74,
    tags: ['광교', '수원', '치킨', '배달상권'],
  },
  {
    id: 'it4',
    title: '연남동 디저트 카페 — 인스타 감성 강세, 임대료 급등 주의',
    region: '서울',
    district: '마포구 연남동',
    category: 'dessert',
    summary: '연남동은 인스타그램 노출 중심 디저트 카페 성지. 임대료가 2년 만에 25% 이상 올랐고 권리금도 부활. 진입 전 수익 시뮬레이션이 필수입니다.',
    body: [
      '연남동 경의선숲길 인근은 2024~2025년 사이 임대료가 평균 25% 이상 상승했습니다. 3.3㎡당 월 임대료가 30만원을 돌파한 매물도 다수 확인됩니다. 권리금은 전용 20평 기준 5,000~8,000만원대까지 형성되어 있습니다.',
      '방문객 중 SNS 인증 목적 비율이 55% 이상으로, 포토존과 시그니처 메뉴 비주얼이 매출과 직결됩니다. 오픈 후 3개월 이내 인스타그램 팔로워 5,000명 이상 확보 여부가 생존의 갈림길.',
      '단점은 짧은 트렌드 주기입니다. 특정 디저트(에클레어, 크루아상 등)로 컨셉을 잡으면 1~2년 후 시장이 포화되는 경우가 반복되고 있습니다. 메뉴 변화 전략이 없으면 3년 유지가 어렵습니다.',
    ],
    keyPoints: [
      '임대료 2년간 25%+ 상승, 권리금 재형성',
      'SNS 인증 목적 방문 55%+ — 포토존 필수',
      '오픈 초기 인스타 5,000 팔로워 확보가 생존 기준',
      '트렌드 주기 짧음 — 메뉴 업데이트 전략 필수',
    ],
    footTraffic: 'high',
    rentLevel: 'high',
    trend: 'up',
    authorId: 'u3',
    createdAt: '2026-04-20',
    views: 3210,
    likes: 201,
    tags: ['연남동', '디저트', '카페', 'SNS마케팅', '임대료'],
  },
  {
    id: 'it5',
    title: '부산 서면 한식당 상권 — 저녁 회식 수요 회복 중',
    region: '부산',
    district: '부산진구 서면',
    category: 'korean',
    summary: '서면 메인 스트리트는 저녁 회식 수요가 코로나 이전 대비 85% 수준까지 회복. 기업 법인 카드 사용 비율이 높아 단가 인상 여지 있음.',
    body: [
      '부산 서면역 2·3번 출구 인근 음식점 거리는 저녁 18~22시 회식 고객이 전체 매출의 55%를 차지합니다. 법인 카드 사용 비율이 40% 이상으로 단가 인상에 저항이 낮은 편입니다.',
      '최근 돼지국밥·감자탕 장르 점포 5곳이 신규 오픈. 반면 일반 한정식·백반 형태는 점유율이 줄어드는 추세입니다. 1인당 평균 지출은 25,000~35,000원으로 서울 강남 수준에 근접했습니다.',
      '임대료는 3.3㎡당 월 20~28만원으로 수도권 대비 낮고, 인건비도 서울보다 10~15% 저렴합니다. 수익성 면에서 동급 서울 상권보다 유리한 조건입니다.',
    ],
    keyPoints: [
      '저녁 회식 수요 코로나 이전 85% 회복',
      '법인 카드 비중 40% — 단가 인상 여지 충분',
      '임대료 3.3㎡당 20~28만원, 인건비도 낮아 수익성 우수',
      '돼지국밥·감자탕 장르 신규 오픈 증가 추세',
    ],
    footTraffic: 'high',
    rentLevel: 'medium',
    trend: 'up',
    authorId: 'u11',
    createdAt: '2026-04-15',
    views: 1287,
    likes: 63,
    tags: ['부산', '서면', '한식', '회식상권'],
  },
  {
    id: 'it6',
    title: '신촌 대학가 주점 상권 — MT·졸업 시즌 집중, 비수기 공실 주의',
    region: '서울',
    district: '서대문구 신촌',
    category: 'bar',
    summary: '대학 학사 일정에 종속된 매출 구조. 3~5월·9~11월 성수기와 여름방학 비수기의 격차가 크며, 월 임대료 1,500만원 이상 점포는 적자 전환 위험 높습니다.',
    body: [
      '신촌 연세로 메인 스트리트의 주점은 학사 일정과 강하게 연동됩니다. MT 시즌(3~4월, 9~10월)과 졸업·종강 시즌(6월, 12월)에 매출이 집중되며, 7~8월 여름방학과 1~2월 겨울방학에는 매출이 40% 이상 감소합니다.',
      '최근 3년간 임대료 상승으로 월 임대료 1,500만원 이상을 내는 점포는 비수기 4개월 기준 적자 전환 사례가 70%를 넘는 것으로 파악됩니다.',
      '생존 전략으로는 행사 패키지 운영(MT·단체 예약 전용), 플리마켓·팝업 공간 임대 연계 수익화, 외식 브랜드와의 임시 공간 공유 등이 활용되고 있습니다.',
    ],
    keyPoints: [
      '학사 일정 연동 매출 — 성수기·비수기 격차 최대 40%',
      '월 임대료 1,500만원+ 점포, 비수기 적자 위험 70%',
      'MT 패키지·단체 예약으로 성수기 수익 극대화 필수',
      '공실 전환 점포 비수기 팝업 임대 수익화 전략 유효',
    ],
    footTraffic: 'medium',
    rentLevel: 'high',
    trend: 'down',
    authorId: 'u7',
    createdAt: '2026-04-08',
    views: 1856,
    likes: 112,
    tags: ['신촌', '주점', '대학가', '비수기', '임대료'],
  },
  {
    id: 'it7',
    title: '인천 구월동 카페 상권 — 수도권 이탈 수요 흡수',
    region: '인천',
    district: '남동구 구월동',
    category: 'cafe',
    summary: '서울 과밀 창업자들이 인천으로 이동하며 구월동 카페 공급이 빠르게 늘고 있습니다. 임대료 대비 객단가 균형이 관건.',
    body: [
      '구월 로데오 상권은 2024년부터 서울 창업자 유입이 눈에 띄게 증가했습니다. 임대료는 3.3㎡당 월 15~22만원으로 강남·홍대의 절반 수준이지만, 객단가도 동급 서울 카페 대비 20~30% 낮게 형성됩니다.',
      '지역 소비층은 30~40대 전업주부·공무원 비중이 높아 주중 낮 시간대(10~15시) 매출 비중이 55%. 테이크아웃보다 매장 체류 시간이 길어 좌석 효율 기반 운영 전략이 중요합니다.',
      '최근 12개월간 카페 신규 오픈 18건, 폐업 9건으로 순증가 추세. 다만 동네 특성상 SNS 확산 속도가 느려 입소문 마케팅에 시간이 걸립니다.',
    ],
    keyPoints: [
      '임대료 서울 대비 50% 수준 — 진입 장벽 낮음',
      '객단가도 낮아 임대료 절감 효과는 반감',
      '주중 낮 시간대 매출 집중 — 좌석 효율 중요',
      '최근 12개월 신규 18 vs 폐업 9 — 순증 중',
    ],
    footTraffic: 'medium',
    rentLevel: 'low',
    trend: 'up',
    authorId: 'u4',
    createdAt: '2026-03-30',
    views: 982,
    likes: 47,
    tags: ['인천', '구월동', '카페', '수도권외곽'],
  },
  {
    id: 'it8',
    title: '대구 동성로 음식점 상권 종합 리포트',
    region: '대구',
    district: '중구 동성로',
    category: 'korean',
    summary: '대구 최대 번화가 동성로는 10~20대 유입은 강하지만 평균 지출액이 낮아 외식업 수익성 확보가 어렵습니다. 업종 선택과 단가 전략이 핵심.',
    body: [
      '동성로 메인 스트리트는 10~20대 방문 비중이 65%로 높습니다. 단가에 민감한 연령대가 주 소비층이어서 평균 객단가가 8,000~12,000원 수준에 머뭅니다. 30대 이상 회식·데이트 수요를 함께 잡으려면 위치와 인테리어 투자가 필요합니다.',
      '임대료는 3.3㎡당 월 20~35만원으로 지방 광역시 중 가장 높은 편. 권리금도 수도권 수준으로 회복되었습니다. 신규 진입 시 초기 비용 회수에 최소 18개월 이상 걸리는 구조입니다.',
      '경쟁 점포 중 버티고 있는 곳들의 공통점은 배달 매출 30%+, SNS 마케팅 자체 운영, 계절 메뉴 정기 교체 3가지입니다. 이 중 하나라도 빠지면 1년 내 부침을 경험하는 경우가 많습니다.',
    ],
    keyPoints: [
      '10~20대 유입 65%, 평균 객단가 8,000~12,000원으로 낮음',
      '임대료 3.3㎡당 20~35만원 — 지방 광역시 중 최고',
      '초기 투자 회수 최소 18개월',
      '생존 비결: 배달 30%+·SNS 직접 운영·계절 메뉴 교체',
    ],
    footTraffic: 'high',
    rentLevel: 'high',
    trend: 'stable',
    authorId: 'u6',
    createdAt: '2026-03-22',
    views: 1124,
    likes: 58,
    tags: ['대구', '동성로', '한식', '청년상권', '수익성'],
  },
]

export function intelById(id: string): MockIntel | undefined {
  return INTELS.find((i) => i.id === id)
}

export function intelByCategory(category: IntelCategory): MockIntel[] {
  return INTELS.filter((i) => i.category === category)
}

export function intelByRegion(region: string): MockIntel[] {
  return INTELS.filter((i) => i.region === region)
}

export function intelAuthor(authorId: string) {
  return USERS.find((u) => u.id === authorId)
}

export const INTEL_REGIONS = Array.from(new Set(INTELS.map((i) => i.region)))
