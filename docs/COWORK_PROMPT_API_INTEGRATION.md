# Claude Cowork 인계 프롬프트 — amakers 외부 API 통합 작업

이 파일은 Claude Cowork (또는 다른 Claude 인스턴스, 협업자)에게 amakers
프로젝트의 외부 데이터 API 통합 작업을 인계하기 위한 자기완결적 지시서다.
이 파일 하나만 읽고도 작업을 이어갈 수 있도록 모든 컨텍스트가 들어있다.

---

## 🎯 작업 목표

**한 문장**: 운영자가 data.go.kr에서 활용신청한 115개 API 중 amakers 9사이트에
필요한 핵심 6~10개의 endpoint URL을 수집·등록해, mock 데이터에서 실 데이터로
자동 swap되게 만든다.

**완료 기준**:
- `registry.ts`의 핵심 API 5개 이상이 `status: 'configured'`로 전환
- `.env` 파일에 키 설정
- 페이지 호출 시 실제 data.go.kr 응답을 반환 (또는 graceful fallback)
- 9사이트 모두 200 응답 유지

---

## 📂 프로젝트 컨텍스트

- **경로**: `D:\Users\help\Projects\Franchise`
- **구조**: Turborepo + pnpm workspaces (Next.js 14 App Router)
- **9개 사이트**:
  | 사이트 | 포트 | 차별점 | 외부 API 의존도 |
  |---|---|---|---|
  | pchahub | 3000 | 공정위 정보공개서 통합 (가맹 정보) | 🔴 핵심 |
  | openrun | 3001 | 마케팅 에이전시 | 낮음 |
  | gongganhansu | 3002 | 인테리어 시공 매칭 | 낮음 |
  | themyungdang | 3003 | 부동산 매물·실거래·상권 | 🔴 핵심 |
  | themanual | 3004 | 가맹 운영 교육 | 낮음 |
  | jangsanote | 3005 | 자영업 커뮤니티 | 거의 없음 |
  | bestplace | 3006 | 매장 디렉토리·어워드 | 🔴 핵심 |
  | changupdocu | 3007 | 다큐·매거진 | 거의 없음 |
  | pchabridge | 3008 | 본사 투자·M&A | 낮음 |

**amakers vs pchahub 위계** (중요):
- `amakers` = 9개 사이트의 우산 브랜드명
- `pchahub` = 그중 하나. 공정위 가맹정보 5개 API를 통합해 "한 화면에서 모든
  가맹 정보"를 보여주는 게 **pchahub의 차별점**

---

## 🔐 보안 규칙 (필수 준수)

1. **API 키 평문 노출 금지** — 사용자 키를 채팅·로그·git에 남기지 않는다
2. **`.env` 파일은 `.gitignore` 등록되어 있음** — 키는 여기에만 저장
3. **`.env.example`은 자리만, 실제 값 없음** — 이건 git 추적 OK
4. **노출된 키는 즉시 재발급 권장** — data.go.kr 마이페이지에서 한 클릭
5. **외부 호출 시 키 인쇄·로깅 금지** — fetcher는 키를 URL에 한 번만 쓰고 끝

---

## 📋 현재까지 완성된 코드 구조

### 진행도 (2026-05-12 기준)

| 항목 | 상태 |
|---|---|
| 9사이트 빌드·라우팅 완성 | ✅ |
| SEO 메타데이터·OG 이미지·JSON-LD | ✅ |
| 사진·로고·등록 폼 | ✅ |
| 외부 API 어댑터 골격 (3사이트) | ✅ |
| Endpoint URL 수집 + registry 등록 | **← 이번 작업** |
| .env 키 설정 + 실 API swap | **← 이번 작업** |

### 외부 API 어댑터 파일들 (이미 만들어져 있음)

