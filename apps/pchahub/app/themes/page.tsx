import { Card, CardContent } from '@amakers/ui'

export default function ThemesPage() {
  return (
    <main className="container mx-auto py-section">
      <Card>
        <CardContent className="p-12 text-center">
          <h1 className="text-h2 font-bold text-gray-900">테마별 보기</h1>
          <p className="mt-4 text-gray-600">
            저자본 창업, 1인 창업, 여성 창업, 재택 가능 등 테마로 묶어보는 페이지입니다. 준비 중입니다.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
