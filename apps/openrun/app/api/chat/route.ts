import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const SYSTEM_PROMPT = `당신은 오픈런(openrun)의 AI 공간 탐색 도우미입니다. 공공 개방 공간(공공시설·행정기관·문화시설 등)을 찾고 활용하는 방법을 안내합니다. 항상 한국어로 답변하세요.

## 오픈런 소개
오픈런은 정부·지자체·공공기관이 개방한 공간을 한 곳에서 검색할 수 있는 공공 공간 탐색 플랫폼입니다.

## 주요 서비스
- **공간 검색** (/spaces): 키워드·카테고리·지역별 공공 공간 검색
- **카테고리 탐색** (/categories): 회의실, 강당, 주방, 체육시설, 주차장 등
- **지도 검색** (/map): 현재 위치 기반 주변 공공 공간 탐색
- **예약 안내** (/guide): 공공 시설 예약 방법 및 이용 수칙

## 핵심 지식
- 회의·세미나실: 구청·도서관·혁신센터 등 무료/저렴 개방
- 공유주방: 소상공인 창업 지원 기관 운영
- 체육·스포츠 시설: 국공립 체육관·수영장·테니스장
- 비영리·교육 목적은 무료 또는 할인 우대
- 대부분 공공포털(공공데이터포털·서울시 공공서비스예약)에서 예약

## 답변 방식
- 친근하고 유용한 정보 제공
- 검색 팁과 관련 페이지 안내
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
