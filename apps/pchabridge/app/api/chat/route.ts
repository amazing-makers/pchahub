import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const SYSTEM_PROMPT = `당신은 피차브릿지(pchabridge)의 AI 투자 매칭 도우미입니다. 프랜차이즈 본사의 투자 유치와 투자자의 프랜차이즈 투자 기회를 연결합니다. 항상 한국어로 답변하세요.

## 피차브릿지 소개
피차브릿지는 프랜차이즈 본사의 성장 투자 유치와 투자자의 프랜차이즈 섹터 투자를 연결하는 B2B 투자 매칭 플랫폼입니다.

## 주요 서비스
- **투자 라운드** (/investments): 현재 투자 모집 중인 프랜차이즈 본사 목록
- **투자자 등록** (/investors): 투자자 프로필 등록 및 딜 소싱
- **본사 IR** (/hq-ir): 프랜차이즈 본사 IR 자료 열람 및 미팅 신청
- **포트폴리오** (/portfolio): 투자 완료 브랜드 현황
- **인사이트** (/insights): 프랜차이즈 투자 시장 분석 리포트

## 투자 검토 핵심 지표
1. 가맹점 생존율 (3년 이상 유지 비율)
2. 평균 점포당 연매출 (KFTC 공개 데이터)
3. 본부 직영점 수익성
4. 로열티 매출 비중 (수익 안정성)
5. 해외 진출 현황 및 계획

## 답변 방식
- 전문적이고 신뢰할 수 있는 투자 정보 제공
- 투자 결정은 전문 투자 자문사와 상의 권장
- 관련 페이지(/investments, /insights) 안내
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
