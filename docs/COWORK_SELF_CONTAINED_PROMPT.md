# Cowork 자기완결 프롬프트 (폴더 연결 전에도 작동)

Cowork이 외부 파일 못 읽는 상태에서도 그대로 동작하는 단일 프롬프트.
아래 코드 블록 전체를 복사 → Cowork 첫 메시지에 붙여넣으면 끝.

---

## 📋 복붙 프롬프트 (전체 복사)

```
amakers 프로젝트의 외부 API endpoint 자동 수집·등록 작업이야.
폴더 연결 전이라도 이 메시지에 모든 지시가 들어있으니 바로 시작 가능해.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 프로젝트 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

경로: D:\Users\help\Projects\Franchise

작업이 시작되면 운영자(나)에게 이 폴더를 연결해달라고 요청해줘
(Step 3에서 처음 필요해짐). 그 전까지는 브라우저 작업만 진행 가능.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 작업 한 줄 요약
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

data.go.kr 마이페이지에서 내가 활용신청 완료한 API 115개의 endpoint URL을
자동 수집해서 프로젝트의 registry.ts 3개 파일에 등록하기.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 보안 규칙 (절대 준수)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. "일반 인증키 (Encoding/Decoding)" 필드는 절대 보지/복사하지 마.
   화면에 보여도 무시. 키는 내가 직접 .env에 넣을 거야.
2. 너는 데이터명 + End Point URL + 데이터포맷 3가지만 다룬다.
3. 키를 채팅·로그·git에 노출하면 즉시 작업 중단 + 나에게 보고.
4. registry.ts 파일 수정 시 키 관련 라인은 절대 추가하지 마.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 단계별 작업 절차
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Step 0: 운영자에게 한 번 확인

다음 3가지만 물어봐:
- "data.go.kr에 로그인되어 있나요?" (마이페이지 진입 가능 여부)
- "활용신청 115개 중 '승인' 상태가 대략 몇 개?"
- "분류 보류된 API는 별도 목록으로 정리하면 되나요?"

OK면 바로 Step 1.

### Step 1: data.go.kr 마이페이지 진입

URL: https://www.data.go.kr/iim/api/selectAcountList.do

페이지 구조 (활용신청 현황):
- 표 형태로 각 행에 [데이터명] [신청유형] [처리상태] [신청일]
- "처리상태"가 "승인"인 것만 대상
- 행을 클릭하면 "개발계정 상세보기" 페이지로 이동

⚠️ 로그인 페이지가 뜨면 즉시 중단 + 운영자에게 로그인 요청.

### Step 2: 각 API 상세 페이지 순회

상세 페이지 (개발계정 상세보기) 에서 추출:

| 필드 | 위치 | 예시 |
|---|---|---|
| 데이터명 | "기본정보" 섹션 첫 행 | "공정거래위원회_가맹정보_업종별 브랜드변동현황 제공 서비스" |
| End Point | "서비스정보" 섹션 | "https://apis.data.go.kr/1130000/FftcIndutyBrandStatsService" |
| 데이터포맷 | "서비스정보" 섹션 | "JSON+XML" |
| 처리상태 | "기본정보" 섹션 | "승인" / "심의대기" / "반려" |

⛔ "일반 인증키" 필드는 절대 스크롤·복사·읽기 금지.

각 페이지를 순회하면서 다음 형식으로 메모리에 모음:

```
{
  dataName: "...",
  endpoint: "...",
  format: "JSON" | "XML" | "JSON+XML"
}
```

115개 모두 순회. 페이지네이션 있으면 다음 페이지로 자동 이동.

### Step 3: 운영자에게 폴더 연결 요청

수집 완료되면 운영자에게:

"endpoint 수집 끝났어. registry.ts 파일을 수정하려면 프로젝트 폴더
연결이 필요해. D:\Users\help\Projects\Franchise 폴더 연결해줘."

폴더 연결되면 Step 4로.

### Step 4: 카테고리별 자동 분류

수집한 데이터를 다음 규칙으로 분류:

【pchahub】 = 가맹·공정거래위원회
키워드: "가맹", "공정거래위원회_가맹", "정보공개서", "페어데이터_브랜드"

【themyungdang】 = 부동산·실거래·상권
키워드: "부동산", "실거래", "한국부동산원", "국토교통부_상업", "상권"

【bestplace】 = 소상공인·매장
키워드: "소상공인", "상가", "KOSIS", "사업자등록"

【other】 = 위 3개 안 걸리는 것
→ 별도 목록으로 보고 (운영자가 검토할 수 있게)

### Step 5: registry.ts 파일 위치

폴더 연결되었으면 다음 3개 파일이 있을 거야:

1. apps/pchahub/lib/kftc/registry.ts
2. apps/themyungdang/lib/external/registry.ts
3. apps/bestplace/lib/external/registry.ts

각 파일에 `export const ENDPOINTS: ExternalEndpointDef[] = [...]` 배열이 있고
각 entry는 다음 형태:

```typescript
{
  key: 'BrandList',                           // 식별자
  dataName: '공정거래위원회_가맹정보_브랜드 목록 ...',
  endpoint: 'https://apis.data.go.kr/...',
  format: 'JSON',
  priority: 'critical',
  fillsMockFields: [...],
  status: 'pending-endpoint',                 // ← 'configured'로 변경
}
```

### Step 6: registry key 매핑 표

수집한 데이터명을 사이트별 key에 매칭:

【pchahub key 매핑】

| 데이터명 키워드 | key |
|---|---|
| "정보공개서_목록" | DisclosureList |
| "정보공개서_본문" | DisclosureContent |
| "정보공개서_목차" | (새 key: DisclosureTOC 추가) |
| "페어데이터_브랜드별 가맹점/직영점" | BrandStoreStats |
| "브랜드 목록 정보 제공" | BrandList |
| "가맹본부 일반 정보 상세" | HqInfo |
| "가맹본부 등록 목록" | HqRegistrations |
| "가맹본부 재무정보" | (새 key: HqFinance 추가) |
| "업종별 브랜드변동현황" | IndutyBrandStats |
| "지역별 업종별 평균 매출액" | (새 key: AvgSaleByRegion 추가) |

【themyungdang key 매핑】

| 데이터명 키워드 | key |
|---|---|
| "한국부동산원" + "임대" | RebRentStats |
| "한국부동산원" + "매매" | RebSaleStats |
| "국토교통부_상업업무용부동산_실거래" | MoltRtmsCommercial |
| "국토교통부_아파트매매_실거래" | MoltApRtmsTrade |
| "소상공인" + "상권정보" | SosanginCommerce |
| "소상공인" + "상가" | SosanginStores |

【bestplace key 매핑】

| 데이터명 키워드 | key |
|---|---|
| "소상공인" + "상가(상권)정보" | SosanginStoreList |
| "소상공인" + "상권" | SosanginCommerceArea |
| "KOSIS" | StatKosisPopulation |
| "사업자등록정보" + "진위" | BizRegLookup |

### Step 7: 파일 수정 규칙

기존 entry가 있으면:
- `endpoint` 필드를 수집한 URL로 교체
- `status: 'pending-endpoint'` → `status: 'configured'`
- `dataName`은 운영자 표시명으로 정확히 갱신
- 다른 필드는 건드리지 않음

기존 entry가 없으면 (새 key):
- 배열 끝에 새 entry push
- 같은 파일 상단의 `export type XxxEndpointKey = ...` union에도 추가
- priority는 처음엔 'supplementary'로 보수적 시작
- fillsMockFields는 ['TBD'] 로 두고 운영자가 나중에 채울 수 있게

### Step 8: 분류 보류 API 정리

가맹/부동산/소상공인 어디에도 안 맞는 API는 다음 파일을 생성/업데이트:

`docs/external-apis-other.md`

```markdown
# 분류 보류 외부 API (운영자 검토 필요)

