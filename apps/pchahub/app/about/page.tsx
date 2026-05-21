import type { Metadata } from 'next'
import { buildOrganizationJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '프차허브 소개',
  description: '공정거래위원회 가맹정보 기반 브랜드 비교·창업 수익 계산·가맹 매물·커뮤니티까지. 한국 프랜차이즈 통합 플랫폼 프차허브.',
  path: '/about',
})

import { CheckCircle2, Layers, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { platformColors, type PlatformKey } from '@amakers/design-system'

const PLATFORMS = (
  Object.entries(platformColors) as Array<[PlatformKey, (typeof platformColors)[PlatformKey]]>
).filter(([key]) => key !== 'pchahub')

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: '협회 공시 자료를 1차 데이터로',
    body: '한국 프랜차이즈 협회에 등록된 정보공개서를 자동 연동해 본사가 직접 입력하는 자료보다 객관적인 정보를 제공합니다.',
  },
  {
    icon: Target,
    title: '검증된 매칭만 본사에 전달',
    body: '창업 스캐너·수익 계산기를 거친 사용자만 본사 상담으로 연결되어, 매칭의 질을 높이고 본사·점주 양쪽의 시간을 아낍니다.',
  },
  {
    icon: Layers,
    title: '판단을 돕는 도구와 컨텍스트',
    body: '단순 카탈로그가 아닌 매장 수 변화·매출 추이·점주 후기 같은 의사결정에 필요한 맥락을 함께 제공합니다.',
  },
  {
    icon: Sparkles,
    title: '본사도 점주도 더 나은 환경으로',
    body: '본사는 합리적인 광고비로 검증된 후보를 만나고, 점주는 정보 비대칭 없이 본인 조건에 맞는 가맹을 선택합니다.',
  },
]

export default function AboutPage() {
  const orgJsonLd = buildOrganizationJsonLd({
    name: '프차허브',
    url: 'https://pchahub.amakers.co.kr',
    description: '공정거래위원회 가맹정보 기반 프랜차이즈 브랜드 비교·창업 수익 계산·가맹 매물·커뮤니티. 한국 프랜차이즈 통합 플랫폼.',
  })

  return (
    <main className="bg-white">
      <JsonLd data={orgJsonLd} />
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand-primary)' }}
            >
              About · 프차허브
            </p>
            <h1 className="mt-4 text-hero font-bold text-gray-900">
              한국 프랜차이즈의
              <br />
              모든 것을 OPEN한다
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              프차허브는 가맹 사업과 자영업 운영을 둘러싼 정보 비대칭을 해소하기 위한
              <br className="hidden sm:inline" />
              9개 전문 플랫폼의 가맹 정보·매칭 허브입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto py-section">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-h3 font-semibold text-gray-900">우리가 풀려는 문제</h2>
          <p className="mt-4 text-gray-700">
            한국에는 수천 개의 프랜차이즈 브랜드가 있고, 매년 수십만 명이 가맹 창업을 검토합니다.
            하지만 본사가 제공하는 정보는 마케팅 자료와 평균 수치에 가깝고, 실제 운영의 어려움이나
            본사 시스템의 안정성은 가맹 계약을 맺기 전엔 알기 어려운 게 현실입니다.
          </p>
          <p className="mt-4 text-gray-700">
            프차허브는 협회 공시 자료를 1차 데이터로 삼고, 그 위에 매장 운영 분석·점주 후기·매칭
            도구를 얹어 가맹 사업 의사결정을 더 투명하고 합리적으로 만듭니다.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h3 font-semibold text-gray-900">프차허브의 4가지 운영 원칙</h2>
            <p className="mt-3 text-gray-600">
              9개 사이트가 공유하는 이 원칙 위에서 설계됩니다.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <Card key={p.title} className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: 'var(--brand-primary)' }}
                  >
                    <p.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">{p.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{p.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* pchahub role */}
      <section className="container mx-auto py-section">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-h3 font-semibold text-gray-900">pchahub의 역할</h2>
          <p className="mt-4 text-gray-700">
            프차허브(pchahub)는 9개 전문 플랫폼 중에서 가맹 정보 검색과 매칭을 담당합니다.
            예비 가맹점주가 본인 조건에 맞는 브랜드를 발견하고, 본사가 검증된 후보와 효율적으로
            연결되도록 돕는 양면 마켓플레이스입니다.
          </p>
          <ul className="mt-6 space-y-2.5">
            {[
              '한국 프랜차이즈 협회 등록 정보공개서 자동 연동',
              '카테고리·테마·자본·지역 등 다양한 검색 축',
              '창업 스캐너 — 7개 질문으로 맞춤 추천',
              '수익 계산기 — 협회 평균 대비 본인 매장 수익 추정',
              '점주 후기 + 가맹 문의 통합 채널',
              '본사 대시보드 — 가맹 문의 응대 + 광고 운영',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-gray-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Other platforms */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h3 font-semibold text-gray-900">함께하는 8개 플랫폼</h2>
            <p className="mt-3 text-gray-600">
              가맹점 운영의 단계별로 전문 플랫폼이 담당합니다. 모두 한 계정으로 이용 가능합니다.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {PLATFORMS.map(([key, p]) => (
              <a key={key} href={`https://${p.domain}`} className="group">
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-9 w-9 shrink-0 rounded-lg"
                        style={{ background: p.primary }}
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-gray-900">
                          {p.name}
                        </div>
                        <div className="truncate text-xs text-gray-500">{p.role}</div>
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
        </div>
      </section>

      {/* Contact */}
      {/* Newsletter */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">프랜차이즈 업계 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 브랜드·수익 리포트·트렌드를 격주로 보내드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
                placeholder="이메일 주소"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                구독하기
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-section">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-h4 font-semibold text-gray-900">문의</h2>
          <p className="mt-2 text-sm text-gray-600">
            본사 등록·광고 제휴·미디어 문의는 아래 채널로 연락 주세요.
          </p>
          <div className="mt-5 inline-flex flex-col gap-1 rounded-xl bg-gray-50 px-6 py-4 text-left text-sm">
            <div>
              <span className="text-gray-500">사이트</span>
              <a
                href="https://pchahub.amakers.co.kr"
                className="ml-3 font-medium text-gray-900 hover:underline"
              >
                pchahub.kr
              </a>
            </div>
            <div>
              <span className="text-gray-500">이메일</span>
              <a href="mailto:help@pchahub.kr" className="ml-3 font-medium text-gray-900 hover:underline">
                help@pchahub.kr
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
