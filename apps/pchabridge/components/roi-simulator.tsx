'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

function formatManwon(v: number): string {
  if (v >= 10000) {
    const eok = v / 10000
    return `${Math.round(eok * 10) / 10}억원`
  }
  return `${v.toLocaleString()}만원`
}

function formatPct(v: number): string {
  return `${Math.round(v * 10) / 10}%`
}

interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (v: number) => void
}

function SliderRow({ label, value, min, max, step, display, onChange }: SliderRowProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-bold text-gray-900">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[color:var(--brand-primary)]"
      />
      <div className="mt-0.5 flex justify-between text-[10px] text-gray-400">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  )
}

interface ResultCardProps {
  label: string
  value: string
  sub?: string
  highlight?: boolean
}

function ResultCard({ label, value, sub, highlight = false }: ResultCardProps) {
  return (
    <Card className={`border ${highlight ? 'border-[color:var(--brand-primary)] bg-[color:var(--brand-primary)]/5' : 'border-gray-100'}`}>
      <CardContent className="px-4 py-4">
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <p className={`mt-1 text-xl font-black tracking-tight ${highlight ? 'text-[color:var(--brand-primary)]' : 'text-gray-900'}`}>
          {value}
        </p>
        {sub && <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>}
      </CardContent>
    </Card>
  )
}

export function ROISimulator() {
  const [investment, setInvestment] = useState(10000)   // 만원
  const [equityPct, setEquityPct] = useState(15)         // %
  const [dividendYield, setDividendYield] = useState(8)  // %
  const [years, setYears] = useState(3)                   // 년
  const [growthPct, setGrowthPct] = useState(10)         // % YoY
  const [tableOpen, setTableOpen] = useState(false)

  // Calculations
  const annualDividend = investment * (dividendYield / 100)
  const totalDividends = annualDividend * years
  const equityValue = investment * Math.pow(1 + growthPct / 100, years)
  const totalProfit = totalDividends + equityValue - investment
  const cagr = (Math.pow((investment + totalProfit) / investment, 1 / years) - 1) * 100
  const paybackYears = investment / annualDividend

  // Year-by-year table
  const yearRows = Array.from({ length: years }, (_, i) => {
    const yr = i + 1
    const cumDiv = annualDividend * yr
    const eqVal = investment * Math.pow(1 + growthPct / 100, yr)
    return { yr, cumDiv, eqVal, total: cumDiv + eqVal - investment }
  })

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
        {/* ── Left: Inputs ─────────────────────────────────────────────── */}
        <div className="border-b border-gray-100 p-6 lg:border-b-0 lg:border-r">
          <h3 className="mb-5 text-base font-bold text-gray-900">투자 조건 입력</h3>
          <div className="space-y-5">
            <SliderRow
              label="투자금액"
              value={investment}
              min={5000}
              max={50000}
              step={1000}
              display={formatManwon(investment)}
              onChange={setInvestment}
            />
            <SliderRow
              label="지분율"
              value={equityPct}
              min={5}
              max={40}
              step={1}
              display={`${equityPct}%`}
              onChange={setEquityPct}
            />
            <SliderRow
              label="배당 수익률 (연)"
              value={dividendYield}
              min={3}
              max={25}
              step={1}
              display={`${dividendYield}%`}
              onChange={setDividendYield}
            />
            <SliderRow
              label="보유 기간"
              value={years}
              min={1}
              max={7}
              step={1}
              display={`${years}년`}
              onChange={setYears}
            />
            <SliderRow
              label="연 기업 가치 성장률"
              value={growthPct}
              min={0}
              max={30}
              step={1}
              display={`${growthPct}%`}
              onChange={setGrowthPct}
            />
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-gray-400">
            * 회수 기간(단순 배당 기준): <strong className="text-gray-600">{Math.round(paybackYears * 10) / 10}년</strong>
          </p>
        </div>

        {/* ── Right: Results ───────────────────────────────────────────── */}
        <div className="p-6">
          <h3 className="mb-5 text-base font-bold text-gray-900">예상 수익 결과</h3>
          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              label="총 배당수익"
              value={formatManwon(Math.round(totalDividends))}
              sub={`${years}년 누적 (연 ${dividendYield}%)`}
            />
            <ResultCard
              label="예상 지분가치"
              value={formatManwon(Math.round(equityValue))}
              sub={`연 ${growthPct}% 성장 가정`}
            />
            <ResultCard
              label="총 수익"
              value={formatManwon(Math.round(totalProfit))}
              sub={`배당 + 시세차익`}
              highlight
            />
            <ResultCard
              label="연평균 수익률 (CAGR)"
              value={formatPct(cagr)}
              sub={`${years}년 기준`}
              highlight
            />
          </div>

          {/* Year-by-year table toggle */}
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setTableOpen((o) => !o)}
              className="inline-flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              연도별 수익 상세
              {tableOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {tableOpen && (
              <div className="mt-3 overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
                      <th className="px-4 py-2.5 text-left">연도</th>
                      <th className="px-4 py-2.5 text-right">누적 배당</th>
                      <th className="px-4 py-2.5 text-right">지분가치</th>
                      <th className="px-4 py-2.5 text-right">순 수익</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearRows.map((row) => (
                      <tr
                        key={row.yr}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2 font-medium text-gray-900">{row.yr}년차</td>
                        <td className="px-4 py-2 text-right text-gray-700">
                          {formatManwon(Math.round(row.cumDiv))}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700">
                          {formatManwon(Math.round(row.eqVal))}
                        </td>
                        <td className={`px-4 py-2 text-right font-semibold ${row.total >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {row.total >= 0 ? '+' : ''}{formatManwon(Math.round(row.total))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-b-2xl border-t border-gray-100 bg-gray-50 px-6 py-3">
        <p className="text-[11px] text-gray-400">
          본 시뮬레이터는 참고용이며 실제 수익을 보장하지 않습니다. 모든 투자에는 원금 손실 위험이 있으며, 투자 결정 전 충분한 검토를 권장합니다.
        </p>
      </div>
    </div>
  )
}
