'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatNumber } from '@amakers/utils'
import type { MockArea } from '@/lib/mock-data'

// Deterministic seasonal multipliers Jan–Dec (index 0–11).
// Uses fixed values so SSR and client produce identical output.
const SEASONAL = [0.78, 0.82, 0.91, 1.00, 1.06, 1.12, 1.04, 1.07, 1.13, 1.18, 1.10, 0.93]
const MONTHS   = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

/** Integer hash of a string — deterministic per-area variation, zero Math.random */
function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function monthlyTrafficData(area: MockArea) {
  const h = hashStr(area.key)
  return MONTHS.map((month, i) => {
    // nibble 0-15 per month → nudge -7% to +8%
    const nibble = (h >>> (i * 2)) & 0b1111
    const nudge  = (nibble - 7) / 100
    const value  = Math.round(area.footTraffic * SEASONAL[i]! * (1 + nudge))
    return { month, value }
  })
}

const CAT_COLORS = ['#3b82f6', '#f97316', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

interface Props { area: MockArea }

export default function AreaCharts({ area }: Props) {
  const trafficData = monthlyTrafficData(area)

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      {/* ── Bar chart: monthly foot traffic ───────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">월별 유동인구 추이</h3>
        <p className="mb-4 mt-0.5 text-xs text-gray-500">
          계절 요인 반영 추정치 (일 평균 기준)
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={trafficData}
            barSize={14}
            margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip
              cursor={{ fill: '#f9fafb' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const row = payload[0]?.payload as any
                return (
                  <div className="rounded-lg bg-white px-3 py-2 text-xs shadow-lg ring-1 ring-black/5">
                    <div className="font-semibold text-gray-900">{row.month}</div>
                    <div className="text-gray-600">
                      일 평균 {formatNumber(payload[0]?.value as number)}명
                    </div>
                  </div>
                )
              }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Pie / donut: category breakdown ───────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">업종 구성 비율</h3>
        <p className="mb-4 mt-0.5 text-xs text-gray-500">주요 업종의 추정 점유율</p>
        <div className="flex items-center gap-4">
          <div style={{ width: '55%' }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={area.topCategories}
                  dataKey="share"
                  nameKey="label"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  stroke="none"
                >
                  {area.topCategories.map((_, i) => (
                    <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]!} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="rounded-lg bg-white px-3 py-2 text-xs shadow-lg ring-1 ring-black/5">
                        <div className="font-semibold text-gray-900">{payload[0]?.name as string}</div>
                        <div className="text-gray-600">{payload[0]?.value as number}%</div>
                      </div>
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2.5">
            {area.topCategories.map((c, i) => (
              <div key={c.key} className="flex items-center gap-2 text-xs">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: CAT_COLORS[i % CAT_COLORS.length]! }}
                />
                <span className="flex-1 text-gray-700">{c.label}</span>
                <span className="font-semibold text-gray-900">{c.share}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
