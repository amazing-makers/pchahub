import type { Metadata } from 'next'
import ChangupdocuContactForm from './_components/ContactForm'

export const metadata: Metadata = {
  title: '스토리 제보 | 창업도큐',
  description: '창업도큐에 스토리를 제보해주세요.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">스토리 제보</h1>
        <p className="mb-8 text-sm text-gray-500">
          창업과 관련한 생생한 스토리를 제보해주시면 검토 후 게재하겠습니다.
        </p>
        <ChangupdocuContactForm />
      </div>
    </main>
  )
}
