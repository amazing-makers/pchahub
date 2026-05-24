import type { Metadata } from 'next'
import { CheckCircle2, Star, X } from 'lucide-react'
import { buildPageMetadata } from '@amakers/design-system'
import { CATEGORIES, CONTRACTORS } from '@/lib/mock-data'

export const metadata: Metadata = buildPageMetadata('gongganhansu', {
  title: '시공사 비교',
  description: '관심 있는 시공사를 한눈에 비교하세요. 평당 단가, 포트폴리오 수, 평점, 전문 분야를 나란히 확인.',
  path: '/compare',
})

interface ComparePageProps {
  searchParams: { ids?: string }
}

const COMPARE_ROWS = [
  { key: 'region', label: '지역' },
  { key: 'founded', label: '설립' },
  { key: 'projects', label: '시공 건수' },
  { key: 'rating', label: '평점' },
  { key: 'price', label: '평당 단가' },
  { key: 'budget', label: '예산 범위' },
  { key: 'specialties', label: '전문 분야' },
  { key: 'verified', label: '인증' },
  { key: 'highlights', label: '특장점' },
]

export default function ComparePage({ searchParams }: ComparePageProps) {
  const rawIds = (searchParams.ids ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const contractors = rawIds
    .map((id) => CONTRACTORS.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => !!c)
    .slice(0, 3)

  if (contractors.length < 2) {
    return (
      <main className="container mx-auto py-section text-center">
        <X className="mx-auto h-12 w-12 text-gray-300" />
        <h1 className="mt-4 text-h3 font-bold text-gray-900">비교할 시공사를 선택해 주세요</h1>
        <p className="mt-2 text-sm text-gray-500">시공사 디렉토리에서 비교하기 버튼으로 2~3곳을 선택한 뒤 비교해 보세요.</p>
        <a
          href="/contractors"
          className="mt-6 inline-block rounded-xl px-6 py-3 text-sm font-semibold text-white"
          style={{ background: 'var(--brand-primary)' }}
        >
          시공사 디렉토리로
        </a>
      </main>
    )
  }

  // Find best values for highlighting
  const bestRating = Math.max(...contractors.map((c) => c.rating))
  const bestProjects = Math.max(...contractors.map((c) => c.projectCount))
  const lowestPrice = Math.min(...contractors.map((c) => c.avgPricePerPyeong))

  return (
    <main className="bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">시공사 비교</h1>
          <p className="mt-1 text-sm text-gray-500">
            {contractors.length}곳 시공사 핵심 지표 비교
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-36 py-5 pl-6 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  항목
                </th>
                {contractors.map((c) => (
                  <th key={c.id} className="px-4 py-5 text-left">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                        style={{ background: c.brandColor }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                          {c.name}
                          {c.verified && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{c.region}</div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {/* Rating */}
              <CompareRow label="평점">
                {contractors.map((c) => (
                  <td key={c.id} className="px-4 py-4">
                    <span
                      className={
                        'inline-flex items-center gap-1 text-sm font-semibold ' +
                        (c.rating === bestRating ? 'text-amber-500' : 'text-gray-700')
                      }
                    >
                      <Star className={`h-3.5 w-3.5 ${c.rating === bestRating ? 'fill-amber-400 text-amber-400' : 'fill-gray-300 text-gray-300'}`} />
                      {c.rating}
                      <span className="text-xs font-normal text-gray-400">({c.reviewCount})</span>
                    </span>
                    {c.rating === bestRating && (
                      <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                        최고 평점
                      </span>
                    )}
                  </td>
                ))}
              </CompareRow>

              {/* Projects */}
              <CompareRow label="시공 건수">
                {contractors.map((c) => (
                  <td key={c.id} className="px-4 py-4">
                    <span
                      className={
                        'text-sm font-semibold ' +
                        (c.projectCount === bestProjects ? 'text-blue-600' : 'text-gray-700')
                      }
                    >
                      {c.projectCount.toLocaleString()}건
                    </span>
                    {c.projectCount === bestProjects && (
                      <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                        최다 시공
                      </span>
                    )}
                  </td>
                ))}
              </CompareRow>

              {/* Price per pyeong */}
              <CompareRow label="평당 단가">
                {contractors.map((c) => (
                  <td key={c.id} className="px-4 py-4">
                    <span
                      className={
                        'text-sm font-semibold ' +
                        (c.avgPricePerPyeong === lowestPrice ? 'text-emerald-600' : 'text-gray-700')
                      }
                    >
                      {c.avgPricePerPyeong}만원/평
                    </span>
                    {c.avgPricePerPyeong === lowestPrice && (
                      <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                        최저 단가
                      </span>
                    )}
                  </td>
                ))}
              </CompareRow>

              {/* Budget range */}
              <CompareRow label="예산 범위">
                {contractors.map((c) => (
                  <td key={c.id} className="px-4 py-4 text-sm text-gray-700">
                    {c.budgetRange}
                  </td>
                ))}
              </CompareRow>

              {/* Region + Founded */}
              <CompareRow label="지역 / 설립">
                {contractors.map((c) => (
                  <td key={c.id} className="px-4 py-4 text-sm text-gray-700">
                    {c.region} · {c.foundedYear}년
                  </td>
                ))}
              </CompareRow>

              {/* Specialties */}
              <CompareRow label="전문 분야">
                {contractors.map((c) => (
                  <td key={c.id} className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {c.specialties.map((s) => {
                        const cat = CATEGORIES.find((x) => x.key === s)
                        return (
                          <span
                            key={s}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                          >
                            {cat?.label ?? s}
                          </span>
                        )
                      })}
                    </div>
                  </td>
                ))}
              </CompareRow>

              {/* Verified */}
              <CompareRow label="인증 여부">
                {contractors.map((c) => (
                  <td key={c.id} className="px-4 py-4">
                    {c.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" /> 인증 시공사
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                ))}
              </CompareRow>

              {/* Highlights */}
              <CompareRow label="특장점">
                {contractors.map((c) => (
                  <td key={c.id} className="px-4 py-4">
                    <ul className="space-y-1">
                      {c.highlights.slice(0, 4).map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                          <span
                            className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: 'var(--brand-primary)' }}
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </CompareRow>

              {/* CTA row */}
              <tr className="bg-gray-50">
                <td className="py-5 pl-6 pr-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  견적 요청
                </td>
                {contractors.map((c) => (
                  <td key={c.id} className="px-4 py-5">
                    <div className="flex flex-col gap-2">
                      <a
                        href={`/contractors/${c.id}`}
                        className="block rounded-xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        프로필 보기
                      </a>
                      <a
                        href={`/quote?contractor=${c.id}`}
                        className="block rounded-xl px-4 py-2 text-center text-sm font-semibold text-white"
                        style={{ background: 'var(--brand-primary)' }}
                      >
                        견적 요청
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/contractors"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            ← 시공사 목록으로 돌아가기
          </a>
        </div>
      </div>
    </main>
  )
}

function CompareRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <tr>
      <td className="py-4 pl-6 pr-4 text-xs font-semibold text-gray-500">{label}</td>
      {children}
    </tr>
  )
}
