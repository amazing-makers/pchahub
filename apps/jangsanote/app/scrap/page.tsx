import type { Metadata } from 'next'
import { Bookmark, PencilLine } from 'lucide-react'
import { buildPageMetadata } from '@amakers/design-system'
import { ScrapList } from '@/components/scrap-list'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '내 스크랩',
  description: '저장한 레시피·축제·박람회·지원사업을 한곳에서 모아보세요.',
  path: '/scrap',
})

export default function ScrapPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="inline-flex items-center gap-2 text-h3 font-bold text-gray-900">
                <Bookmark className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
                내 스크랩
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                저장한 레시피·축제·지원 정보를 모아봤습니다. 이 기기에 저장됩니다.
              </p>
            </div>
            <a
              href="/my-submissions"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <PencilLine className="h-4 w-4" />
              내 제보 관리
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <ScrapList />
      </div>
    </main>
  )
}
