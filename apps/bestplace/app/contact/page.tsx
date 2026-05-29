import type { Metadata } from 'next'
import BestplaceContactForm from './_components/ContactForm'

export const metadata: Metadata = {
  title: '문의하기 | 베스트플레이스',
  description: '베스트플레이스에 문의를 남겨주세요.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">문의하기</h1>
        <p className="mb-8 text-sm text-gray-500">
          궁금한 점이 있으시면 언제든지 문의해주세요.
        </p>
        <BestplaceContactForm />
      </div>
    </main>
  )
}
