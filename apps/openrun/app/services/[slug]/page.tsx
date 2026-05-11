import { notFound } from 'next/navigation'
import { CheckCircle2, ChevronRight, Target, Users } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { CaseCard } from '@/components/case-card'
import { caseById, SERVICE_LABEL, SERVICES, serviceBySlug } from '@/lib/mock-data'

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

interface ServiceDetailProps {
  params: { slug: string }
}

export default function ServiceDetailPage({ params }: ServiceDetailProps) {
  const service = serviceBySlug(params.slug)
  if (!service) notFound()
  const cases = service.portfolioIds.map((id) => caseById(id)).filter((c): c is NonNullable<typeof c> => Boolean(c))

  return (
    <main className="bg-gray-50">
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
