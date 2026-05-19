# amakers 플랫폼 데이터 업데이트 가이드

실제 데이터 교체·보완 시 참고하는 파일별 가이드.  
현재는 모두 mock 데이터(TypeScript 상수)이고, 향후 Supabase 마이그레이션 예정.

---

## 1. pchahub — 브랜드·KFTC 데이터

### 파일
- `apps/pchahub/lib/kftc/client.ts` — KFTC API 호출 + XML 파싱
- `apps/pchahub/lib/brands.ts` — BRANDS 상수 (pchahub 전용)
- `apps/pchahub/lib/mock-brand-detail.ts` — 브랜드 상세 mock 데이터

### 실제 데이터 연결 방법
1. `.env`에 `KFTC_API_KEY=your_key` 설정
2. `listDisclosures(2024)` 호출 → 브랜드 일련번호 목록 조회
3. `getDisclosureContent(jngIfrmpSn)` → 가맹비·보증금·매장수·매출 파싱
4. 결과를 DB(Supabase) `brand_disclosures` 테이블에 저장

### 업데이트 주기
- 정보공개서: 매년 1~2월 (FTC 공개 주기)
- 브랜드 사진: 수동 → `apps/pchahub/public/brands/` 디렉토리에 추가

---

## 2. gongganhansu — 인테리어 업체 디렉토리

### 파일
- `apps/gongganhansu/lib/mock-data.ts`

### 실제 데이터 교체 방법
```typescript
// RAW_CONTRACTORS 배열에 업체 정보 추가
{
  id: 'c16',                    // 고유 ID
  name: '실제업체명',            // 사업자등록 업체명
  region: '서울',               // 지역
  specialties: ['cafe', 'korean'], // 전문 카테고리
  foundedYear: 2015,
  projectCount: 200,
  avgPricePerPyeong: 95,        // 평당 만원
  budgetRange: '3,000만 ~ 1억원',
  rating: 4.7,
  reviewCount: 180,
  brandColor: '#3B82F6',
  tagline: '짧은 소개',
  bio: ['문단1', '문단2'],
  highlights: ['강점1', '강점2'],
  includes: ['포함항목1', '포함항목2'],
  verified: true,               // 사업자등록 확인 여부
  featured: false,
  portfolioIds: [],             // 연결된 포트폴리오 ID
}
```

### 포트폴리오 사진 추가
`apps/gongganhansu/lib/portfolio-images.ts` 의 `portfolioPhotoSet()` 함수에  
새 포트폴리오 ID의 사진 URL 매핑 추가.

---

## 3. bestplace — 매장 디렉토리 + 어워드

### 파일
- `apps/bestplace/lib/mock-data.ts`

### 브랜드 추가
```typescript
// BRANDS 배열에 추가
{ id: 'b13', name: '새브랜드명', category: 'chicken', categoryLabel: '치킨', logoColor: '#색상' }
```

### 매장 추가
```typescript
// RAW_STORES 배열에 추가
{
  id: 's16',
  name: '브랜드명 지점명',
  brandId: 'b13',
  region: '서울',
  district: '강남구',
  address: '실제 주소',
  footTraffic: 5000,      // 일 평균 유동인구
  area: 20,               // 평
  openedYear: 2024,
  rating: 4.5,
  reviewCount: 100,
  monthlyVisitors: 8000,
  imageColor: '#색상',
  awards: [],
  verified: true,
  highlights: ['특징1', '특징2'],
}
```

### 어워드 데이터
- 수상 연도·카테고리·순위·브랜드ID·한 줄 평 세트로 AWARDS 배열에 추가
- `representativeStoreId`: 대표 매장 ID (선택)

---

## 4. jangsanote — 커뮤니티 포스트

### 파일
- `apps/jangsanote/lib/mock-data.ts`

### 포스트 추가
```typescript
{
  id: 'p22',
  title: '제목',
  excerpt: '카드에 표시될 1-2문장 요약',
  content: ['문단1', '문단2', '문단3'],
  authorId: 'u1',        // USERS 배열의 사용자 ID
  channelType: 'category' | 'region' | 'general',
  channelKey: 'chicken' | 'cafe' | 'korean' | 'seoul' | 'gyeonggi' | ... ,
  category: 'experience' | 'question' | 'tip' | 'news' | 'discussion',
  tags: ['태그1', '태그2'],
  anonymous: false,
  pinned: false,
  hot: false,
  createdAt: '2026-05-19T10:00:00',
  views: 0,
  likes: 0,
  commentCount: 0,
  comments: [],
}
```

### 채널별 postCount 업데이트
`CHANNELS` 배열의 `postCount` 필드도 함께 업데이트.

---

## 5. changupdocu — 다큐·매거진

### 파일
- `apps/changupdocu/lib/mock-data.ts`

### 에피소드에 YouTube 링크 추가
```typescript
{
  id: 'e9',
  // ... 기타 필드 ...
  youtubeUrl: 'https://www.youtube.com/watch?v=VIDEO_ID', // 실제 공개 영상
}
```

`youtubeUrl`이 있으면 UI에서 "YouTube에서 보기" 버튼이 표시됩니다.  
**주의**: 공개 영상만 연결 (저작권 있는 방송사 영상 제외).

### 실제 공개 자료 연결 가능한 채널
- 공정거래위원회 공식 YouTube: KFTC 교육 영상
- 중소벤처기업부 창업 콘텐츠
- 프랜차이즈산업협회 공식 영상

---

## 6. 공통 API 키 설정 (`.env`)

```env
# KFTC 정보공개서 API (franchise.ftc.go.kr)
KFTC_API_KEY=your_key_here

# 데이터 포털 (국토교통부 임대료 등)
DATAGO_API_KEY=your_key_here

# 한국부동산원
REB_API_KEY=your_key_here

# 국세청 (사업자 조회)
NTS_API_KEY=your_key_here
```

API 키 발급처:
- KFTC: https://franchise.ftc.go.kr → 오픈API 신청
- DATAGO: https://www.data.go.kr → 회원가입 후 활용신청
- REB: https://www.reb.or.kr → 오픈API 서비스

---

## 7. Supabase 마이그레이션 계획 (미래)

현재 mock 데이터 구조는 향후 Supabase 테이블 구조와 1:1 대응하도록 설계됨.

| 플랫폼 | Mock 상수 | Supabase 테이블 |
|--------|-----------|-----------------|
| pchahub | BRANDS | brands |
| bestplace | STORES | stores |
| gongganhansu | CONTRACTORS | contractors |
| jangsanote | POSTS | posts |
| changupdocu | EPISODES | episodes |

마이그레이션 시 `mock-data.ts` 상수를 Supabase 쿼리로 교체하면 됨.
