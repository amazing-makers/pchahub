# 공정거래위원회 가맹사업거래 API 연동

pchahub의 브랜드·정보공개서 데이터를 mock에서 실 데이터로 교체하기 위한
어댑터 레이어. 키만 받으면 `lib/mock-data.ts` 대신 실 API가 자동으로
동작한다.

## 1. 키 발급 (5개 API 일괄 신청)

공공데이터포털(https://www.data.go.kr)에서 아래 **5개 API 모두 활용신청**.
모두 **프로젝트 서비스키**로 신청하면 동일한 키 한 개가 발급된다.

| # | API | 포맷 | 채워주는 mock 구조 |
|---|---|---|---|
| 1 | 공정거래위원회_가맹정보_**브랜드 목록 정보** 제공 | JSON | `MockBrand` 기본 (이름/카테고리/로고색) |
| 2 | 공정거래위원회_페어데이터_**브랜드별 가맹점/직영점 집계 및 평균매출** | JSON | `MockBrand.storeCount/growthRate` + `BrandRevenue` + `BrandStoreHistory` |
| 3 | 공정거래위원회_가맹정보_**가맹본부 일반 정보 상세** 제공 | JSON | `BrandHQ` (회사명/대표/주소) |
| 4 | 공정거래위원회_가맹정보_**가맹본부 등록 목록 정보** 제공 | JSON | `BrandHQ.bizNumber` (사업자번호·법인등록번호) |
| 5 | 공정거래위원회_가맹정보_**정보공개서 목록/목차/본문** 조회 (1세트) | XML | `BrandCosts` + `BrandDisclosureExtras` (가맹비/보증금/계약조건) |

### 활용신청 작성 팁

활용 사례 칸에 아래 문장을 5번 동일하게 사용 (복붙):

> 한국 프랜차이즈 가맹 정보를 검색·비교할 수 있는 일반 사용자용 웹 서비스
> (amakers/pchahub). 공정거래위원회 정보공개서를 1차 데이터로 가맹 본부
> 검색, 카테고리/지역 필터, 가맹점 현황(평균 매출/매장 수/연차별 변화)
> 시각화, 본사–예비 가맹점주 매칭 기능 제공. 일일 예상 호출량: 브랜드
> 목록 5,000건 / 매장 현황 3,000건 / 정보공개서 본문 1,000건.

신청 후 **즉시 자동 발급**. 발급된 키 1개로 5개 모두 호출 가능.

## 2. 키 설정

```bash
# apps/pchahub/.env
KFTC_API_KEY=발급받은_프로젝트_서비스키
```

키가 설정되면 `lib/kftc/source.ts`의 `getBrands()`, `getBrandById()`가
자동으로 실 API를 사용한다. 키가 없으면 mock 데이터를 그대로 쓴다 — 개발
환경에서 키 없이도 화면이 깨지지 않는다.

## 3. 4개 엔드포인트 호출 흐름

정보공개서 API(#5)는 4개 엔드포인트가 1세트:

```
┌─────────────────────────────────────────────────┐
│  매년 1월 type=list&yr=2025 호출 (진입점)         │
│  → 그 해 등록된 모든 정보공개서의 jngIfrmpSn 목록   │
└────────────────┬────────────────────────────────┘
                 │
                 │ 각 일련번호로 ↓
                 │
       ┌─────────┴─────────┬───────────────┐
       │                   │               │
type=title           type=content      viewer.do
(목차 — 본문         (본문 — 가맹비    (정보공개서
 호출 전 구조 확인)   보증금 등 핵심    PDF 뷰어 페이지
                     데이터 모두)      외부 링크용)
```

- `lib/kftc/client.ts` 의 `listDisclosures(yr)`, `getDisclosureTOC(sn)`,
  `getDisclosureContent(sn)` 함수가 위 흐름을 그대로 노출.
- 모든 응답은 fetch의 `next.revalidate: 86_400`으로 24시간 캐시 (분기 갱신
  데이터라 충분).

## 4. 남은 작업 (키 받은 후)

1. `pnpm add fast-xml-parser` — KFTC가 XML 응답이므로 파서 필요
2. `lib/kftc/client.ts` 의 `parseListXml` / `parseTitleXml` / `parseContentXml`
   TODO 구현 (10분 작업)
3. `app/brands/page.tsx` 가 `BRANDS` 대신 `await getBrands()` 사용하도록 변경
4. `app/brands/[id]/page.tsx` 가 `getBrandDetail()` 대신
   `await getBrandById(id)` 사용하도록 변경
5. JSON API 4개(브랜드 목록·페어데이터·본부 일반정보·본부 등록목록)도 동일
   패턴으로 `lib/kftc/*` 아래 추가

## 5. 도메인 주의

정보공개서 API는 공공데이터포털(`apis.data.go.kr`)이 아니라 공정위 직접
도메인을 호출한다:

```
https://franchise.ftc.go.kr/api/search.do?type=list&yr=2025&serviceKey=...
https://franchise.ftc.go.kr/api/search.do?type=title&jngIfrmpSn=...&serviceKey=...
https://franchise.ftc.go.kr/api/search.do?type=content&jngIfrmpSn=...&serviceKey=...
https://franchise.ftc.go.kr/api/viewer.do?jngIfrmpSn=...&serviceKey=...
```

JSON API 4개는 `https://apis.data.go.kr/...` 호출.
