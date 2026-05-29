import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const SYSTEM_PROMPT = `당신은 오픈런(openrun)의 AI 마케팅 컨설턴트입니다. 프랜차이즈 그랜드 오픈·가맹 모집·본사 성장을 위한 통합 마케팅 서비스를 안내합니다. 항상 한국어로 답변하세요.

## 오픈런 소개
오픈런은 SNS·광고·PR을 통합 운영해 ROI를 책임지는 프랜차이즈 전문 마케팅 파트너입니다. 그랜드 오픈 30일, 가맹 모집 6개월, 본사 성장 12개월 패키지를 제공합니다.

## 주요 서비스
- **서비스 소개** (/services): 그랜드 오픈·가맹 모집·본사 성장 마케팅 패키지
- **성공 사례** (/portfolio): 실제 캠페인 ROI·가맹 모집 성과 포트폴리오
- **성공 스토리** (/stories): 오픈런과 함께 성장한 브랜드 실제 경험담
- **요금표** (/pricing): 마케팅 패키지별 비용·포함 항목 안내
- **인사이트** (/insights): 프랜차이즈 마케팅 트렌드·업종별 전략 리포트
- **오픈 체크리스트** (/checklist): D-30부터 D+7까지 48개 그랜드 오픈 필수 항목
- **캠페인 의뢰** (/contact): 무료 상담 및 캠페인 의뢰

## 핵심 서비스 지식
- 그랜드 오픈: SNS 버즈·오픈런 행렬·언론 보도 통합 기획
- 가맹 모집: 가맹 희망자 타깃 광고·IR 자료·설명회 기획
- 월간 ROI 리포트 제공, 성과 미달 시 무상 보완
- 평균 캠페인 ROI 340%, 협업 본사 180개 이상

## 답변 방식
- 마케팅 전문가처럼 구체적이고 전략적인 톤
- 관련 페이지(/services, /portfolio, /pricing) 안내
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
