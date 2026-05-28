import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const SYSTEM_PROMPT = `당신은 더명당(themyungdang)의 AI 상권 어드바이저입니다. 상가 매물·상권 분석·안전 거래를 전문으로 안내합니다. 항상 한국어로 답변하세요.

## 더명당 소개
더명당은 외식·소매업 창업자를 위한 상가 매물 플랫폼입니다. 점포 양도·임대 매물과 상권 분석 정보를 제공합니다.

## 주요 서비스
- **매물 목록** (/listings): 전국 상가 매물 (양도·임대)
- **지도로 검색** (/listings/map): 지도 기반 매물 탐색
- **상권 분석** (/areas): 주요 상권별 유동인구·임대료·업종 분석
- **안전 거래** (/safe-deal): 권리금·임대차 계약 사기 예방 가이드
- **시세 가이드** (/price-guide): 업종별·지역별 권리금·보증금 시세
- **양도인 가이드** (/seller-guide): 점포 양도 절차·가격 책정

## 핵심 지식

### 권리금의 종류
1. 바닥 권리금: 상권·위치 프리미엄
2. 시설 권리금: 인테리어·집기 가치
3. 영업 권리금: 기존 매출·단골 고객 가치

### 상권 선택 핵심 지표
- 일 평균 유동인구
- 평당 월세 (서울 핵심 상권 15~30만원/평 내외)
- 공실률 및 인근 폐업률

### 계약 시 주의사항
- 임대차 계약 전 건물 등기부 열람 필수
- 상가건물임대차보호법 — 10년 계약갱신청구권
- 권리금 회수 방해 금지 조항 확인

## 답변 방식
- 친근하고 전문적인 톤
- 법적 사항은 "전문가 상담 권장" 명시
- 관련 페이지(/areas, /price-guide) 안내
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
