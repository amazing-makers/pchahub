'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Star, Trophy } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { BrandActions } from '@/components/brand-actions'
import { CATEGORIES } from '@/lib/mock-data'
import { matchBrands, type ScannerAnswers, type ScannerMatch } from '@/lib/scanner'

type Step =
  | 'capital'
  | 'region'
  | 'categories'
  | 'staff'
  | 'experience'
  | 'hours'
  | 'priority'
  | 'results'

const STEPS: Step[] = [
  'capital',
  'region',
  'categories',
  'staff',
  'experience',
  'hours',
  'priority',
  'results',
]

const CAPITAL_OPTIONS = [
  { value: 3000, label: '3,000만원 이하' },
  { value: 5000, label: '3,000 ~ 5,000만원' },
  { value: 7000, label: '5,000 ~ 7,000만원' },
  { value: 10_000, label: '7,000만원 ~ 1억' },
  { value: 15_000, label: '1억 ~ 1.5억' },
  { value: 30_000, label: '1.5억 이상' },
]

const REGION_OPTIONS = [
  '전국',
  '서울',
  '경기',
  '인천',
  '부산',
  '대구',
  '대전',
  '광주',
  '울산',
  '강원',
  '충청',
  '전라',
  '경상',
  '제주',
]

const STAFF_OPTIONS = [
  { value: 1 as const, label: '혼자 운영', helper: '본인 1명, 가족·인력 도움 거의 없음' },
  { value: 2 as const, label: '2명 운영', helper: '본인 + 가족 또는 파트타임 1명' },
  { value: 3 as const, label: '3명 이상', helper: '본인 + 정규 인력 2명 이상' },
]

const EXPERIENCE_OPTIONS = [
  { value: 'none' as const, label: '없음', helper: '자영업·매장 운영 경험 없음' },
  { value: 'some' as const, label: '1 ~ 3년', helper: '단기 운영 또는 알바·점장 경험' },
  { value: 'experienced' as const, label: '3년 이상', helper: '실제 운영 경험 보유' },
]

const HOURS_OPTIONS = [
  { value: 'day' as const, label: '주간 (오전~오후)', helper: '점심·오후 객수 위주' },
  { value: 'evening' as const, label: '저녁 위주', helper: '저녁 식사 / 카페 저녁 객수' },
  { value: 'night' as const, label: '야간 / 심야', helper: '주점·심야 운영' },
  { value: 'flexible' as const, label: '유연하게', helper: '시간대 가리지 않음' },
]

const PRIORITY_OPTIONS = [
  {
    value: 'cost' as const,
    label: '저자본 창업',
    helper: '창업비 부담을 낮추는 게 가장 중요',
  },
  {
    value: 'awareness' as const,
    label: '브랜드 인지도',
    helper: '이미 알려진 브랜드의 후광이 필요',
  },
  {
    value: 'system' as const,
    label: '본사 시스템 안정',
    helper: '교육·운영 매뉴얼이 정비되어 있음',
  },
  {
    value: 'growth' as const,
    label: '성장성 / 트렌드',
    helper: '확장 속도가 빠르고 트렌디한 브랜드',
  },
  {
    value: 'stability' as const,
    label: '운영 안정성',
    helper: '오래된 브랜드, 검증된 매출 안정성',
  },
]

