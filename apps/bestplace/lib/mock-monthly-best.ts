export interface MonthlyBestEntry {
  storeId: string
  storeName: string
  brandId: string
  brandName: string
  category: string
  categoryLabel: string
  region: string
  district: string
  rank: 1 | 2 | 3
  reason: string
  metrics: { label: string; value: string }[]
  thumbnailColor: string
  isNew: boolean
}

export interface MonthlyBest {
  year: number
  month: number
  entries: MonthlyBestEntry[]
}

export const CURRENT_MONTHLY_BEST: MonthlyBest = {
  year: 2026,
  month: 5,
  entries: [
    {
      storeId: 's6',
      storeName: '설빙 성수점',
      brandId: 'b6',
      brandName: '설빙',
      category: 'dessert',
      categoryLabel: '디저트',
      region: '서울',
      district: '성동구',
      rank: 1,
      reason: '5월 성수기 진입 + 여름 신메뉴 조기 출시로 SNS 버즈 폭증. 주말 평균 대기 45분 기록.',
      metrics: [
        { label: '이달 방문객', value: '18,400명' },
        { label: '리뷰 증가', value: '+89건' },
        { label: '평점', value: '4.8' },
      ],
      thumbnailColor: '#EC4899',
      isNew: false,
    },
    {
      storeId: 's2',
      storeName: '메가커피 홍대입구점',
      brandId: 'b2',
      brandName: '메가커피',
      category: 'cafe',
      categoryLabel: '카페',
      region: '서울',
      district: '마포구',
      rank: 1,
      reason: '5월 홍대 상권 카페 방문객 1위. 텀블러 프로모션 SNS 확산 효과 + 신메뉴 출시.',
      metrics: [
        { label: '이달 방문객', value: '22,800명' },
        { label: '리뷰 증가', value: '+124건' },
        { label: '평점', value: '4.7' },
      ],
      thumbnailColor: '#7C3AED',
      isNew: false,
    },
    {
      storeId: 's1',
      storeName: '교촌치킨 강남역점',
      brandId: 'b1',
      brandName: '교촌치킨',
      category: 'chicken',
      categoryLabel: '치킨',
      region: '서울',
      district: '강남구',
      rank: 1,
      reason: '야간 회식 수요 급증 + 허니콤보 시그니처 메뉴 품질 안정. 이달 심야 매출 전월 대비 +18%.',
      metrics: [
        { label: '이달 방문객', value: '18,400명' },
        { label: '리뷰 증가', value: '+62건' },
        { label: '평점', value: '4.8' },
      ],
      thumbnailColor: '#B45309',
      isNew: false,
    },
    {
      storeId: 's11',
      storeName: '봉추찜닭 부산서면점',
      brandId: 'b11',
      brandName: '봉추찜닭',
      category: 'korean',
      categoryLabel: '한식',
      region: '부산',
      district: '부산진구',
      rank: 1,
      reason: '부산 지역 점심 유입 최다. 단체석 예약 완판 + 배달 채널 리뷰 4.9 기록.',
      metrics: [
        { label: '이달 방문객', value: '9,800명' },
        { label: '리뷰 증가', value: '+78건' },
        { label: '평점', value: '4.6' },
      ],
      thumbnailColor: '#B45309',
      isNew: false,
    },
    {
      storeId: 's4',
      storeName: '하코야 송도점',
      brandId: 'b4',
      brandName: '하코야',
      category: 'japanese',
      categoryLabel: '일식',
      region: '인천',
      district: '연수구',
      rank: 1,
      reason: '5월 가정의 달 가족 외식 수요 집중. 가족 코스 메뉴 예약 전석 완판.',
      metrics: [
        { label: '이달 방문객', value: '8,400명' },
        { label: '리뷰 증가', value: '+54건' },
        { label: '평점', value: '4.7' },
      ],
      thumbnailColor: '#0EA5E9',
      isNew: false,
    },
    {
      storeId: 's9',
      storeName: '굽네치킨 강서마곡점',
      brandId: 'b9',
      brandName: '굽네치킨',
      category: 'chicken',
      categoryLabel: '치킨',
      region: '서울',
      district: '강서구',
      rank: 2,
      reason: '신규 오픈 3개월 만에 마곡 지역 치킨 2위 진입. 건강 지향 오븐구이로 재방문율 상승.',
      metrics: [
        { label: '이달 방문객', value: '7,200명' },
        { label: '리뷰 증가', value: '+41건' },
        { label: '평점', value: '4.6' },
      ],
      thumbnailColor: '#EAB308',
      isNew: true,
    },
    {
      storeId: 's8',
      storeName: '역전할머니맥주 서면점',
      brandId: 'b8',
      brandName: '역전할머니맥주',
      category: 'bar',
      categoryLabel: '주점',
      region: '부산',
      district: '부산진구',
      rank: 1,
      reason: '5월 야간 외식 성수기 + 서면 상권 이벤트 유입. 금·토 예약 2주 전 완판.',
      metrics: [
        { label: '이달 방문객', value: '12,400명' },
        { label: '리뷰 증가', value: '+93건' },
        { label: '평점', value: '4.7' },
      ],
      thumbnailColor: '#7C3AED',
      isNew: false,
    },
    {
      storeId: 's14',
      storeName: '메가커피 판교역점',
      brandId: 'b2',
      brandName: '메가커피',
      category: 'cafe',
      categoryLabel: '카페',
      region: '경기',
      district: '성남시 분당구',
      rank: 2,
      reason: 'IT 개발자·스타트업 직장인 유입 급증. 오전 9~11시 피크 점심 매출 전월 대비 +22%.',
      metrics: [
        { label: '이달 방문객', value: '14,200명' },
        { label: '리뷰 증가', value: '+67건' },
        { label: '평점', value: '4.6' },
      ],
      thumbnailColor: '#7C3AED',
      isNew: false,
    },
  ],
}

export const PAST_MONTHLY_BESTS: Pick<MonthlyBest, 'year' | 'month'>[] = [
  { year: 2026, month: 4 },
  { year: 2026, month: 3 },
  { year: 2026, month: 2 },
  { year: 2026, month: 1 },
]

export const MONTH_LABEL: Record<number, string> = {
  1: '1월', 2: '2월', 3: '3월', 4: '4월', 5: '5월', 6: '6월',
  7: '7월', 8: '8월', 9: '9월', 10: '10월', 11: '11월', 12: '12월',
}
