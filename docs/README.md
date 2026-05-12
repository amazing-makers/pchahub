# amakers 프로젝트 문서

## 📂 문서 카탈로그

| 파일 | 용도 | 누가 읽나? |
|---|---|---|
| **⭐ `COWORK_SELF_CONTAINED_PROMPT.md`** | **Cowork에 작업 시키기 — 폴더 연결 전에도 작동** | 운영자 |
| `COWORK_QUICK_START.md` | 폴더 연결된 상태에서의 짧은 프롬프트 (구버전) | 운영자 |
| `COWORK_PROMPT_BROWSER_TASK.md` | 외부 참조용 자세한 지시 (폴더 연결 필요) | Claude Cowork |
| `COWORK_PROMPT_API_INTEGRATION.md` | 일반 Claude 인스턴스 인계용 (텍스트 기반) | Claude/협업자 |
| `COWORK_PROMPT_SHORT.md` | 일반 인계용의 짧은 버전 | Claude |
| `external-apis.md` | 9사이트 외부 API 매핑 가이드 | 개발자 |
| `external-apis-other.md` | (Cowork이 생성) 분류 보류 API 목록 | 운영자 검토 |

## 🚀 빠른 시작

### "Claude Cowork에게 API endpoint 수집 작업 시키고 싶다" ⭐
→ **`COWORK_SELF_CONTAINED_PROMPT.md`** 열어서 코드 블록 통째로 복사 →
   Cowork 첫 메시지에 붙여넣기

이 프롬프트는 **외부 파일 참조 없음**. Cowork이 폴더 연결 전에도 동작.
Step 3에서 처음 폴더 연결 요청 — 그때 `D:\Users\help\Projects\Franchise` 연결.

### "다른 Claude/개발자에게 작업 인계하고 싶다"
→ `COWORK_PROMPT_SHORT.md`의 복붙용 프롬프트 사용

### "9사이트가 외부 API를 어떻게 쓰는지 보고 싶다"
→ `external-apis.md`

## 🔗 관련 코드 위치

- **pchahub** 외부 API: `apps/pchahub/lib/kftc/`
- **themyungdang** 외부 API: `apps/themyungdang/lib/external/`
- **bestplace** 외부 API: `apps/bestplace/lib/external/`

각 디렉토리에 `registry.ts` 파일이 있고, 거기 endpoint URL을 등록하면 자동
swap된다 (mock → 실 API).
