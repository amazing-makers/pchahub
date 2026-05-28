// DART 데이터 소스 자동 분기.
//
// DART_API_KEY가 설정되어 있으면 실 API를 사용하고, 없으면 mock-data.ts를
// 그대로 사용한다. 페이지 코드는 항상 이 모듈만 import한다.
//
// 사용 예:
//   import { getCompanyFinancials, hasDisclosures } from '@/lib/dart/source'
//   const fin = await getCompanyFinancials('00126380') // 삼성: DART corp_code

import {
  ROUNDS,
  MA_LISTINGS,
  type MockInvestmentRound,
  type MockMAListing,
} from '../mock-data'
import {
  fetchFinancialStatement,
  fetchDisclosureList,
  fetchMultiFinancial,
  type DartFinancialItem,
  type DartDisclosureItem,
} from './client'

function hasKey(): boolean {
  return Boolean(process.env.DART_API_KEY)
}

export function getDataSourceLabel(): 'mock' | 'dart' {
  return hasKey() ? 'dart' : 'mock'
}

// ──────────────────────────────────────────────
// 재무제표 요약
// ──────────────────────────────────────────────

export interface CompanyFinancials {
  corpCode: string
  corpName: string
  year: number
  revenue: number        // 매출액 (원)
  operatingProfit: number
  netIncome: number
  totalAssets: number
  totalDebt: number
  debtRatio: number      // 부채비율 (%)
}

function parseAmount(s: string | undefined): number {
  if (!s) return 0
  return parseInt(s.replace(/,/g, ''), 10) || 0
}

function extractFinancials(items: DartFinancialItem[], corpCode: string, year: number): CompanyFinancials {
  const find = (sjDiv: string, accountNm: string) =>
    items.find((i) => i.sj_div === sjDiv && i.account_nm.includes(accountNm))

  const revenue        = parseAmount(find('IS', '매출액')?.thstrm_amount)
  const operatingProfit = parseAmount(find('IS', '영업이익')?.thstrm_amount)
  const netIncome      = parseAmount(find('IS', '당기순이익')?.thstrm_amount)
  const totalAssets    = parseAmount(find('BS', '자산총계')?.thstrm_amount)
  const totalDebt      = parseAmount(find('BS', '부채총계')?.thstrm_amount)
  const equity         = totalAssets - totalDebt
  const debtRatio      = equity > 0 ? Math.round((totalDebt / equity) * 100) : 0

  return { corpCode, corpName: '', year, revenue, operatingProfit, netIncome, totalAssets, totalDebt, debtRatio }
}

export async function getCompanyFinancials(corpCode: string, year?: number): Promise<CompanyFinancials | null> {
  if (!hasKey()) return null

  const bsnsYear = String(year ?? new Date().getFullYear() - 1)
  try {
    const res = await fetchFinancialStatement({
      corpCode,
      bsnsYear,
      reprtCode: '11011',  // 사업보고서
    })
    const items = res.data ?? []
    if (items.length === 0) return null
    const fin = extractFinancials(items, corpCode, parseInt(bsnsYear))
    fin.corpName = res.corp_name ?? ''
    return fin
  } catch (err) {
    console.error('[dart] getCompanyFinancials 실패:', err)
    return null
  }
}

// ──────────────────────────────────────────────
// 공시 목록
// ──────────────────────────────────────────────

export async function getRecentDisclosures(corpCode: string, days = 90): Promise<DartDisclosureItem[]> {
  if (!hasKey()) return []

  const ed = new Date()
  const bg = new Date(ed)
  bg.setDate(bg.getDate() - days)
  const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '')

  try {
    const res = await fetchDisclosureList({
      corpCode,
      bgDt: fmt(bg),
      edDt: fmt(ed),
      pageCount: 20,
    })
    return res.list ?? []
  } catch (err) {
    console.error('[dart] getRecentDisclosures 실패:', err)
    return []
  }
}

export async function hasRecentDisclosure(corpCode: string, days = 365): Promise<boolean> {
  const list = await getRecentDisclosures(corpCode, days)
  return list.length > 0
}

// ──────────────────────────────────────────────
// 딜플로우 — 투자 라운드 재무 보강
// ──────────────────────────────────────────────

/**
 * DART corp_code가 매핑된 라운드의 재무 데이터를 실 API로 보강한다.
 * 매핑 없으면 mock 데이터 그대로 반환.
 */
/**
 * 투자 라운드 목록.
 * dartCorpCode가 있는 라운드는 DART highlights에 실 매출을 반영할 수 있다.
 * 현재는 mock 그대로 반환하고, highlights 보강은 개별 라운드 상세 페이지에서
 * getCompanyFinancials()를 호출해 처리한다.
 */
export async function getRoundsWithFinancials(): Promise<MockInvestmentRound[]> {
  return ROUNDS
}

export async function getMaListingsWithFinancials(): Promise<MockMAListing[]> {
  if (!hasKey()) return MA_LISTINGS

  const withCode = MA_LISTINGS.filter((m) => m.dartCorpCode)
  if (withCode.length === 0) return MA_LISTINGS

  try {
    const year = String(new Date().getFullYear() - 1)
    const corpCodes = [...new Set(withCode.map((m) => m.dartCorpCode!))].join(',')
    const res = await fetchMultiFinancial({ corpCode: corpCodes, bsnsYear: year, reprtCode: '11011' })
    const items = res.data ?? []

    const revenueMap: Record<string, number> = {}
    for (const item of items) {
      if (item.account_nm.includes('매출액') && item.sj_div === 'IS') {
        revenueMap[item.corp_code] = parseAmount(item.thstrm_amount)
      }
    }

    return MA_LISTINGS.map((m) => {
      if (!m.dartCorpCode) return m
      const rev = revenueMap[m.dartCorpCode]
      if (!rev) return m
      return { ...m, annualRevenue: rev }
    })
  } catch (err) {
    console.error('[dart] getMaListingsWithFinancials 실패 — mock 사용:', err)
    return MA_LISTINGS
  }
}
