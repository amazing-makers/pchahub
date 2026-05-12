# Claude Code 이어받기 프롬프트

Cowork에서 data.go.kr endpoint 수집·등록까지 끝났음.
이제 Claude Code(CLI)에서 fetcher·mapper·실제 API 연동을 마무리할 차례.

아래 코드 블록을 통째로 복사 → 새 Claude Code 세션 첫 메시지에 붙여넣기.

---

## 📋 복붙 프롬프트 (전체 복사)

```
amakers 프로젝트의 외부 API 통합 후속 작업이야.
앞 세션(Cowork)에서 data.go.kr 활용신청 115개 endpoint 수집·registry 등록까지 끝냄.
이제 fetcher·mapper·실제 데이터 swap을 마무리해줘.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 프로젝트 컨텍스트
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
경로: D:\Users\help\Projects\Franchise
- pnpm monorepo (turbo), Next.js 14 9개 사이트
- 각 사이트 dev 서버: pchahub:3000, openrun:3001, gongganhansu:3002,
  themyungdang:3003, themanual:3004, jangsanote:3005,
  bestplace:3006, changupdocu:3007, pchabridge:3008
- .env는 루트 1개 (per-app 아님)
- 최근 커밋:
  * 735fceb6 - 활용신청 115개 전체 registry 등록
  * 06e99274 - 핵심 매핑 16개 configured
  * 4650099e - 자기완결 Cowork 프롬프트

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 보안 규칙 (절대 준수)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ".env"에 든 키는 절대 채팅·코드·로그·git에 노출 금지
2. 코드 상수로 key 하드코딩 금지 → 반드시 process.env.XXX_KEY 참조
3. .env.example만 수정, .env는 사용자가 직접 채움
4. git status·diff에 .env가 보이면 즉시 중단 + 알림
5. URL query에 serviceKey=값 형태로 키 넣을 때 절대 console.log/error에 전체 URL 출력 금지
   (URL 출력 시 serviceKey=*** 마스킹)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 현재 registry 상태
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
| 사이트 | Entries | Configured | Pending |
|---|---:|---:|---:|
| pchahub (apps/pchahub/lib/kftc/registry.ts) | 98 | 98 | 0 |
| themyungdang (apps/themyungdang/lib/external/registry.ts) | 14 | 12 | 2 |
| bestplace (apps/bestplace/lib/external/registry.ts) | 9 | 8 | 1 |
| gongganhansu (apps/gongganhansu/lib/external/registry.ts) | 1 | 1 | 0 |

Pending (수동 처리 필요):
- themyungdang/RebRentStats, RebSaleStats → reb.or.kr 별도 API (REB_API_KEY)
- bestplace/BizRegLookup → endpoint 자동 추출 실패
  (보통 https://api.odcloud.kr/api/nts-businessman/v1/status, JSON, POST)
- bestplace/SosanginCommerceArea → endpoint 미상

읽어볼 핵심 파일:
- apps/pchahub/lib/kftc/registry.ts (98 entries — 가맹 정보)
- apps/pchahub/lib/kftc/client.ts (기존 fetcher 패턴)
- apps/pchahub/lib/kftc/datago-client.ts (기존 datago 헬퍼)
- apps/pchahub/lib/kftc/json-apis.ts (JSON API 타입+fetcher 페어)
- apps/pchahub/lib/kftc/mapper.ts (API 응답 → mock 변환)
- apps/pchahub/lib/kftc/source.ts (graceful fallback 진입점)
- apps/pchahub/lib/kftc/types.ts
- apps/pchahub/lib/kftc/HOW_TO_REGISTER_APIS.md (운영자 가이드)
- apps/pchahub/lib/kftc/README.md
- apps/themyungdang/lib/external/{datago-client.ts, json-apis.ts, reb-api.ts, source.ts}
- apps/bestplace/lib/external/{datago-client.ts, source.ts}
- docs/external-apis.md (사이트별 API 매핑 안내)
- scripts/data-go-kr-intake.tsv (수집 원본 115행)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 작업 우선순위
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Phase 1: 환경 변수 + .env.example 보완 (★ 먼저)
1. .env.example에 다음 줄 추가 (값은 비워두기):
   ```
   # ─── 공공데이터포털 (data.go.kr) ───
   # 발급: https://www.data.go.kr/iim/api/selectAcountList.do
   # 보통 1계정 = 1키이며, 여러 API에 공유 가능
   KFTC_API_KEY=""      # apis.data.go.kr/1130000/* (공정거래위원회 가맹정보)
   DATAGO_API_KEY=""    # apis.data.go.kr/{1240000,1613000,B553077,B552016}/*
                        #   - 1240000: KOSIS 통계
                        #   - 1613000: 국토교통부 실거래가
                        #   - B553077: 소상공인 상권/상가
                        #   - B552016: 국토안전관리원 시설물
   REB_API_KEY=""       # reb.or.kr 한국부동산원 (별도 발급)
   NTS_API_KEY=""       # api.odcloud.kr 국세청 사업자등록 진위 (별도 발급)
   ```
2. apps/pchahub/.env.example, apps/themyungdang/.env.example, apps/bestplace/.env.example
   에 위와 동일한 설정 추가 (per-app .env 옵션도 지원)
3. packages/config 같은 공용 설정에 key 읽기 헬퍼 추가 (선택):
   ```ts
   // packages/config/src/env.ts
   export const env = {
     kftcApiKey: () => requiredEnv('KFTC_API_KEY'),
     datagoApiKey: () => requiredEnv('DATAGO_API_KEY'),
     rebApiKey: () => process.env.REB_API_KEY ?? null,
     ntsApiKey: () => process.env.NTS_API_KEY ?? null,
   }
   ```

### Phase 2: fetcher 일반화 (★★ 핵심)
기존 apps/pchahub/lib/kftc/datago-client.ts 패턴을 보고, 모든 사이트에 적용 가능한
공통 fetcher를 packages/api-client/src/ 또는 각 앱 lib/external/에 작성.

요구사항:
- 입력: { endpoint, key, query?, format? }
- 동작:
  * serviceKey URL param 자동 추가 (단, 로그/에러 메시지엔 *** 마스킹)
  * JSON+XML 변환 자동 처리 (Content-Type / Accept 헤더 활용)
  * 4xx/5xx 에러 시 fallback hook 호출 (mock 반환)
  * 타임아웃 (기본 10s) + 재시도 1회
- 인터페이스:
  ```ts
  fetchExternal<T>(opts: FetchOpts): Promise<{ ok: true; data: T } | { ok: false; error: string }>
  ```

### Phase 3: 사이트별 source.ts 라우팅
각 registry.ts 옆 source.ts가 "키별 fetcher → 응답 → mapper → mock fallback"의
진입점. 기존 pchahub source.ts 패턴 참고해서 다른 사이트 source.ts도 같은 형태로 확장.

예시 (pchahub):
```ts
import { ENDPOINTS, endpointFor } from './registry'
import { fetchExternal } from '@amakers/api-client'
import { mockBrandList } from '../mock-data'

