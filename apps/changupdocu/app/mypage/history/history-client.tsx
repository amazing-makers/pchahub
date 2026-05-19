'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Clock, PlayCircle, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { EPISODES, ARTICLES, CATEGORY_LABEL } from '@/lib/mock-data'
import { EpisodeCard } from '@/components/episode-card'
import { ArticleCard } from '@/components/article-card'

const RECENT_EP_KEY  = 'changupdocu:recentEpisodes'
const RECENT_ART_KEY = 'changupdocu:recentArticles'
const WATCHED_KEY    = 'changupdocu:watched'

type Tab = 'all' | 'episodes' | 'articles' | 'watched'

export function HistoryClient() {
  const [recentEpIds, setRecentEpIds]   = useState<string[]>([])
  const [recentArtIds, setRecentArtIds] = useState<string[]>([])
  const [watchedIds, setWatchedIds]     = useState<string[]>([])
  const [tab, setTab]                   = useState<Tab>('all')
  const [hydrated, setHydrated]         = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENT_EP_KEY)
      if (raw) setRecentEpIds(JSON.parse(raw) as string[])
    } catch { /* ignore */ }
    try {
      const raw = window.localStorage.getItem(RECENT_ART_KEY)
      if (raw) setRecentArtIds(JSON.parse(raw) as string[])
    } catch { /* ignore */ }
    try {
      const raw = window.localStorage.getItem(WATCHED_KEY)
      if (raw) setWatchedIds(JSON.parse(raw) as string[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  function clearAll() {
    window.localStorage.removeItem(RECENT_EP_KEY)
    window.localStorage.removeItem(RECENT_ART_KEY)
    setRecentEpIds([])
    setRecentArtIds([])
  }

  function removeEpisode(id: string) {
    const updated = recentEpIds.filter((x) => x !== id)
    setRecentEpIds(updated)
    window.localStorage.setItem(RECENT_EP_KEY, JSON.stringify(updated))
  }

  function removeArticle(id: string) {
    const updated = recentArtIds.filter((x) => x !== id)
    setRecentArtIds(updated)
    window.localStorage.setItem(RECENT_ART_KEY, JSON.stringify(updated))
  }

  if (!hydrated) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-xl bg-gray-100" />)}
      </div>
    )
  }

  const recentEpisodes = recentEpIds
    .map((id) => EPISODES.find((e) => e.id === id))
    .filter(Boolean) as typeof EPISODES

  const recentArticles = recentArtIds
    .map((id) => ARTICLES.find((a) => a.id === id))
    .filter(Boolean) as typeof ARTICLES

  const watchedEpisodes = EPISODES.filter((e) => watchedIds.includes(e.id))
  const totalItems = recentEpisodes.length + recentArticles.length

  if (totalItems === 0 && watchedEpisodes.length === 0) {
    return (
      <Card className="border-dashed border-gray-200">
        <CardContent className="p-12 text-center">
          <Clock className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-4 text-sm font-medium text-gray-600">아직 시청 기록이 없습니다</p>
          <p className="mt-1 text-xs text-gray-400">
            에피소드를 시청하거나 매거진 글을 읽으면 여기에 기록됩니다.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <a
              href="/episodes"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              에피소드 보기
            </a>
            <a
              href="/magazine"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400"
            >
              매거진 보기
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  const TABS = [
    { key: 'all' as Tab,      label: '전체',      count: totalItems },
    { key: 'episodes' as Tab, label: '에피소드',   count: recentEpisodes.length },
    { key: 'articles' as Tab, label: '매거진',     count: recentArticles.length },
    { key: 'watched' as Tab,  label: '시청 완료',  count: watchedEpisodes.length },
  ]

  return (
    <div className="space-y-6">
      {/* Tab bar + clear */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                tab === t.key
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`ml-1 text-xs ${tab === t.key ? 'text-gray-300' : 'text-gray-400'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
        {(recentEpisodes.length > 0 || recentArticles.length > 0) && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-3 w-3" />
            기록 지우기
          </button>
        )}
      </div>

      {/* Recent episodes */}
      {(tab === 'all' || tab === 'episodes') && recentEpisodes.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <PlayCircle className="h-4 w-4 text-gray-500" />
            <h2 className="text-h4 font-semibold text-gray-900">최근 본 에피소드</h2>
          </div>
          <div className="space-y-2">
            {recentEpisodes.map((e) => (
              <div key={e.id} className="group relative">
                <a
                  href={`/episodes/${e.id}`}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
                >
                  <div
                    className="h-10 w-10 shrink-0 rounded-lg"
                    style={{ background: `linear-gradient(135deg, ${e.thumbnailColors[0]}, ${e.thumbnailColors[1] ?? e.thumbnailColors[0]})` }}
                  />
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-gray-900">{e.title}</div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {CATEGORY_LABEL[e.category]} · {e.duration}
                      {watchedIds.includes(e.id) && (
                        <span className="ml-2 text-emerald-600">✓ 시청 완료</span>
                      )}
                    </div>
                  </div>
                  <PlayCircle className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                </a>
                <button
                  onClick={() => removeEpisode(e.id)}
                  className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-300 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                  title="기록에서 제거"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent articles */}
      {(tab === 'all' || tab === 'articles') && recentArticles.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <h2 className="text-h4 font-semibold text-gray-900">최근 본 매거진 글</h2>
          </div>
          <div className="space-y-2">
            {recentArticles.map((a) => (
              <div key={a.id} className="group relative">
                <a
                  href={`/magazine/${a.id}`}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
                >
                  <div
                    className="h-10 w-10 shrink-0 rounded-lg"
                    style={{ background: `linear-gradient(135deg, ${a.coverColors[0]}, ${a.coverColors[1] ?? a.coverColors[0]})` }}
                  />
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-gray-900">{a.title}</div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {a.authorName} · {a.readTime}분 읽기
                    </div>
                  </div>
                  <BookOpen className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                </a>
                <button
                  onClick={() => removeArticle(a.id)}
                  className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-300 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                  title="기록에서 제거"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Watched episodes */}
      {(tab === 'all' || tab === 'watched') && watchedEpisodes.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <PlayCircle className="h-4 w-4 text-emerald-500" />
            <h2 className="text-h4 font-semibold text-gray-900">시청 완료</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {watchedEpisodes.map((e) => (
              <EpisodeCard key={e.id} episode={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
