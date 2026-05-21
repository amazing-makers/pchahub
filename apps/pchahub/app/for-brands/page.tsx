import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildHowToJsonLd, buildOrganizationJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '본사 파트너십',
  description: '프랜차이즈 본사를 위한 브랜드 노출·가맹 모집·정보공개서 등록 서비스. 예비 창업자 월 12만 명에게 브랜드를 알리세요.',
  path: '/for-brands',
})

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Cog,
  Globe,
  HeadphonesIcon,
  MapPin,
  Megaphone,
  Search,
  Sparkles,
  Star,
  Store,
  Target,
  Users,
} from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'

const STATS = [
  { label: '월 평균 방문자', value: '184,200명' },
  { label: '등록 가맹 브랜드', value: '328개' },
  { label: '월 매칭 신청', value: '4,820건' },
  { label: '월 가맹 성사', value: '127건' },
]

const PAIN_POINTS = [
  {
    icon: Search,
    title: '예비 점주 발굴이 어려움',
    body: '광고로는 진짜 창업 의향이 있는 사람을 찾기 어렵습니다. 자본·지역·업종이 맞는 후보가 누군지 모르는 게 가장 큰 문제입니다.',
  },
  {
    icon: ClipboardList,
    title: '정보공개서만으로는 본사 매력이 전달되지 않음',
    body: '협회 등록 자료는 필수지만 너무 형식적입니다. 본사가 강조하고 싶은 매장 운영 노하우·신메뉴·점주 지원 시스템은 따로 전달할 채널이 없습니다.',
  },
  {
    icon: Megaphone,
    title: '직접 광고는 효율이 낮음',
    body: '네이버·구글 광고는 단가가 점점 오르고 CPC당 매칭 전환율도 낮습니다. 가맹 카테고리는 전환 사이클이 길어 직접 광고만으로는 ROI가 안 나옵니다.',
  },
]

const SOLUTIONS = [
  {
    icon: Target,
    title: '검증된 예비 점주 풀',
    body: '창업 스캐너·수익 계산기를 거친 사용자는 자본·지역·업종이 명확히 정리되어 있습니다. 본사는 진짜 매칭되는 후보만 받게 됩니다.',
  },
  {
    icon: Sparkles,
    title: '본사 콘텐츠 노출',
    body: '정보공개서 위에 본사가 직접 작성한 매장 소개·신메뉴·점주 후기·라이브 매장 투어를 얹을 수 있습니다.',
  },
  {
    icon: Megaphone,
    title: '카테고리 상단 노출 광고',
    body: '검색 결과·홈페이지·테마 페이지에서 상단 노출 광고를 운영할 수 있습니다. CPC가 아닌 월 정액제라 비용 예측이 가능합니다.',
  },
]

const PROCESS_STEPS = [
  {
    title: '본사 등록',
    body: '회사 정보 + 정보공개서 업로드. 기본 등록은 무료입니다.',
  },
  {
    title: '브랜드 페이지 강화',
    body: '대시보드에서 매장 사진·신메뉴·점주 후기를 자유롭게 업데이트합니다.',
  },
  {
    title: '광고 운영 (선택)',
    body: '검색 상단 노출·홈 노출 등 광고 상품을 선택해 활용합니다.',
  },
  {
    title: '가맹 문의 응답',
    body: '예비 점주의 문의가 대시보드로 들어옵니다. 실시간 알림으로 빠르게 응답하세요.',
  },
]

const FEATURES = [
  { icon: BarChart3, label: '대시보드 분석' },
  { icon: HeadphonesIcon, label: '실시간 문의 알림' },
  { icon: Cog, label: '본사 정보 직접 관리' },
  { icon: Globe, label: '협회 정보공개서 자동 연동' },
  { icon: Users, label: '점주 후기 관리' },
  { icon: Megaphone, label: '광고 캠페인 운영' },
]

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차허브', url: 'https://pchahub.amakers.co.kr' },
    { name: '본사 파트너십', url: 'https://pchahub.amakers.co.kr/for-brands' },
  ],
})

const orgJsonLd = buildOrganizationJsonLd({
  name: '프차허브',
  url: 'https://pchahub.amakers.co.kr',
  description: '프랜차이즈 본사를 위한 예비 점주 매칭 + 정보공개서 자동 연동 + 광고 플랫폼.',
})

