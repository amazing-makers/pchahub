import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Clock, Eye, Lock, ShoppingCart, Store, Users } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import {
  KNOWHOW_ITEMS,
  KNOWHOW_CATEGORY_EMOJI,
  KNOWHOW_CATEGORY_LABEL,
  knowhowById,
} from '@/lib/knowhow'
import { buildPageMetadata } from '@amakers/design-system'
import { SaveKnowhowButton } from './save-knowhow-button'

interface KnowhowPageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  return KNOWHOW_ITEMS.map((k) => ({ id: k.id }))
}

export async function generateMetadata({ params }: KnowhowPageProps): Promise<Metadata> {
  const item = knowhowById(params.id)
  if (!item) return {}
  return buildPageMetadata('themanual', {
    title: item.title,
    description: item.excerpt,
    path: `/knowhow/${item.id}`,
  })
}

export default function KnowhowDetailPage({ params }: KnowhowPageProps) {
  const item = knowhowById(params.id)
  if (!item) notFound()

  // For premium items: first section is free, rest are locked
  const FREE_SECTION_COUNT = 1
  const freeSections    = item.premium ? item.sections.slice(0, FREE_SECTION_COUNT) : item.sections
  const lockedSections  = item.premium ? item.sections.slice(FREE_SECTION_COUNT)    : []
  const hasLockedContent = lockedSections.length > 0

  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-200 sm:h-80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.heroImage}
          alt={item.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="container mx-auto">
            <a
              href="/knowhow"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> 노하우 목록
            </a>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                {KNOWHOW_CATEGORY_EMOJI[item.category]} {KNOWHOW_CATEGORY_LABEL[item.category]}
              </span>
              {!item.premium && <Badge variant="success">무료</Badge>}
              {item.premium && <Badge variant="default">프리미엄</Badge>}
              {item.featured && <Badge variant="warning">추천</Badge>}
            </div>
            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{item.title}</h1>
            <p className="mt-1 text-sm text-white/80">{item.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Main content */}
          <div className="space-y-8">
            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
              <MetaChip icon={<Clock className="h-4 w-4 text-[var(--brand-primary)]" />} label="읽기 시간" value={`${item.readTime}분`} />
              <MetaChip icon={<Eye className="h-4 w-4 text-[var(--brand-primary)]" />} label="조회수" value={item.viewCount.toLocaleString()} />
              <MetaChip
                icon={
                  item.premium
                    ? <Lock className="h-4 w-4 text-[var(--brand-primary)]" />
                    : <BookOpen className="h-4 w-4 text-[var(--brand-primary)]" />
                }
                label="가격"
                value={item.premium ? `₩${item.price.toLocaleString()}` : '무료'}
              />
              <MetaChip icon={<CheckCircle className="h-4 w-4 text-[var(--brand-primary)]" />} label="섹션 수" value={`${item.sections.length}개`} />
              <div className="ml-auto">
                <SaveKnowhowButton itemId={item.id} />
              </div>
            </div>

            {/* Excerpt */}
            <Card className="border-gray-200">
              <CardContent className="p-5">
                <p className="leading-relaxed text-gray-700">{item.excerpt}</p>
              </CardContent>
            </Card>

            {/* TOC */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">📋 목차</h2>
              <ol className="space-y-2">
                {item.sections.map((sec, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        item.premium && i >= FREE_SECTION_COUNT
                          ? 'bg-gray-200 text-gray-400'
                          : 'bg-[var(--brand-primary)] text-white'
                      }`}
                    >
                      {item.premium && i >= FREE_SECTION_COUNT ? <Lock className="h-2.5 w-2.5" /> : i + 1}
                    </span>
                    <span
                      className={
                        item.premium && i >= FREE_SECTION_COUNT
                          ? 'text-gray-400'
                          : 'text-gray-700'
                      }
                    >
                      {sec.heading.replace(' (잠금)', '')}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Free sections */}
            <div className="space-y-8">
              {freeSections.map((sec, i) => (
                <section key={i}>
                  <h2 className="mb-3 text-h4 font-semibold text-gray-900">
                    <span className="mr-2 text-[var(--brand-primary)]">{i + 1}.</span>
                    {sec.heading}
                  </h2>
                  <Card className="border-gray-200">
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        {sec.body.split('\n\n').map((para, j) => (
                          <p key={j} className="whitespace-pre-line leading-relaxed text-gray-700 text-sm">
                            {para}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>
              ))}
            </div>

            {/* Paywall */}
            {hasLockedContent && (
              <div className="relative">
                {/* Blurred preview */}
                <div className="pointer-events-none select-none blur-sm opacity-40 space-y-8">
                  {lockedSections.slice(0, 2).map((sec, i) => (
                    <section key={i}>
                      <h2 className="mb-3 text-h4 font-semibold text-gray-900">
                        <span className="mr-2 text-[var(--brand-primary)]">{FREE_SECTION_COUNT + i + 1}.</span>
                        {sec.heading.replace(' (잠금)', '')}
                      </h2>
                      <Card className="border-gray-200">
                        <CardContent className="p-5">
                          <p className="text-sm leading-relaxed text-gray-700">
                            이 섹션의 내용은 구매 후 확인할 수 있습니다. 실전에서 바로 쓸 수 있는 구체적인 데이터와 템플릿이 포함되어 있습니다. 많은 점주분들이 이 내용으로 수익을 개선했습니다.
                          </p>
                        </CardContent>
                      </Card>
                    </section>
                  ))}
                </div>

                {/* Paywall overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="mx-4 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl max-w-sm w-full">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-primary)]/10">
                      <Lock className="h-7 w-7 text-[var(--brand-primary)]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {lockedSections.length}개 섹션이 잠겨 있습니다
                    </h3>
                    <p className="mt-1.5 text-sm text-gray-500">
                      구매 후 전체 내용을 바로 확인하세요
                    </p>
                    <div className="mt-4 text-2xl font-bold text-[var(--brand-primary)]">
                      ₩{item.price.toLocaleString()}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">1회 결제 · 평생 열람</p>
                    <button
                      type="button"
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      지금 구매하기 · ₩{item.price.toLocaleString()}
                    </button>
                    <p className="mt-3 text-xs text-gray-400">결제 후 즉시 열람 가능</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              {item.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/knowhow?q=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 hover:border-[var(--brand-primary)]/50 hover:text-[var(--brand-primary)]"
                >
                  #{tag}
                </a>
              ))}
            </div>

            {/* amakers 생태계 크로스링크 */}
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  amakers에서 더 알아보기
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  이 노하우와 관련된 브랜드·강의·커뮤니티를 확인하세요.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <a
                    href={`https://pchahub.amakers.co.kr/brands?category=${item.category}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Store className="h-3.5 w-3.5 text-indigo-500" />
                      관련 가맹 브랜드
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href={`/courses?category=${item.category}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                      관련 강의 보기
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href="https://jangsanote.amakers.co.kr"
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-emerald-500" />
                      점주 커뮤니티
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Source */}
            <div className="text-xs text-gray-400">
              작성자: {item.author} · 등록일 {item.publishedAt}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            {/* Purchase card (premium) or Free card */}
            {item.premium ? (
              <Card className="border-[var(--brand-primary)]/30 shadow-sm">
                <CardContent className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">프리미엄 노하우</div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">
                    ₩{item.price.toLocaleString()}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">1회 결제 · 평생 열람</p>

                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-xs text-gray-700">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      전체 {item.sections.length}개 섹션 즉시 열람
                    </li>
                    <li className="flex items-center gap-2 text-xs text-gray-700">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      실전 템플릿·체크리스트 포함
                    </li>
                    <li className="flex items-center gap-2 text-xs text-gray-700">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      콘텐츠 업데이트 시 무료 제공
                    </li>
                  </ul>

                  <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    구매하기
                  </button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-800">무료 콘텐츠</span>
                  </div>
                  <p className="mt-2 text-xs text-emerald-700">
                    이 노하우는 무료로 전체 내용을 열람할 수 있습니다.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Author card */}
            <Card className="border-gray-200">
              <CardContent className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">작성자</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-sm font-bold text-[var(--brand-primary)]">
                    {item.author.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.author}</span>
                </div>
              </CardContent>
            </Card>

            {/* Back CTA */}
            <a
              href="/knowhow"
              className="block w-full rounded-xl border-2 border-dashed border-gray-200 py-3 text-center text-sm text-gray-500 hover:border-[var(--brand-primary)]/40 hover:text-[var(--brand-primary)]"
            >
              ← 노하우 전체 보기
            </a>
          </aside>
        </div>
      </div>
    </main>
  )
}

function MetaChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <div className="text-[10px] text-gray-400">{label}</div>
        <div className="text-sm font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  )
}