**pchahub** (`apps/pchahub/lib/kftc/`):
- `datago-client.ts` — data.go.kr 표준 envelope 처리
- `client.ts` — franchise.ftc.go.kr 정보공개서 XML 클라이언트
- `json-apis.ts` — 5개 JSON API fetcher
- `types.ts` — XML 응답 타입
- `mapper.ts` — KFTC 응답 → MockBrand/BrandDetail 매핑
- `registry.ts` — 모든 endpoint 등록부 (수정 대상 ⭐)
- `source.ts` — 통합 진입점 (`getBrands`, `getBrandById`, `getCategoryTrends`)
- `README.md`, `HOW_TO_REGISTER_APIS.md` — 가이드

**themyungdang** (`apps/themyungdang/lib/external/`):
- `datago-client.ts` — data.go.kr + REB 표준 클라이언트
- `json-apis.ts` — 국토부 실거래·소상공인 fetcher
- `reb-api.ts` — 한국부동산원 통계 fetcher
- `registry.ts` — endpoint 등록부 (수정 대상 ⭐)
- `source.ts` — 통합 진입점 (`getAreas`, `getListings`, `getRebRentForRegion`)

**bestplace** (`apps/bestplace/lib/external/`):
- `datago-client.ts` — 동일 패턴
- `source.ts` — 소상공인 상가 fetcher + `getStores`
- `registry.ts` — endpoint 등록부 (수정 대상 ⭐)

### 통합 가이드 (이미 작성됨)

- `docs/external-apis.md` — 9사이트 외부 API 매핑 표
- `apps/pchahub/lib/kftc/README.md` — KFTC 5개 API 신청·연결 가이드
- `apps/pchahub/lib/kftc/HOW_TO_REGISTER_APIS.md` — registry.ts 수정 방법

---

## ✅ 단계별 작업 절차

### Step 1: 활용신청 목록에서 endpoint 수집

운영자에게 다음 정보를 한 줄씩 요청 (키는 절대 받지 말 것):

```
이름: <data.go.kr 마이페이지에 표시되는 정확한 데이터명>
URL: <End Point 필드 값, 예: https://apis.data.go.kr/1130000/FftcXxxService>
포맷: <JSON | XML | JSON+XML>
```

운영자가 캡처/스크린샷을 보내면 OCR로 위 3개 필드만 추출. **인증키 부분은
의도적으로 무시**.

**필수 6개 (pchahub + themyungdang + bestplace 핵심)**:

1. 공정거래위원회_페어데이터_브랜드별 가맹점/직영점 집계 + 평균매출
2. 공정거래위원회_가맹정보_브랜드 목록 정보 제공 서비스
3. 공정거래위원회_가맹정보_가맹본부 일반 정보 상세 제공 서비스
4. 국토교통부_상업업무용부동산_실거래가
5. 소상공인시장진흥공단_상가(상권)정보
6. 소상공인시장진흥공단_상권정보

**선택 추가 (pchahub 완성도 ↑)**:

7. 공정거래위원회_가맹정보_가맹본부 등록 목록 정보 제공 서비스
8. 공정거래위원회_가맹정보_가맹본부 재무정보 제공 서비스
9. 공정거래위원회_가맹정보_지역별 업종별 평균 매출액 현황 제공 서비스
10. 한국부동산원_부동산통계 (REB의 SttsApiTbl 외 추가 통계표 ID)

### Step 2: registry.ts에 등록

수집한 URL을 사이트별 registry.ts의 해당 endpoint key에 추가:

**예시 — pchahub/lib/kftc/registry.ts**:

```ts
{
  key: 'BrandList',
  dataName: '공정거래위원회_가맹정보_브랜드 목록 정보 제공 서비스',
  endpoint: 'https://apis.data.go.kr/1130000/<수집한경로>',  // ⭐ 채움
  format: 'JSON',
  priority: 'critical',
  fillsMockFields: [...],
  status: 'configured',  // ⭐ 'pending-endpoint' → 'configured'
}
```

**규칙**:
- 도메인 + path만 적되 쿼리스트링은 제외 (serviceKey/numOfRows는 fetcher가 추가)
- 끝에 슬래시 없이
- status를 반드시 `'configured'`로 바꿔야 source.ts가 호출함

