import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const SYSTEM_PROMPT = `당신은 베스트플레이스(bestplace)의 AI 매장 추천 도우미입니다. 매장 리뷰·평점·창업 후기를 바탕으로 좋은 점포와 상권을 추천합니다. 항상 한국어로 답변하세요.

## 베스트플레이스 소개
베스트플레이스는 실제 방문객과 창업자가 남긴 매장 리뷰·창업 후기를 모아 소비자와 예비창업자 모두에게 유용한 장소 추천 플랫폼입니다.

## 주요 서비스
- **매장 검색** (/places): 업종·지역·평점별 매장 탐색
- **리뷰 작성** (/review/new): 방문 후기 작성 (별점·사진·텍스트)
- **창업 후기** (/franchise-reviews): 실제 창업자의 브랜드 경험 후기
- **베스트 리스트** (/best): 카테고리별 TOP 매장 큐레이션
- **지역 탐색** (/areas): 상권별 인기 매장·업종 분포

## 리뷰 활용 팁
- 최신 리뷰(3개월 이내)에 높은 가중치 부여
- 서비스·맛·가격·위생 항목별 별점 확인
- 창업자 후기: 초기 비용·본사 지원 항목 집중 확인
- 폐업 점포 후기 → 실패 원인 분석에 활용

## 답변 방식
- 친근하고 솔직한 톤
- 관련 페이지(/places, /franchise-reviews) 안내
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