자동 분류에서 amakers 3개 핵심 사이트(pchahub/themyungdang/bestplace)에
매칭되지 않은 API들. 운영자가 검토 후 다음 4개 사이트로 배정 가능:
gongganhansu / themanual / jangsanote / changupdocu / openrun / pchabridge

## 후보

| 데이터명 | endpoint | 포맷 | 추정 매핑 |
|---|---|---|---|
| 데이터명1 | URL | JSON | gongganhansu? |
| ... | ... | ... | ... |
```

### Step 9: 검증

다음 명령들을 실행:

```bash
# 1. 9 사이트 200 응답 확인
cd D:/Users/help/Projects/Franchise
for port in 3000 3001 3002 3003 3004 3005 3006 3007 3008; do
  curl -s -o /dev/null -w "%{http_code} :$port\n" "http://localhost:$port/"
done

# dev 서버가 안 떠 있으면:
export PATH="/d/Users/help/Projects/Franchise/.tools/node-v22.12.0-win-x64:/d/Users/help/Projects/Franchise/.tools/pnpm:$PATH"
for app in pchahub openrun gongganhansu themyungdang themanual jangsanote bestplace changupdocu pchabridge; do
  (cd apps/$app && nohup pnpm dev > /d/Users/help/Projects/Franchise/.tools/dev-$app.log 2>&1 &)
