# amakers 플랫폼 배포 가이드

9개 앱을 `*.amakers.co.kr` 서브도메인에 배포하는 전체 절차.  
순서: **GitHub → Supabase → Vercel (9개) → Cloudflare DNS**

---

## 목차

1. [GitHub 레포 생성 및 푸시](#1-github-레포-생성-및-푸시)
2. [Supabase 프로젝트 생성 및 DB 초기화](#2-supabase-프로젝트-생성-및-db-초기화)
3. [Vercel — 9개 프로젝트 생성](#3-vercel--9개-프로젝트-생성)
4. [Cloudflare — CNAME 레코드 추가](#4-cloudflare--cname-레코드-추가)
5. [Vercel — 커스텀 도메인 + 환경변수 설정](#5-vercel--커스텀-도메인--환경변수-설정)
6. [배포 확인 체크리스트](#6-배포-확인-체크리스트)
7. [로컬 파일 삭제 여부](#7-로컬-파일-삭제-여부)

---

## 1. GitHub 레포 생성 및 푸시

### 1-1. GitHub에서 새 레포 만들기

1. https://github.com 로그인
2. 우상단 **+** → **New repository**
3. 설정:
   - **Repository name**: `amakers-platform` (원하는 이름)
   - **Visibility**: Private (권장) 또는 Public
   - **Initialize this repository**: 체크 **하지 않음** (이미 로컬에 git 있음)
4. **Create repository** 클릭
5. 생성 후 나오는 URL 복사 (예: `https://github.com/YOUR_USERNAME/amakers-platform.git`)

### 1-2. 로컬에서 원격 연결 후 푸시

Git Bash 또는 PowerShell에서:

```bash
cd D:\Users\help\Projects\Franchise

# 원격 추가 (YOUR_USERNAME을 실제 GitHub 유저명으로 교체)
git remote add origin https://github.com/YOUR_USERNAME/amakers-platform.git

# main 브랜치로 푸시
git push -u origin main
```

> 처음 푸시 시 GitHub 로그인 팝업이 뜨면 인증 완료.

---

## 2. Supabase 프로젝트 생성 및 DB 초기화

### 2-1. Supabase 프로젝트 만들기

1. https://supabase.com 로그인 (또는 가입)
2. **New project** 클릭
3. 설정:
   - **Name**: `amakers-platform`
   - **Database Password**: 강력한 비밀번호 설정 (기록해 두세요)
   - **Region**: `Northeast Asia (Seoul)` 선택
4. **Create new project** 클릭 (약 2분 대기)

### 2-2. 연결 문자열 복사

1. Supabase 대시보드 → **Project Settings** → **Database**
2. **Connection string** 섹션에서:
   - **Transaction (Pooler)** 탭 → URI 복사 → `DATABASE_URL`에 사용
   - **Direct connection** 탭 → URI 복사 → `DIRECT_URL`에 사용
3. 두 URI 모두 `[YOUR-PASSWORD]` 부분을 실제 DB 비밀번호로 교체

### 2-3. Prisma 스키마 초기화

로컬 터미널에서 `.env` 파일에 실제 값 입력 후:

```bash
cd D:\Users\help\Projects\Franchise

# .env 파일 생성 (.env.example 복사 후 실제 값 입력)
cp .env.example .env
# → DATABASE_URL, DIRECT_URL에 Supabase 연결 문자열 입력

# Prisma 스키마를 Supabase DB에 적용
npx prisma db push
```

> `prisma db push`는 마이그레이션 파일 없이 스키마를 바로 DB에 반영합니다.  
> 이후 프로덕션에서는 `prisma migrate deploy`로 관리하는 것을 권장합니다.

---

## 3. Vercel — 9개 프로젝트 생성

Vercel에서 **앱마다 별도 프로젝트**를 만들어야 합니다. (모노레포이므로 Root Directory 설정이 핵심)

### 3-1. 첫 번째 앱 연결 방법 (pchahub 기준)

1. https://vercel.com 로그인
2. **Add New** → **Project**
3. **Import Git Repository** → GitHub에서 `amakers-platform` 선택
4. **Root Directory** 필드에: `apps/pchahub` 입력 (중요!)
5. **Framework Preset**: Next.js (자동 감지)
6. **Project Name**: `amakers-pchahub`
7. 환경변수는 잠시 후 추가 (5번 항목 참조)
8. **Deploy** 클릭

### 3-2. 나머지 8개 앱도 같은 방식으로

| Vercel 프로젝트명 | Root Directory |
|---|---|
| `amakers-pchahub` | `apps/pchahub` |
| `amakers-openrun` | `apps/openrun` |
| `amakers-gongganhansu` | `apps/gongganhansu` |
| `amakers-themyungdang` | `apps/themyungdang` |
| `amakers-themanual` | `apps/themanual` |
| `amakers-jangsanote` | `apps/jangsanote` |
| `amakers-bestplace` | `apps/bestplace` |
| `amakers-changupdocu` | `apps/changupdocu` |
| `amakers-pchabridge` | `apps/pchabridge` |

> **팁**: 각 프로젝트 생성 시 **Add New → Project**를 반복. 같은 GitHub 레포에서 매번 `apps/[앱이름]`만 바꿔 설정.

### 3-3. Vercel 빌드 설정 (각 앱)

Vercel이 Turborepo를 자동 인식합니다. 별도 설정 불필요.  
만약 빌드 에러 시 **Build Command**를 아래로 수동 설정:

```
cd ../.. && npx turbo run build --filter=[앱이름]
```

예: `cd ../.. && npx turbo run build --filter=pchahub`

---

## 4. Cloudflare — CNAME 레코드 추가

### 4-1. Vercel 도메인 확인

각 Vercel 프로젝트의 기본 도메인을 먼저 확인합니다:  
Vercel 프로젝트 → **Settings** → **Domains** → 기본 URL 형태:  
`amakers-pchahub.vercel.app`

### 4-2. Cloudflare에 CNAME 레코드 추가

1. https://dash.cloudflare.com 로그인
2. `amakers.co.kr` 도메인 선택
3. **DNS** → **Records** 탭
4. 아래 9개 레코드를 **Add Record**로 추가:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `pchahub` | `cname.vercel-dns.com` | **DNS only** (회색 구름) |
| CNAME | `openrun` | `cname.vercel-dns.com` | DNS only |
| CNAME | `gongganhansu` | `cname.vercel-dns.com` | DNS only |
| CNAME | `themyungdang` | `cname.vercel-dns.com` | DNS only |
| CNAME | `themanual` | `cname.vercel-dns.com` | DNS only |
| CNAME | `jangsanote` | `cname.vercel-dns.com` | DNS only |
| CNAME | `bestplace` | `cname.vercel-dns.com` | DNS only |
| CNAME | `changupdocu` | `cname.vercel-dns.com` | DNS only |
| CNAME | `pchabridge` | `cname.vercel-dns.com` | DNS only |

> **중요**: Proxy(주황 구름)가 아닌 **DNS only(회색 구름)** 으로 설정.  
> Vercel이 SSL 인증서를 발급하려면 Cloudflare 프록시를 우회해야 합니다.

---

## 5. Vercel — 커스텀 도메인 + 환경변수 설정

### 5-1. 각 앱에 커스텀 도메인 연결

Vercel 각 프로젝트 → **Settings** → **Domains** → **Add**:

| 프로젝트 | 추가할 도메인 |
|---|---|
| amakers-pchahub | `pchahub.amakers.co.kr` |
| amakers-openrun | `openrun.amakers.co.kr` |
| amakers-gongganhansu | `gongganhansu.amakers.co.kr` |
| amakers-themyungdang | `themyungdang.amakers.co.kr` |
| amakers-themanual | `themanual.amakers.co.kr` |
| amakers-jangsanote | `jangsanote.amakers.co.kr` |
| amakers-bestplace | `bestplace.amakers.co.kr` |
| amakers-changupdocu | `changupdocu.amakers.co.kr` |
| amakers-pchabridge | `pchabridge.amakers.co.kr` |

Vercel이 CNAME 레코드를 자동 확인 후 SSL 발급 (1~5분 소요).

### 5-2. 환경변수 설정 (각 앱에 공통 적용)

Vercel 프로젝트 → **Settings** → **Environment Variables**  
아래 변수들을 **모든 9개 프로젝트**에 추가:

#### 필수 공통 변수

```
DATABASE_URL          = (Supabase pooler 연결 문자열)
DIRECT_URL            = (Supabase direct 연결 문자열)
NEXTAUTH_SECRET       = (openssl rand -base64 32 으로 생성한 값, 9개 앱 동일)
```

#### 앱별로 다른 변수

각 앱의 `NEXTAUTH_URL`은 해당 앱의 도메인으로:

| 앱 | NEXTAUTH_URL |
|---|---|
| pchahub | `https://pchahub.amakers.co.kr` |
| openrun | `https://openrun.amakers.co.kr` |
| gongganhansu | `https://gongganhansu.amakers.co.kr` |
| themyungdang | `https://themyungdang.amakers.co.kr` |
| themanual | `https://themanual.amakers.co.kr` |
| jangsanote | `https://jangsanote.amakers.co.kr` |
| bestplace | `https://bestplace.amakers.co.kr` |
| changupdocu | `https://changupdocu.amakers.co.kr` |
| pchabridge | `https://pchabridge.amakers.co.kr` |

#### 선택 변수 (필요한 앱에만)

```
KAKAO_CLIENT_ID           = (카카오 개발자 콘솔)
KAKAO_CLIENT_SECRET       = (카카오 개발자 콘솔)
NAVER_CLIENT_ID           = (네이버 개발자 센터)
NAVER_CLIENT_SECRET       = (네이버 개발자 센터)
GOOGLE_CLIENT_ID          = (Google Cloud Console)
GOOGLE_CLIENT_SECRET      = (Google Cloud Console)
NEXT_PUBLIC_KAKAO_MAP_KEY = (카카오 지도 앱키 — themyungdang, bestplace)
KFTC_API_KEY              = (공정거래위원회 API — pchahub)
CLOUDFLARE_R2_ACCESS_KEY  = (이미지 스토리지)
CLOUDFLARE_R2_SECRET_KEY  = (이미지 스토리지)
CLOUDFLARE_R2_ENDPOINT    = (이미지 스토리지)
CLOUDFLARE_R2_PUBLIC_URL  = (이미지 스토리지)
RESEND_API_KEY            = (이메일 발송)
```

#### 모든 앱 공통 PUBLIC 변수

```
NEXT_PUBLIC_PCHAHUB_URL       = https://pchahub.amakers.co.kr
NEXT_PUBLIC_OPENRUN_URL       = https://openrun.amakers.co.kr
NEXT_PUBLIC_GONGGANHANSU_URL  = https://gongganhansu.amakers.co.kr
NEXT_PUBLIC_THEMYUNGDANG_URL  = https://themyungdang.amakers.co.kr
NEXT_PUBLIC_THEMANUAL_URL     = https://themanual.amakers.co.kr
NEXT_PUBLIC_JANGSANOTE_URL    = https://jangsanote.amakers.co.kr
NEXT_PUBLIC_BESTPLACE_URL     = https://bestplace.amakers.co.kr
NEXT_PUBLIC_CHANGUPDOCU_URL   = https://changupdocu.amakers.co.kr
NEXT_PUBLIC_PCHABRIDGE_URL    = https://pchabridge.amakers.co.kr
```

> **팁**: Vercel에서 **Environment Variables**를 설정할 때 "All Environments"로 설정하면 Production/Preview/Development 모두 적용됩니다.

### 5-3. 재배포

환경변수 추가 후 Vercel 프로젝트 → **Deployments** → 최신 배포 → **Redeploy**.

---

## 6. 배포 확인 체크리스트

모든 설정 완료 후 아래 URL이 정상 접속되는지 확인:

- [ ] https://pchahub.amakers.co.kr
- [ ] https://openrun.amakers.co.kr
- [ ] https://gongganhansu.amakers.co.kr
- [ ] https://themyungdang.amakers.co.kr
- [ ] https://themanual.amakers.co.kr
- [ ] https://jangsanote.amakers.co.kr
- [ ] https://bestplace.amakers.co.kr
- [ ] https://changupdocu.amakers.co.kr
- [ ] https://pchabridge.amakers.co.kr

각 사이트에서 확인:
- [ ] 홈페이지 정상 렌더링
- [ ] SSL 자물쇠 표시 (https)
- [ ] 로그인 페이지 접근 가능
- [ ] 내비게이션 링크 정상 작동

---

## 7. 로컬 파일 삭제 여부

### GitHub에 올라간 후 삭제해도 되는 것

GitHub 레포에 모든 코드가 올라간 이후:

**삭제해도 됩니다:**
- `D:\Users\help\Projects\Franchise` 폴더 전체
- 단, `D:\Users\help\Projects\Franchise\.env` 파일은 gitignore에 있어 GitHub에 올라가지 않음 — **삭제 전 `.env`의 실제 값들을 Vercel 환경변수에 모두 입력했는지 확인 필수**

**삭제 전 반드시 확인:**
1. `git push` 완료 확인 (`git status`가 "nothing to commit" 상태)
2. GitHub에서 최신 커밋이 보이는지 확인
3. Vercel에서 최소 1개 앱이 정상 배포되었는지 확인
4. 로컬 `.env`의 모든 값이 Vercel 환경변수에 입력되었는지 확인

### 향후 코드 수정이 필요할 때

로컬을 삭제했다면 GitHub에서 다시 클론:

```bash
git clone https://github.com/YOUR_USERNAME/amakers-platform.git
cd amakers-platform
cp .env.example .env  # 값 다시 입력
```

그 후 수정하고 `git push`하면 Vercel이 자동으로 재배포합니다.

---

## 부록: OAuth 콜백 URL 설정

소셜 로그인을 사용하려면 각 OAuth 앱에 콜백 URL을 추가해야 합니다.

### 카카오

https://developers.kakao.com → 앱 → **플랫폼** → **Web** → 사이트 도메인 추가:
```
https://pchahub.amakers.co.kr
https://openrun.amakers.co.kr
... (사용하는 앱들)
```

**카카오 로그인** → **Redirect URI 추가**:
```
https://pchahub.amakers.co.kr/api/auth/callback/kakao
https://openrun.amakers.co.kr/api/auth/callback/kakao
```

### 구글

https://console.cloud.google.com → OAuth 2.0 클라이언트 → **승인된 리디렉션 URI**:
```
https://pchahub.amakers.co.kr/api/auth/callback/google
https://openrun.amakers.co.kr/api/auth/callback/google
... (사용하는 앱들)
```

### 네이버

https://developers.naver.com → **API 설정** → **서비스 URL / Callback URL**:
```
https://pchahub.amakers.co.kr/api/auth/callback/naver
```
