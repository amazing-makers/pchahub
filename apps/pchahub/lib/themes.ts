// Themes are an alternative discovery axis to categories (업종). Where
// categories answer "what does the store sell?", themes answer "what
// does the owner need from a brand?" — capital, lifestyle, hours, etc.

import { BRANDS, type MockBrand } from './mock-data'
import { getBrandDetail, totalStartupCost } from './mock-brand-detail'

export interface Theme {
  key: string
  label: string
  shortLabel: string
  /** One-line summary used on cards. */
  description: string
  /** 2-3 sentence guide shown on the theme detail page. */
  guide: string
  /** 3-4 things to watch out for when picking from this theme. */
  considerations: string[]
  /** Maps to a lucide icon name in theme-icon.tsx. */
  iconKey:
    | 'wallet'
    | 'user'
    | 'package'
    | 'trending'
    | 'moon'
    | 'coins'
    | 'home'
    | 'sparkles'
}

export const THEMES: Theme[] = [
  {
    key: 'low-capital',
    label: '저자본 창업',
    shortLabel: '저자본',
    description: '총 창업비 5,000만원 이하로 시작 가능한 브랜드',
    guide:
      '여유 자금 부담을 최소화하면서 시작할 수 있는 가맹 브랜드입니다. 일반적으로 매장 평수가 작고, 인테리어 단가가 낮으며, 1인 또는 2인 운영이 가능한 구조입니다. 다만 객단가나 회전율 한쪽이 받쳐줘야 손익이 맞는다는 점에 유의해야 합니다.',
    considerations: [
      '저자본일수록 임대료 비중이 손익에 결정적 — 임대료 협상이 중요합니다',
      '인건비를 줄이기 위해 본인의 운영 시간이 길어질 수 있습니다',
      '본사 지원이 약한 저단가 브랜드일수록 마케팅·교육이 부실할 수 있어 검증이 필요합니다',
    ],
    iconKey: 'wallet',
  },
  {
    key: 'solo',
    label: '1인 운영 가능',
    shortLabel: '1인 운영',
    description: '추가 인력 없이 본인 혼자 운영할 수 있는 브랜드',
    guide:
      '메뉴 단순화·자동화 POS·셀프 결제 등이 잘 갖춰져 있어 본인 혼자 운영 가능한 가맹 브랜드입니다. 인건비 부담이 큰 1인 가구 창업자 또는 부업·세컨드 잡 형태로 적합합니다.',
    considerations: [
      '본인 휴무 시 임시 인력 운영 방안이 있는지 확인하세요',
      '피크 시간대 동시 처리 한계로 객수가 매장 평수보다 작을 수 있습니다',
      '본사 SV 방문 시 매장 비울 수 없는 점주를 위한 원격 컨설팅 여부 확인',
    ],
    iconKey: 'user',
  },
  {
    key: 'delivery',
    label: '배달·테이크아웃 중심',
    shortLabel: '배달 중심',
    description: '매장 객수보다 배달·테이크아웃 비중이 높은 브랜드',
    guide:
      '주방 효율과 포장 라인이 최적화된 배달 위주 브랜드입니다. 작은 평수로 시작 가능하며 입지 보다는 배달 가능 권역과 동선이 더 중요합니다. 다만 배달앱 수수료 (3-15%) 가 손익에 큰 영향을 미칩니다.',
    considerations: [
      '배달앱 수수료 + 광고비를 매출의 15-25%로 보수적으로 계산하세요',
      '주방 동선 효율이 손익에 직결됩니다 — 매장 답사 시 주방 구조를 꼼꼼히',
      '리뷰 관리·플랫폼 SEO가 매출 변동성에 큰 영향을 미칩니다',
    ],
    iconKey: 'package',
  },
  {
    key: 'fast-growth',
    label: '빠른 성장 브랜드',
    shortLabel: '빠른 성장',
    description: '전년 대비 매장 수 +30% 이상 성장 중인 브랜드',
    guide:
      '시장 선점 효과를 누릴 수 있는 빠른 성장 단계 브랜드입니다. 인지도가 빠르게 올라가는 시기라 신규 매장도 빠르게 자리잡는 이점이 있습니다. 다만 본사 시스템이 성장 속도를 못 따라가는 경우가 종종 있습니다.',
    considerations: [
      '본사 SV 인력과 매장 수 비율을 확인하세요 (SV 1인당 매장 30개 이상이면 적신호)',
      '매장 간 거리 제한·영업지역 보호 조항을 가맹계약서에서 반드시 확인',
      '성장 곡선이 꺾이는 시점을 본사 폐점율 추이로 가늠해보세요',
    ],
    iconKey: 'trending',
  },
  {
    key: 'late-night',
    label: '야간·심야 상권',
    shortLabel: '야간 상권',
    description: '저녁·심야 영업 위주의 브랜드',
    guide:
      '저녁 식사·주점·심야 객수가 매출의 70% 이상을 차지하는 야간 위주 브랜드입니다. 야간 유동인구가 보장되는 입지가 핵심이며, 일반 식음료 대비 객단가가 높은 편입니다.',
    considerations: [
      '야간 인력 확보가 가장 어려운 부분 — 시급·근무 시간을 사전에 계산하세요',
      '소음·취객 민원에 대한 대응 매뉴얼이 본사에 있는지 확인',
      '주말 매출 의존도가 높아 평일 매출 부진 시 손익 변동이 큽니다',
    ],
    iconKey: 'moon',
  },
  {
    key: 'low-royalty',
    label: '저로열티 브랜드',
    shortLabel: '저로열티',
    description: '월 로열티가 없거나 50만원 미만인 브랜드',
    guide:
      '본사 월 로열티 부담이 낮은 가맹 브랜드입니다. 월 고정 비용을 낮춰 영업이익 변동성을 줄일 수 있다는 장점이 있습니다. 단, 본사 매출원이 로열티 외 다른 곳 (식자재 마진·광고비 분담 등) 에 있는지 살펴봐야 합니다.',
    considerations: [
      '로열티가 낮은 만큼 식자재 단가가 시장 평균보다 비쌀 수 있습니다',
      '광고비·교육비 분담금 등 다른 명목의 본사 수익원을 확인하세요',
      '본사가 운영을 적극 지원하는 인센티브가 약할 수 있어 SV 방문 빈도 확인',
    ],
    iconKey: 'coins',
  },
  {
    key: 'small-store',
    label: '소형 매장',
    shortLabel: '소형 매장',
    description: '권장 매장 면적 15평 이하 브랜드',
    guide:
      '소형 매장으로 운영 가능한 가맹 브랜드입니다. 임대료·인테리어 부담이 적고 폐점 위험도 상대적으로 낮습니다. 다만 객석 회전율·테이크아웃 비중이 매출의 핵심 변수가 됩니다.',
    considerations: [
      '회전율을 높이기 위해 메뉴 단순화·결제 자동화 정도를 확인하세요',
      '동일 상권 내 경쟁 매장 거리를 매우 좁게 가져가는 본사도 있으니 영업권 보호 확인 필수',
      '소형 매장은 SNS 마케팅 의존도가 높아 본사 디지털 마케팅 역량을 점검',
    ],
    iconKey: 'home',
  },
  {
    key: 'trending',
    label: '트렌디 브랜드',
    shortLabel: '트렌디',
    description: '최근 24개월 내 성장률이 높고 SNS 노출이 활발한 브랜드',
    guide:
      '시장에서 주목받는 신규·중급 단계 브랜드입니다. 인지도 증가로 신규 매장 진입에 유리하지만, 트렌드 변화가 빠른 만큼 본사의 지속 가능성을 신중히 봐야 합니다.',
    considerations: [
      '트렌드 수명을 가늠하기 어려우니 3-5년 영업 가능성을 신중히 검토',
      '본사의 외부 투자·자본 구조를 가능한 범위에서 확인 (사업자등록증·법인 정보 활용)',
      '모방 브랜드 등장 시 차별화 요소가 무엇인지 본사로부터 설명 듣기',
    ],
    iconKey: 'sparkles',
  },
]

