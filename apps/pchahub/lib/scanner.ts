// Brand matching engine for /scanner. Pure function — given the user's
// quiz answers, score every brand and surface a top-3 with explanations.

import { BRANDS, type MockBrand } from './mock-data'
import { getBrandDetail, totalStartupCost } from './mock-brand-detail'

export interface ScannerAnswers {
  /** 가용 자본 (만원) */
  capital: number
  /** 선호 지역 — '전국' 또는 specific region */
  region: string
  /** 관심 업종 keys (multi-select, 최소 1개) */
  categories: string[]
  /** 동시 운영 인력 */
  staff: 1 | 2 | 3
  /** 자영업 운영 경험 */
  experience: 'none' | 'some' | 'experienced'
  /** 영업 시간대 선호 */
  hours: 'day' | 'evening' | 'night' | 'flexible'
  /** 가장 중요시하는 가치 */
  priority: 'cost' | 'awareness' | 'system' | 'growth' | 'stability'
}

export interface ScannerMatch {
  brand: MockBrand
  score: number // 0-100
  reasons: string[]
}

const CAPITAL_WEIGHT = 25
const CATEGORY_WEIGHT = 20
const REGION_WEIGHT = 15
const HOURS_WEIGHT = 10
const STAFF_WEIGHT = 10
const EXPERIENCE_WEIGHT = 10
const PRIORITY_WEIGHT = 10

/** Score every brand against the answers and return the top N. */
export function matchBrands(answers: ScannerAnswers, limit = 3): ScannerMatch[] {
  const scored: ScannerMatch[] = BRANDS.map((brand) => scoreBrand(brand, answers))
  return scored.sort((a, b) => b.score - a.score).slice(0, limit)
}

function scoreBrand(brand: MockBrand, answers: ScannerAnswers): ScannerMatch {
  const detail = getBrandDetail(brand)
  const reasons: string[] = []
  let score = 0

  // -- Capital fit ------------------------------------------------------
  const startup = totalStartupCost(detail.costs)
  if (startup <= answers.capital * 0.7) {
    score += CAPITAL_WEIGHT
    reasons.push(`총 창업비 ${formatMan(startup)}만원으로 자본 여유가 있음`)
  } else if (startup <= answers.capital) {
    score += CAPITAL_WEIGHT * 0.7
    reasons.push(`총 창업비 ${formatMan(startup)}만원으로 자본 범위 내`)
  } else if (startup <= answers.capital * 1.2) {
    score += CAPITAL_WEIGHT * 0.3
    reasons.push(`자본 대비 약간 부담 (창업비 ${formatMan(startup)}만원)`)
  } else {
    // 자본 초과 — heavy penalty
    score -= 5
  }

  // -- Category fit -----------------------------------------------------
  if (answers.categories.includes(brand.category)) {
    score += CATEGORY_WEIGHT
    reasons.push(`관심 업종 (${brand.categoryLabel})에 해당`)
  }

  // -- Region fit (uses brand region share) -----------------------------
  if (answers.region === '전국') {
    score += REGION_WEIGHT * 0.6
  } else {
    const regionShare =
      detail.revenue.byRegion.find((r) => r.region.includes(answers.region))?.share ?? 5
    if (regionShare >= 20) {
      score += REGION_WEIGHT
      reasons.push(`${answers.region} 지역 매장 비중이 높음 (${regionShare}%)`)
    } else if (regionShare >= 10) {
      score += REGION_WEIGHT * 0.6
    } else {
      score += REGION_WEIGHT * 0.2
    }
  }

  // -- Hours fit --------------------------------------------------------
  const brandHours = detail.operations.operatingHours
  const is24h = brandHours.includes('24시간')
  const isLateNight = is24h || brandHours.includes('02:00') || brandHours.includes('01:00') || brandHours.includes('23:00')
  if (answers.hours === 'night' && isLateNight) {
    score += HOURS_WEIGHT
    if (is24h) reasons.push('24시간 운영으로 야간 수익 가능')
    else reasons.push('야간 상권 위주 운영')
  } else if (answers.hours === 'flexible') {
    score += is24h ? HOURS_WEIGHT : HOURS_WEIGHT * 0.6
    if (is24h) reasons.push('24시간 운영으로 시간대 유연성 높음')
  } else if (answers.hours === 'day' && brand.category !== 'bar') {
    score += HOURS_WEIGHT * 0.7
  } else {
    score += HOURS_WEIGHT * 0.3
  }

  // -- Staff fit --------------------------------------------------------
  if (answers.staff >= detail.operations.averageStaff) {
    score += STAFF_WEIGHT
    if (answers.staff === 1 && detail.operations.averageStaff === 1) {
      reasons.push('1인 운영 가능한 브랜드')
    }
  } else if (answers.staff >= detail.operations.averageStaff - 1) {
    // 1명 부족해도 준수한 적합도
    score += STAFF_WEIGHT * 0.6
  } else {
    score += STAFF_WEIGHT * 0.4
  }

  // -- Experience fit ---------------------------------------------------
  // Bars and Japanese kitchen-heavy concepts benefit from experience.
  // PC방 needs light IT/gaming know-how. Cafés/snack/non-food are first-timer-friendly.
  const complexity =
    brand.category === 'bar' || brand.category === 'japanese' ? 2
    : brand.category === 'korean' || brand.category === 'pcbang' ? 1
    : 0
  const userExpLevel = answers.experience === 'none' ? 0 : answers.experience === 'some' ? 1 : 2
  if (userExpLevel >= complexity) {
    score += EXPERIENCE_WEIGHT
    if (complexity === 0 && userExpLevel === 0) {
      reasons.push('초보자에게도 진입 장벽이 낮음')
    }
  } else {
    score += EXPERIENCE_WEIGHT * 0.3
  }

  // -- Priority fit -----------------------------------------------------
  switch (answers.priority) {
    case 'cost':
      if (startup < 5500) {
        score += PRIORITY_WEIGHT
        reasons.push('상대적으로 저자본 창업이 가능')
      }
      break
    case 'awareness':
      if (brand.storeCount > 80) {
        score += PRIORITY_WEIGHT
        reasons.push(`매장 ${brand.storeCount}개로 브랜드 인지도가 높음`)
      } else if (brand.storeCount > 40) {
        score += PRIORITY_WEIGHT * 0.6
      }
      break
    case 'growth':
      if (brand.growthRate > 30) {
        score += PRIORITY_WEIGHT
        reasons.push(`전년 대비 +${brand.growthRate}% 성장 중`)
      } else if (brand.growthRate > 15) {
        score += PRIORITY_WEIGHT * 0.6
      }
      break
    case 'stability':
      // Older + lower growth + many stores = stable
      const tenure = 2026 - detail.hq.franchiseStartYear
      if (tenure >= 5 && brand.growthRate < 25 && brand.storeCount > 50) {
        score += PRIORITY_WEIGHT
        reasons.push(`${tenure}년차로 안정적인 가맹사업 운영`)
      }
      break
    case 'system':
      if (brand.hqVerified && brand.storeCount > 30) {
        score += PRIORITY_WEIGHT * 0.8
        reasons.push('협회 등록 + 일정 규모로 본사 시스템 안정')
      }
      break
  }

  // Cap reasons to top 4 — too many feels noisy
  const finalReasons = reasons.slice(0, 4)

  return {
    brand,
    score: Math.max(0, Math.round(score)),
    reasons: finalReasons,
  }
}

function formatMan(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(Math.round(value))
}
