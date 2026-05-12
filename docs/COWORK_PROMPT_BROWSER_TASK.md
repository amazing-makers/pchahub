# Claude Cowork 작업 지시 — data.go.kr API endpoint 자동 수집·등록

운영자가 Cowork(브라우저 조작 가능한 Claude) 첫 메시지로 이 파일 전체 또는
"복붙용 프롬프트" 섹션을 그대로 붙여넣으면 자동으로 작업이 시작됩니다.

---

## 🚀 복붙용 프롬프트 (Cowork 첫 메시지)

```
amakers 프로젝트의 외부 API endpoint를 자동 수집·등록하는 작업이야.

너는 브라우저로 data.go.kr 마이페이지에 접속해서:
1. 내가 활용신청 완료한 API 115개의 endpoint URL을 자동 수집
2. 가맹/부동산/소상공인 카테고리별로 분류
3. 우리 프로젝트의 registry.ts 파일에 자동 등록
4. 9개 dev 서버 200 응답 유지 확인
5. 작업 결과를 표로 보고

까지 진행해줘.

⚠️ 보안 규칙 (절대 준수):
- "일반 인증키 (Encoding/Decoding)" 필드는 절대 보지도/복사하지도 말 것
- 키가 화면에 보여도 무시 — 운영자가 .env에 직접 입력
- 너는 endpoint URL과 데이터명만 다룬다
- 키를 채팅·로그·git에 노출하면 즉시 작업 중단

전체 지시·파일 경로·매핑 규칙·검증 방법은 다음 파일에:
  D:/Users/help/Projects/Franchise/docs/COWORK_PROMPT_BROWSER_TASK.md

이 파일의 "Cowork 단계별 작업 절차" 섹션부터 읽고 시작해줘.
운영자가 미리 data.go.kr에 로그인해뒀어. 바로 마이페이지 접속 가능.
```

---

## 📍 Cowork 단계별 작업 절차

### Step 0: 사전 확인

```bash
# 프로젝트 경로 확인
cd D:/Users/help/Projects/Franchise

# 최근 진행 확인
git log --oneline -10

# 현재 endpoint 등록 상태 확인
cat apps/pchahub/lib/kftc/registry.ts | grep -A 1 'status:'
cat apps/themyungdang/lib/external/registry.ts | grep -A 1 'status:'
cat apps/bestplace/lib/external/registry.ts | grep -A 1 'status:'

# dev 서버 9개 모두 실행 중인지
for port in 3000 3001 3002 3003 3004 3005 3006 3007 3008; do
  curl -s -o /dev/null -w "%{http_code} :$port\n" "http://localhost:$port/"
done
```

dev 서버가 안 떠 있으면 운영자에게 부탁하거나 직접 띄움:

```bash
export PATH="/d/Users/help/Projects/Franchise/.tools/node-v22.12.0-win-x64:/d/Users/help/Projects/Franchise/.tools/pnpm:$PATH"
cd /d/Users/help/Projects/Franchise
for app in pchahub openrun gongganhansu themyungdang themanual jangsanote bestplace changupdocu pchabridge; do
  (cd apps/$app && nohup pnpm dev > /d/Users/help/Projects/Franchise/.tools/dev-$app.log 2>&1 &)
done
```

### Step 1: 브라우저로 활용신청 목록 진입

1. 브라우저로 접속: https://www.data.go.kr/iim/api/selectAcountList.do
2. **로그인 페이지가 뜨면** 운영자에게 알리고 중단 (로그인은 운영자가 직접)
3. 로그인된 상태면 활용신청 목록이 표 형태로 보임

페이지 구조:
- 각 행에 "데이터명", "신청유형", "처리상태(승인/심의대기/반려)", "신청일"
- "상세보기" 또는 데이터명 클릭 시 → 개발계정 상세보기 페이지로 이동

### Step 2: 각 API의 상세 페이지 순회

전체 페이지에서 **상태가 "승인"인 항목만** 클릭. 페이지 이동 시:

```
URL: https://www.data.go.kr/iim/api/selectAPIAcountView.do?publicDataPk=XXXXX&publicDataDetailPk=...
```

상세 페이지에서 추출할 정보:

| 필드 | 추출 방식 |
|---|---|
| **데이터명** | "기본정보" 섹션의 `데이터명` 행 값 |
| **End Point URL** | "서비스정보" 섹션의 `End Point` 행 값 |
| **데이터포맷** | "서비스정보" 섹션의 `데이터포맷` 행 값 (JSON / XML / JSON+XML) |
| 활용기간 | "기본정보" 섹션의 `활용기간` 행 |
| 처리상태 | "기본정보" 섹션의 `처리상태` 행 (승인만 추출) |

