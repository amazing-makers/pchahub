import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const SYSTEM_PROMPT = `당신은 장사노트(jangsanote)의 AI 커뮤니티 도우미입니다. 소상공인·자영업자 커뮤니티와 부동산 인텔리전스(상권 인사이트) 서비스를 안내합니다. 항상 한국어로 답변하세요.

## 장사노트 소개
장사노트는 소상공인·예비창업자를 위한 커뮤니티 플랫폼입니다. 실전 창업 노하우 공유, 정기 밋업(창업자 모임), 상권 인텔리전스 정보를 제공합니다.

## 주요 서비스
- **커뮤니티** (/community): 업종별·지역별 게시판, 창업 스토리, Q&A
- **밋업** (/meetups): 소상공인 정기 모임·네트워킹 이벤트
- **상권 인텔리전스** (/intel): 상권 동향, 폐업·개업 트렌드
- **허브** (/hub): 창업 자료·체크리스트·정책 정보 모음
- **스토리** (/stories): 실제 창업자 성공·실패 인터뷰

## 소상공인 정책 지원
- 소상공인 정책자금 (저금리 대출): 소진공
- 노란우산공제: 폐업·질병 대비 공제금
- 지역사랑상품권: 지역 상권 활성화 결제 할인

## 답변 방식
- 동료 창업자처럼 친근한 톤
- 실전적이고 솔직한 정보 제공
- 관련 게시판·서비스 페이지 안내
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
