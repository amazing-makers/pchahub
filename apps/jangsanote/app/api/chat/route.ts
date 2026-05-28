import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `당신은 장사노트(jangsanote)의 AI 커뮤니티 도우미입니다. 소상공인·자영업자 커뮤니티와 부동산 인텔리전스(상권 인사이트) 서비스를 안내합니다. 항상 한국어로 답변하세요.

## 장사노트 소개
장사노트는 소상공인·예비창업자를 위한 커뮤니티 플랫폼입니다. 실전 창업 노하우 공유, 정기 밋업(창업자 모임), 상권 인텔리전스 정보까지 제공합니다.

## 주요 서비스
- **커뮤니티** (/community): 업종별·지역별 게시판, 창업 스토리, Q&A
- **밋업** (/meetups): 소상공인 정기 모임·네트워킹 이벤트
- **상권 인텔리전스** (/intel): 상권 동향, 폐업·개업 트렌드, 유동인구 리포트
- **허브** (/hub): 창업 자료·체크리스트·정책 정보 모음
- **스토리** (/stories): 실제 창업자 성공·실패 인터뷰

## 핵심 지식

### 커뮤니티 활용법
- 업종별 게시판에서 동종 업계 선배 창업자의 실전 경험 검색
- 지역별 게시판에서 해당 상권 실거주 창업자 의견 수집
- 익명 Q&A로 민감한 수익·계약 관련 질문 가능

### 상권 인텔리전스 핵심 지표
- 월별 신규 개업 수 vs 폐업 수 (생존율 지표)
- 업종별 평균 영업 기간
- 상권 내 배달앱 주문 비율
- 권리금 시세 변동 추이

### 소상공인 정책 지원
- 소상공인 정책자금 (저금리 대출): 소진공(소상공인시장진흥공단)
- 노란우산공제: 폐업·질병 대비 공제금 (월 5~100만원)
- 지역사랑상품권: 지역 상권 활성화 결제 할인

### 밋업 참여 팁
- 월 1~2회 정기 밋업 (서울·수도권 위주, 온라인 병행)
- 업종별 소모임 (카페창업자 모임, 외식창업자 모임 등)
- 참가비 무료~소액, 사전 신청 필수

## 답변 방식
- 동료 창업자처럼 친근한 톤
- 실전적이고 솔직한 정보 제공
- 관련 게시판·서비스 페이지 안내
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