**⛔ 절대 복사 금지**:
- "일반 인증키" 필드 (Encoding 키, Decoding 키 둘 다)
- 키는 화면에 있어도 무시. selector로도 그 필드는 건드리지 않음

### Step 3: 데이터를 임시 표로 정리

각 API에 대해 다음 JSON 형태로 모음 (메모리 내부):

```json
{
  "dataName": "공정거래위원회_가맹정보_브랜드 목록 정보 제공 서비스",
  "endpoint": "https://apis.data.go.kr/1130000/FftcBrandService",
  "format": "JSON+XML",
  "status": "승인"
}
```

115개 다 수집할 때까지 페이지를 순회.

### Step 4: 카테고리별 자동 분류

데이터명의 키워드로 분류:

```typescript
function classify(dataName: string): 'pchahub' | 'themyungdang' | 'bestplace' | 'other' {
  // pchahub: 가맹·공정거래위원회
  if (
    dataName.includes('가맹') ||
    dataName.includes('공정거래위원회_가맹') ||
    dataName.includes('정보공개서') ||
    dataName.includes('페어데이터_브랜드')
  ) return 'pchahub'

  // themyungdang: 부동산·실거래·REB
  if (
    dataName.includes('부동산') ||
    dataName.includes('실거래') ||
    dataName.includes('한국부동산원') ||
    dataName.includes('국토교통부_상업') ||
    dataName.includes('상권')
  ) return 'themyungdang'

  // bestplace: 소상공인·상가
  if (
    dataName.includes('소상공인') ||
    dataName.includes('상가') ||
    dataName.includes('KOSIS') ||
    dataName.includes('사업자등록')
  ) return 'bestplace'

  return 'other'
}
```

### Step 5: 사이트별 registry.ts 자동 업데이트

각 사이트별 registry.ts에 매칭되는 endpoint를 채워 넣음.

**파일 위치 + key 매핑 표**:

| 분류 | registry 파일 | key 매핑 규칙 |
|---|---|---|
| pchahub | `apps/pchahub/lib/kftc/registry.ts` | 아래 매핑 표 참고 |
| themyungdang | `apps/themyungdang/lib/external/registry.ts` | 아래 매핑 표 참고 |
| bestplace | `apps/bestplace/lib/external/registry.ts` | 아래 매핑 표 참고 |
| other | `docs/external-apis-other.md` (생성) | 별도 보류 목록 |

**pchahub key 매핑** (데이터명 키워드 → registry key):

| 데이터명 키워드 | registry key |
|---|---|
| "정보공개서_목록" | DisclosureList |
| "정보공개서_본문" | DisclosureContent |
| "페어데이터_브랜드별 가맹점/직영점" | BrandStoreStats |
| "브랜드 목록 정보 제공" | BrandList |
| "가맹본부 일반 정보 상세" | HqInfo |
| "가맹본부 등록 목록" | HqRegistrations |
| "업종별 브랜드변동현황" | IndutyBrandStats |

**themyungdang key 매핑**:

| 데이터명 키워드 | registry key |
|---|---|
| "한국부동산원" + "임대" | RebRentStats |
| "한국부동산원" + "매매" | RebSaleStats |
| "국토교통부_상업업무용부동산_실거래" | MoltRtmsCommercial |
| "국토교통부_아파트매매_실거래" | MoltApRtmsTrade |
| "소상공인" + "상권정보" | SosanginCommerce |
| "소상공인" + "상가" | SosanginStores |

**bestplace key 매핑**:

| 데이터명 키워드 | registry key |
|---|---|
| "소상공인" + "상가(상권)정보" | SosanginStoreList |
| "소상공인" + "상권" | SosanginCommerceArea |
| "KOSIS" | StatKosisPopulation |
| "사업자등록정보" + "진위" | BizRegLookup |

### Step 6: registry.ts 파일 수정

기존 entry의 다음 필드만 업데이트:

```ts
{
  key: 'BrandList',
  dataName: '<운영자 표시명에 가깝게 갱신>',
  endpoint: '<수집한 URL>',  // ⭐ 갱신
  format: 'JSON',
  priority: 'critical',
  fillsMockFields: [...],
  status: 'configured',  // ⭐ 'pending-endpoint' → 'configured'
}
```

매칭되는 key가 **registry에 없는** 새 데이터는 `ENDPOINTS` 배열 끝에 push:

```ts
{
  key: 'NewKey',  // ⭐ 적절한 PascalCase 이름 지정
  dataName: '<수집한 데이터명>',
  endpoint: '<수집한 URL>',
  format: '<JSON | XML | JSON+XML>',
  priority: 'supplementary',  // 처음엔 보수적으로
  fillsMockFields: ['TBD — mapper에서 연결 필요'],
  status: 'configured',
}
```