### Step 3: 환경변수 설정

각 사이트의 `.env` 파일 생성 (`.env.example`을 복사해서):

```bash
# apps/pchahub/.env  (gitignored)
NEXTAUTH_SECRET=<운영자에게서 받은 32자 시크릿>
NEXTAUTH_URL=http://localhost:3000
KFTC_API_KEY=<운영자가 알려준 키>

# apps/themyungdang/.env
NEXTAUTH_SECRET=<같은 시크릿>
NEXTAUTH_URL=http://localhost:3003
DATAGO_API_KEY=<같은 키 또는 별도>
REB_API_KEY=<REB는 별도 발급>

# apps/bestplace/.env
NEXTAUTH_SECRET=<같은 시크릿>
NEXTAUTH_URL=http://localhost:3006
DATAGO_API_KEY=<같은 키>
```

**키는 운영자에게서 직접 받지 말 것** — 운영자가 `.env`에 직접 붙여넣게 안내.

### Step 4: XML 파서 추가 (정보공개서 API 사용 시만)

정보공개서(5번) API를 활용하려면:

```bash
cd D:/Users/help/Projects/Franchise
pnpm add -F pchahub fast-xml-parser
```

그리고 `apps/pchahub/lib/kftc/client.ts`의 `parseListXml` / `parseTitleXml` /
`parseContentXml` TODO 3곳을 다음 패턴으로 구현:

```ts
import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: true,
})

function parseListXml(xml: string): KftcDisclosureListResponse {
  const obj = parser.parse(xml)
  const items = obj.response?.body?.items?.item ?? []
  return {
    resultCode: obj.response?.header?.resultCode ?? '00',
    resultMsg: obj.response?.header?.resultMsg ?? 'OK',
    totalCount: obj.response?.body?.totalCount ?? items.length,
    pageNo: obj.response?.body?.pageNo ?? 1,
    numOfRows: obj.response?.body?.numOfRows ?? items.length,
    items: Array.isArray(items) ? items : [items],
  }
}
```

세 함수 모두 동일 패턴. `viewerUrl`은 URL 헬퍼라 파싱 불필요.

### Step 5: 페이지 코드 swap (선택 — source.ts 흐름 활용 시)

페이지에서 mock 직접 import 대신 source.ts 사용:

```ts
// Before
import { BRANDS } from '@/lib/mock-data'
export default function BrandsPage() {
  const brands = BRANDS
  ...
}

// After
import { getBrands } from '@/lib/kftc/source'
export default async function BrandsPage() {
  const brands = await getBrands()  // KFTC_API_KEY 있으면 실 데이터, 없으면 mock
  ...
}
```

**중요**: 페이지를 `async` 함수로 바꿔야 함. server component이므로 가능.

작업 안 해도 mock으로 동작 — 운영자가 원하는 시점에 swap.

### Step 6: 검증

```bash
# 9사이트 200 확인
for port in 3000 3001 3002 3003 3004 3005 3006 3007 3008; do
  curl -s -o /dev/null -w "%{http_code}  :$port\n" "http://localhost:$port/"
done

# 핵심 라우트
for url in \
  "http://localhost:3000/brands" \
  "http://localhost:3000/brands/b1" \
  "http://localhost:3000/categories/cafe" \
  "http://localhost:3003/listings/l001" \
  "http://localhost:3006/stores/s1"; do
  curl -s -o /dev/null -w "%{http_code}  $url\n" --max-time 10 "$url"
done
```

API 키 설정 후 실제 호출 확인:

```bash
# dev 로그에서 "[kftc] ..." 또는 "[themyungdang] ..." 메시지 확인
tail -20 .tools/dev-pchahub.log
```

`mock으로 fallback` 메시지가 없으면 실 API 호출 성공.

---

## 🚨 자주 마주치는 문제 + 해결

