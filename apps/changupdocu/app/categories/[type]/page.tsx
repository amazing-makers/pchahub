import { notFound } from 'next/navigation'
import { EpisodeCard } from '@/components/episode-card'
import {
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  episodesByCategory,
  type EpisodeCategory,
} from '@/lib/mock-data'

const VALID_CATEGORIES: EpisodeCategory[] = ['success', 'failure', 'brand', 'trend', 'interview']

export function generateStaticParams() {
  return VALID_CATEGORIES.map((type) => ({ type }))
}

interface CategoryPageProps {
  params: { type: string }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const cat = params.type as EpisodeCategory
  if (!VALID_CATEGORIES.includes(cat)) notFound()
  const episodes = episodesByCategory(cat)

  return (
    <main className="bg-gray-50">
      <section
        className="text-white"
        style={{
          background: `linear-gradient(135deg, ${CATEGORY_COLOR[cat]}, ${CATEGORY_COLOR[cat]}AA)`,
        }}
      >
        <div className="container mx-auto py-section">
          <p className="text-sm font-semibold uppercase tracking-wider opacity-80">
            카테고리
          </p>
          <h1 className="mt-3 text-h1 font-bold">{CATEGORY_LABEL[cat]}</h1>
          <p className="mt-3 max-w-2xl text-base opacity-90">
            {cat === 'success' && '실제 매출 성장의 변곡점을 다큐로 추적합니다.'}
            {cat === 'failure' && '실패의 원인을 데이터와 인터뷰로 분석합니다.'}
            {cat === 'brand' && '본사가 직접 풀어주는 성장 비결을 다큐로 기록합니다.'}
            {cat === 'trend' && '시장의 변화를 데이터로 추적합니다.'}
            {cat === 'interview' && '점주들의 일상과 솔직한 후기를 인터뷰로 듣습니다.'}
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="mb-4 text-sm text-gray-700">{episodes.length}편</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {episodes.map((e) => (
            <EpisodeCard key={e.id} episode={e} />
          ))}
        </div>
      </div>
    </main>
  )
}
