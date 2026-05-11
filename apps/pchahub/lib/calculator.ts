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

export function calculate(inputs: CalculatorInputs): CalculatorResult {
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
    { label: '식자재', amount: foodCost, share: percent(foodCost, monthlyRevenue) },
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

  // Heuristic: pick a daily customer count that lands close to the
  // disclosure-average monthly revenue at a 12,000 KRW order value
  // (typical café/chicken AOV). Roundable; user can edit.
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
