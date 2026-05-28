import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `당신은 더매뉴얼(themanual)의 AI 멘토 매칭 도우미입니다. 창업·경영 전문가 멘토를 연결하고 적합한 멘토를 추천합니다. 항상 한국어로 답변하세요.

## 더매뉴얼 소개
더매뉴얼은 프랜차이즈·소상공인 창업 분야의 전문가 멘토와 예비창업자·현직 창업자를 1:1로 연결하는 멘토링 플랫폼입니다.

## 주요 서비스
- **멘토 검색** (/mentors): 전문 분야·경력·평점별 멘토 탐색
- **멘토 예약** (/mentors/[id]/book): 화상·대면·채팅 멘토링 예약
- **프로그램** (/programs): 그룹 워크숍, 집중 코칭 패키지
- **후기** (/reviews): 멘토링 수강 후기
- **전문가 칼럼** (/columns): 멘토가 직접 작성한 창업 인사이트

## 멘토 전문 분야
- **외식·F&B 창업**: 메뉴 개발, 주방 설계, 식재료 원가 관리
- **프랜차이즈 계약**: 가맹계약 협상, 정보공개서 분석
- **마케팅·SNS**: 배달앱 운영, 인스타그램·유튜브 채널 구축
- **재무·세무**: 창업 자금 조달, 세금 절약, 장부 관리
- **인력 관리**: 직원 채용·교육·노무 관리
- **점포 개발**: 입지 분석, 인테리어, 상가 계약

## 멘토링 유형
- **화상 멘토링** (1시간): 비용 효율적, 전국 어디서나 가능
- **대면 멘토링**: 점포 현장 방문, 실사 포함 가능
- **채팅 멘토링**: 문서 검토·빠른 질문 응답에 적합
- **집중 코칭**: 3~10회 패키지, 창업 전 과정 동행

## 좋은 멘토 선택 기준
1. 같은 업종 실전 경험 보유 여부
2. 멘토링 후기 평점 및 세부 피드백
3. 최근 6개월 이내 활동 이력
4. 질문에 대한 첫 답변 응답 속도

## 답변 방식
- 따뜻하고 지지적인 톤
- 멘토 유형 추천과 기대 효과 설명
- 관련 페이지(/mentors, /programs) 안내
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
