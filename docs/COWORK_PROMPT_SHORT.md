# Claude Cowork에 그대로 붙여넣는 프롬프터 (짧은 버전)

아래 텍스트를 복사해서 Claude Cowork(또는 새 Claude 세션)의 첫 메시지로 붙여넣으면 됩니다.

---

## 복붙용 프롬프터

```
amakers 프로젝트의 외부 데이터 API 통합 작업을 인계받았어. 컨텍스트와
지시는 다음 문서에 다 있어:

  D:\Users\help\Projects\Franchise\docs\COWORK_PROMPT_API_INTEGRATION.md

먼저 이 문서를 끝까지 읽고, 다음을 순서대로 진행해줘:

1. 파일을 읽어 작업 컨텍스트 파악
2. git log --oneline -10 으로 최근 진행 확인
3. 다음 3개 파일의 현재 endpoint 등록 상태 확인:
   - apps/pchahub/lib/kftc/registry.ts
   - apps/themyungdang/lib/external/registry.ts
   - apps/bestplace/lib/external/registry.ts
4. 운영자(나)에게 활용신청 완료된 API의 endpoint URL을 다음 형식으로 요청:

   이름: <data.go.kr에 표시되는 데이터명>
   URL:  <End Point 필드 값>
   포맷: <JSON | XML | JSON+XML>

   ⚠️ 인증키는 절대 받지 말 것. 운영자가 직접 .env에 넣는다.

5. 받은 URL을 사이트별 registry.ts에 추가 + status를 'configured'로 변경
6. 9개 사이트(:3000~3008) 모두 200 응답 유지하는지 검증
7. 각 단계마다 운영자(나)에게 진행 상황 보고 + 다음 단계 안내

규칙:
- 키나 비밀번호는 절대 채팅·로그·git에 노출 금지
- 임의 추측으로 endpoint를 만들지 말 것 — 운영자에게 확인
- 페이지 코드 swap (mock → 실 API)은 운영자 요청 시에만 진행
- 모르는 게 있으면 추측 말고 운영자에게 질문

작업 시작해줘.
```

---

## 또는 더 간단하게 (한 줄 인계)

```
@cowork D:/Users/help/Projects/Franchise/docs/COWORK_PROMPT_API_INTEGRATION.md 읽고
KFTC API 통합 작업 이어서 진행해. registry.ts에 endpoint 등록 + 9사이트 200 유지.
키는 절대 받지 말고 운영자가 .env에 직접 넣게 안내.
```
