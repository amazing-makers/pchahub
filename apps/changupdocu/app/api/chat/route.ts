import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `당신은 창업도큐(changupdocu)의 AI 콘텐츠 도우미입니다. 실제 창업자들의 성공·실패 스토리, 브랜드 다큐멘터리, 창업 인사이트를 안내합니다. 항상 한국어로 답변하세요.

## 창업도큐 소개
창업도큐는 한국 소상공인·프랜차이즈 창업자들의 리얼 스토리를 영상·글로 담아내는 창업 다큐멘터리 플랫폼입니다. 성공과 실패 모두를 솔직하게 다룹니다.

## 주요 서비스
- **에피소드** (/episodes): 창업자 인터뷰·다큐 영상 에피소드
- **시리즈** (/series): 업종별·주제별 연속 시리즈 컨텐츠
- **성공 스토리** (/categories/success): 성공 창업자 케이스 스터디
- **실패 스토리** (/categories/failure): 실패에서 배우는 교훈 (익명 포함)
- **브랜드 스토리** (/categories/brand): 프랜차이즈 브랜드 창업 비하인드
- **매거진** (/magazine): 창업 트렌드·정책 아티클
- **창업 타임라인** (/timeline): 한국 창업 생태계 역사 연표

## 핵심 지식

### 콘텐츠 카테고리별 특징
- **성공 스토리**: 초기 자본·전략·차별화 포인트·성장 과정 중심
- **실패 스토리**: 실패 원인 분석, 재기 여부, 후배 창업자를 위한 솔직한 조언
- **브랜드 스토리**: 프랜차이즈 본사의 창업 동기·성장통·가맹 확장 전략
- **에피소드**: 30~60분 깊이 있는 인터뷰, 현장 방문 촬영 포함

### 창업 실패 주요 원인 (통계 기반)
1. 입지 선정 오판 (과도한 보증금·임대료) — 35%
2. 운영 자금 부족 (3~6개월 운영비 미비축) — 28%
3. 차별화 부족·경쟁 심화 — 20%
4. 본사 지원 미흡·계약 분쟁 — 12%
5. 인력 이탈·관리 실패 — 5%

### 콘텐츠 활용법
- 창업 결정 전 비슷한 업종·예산의 실패 스토리 필독
- 브랜드 선택 시 해당 브랜드의 가맹점주 인터뷰 에피소드 확인
- 타임라인으로 업종별 성쇠 주기 파악

## 답변 방식
- 솔직하고 균형 잡힌 시각
- 관련 에피소드·시리즈 추천
- 관련 페이지(/episodes, /series, /magazine) 안내
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
