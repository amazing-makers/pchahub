import { Card, CardContent } from '@amakers/ui'

export default function HomePage() {
  return (
    <main className="container mx-auto py-section">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            amakers · themyungdang.kr
          </p>
          <h1 className="text-h1 font-bold">더명당</h1>
          <p className="text-body text-gray-600">부동산</p>
        </header>

        <Card>
          <CardContent className="p-8">
            <p className="text-body">
              <strong>더명당</strong>은 amakers 플랫폼 9개 사이트 중 하나입니다.
              여기서부터 페이지를 채워나갈 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}