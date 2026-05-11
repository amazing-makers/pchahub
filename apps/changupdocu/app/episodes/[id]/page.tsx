import { notFound } from 'next/navigation'
import {
  ChevronRight,
  Clock,
  Eye,
  PlayCircle,
  Share2,
  ThumbsUp,
} from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import {
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  EPISODES,
  episodesByCategory,
  type MockEpisode,
} from '@/lib/mock-data'
import { EpisodeCard } from '@/components/episode-card'

export function generateStaticParams() {
  return EPISODES.map((e) => ({ id: e.id }))
}

interface EpisodeDetailProps {
  params: { id: string }
}

export default function EpisodeDetailPage({ params }: EpisodeDetailProps) {
  const ep = EPISODES.find((e) => e.id === params.id)
  if (!ep) notFound()
  const related = episodesByCategory(ep.category).filter((e) => e.id !== ep.id).slice(0, 3)

  return (
    <main className="bg-gray-50">
      {/* Video player placeholder */}
      <section className="bg-black">
        <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ep.thumbnailImage} alt={ep.title} className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/95 p-5 shadow-2xl transition-transform hover:scale-105 cursor-pointer">
              <PlayCircle className="h-12 w-12 text-gray-900" />
            </div>
          </div>
          <div className="absolute bottom-4 right-4 rounded bg-black/80 px-3 py-1 text-sm font-medium text-white">
            {ep.duration}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/episodes" className="hover:text-gray-900">에피소드</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <a href={`/categories/${ep.category}`} className="hover:text-gray-900">
              {CATEGORY_LABEL[ep.category]}
            </a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700 line-clamp-1">{ep.title}</span>
          </nav>

          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="default"
                className="text-white"
                style={{ background: CATEGORY_COLOR[ep.category] }}
              >
                {CATEGORY_LABEL[ep.category]}
              </Badge>
              {ep.brand && <Badge variant="default">{ep.brand}</Badge>}
              {ep.trending && <Badge variant="warning">트렌딩</Badge>}
            </div>
            <h1 className="mt-3 text-h2 font-bold text-gray-900">{ep.title}</h1>
            <p className="mt-2 text-base text-gray-700">{ep.subtitle}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatNumber(ep.views)}회
              </span>
              <span className="inline-flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {formatNumber(ep.likes)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {ep.publishedAt}
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="gap-1">
                <ThumbsUp className="h-3.5 w-3.5" /> 좋아요
              </Button>
              <Button size="sm" variant="ghost" className="gap-1 text-gray-600">
                <Share2 className="h-3.5 w-3.5" /> 공유
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-6">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-h4 font-semibold text-gray-900">에피소드 소개</h2>
            <article className="mt-4 space-y-4 text-base leading-relaxed text-gray-800">
              {ep.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>
            {ep.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-1.5">
                {ep.tags.map((t) => (
                  <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-h4 font-semibold text-gray-900">챕터</h2>
            <ol className="mt-4 space-y-2">
              {ep.chapters.map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                  <div
                    className="flex h-7 w-14 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
                    style={{ background: CATEGORY_COLOR[ep.category] }}
                  >
                    {c.time}
                  </div>
                  <div className="text-sm text-gray-800">{c.title}</div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {ep.brand && (
          <Card className="border-gray-200 bg-indigo-50">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    이 에피소드의 브랜드 — {ep.brand}
                  </h2>
                  <p className="mt-1 text-sm text-gray-700">
                    가맹 정보 · 매장 · 운영 강의를 amakers 다른 플랫폼에서 이어서 확인하세요.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <a
                  href={`https://pchahub.kr/brands?q=${encodeURIComponent(ep.brand)}`}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-gray-300"
                >
                  → 가맹 정보 (프차허브)
                </a>
                <a
                  href={`https://bestplace.kr/stores?q=${encodeURIComponent(ep.brand)}`}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-gray-300"
                >
                  → 매장 보기 (베스트플레이스)
                </a>
                <a
                  href="https://jangsanote.kr"
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-gray-300"
                >
                  → 점주 후기 (장사노트)
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {related.length > 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-h4 font-semibold text-gray-900">
                같은 {CATEGORY_LABEL[ep.category]} 카테고리
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <EpisodeCard key={r.id} episode={r} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