### "API 실패: 401" — 인증 실패
- `.env`의 KFTC_API_KEY가 Decoding 키인지 확인
- URL에 `%2B`/`%3D` 같은 인코딩 문자 있으면 Encoding 키를 잘못 쓴 것
- 마이페이지에서 "Decoding 키" 복사

### "API 실패: 500/SERVICE ERROR"
- 활용신청은 했지만 승인 전 (심의대기)
- data.go.kr 마이페이지 → 신청현황에서 상태 확인

### 응답이 와도 우리 페이지에 안 보임
- registry.ts의 status가 'configured' 인지 확인
- source.ts의 fallback이 mock으로 우회하는지 dev 로그 확인
- 응답 필드명이 mapper.ts와 일치하는지 확인 (data.go.kr 명세서 비교)

### 응답 필드명이 mapper와 다름
- mapper.ts의 mergeIntoBrands 등에서 필드 이름을 실제 응답에 맞춤
- 예: `fcStoreCnt` → 실제 `frcsCnt`로 응답이 오면 mapper 수정

---

## 📌 사용자(운영자)에게 받아야 할 것 vs 절대 받지 말 것

**받아야 할 것**:
- ✅ 데이터명 (정확히)
- ✅ End Point URL (도메인 + 경로)
- ✅ 응답 포맷 (JSON / XML / JSON+XML)
- ✅ 활용신청 승인 상태 (승인 / 심의대기 / 반려)

**절대 받지 말 것**:
- ❌ 일반 인증키 (Encoding/Decoding 어느 것이든)
- ❌ 로그인 ID/비밀번호
- ❌ data.go.kr 마이페이지 캡처에 키가 보이면 키 부분만 별도 마스킹 요청

키는 운영자가 직접 `.env`에 입력. 작업자는 endpoint URL만 다룸.

---

## 🎬 시작 명령 (Cowork가 받아 처음 실행할 것)

1. 이 파일 끝까지 읽기
2. `git log --oneline -10` 으로 최근 진행 확인
3. `apps/pchahub/lib/kftc/registry.ts` 열어서 현재 등록 상태 확인
4. 운영자에게 위 Step 1의 정확한 형식으로 endpoint URL 요청
5. 받은 URL을 사이트별 registry.ts에 추가 + status: 'configured'
6. 9사이트 200 확인
7. Step 5의 swap은 운영자 요청 시점에 진행

각 단계마다 사용자에게 진행 상황 보고 + 다음 단계 명확히 안내.

---

## 📝 작업 완료 시 커밋 메시지 템플릿

```
feat: KFTC/외부 API endpoint 등록 (N개 configured)

- pchahub registry.ts: BrandList, BrandStoreStats, HqInfo 등 N개 configured
- themyungdang registry.ts: SosanginCommerce, MoltRtmsCommercial 등 configured
- bestplace registry.ts: SosanginStoreList configured
- .env.example 업데이트 (개발자 안내)

운영자 사이드:
- .env에 KFTC_API_KEY / DATAGO_API_KEY / REB_API_KEY 설정 (gitignored)
- 페이지 코드는 source.ts 진입점만 호출 — mock/실 자동 swap

Co-Authored-By: <cowork 또는 협업자 정보>
```

---

## 🔗 추가 자료 (참고)

- 공공데이터포털: https://www.data.go.kr
- 마이페이지 활용신청 현황: https://www.data.go.kr/iim/api/selectAcountList.do
- 한국부동산원 OpenAPI: https://www.reb.or.kr/r-one/openapi/openApiApply.do
- 공정거래위원회 가맹사업거래정보제공시스템: https://franchise.ftc.go.kr
- 소상공인시장진흥공단 상권정보: https://sg.sbiz.or.kr

---

**이 프롬프트만 읽고 시작 가능. 모르는 게 있으면 운영자에게 질문하고
임의 추측·실험으로 키나 endpoint를 만들지 말 것**. 모든 endpoint URL은
data.go.kr 마이페이지에서 정확히 복사된 값을 사용.
