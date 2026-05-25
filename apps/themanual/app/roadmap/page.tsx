import type { Metadata } from 'next'
import { ChevronRight } from 'lucide-react'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { COURSES, type MockCourse } from '@/lib/mock-data'
import { CourseCard } from '@/components/course-card'

export const metadata: Metadata = buildPageMetadata('themanual', {
  title: '학습 로드맵 — 점주 유형별 맞춤 학습 경로',
  description: '예비 창업자·신규 점주·기존 점주·본사 담당자별 추천 학습 순서. 내 상황에 맞는 강의를 단계별로 찾아보세요.',
  path: '/roadmap',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '더 매뉴얼', url: 'https://themanual.amakers.co.kr' },
    { name: '학습 로드맵', url: 'https://themanual.amakers.co.kr/roadmap' },
  ],
})

interface RoadmapPhase {
  step: number
  title: string
  period: string
  description: string
  courseIds: string[]
}

interface RoadmapPersona {
  key: string
  label: string
  emoji: string
  description: string
  phases: RoadmapPhase[]
}

const PERSONAS: RoadmapPersona[] = [
  {
    key: 'prospective',
    label: '예비 창업자',
    emoji: '🔍',
    description: '아직 가맹 계약 전. 정보를 모으고 본사를 검토하는 단계.',
    phases: [
      {
        step: 1,
        title: '가맹 구조 이해',
        period: 'D-90 ~ D-60',
        description: '정보공개서 읽는 법·가맹 사업의 기본 구조부터 시작하세요.',
        courseIds: ['c1', 'c5'],
      },
      {
        step: 2,
        title: '계약·법무·재무 준비',
        period: 'D-60 ~ D-30',
        description: '창업 비용 계획과 계약서 함정을 짚어두면 후회가 없습니다.',
        courseIds: ['c7', 'c2', 'c9'],
      },
      {
        step: 3,
        title: '오픈 준비',
        period: 'D-30 ~ D-0',
        description: '인테리어 발주·직원 구성·분쟁 예방까지 마무리합니다.',
        courseIds: ['c3', 'c12'],
      },
    ],
  },
  {
    key: 'newowner',
    label: '신규 점주',
    emoji: '🏪',
    description: '개업 후 6개월 이내. 운영 루틴을 빠르게 잡는 시기.',
    phases: [
      {
        step: 1,
        title: '운영 기초 다지기',
        period: '개업 후 1개월',
        description: '1인 매장 운영 패턴·인력 관리를 먼저 안정화하세요.',
        courseIds: ['c11', 'c4'],
      },
      {
        step: 2,
        title: '마케팅으로 고객 확보',
        period: '개업 후 2~3개월',
        description: 'SNS·배달앱·POS 데이터를 연결해 신규 고객을 끌어오세요.',
        courseIds: ['c8', 'c10'],
      },
      {
        step: 3,
        title: '재무·세무 안정화',
        period: '개업 후 3~6개월',
        description: '회계 루틴과 세금 신고 준비로 재무 기반을 다집니다.',
        courseIds: ['c2', 'c9'],
      },
    ],
  },
  {
    key: 'established',
    label: '기존 점주',
    emoji: '📈',
    description: '1년 이상 운영 중. 매출 정체를 돌파하고 확장을 준비하는 단계.',
    phases: [
      {
        step: 1,
        title: '데이터 기반 운영 고도화',
        period: '당장 시작',
        description: 'POS·배달앱 데이터로 운영 낭비를 찾고 효율을 높이세요.',
        courseIds: ['c6', 'c10'],
      },
      {
        step: 2,
        title: '디지털 마케팅 심화',
        period: '1~2개월',
        description: 'SNS 채널을 매출로 연결하는 중급 마케팅 전략.',
        courseIds: ['c8'],
      },
      {
        step: 3,
        title: '법무·확장 전략',
        period: '2~3개월',
        description: '본사 협상·분쟁 예방·멀티 매장 확장의 법적 기반.',
        courseIds: ['c7', 'c12'],
      },
    ],
  },
  {
    key: 'hq',
    label: '본사 담당자',
    emoji: '🏢',
    description: '가맹 모집·점주 관리 업무를 담당하는 본사 직원.',
    phases: [
      {
        step: 1,
        title: '가맹 사업 법무 기초',
        period: '첫째 달',
        description: '가맹사업법·정보공개서·계약서 분쟁 사례를 정확히 이해하세요.',
        courseIds: ['c7', 'c12', 'c1'],
      },
      {
        step: 2,
        title: '점주 교육·운영 지원',
        period: '둘째 달',
        description: '점주 교육 설계·현장 운영 지원에 필요한 실전 지식.',
        courseIds: ['c4', 'c11'],
      },
      {
        step: 3,
        title: '가맹 모집 마케팅',
        period: '셋째 달',
        description: '예비 창업자를 설득하는 마케팅 콘텐츠와 설명회 전략.',
        courseIds: ['c8', 'c5'],
      },
    ],
  },
]

