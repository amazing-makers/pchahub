import { AlertCircle, ArrowRight } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

const MESSAGES: Record<string, { title: string; body: string }> = {
  Configuration: { title: '서버 설정 오류', body: 'NextAuth 설정에 문제가 있습니다.' },
  AccessDenied: { title: '접근이 거부되었습니다', body: '권한이 없습니다. 다른 계정으로 시도해 보세요.' },
  Verification: { title: '인증 토큰이 만료되었습니다', body: '다시 로그인해 주세요.' },
  OAuthSignin: { title: 'OAuth 로그인 실패', body: '제공업체 연결 중 문제가 발생했습니다.' },
  OAuthCallback: { title: 'OAuth 응답 처리 실패', body: '제공업체 응답 처리 중 오류.' },
  OAuthCreateAccount: { title: '계정 생성 실패', body: '소셜 계정으로 새 계정을 만드는 중 문제가 발생.' },
  OAuthAccountNotLinked: { title: '계정 연결 필요', body: '이 이메일은 다른 로그인 방식으로 이미 가입되어 있습니다.' },
  CredentialsSignin: { title: '로그인 실패', body: '입력하신 정보로 로그인할 수 없습니다.' },
  SessionRequired: { title: '로그인이 필요합니다', body: '이 페이지를 이용하려면 먼저 로그인해 주세요.' },
  Default: { title: '로그인 오류', body: '알 수 없는 오류가 발생했습니다.' },
}

export default function AuthErrorPage({ searchParams }: { searchParams: { error?: string } }) {
  const code = searchParams.error ?? 'Default'
  const message = MESSAGES[code] ?? MESSAGES.Default

  return (
    <main className="bg-gray-50">
      <div className="container mx-auto flex min-h-[calc(100vh-64px-200px)] items-center justify-center py-12">
        <Card className="w-full max-w-md border-gray-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
              <AlertCircle className="h-7 w-7 text-rose-500" />
            </div>
            <h1 className="mt-4 text-h4 font-bold text-gray-900">{message.title}</h1>
            <p className="mt-2 text-sm text-gray-600">{message.body}</p>
            <div className="mt-2 inline-block rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-500">
              error: {code}
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <a href="/auth/signin">
                <Button size="lg" className="w-full gap-1">
                  다시 로그인 시도 <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href="/">
                <Button size="lg" variant="outline" className="w-full">
                  홈으로
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
