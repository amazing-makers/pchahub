// Pure profit-calculation helpers used by /calculator. Kept framework-free
// so they can be unit-tested or reused on the scanner page later.

import type { MockBrand } from './mock-data'
import { getBrandDetail, type BrandDetail } from './mock-brand-detail'

export interface CalculatorInputs {
  /** 매장 면적 (평) */
  area: number
  /** 월 임대료 (만원) */
  monthlyRent: number
  /** 일 평균 고객 수 */
  customersPerDay: number
  /** 객단가 (원) */
  avgOrderValue: number
  /** 월 운영 일수 */
  openDaysPerMonth: number
  /** 식자재 원가 비율 (%) */
  foodCostRate: number
  /** 인건비 (만원/월) */
  monthlyLabor: number
  /** 기타 운영비 (마케팅·유틸리티 등, 만원/월) */
  otherMonthlyCost: number
  /** 로열티 — fixed 만원 또는 percent */
  royaltyType: 'fixed' | 'percentage' | 'none'
  royaltyValue: number
  /** 총 창업비 (만원) — 회수 기간 계산용 */
  totalStartupCost: number
}

export interface CostLine {
  label: string
  amount: number // 만원
  share: number // % of revenue
}

export interface CalculatorResult {
  monthlyRevenue: number
  costs: CostLine[]
  totalCost: number
  operatingProfit: number
  profitMargin: number // %
  recoveryMonths: number | null
}

export function calculate(inputs: CalculatorInputs, variableCostLabel = '식자재'): CalculatorResult {
  // 매출 — 일평균 고객 × 객단가 × 운영일수, 결과는 만원 단위
  const monthlyRevenue =
    (inputs.customersPerDay * inputs.avgOrderValue * inputs.openDaysPerMonth) / 10_000

  const foodCost = monthlyRevenue * (inputs.foodCostRate / 100)
  const labor = inputs.monthlyLabor
  const rent = inputs.monthlyRent
  const royalty =
    inputs.royaltyType === 'none'
      ? 0
      : inputs.royaltyType === 'fixed'
        ? inputs.royaltyValue
        : monthlyRevenue * (inputs.royaltyValue / 100)
  const other = inputs.otherMonthlyCost

  const lines: CostLine[] = [
    { label: variableCostLabel, amount: foodCost, share: percent(foodCost, monthlyRevenue) },
    { label: '인건비', amount: labor, share: percent(labor, monthlyRevenue) },
    { label: '임대료', amount: rent, share: percent(rent, monthlyRevenue) },
    { label: '로열티', amount: royalty, share: percent(royalty, monthlyRevenue) },
    { label: '기타 운영비', amount: other, share: percent(other, monthlyRevenue) },
  ]

  const totalCost = lines.reduce((s, l) => s + l.amount, 0)
  const operatingProfit = monthlyRevenue - totalCost
  const profitMargin = percent(operatingProfit, monthlyRevenue)
  const recoveryMonths =
    operatingProfit > 0 ? Math.ceil(inputs.totalStartupCost / operatingProfit) : null

  return {
    monthlyRevenue,
    costs: lines,
    totalCost,
    operatingProfit,
    profitMargin,
    recoveryMonths,
  }
}

function percent(part: number, whole: number): number {
  if (whole <= 0) return 0
  return (part / whole) * 100
}

/** Defaults that produce a sensible starting state on /calculator. */
export const DEFAULT_INPUTS: CalculatorInputs = {
  area: 20,
  monthlyRent: 300,
  customersPerDay: 80,
  avgOrderValue: 12_000,
  openDaysPerMonth: 28,
  foodCostRate: 35,
  monthlyLabor: 480,
  otherMonthlyCost: 80,
  royaltyType: 'none',
  royaltyValue: 0,
  totalStartupCost: 5500,
}

