import type { Metadata } from 'next'
import GongganhansuContactForm from './_components/ContactForm'

export const metadata: Metadata = {
  title: '인테리어 견적 문의 | 공간한수',
  description: '공간한수에 인테리어 견적 문의를 남겨주세요.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">인테리어 견적 문의</h1>
        <p className="mb-8 text-sm text-gray-500">
          공간 크기와 업종을 알려주시면 맞춤 견적을 안내해드립니다.
        </p>
        <GongganhansuContactForm />
      </div>
    </main>
  )
}
