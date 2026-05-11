import { ListingForm } from './form'

export default function NewListingPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <a
            href="/listings"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            ← 매물 목록으로
          </a>
          <h1 className="mt-3 text-h3 font-bold text-gray-900">매물 등록</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            양도 또는 신규임대 매물을 등록하세요. 등록 후 amakers 운영팀의 실사를 거쳐 영업일 기준
            2일 이내 노출됩니다. 등록 비용은 없으며, 거래 성사 시에만 표준 수수료가 발생합니다.
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <ListingForm />
      </div>
    </main>
  )
}
