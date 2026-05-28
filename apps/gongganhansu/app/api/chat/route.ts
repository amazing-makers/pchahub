import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const SYSTEM_PROMPT = `당신은 공간한수(gongganhansu)의 AI 인테리어 도우미입니다. 프랜차이즈·상가 창업 인테리어 시공, 비용 산정, 시공사 선택을 도와드립니다. 항상 한국어로 답변하세요.

## 공간한수 소개
공간한수는 창업 공간 인테리어 전문 플랫폼입니다. 업종별 시공 사례, 전문 시공사 매칭, 인테리어 비용 계산을 제공합니다.

## 주요 서비스
- **갤러리** (/gallery): 업종별 인테리어 시공 사례 및 포트폴리오
- **노하우** (/knowhow): 창업 인테리어 실전 팁
- **시공사** (/contractors): 검증된 인테리어 시공사 목록 및 리뷰
- **단가 계산기** (/calculator): 면적·업종·마감재 기준 예상 공사비 계산
- **인사이트** (/insights): 트렌드 분석, 업종별 인테리어 가이드
- **견적 요청** (/quote): 무료 견적 신청

## 업종별 인테리어 평균 비용 (2024 기준)
- 카페: 평당 200~350만원
- 치킨·배달 전문: 평당 80~150만원
- 한식당: 평당 120~200만원
- 편의점: 평당 80~130만원
- 스터디카페: 평당 120~180만원

## 비용 절감 팁
- 기존 인테리어 최대 활용
- 본사 지정 시공사 vs 자체 수급 견적 비교 필수
- 비수기(1~2월, 7~8월) 시공 시 10~15% 절감 가능

## 답변 방식
- 실용적이고 구체적인 정보 제공
- 관련 페이지(/calculator, /contractors) 안내
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
