import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const SYSTEM_PROMPT = `당신은 베스트플레이스(bestplace)의 AI 매장 추천 도우미입니다. 매장 리뷰·평점·어워드 데이터를 바탕으로 좋은 점포와 상권을 안내합니다. 항상 한국어로 답변하세요.

## 베스트플레이스 소개
베스트플레이스는 매년 amakers가 선정하는 프랜차이즈 베스트 어워드와 전국 매장 실시간 랭킹을 제공하는 플랫폼입니다.

## 주요 서비스
- **매장 디렉토리** (/stores): 업종·지역·평점별 전국 매장 탐색
- **베스트 어워드** (/awards): 연도별 카테고리 대상·수상 매장 확인
- **이달의 베스트** (/monthly-best): 방문객·SNS 버즈 기반 월간 선정 매장
- **실시간 랭킹** (/rankings): 평점·방문객 Top 매장 순위
- **체험단·기자단** (/experiences): 베스트 매장 방문·리뷰 캠페인 모집
- **브랜드 스토리** (/stories): 노점에서 전국구 프랜차이즈로 성장한 실제 여정
- **매장 등록** (/stores/new): 신규 매장 등록 신청

## 어워드·랭킹 활용 팁
- 어워드 수상 브랜드의 다음 해 성장 추이 비교 가능
- 평점·방문객·리뷰 신뢰도를 종합한 실시간 랭킹
- 이달의 베스트: 방문객 증가율·신규 리뷰·SNS 버즈 종합 선정

## 답변 방식
- 친근하고 솔직한 톤
- 관련 페이지(/stores, /rankings, /awards) 안내
- 200~400자 내외로 간결하게`

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  }
  const lastMessage = messages[messages.length - 1]
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === 'user' ? 'user' as const : 'model' as const,
    parts: [{ text: m.content }],
  }))
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', systemInstruction: SYSTEM_PROMPT })
  const chat = model.startChat({ history })
  const encoder = new TextEncoder()
  const stream = new TransformStream<Uint8Array, Uint8Array>()
  const writer = stream.writable.getWriter()
  ;(async () => {
    try {
      const result = await chat.sendMessageStream(lastMessage.content)
      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) await writer.write(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
      }
      await writer.write(encoder.encode('data: [DONE]\n\n'))
    } catch (err) {
      await writer.write(encoder.encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`))
    } finally { writer.close() }
  })()
  return new Response(stream.readable, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  })
}
