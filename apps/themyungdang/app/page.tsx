import { Card, CardContent } from '@amakers/ui'

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              amakers · themyungdang.kr
            </p>
            <h1 className="mt-4 text-hero font-bold text-gray-900">더명당</h1>
            <p className="mt-4 text-lg text-gray-600">부동산</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-section">
        <Card>
          <CardContent className="p-8">
            <p className="text-body">
              <strong>더명당</strong>은 amakers 플랫폼 9개 사이트 중 하나입니다.
              여기서부터 페이지를 채워나갈 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}