import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'
import { ArrowRight, BarChart3, Shield, TrendingUp } from 'lucide-react'
import { Button } from '@amakers/ui'
import { ROISimulator } from '@/components/roi-simulator'

export const metadata: Metadata = buildPageMetadata('pchabridge', {
  title: '투자 수익 시뮬레이터',
  description: '프랜차이즈 투자 시 기대 수익률을 직접 계산해보세요.',
  path: '/simulator',
})

const COMPARISON = [
  {
    type: '예금',
    yield: '3.5%',
    risk: '매우 낮음',
    liquidity: '높음',
    upside: '없음',
    riskColor: 'text-emerald-600',
    bg: 'bg-gray-50',
  },
  {
    type: '부동산 임대',
    yield: '5%',
    risk: '중간',
    liquidity: '낮음',
    upside: '시세차익',
    riskColor: 'text-amber-600',
    bg: 'bg-gray-50',
  },
  {
    type: '프랜차이즈 투자',
    yield: '8–15%',
    risk: '중간~높음',
    liquidity: '중간',
    upside: '배당 + 지분가치',
    riskColor: 'text-rose-600',
    bg: 'bg-[color:var(--brand-primary)]/5',
    highlight: true,
  },
]

export default function SimulatorPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto py-section">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            투자 수익 시뮬레이터
          </p>
          <h1 className="mt-4 max-w-2xl text-hero font-bold">
            나의 프랜차이즈 투자 수익
            <br />
            미리 계산하기
          </h1>
          <p className="mt-5 max-w-xl text-lg text-gray-300">
            투자금액·배당률·성장률을 직접 조절하며 예상 수익과 CAGR을 즉시 확인하세요.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              배당 + 시세차익 동시 계산
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              연도별 수익 상세 보기
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-amber-400" />
              참고용 — 수익 보장 아님
            </span>
          </div>
        </div>
      </section>

      {/* Simulator */}
      <section className="container mx-auto py-section">
        <ROISimulator />
      </section>

      {/* Comparison table */}
      <section className="border-t border-gray-100 bg-gray-50 py-section">
        <div className="container mx-auto">
          <div className="mb-6">
            <h2 className="text-h3 font-semibold text-gray-900">다른 투자와 비교</h2>
            <p className="mt-1 text-sm text-gray-500">
              동일 금액을 투자할 때 예상 수익률과 위험 수준을 비교해 보세요.
            </p>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3.5 text-left">투자 유형</th>
                  <th className="px-6 py-3.5 text-center">연 수익률</th>
                  <th className="px-6 py-3.5 text-center">위험 수준</th>
                  <th className="px-6 py-3.5 text-center">환금성</th>
                  <th className="px-6 py-3.5 text-center">추가 수익</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr
                    key={row.type}
                    className={`border-b border-gray-50 last:border-0 ${row.bg} ${row.highlight ? 'font-semibold' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <span className={row.highlight ? 'text-gray-900' : 'text-gray-700'}>
                        {row.type}
                      </span>
                      {row.highlight && (
                        <span
                          className="ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                          style={{ backgroundColor: 'var(--brand-primary)' }}
                        >
                          이 플랫폼
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">{row.yield}</td>
                    <td className={`px-6 py-4 text-center font-semibold ${row.riskColor}`}>{row.risk}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{row.liquidity}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{row.upside}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {COMPARISON.map((row) => (
              <div
                key={row.type}
                className={`rounded-2xl border p-4 ${row.highlight ? 'border-[color:var(--brand-primary)]' : 'border-gray-200 bg-white'} ${row.bg}`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-bold text-gray-900">{row.type}</span>
                  <span className="text-xl font-black text-gray-900">{row.yield}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">위험</p>
                    <p className={`font-semibold ${row.riskColor}`}>{row.risk}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">환금성</p>
                    <p className="font-semibold text-gray-700">{row.liquidity}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">추가 수익</p>
                    <p className="font-semibold text-gray-700">{row.upside}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[11px] text-gray-400">
            * 수익률은 과거 사례 참고치이며 미래 수익을 보장하지 않습니다. 위험 수준은 일반적인 시장 기준입니다.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-white py-section">
        <div className="container mx-auto text-center">
          <h2 className="text-h3 font-bold text-gray-900">실제 투자 기회를 확인하세요</h2>
          <p className="mx-auto mt-3 max-w-lg text-gray-500">
            시뮬레이션이 마음에 드셨다면, amakers가 검증한 실제 프랜차이즈 투자 라운드를 살펴보세요.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="/investments">
              <Button size="lg" className="gap-1.5">
                실제 투자 기회 보러가기 <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="/guide">
              <Button size="lg" variant="ghost" className="text-gray-700">
                투자자 가이드 읽기
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
