import { RegisterForm } from './register-form'

export default function RegisterPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">매장 등록 신청</h1>
          <p className="mt-1 text-sm text-gray-500">
            운영 중인 매장 정보를 등록하면 성과 데이터와 리뷰를 관리할 수 있습니다.
          </p>
        </div>
      </section>
      <div className="container mx-auto max-w-xl py-10">
        <RegisterForm />
      </div>
    </main>
  )
}
