'use client'

import { useMemo, useState, useEffect } from 'react'
import { ArrowRight, RotateCcw, TrendingUp } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { BRANDS, type MockBrand } from '@/lib/mock-data'
import { getBrandDetail } from '@/lib/mock-brand-detail'
import {
  DEFAULT_INPUTS,
  calculate,
  inputsFromBrand,
  type CalculatorInputs,
} from '@/lib/calculator'

interface CalculatorFormProps {
  initialBrandId?: string
}

const COST_COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#64748B']

export function CalculatorForm({ initialBrandId }: CalculatorFormProps) {
  const initialBrand = initialBrandId ? BRANDS.find((b) => b.id === initialBrandId) : undefined
  const [brandId, setBrandId] = useState<string>(initialBrandId ?? '')
  const [inputs, setInputs] = useState<CalculatorInputs>(
    initialBrand ? inputsFromBrand(initialBrand) : DEFAULT_INPUTS,
  )

  // When user changes the brand selector, refill inputs.
  useEffect(() => {
    if (!brandId) return
    const b = BRANDS.find((x) => x.id === brandId)
    if (b) setInputs(inputsFromBrand(b))
  }, [brandId])

  const result = useMemo(() => calculate(inputs), [inputs])
  const selectedBrand = brandId ? BRANDS.find((b) => b.id === brandId) : null
  const brandAvg = selectedBrand ? getBrandDetail(selectedBrand).revenue.averageMonthly : null

  const onResetBrand = () => {
    setBrandId('')
    setInputs(DEFAULT_INPUTS)
  }

  const update = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) =>
    setInputs((p) => ({ ...p, [key]: value }))

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* Input column */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-6 p-6">
          {/* Brand picker */}
          <FormGroup label="기준 브랜드" helper="선택하면 협회 등록 정보공개서 기반 기본값을 자동으로 채웁니다">
            <div className="flex gap-2">
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="">브랜드 선택 (선택 사항)</option>
                {BRANDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} · {b.categoryLabel}
                  </option>
                ))}
              </select>
              {brandId && (
                <button
                  type="button"
                  onClick={onResetBrand}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
                  aria-label="초기화"
                >
                  <RotateCcw className="h-3 w-3" />
                  초기화
                </button>
              )}
            </div>
          </FormGroup>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormGroup label="매장 면적" suffix="평">
              <NumberInput value={inputs.area} onChange={(v) => update('area', v)} min={3} max={200} />
            </FormGroup>
            <FormGroup label="월 운영 일수" suffix="일">
              <NumberInput
                value={inputs.openDaysPerMonth}
                onChange={(v) => update('openDaysPerMonth', v)}
                min={20}
                max={31}
              />
            </FormGroup>
            <FormGroup label="일 평균 고객" suffix="명">
              <NumberInput
                value={inputs.customersPerDay}
                onChange={(v) => update('customersPerDay', v)}
                min={1}
                max={2000}
              />
            </FormGroup>
            <FormGroup label="객단가" suffix="원">
              <NumberInput
                value={inputs.avgOrderValue}
                onChange={(v) => update('avgOrderValue', v)}
                min={1000}
                max={500_000}
                step={500}
              />
            </FormGroup>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              월 비용
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormGroup label="월 임대료" suffix="만원">
                <NumberInput
                  value={inputs.monthlyRent}
                  onChange={(v) => update('monthlyRent', v)}
                  min={0}
                  max={5000}
                  step={10}
                />
              </FormGroup>
              <FormGroup label="인건비" suffix="만원/월">
                <NumberInput
                  value={inputs.monthlyLabor}
                  onChange={(v) => update('monthlyLabor', v)}
                  min={0}
                  max={5000}
                  step={10}
                />
              </FormGroup>
              <FormGroup label="식자재 원가율" suffix="%">
                <NumberInput
                  value={inputs.foodCostRate}
                  onChange={(v) => update('foodCostRate', v)}
                  min={0}
                  max={70}
                  step={1}
                />
              </FormGroup>
              <FormGroup label="기타 운영비" suffix="만원/월" helper="마케팅·유틸리티 등">
                <NumberInput
                  value={inputs.otherMonthlyCost}
                  onChange={(v) => update('otherMonthlyCost', v)}
                  min={0}
                  max={2000}
                  step={10}
                />
              </FormGroup>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              본사 로열티
            </div>
            <div className="flex flex-wrap gap-2">
              <PillButton
                active={inputs.royaltyType === 'none'}
                onClick={() => setInputs((p) => ({ ...p, royaltyType: 'none', royaltyValue: 0 }))}
              >
                없음
              </PillButton>
              <PillButton
                active={inputs.royaltyType === 'fixed'}
                onClick={() => setInputs((p) => ({ ...p, royaltyType: 'fixed' }))}
              >
                고정 (만원/월)
              </PillButton>
              <PillButton
                active={inputs.royaltyType === 'percentage'}
                onClick={() => setInputs((p) => ({ ...p, royaltyType: 'percentage' }))}
              >
                매출 비례 (%)
              </PillButton>
            </div>
            {inputs.royaltyType !== 'none' && (
              <div className="mt-3 max-w-xs">
                <FormGroup
                  label={inputs.royaltyType === 'fixed' ? '월 로열티' : '매출 대비 비율'}
                  suffix={inputs.royaltyType === 'fixed' ? '만원' : '%'}
                >
                  <NumberInput
                    value={inputs.royaltyValue}
                    onChange={(v) => update('royaltyValue', v)}
                    min={0}
                    max={inputs.royaltyType === 'percentage' ? 30 : 1000}
                    step={inputs.royaltyType === 'percentage' ? 0.5 : 5}
                  />
                </FormGroup>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <FormGroup label="총 창업비" suffix="만원" helper="회수 기간 계산에 사용됩니다">
              <NumberInput
                value={inputs.totalStartupCost}
                onChange={(v) => update('totalStartupCost', v)}
                min={500}
                max={50_000}
                step={100}
              />
            </FormGroup>
          </div>
        </CardContent>
      </Card>

      {/* Result column */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-5 p-6">
            {/* Revenue */}
            <div>
              <div className="text-xs text-gray-500">예상 월매출</div>
              <div className="mt-1 text-h3 font-bold text-gray-900">
                {formatNumber(Math.round(result.monthlyRevenue))}
                <span className="text-base font-medium text-gray-600"> 만원</span>
              </div>
              {brandAvg !== null && (
                <RevenueComparison estimate={result.monthlyRevenue} brandAvg={brandAvg} />
              )}
            </div>

            {/* Cost breakdown */}
            <div className="border-t border-gray-100 pt-5">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                비용 상세
              </div>
              <div className="space-y-2.5">
                {result.costs.map((line, i) => (
                  <div key={line.label}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ background: COST_COLORS[i % COST_COLORS.length] }}
                        />
                        <span className="text-gray-700">{line.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">
                          {formatNumber(Math.round(line.amount))}만
                        </span>
                        <span className="ml-2 text-xs text-gray-500">{line.share.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded bg-gray-100">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${Math.min(line.share, 100)}%`,
                          background: COST_COLORS[i % COST_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
                <span className="text-gray-600">총 비용</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(Math.round(result.totalCost))}만
                </span>
              </div>
            </div>

            {/* Profit */}
            <div
              className={
                'rounded-xl p-4 ' +
                (result.operatingProfit > 0 ? 'bg-emerald-50' : 'bg-rose-50')
              }
            >
              <div className="text-xs text-gray-600">월 영업이익</div>
              <div
                className={
                  'mt-1 text-h3 font-bold ' +
                  (result.operatingProfit > 0 ? 'text-emerald-700' : 'text-rose-700')
                }
              >
                {result.operatingProfit > 0 ? '+' : ''}
                {formatNumber(Math.round(result.operatingProfit))}
                <span className="text-base font-medium text-gray-600"> 만원</span>
              </div>
              <div className="mt-0.5 text-xs text-gray-600">
                영업이익률 {result.profitMargin.toFixed(1)}%
              </div>
            </div>

            {/* Recovery */}
            <div>
              <div className="text-xs text-gray-500">총 창업비 회수 기간</div>
              <div className="mt-1 text-base font-semibold text-gray-900">
                {result.recoveryMonths === null
                  ? '영업이익 음수 — 회수 불가'
                  : result.recoveryMonths >= 120
                    ? '120개월 이상'
                    : `약 ${result.recoveryMonths}개월 (${(result.recoveryMonths / 12).toFixed(1)}년)`}
              </div>
            </div>

            <a
              href={selectedBrand ? `/inquiry?brand=${selectedBrand.id}` : '/inquiry'}
              className="block"
            >
              <Button size="lg" className="w-full gap-1">
                이 조건으로 상담 신청 <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>

        <p className="mt-3 text-xs text-gray-500">
          본 계산은 입력값을 바탕으로 한 추정치이며 실제 매출과 차이가 있을 수 있습니다. 협회 등록 평균은
          참고용입니다.
        </p>
      </div>
    </div>
  )
}

function RevenueComparison({ estimate, brandAvg }: { estimate: number; brandAvg: number }) {
  const diff = estimate - brandAvg
  const pct = (diff / brandAvg) * 100
  const sign = diff >= 0 ? '+' : ''
  return (
    <div className="mt-1 inline-flex items-center gap-1 text-xs">
      <TrendingUp className={'h-3 w-3 ' + (diff >= 0 ? 'text-emerald-600' : 'text-rose-500')} />
      <span className={diff >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
        협회 평균 대비 {sign}
        {formatNumber(Math.round(diff))}만 ({sign}
        {pct.toFixed(1)}%)
      </span>
    </div>
  )
}

function FormGroup({
  label,
  helper,
  suffix,
  children,
}: {
  label: string
  helper?: string
  suffix?: string
  children: React.ReactNode
}) {
  return (
    <label className="block text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-700">{label}</span>
        {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
      </div>
      <div className="mt-1.5">{children}</div>
      {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
    </label>
  )
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => {
        const v = parseFloat(e.target.value)
        onChange(Number.isFinite(v) ? v : 0)
      }}
      min={min}
      max={max}
      step={step}
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
    />
  )
}

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-full px-3 py-1.5 text-xs font-medium transition-colors ' +
        (active
          ? 'bg-gray-900 text-white'
          : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300')
      }
    >
      {children}
    </button>
  )
}
