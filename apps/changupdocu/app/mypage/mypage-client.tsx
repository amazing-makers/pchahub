'use client'

import { useEffect, useState } from 'react'
import { BookmarkCheck, BookOpen, Clock, PlayCircle, ThumbsUp } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { EPISODES, ARTICLES } from '@/lib/mock-data'
import { EpisodeCard } from '@/components/episode-card'
import { ArticleCard } from '@/components/article-card'

const LIKES_KEY = 'changupdocu:likes'
const WATCHED_KEY = 'changupdocu:watched'

export function MyPageClient() {
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [watchedIds, setWatchedIds] = useState<string[]>([])
  const [recentEpIds, setRecentEpIds] = useState<string[]>([])
  const [recentArtIds, setRecentArtIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LIKES_KEY)
      if (raw) setLikedIds(JSON.parse(raw) as string[])
    } catch { /* ignore */ }
    try {
      const raw = window.localStorage.getItem(WATCHED_KEY)
      if (raw) setWatchedIds(JSON.parse(raw) as string[])
    } catch { /* ignore */ }
    try {
      const raw2 = window.localStorage.getItem('changupdocu:recentEpisodes')
      if (raw2) setRecentEpIds(JSON.parse(raw2) as string[])
    } catch { /* ignore */ }
    try {
      const raw3 = window.localStorage.getItem('changupdocu:recentArticles')
      if (raw3) setRecentArtIds(JSON.parse(raw3) as string[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  const likedEpisodes = EPISODES.filter((e) => likedIds.includes(e.id))
  const likedArticles = ARTICLES.filter((a) => likedIds.includes(a.id))
  const watchedEpisodes = EPISODES.filter((e) => watchedIds.includes(e.id))
  const totalLiked = likedEpisodes.length + likedArticles.length
  const totalViewed = recentEpIds.length + recentArtIds.length
  const recentEpisodes = recentEpIds.slice(0, 6).map((id) => EPISODES.find((e) => e.id === id)).filter(Boolean) as typeof EPISODES
  const recentArticles = recentArtIds.slice(0, 4).map((id) => ARTICLES.find((a) => a.id === id)).filter(Boolean) as typeof ARTICLES

  if (!hydrated) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 통계 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={ThumbsUp} label="좋아요" value={`${totalLiked}개`} />
        <StatCard icon={PlayCircle} label="좋아요 에피소드" value={`${likedEpisodes.length}개`} />
        <StatCard icon={BookOpen} label="좋아요 매거진" value={`${likedArticles.length}개`} />
        <StatCard icon={Clock} label="최근 본 콘텐츠" value={`${totalViewed}개`} />
        <StatCard icon={BookmarkCheck} label="시청 완료" value={`${watchedEpisodes.length}개`} />
      </div>

      {/* 좋아요한 에피소드 */}
      {likedEpisodes.length > 0 ? (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">
            좋아요한 에피소드
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {likedEpisodes.map((e) => (
              <EpisodeCard key={e.id} episode={e} />
            ))}
          </div>
        </section>
      ) : (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">좋아요한 에피소드</h2>
          <Card className="border-dashed border-gray-200">
            <CardContent className="p-8 text-center">
              <PlayCircle className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                아직 좋아요한 에피소드가 없습니다.
              </p>
              <a
                href="/episodes"
                className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                에피소드 보러가기
              </a>
            </CardContent>
          </Card>
        </section>
      )}

      {/* 좋아요한 매거진 글 */}
      {likedArticles.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">
            좋아요한 매거진 글
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {likedArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* 시청 완료한 에피소드 */}
      {watchedEpisodes.length > 0 ? (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">
            시청 완료한 에피소드
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {watchedEpisodes.map((e) => (
              <EpisodeCard key={e.id} episode={e} />
            ))}
          </div>
        </section>
      ) : (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">시청 완료한 에피소드</h2>
          <Card className="border-dashed border-gray-200">
            <CardContent className="p-8 text-center">
              <BookmarkCheck className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                아직 시청 완료한 에피소드가 없습니다.
              </p>
              <a
                href="/episodes"
                className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                다시 보기
              </a>
            </CardContent>
          </Card>
        </section>
      )}

      {/* 최근 본 에피소드 */}
      {recentEpisodes.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">최근 본 에피소드</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentEpisodes.map((e) => (
              <EpisodeCard key={e.id} episode={e} />
            ))}
          </div>
        </section>
      )}

      {/* 최근 본 매거진 글 */}
      {recentArticles.length > 0 && (
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">최근 본 매거진 글</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recentArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-5 text-sm">
          <div className="font-semibold text-amber-900">이 페이지는 mock 데이터입니다</div>
          <p className="mt-1 text-amber-800">
            Supabase 연결 후 실제 시청 기록·좋아요 데이터로 교체됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ThumbsUp
  label: string
  value: string
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <Icon className="h-4 w-4 text-gray-400" />
        <div className="mt-2 text-xs text-gray-500">{label}</div>
        <div className="mt-0.5 text-base font-semibold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  )
}