export function ScannerWizard() {
  const [stepIdx, setStepIdx] = useState(0)
  const [answers, setAnswers] = useState<Partial<ScannerAnswers>>({
    categories: [],
    region: '전국',
  })
  const [matches, setMatches] = useState<ScannerMatch[]>([])

  const currentStep = STEPS[stepIdx]
  const isLastQuestion = stepIdx === STEPS.length - 2
  const isResults = currentStep === 'results'
  const progress = ((stepIdx + 1) / (STEPS.length - 1)) * 100

  const canProceed = (() => {
    switch (currentStep) {
      case 'capital':
        return answers.capital !== undefined
      case 'region':
        return Boolean(answers.region)
      case 'categories':
        return (answers.categories?.length ?? 0) > 0
      case 'staff':
        return answers.staff !== undefined
      case 'experience':
        return answers.experience !== undefined
      case 'hours':
        return answers.hours !== undefined
      case 'priority':
        return answers.priority !== undefined
      default:
        return true
    }
  })()

  const next = () => {
    if (!canProceed) return
    if (isLastQuestion) {
      const result = matchBrands(answers as ScannerAnswers)
      setMatches(result)
    }
    setStepIdx((i) => Math.min(i + 1, STEPS.length - 1))
  }

  const back = () => setStepIdx((i) => Math.max(i - 1, 0))

  const restart = () => {
    setStepIdx(0)
    setAnswers({ categories: [], region: '전국' })
    setMatches([])
  }

  if (isResults) {
    return <Results matches={matches} answers={answers as ScannerAnswers} onRestart={restart} />
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <span>
            단계 {stepIdx + 1} / {STEPS.length - 1}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: 'var(--brand-primary)' }}
          />
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          {currentStep === 'capital' && (
            <Question
              title="창업에 사용 가능한 자본은 얼마인가요?"
              helper="총 창업비 = 가맹비 + 보증금 + 인테리어 + 교육비 + 기타. 여유 자금까지 포함해 답해주세요."
            >
              <OptionGrid>
                {CAPITAL_OPTIONS.map((o) => (
                  <Option
                    key={o.value}
                    selected={answers.capital === o.value}
                    onClick={() => setAnswers((p) => ({ ...p, capital: o.value }))}
                    title={o.label}
                  />
                ))}
              </OptionGrid>
            </Question>
          )}

          {currentStep === 'region' && (
            <Question
              title="선호하시는 운영 지역은 어디인가요?"
              helper="해당 지역에 매장이 많은 브랜드를 우선 추천합니다."
            >
              <OptionGrid cols={3}>
                {REGION_OPTIONS.map((r) => (
                  <Option
                    key={r}
                    selected={answers.region === r}
                    onClick={() => setAnswers((p) => ({ ...p, region: r }))}
                    title={r}
                  />
                ))}
              </OptionGrid>
            </Question>
          )}

          {currentStep === 'categories' && (
            <Question
              title="관심 있는 업종을 모두 선택해주세요"
              helper="복수 선택 가능합니다. 최소 1개."
            >
              <OptionGrid cols={3}>
                {CATEGORIES.map((c) => {
                  const selected = answers.categories?.includes(c.key) ?? false
                  return (
                    <Option
                      key={c.key}
                      selected={selected}
                      onClick={() =>
                        setAnswers((p) => {
                          const list = p.categories ?? []
                          return {
                            ...p,
                            categories: selected
                              ? list.filter((x) => x !== c.key)
                              : [...list, c.key],
                          }
                        })
                      }
                      title={c.label}
                      multi
                    />
                  )
                })}
              </OptionGrid>
            </Question>
          )}

          {currentStep === 'staff' && (
            <Question title="동시 운영 인력은 몇 명인가요?">
              <OptionList>
                {STAFF_OPTIONS.map((o) => (
                  <OptionRow
                    key={o.value}
                    selected={answers.staff === o.value}
                    onClick={() => setAnswers((p) => ({ ...p, staff: o.value }))}
                    title={o.label}
                    helper={o.helper}
                  />
                ))}
              </OptionList>
            </Question>
          )}

          {currentStep === 'experience' && (
            <Question title="자영업·매장 운영 경험이 있으신가요?">
              <OptionList>
                {EXPERIENCE_OPTIONS.map((o) => (
                  <OptionRow
                    key={o.value}
                    selected={answers.experience === o.value}
                    onClick={() => setAnswers((p) => ({ ...p, experience: o.value }))}
                    title={o.label}
                    helper={o.helper}
                  />
                ))}
              </OptionList>
            </Question>
          )}

          {currentStep === 'hours' && (
            <Question title="주력 영업 시간대는 언제인가요?">
              <OptionList>
                {HOURS_OPTIONS.map((o) => (
                  <OptionRow
                    key={o.value}
                    selected={answers.hours === o.value}
                    onClick={() => setAnswers((p) => ({ ...p, hours: o.value }))}
                    title={o.label}
                    helper={o.helper}
                  />
                ))}
              </OptionList>
            </Question>
          )}

          {currentStep === 'priority' && (
            <Question title="브랜드 선택 시 가장 중요시하는 가치는?">
              <OptionList>
                {PRIORITY_OPTIONS.map((o) => (
                  <OptionRow
                    key={o.value}
                    selected={answers.priority === o.value}
                    onClick={() => setAnswers((p) => ({ ...p, priority: o.value }))}
                    title={o.label}
                    helper={o.helper}
                  />
                ))}
              </OptionList>
            </Question>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              disabled={stepIdx === 0}
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              이전
            </button>
            <Button size="lg" onClick={next} disabled={!canProceed} className="gap-1">
              {isLastQuestion ? '결과 보기' : '다음'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ========================================================================
// Results
// ========================================================================

function Results({
  matches,
  answers,
  onRestart,
}: {
  matches: ScannerMatch[]
  answers: ScannerAnswers
  onRestart: () => void
}) {
  const top = matches[0]
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'var(--brand-primary)' }}
            >
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-h3 font-bold text-gray-900">
                {top ? `${top.brand.name} 외 ${matches.length - 1}개 추천` : '추천 결과'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                자본 {formatNumber(answers.capital)}만원 · {answers.region} ·{' '}
                {answers.categories
                  .map((c) => CATEGORIES.find((x) => x.key === c)?.label)
                  .filter(Boolean)
                  .join(', ')}{' '}
                기준
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {matches.map((m, i) => (
          <MatchCard key={m.brand.id} match={m} rank={i + 1} />
        ))}
      </div>

      <Card className="border-gray-200 bg-white">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="text-sm text-gray-600">
            결과가 마음에 안 드시나요? 답을 바꿔보세요.
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              다시 답하기
            </button>
            <a href="/brands">
              <Button size="md" variant="outline">
                전체 브랜드 둘러보기
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MatchCard({ match, rank }: { match: ScannerMatch; rank: number }) {
  const { brand, score, reasons } = match
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <span
              className="block h-16 w-16 rounded-2xl"
              style={{ background: brand.logoColor }}
              aria-hidden
            />
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
              {rank}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">{brand.name}</h3>
              {brand.hqVerified && (
                <CheckCircle2 className="h-4 w-4 text-blue-500" aria-label="협회 등록" />
              )}
            </div>
            <div className="mt-0.5 text-xs text-gray-500">{brand.categoryLabel}</div>
            <p className="mt-2 text-sm text-gray-700">{brand.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">매칭 점수</div>
            <div className="mt-0.5 text-h4 font-bold" style={{ color: 'var(--brand-primary)' }}>
              {score}
            </div>
          </div>
        </div>

        {reasons.length > 0 && (
          <ul className="mt-4 space-y-1.5 rounded-lg bg-gray-50 p-3 text-sm">
            {reasons.map((r) => (
              <li key={r} className="flex items-start gap-2">
                <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                <span className="text-gray-700">{r}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-gray-500">매장 수</div>
            <div className="mt-0.5 font-semibold text-gray-900">{brand.storeCount}개</div>
          </div>
          <div>
            <div className="text-gray-500">창업비</div>
            <div className="mt-0.5 font-semibold text-gray-900">
              {formatNumber(brand.startupCost)}만
            </div>
          </div>
          <div>
            <div className="text-gray-500">성장률</div>
            <div className="mt-0.5 font-semibold text-emerald-600">+{brand.growthRate}%</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <a href={`/brands/${brand.id}`}>
            <Button size="md">자세히 보기</Button>
          </a>
          <a href={`/inquiry?brand=${brand.id}`}>
            <Button size="md" variant="outline">
              가맹 상담 신청
            </Button>
          </a>
          <a href={`/calculator?brand=${brand.id}`}>
            <Button size="md" variant="ghost">
              수익 계산
            </Button>
          </a>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <BrandActions brandId={brand.id} brandName={brand.name} />
        </div>
      </CardContent>
    </Card>
  )
}

// ========================================================================
// Tiny presentational primitives
// ========================================================================

function Question({
  title,
  helper,
  children,
}: {
  title: string
  helper?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {helper && <p className="mt-2 text-sm text-gray-500">{helper}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}

function OptionGrid({ cols = 2, children }: { cols?: 2 | 3; children: React.ReactNode }) {
  return (
    <div
      className={
        'grid gap-2 ' +
        (cols === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2')
      }
    >
      {children}
    </div>
  )
}

function Option({
  selected,
  onClick,
  title,
  multi = false,
}: {
  selected: boolean
  onClick: () => void
  title: string
  multi?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ' +
        (selected
          ? 'border-gray-900 bg-gray-900 text-white'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400')
      }
      aria-pressed={selected}
    >
      <span>{title}</span>
      {selected && (
        <CheckCircle2
          className={'h-4 w-4 ' + (multi ? 'text-white' : 'text-white')}
        />
      )}
    </button>
  )
}

function OptionList({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}

function OptionRow({
  selected,
  onClick,
  title,
  helper,
}: {
  selected: boolean
  onClick: () => void
  title: string
  helper: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'block w-full rounded-xl border-2 px-4 py-3 text-left transition-all ' +
        (selected
          ? 'border-gray-900 bg-gray-50'
          : 'border-gray-200 bg-white hover:border-gray-400')
      }
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        {selected && <CheckCircle2 className="h-4 w-4 text-gray-900" />}
      </div>
      <div className="mt-0.5 text-xs text-gray-500">{helper}</div>
    </button>
  )
}
