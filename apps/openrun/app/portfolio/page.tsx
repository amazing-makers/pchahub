import { CaseCard } from '@/components/case-card'
import { PORTFOLIO, SERVICES, SERVICE_LABEL, type ServiceSlug } from '@/lib/mock-data'

interface PortfolioPageProps {
  searchParams: { service?: string }
}

export default function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const service = searchParams.service as ServiceSlug | undefined
  const cases = service ? PORTFOLIO.filter((c) => c.service === service) : PORTFOLIO

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">
            {service ? `${SERVICE_LABEL[service]} 사례` : '캠페인 사례'}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            실제 진행한 캠페인과 측정된 결과를 모두 공개합니다.
          </p>

          {/* Service filter chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="/portfolio"
              className={
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                (!service
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
              }
            >
              전체 ({PORTFOLIO.length})
            </a>
            {SERVICES.map((s) => {
              const count = PORTFOLIO.filter((c) => c.service === s.slug).length
              if (count === 0) return null
              return (
                <a
                  key={s.slug}
                  href={`/portfolio?service=${s.slug}`}
                  className={
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                    (service === s.slug
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }
                >
                  {s.title} ({count})
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <CaseCard key={c.id} case={c} />
          ))}
        </div>
      </div>
    </main>
  )
}
