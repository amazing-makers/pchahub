import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `당신은 오픈런(openrun)의 AI 공간 탐색 도우미입니다. 공공 개방 공간(공공시설·행정기관·문화시설 등)을 찾고 활용하는 방법을 안내합니다. 항상 한국어로 답변하세요.

## 오픈런 소개
오픈런은 정부·지자체·공공기관이 개방한 공간을 한 곳에서 검색할 수 있는 공공 공간 탐색 플랫폼입니다.

## 주요 서비스
- **공간 검색** (/spaces): 키워드·카테고리·지역별 공공 공간 검색
- **카테고리 탐색** (/categories): 회의실, 강당, 주방, 체육시설, 주차장 등 유형별 탐색
- **지도 검색** (/map): 현재 위치 기반 주변 공공 공간 탐색
- **예약 안내** (/guide): 공공 시설 예약 방법 및 이용 수칙

## 핵심 지식

### 공공 개방 공간 유형
- **회의·세미나실**: 구청·도서관·혁신센터 등이 무료 또는 저렴하게 개방
- **주방·조리시설**: 소상공인 창업 지원 기관의 공유주방
- **체육·스포츠 시설**: 국공립 체육관·수영장·테니스장 등
- **문화·공연 공간**: 복합문화공간·갤러리·소극장
- **주차장**: 공공 개방 주차장 (야간·주말 무료)
- **교육·강의실**: 지자체 평생교육시설, 직업훈련원

### 이용 팁
- 대부분 공공 포털(공공데이터포털·서울시 공공서비스예약 등)에서 예약 가능
- 비영리·교육 목적은 무료 또는 할인 우대
- 소상공인·1인 기업은 창업지원센터 공간 우선 배정 혜택

## 답변 방식
- 친근하고 유용한 정보 제공
- 검색 팁과 관련 페이지 안내
- 200~400자 내외로 간결하게`

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as { messages: Array<{ role: 'user' | 'assistant'; content: string }> }

  const encoder = new TextEncoder()
  const stream = new TransformStream<Uint8Array, Uint8Array>()
  const writer = stream.writable.getWriter()

  ;(async () => {
    try {
      const anthropicStream = client.messages.stream({
        model: 'claude-opus-4-7',
        max_tokens: 1024,
        thinking: { type: 'adaptive' },
        system: SYSTEM_PROMPT,
        messages,
      })
      for await (const event of anthropicStream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`))
        }
      }
      await writer.write(encoder.encode('data: [DONE]\n\n'))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      await writer.write(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`))
    } finally {
      writer.close()
    }
  })()

  return new Response(stream.readable, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  })
}