const DEFAULT_PERSONA = 'prospective'

interface RoadmapPageProps {
  searchParams: { persona?: string }
}

export default function RoadmapPage({ searchParams }: RoadmapPageProps) {
  const personaKey = PERSONAS.find((p) => p.key === searchParams.persona)?.key ?? DEFAULT_PERSONA
  const persona = PERSONAS.find((p) => p.key === personaKey)!
  const courseMap = Object.fromEntries(COURSES.map((c) => [c.id, c]))

  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white py-section">
        <div className="container mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            학습 로드맵 · Learning Roadmap
          </p>
          <h1 className="mt-3 text-h2 font-bold text-gray-900">내 상황에 맞는 학습 경로</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            점주 유형을 선택하면 단계별로 어떤 강의를 들어야 할지 알려드립니다.
            순서대로 따라가면 가장 빠릅니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {PERSONAS.map((p) => {
              const isActive = p.key === personaKey
              return (
                <a
                  key={p.key}
                  href={`/roadmap?persona=${p.key}`}
                  className={
                    'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ' +
                    (isActive ? 'text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }
                  style={isActive ? { background: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : undefined}
                >
                  <span>{p.emoji}</span>
                  {p.label}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Roadmap phases */}
      <section className="container mx-auto py-section">
        <div className="mb-8 flex items-center gap-4">
          <span className="text-4xl">{persona.emoji}</span>
          <div>
            <h2 className="text-h3 font-bold text-gray-900">{persona.label} 로드맵</h2>
            <p className="mt-0.5 text-sm text-gray-600">{persona.description}</p>
          </div>
        </div>

        <div className="space-y-10">
          {persona.phases.map((phase, phaseIdx) => {
            const phaseCourses = phase.courseIds.map((id) => courseMap[id]).filter((c): c is MockCourse => Boolean(c))
            return (
              <div key={phase.step} className="relative">
                {phaseIdx < persona.phases.length - 1 && (
                  <div className="absolute left-[19px] top-[44px] h-[calc(100%+2.5rem)] w-0.5 bg-gray-200" aria-hidden />
                )}
                <div className="flex gap-5">
                  <div
                    className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                    style={{ background: 'var(--brand-primary)' }}
                  >
                    {phase.step}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900">{phase.title}</h3>
                      <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs text-gray-500">
                        {phase.period}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{phase.description}</p>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {phaseCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Other personas */}
        <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8">
          <h2 className="text-h4 font-bold text-gray-900">다른 유형의 로드맵도 보기</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PERSONAS.filter((p) => p.key !== personaKey).map((p) => (
              <a
                key={p.key}
                href={`/roadmap?persona=${p.key}`}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-gray-300 hover:bg-white"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <span>{p.emoji}</span>
                  {p.label}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
