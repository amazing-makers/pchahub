# Cowork에 바로 붙여넣을 수 있는 최단 프롬프트

## ⚡ 짧은 버전 (60초만에 시작)

아래 텍스트 전체를 복사 → Cowork 첫 메시지로 붙여넣기:

```
브라우저로 data.go.kr 마이페이지(https://www.data.go.kr/iim/api/selectAcountList.do)
들어가서, 내가 활용신청 완료한 API 115개의 endpoint URL을 자동 수집해줘.

수집한 URL을 다음 프로젝트의 사이트별 registry.ts에 등록:
- apps/pchahub/lib/kftc/registry.ts        (가맹/공정거래위원회)
- apps/themyungdang/lib/external/registry.ts (부동산/실거래)
- apps/bestplace/lib/external/registry.ts   (소상공인/상가)

각 API의 status를 'configured'로 바꾸고 endpoint URL 채워.

⚠️ 보안:
- "일반 인증키" 필드는 절대 보지/복사하지 마. 키는 내가 직접 .env에 넣을 거야
- 너는 데이터명 + End Point URL + 포맷만 다룬다
- 키를 채팅/git/로그에 노출하면 즉시 작업 중단

전체 절차·매핑 규칙·검증 방법은 다음 파일에 다 있어. 먼저 읽고 시작해줘:
  D:/Users/help/Projects/Franchise/docs/COWORK_PROMPT_BROWSER_TASK.md

프로젝트 경로: D:/Users/help/Projects/Franchise
나는 data.go.kr에 미리 로그인해뒀어. 바로 마이페이지 진입 가능.
```

---

## 📌 더 짧은 버전 (1줄)

```
@cowork D:/Users/help/Projects/Franchise/docs/COWORK_PROMPT_BROWSER_TASK.md 읽고 시작해. 
data.go.kr 활용신청한 115개 API endpoint를 자동 수집해서 registry.ts에 등록. 
키는 절대 건드리지 말 것.
```

---

## 🎯 작업 시작 후 운영자(나)가 할 일

Cowork이 작업을 끝내고 보고하면:

1. 결과 표 확인 (등록된 API N개)
2. 각 사이트의 `.env` 파일에 키 직접 입력:
   ```bash
   # apps/pchahub/.env
   KFTC_API_KEY=<내 키>

   # apps/themyungdang/.env
   DATAGO_API_KEY=<내 키>
   REB_API_KEY=<REB 키 — 별도>

   # apps/bestplace/.env
   DATAGO_API_KEY=<내 키>
   ```
3. dev 서버 재시작 (`.env` 반영):
   ```bash
   # 9사이트 다시 시작 (또는 키 들어간 3사이트만)
   ```
4. 검증:
   ```bash
   curl http://localhost:3000/brands  # KFTC 실 데이터 표시되면 성공
   ```

---

## ⚠️ 주의

`COWORK_PROMPT_BROWSER_TASK.md` 안에 모든 단계·매핑·검증·보안 규칙이
들어있다. Cowork이 그 파일만 읽으면 자기 혼자 작업 완료 가능.
