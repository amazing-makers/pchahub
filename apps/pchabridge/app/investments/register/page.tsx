import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { InvestmentRegisterForm } from './form'

export default async function InvestmentRegisterPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/investments/register')

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-10">
          <h1 className="text-h2 font-bold text-gray-900">본사 투자 유치 등록</h1>
          <p className="mt-2 text-base text-gray-500">
            투자 라운드 정보를 등록하면 검증된 투자자에게 브랜드를 노출합니다.
            amakers 팀이 IR 자료 호스팅과 NDA 체결을 지원합니다.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-2xl py-10">
        <InvestmentRegisterForm />
      </div>
    </main>
  )
}