export async function getBrandList(): Promise<BrandList> {
  const def = ENDPOINTS.find(e => e.key === 'BrandList')
  if (!def || def.status !== 'configured') return mockBrandList
  const r = await fetchExternal({ endpoint: def.endpoint, key: env.kftcApiKey() })
  if (!r.ok) return mockBrandList  // graceful fallback
  return mapBrandListResponse(r.data)
}
```

### Phase 4: mapper 작성 (실제 데이터 → mock 구조)
registry.ts의 각 entry의 fillsMockFields가 'TBD'인 96개에 대해 점진적으로:
- 응답 샘플을 Postman/curl로 한 번 받아보고
- 응답 JSON 구조 파악
- mapper 함수 작성 (../mock-data.ts의 타입과 매칭)
- registry.ts의 fillsMockFields 배열 업데이트

전부 한 번에 다 할 필요 없이, priority: 'critical' / 'useful'부터 시작.

### Phase 5: pending 3건 처리
- bestplace/BizRegLookup: endpoint 직접 확인 후 registry 갱신
- themyungdang/RebRentStats, RebSaleStats: reb.or.kr 별도 fetcher 작성

### Phase 6: 검증
```bash
# 1. .env 키 없어도 mock 동작하는지 (graceful fallback 검증)
mv .env .env.backup 2>/dev/null
for app in pchahub themyungdang bestplace gongganhansu; do
  cd apps/$app && pnpm build 2>&1 | tail -5; cd ../..