// 비음식 업종별 기본값 프리셋 — 객단가·원가율·인건비는 업종 특성 반영
const NON_FOOD_PRESETS: Record<string, {
  avgOrderValue: number   // 원 (방문당 평균 매출)
  customersPerDay: number
  openDaysPerMonth: number
  costRate: number        // 식자재·소모품 원가율 (%)
  labor: number           // 만원/월
  rent: number            // 만원/월
  otherMonthlyCost: number
}> = {
  pcbang: {
    avgOrderValue: 7_500, customersPerDay: 80, openDaysPerMonth: 30,
    costRate: 18, labor: 350, rent: 300, otherMonthlyCost: 120,
  },
  study: {
    avgOrderValue: 8_000, customersPerDay: 60, openDaysPerMonth: 30,
    costRate: 12, labor: 280, rent: 250, otherMonthlyCost: 80,
  },
  convenience: {
    avgOrderValue: 8_000, customersPerDay: 300, openDaysPerMonth: 30,
    costRate: 68, labor: 420, rent: 320, otherMonthlyCost: 80,
  },
  laundry: {
    avgOrderValue: 5_000, customersPerDay: 40, openDaysPerMonth: 30,
    costRate: 10, labor: 150, rent: 200, otherMonthlyCost: 60,
  },
  education: {
    avgOrderValue: 45_000, customersPerDay: 15, openDaysPerMonth: 26,
    costRate: 5, labor: 480, rent: 280, otherMonthlyCost: 60,
  },
  leisure: {
    avgOrderValue: 15_000, customersPerDay: 50, openDaysPerMonth: 28,
    costRate: 12, labor: 400, rent: 280, otherMonthlyCost: 80,
  },
  life: {
    avgOrderValue: 20_000, customersPerDay: 20, openDaysPerMonth: 26,
    costRate: 20, labor: 320, rent: 200, otherMonthlyCost: 60,
  },
}

const NON_FOOD_CATS = new Set(Object.keys(NON_FOOD_PRESETS))

/**
 * Build initial inputs tailored to a selected brand. Pulls cost/operation
 * defaults from the brand's disclosure and assumes a customer count that
 * lands near the brand's 협회 평균 매출 — a useful baseline the user can
 * then tweak.
 */
export function inputsFromBrand(brand: MockBrand, detail?: BrandDetail): CalculatorInputs {
  const d = detail ?? getBrandDetail(brand)
  const totalStartup =
    d.costs.franchiseFee +
    d.costs.deposit +
    d.costs.interiorFee +
    d.costs.educationFee +
    d.costs.otherFees

  // 비음식 업종 — 업종별 프리셋 사용
  if (NON_FOOD_CATS.has(brand.category)) {
    const p = NON_FOOD_PRESETS[brand.category]!
    return {
      area: d.costs.recommendedArea,
      monthlyRent: p.rent,
      customersPerDay: p.customersPerDay,
      avgOrderValue: p.avgOrderValue,
      openDaysPerMonth: p.openDaysPerMonth,
      foodCostRate: p.costRate,
      monthlyLabor: p.labor,
      otherMonthlyCost: p.otherMonthlyCost,
      royaltyType: d.costs.royaltyType,
      royaltyValue: d.costs.royaltyValue,
      totalStartupCost: totalStartup,
    }
  }

  // 음식 업종 — 협회 평균 월매출 기반 역산 고객 수 사용
  const avgOrderValue = brand.category === 'cafe' ? 7500 : brand.category === 'snack' ? 8500 : 14_000
  const customersPerDay = Math.round(
    (d.revenue.averageMonthly * 10_000) / (avgOrderValue * 28),
  )

  const labor =
    brand.category === 'cafe' ? 320 : brand.category === 'snack' ? 360 : brand.category === 'bar' ? 580 : 480

  return {
    area: d.costs.recommendedArea,
    monthlyRent: brand.category === 'bar' ? 380 : 300,
    customersPerDay,
    avgOrderValue,
    openDaysPerMonth: brand.category === 'bar' ? 26 : 28,
    foodCostRate: brand.category === 'cafe' ? 28 : brand.category === 'bar' ? 33 : 35,
    monthlyLabor: labor,
    otherMonthlyCost: 80,
    royaltyType: d.costs.royaltyType,
    royaltyValue: d.costs.royaltyValue,
    totalStartupCost: totalStartup,
  }
}

/** 비음식 업종 여부 — form UI 레이블 조정에 사용 */
export function isNonFoodCategory(category: string): boolean {
  return NON_FOOD_CATS.has(category)
}
