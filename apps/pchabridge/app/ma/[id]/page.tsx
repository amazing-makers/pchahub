import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CheckCircle2, ChevronRight, Lock } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { buildBrandJsonLd, buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { brandById, MA_LISTINGS, maListingById } from '@/lib/mock-data'
import { MACard } from '@/components/ma-card'
import { NdaForm } from './nda-form'
import { MaConsultButton } from './ma-consult-button'

export function generateStaticParams() {
  return MA_LISTINGS.map((m) => ({ id: m.id }))
}

interface MADetailProps {
  params: { id: string }
}

export function generateMetadata({ params }: MADetailProps): Metadata {
  const listing = maListingById(params.id)
  if (!listing) return {}
  const brand = brandById(listing.brandId)
  return buildPageMetadata('pchabridge', {
    title: `${brand?.name ?? '브랜드'} M&A 매물 — 프차브릿지`,
    description: `${listing.rationale} · 매장 ${listing.storeCount}개 · 운영 ${listing.yearsOperating}년 · ${listing.ndaRequired ? 'NDA 필요' : '공개 매물'}.`,
    path: `/ma/${listing.id}`,
  })
}

export default function MADetailPage({ params }: MADetailProps) {
  const listing = maListingById(params.id)
  if (!listing) notFound()
  const brand = brandById(listing.brandId)
  const others = MA_LISTINGS.filter((m) => m.id !== listing.id).slice(0, 2)
  const pe = (listing.askingPrice / listing.annualProfit).toFixed(1)

  const maUrl = `https://pchabridge.kr/ma/${listing.id}`
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: 'M&A 매물', url: 'https://pchabridge.kr/ma' },
      { name: brand?.name ?? '본사', url: maUrl },
    ],
  })
  const brandJsonLd = brand
    ? buildBrandJsonLd({
        name: brand.name,
        description: listing.rationale,
        url: maUrl,
        category: brand.categoryLabel,
        numberOfStores: listing.storeCount,
      })
    : null

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      {brandJsonLd && <JsonLd data={brandJsonLd} />}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/ma" className="hover:text-gray-900">M&A 매물</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{brand?.name ?? '본사'}</span>
          </nav>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">{brand?.categoryLabel}</Badge>
                {listing.ndaRequired && (
                  <Badge variant="default" className="gap-0.5">
                    <Lock className="h-3 w-3" />
                    NDA 필요
                  </Badge>
                )}
              </div>
              <h1 className="mt-3 text-h2 font-bold text-gray-900">{brand?.name} 매각</h1>
              <p className="mt-2 text-base text-gray-700">{listing.rationale}</p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="매장 수" value={`${listing.storeCount}개`} />
                <Stat label="운영 연차" value={`${listing.yearsOperating}년`} />
                <Stat label="연 매출" value={`${formatNumber(listing.annualRevenue)}만`} />
                <Stat label="연 영업이익" value={`${formatNumber(listing.annualProfit)}만`} />
              </div>
            </div>

            <aside>
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <div>
                    <div className="text-xs text-gray-500">매각 희망가</div>
                    <div className="mt-1 text-h3 font-bold text-gray-900">
                      {formatNumber(listing.askingPrice)}
                      <span className="text-base font-medium text-gray-500"> 만원</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">P/E 약 {pe}배</div>
                  </div>

                  <NdaForm
                    listingId={listing.id}
                    brandName={brand?.name ?? '매물'}
                    ndaRequired={listing.ndaRequired}
                  />
                  <MaConsultButton
                    listingId={listing.id}
                    brandName={brand?.name ?? '매물'}
                  />

                  <div className="text-center text-xs text-gray-500">
                    문의 {listing.inquiryCount}건 · 등록 {listing.listedAt}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-6">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-h4 font-semibold text-gray-900">매물 개요</h2>
            <article className="mt-4 space-y-4 text-base leading-relaxed text-gray-800">
              {listing.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-h4 font-semibold text-gray-900">포함되는 자산</h2>
            <ul className="mt-4 space-y-2">
              {listing.includes.map((inc) => (
                <li key={inc} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {inc}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-violet-50">
          <CardContent className="p-5 text-sm text-violet-900">
            <div className="font-semibold">amakers M&A 자문 안내</div>
            <p className="mt-1">
              상세 자료 요청 시 NDA 체결 후 영업일 기준 5일 이내 본사 재무 데이터·매장 운영
              데이터·법무 자료를 공개합니다. amakers는 거래 양측에 표준 계약서 + 에스크로 결제 +
              실사 자문을 제공합니다.
            </p>
          </CardContent>
        </Card>

        {others.length > 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-h4 font-semibold text-gray-900">다른 M&A 매물</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {others.map((o) => (
                  <MACard key={o.id} listing={o} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-0.5 text-base font-bold text-gray-900">{value}</div>
    </div>
  )
}
