import type { Metadata } from 'next'
import ThemanualContactForm from './_components/ContactForm'

export const metadata: Metadata = {
  title: '멘토 매칭 상담 | 더매뉴얼',
  description: '더매뉴얼에서 멘토 매칭 상담을 신청하세요.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">멘토 매칭 상담</h1>
        <p className="mb-8 text-sm text-gray-500">
          상담받고 싶은 분야를 알려주시면 맞춤 멘토를 연결해드립니다.
        </p>
        <ThemanualContactForm />
      </div>
    </main>
  )
}
