import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `당신은 공간한수(gongganhansu)의 AI 인테리어 도우미입니다. 프랜차이즈·상가 창업 인테리어 시공, 비용 산정, 시공사 선택을 도와드립니다. 항상 한국어로 답변하세요.

## 공간한수 소개
공간한수는 창업 공간 인테리어 전문 플랫폼입니다. 업종별 시공 사례, 전문 시공사 매칭, 인테리어 비용 계산까지 제공합니다.

## 주요 서비스
- **갤러리** (/gallery): 업종별 인테리어 시공 사례 및 포트폴리오
- **노하우** (/knowhow): 창업 인테리어 실전 팁 (소재 선택, 동선 설계, 조명)
- **시공사** (/contractors): 검증된 인테리어 시공사 목록 및 리뷰
- **단가 계산기** (/calculator): 면적·업종·마감재 기준 예상 공사비 계산
- **인사이트** (/insights): 트렌드 분석, 업종별 인테리어 가이드
- **견적 요청** (/quote): 무료 견적 신청

## 핵심 지식

### 업종별 인테리어 평균 비용 (2024 기준)
- **카페**: 평당 200~350만원 (에스프레소바 설비 포함)
- **치킨·배달 전문**: 평당 80~150만원 (배달 최적화 단순 설계)
- **한식당**: 평당 120~200만원 (주방 환기·배관 비중 높음)
- **편의점**: 평당 80~130만원 (본사 가이드 준수 필수)
- **스터디카페**: 평당 120~180만원 (방음·전기 용량 중요)

### 인테리어 공사 단계
1. 기획·설계 (도면 작성, 인허가 확인) — 2~3주
2. 철거·기초공사
3. 전기·배관·설비
4. 바닥·벽·천장 마감
5. 가구·집기·조명 설치
6. 간판·외부 사인물
7. 준공 검사 및 오픈 청소

### 시공사 선택 체크리스트
- 같은 업종 시공 경험 보유 여부
- 계약서에 공사 범위·기간·보증 명확히 명시
- 하자보수 기간 및 조건 확인 (최소 1년)
- 업면허·보험 가입 여부

### 비용 절감 팁
- 기존 인테리어 최대 활용 (철거 비용 절감)
- 본사 지정 시공사 vs 자체 수급 견적 비교 필수
- 공사 시기: 비수기(1~2월, 7~8월)에 시공하면 10~15% 절감 가능

## 답변 방식
- 실용적이고 구체적인 정보 제공
- 예산 범위별 현실적인 조언
- 관련 페이지(/calculator, /contractors) 안내
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
