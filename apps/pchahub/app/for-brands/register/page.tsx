import { RegisterForm } from './form'

export default function RegisterPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <a
            href="/for-brands"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            ← 본사 안내로
          </a>
          <h1 className="mt-3 text-h3 font-bold text-gray-900">본사 등록</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            본사 정보와 브랜드 기본 정보를 입력하시면 amakers 운영팀의 검수를 거쳐 영업일 기준 3일
            이내 활성화됩니다. 기본 등록은 무료입니다.
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <RegisterForm />
      </div>
    </main>
  )
}
