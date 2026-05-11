import { BRANDS } from '@/lib/mock-data'
import { InquiryForm } from './form'

interface InquiryPageProps {
  searchParams: { brand?: string }
}

export default function InquiryPage({ searchParams }: InquiryPageProps) {
  const brand = searchParams.brand ? BRANDS.find((b) => b.id === searchParams.brand) : null

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">가맹 상담 신청</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {brand
              ? `${brand.name} 본사에 직접 상담을 신청합니다. 평일 기준 영업일 3일 이내 답변드립니다.`
              : '관심 브랜드 또는 일반 창업 상담을 신청합니다. 작성 정보는 본사에 직접 전달됩니다.'}
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <InquiryForm initialBrand={brand ?? null} />
      </div>
    </main>
  )
}