const processHowToJsonLd = buildHowToJsonLd({
  name: '프차허브 본사 파트너십 시작 4단계',
  description: '본사 등록부터 광고 운영·가맹 문의 응답까지 프차허브에서 파트너십을 시작하는 방법.',
  url: 'https://pchahub.amakers.co.kr/for-brands',
  steps: PROCESS_STEPS.map((s) => ({ name: s.title, text: s.body })),
  price: 0,
})

export default function ForBrandsPage() {
  return (
    <main>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={processHowToJsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* Hero — dark */}
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto py-section">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            For Franchise HQ
          </p>
          <h1 className="mt-4 text-hero font-bold">
            프랜차이즈 본사를 위한
            <br />
            예비 점주 매칭 플랫폼
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300">
            창업 스캐너로 검증된 예비 점주에게 본사를 노출하고, 광고 상단 노출로 매칭 효율을
            끌어올리세요. 정보공개서 자동 연동 + 본사 콘텐츠 직접 관리 + 실시간 가맹 문의 알림.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/for-brands/register">
              <Button size="lg">본사 등록 시작 (무료)</Button>
            </a>
            <a href="/for-brands/ads">
              <Button size="lg" variant="ghost" className="gap-1 text-white hover:bg-white/10">
                광고 상품 보기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="mt-0.5 text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h2 font-bold text-gray-900">본사가 겪는 진짜 문제</h2>
            <p className="mt-3 text-gray-600">
              가맹 사업을 키우는 데 가장 큰 벽은 늘 같은 곳에 있습니다.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {PAIN_POINTS.map((p) => (
              <Card key={p.title} className="border-gray-200">
                <CardContent className="p-6">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-500"
                  >
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">{p.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{p.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="container mx-auto py-section">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            How amakers helps
          </p>
          <h2 className="mt-3 text-h2 font-bold text-gray-900">
            amakers가 본사를 위해 하는 일
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <Card key={s.title} className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h2 font-bold text-gray-900">등록부터 매칭까지 4단계</h2>
            <p className="mt-3 text-gray-600">
              기본 등록은 무료. 광고 상품은 필요할 때만 추가로 운영하세요.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((s, i) => (
              <Card key={s.title} className="border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <h3 className="text-base font-semibold text-gray-900">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{s.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto py-section">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2 font-bold text-gray-900">대시보드에서 제공되는 기능</h2>
          <p className="mt-3 text-gray-600">
            기본 등록만으로도 모든 운영 기능을 사용할 수 있습니다. 광고는 별도 옵션입니다.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center"
            >
              <f.icon className="h-5 w-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* amakers 생태계 크로스링크 */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-6">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">amakers에서 더 알아보기</div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <a href="https://themyungdang.amakers.co.kr/listings" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-500" />창업 매물 찾기</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://bestplace.amakers.co.kr/stores" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" />우수 매장 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themanual.amakers.co.kr/courses" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-indigo-500" />창업 운영 강의</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://jangsanote.amakers.co.kr" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-rose-500" />점주 커뮤니티</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">가맹 모집 인사이트를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">가맹 모집 전략·업종별 창업 트렌드·성공 사례를 격주로 보내드립니다.</p>
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

      {/* Pricing teaser */}
      <section className="container mx-auto pb-section">
        <Card className="border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg">
          <CardContent className="p-10">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-h2 font-bold">광고 상품으로 매칭을 더 빠르게</h2>
                <p className="mt-3 max-w-2xl text-gray-300">
                  기본 등록은 무료이지만, 카테고리 상단 노출·홈 hero 노출·우선 매칭 등 광고 상품을
                  운영하면 매칭 속도를 빠르게 끌어올릴 수 있습니다.
                </p>
                <ul className="mt-5 space-y-1.5 text-sm text-gray-300">
                  {['카테고리·검색 상단 노출', '월 정액제, CPC 부담 없음', '월간 매칭 분석 리포트'].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <a href="/for-brands/ads">
                  <Button size="lg" className="w-full gap-1">
                    광고 상품 자세히 보기
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
                <a href="/for-brands/register">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full text-white hover:bg-white/10"
                  >
                    무료 등록부터 시작
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
