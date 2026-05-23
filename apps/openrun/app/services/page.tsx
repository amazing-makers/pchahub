import type { Metadata } from 'next'
import { ArrowRight, BookOpen, MapPin, Star, Store } from 'lucide-react'
import { Card, CardContent, NewsletterForm } from '@amakers/ui'
import { ServiceCard } from '@/components/service-card'
import { PORTFOLIO, SERVICES, STATS } from '@/lib/mock-data'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'

export const metadata: Metadata = buildPageMetadata('openrun', {
  title: '서비스',
  description: '점주·본사·브랜드 각자의 시점에 맞는 3가지 통합 마케팅 캠페인.',
  path: '/services',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '오픈런', url: 'https://openrun.amakers.co.kr' },
    { name: '서비스', url: 'https://openrun.amakers.co.kr/services' },
  ],
})

const serviceListJsonLd = buildItemListJsonLd({
  url: 'https://openrun.amakers.co.kr/services',
  items: SERVICES.map((s) => ({ name: s.title, url: `https://openrun.amakers.co.kr/services/${s.slug}` })),
})

export default function ServicesPage() {
  const totalCases = PORTFOLIO.length

  return (
    <main className="bg-gray-50">
      <JsonLd data={serviceListJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">서비스</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            점주·본사·브랜드 각자의 시점에 맞는 3가지 통합 마케팅 캠페인.
          </p>
        </div>
      </section>

      {/* 통계 스트립 */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          {[
            { value: `${SERVICES.length}가지`, label: '서비스 유형' },
            { value: `${formatNumber(STATS.campaigns)}건`, label: '누적 캠페인' },
            { value: `+${STATS.averageROI}%`, label: '평균 ROI' },
            { value: `${totalCases}건`, label: '공개 사례' },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-4">
              <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
              <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {SERVICES.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>

        {/* amakers 생태계 크로스링크 */}
        <div className="mt-12">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">amakers에서 더 알아보기</div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <a href="https://pchahub.amakers.co.kr/brands" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-indigo-500" />가맹 브랜드 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://gongganhansu.amakers.co.kr/quote" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-rose-500" />매장 시공 견적</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://bestplace.amakers.co.kr/stores" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-amber-500" />우수 매장 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://jangsanote.amakers.co.kr" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-emerald-500" />점주 커뮤니티</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 뉴스레터 */}
        <div className="mt-12 rounded-2xl border border-gray-100 bg-gray-50 px-8 py-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            Newsletter
          </p>
          <h2 className="mt-3 text-h3 font-bold text-gray-900">마케팅 인사이트를 받아보세요</h2>
          <p className="mt-2 text-sm text-gray-500">신규 사례·캠페인 팁·업종별 마케팅 동향을 격주로 보내드립니다.</p>
          <NewsletterForm />
          <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-2xl bg-gray-900 px-8 py-10 text-center text-white">
          <h2 className="text-h3 font-bold">캠페인을 시작할 준비가 되셨나요?</h2>
          <p className="mt-2 text-sm text-gray-300">
            어떤 서비스가 필요한지 모르더라도 괜찮습니다. 상담 후 최적 플랜을 제안해 드립니다.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
          >
            무료 상담 신청
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </main>
  )
}
