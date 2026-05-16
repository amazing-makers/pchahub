'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { BarChart2, MapPin, SlidersHorizontal, X } from 'lucide-react'
import type { MockArea } from '@/lib/mock-data'
import { AREAS, listingsByArea } from '@/lib/mock-data'
import { AreaChip } from '@/components/area-chip'
import { formatNumber } from '@amakers/utils'

const MAX_COMPARE = 3

const AreasMap = dynamic(() => import('@/components/areas-map'), {
  ssr: false,
  loading: () => <div className="h-[480px] w-full animate-pulse rounded-2xl bg-gray-200" />,
})

// ─────────────────────────────────────────────────────────────────────────────
// Filter presets
// ─────────────────────────────────────────────────────────────────────────────
const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전']

const FOOT_TRAFFIC_TIERS = [
  { label: '전체',     desc: '',           min: 0,     max: Infinity },
  { label: '소형',     desc: '~4만명',      min: 0,     max: 40000 },
  { label: '중형',     desc: '4~6만명',     min: 40000, max: 60000 },
  { label: '대형',     desc: '6~8만명',     min: 60000, max: 80000 },
  { label: '최고급',   desc: '8만명+',      min: 80000, max: Infinity },
]

const RENT_TIERS = [
  { label: '전체',     min: 0,  max: Infinity },
  { label: '~10만',   min: 0,  max: 10 },
  { label: '~15만',   min: 0,  max: 15 },
  { label: '~20만',   min: 0,  max: 20 },
  { label: '20만+',   min: 20, max: Infinity },
]

const RIGHT_FEE_TIERS = [
  { label: '전체',      min: 0,    max: Infinity },
  { label: '~3,000만', min: 0,    max: 3000 },
  { label: '~5,000만', min: 0,    max: 5000 },
  { label: '5,000만+', min: 5000, max: Infinity },
]

// Categories that actually appear in AREAS.topCategories
const AREA_CATEGORIES = [
  { key: 'cafe',      label: '카페'   },
  { key: 'korean',    label: '한식'   },
  { key: 'bar',       label: '주점'   },
  { key: 'snack',     label: '분식'   },
  { key: 'dessert',   label: '디저트' },
  { key: 'beverage',  label: '음료'   },
  { key: 'chicken',   label: '치킨'   },
  { key: 'japanese',  label: '일식'   },
]

// ─────────────────────────────────────────────────────────────────────────────
// Filter types
// ─────────────────────────────────────────────────────────────────────────────
interface AreaFilters {
  region:          string | null
  footTrafficTier: number
  rentTier:        number
  rightFeeTier:    number
  category:        string | null
}

const DEFAULT_FILTERS: AreaFilters = {
  region: null, footTrafficTier: 0, rentTier: 0, rightFeeTier: 0, category: null,
}

function matchesAreaFilters(area: MockArea, f: AreaFilters): boolean {
  if (f.region && area.region !== f.region) return false

  const ftt = FOOT_TRAFFIC_TIERS[f.footTrafficTier]
  if (ftt && area.footTraffic < ftt.min) return false
  if (ftt && area.footTraffic > ftt.max) return false

  const rt = RENT_TIERS[f.rentTier]
  if (rt && area.avgMonthlyRentPerPyeong > rt.max) return false
  if (rt && area.avgMonthlyRentPerPyeong < rt.min) return false

  const rft = RIGHT_FEE_TIERS[f.rightFeeTier]
  if (rft && area.avgRightFee > rft.max) return false
  if (rft && area.avgRightFee < rft.min) return false

  if (f.category && !area.topCategories.some(c => c.key === f.category)) return false

  return true
}

