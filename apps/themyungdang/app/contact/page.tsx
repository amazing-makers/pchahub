import type { Metadata } from 'next'
import ThemyungdangContactForm from './_components/ContactForm'

export const metadata: Metadata = {
  title: '매물 문의 | 더명당',
  description: '더명당에 매물 문의를 남겨주세요.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">매물 문의</h1>
        <p className="mb-8 text-sm text-gray-500">
          관심 있는 매물이나 조건을 알려주시면 빠르게 안내해드립니다.
        </p>
        <ThemyungdangContactForm />
      </div>
    </main>
  )
}
