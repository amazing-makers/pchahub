import { Card, CardContent } from '@amakers/ui'

export default function ScannerPage() {
  return (
    <main className="container mx-auto py-section">
      <Card>
        <CardContent className="p-12 text-center">
          <h1 className="text-h2 font-bold text-gray-900">창업 스캐너</h1>
          <p className="mt-4 text-gray-600">
            자본, 지역, 경험, 관심 업종을 입력하면 적합한 가맹 브랜드를 추천하는 매칭 도구입니다. 준비 중입니다.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