function activeCount(f: AreaFilters): number {
  return (
    (f.region          ? 1 : 0) +
    (f.footTrafficTier ? 1 : 0) +
    (f.rentTier        ? 1 : 0) +
    (f.rightFeeTier    ? 1 : 0) +
    (f.category        ? 1 : 0)
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function AreasPageClient() {
  const [filters,      setFilters]      = useState<AreaFilters>(DEFAULT_FILTERS)
  const [filtersOpen,  setFiltersOpen]  = useState(false)
  const [compareKeys,  setCompareKeys]  = useState<Set<string>>(new Set())
  const [compareOpen,  setCompareOpen]  = useState(false)

  const setFilter = <K extends keyof AreaFilters>(k: K, v: AreaFilters[K]) =>
    setFilters(prev => ({ ...prev, [k]: v }))
  const resetFilters = () => setFilters(DEFAULT_FILTERS)

  const filteredAreas = useMemo(
    () => AREAS.filter(a => matchesAreaFilters(a, filters)),
    [filters],
  )

  const filterCount = activeCount(filters)

  const toggleCompare = (key: string) => {
    setCompareKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) } else if (next.size < MAX_COMPARE) { next.add(key) }
      return next
    })
  }
  const compareAreas = useMemo(
    () => [...compareKeys].map(k => AREAS.find(a => a.key === k)).filter(Boolean) as MockArea[],
    [compareKeys],
  )

  return (
    <>
      {/* ── 필터 바 ──────────────────────────────────────────────────────────── */}
      <section className="sticky top-[65px] z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="container mx-auto">
          {/* ── 필터 토글 헤더 ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 py-3">
            <button
              onClick={() => setFiltersOpen(v => !v)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                filtersOpen
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              필터
              {filterCount > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                    filtersOpen ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
                  }`}
                >
                  {filterCount}
                </span>
              )}
            </button>

            {/* ── 활성 필터 칩 ─────────────────────────────────────────────── */}
            <div className="flex flex-1 flex-wrap items-center gap-1.5">
              {filters.region && (
                <ActiveChip onRemove={() => setFilter('region', null)}>
                  {filters.region}
                </ActiveChip>
              )}
              {filters.footTrafficTier > 0 && (() => {
                const tier = FOOT_TRAFFIC_TIERS[filters.footTrafficTier]
                return tier ? (
                  <ActiveChip onRemove={() => setFilter('footTrafficTier', 0)}>
                    {tier.label}
                    {tier.desc && <span className="ml-1 opacity-70">{tier.desc}</span>}
                  </ActiveChip>
                ) : null
              })()}
              {filters.rentTier > 0 && (() => {
                const tier = RENT_TIERS[filters.rentTier]
                return tier ? (
                  <ActiveChip onRemove={() => setFilter('rentTier', 0)}>
                    평당 {tier.label}
                  </ActiveChip>
                ) : null
              })()}
              {filters.rightFeeTier > 0 && (() => {
                const tier = RIGHT_FEE_TIERS[filters.rightFeeTier]
                return tier ? (
                  <ActiveChip onRemove={() => setFilter('rightFeeTier', 0)}>
                    권리금 {tier.label}
                  </ActiveChip>
                ) : null
              })()}
              {filters.category && (
                <ActiveChip onRemove={() => setFilter('category', null)}>
                  {AREA_CATEGORIES.find(c => c.key === filters.category)?.label}
                </ActiveChip>
              )}
              {filterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-gray-400 hover:text-gray-700"
                >
                  초기화
                </button>
              )}
            </div>

            {/* ── 결과 카운트 ──────────────────────────────────────────────── */}
            <div className="shrink-0 text-sm text-gray-500">
              <strong className="font-bold text-gray-900">{filteredAreas.length}</strong>
              <span>개 상권</span>
            </div>
          </div>

          {/* ── 확장 필터 패널 ───────────────────────────────────────────────── */}
          {filtersOpen && (
            <div className="border-t border-gray-100 py-4 space-y-4">

              {/* 지역 */}
              <FilterRow label="지역">
                <Chip active={!filters.region} onClick={() => setFilter('region', null)}>전체</Chip>
                {REGIONS.map(r => (
                  <Chip
                    key={r}
                    active={filters.region === r}
                    onClick={() => setFilter('region', filters.region === r ? null : r)}
                  >
                    {r}
                  </Chip>
                ))}
              </FilterRow>

              {/* 유동인구 규모 */}
              <FilterRow label="유동인구 규모">
                {FOOT_TRAFFIC_TIERS.map((t, i) => (
                  <Chip
                    key={i}
                    active={filters.footTrafficTier === i}
                    onClick={() => setFilter('footTrafficTier', i)}
                  >
                    {t.label}
                    {t.desc && <span className="ml-1 text-[10px] opacity-60">{t.desc}</span>}
                  </Chip>
                ))}
              </FilterRow>

              {/* 평당 월세 */}
              <FilterRow label="평당 월세">
                {RENT_TIERS.map((t, i) => (
                  <Chip
                    key={i}
                    active={filters.rentTier === i}
                    onClick={() => setFilter('rentTier', i)}
                  >
                    {t.label}
                  </Chip>
                ))}
              </FilterRow>

              {/* 평균 권리금 */}
              <FilterRow label="평균 권리금">
                {RIGHT_FEE_TIERS.map((t, i) => (
                  <Chip
                    key={i}
                    active={filters.rightFeeTier === i}
                    onClick={() => setFilter('rightFeeTier', i)}
                  >
                    {t.label}
                  </Chip>
                ))}
              </FilterRow>

              {/* 주요 업종 */}
              <FilterRow label="주요 업종">
                <Chip active={!filters.category} onClick={() => setFilter('category', null)}>전체</Chip>
                {AREA_CATEGORIES.map(c => (
                  <Chip
                    key={c.key}
                    active={filters.category === c.key}
                    onClick={() => setFilter('category', filters.category === c.key ? null : c.key)}
                  >
                    {c.label}
                  </Chip>
                ))}
              </FilterRow>

            </div>
          )}
        </div>
      </section>

      {/* ── 전국 상권 지도 ───────────────────────────────────────────────────── */}
      <section className="container mx-auto py-6">
        {filteredAreas.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white py-20 text-center">
            <MapPin className="h-10 w-10 text-gray-200" />
            <p className="text-sm font-semibold text-gray-500">조건에 맞는 상권이 없습니다</p>
            <p className="text-xs text-gray-400">필터를 조정하거나 초기화해보세요</p>
            <button
              onClick={resetFilters}
              className="mt-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <AreasMap areas={filteredAreas} height={520} />
        )}
        <p className="mt-2 text-center text-xs text-gray-400">
          원을 클릭하면 해당 상권의 주요 지표와 상세 분석 링크를 볼 수 있습니다.
        </p>
      </section>

      {/* ── 상권 카드 그리드 ─────────────────────────────────────────────────── */}
      <section className="container mx-auto pb-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-h4 font-semibold text-gray-900">
            {filterCount > 0 ? `필터 결과 (${filteredAreas.length}개)` : '전체 상권 목록'}
          </h2>
          {filterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-gray-400 hover:text-gray-700"
            >
              필터 초기화 →
            </button>
          )}
        </div>
        {filteredAreas.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">조건에 맞는 상권이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAreas.map(a => (
              <AreaChip
                key={a.key}
                area={a}
                listingCount={listingsByArea(a.key).length}
                selected={compareKeys.has(a.key)}
                onToggleCompare={() => toggleCompare(a.key)}
                disableCompare={!compareKeys.has(a.key) && compareKeys.size >= MAX_COMPARE}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── 비교 선택 플로팅 바 ────────────────────────────────────────────── */}
      {compareKeys.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3 shadow-2xl">
            <span className="text-sm text-white">
              <strong className="font-bold text-indigo-300">{compareKeys.size}</strong>
              <span className="text-gray-400">/{MAX_COMPARE}</span>
              &nbsp;상권 선택됨
            </span>
            {compareKeys.size >= 2 && (
              <button
                onClick={() => setCompareOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-indigo-400"
              >
                <BarChart2 className="h-4 w-4" />
                비교하기
              </button>
            )}
            <button
              onClick={() => setCompareKeys(new Set())}
              className="rounded-full p-1 text-gray-400 hover:text-white"
              aria-label="선택 초기화"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── 상권 비교 모달 ────────────────────────────────────────────────── */}
      {compareOpen && compareAreas.length >= 2 && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-4xl overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
                <BarChart2 className="h-5 w-5 text-indigo-500" />
                상권 비교 분석
              </h3>
              <button
                onClick={() => setCompareOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Comparison table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-32">
                      지표
                    </th>
                    {compareAreas.map(a => (
                      <th key={a.key} className="px-4 py-3 text-left font-bold text-gray-900">
                        <div>{a.name}</div>
                        <div className="mt-0.5 text-xs font-normal text-gray-500">{a.region} {a.district}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    {
                      label: '일 유동인구',
                      getValue: (a: MockArea) => `${formatNumber(a.footTraffic)}명`,
                      best:    (arr: MockArea[]) => arr.reduce((m, a) => a.footTraffic > m.footTraffic ? a : m).key,
                    },
                    {
                      label: '평당 월세',
                      getValue: (a: MockArea) => `${a.avgMonthlyRentPerPyeong}만원`,
                      best:    (arr: MockArea[]) => arr.reduce((m, a) => a.avgMonthlyRentPerPyeong < m.avgMonthlyRentPerPyeong ? a : m).key,
                    },
                    {
                      label: '평균 권리금',
                      getValue: (a: MockArea) => `${formatNumber(a.avgRightFee)}만`,
                      best:    (arr: MockArea[]) => arr.reduce((m, a) => a.avgRightFee < m.avgRightFee ? a : m).key,
                    },
                    {
                      label: '평균 보증금',
                      getValue: (a: MockArea) => `${formatNumber(a.avgDeposit)}만`,
                      best:    (arr: MockArea[]) => arr.reduce((m, a) => a.avgDeposit < m.avgDeposit ? a : m).key,
                    },
                  ].map(row => {
                    const bestKey = row.best(compareAreas)
                    return (
                      <tr key={row.label}>
                        <td className="py-3 pl-6 pr-3 text-xs font-semibold text-gray-500">{row.label}</td>
                        {compareAreas.map(a => (
                          <td key={a.key} className={`px-4 py-3 font-semibold ${bestKey === a.key ? 'text-indigo-600' : 'text-gray-800'}`}>
                            {row.getValue(a)}
                            {bestKey === a.key && (
                              <span className="ml-1.5 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-500">✓</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    )
                  })}

                  {/* 주요 업종 */}
                  <tr>
                    <td className="py-3 pl-6 pr-3 text-xs font-semibold text-gray-500">주요 업종</td>
                    {compareAreas.map(a => (
                      <td key={a.key} className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {a.topCategories.slice(0, 3).map(c => (
                            <span key={c.key} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                              {c.label} {c.share}%
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* 상세 링크 */}
                  <tr>
                    <td className="py-3 pl-6 pr-3 text-xs font-semibold text-gray-500">상세 분석</td>
                    {compareAreas.map(a => (
                      <td key={a.key} className="px-4 py-3">
                        <a
                          href={`/areas/${a.key}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700"
                        >
                          자세히 보기 →
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-6 py-4">
              <p className="text-center text-xs text-gray-400">✓ 표시는 해당 지표에서 가장 유리한 상권입니다</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Chip({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
      style={
        active
          ? { background: '#111827', color: '#fff' }
          : { background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb' }
      }
    >
      {children}
    </button>
  )
}

function ActiveChip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-0.5 rounded-full bg-gray-900 py-1 pl-2.5 pr-1.5 text-[11px] font-semibold text-white">
      {children}
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 hover:bg-white/20"
        aria-label="필터 제거"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  )
}
