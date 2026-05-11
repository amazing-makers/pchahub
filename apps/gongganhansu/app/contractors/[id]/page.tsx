import { notFound } from 'next/navigation'
import { CheckCircle2, ChevronRight, Star } from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import {
  CATEGORIES,
  CONTRACTORS,
  contractorById,
  portfolioByContractor,
} from '@/lib/mock-data'
import { PortfolioCard } from '@/components/portfolio-card'

export function generateStaticParams() {
  return CONTRACTORS.map((c) => ({ id: c.id }))
}

interface ContractorDetailProps {
  params: { id: string }
}

export default function ContractorDetailPage({ params }: ContractorDetailProps) {
  const c = contractorById(params.id)
  if (!c) notFound()
  const portfolio = portfolioByContractor(c.id)
  const others = CONTRACTORS.filter((x) => x.id !== c.id).slice(0, 3)

  return (
    <main className="bg-gray-50">
      <div className="relative h-56 w-full overflow-hidden bg-gray-100 sm:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.heroImage}
          alt={`${c.name} 시공 스튜디오`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/40" />
      </div>

      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/contractors" className="hover:text-gray-900">시공사</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{c.name}</span>
          </nav>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="-mt-20 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white text-2xl font-bold text-white shadow-md"
                  style={{ background: c.brandColor }}
                >
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-h2 font-bold text-gray-900">{c.name}</h1>
                    {c.verified && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-label="인증" />
                    )}
                    {c.featured && <Badge variant="warning">추천</Badge>}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{c.tagline}</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span>
                  {c.region} · {c.foundedYear}년 설립 · {c.projectCount}건 시공
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-gray-900">{c.rating}</span>
                  <span className="text-gray-400">({c.reviewCount})</span>
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.specialties.map((s) => {
                  const cat = CATEGORIES.find((x) => x.key === s)
                  return (
                    <span
                      key={s}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                    >
                      {cat?.label ?? s}
                    </span>
                  )
                })}
              </div>
            </div>

            <aside>
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="space-y-3 p-5">
                  <div>
                    <div className="text-xs text-gray-500">평균 평당 단가</div>
                    <div className="mt-1 text-h3 font-bold text-gray-900">
                      {c.avgPricePerPyeong}
                      <span className="text-base font-medium text-gray-500"> 만원</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">예산 범위 {c.budgetRange}</div>
                  </div>
                  <a href={`/quote?contractor=${c.id}`} className="block">
                    <Button size="lg" className="w-full">
                      이 시공사 견적 받기
                    </Button>
                  </a>
                  <Button size="lg" variant="outline" className="w-full">
                    매장 방문 상담
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-6">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-h4 font-semibold text-gray-900">시공사 소개</h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-gray-700">
              {c.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-h4 font-semibold text-gray-900">강점</h2>
            <ul className="mt-4 space-y-2">
              {c.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {h}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-h4 font-semibold text-gray-900">포함되는 작업</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {c.includes.map((inc) => (
                <div
                  key={inc}
                  className="flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-700"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  {inc}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {portfolio.length > 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-h4 font-semibold text-gray-900">{c.name} 시공 사례</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {portfolio.map((p) => (
                  <PortfolioCard key={p.id} item={p} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-gray-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-h3 font-bold">{c.name} 외 시공사도 함께 비교</h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-300">
              한 시공사만 보지 마시고 3~5곳 견적을 비교하세요. 무료 견적은 영업일 48시간 이내 도착.
            </p>
            <a href="/quote" className="mt-5 inline-block">
              <Button size="lg">3~5곳 견적 받기</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
