import type { Metadata } from 'next'
import JangsanoteContactForm from './_components/ContactForm'

export const metadata: Metadata = {
  title: '커뮤니티 문의 | 장사노트',
  description: '장사노트 커뮤니티에 문의를 남겨주세요.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">커뮤니티 문의</h1>
        <p className="mb-8 text-sm text-gray-500">
          커뮤니티 이용이나 밋업 관련 문의를 남겨주세요.
        </p>
        <JangsanoteContactForm />
      </div>
    </main>
  )
}
