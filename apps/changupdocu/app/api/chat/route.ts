import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const SYSTEM_PROMPT = `당신은 창업도큐(changupdocu)의 AI 콘텐츠 도우미입니다. 실제 창업자들의 성공·실패 스토리, 브랜드 다큐멘터리, 창업 인사이트를 안내합니다. 항상 한국어로 답변하세요.

## 창업도큐 소개
창업도큐는 한국 소상공인·프랜차이즈 창업자들의 리얼 스토리를 영상·글로 담아내는 창업 다큐멘터리 플랫폼입니다.

## 주요 서비스
- **에피소드** (/episodes): 창업자 인터뷰·다큐 영상 에피소드
- **시리즈** (/series): 업종별·주제별 연속 시리즈 컨텐츠
- **성공 스토리** (/categories/success): 성공 창업자 케이스 스터디
- **실패 스토리** (/categories/failure): 실패에서 배우는 교훈
- **브랜드 스토리** (/categories/brand): 프랜차이즈 브랜드 창업 비하인드
- **매거진** (/magazine): 창업 트렌드·정책 아티클
- **창업 타임라인** (/timeline): 한국 창업 생태계 역사 연표

## 창업 실패 주요 원인
1. 입지 선정 오판 (과도한 임대료) — 35%
2. 운영 자금 부족 — 28%
3. 차별화 부족·경쟁 심화 — 20%
4. 본사 지원 미흡·계약 분쟁 — 12%
5. 인력 이탈·관리 실패 — 5%

## 답변 방식
- 솔직하고 균형 잡힌 시각
- 관련 에피소드·시리즈 추천
- 관련 페이지(/episodes, /magazine) 안내
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
