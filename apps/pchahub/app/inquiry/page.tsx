import { Card, CardContent } from '@amakers/ui'

export default function InquiryPage() {
  return (
    <main className="container mx-auto py-section">
      <Card>
        <CardContent className="p-12 text-center">
          <h1 className="text-h2 font-bold text-gray-900">상담 신청</h1>
          <p className="mt-4 text-gray-600">
            관심 있는 브랜드에 대한 가맹 상담을 신청하면 본사가 직접 답변드립니다. 준비 중입니다.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
