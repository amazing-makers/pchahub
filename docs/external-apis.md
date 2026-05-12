# amakers 9사이트 외부 API 통합 현황

사용자가 활용신청한 공공데이터포털 + 한국부동산원 API들을 9사이트로
분배하는 안내. 키는 사이트별 `.env`에 저장하며, 같은 data.go.kr 계정의
키는 여러 사이트가 공유 가능.

## 사이트별 외부 데이터 매핑

| 사이트 | 외부 API | 우선순위 | 어댑터 위치 |
|---|---|---|---|
| **pchahub** | 공정거래위원회 가맹정보 5종 (정보공개서·페어데이터·브랜드목록·본부일반·본부등록) | 🔴 핵심 | `apps/pchahub/lib/kftc/` |
| **themyungdang** | 한국부동산원 통계, 국토부 실거래가, 소상공인 상권정보 | 🔴 핵심 | `apps/themyungdang/lib/external/` |
| **bestplace** | 소상공인 상가/상권정보, 통계청 KOSIS, 국세청 사업자번호 | 🔴 핵심 | `apps/bestplace/lib/external/` |
| **gongganhansu** | (TBD) 국토부 건축물대장 — 인테리어 시공 검증 | 🟢 보완 | `apps/gongganhansu/lib/external/` (예정) |
| **themanual** | (TBD) 통계청 자영업 통계 | 🟢 보완 | `apps/themanual/lib/external/` (예정) |
| **jangsanote** | 외부 API 거의 없음 (자체 컨텐츠) | — | — |
| **changupdocu** | (TBD) BIGKINDS 뉴스 검색 | 🟢 보완 | (예정) |
| **openrun** | 네이버/카카오 검색 API (민간, 별도 발급) | 🟡 유용 | (예정) |
| **pchabridge** | (TBD) DART 공시 정보 | 🟡 유용 | (예정) |

## 환경변수 통합 정책

같은 data.go.kr 계정에서 발급된 키는 **하나의 .env 변수**로 9사이트가
공유할 수 있다. 단, 보안상 사이트별로 분리하는 게 안전:

```bash
# 통합 사용 시 (단일 키)
KFTC_API_KEY=xxx       # pchahub
DATAGO_API_KEY=xxx     # themyungdang/bestplace (같은 키)
REB_API_KEY=xxx        # themyungdang (REB는 별도 발급)

# 또는 사이트별로 분리
KFTC_API_KEY=xxx
DATAGO_API_KEY_FOR_THEMYUNGDANG=xxx
DATAGO_API_KEY_FOR_BESTPLACE=xxx
```

## 활용신청한 API 등록 워크플로우

각 사이트의 `lib/{external|kftc}/registry.ts`에 추가하는 형식:

```ts
{
  key: 'SosanginStoreList',
  dataName: '소상공인시장진흥공단_상가(상권)정보',
  endpoint: 'https://apis.data.go.kr/...',  // ← 사용자가 알려주는 부분
  format: 'JSON',
  priority: 'critical',
  fillsFields: ['MockStore 1차 디렉토리'],
  status: 'configured',  // ← endpoint 받으면 'pending-endpoint' → 'configured'로 변경
}
```

## 다음 작업

활용신청한 115개 중 위 매핑 표에 해당하는 핵심 30~40개의 endpoint URL을
받으면 즉시 registry.ts에 등록 + fetcher 작성 → 자동으로 mock에서 실
데이터로 swap.

사용자가 마이페이지에서 데이터명 + endpoint URL을 한 줄씩 알려주면 됨.
키는 절대 채팅에 노출하지 말 것 (보안).
