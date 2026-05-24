import type { Metadata } from 'next'
import { ArrowLeft, ChefHat } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { buildPageMetadata } from '@amakers/design-system'
import { RecipeSubmitForm } from './recipe-submit-form'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '레시피 작성',
  description: '매장에서 검증한 메뉴 레시피를 직접 공유해 다른 점주들과 노하우를 나누세요.',
  path: '/recipes/new',
})

export default function RecipeNewPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          <a href="/recipes" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> 레시피
          </a>
          <h1 className="mt-3 inline-flex items-center gap-2 text-h3 font-bold text-gray-900">
            <ChefHat className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
            레시피 작성
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            매장에서 검증한 메뉴 레시피를 공유하세요. 원가·조리법을 담으면 다른 점주에게 큰 도움이 됩니다.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-2xl py-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <RecipeSubmitForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