새 key를 추가할 때는 union 타입에도 추가:

```ts
export type KftcEndpointKey =
  | 'IndutyBrandStats'
  | 'BrandList'
  | 'NewKey'  // ⭐ 추가
  | ...
```

### Step 7: 분류되지 않은 (other) API 별도 보고

`docs/external-apis-other.md` 파일을 생성/업데이트:

```markdown
# 분류되지 않은 외부 API (115개 중 가맹/부동산/소상공인 외)

운영자 검토 후 적절한 사이트로 배정 필요.

## 후보

| 데이터명 | endpoint | 포맷 | 추정 매핑 |
|---|---|---|---|
| ... | ... | ... | ... |
```

### Step 8: 검증

```bash
# 1. 9 사이트 200 확인
for port in 3000 3001 3002 3003 3004 3005 3006 3007 3008; do
  curl -s -o /dev/null -w "%{http_code}  :$port\n" "http://localhost:$port/"
done

# 2. 키 노출 검사 (절대 노출 0 확인)
git diff --staged | grep -iE "(serviceKey=[a-zA-Z0-9]{20,}|일반 인증키)" && echo "❌ KEY LEAKED" || echo "✅ no key in diff"

# 3. registry 상태 요약
grep -c "status: 'configured'" apps/pchahub/lib/kftc/registry.ts
grep -c "status: 'configured'" apps/themyungdang/lib/external/registry.ts
grep -c "status: 'configured'" apps/bestplace/lib/external/registry.ts
```

### Step 9: 커밋 + 결과 보고

```bash
git add apps/pchahub/lib/kftc/registry.ts \
        apps/themyungdang/lib/external/registry.ts \
        apps/bestplace/lib/external/registry.ts \
        docs/external-apis-other.md
git commit -m "feat: KFTC/외부 API endpoint 일괄 등록 (N개 configured)"
```

운영자에게 다음 표로 결과 보고:

```
## 작업 결과

### 등록 완료
- pchahub:      N개 configured (예: BrandList, BrandStoreStats, ...)
- themyungdang: N개 configured (예: SosanginStores, MoltRtmsCommercial, ...)
- bestplace:    N개 configured (예: SosanginStoreList, ...)

### 분류 보류
- 가맹/부동산/소상공인 외 M개 → docs/external-apis-other.md 참고

### 다음 단계
- 운영자가 각 사이트 .env에 키 입력:
  - apps/pchahub/.env       → KFTC_API_KEY=
  - apps/themyungdang/.env  → DATAGO_API_KEY= / REB_API_KEY=
  - apps/bestplace/.env     → DATAGO_API_KEY=
- 첫 실 API 호출 검증: curl localhost:3000/brands → mock 아닌 KFTC 데이터 표시
```

---

## 🛑 작업 중단 조건 (반드시 멈춰야 할 상황)

1. **로그인 페이지가 보임** → 운영자에게 로그인 요청 + 중단
2. **키가 의도치 않게 화면에 보임** → 그 페이지 스킵 + 운영자에게 마스킹 요청
3. **registry.ts 파일 구조가 예상과 다름** → 임의 수정 말고 운영자 확인
4. **다른 API가 폐기됨/오류 상태** → 그 항목만 스킵하고 계속
5. **dev 서버가 다 죽음** → 자동 재시작 시도, 안 되면 중단

---

## 🎯 성공 기준

- [ ] 115개 중 "승인" 상태 API 모두 데이터명·endpoint·포맷 수집
- [ ] 가맹/부동산/소상공인 매칭되는 6~12개가 registry.ts에 등록 + status: 'configured'
- [ ] 그 외 분류 보류 API는 docs/external-apis-other.md로 정리
- [ ] git diff에 키 노출 0건 (검증 통과)
- [ ] 9사이트 모두 200 응답 유지
- [ ] 커밋 1개로 깔끔하게 정리 + 결과 표로 운영자에게 보고

---

## 📋 작업 시작 전 운영자에게 한 번만 확인

```
시작하기 전에 다음만 확인할게:

1. data.go.kr에 로그인되어 있어? (https://www.data.go.kr 우상단에 본인 이름 보이면 OK)
2. 활용신청 115개 중 "승인" 상태가 몇 개야? (대략으로도 OK)
3. 자동 수집 + registry.ts 자동 등록 진행해도 돼?
   (분류 보류된 건은 docs/external-apis-other.md에 정리해두고 끝)

OK 하면 바로 시작할게.
```

---

**이 프롬프트 끝까지 읽었으면 Step 0부터 순서대로 진행. 모르는 부분은
추측 말고 운영자에게 질문.**
