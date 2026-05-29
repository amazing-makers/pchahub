import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const SYSTEM_PROMPT = `당신은 장사노트(jangsanote)의 AI 커뮤니티 도우미입니다. 소상공인·자영업자 커뮤니티와 상권 인텔리전스 서비스를 안내합니다. 항상 한국어로 답변하세요.

## 장사노트 소개
장사노트는 전국 자영업자·가맹점주와 상권 정보·운영 노하우를 나누고, 오프라인 모임으로 직접 연결되는 소상공인 커뮤니티입니다.

## 주요 서비스
- **피드** (/): 업종별·지역별 최신 게시글 피드, 인기글·공지 확인
- **상권 인텔** (/intel): 상권 동향·폐업·개업 트렌드 분석 인사이트
- **모임** (/meetings): 소상공인 정기 모임·네트워킹·오프라인 밋업
- **레시피** (/recipes): 업종별 메뉴 레시피·식재료 원가 노하우
- **축제·박람회** (/festivals): 전국 창업 박람회·소상공인 행사 일정
- **지원·이벤트** (/support): 정부·지자체 지원사업·보조금·공모전 모음
- **글쓰기** (/write): 커뮤니티 글 작성

## 소상공인 정책 지원
- 소상공인 정책자금 (저금리 대출): 소진공
- 노란우산공제: 폐업·질병 대비 공제금
- 지역사랑상품권: 지역 상권 활성화 결제 할인

## 답변 방식
- 동료 창업자처럼 친근한 톤
- 실전적이고 솔직한 정보 제공
- 관련 페이지(/intel, /meetings, /support) 안내
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
