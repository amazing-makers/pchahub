import type { Metadata } from 'next'
import PchabridgeContactForm from './_components/ContactForm'

export const metadata: Metadata = {
  title: '투자 문의 | 피차브릿지',
  description: '피차브릿지에 투자 문의를 남겨주세요.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">투자 문의</h1>
        <p className="mb-8 text-sm text-gray-500">
          투자 관심 분야나 규모를 알려주시면 맞춤 정보를 제공해드립니다.
        </p>
        <PchabridgeContactForm />
      </div>
    </main>
  )
}
