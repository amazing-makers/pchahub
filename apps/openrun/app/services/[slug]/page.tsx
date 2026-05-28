import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, CheckCircle2, ChevronRight, Target } from 'lucide-react'
import { Button, Card, CardContent, MobileCTA, NewsletterForm } from '@amakers/ui'
import { buildBreadcrumbsJsonLd, buildHowToJsonLd, buildServiceJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { CaseCard } from '@/components/case-card'
import { caseById, SERVICE_LABEL, SERVICES, serviceBySlug } from '@/lib/mock-data'

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

interface ServiceDetailProps {
  params: { slug: string }
}

export function generateMetadata({ params }: ServiceDetailProps): Metadata {
  const service = serviceBySlug(params.slug)
  if (!service) return {}
  return buildPageMetadata('openrun', {
    title: `${service.title} — 오픈런 서비스`,
    description: service.description,
    path: `/services/${service.slug}`,
  })
}

export default function ServiceDetailPage({ params }: ServiceDetailProps) {
  const service = serviceBySlug(params.slug)
  if (!service) notFound()
  const cases = service.portfolioIds.map((id) => caseById(id)).filter((c): c is NonNullable<typeof c> => Boolean(c))

  const serviceUrl = `https://openrun.amakers.co.kr/services/${service.slug}`
  const workJsonLd = buildServiceJsonLd({
    name: service.title,
    description: service.description,
    url: serviceUrl,
    provider: { name: '오픈런', url: 'https://openrun.amakers.co.kr' },
    serviceType: SERVICE_LABEL[service.slug],
    priceLabel: service.priceLabel,
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '서비스', url: 'https://openrun.amakers.co.kr/services' },
      { name: service.title, url: serviceUrl },
    ],
  })
  const howToJsonLd = service.process.length > 0
    ? buildHowToJsonLd({
        name: `${service.title} 진행 프로세스`,
        description: service.description,
        url: serviceUrl,
        steps: service.process.map((p) => ({ name: p.title, text: p.body })),
      })
    : null

  return (
    <main className="bg-gray-50">
      <JsonLd data={workJsonLd} />
      <JsonLd data={breadcrumbs} />
      {howToJsonLd && <JsonLd data={howToJsonLd} />}
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto py-section">
          <nav className="flex items-center gap-1 text-sm text-gray-300">
            <a href="/services" className="hover:text-white">서비스</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">{service.title}</span>
          </nav>

          <div className="mt-6">
            <div
              className="inline-flex h-9 items-center rounded-md px-3 text-sm font-semibold text-white"
              style={{ background: service.accentColor }}
            >
              {SERVICE_LABEL[service.slug]}
            </div>
            <h1 className="mt-3 text-h1 font-bold">{service.title}</h1>
            <p className="mt-3 max-w-3xl text-lg text-gray-300">{service.subtitle}</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Spec label="대상" value={service.audience} />
            <Spec label="가격대" value={service.priceLabel} />
            <Spec label="진행 기간" value={service.duration} />
          </div>

          <div className="mt-8">
            <a href="/contact">
              <Button size="lg">{service.title} 의뢰하기</Button>
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-section space-y-8">
        {/* Problem + Description */}
        <Card className="border-gray-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-900">
              <Target className="h-3.5 w-3.5" />
              해결하는 문제
            </div>
            <p className="mt-2 text-base font-semibold text-amber-900">{service.problem}</p>
          </CardContent>
        </Card>

        <SectionCard title="서비스 소개">
          <p className="text-base leading-relaxed text-gray-700">{service.description}</p>
        </SectionCard>

        <SectionCard title="포함되는 작업">
          <ul className="grid gap-2 sm:grid-cols-2">
            {service.includes.map((inc) => (
              <li key={inc} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {inc}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="예상 결과">
          <ul className="space-y-2">
            {service.outcomes.map((o) => (
              <li
                key={o}
                className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {o}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="진행 단계">
          <div className="space-y-3">
            {service.process.map((p, i) => (
              <div
                key={p.title}
                className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <div className="text-base font-semibold text-gray-900">{p.title}</div>
                  <p className="mt-1 text-sm text-gray-600">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {cases.length > 0 && (
          <SectionCard title="관련 사례">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {cases.map((c) => (
                <CaseCard key={c.id} case={c} />
              ))}
            </div>
          </SectionCard>
        )}

        {/* FAQ */}
        <SectionCard title="자주 묻는 질문">
          <dl className="space-y-4">
            {[
              {
                q: '최소 계약 기간이 있나요?',
                a: '서비스 유형에 따라 다릅니다. 오픈 30일 캠페인은 단기 계약, 가맹 모집·본사 통합 마케팅은 3~12개월 단위로 운영합니다. 첫 상담에서 상세 일정을 조율합니다.',
              },
              {
                q: '캠페인 시작까지 얼마나 걸리나요?',
                a: '의뢰서 수령 후 영업일 기준 24시간 이내에 기획안 초안을 전달드립니다. 확정 후 셋업까지 평균 7일이 소요됩니다.',
              },
              {
                q: 'ROI 보장이 가능한가요?',
                a: '결과를 보장하지는 않지만, 월간 ROI 리포트를 투명하게 공유하고 목표 달성률이 낮을 경우 추가 지원 방안을 함께 논의합니다.',
              },
              {
                q: '여러 서비스를 동시에 진행할 수 있나요?',
                a: '네, 가능합니다. 그랜드 오픈과 가맹 모집을 동시에 진행하는 경우 패키지 할인을 적용해 드립니다. 상담 시 말씀해 주세요.',
              },
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <dt className="text-sm font-semibold text-gray-900">Q. {item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </SectionCard>

        <Card className="border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-h3 font-bold">이 서비스로 캠페인 시작하기</h2>
            <p className="mx-auto mt-2 max-w-xl text-gray-300">
              간단한 폼을 채워주시면 24시간 이내 기획안과 견적을 보내드립니다.
            </p>
            <a href="/contact" className="mt-5 inline-block">
              <Button size="lg">{service.title} 의뢰</Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* 뉴스레터 CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h4 font-bold text-gray-900">그랜드오픈 마케팅 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">성공 캠페인 분석·오픈런 전략·브랜드 마케팅 인사이트를 격주로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>

      <MobileCTA label={`${service.title} 의뢰하기`} href="/contact" />
    </main>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-wider text-gray-400">{label}</div>
      <div className="mt-1 text-sm font-medium text-white">{value}</div>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">{title}</h2>
        {children}
      </CardContent>
    </Card>
  )
}
