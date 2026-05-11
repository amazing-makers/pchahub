import Link from 'next/link'
import { Card, CardContent, Button } from '@amakers/ui'
import { platformColors, type PlatformKey } from '@amakers/design-system'

const otherPlatforms = (
  Object.entries(platformColors) as Array<
    [PlatformKey, (typeof platformColors)[PlatformKey]]
  >
).filter(([key]) => key !== 'pchahub')

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand-primary)' }}
            >
              amakers · pchahub.kr
            </p>
            <h1 className="mt-4 text-hero font-bold text-gray-900">
              한국 프랜차이즈의
              <br />
              모든 것을 OPEN한다
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              브랜드 검색부터 가맹 중개까지. 정보 비대칭 없는 투명한 프랜차이즈 생태계.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/brands">
                <Button size="lg">프랜차이즈 검색</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  amakers 알아보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9 platforms */}
      <section className="container mx-auto py-section">
        <div className="mb-10 text-center">
          <h2 className="text-h2 font-semibold text-gray-900">9개 전문 플랫폼</h2>
          <p className="mt-3 text-gray-600">한 계정으로 9개 사이트 모두 이용</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherPlatforms.map(([key, p]) => (
            <a key={key} href={`https://${p.domain}`} className="group">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-10 w-10 shrink-0 rounded-lg"
                      style={{ background: p.primary }}
                      aria-hidden
                    />
                    <div>
                      <div className="text-base font-semibold text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.role}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-400 group-hover:text-gray-600">
                    {p.domain} →
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
