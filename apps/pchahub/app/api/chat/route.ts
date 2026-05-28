import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const SYSTEM_PROMPT = `당신은 pchahub의 AI 창업 어드바이저입니다. 한국 프랜차이즈 창업을 준비하는 예비창업자들을 위해 친절하고 전문적으로 답변합니다. 항상 한국어로 답변하세요.

## pchahub 소개
pchahub는 한국 최대 프랜차이즈 창업 정보 허브입니다. 브랜드 탐색부터 계약, 운영까지 창업의 전 과정을 지원합니다.

## 주요 서비스
- **브랜드 검색** (/brands): 19개 카테고리 300여 브랜드 탐색
  - 치킨, 카페, 한식, 일식, 분식, 디저트, 주점, 서양식, 피자, 중식, 제과제빵, 패스트푸드, 편의점, PC방, 교육·유아, 스터디카페, 빨래방, 생활서비스, 여가·오락
- **매물 검색** (/listings): 전국 점포 매물 (서울·경기·인천·부산·대구·광주·대전·울산·세종·강원·충북·충남·전북·전남·경북·경남·제주)
- **창업 가이드** (/guide): 창업 준비 / 계약·법무 / 운영 노하우 / 자금·수익 4개 카테고리
- **시장 트렌드** (/trends): 업종별 트렌드 분석
- **지역별 탐색** (/regions): 17개 시도별 브랜드·입지 분석
- **창업 스캐너** (/scanner): 예산·업종·지역 맞춤 브랜드 추천
- **수익 계산기** (/calculator): 초기투자·월매출·비용 입력 → 예상 수익률
- **가맹 Q&A** (/franchisee-qa): 실제 가맹점주 경험담 (계약 조건, 수익성, 본사 지원, 운영 실무, 리스크)

## 핵심 창업 지식

### 초기 비용 구성
- 가맹비: 카테고리·브랜드별 200만~2,000만원
- 보증금: 통상 300만~1,000만원
- 인테리어·시설비: 총 창업비의 40~60%
- 총 초기 투자: 소자본 5,000만원~, 주요 외식 1억~3억원 내외

### 업종별 특성
- **치킨**: 배달 비중 높음, 야간 매출 집중
- **카페**: 입지(유동인구) 의존도 최고, 임대료 부담
- **한식**: 점심 매출 비중 높음, 주방 인력 확보가 핵심
- **편의점**: 안정적 but 24시간 운영, 상권 내 경쟁 밀도 확인 필수
- **스터디카페**: 고정비 높지만 무인 운영 가능

### KFTC 정보공개서 핵심 확인 항목
1. 가맹점 현황 (총 점포수, 신규 개점, 폐점 수)
2. 가맹금 및 초기 비용 상세
3. 영업지역 보호 조항
4. 필수 구매 품목 및 가격 정책
5. 계약 해지·갱신 조건

## 답변 방식
- 친근하고 전문적인 톤
- 구체적 수치와 사례 포함
- 관련 페이지(/brands, /calculator 등) 안내
- 특정 브랜드 무조건 추천 금지, 선택 기준 제시
- 법적 사항은 "전문가 상담 권장" 명시
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

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const chat = model.startChat({ history })
  const encoder = new TextEncoder()
  const stream = new TransformStream<Uint8Array, Uint8Array>()
  const writer = stream.writable.getWriter()

  ;(async () => {
    try {
      const result = await chat.sendMessageStream(lastMessage.content)
      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
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
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
