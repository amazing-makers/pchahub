import { ArrowRight, Eye, MessageSquare, ThumbsUp } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { DISCUSSIONS, QUESTIONS } from '@/lib/mock-community'

const CATEGORY_LABELS: Record<string, string> = {
  experience: '창업 후기',
  question: '질문',
  tip: '팁',
  news: '시장 동향',
}

interface CommunityPageProps {
  searchParams: { tab?: string }
}

export default function CommunityPage({ searchParams }: CommunityPageProps) {
  const tab = searchParams.tab ?? 'discussions'

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">프랜차이즈 커뮤니티</h1>
          <p className="mt-1 text-sm text-gray-500">
            가맹점주·예비창업자·전문가가 모인 커뮤니티. 더 깊은 토론은{' '}
            <a href="https://jangsanote.kr" className="text-gray-900 underline">
              장사노트
            </a>
            에서.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="mb-6 flex gap-1 border-b border-gray-200">
          <TabLink href="/community?tab=discussions" active={tab === 'discussions'}>
            토론 / 후기 ({DISCUSSIONS.length})
          </TabLink>
          <TabLink href="/community?tab=questions" active={tab === 'questions'}>
            전문가 Q&A ({QUESTIONS.length})
          </TabLink>
        </div>

        {tab === 'questions' ? (
          <div className="space-y-3">
            {QUESTIONS.map((q) => (
              <Card key={q.id} className="border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 shrink-0 text-base font-bold"
                      style={{ color: 'var(--brand-primary)' }}
                    >
                      Q
                    </span>
                    <h3 className="text-base font-semibold text-gray-900">{q.q}</h3>
                  </div>
                  <div className="mt-3 flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0 text-base font-bold text-gray-400">A</span>
                    <p className="text-sm text-gray-700">{q.a}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                    <span>{q.answeredBy}</span>
                    <span className="inline-flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      도움됨 {q.helpful}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {DISCUSSIONS.map((d) => (
              <a
                key={d.id}
                href={`https://jangsanote.kr/posts/${d.id}`}
                className="block"
              >
                <Card className="border-gray-200 transition-shadow hover:shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={d.category === 'tip' ? 'primary' : 'default'}>
                        {CATEGORY_LABELS[d.category]}
                      </Badge>
                      <span className="text-xs text-gray-500">{d.createdAt}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-gray-900">{d.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">{d.excerpt}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-500">
                      <span>{d.author}</span>
                      <span className="inline-flex items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatNumber(d.views)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {d.comments}
                        </span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center">
          <div className="text-sm text-gray-500">전국 가맹점주가 모이는 커뮤니티</div>
          <h2 className="mt-1 text-h4 font-bold text-gray-900">장사노트로 가서 글쓰기</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
            업종방·지역방·전문가 Q&A·오프라인 모임까지. 장사노트는 amakers의 자영업·가맹점주
            커뮤니티 플랫폼입니다.
          </p>
          <a
            href="https://jangsanote.kr"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            장사노트로 이동 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </main>
  )
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={
        'border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ' +
        (active
          ? 'border-gray-900 text-gray-900'
          : 'border-transparent text-gray-500 hover:text-gray-900')
      }
    >
      {children}
    </a>
  )
}
