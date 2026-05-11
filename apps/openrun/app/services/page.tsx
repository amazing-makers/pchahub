import { ServiceCard } from '@/components/service-card'
import { SERVICES } from '@/lib/mock-data'

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
      </div>
    </main>
  )
}