/** Brands that match a given theme. */
export function brandsForTheme(themeKey: string): MockBrand[] {
  return BRANDS.filter((b) => matchesTheme(b, themeKey))
}

function matchesTheme(brand: MockBrand, themeKey: string): boolean {
  const detail = getBrandDetail(brand)
  const startup = totalStartupCost(detail.costs)

  switch (themeKey) {
    case 'low-capital':
      return startup <= 5000
    case 'solo':
      return detail.operations.averageStaff <= 2
    case 'delivery':
      return (
        detail.operations.primaryChannel === '혼합' ||
        detail.operations.primaryChannel === '배달 중심'
      )
    case 'fast-growth':
      return brand.growthRate >= 25
    case 'late-night':
      return (
        brand.category === 'bar' ||
        detail.operations.operatingHours.includes('02:00') ||
        detail.operations.operatingHours.includes('01:00')
      )
    case 'low-royalty':
      return brand.monthlyRoyalty === 0 || brand.monthlyRoyalty < 50
    case 'small-store':
      return detail.costs.recommendedArea <= 15
    case 'trending':
      return brand.growthRate >= 20 && brand.storeCount >= 30
    default:
      return false
  }
}

/** Number of brands per theme — cached at module load. */
export const THEME_COUNTS: Record<string, number> = Object.fromEntries(
  THEMES.map((t) => [t.key, brandsForTheme(t.key).length]),
)
