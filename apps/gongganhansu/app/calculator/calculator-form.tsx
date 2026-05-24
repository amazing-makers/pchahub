'use client'

import { useState } from 'react'
import { ArrowRight, Calculator, Info } from 'lucide-react'

const SPACE_TYPES = [
  { key: 'cafe', label: '카페', rates: { basic: 200, standard: 320, premium: 520 } },
  { key: 'chicken', label: '치킨', rates: { basic: 150, standard: 250, premium: 400 } },
  { key: 'korean', label: '한식당', rates: { basic: 180, standard: 300, premium: 480 } },
  { key: 'japanese', label: '일식당', rates: { basic: 250, standard: 400, premium: 650 } },
  { key: 'snack', label: '분식', rates: { basic: 120, standard: 200, premium: 330 } },
  { key: 'dessert', label: '디저트', rates: { basic: 170, standard: 280, premium: 450 } },
  { key: 'beverage', label: '음료전문점', rates: { basic: 160, standard: 270, premium: 430 } },
  { key: 'bar', label: '주점', rates: { basic: 180, standard: 300, premium: 490 } },
] as const

type SpaceKey = (typeof SPACE_TYPES)[number]['key']

const GRADES = [
  { key: 'basic', label: '실속형', desc: '기능 중심, 비용 효율화' },
  { key: 'standard', label: '스탠다드', desc: '품질과 가격 균형' },
  { key: 'premium', label: '프리미엄', desc: '고급 자재·차별화 디자인' },
] as const

type GradeKey = (typeof GRADES)[number]['key']

const BREAKDOWN = [
  { key: 'interior', label: '인테리어 공사', ratio: 0.54, color: '#3b82f6' },
  { key: 'furniture', label: '가구·집기', ratio: 0.20, color: '#10b981' },
  { key: 'electrical', label: '전기·설비', ratio: 0.12, color: '#8b5cf6' },
  { key: 'signage', label: '간판·사인', ratio: 0.08, color: '#f59e0b' },
  { key: 'misc', label: '기타(예비비)', ratio: 0.06, color: '#6b7280' },
]

function fmt(won: number) {
  if (won >= 10000) return `${(won / 10000).toFixed(1)}억원`
  return `${won.toLocaleString()}만원`
}

export function CalculatorForm() {
  const [spaceKey, setSpaceKey] = useState<SpaceKey | ''>('')
  const [area, setArea] = useState(20)
  const [grade, setGrade] = useState<GradeKey>('standard')

  const space = SPACE_TYPES.find((s) => s.key === spaceKey)
  const ratePerPyeong = space ? space.rates[grade] : 0
  const total = ratePerPyeong * area
  const low = Math.round(total * 0.85)
  const high = Math.round(total * 1.15)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* 입력 폼 */}
      <div className="space-y-5">
        {/* 업종 선택 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">
            업종 <span className="text-rose-500">*</span>
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {SPACE_TYPES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSpaceKey(s.key)}
                className={
                  'rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ' +
                  (spaceKey === s.key
                    ? 'text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300')
                }
                style={
                  spaceKey === s.key
                    ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' }
                    : undefined
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 면적 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">면적</h3>
            <span className="text-2xl font-black text-gray-900">{area}<span className="ml-0.5 text-base font-semibold text-gray-500">평</span></span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={1}
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="mt-4 w-full accent-[var(--brand-primary)]"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>5평</span>
            <span>100평</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">직접 입력:</span>
            <input
              type="number"
              min={5}
              max={200}
              value={area}
              onChange={(e) => setArea(Math.max(5, Math.min(200, Number(e.target.value))))}
              className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
            <span className="text-xs text-gray-500">평</span>
          </div>
        </div>

        {/* 시공 등급 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">시공 등급</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {GRADES.map((g) => (
              <button
                key={g.key}
                type="button"
                onClick={() => setGrade(g.key)}
                className={
                  'rounded-xl border-2 p-3.5 text-left transition-colors ' +
                  (grade === g.key ? 'text-white' : 'border-gray-200 hover:border-gray-300')
                }
                style={
                  grade === g.key
                    ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' }
                    : undefined
                }
              >
                <div className="text-sm font-bold">{g.label}</div>
                <div
                  className={
                    'mt-0.5 text-xs ' + (grade === g.key ? 'text-white/80' : 'text-gray-500')
                  }
                >
                  {g.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 패널 */}
      <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4" style={{ color: 'var(--brand-primary)' }} />
            <h3 className="text-sm font-semibold text-gray-900">예상 견적</h3>
          </div>

          {!spaceKey ? (
            <div className="mt-6 text-center text-sm text-gray-400">
              업종을 선택하면 예상 비용이 표시됩니다
            </div>
          ) : (
            <>
              <div className="mt-4 rounded-xl bg-gray-50 p-4 text-center">
                <div className="text-xs text-gray-500">예상 범위</div>
                <div className="mt-1 text-2xl font-black text-gray-900">
                  {fmt(low)} ~ {fmt(high)}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  기준: {ratePerPyeong}만원/평 × {area}평 (±15%)
                </div>
              </div>

              {/* Breakdown bar */}
              <div className="mt-4">
                <div className="flex h-3 overflow-hidden rounded-full">
                  {BREAKDOWN.map((b) => (
                    <div
                      key={b.key}
                      style={{ width: `${b.ratio * 100}%`, background: b.color }}
                    />
                  ))}
                </div>
              </div>

              {/* Breakdown table */}
              <table className="mt-4 w-full text-xs">
                <tbody className="divide-y divide-gray-50">
                  {BREAKDOWN.map((b) => {
                    const amt = Math.round(total * b.ratio)
                    return (
                      <tr key={b.key}>
                        <td className="py-1.5 text-gray-600">
                          <span
                            className="mr-1.5 inline-block h-2 w-2 rounded-full"
                            style={{ background: b.color }}
                          />
                          {b.label}
                        </td>
                        <td className="py-1.5 text-right font-semibold text-gray-700">
                          {fmt(amt)}
                        </td>
                        <td className="py-1.5 pl-3 text-right text-gray-400">
                          {Math.round(b.ratio * 100)}%
                        </td>
                      </tr>
                    )
                  })}
                  <tr className="border-t-2 border-gray-200">
                    <td className="pt-2 font-semibold text-gray-900">합계</td>
                    <td className="pt-2 text-right font-black text-gray-900">{fmt(total)}</td>
                    <td />
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 flex items-start gap-1.5 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>실제 견적은 지역·건물 상태·브랜드 CI 기준에 따라 달라질 수 있습니다. 정확한 비용은 전문 시공사 견적을 받아보세요.</span>
              </div>

              <a
                href="/quote"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white"
                style={{ background: 'var(--brand-primary)' }}
              >
                실제 견적 받기 <ArrowRight className="h-4 w-4" />
              </a>
            </>
          )}
        </div>

        {/* 업종별 평당 단가 참고 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">업종별 평균 단가 (스탠다드 기준)</h4>
          <div className="mt-3 space-y-2">
            {SPACE_TYPES.map((s) => (
              <div key={s.key} className="flex items-center justify-between text-xs">
                <span className={spaceKey === s.key ? 'font-bold' : 'text-gray-600'}>{s.label}</span>
                <span className={`font-semibold ${spaceKey === s.key ? '' : 'text-gray-700'}`}
                  style={spaceKey === s.key ? { color: 'var(--brand-primary)' } : undefined}>
                  {s.rates.standard}만원/평
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
