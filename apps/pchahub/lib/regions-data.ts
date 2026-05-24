// 지역별 브랜드 탐색 데이터
// hqRegion 기반으로 브랜드 수, 평균 창업비, 대표 카테고리를 집계.

import type { MockBrand } from './mock-data'

export interface RegionInfo {
  key: string
  label: string
  shortLabel: string
  description: string
  /** 주요 상권 예시 */
  hotspots: string[]
  /** 대표 이미지 키워드 (Unsplash alt) */
  imageKeyword: string
}

export const KOREAN_REGIONS: RegionInfo[] = [
  {
    key: '서울',
    label: '서울특별시',
    shortLabel: '서울',
    description: '1,000만 소비 인구, 밀집 상권. 강남·홍대·명동 등 전국 최고 상권 집결',
    hotspots: ['강남·서초', '홍대·마포', '명동·중구', '강동·송파'],
    imageKeyword: '서울 도심',
  },
  {
    key: '경기',
    label: '경기도',
    shortLabel: '경기',
    description: '수도권 최대 광역자치단체. 신도시·택지지구 중심 신규 상권 성장세',
    hotspots: ['분당·판교', '수원·화성', '일산·파주', '평택·안성'],
    imageKeyword: '경기 신도시',
  },
  {
    key: '인천',
    label: '인천광역시',
    shortLabel: '인천',
    description: '공항·항만 물류 거점 + 송도·청라 신도시 빠른 성장',
    hotspots: ['송도·연수', '부평·계양', '인천공항 주변'],
    imageKeyword: '인천 송도',
  },
  {
    key: '부산',
    label: '부산광역시',
    shortLabel: '부산',
    description: '남부권 최대 도시. 관광·해운대·서면 등 고밀도 상권',
    hotspots: ['해운대·센텀', '서면·부전', '광안리·남포동'],
    imageKeyword: '부산 해운대',
  },
  {
    key: '대구',
    label: '대구광역시',
    shortLabel: '대구',
    description: '경북권 핵심 도시. 동성로·칠성시장 전통 상권 + 범어·수성 신흥 상권',
    hotspots: ['동성로·중구', '범어·수성', '달서·성서'],
    imageKeyword: '대구 도심',
  },
  {
    key: '광주',
    label: '광주광역시',
    shortLabel: '광주',
    description: '호남권 중심 도시. 충장로·상무지구 주요 상권',
    hotspots: ['충장로·동구', '상무지구', '수완지구'],
    imageKeyword: '광주 상무지구',
  },
  {
    key: '대전',
    label: '대전광역시',
    shortLabel: '대전',
    description: '충청권·전국 교통 요지. 둔산동·유성 대학가 강세',
    hotspots: ['둔산동·서구', '유성·노은', '은행동·중구'],
    imageKeyword: '대전 둔산',
  },
  {
    key: '울산',
    label: '울산광역시',
    shortLabel: '울산',
    description: '자동차·조선 산업 배후 도시. 실수요 기반 안정적 상권',
    hotspots: ['삼산·남구', '성남·중구', '울산공단 주변'],
    imageKeyword: '울산 삼산',
  },
  {
    key: '세종',
    label: '세종특별자치시',
    shortLabel: '세종',
    description: '행정 수도 기능 이전 + 신도시 급성장. 공무원·30대 가구 밀집',
    hotspots: ['나성동·어진동', '보람동·새롬동'],
    imageKeyword: '세종 신도시',
  },
  {
    key: '강원',
    label: '강원특별자치도',
    shortLabel: '강원',
    description: '관광·레저 특화 상권. 계절별 수요 편차 크므로 사계절 매출 분석 필수',
    hotspots: ['춘천·강릉', '원주·속초', '평창·고성(관광)'],
    imageKeyword: '강원 춘천',
  },
  {
    key: '충북',
    label: '충청북도',
    shortLabel: '충북',
    description: '청주 중심 내륙 상권. 충북혁신도시·오송 바이오 클러스터 인근',
    hotspots: ['청주·흥덕', '충주·제천', '오송·오창'],
    imageKeyword: '청주 도심',
  },
  {
    key: '충남',
    label: '충청남도',
    shortLabel: '충남',
    description: '천안·아산 수도권 연계 수요 + 내포신도시 개발',
    hotspots: ['천안·아산', '내포신도시', '논산·공주'],
    imageKeyword: '천안 아산',
  },
  {
    key: '전북',
    label: '전북특별자치도',
    shortLabel: '전북',
    description: '전주 한옥마을·완산 전통 상권. 음식 문화 강세',
    hotspots: ['전주·완산', '군산·익산', '남원·정읍'],
    imageKeyword: '전주 한옥마을',
  },
  {
    key: '전남',
    label: '전라남도',
    shortLabel: '전남',
    description: '목포·여수 관광 상권 + 광양·순천 산업 배후',
    hotspots: ['여수·순천', '목포·무안', '광양·남악'],
    imageKeyword: '여수 밤바다',
  },
  {
    key: '경북',
    label: '경상북도',
    shortLabel: '경북',
    description: '경산·구미 산업도시 + 포항·경주 관광 상권 복합',
    hotspots: ['포항·경주', '구미·경산', '안동·상주'],
    imageKeyword: '포항 도심',
  },
  {
    key: '경남',
    label: '경상남도',
    shortLabel: '경남',
    description: '창원·진주·거제 산업 거점. 인구 규모 대비 창업 비용 낮음',
    hotspots: ['창원·마산', '진주·거제', '통영·사천'],
    imageKeyword: '창원 도심',
  },
  {
    key: '제주',
    label: '제주특별자치도',
    shortLabel: '제주',
    description: '연 1,500만 관광객 특수 상권. 계절성 강하고 임대료 상승폭 주의',
    hotspots: ['제주시·연동', '서귀포·중문', '애월·협재'],
    imageKeyword: '제주 연동',
  },
]

export interface RegionStats {
  region: string
  brandCount: number
  avgStartupCost: number
  topCategory: string
  topCategoryLabel: string
}

/** BRANDS 배열로부터 지역별 통계 계산 */
export function computeRegionStats(brands: MockBrand[]): RegionStats[] {
  return KOREAN_REGIONS.map((r) => {
    const regionBrands = brands.filter((b) => b.hqRegion === r.key)
    const brandCount = regionBrands.length

    const avgStartupCost =
      brandCount > 0
        ? Math.round(regionBrands.reduce((s, b) => s + (b.startupCost ?? 0), 0) / brandCount)
        : 0

    // 가장 많은 카테고리
    const catCounts: Record<string, { count: number; label: string }> = {}
    for (const b of regionBrands) {
      if (!catCounts[b.category]) catCounts[b.category] = { count: 0, label: b.categoryLabel }
      catCounts[b.category]!.count++
    }
    const topEntry = Object.entries(catCounts).sort((a, b) => b[1].count - a[1].count)[0]

    return {
      region: r.key,
      brandCount,
      avgStartupCost,
      topCategory: topEntry?.[0] ?? '',
      topCategoryLabel: topEntry?.[1].label ?? '-',
    }
  })
}