done
mv .env.backup .env 2>/dev/null

# 2. 9사이트 dev 서버 200 응답
export PATH="/d/Users/help/Projects/Franchise/.tools/node-v22.12.0-win-x64:/d/Users/help/Projects/Franchise/.tools/pnpm:$PATH"
for app in pchahub openrun gongganhansu themyungdang themanual jangsanote bestplace changupdocu pchabridge; do
  (cd apps/$app && nohup pnpm dev > /d/Users/help/Projects/Franchise/.tools/dev-$app.log 2>&1 &)
done
sleep 15
for port in 3000 3001 3002 3003 3004 3005 3006 3007 3008; do
  curl -s -o /dev/null -w "%{http_code} :$port\n" "http://localhost:$port/"
done

# 3. 키 노출 검사 (반드시 0건)
git diff --staged | grep -iE "(serviceKey=[A-Za-z0-9]{20,}|KFTC_API_KEY=[^\"]+|DATAGO_API_KEY=[^\"]+)" || echo "OK"

# 4. TypeScript 타입 체크
pnpm -r typecheck 2>&1 | tail -20
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛑 작업 중단 조건
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. .env 파일이 git에 추가됨 (.gitignore 누락)
2. console.log/error에 실제 키값이 찍힘
3. type check 실패 (registry union type 깨짐)
4. 기존 mock-data.ts 인터페이스 임의 변경
5. dev 서버 200 응답 깨짐

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 성공 기준
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- [ ] .env.example에 4개 API 키 슬롯 명시
- [ ] packages/api-client에 fetchExternal() 공통 fetcher
- [ ] pchahub: 'critical'/'useful' priority 16개 이상 mapper 완성
- [ ] themyungdang: 핵심 4개 (RebRentStats 제외) mapper 완성
- [ ] bestplace: 핵심 3개 (BizRegLookup 제외) mapper 완성
- [ ] graceful fallback 검증: .env 없이도 dev 서버 200 + mock 정상 표시
- [ ] 키 노출 0건
- [ ] 9사이트 dev 서버 200 응답
- [ ] 커밋 단위로 정리 (Phase별)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

작업 시작 전에 3개 확인만 해줘:
1. "registry.ts 4개 다 읽었나요?" (pchahub/themyungdang/bestplace/gongganhansu)
2. ".env.example 추가 항목 미리보기 보여줄까요?" (Phase 1)
3. "Phase 1부터 순차 진행할까, 아니면 다른 우선순위?"

답변 받으면 Phase 1부터 시작.
```

---

## 사용 방법

1. 위 코드 블록(` ```amakers ` 시작 ~ `Phase 1부터 시작.` 끝) 통째로 복사
2. **Claude Code CLI 새 세션**에서 첫 메시지로 붙여넣기
3. Claude Code가 3가지 확인 질문 → 답변
4. Phase 1~6 순차 진행

## Cowork 작업 결과 (이미 끝난 부분)

| 항목 | 상태 |
|---|---|
| data.go.kr 115개 endpoint 수집 | ✅ |
| 4개 registry.ts 작성·등록 | ✅ |
| 키 노출 0건 검증 | ✅ |
| 2개 커밋 (06e99274, 735fceb6) | ✅ |

`scripts/data-go-kr-intake.tsv`에 원본 수집 데이터 보존, `scripts/register-data-go-kr.mjs`와 `scripts/bulk-register-orphans.mjs`로 추후 재실행/추가 등록 가능.