done

# 2. 키 노출 검사 (반드시 0 결과)
git diff --staged | grep -iE "(serviceKey=[a-zA-Z0-9]{20,}|일반 인증키)"

# 3. configured 개수 확인
grep -c "status: 'configured'" apps/pchahub/lib/kftc/registry.ts
grep -c "status: 'configured'" apps/themyungdang/lib/external/registry.ts
grep -c "status: 'configured'" apps/bestplace/lib/external/registry.ts
```

### Step 10: 커밋 + 보고

```bash
git add apps/pchahub/lib/kftc/registry.ts \
        apps/themyungdang/lib/external/registry.ts \
        apps/bestplace/lib/external/registry.ts \
        docs/external-apis-other.md
git commit -m "feat: KFTC/외부 API endpoint 일괄 등록 (N개 configured)"
```

운영자(나)에게 다음 표로 보고:

```
## 작업 결과

### 등록 완료
- pchahub: N개 configured
  · BrandList: https://apis.data.go.kr/...
  · BrandStoreStats: ...
- themyungdang: N개 configured
  · SosanginStores: ...
- bestplace: N개 configured
  · SosanginStoreList: ...

### 분류 보류
- M개 → docs/external-apis-other.md 참고

### 다음 단계
운영자가 .env에 키 입력해야 실 데이터 swap됨:
- apps/pchahub/.env       → KFTC_API_KEY=
- apps/themyungdang/.env  → DATAGO_API_KEY= , REB_API_KEY=
- apps/bestplace/.env     → DATAGO_API_KEY=
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛑 작업 중단 조건
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

다음 상황에서는 작업 멈추고 운영자에게 알림:
1. data.go.kr 로그인 페이지가 보임
2. "일반 인증키"가 의도치 않게 화면에 보임
3. registry.ts 파일 구조가 예상과 다름
4. dev 서버가 다 죽음 (재시작 시도 후 안 되면)
5. 같은 데이터명이 여러 사이트에 매칭됨 (우선순위 판단 필요)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 성공 기준
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- [ ] 115개 중 "승인" 상태 API 모두 데이터명·endpoint·포맷 수집
- [ ] 매칭되는 6~12개가 사이트별 registry.ts에 등록 + status: 'configured'
- [ ] 매칭 안 되는 것은 docs/external-apis-other.md에 정리
- [ ] git diff에 키 노출 0건 (grep 검사 통과)
- [ ] 9사이트 모두 200 응답 유지
- [ ] 커밋 1개로 정리 + 결과 표로 운영자 보고

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

시작해도 되면 Step 0의 질문 3개부터 시작해줘.
```

---

## 사용 방법

1. 위 코드 블록(`amakers 프로젝트의 외부...` 시작 ~ `시작해줘.` 끝)을 통째로 복사
2. Cowork 새 세션 첫 메시지에 그대로 붙여넣기
3. Cowork이 Step 0 질문 (로그인 여부, 승인 개수, 보류 처리 방식) 물어보면 답변
4. Step 3에서 폴더 연결 요청하면 `D:\Users\help\Projects\Franchise` 연결
5. Step 10에서 결과 보고 받고 끝

## Cowork이 외부 파일 못 읽어도 OK인 이유

이 프롬프트는:
- 외부 파일 참조 없음 (모든 매핑 규칙 인라인)
- 폴더 연결은 Step 3에서 처음 필요 (브라우저 작업은 폴더 없이 가능)
- registry.ts 구조도 프롬프트 안에 예시로 있음
- 검증 명령도 모두 인라인

폴더 연결을 미리 해두면 더 좋지만 안 해도 작동.
