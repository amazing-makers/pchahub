import { Card, CardContent } from '@amakers/ui'

export default function CalculatorPage() {
  return (
    <main className="container mx-auto py-section">
      <Card>
        <CardContent className="p-12 text-center">
          <h1 className="text-h2 font-bold text-gray-900">수익 계산기</h1>
          <p className="mt-4 text-gray-600">
            매장 평수, 입지, 인건비 등을 입력하면 예상 매출과 순이익을 추정하는 도구입니다. 준비 중입니다.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
