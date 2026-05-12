# 공정거래위원회 가맹사업거래 API 연동

**pchahub의 핵심 차별점은 "공정위 5개 API를 통합해 한 화면에서 모든 가맹
정보를 보여주는 것"** — 이를 위한 어댑터 레이어. 키만 받으면
`lib/mock-data.ts` 대신 실 API가 자동으로 동작한다.

다른 amakers 사이트들은 각자 1차 데이터 소스가 다르다 (themyungdang은
부동산, bestplace는 매장 검색 API 등). KFTC API는 **pchahub 전용**이다.

## 1. 키 발급

공공데이터포털(https://www.data.go.kr)에서 아래 **5개 API 모두 활용신청**.
"다양한 가맹 정보를 한 화면에" 보여주는 게 pchahub 핵심 가치라 5개 다
받는 게 맞다.

### 키 종류 선택

신청 페이지에서 "개인 서비스키" / "프로젝트 서비스키" 둘 다 가능하다.
- **개인 서비스키**: 즉시 자동 발급. 1인 운영자에게 적합. 일일 호출 한도 동일.
- **프로젝트 서비스키**: 일부 API는 사업자 인증 필요. 팀 공유시.
- 호출 동작은 **완전히 동일** — 키 발급 정책만 다름.

공정위 가맹 API는 대부분 개인 서비스키만 발급되므로 그대로 사용하면 된다.
마이페이지에서 발급되는 키 중 **Decoding 키**를 복사해서 `.env`에 넣는다.

### 신청 권장 순서 (가장 깔끔한 → 가장 무거운)

| # | API | 포맷 | 채워주는 mock 구조 | 대체 가능성 |
|---|---|---|---|---|
| 1 | **페어데이터** — 브랜드별 가맹점/직영점 집계 + 평균매출 | JSON | `MockBrand.storeCount/growthRate` + `BrandRevenue` + `BrandStoreHistory` | ❌ 정제된 학습데이터 — 다른 API로 재현 어려움 |
| 2 | **브랜드 목록** 정보 제공 | JSON | `MockBrand` 기본 (이름/카테고리) | △ 정보공개서 list로 가능하지만 무거움 |
| 3 | **본부 일반 정보** 상세 제공 | JSON | `BrandHQ` (회사명/대표/주소) | △ 정보공개서 본문에 있지만 raw XML 파싱 필요 |
| 4 | **본부 등록 목록** 정보 제공 | JSON | `BrandHQ.bizNumber` (사업자·법인등록번호) | △ 정보공개서 본문에 있지만 raw XML 파싱 필요 |
| 5 | **정보공개서 목록/목차/본문** 조회 (1세트) | XML | `BrandCosts` + `BrandDisclosureExtras` (가맹비/보증금/계약조건) | ❌ 가맹비·보증금·계약조건 원본은 여기만 |

**최소 동작 vs 완전 통합**:
- 최소 (1+5만) → 디렉토리 + 핵심 디테일. pchahub 동작은 함.
- **5개 전체 → pchahub 차별점 (= 통합 정보 한 화면) 완성**.

### 활용신청 작성 팁

활용 사례 칸에 아래 문장을 5번 동일하게 사용 (복붙):

> 한국 프랜차이즈 가맹 정보를 검색·비교할 수 있는 일반 사용자용 웹 서비스
> (프차허브 pchahub.kr). 공정거래위원회 정보공개서를 통합해 가맹 본부
> 검색, 카테고리/지역 필터, 가맹점 현황(평균 매출/매장 수/연차별 변화)
> 시각화, 본사–예비 가맹점주 매칭 기능 제공. 일일 예상 호출량: 브랜드
> 목록 5,000건 / 매장 현황 3,000건 / 정보공개서 본문 1,000건.

신청 후 **즉시 자동 발급**. 발급된 키 1개로 5개 모두 호출 가능.

## 2. 키 설정

```bash
# apps/pchahub/.env
KFTC_API_KEY=발급받은_키
```

키가 설정되면 `lib/kftc/source.ts`의 `getBrands()`, `getBrandById()`가
자동으로 실 API를 사용한다. 키가 없으면 mock 데이터를 그대로 쓴다 — 개발
환경에서 키 없이도 화면이 깨지지 않는다.

## 3. 정보공개서 API (5번)의 4개 엔드포인트 호출 흐름

5번 API는 한 번 신청으로 4개 엔드포인트를 사용:

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

1. `pnpm add fast-xml-parser` — KFTC 5번이 XML 응답이라 파서 필요
2. `lib/kftc/client.ts` 의 `parseListXml` / `parseTitleXml` / `parseContentXml`
   TODO 구현 (10분 작업)
3. JSON API 4개(브랜드 목록·페어데이터·본부 일반정보·본부 등록목록)도 동일
   패턴으로 `lib/kftc/json-apis.ts` 추가
4. `app/brands/page.tsx` 가 `BRANDS` 대신 `await getBrands()` 사용하도록 변경
5. `app/brands/[id]/page.tsx` 가 `getBrandDetail()` 대신
   `await getBrandById(id)` 사용하도록 변경

## 5. 도메인 주의

정보공개서 API(5번)는 공정위 직접 도메인:

```
https://franchise.ftc.go.kr/api/search.do?type=list&yr=2025&serviceKey=...
https://franchise.ftc.go.kr/api/search.do?type=title&jngIfrmpSn=...&serviceKey=...
https://franchise.ftc.go.kr/api/search.do?type=content&jngIfrmpSn=...&serviceKey=...
https://franchise.ftc.go.kr/api/viewer.do?jngIfrmpSn=...&serviceKey=...
```

JSON API 4개(1~4번)는 공공데이터포털 공통 도메인:
`https://apis.data.go.kr/1130000/...` 형태로 호출.
