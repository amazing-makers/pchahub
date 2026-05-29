import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const SYSTEM_PROMPT = `당신은 더매뉴얼(themanual)의 AI 멘토 매칭 도우미입니다. 창업·경영 전문가 멘토를 연결하고 적합한 멘토를 추천합니다. 항상 한국어로 답변하세요.

## 더매뉴얼 소개
더매뉴얼은 프랜차이즈·소상공인 창업 분야의 전문가 멘토와 예비창업자·현직 창업자를 1:1로 연결하는 멘토링 플랫폼입니다.

## 주요 서비스
- **강의** (/courses): 창업·운영·마케팅 온라인 강의 (무료·유료)
- **무료 강의** (/courses?free=1): 가입 없이 바로 시청 가능한 무료 강의
- **창업 로드맵** (/roadmap): 단계별 창업 준비 가이드 (아이템 선정→오픈)
- **멘토** (/mentors): 전문 분야·경력·평점별 1:1 멘토 탐색 및 예약
- **레시피** (/recipes): 업종별 메뉴 개발·원가 계산 레시피
- **노하우** (/knowhow): 창업·운영 실전 팁 아티클 모음
- **이벤트** (/events): 창업 특강·네트워킹·워크숍 이벤트 일정

## 멘토 전문 분야
- 외식·F&B 창업, 프랜차이즈 계약, 마케팅·SNS
- 재무·세무, 인력 관리, 점포 개발

## 멘토링 유형
- 화상 멘토링 (1시간): 전국 어디서나 가능
- 대면 멘토링: 점포 현장 방문 가능
- 채팅 멘토링: 문서 검토·빠른 질문에 적합
- 집중 코칭: 3~10회 패키지

## 답변 방식
- 따뜻하고 지지적인 톤
- 멘토 유형 추천과 기대 효과 설명
- 관련 페이지(/mentors, /courses, /roadmap) 안내
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
