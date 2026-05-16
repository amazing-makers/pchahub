import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { ServiceCard } from '@/components/service-card'
import { SERVICES } from '@/lib/mock-data'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('openrun', {
  title: '서비스',
  description: '점주·본사·브랜드 각자의 시점에 맞는 3가지 통합 마케팅 캠페인.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">서비스</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            점주·본사·브랜드 각자의 시점에 맞는 3가지 통합 마케팅 캠페인.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {SERVICES.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gray-900 px-8 py-10 text-center text-white">
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
