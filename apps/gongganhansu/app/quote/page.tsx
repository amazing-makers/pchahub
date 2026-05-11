import { QuoteForm } from './form'

interface QuotePageProps {
  searchParams: { contractor?: string }
}

export default function QuotePage({ searchParams }: QuotePageProps) {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">무료 견적 요청</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            매장 정보를 입력하시면 적합한 시공사 3 ~ 5곳의 견적을 영업일 48시간 이내 받아보실 수
            있습니다. 비교 후 부담 없이 선택하세요.
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <QuoteForm preselectedContractor={searchParams.contractor} />
      </div>
    </main>
  )
}
