// 더메뉴얼 업소용 레시피 데이터
// recipekorea.com 인기 업소용 레시피 참고 + 실전 조리 지식 기반
// 프랜차이즈 창업자·점주를 위한 계량화된 업소용 레시피 모음

export type RecipeCategory = 'korean' | 'side' | 'meat' | 'kimchi' | 'western' | 'soup'
export type RecipeDifficulty = 'easy' | 'medium' | 'hard'

export const RECIPE_CATEGORY_LABEL: Record<RecipeCategory, string> = {
  korean:  '한식',
  side:    '밑반찬',
  meat:    '고기 요리',
  kimchi:  '김치',
  western: '양식',
  soup:    '국·찌개',
}

export const DIFFICULTY_LABEL: Record<RecipeDifficulty, string> = {
  easy:   '쉬움',
  medium: '보통',
  hard:   '어려움',
}

export interface RecipeIngredient {
  name: string
  amount: string
  note?: string
}

export interface RecipeStep {
  order: number
  text: string
  image?: string
}

export interface MockRecipe {
  id: string
  title: string
  subtitle: string
  excerpt: string
  category: RecipeCategory
  difficulty: RecipeDifficulty
  /** 조리 시간 (분) */
  cookingTime: number
  /** 인분 */
  servings: number
  heroImage: string
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  tips: string[]
  tags: string[]
  chef: string
  source: string
  sourceUrl: string
  publishedAt: string
  featured: boolean
  viewCount: number
}

export const RECIPES: MockRecipe[] = [

  // ────────────────────────────────────────────────────────
  // 1. 업소용 찹스테이크
  // 참고: recipekorea.com S82874 (고깃집·술집 사이드메뉴)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-001',
    title: '업소용 찹스테이크',
    subtitle: '고깃집·술집 객단가를 올리는 사이드메뉴',
    excerpt: '한 입 크기 소고기에 달콤짭조름한 소스와 컬러 채소를 강불에 볶아낸 찹스테이크. 소고기 전문점·호프집·경양식 매장 어디서나 추가 매출을 만드는 메뉴입니다. 철판·팬·덮밥 세 가지 형태로 응용 가능합니다.',
    category: 'western',
    difficulty: 'easy',
    cookingTime: 20,
    servings: 2,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2992/8014c964-a9e9-41aa-b14f-1c5dd981f717.jpg',
    ingredients: [
      { name: '소고기 (부채살·채끝)', amount: '300g' },
      { name: '양파', amount: '1개' },
      { name: '빨강 파프리카', amount: '½개' },
      { name: '초록 파프리카', amount: '½개' },
      { name: '새송이버섯', amount: '1개' },
      { name: '마늘', amount: '4쪽' },
      { name: '버터', amount: '1큰술' },
      { name: '식용유', amount: '2큰술' },
      { name: '소금·후추', amount: '약간', note: '밑간' },
      { name: '간장', amount: '3큰술', note: '소스' },
      { name: '굴소스', amount: '1큰술', note: '소스' },
      { name: '설탕', amount: '1큰술', note: '소스' },
      { name: '물엿', amount: '1큰술', note: '소스' },
      { name: '청주(맛술)', amount: '2큰술', note: '소스' },
      { name: '후추', amount: '약간', note: '소스' },
      { name: '참기름', amount: '1큰술', note: '소스' },
    ],
    steps: [
      {
        order: 1,
        text: '소고기를 2cm 깍둑썰기하고 소금·후추로 밑간합니다. 양파·파프리카·새송이버섯도 같은 크기로 썹니다.',
      },
      {
        order: 2,
        text: '소스 재료(간장·굴소스·설탕·물엿·청주·후추·참기름)를 한데 섞어 소스를 미리 만들어 둡니다. 업소에서는 소스를 대량으로 만들어 냉장 보관하면 편리합니다.',
      },
      {
        order: 3,
        text: '팬을 강불로 달구고 식용유를 두른 뒤 밑간한 소고기를 넣어 겉면이 갈색이 될 때까지 센 불에 빠르게 볶습니다. 이때 고기를 너무 자주 뒤집지 않아야 마이야르 반응이 생겨 고소한 맛이 납니다.',
      },
      {
        order: 4,
        text: '고기가 70% 정도 익으면 마늘(편 썬)과 버터를 넣어 향을 냅니다.',
      },
      {
        order: 5,
        text: '양파·버섯을 먼저 넣고 1분 볶다가 파프리카를 마지막에 넣어 식감을 살립니다.',
      },
      {
        order: 6,
        text: '소스를 붓고 강불에서 30초간 재료에 골고루 입혀 윤기를 냅니다. 철판에 옮겨 담거나 접시에 플레이팅합니다.',
      },
    ],
    tips: [
      '소고기 부위는 부채살이 가성비가 좋고 식감이 부드러워 업소용으로 적합합니다. 프리미엄으로 가려면 채끝을 사용하세요.',
      '소스는 미리 대량(10배 분량)으로 만들어 냉장 보관하면 2주간 사용 가능합니다.',
      '철판에 플레이팅하면 고급스러운 분위기가 나고 보온이 유지됩니다.',
      '찹스테이크 덮밥 구성 시 감자튀김과 세트로 묶으면 객단가가 효과적으로 올라갑니다.',
      '파프리카는 가장 마지막에 넣어야 색이 살아있어 비주얼이 좋습니다.',
    ],
    tags: ['찹스테이크', '업소용', '고깃집', '술집', '사이드메뉴', '소고기'],
    chef: '재야의고수',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82874',
    publishedAt: '2026-05-01',
    featured: true,
    viewCount: 27901,
  },

  // ────────────────────────────────────────────────────────
  // 2. 즉석 제육볶음 황금레시피
  // 참고: recipekorea.com S82285 (그냥 따라하면 돈벌어줍니다)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-002',
    title: '즉석 제육볶음 황금레시피',
    subtitle: '배달·홀 어디서나 통하는 국민 메뉴',
    excerpt: '계량화된 양념 비율로 항상 같은 맛을 내는 업소용 제육볶음. 돼지 목살과 고추장 양념의 황금 배합으로 밥 한 공기를 순식간에 비우게 만드는 중독성 있는 맛입니다. 배달 전문점 1위 메뉴로 검증된 레시피입니다.',
    category: 'korean',
    difficulty: 'easy',
    cookingTime: 25,
    servings: 2,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/289/591e4038-5ba3-4aac-93ec-a9ba1f3660a0.jpg',
    ingredients: [
      { name: '돼지 목살', amount: '300g' },
      { name: '양파', amount: '½개' },
      { name: '대파', amount: '½대' },
      { name: '애호박', amount: '¼개' },
      { name: '깻잎', amount: '5장', note: '마무리용' },
      { name: '식용유', amount: '2큰술' },
      { name: '참기름', amount: '1큰술' },
      { name: '통깨', amount: '약간' },
      { name: '고추장', amount: '3큰술', note: '양념' },
      { name: '고춧가루', amount: '1큰술', note: '양념' },
      { name: '간장', amount: '1½큰술', note: '양념' },
      { name: '설탕', amount: '1큰술', note: '양념' },
      { name: '물엿', amount: '1큰술', note: '양념' },
      { name: '다진 마늘', amount: '1½큰술', note: '양념' },
      { name: '다진 생강', amount: '½작은술', note: '양념' },
      { name: '청주(맛술)', amount: '2큰술', note: '양념' },
      { name: '후추', amount: '약간', note: '양념' },
    ],
    steps: [
      {
        order: 1,
        text: '돼지 목살을 0.5cm 두께로 얇게 썰고, 양념 재료를 모두 섞어 양념장을 만듭니다.',
      },
      {
        order: 2,
        text: '썬 고기에 양념장을 넣어 잘 버무려 30분 이상 재워둡니다. 업소에서는 전날 재워두면 다음날 맛이 더 깊습니다.',
      },
      {
        order: 3,
        text: '양파는 굵게 채 썰고, 대파는 어슷썰고, 애호박은 반달썰기 합니다.',
      },
      {
        order: 4,
        text: '팬을 강불로 달구고 식용유를 두른 뒤 재워둔 고기를 펼쳐서 양면을 빠르게 굽습니다. 처음에는 뒤집지 않고 1분간 그대로 두어 불 맛을 냅니다.',
      },
      {
        order: 5,
        text: '고기가 반 정도 익으면 양파·애호박을 넣고 함께 볶습니다. 대파는 마지막에 넣어 향을 살립니다.',
      },
      {
        order: 6,
        text: '불을 끄고 참기름을 두른 뒤 깻잎을 손으로 찢어 올리고 통깨를 뿌려 완성합니다.',
      },
    ],
    tips: [
      '목살보다 앞다리살을 쓰면 쫄깃한 식감이 강해집니다. 취향과 원가에 맞게 선택하세요.',
      '고추장 브랜드에 따라 간이 다르므로 처음에는 양념장을 소량 만들어 테스트 후 계량화하세요.',
      '양념장은 10배 분량으로 만들어 냉장 보관하면 1주일간 사용 가능해 작업 효율이 올라갑니다.',
      '배달용으로 포장할 때는 완전히 익히지 말고 80% 상태에서 포장해야 도착 시 최적의 상태가 됩니다.',
      '불향이 중요합니다. 가정용 가스 불보다 업소용 불이 강하므로 볶는 시간을 줄여야 타지 않습니다.',
    ],
    tags: ['제육볶음', '돼지고기', '배달', '한식', '볶음', '황금레시피'],
    chef: '쉐프케이',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82285',
    publishedAt: '2026-04-20',
    featured: true,
    viewCount: 31420,
  },

  // ────────────────────────────────────────────────────────
  // 3. 배달용 김치찜
  // 참고: recipekorea.com S82133 (배달 월 3000만원 레시피)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-003',
    title: '배달 특화 김치찜',
    subtitle: '배달 매출 월 3000만원을 가능하게 하는 레시피',
    excerpt: '묵은지와 삼겹살을 압력솥에 찐 업소용 김치찜. 배달 포장 후에도 맛이 유지되는 구조로 만들어 배달 전문점에 최적화된 레시피입니다. 한 번 만들면 일주일 내내 팔 수 있는 대량 조리 레시피입니다.',
    category: 'soup',
    difficulty: 'medium',
    cookingTime: 60,
    servings: 4,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/3011/f2ac269b-8730-4c30-8694-2b3c6d8324b2.jpg',
    ingredients: [
      { name: '묵은 김치 (6개월 이상)', amount: '½포기 (600g)' },
      { name: '삼겹살 (또는 돼지 앞다리)', amount: '500g' },
      { name: '두부', amount: '1모' },
      { name: '양파', amount: '1개' },
      { name: '대파', amount: '2대' },
      { name: '다진 마늘', amount: '2큰술' },
      { name: '고춧가루', amount: '2큰술' },
      { name: '간장', amount: '2큰술' },
      { name: '설탕', amount: '1큰술' },
      { name: '참기름', amount: '1큰술' },
      { name: '물', amount: '1컵' },
      { name: '멸치 다시마 육수', amount: '1컵', note: '깊은 맛용' },
    ],
    steps: [
      {
        order: 1,
        text: '묵은 김치를 5cm 크기로 큼직하게 썹니다. 김칫국물도 따로 모아 둡니다. 삼겹살은 5cm 토막으로 자릅니다.',
      },
      {
        order: 2,
        text: '냄비(또는 압력솥) 바닥에 삼겹살을 먼저 깔고 중불에서 2~3분 볶아 기름을 뺍니다. 돼지 잡내가 잡히고 김치에 고기 기름이 배어 훨씬 깊은 맛이 납니다.',
      },
      {
        order: 3,
        text: '고기 위에 김치와 김칫국물을 올리고, 양파(채 썬), 다진 마늘, 고춧가루, 간장, 설탕을 넣습니다.',
      },
      {
        order: 4,
        text: '물과 멸치 육수를 붓고 뚜껑을 닫아 센 불에서 끓입니다. 끓어오르면 약불로 줄여 40분간 찝니다. 압력솥 사용 시 추가 올라오면 20분이면 됩니다.',
      },
      {
        order: 5,
        text: '두부를 큼직하게 썰어 넣고 5분 더 찝니다. 불을 끄기 직전 대파(어슷썰기)를 올리고 참기름을 두릅니다.',
      },
    ],
    tips: [
      '묵은지는 최소 6개월 이상 숙성된 것을 써야 깊은 맛이 납니다. 신선한 김치로 만들면 전혀 다른 요리가 됩니다.',
      '배달 포장 시 국물을 넉넉히 담고 두부는 별도 용기에 담으면 도착 시 품질이 유지됩니다.',
      '압력솥을 사용하면 조리 시간이 절반으로 줄어 대량 조리가 가능합니다. 업소에서는 대형 압력솥 도입을 추천합니다.',
      '김치찜은 만든 다음날이 가장 맛있습니다. 저녁에 만들어 다음날 배달하면 더 좋습니다.',
      '원가 절감 시 삼겹살 대신 돼지 앞다리살을 사용해도 맛에 큰 차이가 없습니다.',
    ],
    tags: ['김치찜', '배달', '묵은지', '삼겹살', '업소용', '찜'],
    chef: '쉐프본가',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82133',
    publishedAt: '2026-04-10',
    featured: true,
    viewCount: 43200,
  },

  // ────────────────────────────────────────────────────────
  // 4. 업소용 깍두기
  // 참고: recipekorea.com P83309 (누구나 쉽게 만드는 깍두기 비법)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-004',
    title: '업소용 깍두기',
    subtitle: '누구나 따라 할 수 있는 비법 깍두기',
    excerpt: '아삭하고 시원한 깍두기. 무의 절임 정도와 양념 비율만 지키면 항상 같은 맛이 납니다. 국밥집·해장국집의 필수 반찬으로, 대량으로 만들어 오래 두고 쓸 수 있어 업소 운영에 최적입니다.',
    category: 'kimchi',
    difficulty: 'easy',
    cookingTime: 40,
    servings: 10,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2975/278971c9-423c-4c68-8076-373f22531044.jpg',
    ingredients: [
      { name: '무', amount: '1개 (1kg)' },
      { name: '굵은 소금', amount: '3큰술', note: '절이기용' },
      { name: '쪽파', amount: '100g' },
      { name: '새우젓', amount: '2큰술' },
      { name: '멸치액젓', amount: '3큰술' },
      { name: '고춧가루', amount: '6큰술' },
      { name: '다진 마늘', amount: '2½큰술' },
      { name: '다진 생강', amount: '1작은술' },
      { name: '설탕', amount: '1½큰술' },
      { name: '찹쌀풀', amount: '2큰술', note: '익힘용' },
      { name: '참기름', amount: '1큰술' },
    ],
    steps: [
      {
        order: 1,
        text: '무를 2cm×2cm 크기의 정육면체로 깍둑썰기 합니다. 크기가 일정해야 절임이 고르게 됩니다.',
      },
      {
        order: 2,
        text: '무에 굵은 소금 3큰술을 뿌려 30분간 절입니다. 중간에 한 번 뒤집어줍니다. 손으로 꼭 쥐었을 때 물이 나오면 됩니다.',
      },
      {
        order: 3,
        text: '절인 무를 체에 받쳐 물기를 털어냅니다. 물로 씻지 않습니다 — 짠맛이 적당히 남아야 합니다.',
      },
      {
        order: 4,
        text: '큰 볼에 무를 넣고 고춧가루를 먼저 넣어 빨갛게 무칩니다. 고춧가루를 먼저 입혀야 양념이 고르게 배입니다.',
      },
      {
        order: 5,
        text: '멸치액젓·새우젓·다진 마늘·다진 생강·설탕·찹쌀풀을 넣고 잘 버무립니다. 쪽파는 3cm로 잘라 넣고 가볍게 섞습니다.',
      },
      {
        order: 6,
        text: '참기름을 두르고 한 번 더 섞은 후 용기에 담아 실온에서 12시간 발효시킨 뒤 냉장 보관합니다.',
      },
    ],
    tips: [
      '무는 가을무(10~11월)가 당도가 높고 수분이 적어 깍두기용으로 최고입니다.',
      '고춧가루는 굵은 것과 고운 것을 4:1로 섞으면 색도 예쁘고 맛도 좋습니다.',
      '찹쌀풀을 넣으면 발효가 촉진되고 깍두기가 더 빨리 익습니다.',
      '대량 제조 시 무 10kg 기준으로 비율을 10배로 늘리면 됩니다. 공장식 제조도 가능합니다.',
      '냉장 보관 시 1~2개월 유지됩니다. 익을수록 맛이 깊어집니다.',
    ],
    tags: ['깍두기', '김치', '무', '업소용', '국밥집', '밑반찬'],
    chef: '쉐프본가',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=83309',
    publishedAt: '2026-04-25',
    featured: false,
    viewCount: 18900,
  },

  // ────────────────────────────────────────────────────────
  // 5. 정구지(부추) 김치
  // 참고: recipekorea.com P83310 (경상도 정구지 김치)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-005',
    title: '경상도 정구지 김치',
    subtitle: '쌈밥집·고깃집 필수 반찬',
    excerpt: '경상도에서 부추를 정구지라 부릅니다. 향이 강한 부추를 멸치액젓과 고춧가루로 버무린 이 김치는 고기 구울 때 곁들이면 환상의 궁합입니다. 만들기 간단하면서도 손님 반응이 좋은 반찬입니다.',
    category: 'kimchi',
    difficulty: 'easy',
    cookingTime: 15,
    servings: 6,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2989/cb2ac419-f747-41b6-be7c-c98df239101d.jpg',
    ingredients: [
      { name: '부추(정구지)', amount: '500g' },
      { name: '굵은 소금', amount: '1큰술', note: '살짝 절이기용' },
      { name: '멸치액젓', amount: '3큰술' },
      { name: '새우젓', amount: '1큰술' },
      { name: '고춧가루', amount: '5큰술' },
      { name: '다진 마늘', amount: '2큰술' },
      { name: '다진 생강', amount: '½작은술' },
      { name: '설탕', amount: '1작은술' },
      { name: '참기름', amount: '1큰술' },
      { name: '통깨', amount: '2큰술' },
    ],
    steps: [
      {
        order: 1,
        text: '부추를 깨끗이 씻어 4~5cm 길이로 자릅니다. 뿌리 쪽과 잎 쪽을 분리해두면 나중에 섞을 때 편리합니다.',
      },
      {
        order: 2,
        text: '큰 볼에 부추를 담고 굵은 소금을 뿌려 5분만 살짝 절입니다. 부추는 오래 절이면 흐물거리므로 5분 이내가 적당합니다.',
      },
      {
        order: 3,
        text: '고춧가루를 먼저 넣어 부추에 색을 입힙니다.',
      },
      {
        order: 4,
        text: '멸치액젓·새우젓·다진 마늘·다진 생강·설탕을 넣고 손으로 살살 버무립니다. 부추가 부러지지 않도록 가볍게 섞는 것이 포인트입니다.',
      },
      {
        order: 5,
        text: '마지막에 참기름과 통깨를 넣고 한 번 더 가볍게 섞으면 완성입니다. 부추 김치는 담근 당일 또는 다음날이 가장 맛있습니다.',
      },
    ],
    tips: [
      '부추는 너무 오래 절이거나 강하게 버무리면 풀어집니다. 살살 섞는 것이 핵심입니다.',
      '고깃집에서는 고기 먹을 때 쌈으로 함께 내면 반응이 아주 좋습니다.',
      '새우젓 대신 갈치속젓을 쓰면 더 진한 경상도 스타일이 됩니다.',
      '냉장 보관 시 2~3일 내 소비하는 것이 좋습니다. 오래 두면 물러집니다.',
      '대량 제조 시 양념장을 먼저 만들어두고 서빙 직전에 부추와 버무리면 신선도를 유지할 수 있습니다.',
    ],
    tags: ['부추김치', '정구지', '경상도', '김치', '고깃집', '쌈밥집'],
    chef: '쉐프본가',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=83310',
    publishedAt: '2026-04-22',
    featured: false,
    viewCount: 14300,
  },

  // ────────────────────────────────────────────────────────
  // 6. 냉면비빔장
  // 참고: recipekorea.com S17240 (조회수 212,755)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-006',
    title: '쉐프 냉면비빔장',
    subtitle: '조리료 없이 천연재료만으로 완성하는 냉면 다데기',
    excerpt: '배·대파·마늘·양파를 갈아 만드는 천연 냉면비빔장. 조미료를 일절 사용하지 않고 오로지 천연재료의 감칠맛만으로 완성합니다. 5일 숙성 후 사용하면 맛이 깊어져 고깃집·냉면 전문점 어디서나 통합니다.',
    category: 'korean',
    difficulty: 'easy',
    cookingTime: 20,
    servings: 20,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2989/c9ed5148-b5d0-49d3-ba76-6460a77ea73e.jpg',
    ingredients: [
      { name: '배', amount: '1개', note: '믹서기에 갈기' },
      { name: '대파', amount: '2대', note: '믹서기에 갈기' },
      { name: '마늘', amount: '1통', note: '믹서기에 갈기' },
      { name: '양파', amount: '1개', note: '믹서기에 갈기' },
      { name: '황도(복숭아 통조림)', amount: '1캔', note: '믹서기에 갈기' },
      { name: '오이', amount: '1개', note: '믹서기에 갈기 (진한 씨 부분 제거)' },
      { name: '간장', amount: '1컵' },
      { name: '물엿', amount: '3큰술' },
      { name: '사이다', amount: '1컵' },
      { name: '식초', amount: '3큰술' },
      { name: '생수', amount: '1컵' },
      { name: '흰설탕', amount: '4큰술' },
      { name: '고춧가루', amount: '5큰술' },
      { name: '소금', amount: '1큰술' },
      { name: '참기름', amount: '2큰술' },
      { name: '통깨', amount: '3큰술', note: '갈지 않고 그대로 사용' },
      { name: '후추가루', amount: '약간' },
    ],
    steps: [
      {
        order: 1,
        text: '배·대파·마늘·양파·황도·오이를 믹서기에 곱게 갈아서 준비합니다. 오이는 진한 씨 부분이 쓴맛이 날 수 있으므로 제거 후 갈아줍니다.',
      },
      {
        order: 2,
        text: '큰 다라이(대형 볼)에 간장·물엿·사이다·식초·생수·흰설탕을 넣고 설탕이 녹을 때까지 잘 저어 섞습니다.',
      },
      {
        order: 3,
        text: '갈아놓은 배·대파·황도·마늘·오이·양파를 다라이에 넣고 거품기로 잘 섞습니다.',
      },
      {
        order: 4,
        text: '분량의 고춧가루를 넣고 고르게 섞습니다. 색이 예쁜 붉은색이 나와야 합니다.',
      },
      {
        order: 5,
        text: '소금·참기름·통깨·후추가루를 넣고 잘 저어 마무리합니다. 통깨는 갈지 않고 그대로 넣어야 씹는 식감이 삽니다.',
      },
      {
        order: 6,
        text: '용기에 담아 냉장 보관 후 5일이 지나면 실전에 사용합니다. 숙성될수록 맛이 더 깊어집니다.',
      },
    ],
    tips: [
      '오이의 진한 씨 부분을 제거하지 않으면 쓴맛이 날 수 있습니다. 껍질 쪽만 사용하세요.',
      '황도를 넣으면 은은한 과일 향과 단맛이 나면서 비빔장이 부드러워집니다.',
      '냉장 보관 시 30일, 냉동 시 3개월까지 유지됩니다. 대량으로 만들어두면 편리합니다.',
      '블라인드 테스트에서도 합격한 레시피입니다. 이름 걸고 만든 레시피니 비율을 정확히 지키세요.',
      '냉면 외에도 쫄면·비빔국수·비빔밥에 응용할 수 있습니다.',
    ],
    tags: ['냉면비빔장', '냉면다데기', '비빔장', '고깃집', '냉면전문점', '천연양념'],
    chef: '쉐프케이',
    source: 'recipekorea.com S17240 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=17240',
    publishedAt: '2026-03-20',
    featured: true,
    viewCount: 212755,
  },

  // ────────────────────────────────────────────────────────
  // 7. 물회 소스
  // 참고: recipekorea.com S83367
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-007',
    title: '물회 소스 황금 비율',
    subtitle: '부드럽고 시원한 여름 대표 메뉴',
    excerpt: '고추장 베이스에 식초와 설탕의 비율로 맛을 잡는 물회 소스. 생선회·해물·야채 물회 모두 이 한 가지 소스로 커버됩니다. 미리 대량으로 만들어 냉장 보관하면 여름 성수기에 빠른 조리가 가능합니다.',
    category: 'korean',
    difficulty: 'easy',
    cookingTime: 10,
    servings: 10,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2989/d38faf3e-4b9b-45fd-b032-0afc71980a7d.jpg',
    ingredients: [
      { name: '고추장', amount: '5큰술', note: '소스 베이스' },
      { name: '고춧가루', amount: '1큰술', note: '색·매운맛' },
      { name: '식초', amount: '5큰술', note: '새콤한 맛' },
      { name: '설탕', amount: '3큰술', note: '단맛' },
      { name: '물엿', amount: '2큰술', note: '윤기·점도' },
      { name: '다진 마늘', amount: '1½큰술' },
      { name: '생강즙', amount: '1작은술' },
      { name: '참기름', amount: '1큰술' },
      { name: '통깨', amount: '1큰술' },
      { name: '얼음물', amount: '1~2컵', note: '서빙 시 희석' },
      { name: '배즙(또는 사이다)', amount: '2큰술', note: '감칠맛·청량감' },
    ],
    steps: [
      {
        order: 1,
        text: '고추장·고춧가루·식초·설탕·물엿을 볼에 넣고 설탕이 완전히 녹을 때까지 잘 섞습니다.',
      },
      {
        order: 2,
        text: '다진 마늘·생강즙·배즙을 넣고 섞습니다. 배즙은 감칠맛을 더해주고 고추장의 텁텁함을 중화시킵니다.',
      },
      {
        order: 3,
        text: '참기름·통깨를 넣고 마무리합니다. 이 상태가 소스 원액입니다.',
      },
      {
        order: 4,
        text: '서빙 시 소스 원액 3큰술에 얼음물 1컵을 섞어 희석해서 사용합니다. 물양은 취향에 맞게 조절하세요.',
      },
    ],
    tips: [
      '소스 원액은 냉장 보관 시 2주일 유지됩니다. 여름 성수기 전에 대량으로 만들어두세요.',
      '식초:설탕 비율(5:3)을 유지하면 항상 같은 맛이 납니다. 이 비율이 핵심입니다.',
      '배즙 대신 사이다를 쓰면 청량감이 더 강해집니다. 매장 콘셉트에 맞게 선택하세요.',
      '회 물회에는 참돔·광어·연어가 잘 어울리고, 해물 물회에는 문어·새우·소라를 쓰면 좋습니다.',
      '얼음을 많이 넣어 아주 차게 서빙해야 물회 본연의 맛이 납니다.',
    ],
    tags: ['물회', '물회소스', '여름메뉴', '해산물', '한식', '소스'],
    chef: '쉐프캔짱',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=83367',
    publishedAt: '2026-05-10',
    featured: false,
    viewCount: 9820,
  },

  // ────────────────────────────────────────────────────────
  // 8. 해물쌈장 종결 레시피
  // 참고: recipekorea.com (쌈장에서 막장해물쌈장까지)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-008',
    title: '해물쌈장 종결 레시피',
    subtitle: '고깃집·쌈밥집 재방문을 부르는 쌈장',
    excerpt: '새우젓과 두부를 넣어 부드럽게 완성한 해물쌈장. 일반 쌈장과 차별화된 감칠맛으로 손님이 왜 맛있냐고 물어보는 레시피입니다. 고기 굽는 냄새와 함께 쌈으로 싸 먹으면 재방문율이 올라갑니다.',
    category: 'side',
    difficulty: 'easy',
    cookingTime: 15,
    servings: 8,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/289/591e4038-5ba3-4aac-93ec-a9ba1f3660a0.jpg',
    ingredients: [
      { name: '된장', amount: '3큰술' },
      { name: '고추장', amount: '2큰술' },
      { name: '두부', amount: '¼모', note: '으깨서' },
      { name: '양파', amount: '¼개', note: '잘게 다지기' },
      { name: '청양고추', amount: '2개', note: '잘게 다지기' },
      { name: '홍고추', amount: '1개', note: '잘게 다지기' },
      { name: '새우젓', amount: '1큰술' },
      { name: '다진 마늘', amount: '1½큰술' },
      { name: '참기름', amount: '1큰술' },
      { name: '깨소금', amount: '1큰술' },
      { name: '설탕', amount: '1작은술' },
      { name: '물', amount: '2큰술' },
    ],
    steps: [
      {
        order: 1,
        text: '두부를 면포나 키친타올로 꼭 짜서 수분을 제거한 뒤 으깹니다.',
      },
      {
        order: 2,
        text: '양파·청양고추·홍고추를 아주 잘게 다집니다.',
      },
      {
        order: 3,
        text: '팬에 식용유를 두르고 다진 양파를 중불에서 1분간 볶아 단맛을 냅니다.',
      },
      {
        order: 4,
        text: '볶은 양파에 된장·고추장·새우젓·다진 마늘·설탕·물을 넣고 약불에서 2~3분간 끓이듯 볶습니다. 된장이 팬 바닥에 눌어붙지 않도록 계속 저어줍니다.',
      },
      {
        order: 5,
        text: '으깬 두부·청양고추·홍고추를 넣고 1분 더 볶습니다.',
      },
      {
        order: 6,
        text: '불을 끄고 참기름·깨소금을 넣어 마무리합니다. 식히면 더 맛있습니다.',
      },
    ],
    tips: [
      '된장 브랜드에 따라 염도가 다르므로 처음에 소량 만들어 맛을 본 후 간을 조절하세요.',
      '두부를 넣으면 쌈장이 더 부드럽고 크리미해져 손님 반응이 훨씬 좋아집니다.',
      '냉장 보관 시 1주일 유지됩니다. 업소에서는 주 1회 대량으로 만들어두는 것이 효율적입니다.',
      '표고버섯을 잘게 다져 넣으면 감칠맛이 더 깊어집니다.',
      '서빙 직전에 약간 데워서 내면 따뜻한 상태로 더 맛있게 즐길 수 있습니다.',
    ],
    tags: ['쌈장', '해물쌈장', '고깃집', '쌈밥집', '밑반찬', '된장'],
    chef: '한상대첩',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502',
    publishedAt: '2026-04-05',
    featured: false,
    viewCount: 11240,
  },

  // ────────────────────────────────────────────────────────
  // 9. 소금 돼지갈비구이
  // 참고: recipekorea.com S82337 (재야의고수)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-009',
    title: '소금 돼지갈비구이',
    subtitle: '고깃집 시그니처 메뉴, 재방문 책임지는 레시피',
    excerpt: '양념 없이 소금과 마늘만으로 완성하는 소금 돼지갈비. 고기 본연의 맛을 살리면서도 잡내가 없는 깔끔한 맛이 특징입니다. 차별화된 소금 구성과 숙성이 포인트입니다.',
    category: 'meat',
    difficulty: 'medium',
    cookingTime: 30,
    servings: 3,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2992/8014c964-a9e9-41aa-b14f-1c5dd981f717.jpg',
    ingredients: [
      { name: '돼지 갈비', amount: '1kg' },
      { name: '굵은 천일염', amount: '1½큰술' },
      { name: '후추', amount: '1작은술' },
      { name: '마늘', amount: '6쪽' },
      { name: '배', amount: '¼개' },
      { name: '맛술(청주)', amount: '3큰술' },
      { name: '참기름', amount: '1큰술' },
      { name: '생강', amount: '1톨' },
      { name: '로즈마리(선택)', amount: '약간' },
    ],
    steps: [
      {
        order: 1,
        text: '돼지갈비를 찬물에 30분 담가 핏물을 뺍니다. 큰 뼈와 뼈 사이를 칼로 잘라 손질합니다.',
      },
      {
        order: 2,
        text: '배를 강판에 갈고, 생강도 강판에 갑니다. 마늘은 편 썰어 준비합니다.',
      },
      {
        order: 3,
        text: '손질한 갈비에 맛술을 먼저 넣어 버무려 잡내를 제거합니다.',
      },
      {
        order: 4,
        text: '굵은 천일염·후추·갈은 배·갈은 생강을 넣고 고루 버무립니다. 이때 편 마늘을 끼워 냉장에서 최소 2시간 숙성합니다. 하룻밤 숙성이 가장 좋습니다.',
      },
      {
        order: 5,
        text: '구울 때는 마늘을 제거하고 강불에 올립니다. 처음 1~2분은 뚜껑 없이 강불로 겉면을 익히고, 이후 약불로 줄여 속까지 천천히 굽습니다.',
      },
      {
        order: 6,
        text: '완전히 익으면 참기름을 살짝 바르고 마무리합니다. 로즈마리를 올려 장식하면 고급스러운 비주얼이 됩니다.',
      },
    ],
    tips: [
      '소금은 반드시 굵은 천일염을 써야 합니다. 정제염은 짠맛만 강해져 고기 맛을 죽입니다.',
      '배즙을 넣으면 고기가 부드러워지고 잡내가 사라집니다. 배즙 대신 키위즙도 효과적입니다.',
      '업소에서는 전날 밤에 담가두면 다음날 맛이 훨씬 좋습니다. 일관된 맛 관리가 핵심입니다.',
      '구울 때 마늘이 타면 쓴맛이 나므로 구이 시작 전 제거하세요.',
      '뼈가 있는 갈비는 수육형으로, 갈비살만 발라내면 덮밥·도시락 메뉴로도 응용 가능합니다.',
    ],
    tags: ['소금갈비', '돼지갈비', '고깃집', '구이', '소금구이', '업소용'],
    chef: '재야의고수',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82337',
    publishedAt: '2026-04-12',
    featured: true,
    viewCount: 19600,
  },

  // ────────────────────────────────────────────────────────
  // 10. 마산식 아귀찜
  // 참고: recipekorea.com (쉐프케이 마산아귀찜 인기레시피)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-010',
    title: '마산식 아귀찜',
    subtitle: '전문점보다 맛있는 얼큰 콩나물 아귀찜',
    excerpt: '콩나물·미더덕과 함께 버무리는 정통 마산식 아귀찜. 아귀의 쫄깃한 살과 콩나물의 아삭함, 미더덕의 향이 어우러진 이 레시피는 블라인드 테스트에서도 전문점 이상의 평가를 받은 레시피입니다.',
    category: 'korean',
    difficulty: 'medium',
    cookingTime: 45,
    servings: 3,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/3011/1d71793c-b675-4d3a-bf3d-6fdf602492cf.jpg',
    ingredients: [
      { name: '아귀', amount: '1kg (손질된 것)' },
      { name: '콩나물', amount: '300g' },
      { name: '미더덕', amount: '150g' },
      { name: '미나리', amount: '100g' },
      { name: '대파', amount: '2대' },
      { name: '고춧가루', amount: '7큰술', note: '양념' },
      { name: '간장', amount: '3큰술', note: '양념' },
      { name: '다진 마늘', amount: '3큰술', note: '양념' },
      { name: '다진 생강', amount: '1큰술', note: '양념' },
      { name: '된장', amount: '1큰술', note: '양념 (잡내 제거)' },
      { name: '물엿', amount: '2큰술', note: '양념' },
      { name: '참기름', amount: '2큰술', note: '양념' },
      { name: '소금·후추', amount: '약간', note: '양념' },
      { name: '맛술', amount: '2큰술', note: '잡내 제거' },
      { name: '물(또는 육수)', amount: '½컵' },
    ],
    steps: [
      {
        order: 1,
        text: '손질된 아귀를 한 입 크기(5cm)로 자르고 맛술을 뿌려 10분간 잡내를 제거합니다. 미더덕은 씻어 준비하고, 콩나물은 꼬리를 제거합니다.',
      },
      {
        order: 2,
        text: '양념 재료(고춧가루·간장·다진 마늘·다진 생강·된장·물엿·참기름·소금·후추)를 한데 섞어 양념장을 만듭니다.',
      },
      {
        order: 3,
        text: '아귀에 양념장 절반을 넣어 버무린 후 10분 재워둡니다.',
      },
      {
        order: 4,
        text: '큰 냄비(또는 팬) 바닥에 콩나물을 깔고, 그 위에 양념한 아귀와 미더덕을 올립니다. 물(육수)을 붓고 강불에서 끓입니다.',
      },
      {
        order: 5,
        text: '끓어오르면 뚜껑을 덮고 중불에서 10분간 찝니다. 나머지 양념장을 넣고 뒤집어 가며 2~3분 더 볶습니다.',
      },
      {
        order: 6,
        text: '미나리와 어슷썬 대파를 올리고 강불에서 1분, 불을 끄고 참기름을 두르면 완성입니다.',
      },
    ],
    tips: [
      '아귀는 될 수 있으면 살아있는 것을 당일 손질해 쓰는 것이 가장 좋습니다. 냉동 아귀는 완전히 해동 후 물기를 꼭 제거하세요.',
      '된장을 양념에 조금 넣으면 아귀 특유의 비린 맛이 잡힙니다. 이것이 전문점 맛의 비결입니다.',
      '콩나물은 뚜껑을 열지 않고 쪄야 비린 맛이 나지 않습니다.',
      '미더덕은 과하게 가열하면 향이 날아가므로 마지막 5분에만 함께 익히는 것이 좋습니다.',
      '업소에서는 양념장을 미리 대량으로 만들어두고, 주문 시 아귀·콩나물과 함께 즉석 조리하면 빠른 서빙이 가능합니다.',
    ],
    tags: ['아귀찜', '마산아귀찜', '해산물', '한식', '얼큰', '전문점'],
    chef: '쉐프케이',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502',
    publishedAt: '2026-03-15',
    featured: true,
    viewCount: 58300,
  },

  // ────────────────────────────────────────────────────────
  // 11. 부산식 낙지볶음
  // 참고: recipekorea.com S82119 (단일 창업 메뉴로도 손색없습니다)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-011',
    title: '부산식 낙지볶음',
    subtitle: '단일 창업 메뉴로도 손색없는 얼큰 낙지',
    excerpt: '부산 스타일의 진하고 얼큰한 낙지볶음. 낙지의 쫄깃한 식감을 살리면서도 매콤달콤한 양념이 밥도둑이 되는 레시피입니다. 단일 메뉴 창업도 가능한 검증된 업소용 레시피입니다.',
    category: 'korean',
    difficulty: 'easy',
    cookingTime: 20,
    servings: 2,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/289/591e4038-5ba3-4aac-93ec-a9ba1f3660a0.jpg',
    ingredients: [
      { name: '낙지', amount: '2마리 (300g)' },
      { name: '양파', amount: '½개' },
      { name: '대파', amount: '1대' },
      { name: '청양고추', amount: '2개' },
      { name: '홍고추', amount: '1개' },
      { name: '애호박', amount: '¼개' },
      { name: '식용유', amount: '2큰술' },
      { name: '참기름', amount: '1큰술' },
      { name: '통깨', amount: '약간' },
      { name: '고추장', amount: '2큰술', note: '양념' },
      { name: '고춧가루', amount: '2큰술', note: '양념' },
      { name: '간장', amount: '1½큰술', note: '양념' },
      { name: '설탕', amount: '1큰술', note: '양념' },
      { name: '물엿', amount: '1큰술', note: '양념' },
      { name: '다진 마늘', amount: '1½큰술', note: '양념' },
      { name: '다진 생강', amount: '½작은술', note: '양념' },
      { name: '후추', amount: '약간', note: '양념' },
    ],
    steps: [
      { order: 1, text: '낙지를 굵은 소금과 밀가루로 박박 씻어 점액을 제거합니다. 끓는 물에 30초만 데쳐 바로 찬물에 식히면 쫄깃한 식감이 살아납니다. 먹기 좋게 5cm로 자릅니다.' },
      { order: 2, text: '양파는 굵게 채 썰고, 대파는 어슷썰고, 청양고추·홍고추는 어슷 썰고, 애호박은 반달 썰기합니다.' },
      { order: 3, text: '양념 재료를 모두 섞어 양념장을 만듭니다.' },
      { order: 4, text: '강불로 달군 팬에 식용유를 두르고 양파·애호박을 1분 볶습니다.' },
      { order: 5, text: '낙지를 넣고 양념장을 붓습니다. 강불에서 1~2분 빠르게 볶습니다. 낙지는 오래 볶으면 질겨지므로 빠르게 볶는 것이 핵심입니다.' },
      { order: 6, text: '대파·청양고추·홍고추를 넣고 30초 더 볶은 뒤 불을 끄고 참기름·통깨로 마무리합니다.' },
    ],
    tips: [
      '낙지는 데치지 않고 생으로 볶아도 되지만, 살짝 데치면 식감이 더 쫄깃하고 물이 덜 생깁니다.',
      '업소에서는 낙지를 미리 손질해 냉장 보관하고, 주문 시 양념장과 바로 볶아 서빙하면 빠른 제공이 가능합니다.',
      '매운맛을 줄이려면 청양고추를 빼고 홍고추만 사용하면 됩니다.',
      '낙지 대신 주꾸미를 사용해도 비슷한 맛이 납니다. 원가에 맞게 선택하세요.',
    ],
    tags: ['낙지볶음', '낙지', '부산식', '얼큰', '한식', '단일창업'],
    chef: '쉐프캔짱',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82119',
    publishedAt: '2026-04-18',
    featured: false,
    viewCount: 15600,
  },

  // ────────────────────────────────────────────────────────
  // 12. 명품 뚝배기 된장찌개
  // 참고: recipekorea.com S82021 (재야의고수 - 단골이 늘어나는)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-012',
    title: '명품 뚝배기 된장찌개',
    subtitle: '단골이 늘어나는 깊은 맛의 된장찌개',
    excerpt: '멸치 다시마 육수에 직접 만든 된장을 풀어 끓이는 명품 된장찌개. 식당에서 된장찌개 하나만 잘 만들어도 점심 장사가 된다는 말처럼, 단골을 만드는 핵심 메뉴입니다.',
    category: 'soup',
    difficulty: 'easy',
    cookingTime: 30,
    servings: 2,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/3011/f2ac269b-8730-4c30-8694-2b3c6d8324b2.jpg',
    ingredients: [
      { name: '된장', amount: '2½큰술' },
      { name: '고추장', amount: '½큰술', note: '감칠맛용' },
      { name: '두부', amount: '½모' },
      { name: '애호박', amount: '¼개' },
      { name: '감자', amount: '½개' },
      { name: '양파', amount: '¼개' },
      { name: '표고버섯', amount: '2개' },
      { name: '청양고추', amount: '1개' },
      { name: '홍고추', amount: '½개' },
      { name: '대파', amount: '¼대' },
      { name: '다진 마늘', amount: '1큰술' },
      { name: '멸치 다시마 육수', amount: '500ml', note: '밑국물' },
      { name: '새우젓', amount: '½작은술', note: '간 조절' },
    ],
    steps: [
      { order: 1, text: '멸치 다시마 육수를 미리 준비합니다. 국물용 멸치 10마리와 다시마 1조각을 찬물에 넣고 센 불에서 끓이다가 끓어오르면 다시마를 건지고 5분 더 끓인 후 멸치도 건집니다.' },
      { order: 2, text: '감자는 1.5cm 큐브로, 애호박·두부는 한 입 크기로, 양파·표고버섯은 굵게 썹니다.' },
      { order: 3, text: '뚝배기에 육수를 붓고 된장·고추장을 풀어 약불에서 저어가며 녹입니다. 된장이 충분히 녹아야 텁텁하지 않습니다.' },
      { order: 4, text: '감자·양파를 먼저 넣고 중불에서 7~8분 끓입니다. 감자가 어느 정도 익어야 다른 재료와 균형이 맞습니다.' },
      { order: 5, text: '두부·애호박·표고버섯·다진 마늘을 넣고 5분 더 끓입니다. 새우젓으로 간을 조절합니다.' },
      { order: 6, text: '청양고추·홍고추·대파를 올리고 1분 더 끓여 상에 냅니다. 뚝배기는 보온이 오래 되므로 테이블에서 계속 보글보글 끓는 상태로 서빙할 수 있습니다.' },
    ],
    tips: [
      '된장은 국산 재래된장을 쓰면 훨씬 맛이 깊습니다. 공장된장에 재래된장을 7:3으로 섞어 써도 좋습니다.',
      '감자를 넣으면 국물이 자연스럽게 걸쭉해지고 포만감이 올라갑니다.',
      '육수를 멸치 다시마 육수로 쓰면 별도의 조미료 없이도 감칠맛이 납니다. 이게 가정용과의 차이입니다.',
      '업소에서는 육수를 아침에 대량으로 끓여 보관하고, 주문 시 뚝배기에 붓고 된장을 풀어 바로 끓이면 됩니다.',
      '시래기·콩나물을 추가하면 더 푸짐한 된장찌개가 됩니다.',
    ],
    tags: ['된장찌개', '뚝배기', '한식', '단골', '정식', '찌개'],
    chef: '재야의고수',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82021',
    publishedAt: '2026-03-25',
    featured: false,
    viewCount: 22100,
  },

  // ────────────────────────────────────────────────────────
  // 13. 업소용 동태탕
  // 참고: recipekorea.com S80957 (쉐프캔짱 - 극찬받은 다데기)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-013',
    title: '업소용 동태탕',
    subtitle: '시원하고 칼칼한 해장국 1등 메뉴',
    excerpt: '얼큰하고 시원한 동태탕. 제대로 만든 다데기(양념)가 핵심으로, 동태의 비린내 없이 깊은 국물 맛이 납니다. 해장국·탕 전문점의 겨울 필수 메뉴입니다.',
    category: 'soup',
    difficulty: 'medium',
    cookingTime: 35,
    servings: 3,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/3011/1d71793c-b675-4d3a-bf3d-6fdf602492cf.jpg',
    ingredients: [
      { name: '동태 (토막)', amount: '1마리 (600g)' },
      { name: '콩나물', amount: '200g' },
      { name: '무', amount: '200g' },
      { name: '두부', amount: '½모' },
      { name: '대파', amount: '2대' },
      { name: '미나리', amount: '50g' },
      { name: '달걀', amount: '1개' },
      { name: '물(멸치육수)', amount: '1.2L' },
      { name: '고춧가루', amount: '3큰술', note: '다데기' },
      { name: '고추장', amount: '1큰술', note: '다데기' },
      { name: '된장', amount: '1작은술', note: '다데기 (비린내 제거)' },
      { name: '다진 마늘', amount: '2큰술', note: '다데기' },
      { name: '다진 생강', amount: '1작은술', note: '다데기' },
      { name: '간장', amount: '1큰술', note: '다데기' },
      { name: '새우젓', amount: '1큰술', note: '간 조절' },
      { name: '소금', amount: '약간' },
    ],
    steps: [
      { order: 1, text: '동태는 내장을 제거하고 깨끗이 씻어 5~6cm 토막으로 자릅니다. 무는 1cm 두께 나박썰기, 두부는 큼직하게 썹니다.' },
      { order: 2, text: '다데기 재료(고춧가루·고추장·된장·다진 마늘·다진 생강·간장)를 섞어 양념장을 만듭니다.' },
      { order: 3, text: '냄비에 물(멸치육수)을 붓고 무를 넣어 강불에서 끓입니다. 무가 반쯤 익으면 다데기를 넣어 풀어줍니다.' },
      { order: 4, text: '콩나물을 넣고 뚜껑을 덮어 3분간 강불에서 끓입니다. 중간에 뚜껑을 열면 콩나물 비린내가 날 수 있으므로 열지 않습니다.' },
      { order: 5, text: '동태를 넣고 중불에서 10분간 끓입니다. 두부를 넣고 새우젓으로 간을 맞춥니다.' },
      { order: 6, text: '달걀을 풀어 넣고, 대파·미나리를 올려 1분 더 끓이면 완성입니다.' },
    ],
    tips: [
      '동태는 냉동 상태에서 반 해동 상태로 썰어야 깔끔하게 잘립니다.',
      '된장을 다데기에 소량 넣으면 동태 특유의 비린내가 잡힙니다. 이것이 전문점 맛의 비결입니다.',
      '콩나물은 반드시 뚜껑을 덮고 끓여야 아린 맛이 안 납니다.',
      '업소에서는 다데기를 미리 대량으로 만들어 냉장 보관하면 편리합니다.',
      '동태 대신 명태·황태·대구를 사용해도 같은 방법으로 만들 수 있습니다.',
    ],
    tags: ['동태탕', '해장국', '탕', '한식', '겨울메뉴', '얼큰'],
    chef: '쉐프캔짱',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=80957',
    publishedAt: '2026-03-10',
    featured: false,
    viewCount: 17800,
  },

  // ────────────────────────────────────────────────────────
  // 14. 들깨 시래기국
  // 참고: recipekorea.com (쉐프케이 무료 공개 레시피)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-014',
    title: '들깨 시래기국',
    subtitle: '구수하고 든든한 겨울 보양 국물',
    excerpt: '삶은 시래기에 들깻가루를 넣어 끓이는 구수한 국. 재료 원가가 낮으면서도 영양이 풍부해 정식·백반집에서 인기가 높은 메뉴입니다. 미리 대량으로 준비해두기 좋습니다.',
    category: 'soup',
    difficulty: 'easy',
    cookingTime: 40,
    servings: 4,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2989/c9ed5148-b5d0-49d3-ba76-6460a77ea73e.jpg',
    ingredients: [
      { name: '삶은 시래기', amount: '300g' },
      { name: '들깻가루', amount: '4큰술' },
      { name: '된장', amount: '1½큰술' },
      { name: '다진 마늘', amount: '1½큰술' },
      { name: '국간장', amount: '1큰술' },
      { name: '멸치 다시마 육수', amount: '1.2L' },
      { name: '대파', amount: '1대' },
      { name: '청양고추', amount: '1개', note: '선택' },
      { name: '들기름', amount: '1큰술' },
      { name: '소금', amount: '약간' },
    ],
    steps: [
      { order: 1, text: '시래기는 미리 삶아 준비합니다. 말린 시래기는 물에 10시간 이상 불린 뒤 40분간 삶고 찬물에 헹궈 적당한 길이(5cm)로 자릅니다.' },
      { order: 2, text: '냄비에 들기름을 두르고 시래기를 넣어 중불에서 2~3분 볶습니다. 들기름으로 볶아야 구수한 향이 납니다.' },
      { order: 3, text: '된장을 넣어 시래기에 고루 묻히듯 1분 더 볶습니다.' },
      { order: 4, text: '멸치 다시마 육수를 붓고 강불로 끓입니다. 끓어오르면 다진 마늘·국간장을 넣고 중불로 15분 더 끓입니다.' },
      { order: 5, text: '들깻가루를 넣고 잘 풀어 5분 더 끓입니다. 들깻가루가 고르게 녹아야 구수한 맛이 납니다.' },
      { order: 6, text: '소금으로 간을 맞추고 대파·청양고추를 올려 마무리합니다.' },
    ],
    tips: [
      '들깻가루는 마지막에 넣어야 고소한 향이 살아납니다. 너무 일찍 넣으면 향이 날아갑니다.',
      '삶은 시래기를 대량으로 준비해 냉동 보관하면 필요할 때마다 바로 사용할 수 있습니다.',
      '된장은 너무 많이 넣으면 짜지므로 소량씩 맛을 보며 조절하세요.',
      '돼지고기 사태나 등뼈를 함께 넣으면 더 진한 국물이 납니다.',
    ],
    tags: ['시래기국', '들깨', '된장', '한식', '백반', '보양식'],
    chef: '쉐프케이',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502',
    publishedAt: '2026-02-28',
    featured: false,
    viewCount: 8400,
  },

  // ────────────────────────────────────────────────────────
  // 15. 배추 겉절이
  // 참고: recipekorea.com P82092 / 2095 (겉절이 특제소스)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-015',
    title: '배추 겉절이 황금 소스',
    subtitle: '새콤달콤 즉석 겉절이, 대박 집들의 비법',
    excerpt: '절이지 않고 바로 버무리는 즉석 겉절이. 새콤달콤한 특제 소스 비율만 지키면 항상 같은 맛이 납니다. 칼국수집·냉면집·한정식에서 기본 반찬으로 제공하면 손님 반응이 최고입니다.',
    category: 'side',
    difficulty: 'easy',
    cookingTime: 15,
    servings: 6,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2975/278971c9-423c-4c68-8076-373f22531044.jpg',
    ingredients: [
      { name: '배추', amount: '¼포기' },
      { name: '쪽파', amount: '5대' },
      { name: '당근', amount: '¼개', note: '채 썰기' },
      { name: '고춧가루', amount: '3큰술', note: '소스' },
      { name: '멸치액젓', amount: '2큰술', note: '소스' },
      { name: '식초', amount: '1½큰술', note: '소스' },
      { name: '설탕', amount: '1큰술', note: '소스' },
      { name: '다진 마늘', amount: '1큰술', note: '소스' },
      { name: '다진 생강', amount: '¼작은술', note: '소스' },
      { name: '참기름', amount: '1큰술', note: '소스' },
      { name: '통깨', amount: '1큰술', note: '소스' },
      { name: '매실액', amount: '1큰술', note: '단맛·감칠맛' },
    ],
    steps: [
      { order: 1, text: '배추를 한 입 크기로 잘라 큰 볼에 담습니다. 소금에 절이지 않고 바로 쓰는 것이 겉절이의 특징입니다.' },
      { order: 2, text: '쪽파는 3cm로, 당근은 가늘게 채 썰어 배추와 함께 담습니다.' },
      { order: 3, text: '소스 재료(고춧가루·액젓·식초·설탕·다진 마늘·생강·참기름·통깨·매실액)를 볼에 섞어 소스를 만듭니다.' },
      { order: 4, text: '배추에 소스를 붓고 손으로 가볍게 버무립니다. 너무 세게 주무르면 숨이 죽어 식감이 나빠집니다.' },
      { order: 5, text: '바로 서빙하면 아삭하고 신선한 겉절이가 완성됩니다. 냉장에서 하룻밤 두면 양념이 배어 또 다른 맛이 납니다.' },
    ],
    tips: [
      '겉절이는 주문 즉시 버무려 서빙해야 가장 아삭합니다. 미리 버무려두면 숨이 죽습니다.',
      '소스는 미리 10배 분량으로 만들어 냉장 보관하면 1주일간 사용 가능합니다.',
      '식초와 매실액의 조합이 신맛의 핵심입니다. 식초만 쓰면 너무 자극적이고, 매실액만 쓰면 향이 강합니다.',
      '배추 대신 봄동이나 알배추를 쓰면 더 달고 부드러운 겉절이가 됩니다.',
    ],
    tags: ['겉절이', '배추', '즉석겉절이', '밑반찬', '칼국수집', '한식'],
    chef: '대령숙수',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82092',
    publishedAt: '2026-04-02',
    featured: false,
    viewCount: 13500,
  },

  // ────────────────────────────────────────────────────────
  // 16. 닭불고기
  // 참고: recipekorea.com S81822 (재야의고수 - 입에 착착 감기는)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-016',
    title: '닭불고기',
    subtitle: '입에 착착 감기는 달콤 매콤 닭 요리',
    excerpt: '달콤매콤한 양념에 재운 닭을 강불에 구워내는 닭불고기. 닭갈비보다 조리가 간단하면서도 맛은 그에 못지않아 단일 메뉴 창업에 적합합니다. 배달·홀·도시락 모든 형태로 응용 가능합니다.',
    category: 'meat',
    difficulty: 'easy',
    cookingTime: 25,
    servings: 2,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2992/8014c964-a9e9-41aa-b14f-1c5dd981f717.jpg',
    ingredients: [
      { name: '닭다리살 (또는 닭가슴살)', amount: '400g' },
      { name: '양파', amount: '½개' },
      { name: '대파', amount: '1대' },
      { name: '고추장', amount: '3큰술', note: '양념' },
      { name: '간장', amount: '2큰술', note: '양념' },
      { name: '설탕', amount: '1큰술', note: '양념' },
      { name: '물엿', amount: '1큰술', note: '양념' },
      { name: '고춧가루', amount: '1큰술', note: '양념' },
      { name: '다진 마늘', amount: '1½큰술', note: '양념' },
      { name: '다진 생강', amount: '½작은술', note: '양념' },
      { name: '맛술(청주)', amount: '2큰술', note: '양념 (잡내 제거)' },
      { name: '참기름', amount: '1큰술', note: '양념' },
      { name: '후추', amount: '약간', note: '양념' },
    ],
    steps: [
      { order: 1, text: '닭다리살을 한 입 크기(4cm)로 자릅니다. 껍질을 제거하면 담백하고, 남기면 고소합니다.' },
      { order: 2, text: '양념 재료를 모두 섞어 양념장을 만들고, 닭고기에 버무려 최소 30분(가능하면 2시간 이상) 냉장에서 재워둡니다.' },
      { order: 3, text: '양파는 굵게 채 썰고, 대파는 어슷썹니다.' },
      { order: 4, text: '강불로 달군 팬에 식용유를 두르고 재운 닭고기를 넣어 겉면이 노릇해질 때까지 굽습니다. 처음 2분간은 뒤집지 않습니다.' },
      { order: 5, text: '닭고기가 70% 익으면 양파를 넣고 함께 볶습니다.' },
      { order: 6, text: '대파를 마지막에 넣고 1분 더 볶아 불향을 입힙니다. 참기름을 두르면 완성입니다.' },
    ],
    tips: [
      '닭다리살을 쓰면 촉촉하고, 닭가슴살을 쓰면 담백합니다. 두 부위를 섞어 쓰는 것도 좋습니다.',
      '하루 전날 양념에 재워두면 맛이 훨씬 깊어집니다. 업소에서는 전날 준비하는 것을 추천합니다.',
      '고구마·떡을 함께 볶으면 볼륨이 커지고 단맛이 균형을 맞춰줍니다.',
      '배달 포장 시 밥 위에 얹어 닭불고기 덮밥으로 판매하면 객단가를 높일 수 있습니다.',
    ],
    tags: ['닭불고기', '닭요리', '매콤달콤', '한식', '배달', '단일창업'],
    chef: '재야의고수',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=81822',
    publishedAt: '2026-04-08',
    featured: true,
    viewCount: 24300,
  },

  // ────────────────────────────────────────────────────────
  // 17. 배달 특화 김치볶음밥
  // 참고: recipekorea.com (쉐프본가 - 배달 월매출 1500만)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-017',
    title: '배달 특화 김치볶음밥',
    subtitle: '배달 월매출 1500만원을 만드는 볶음밥',
    excerpt: '김치·스팸·달걀로 만드는 황금 김치볶음밥. 배달 후에도 눅눅해지지 않는 볶음 방법과 포장 노하우가 핵심입니다. 단일 메뉴로 배달 전문점 창업이 가능한 검증된 레시피입니다.',
    category: 'korean',
    difficulty: 'easy',
    cookingTime: 15,
    servings: 1,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/289/591e4038-5ba3-4aac-93ec-a9ba1f3660a0.jpg',
    ingredients: [
      { name: '밥', amount: '1공기 (200g)' },
      { name: '묵은 김치', amount: '100g' },
      { name: '스팸(또는 햄)', amount: '80g' },
      { name: '달걀', amount: '2개' },
      { name: '대파', amount: '¼대' },
      { name: '식용유', amount: '2큰술' },
      { name: '버터', amount: '1큰술' },
      { name: '김칫국물', amount: '1큰술' },
      { name: '간장', amount: '½큰술' },
      { name: '설탕', amount: '½작은술' },
      { name: '참기름', amount: '1작은술' },
      { name: '통깨', amount: '약간' },
      { name: '김가루', amount: '약간', note: '고명' },
    ],
    steps: [
      { order: 1, text: '스팸을 1cm 큐브로 자릅니다. 김치는 잘게 썰고 김칫국물은 따로 챙깁니다. 대파는 잘게 다집니다.' },
      { order: 2, text: '강불로 달군 팬에 식용유를 두르고 스팸을 먼저 볶아 노릇하게 만듭니다.' },
      { order: 3, text: '김치를 넣고 2분간 볶습니다. 김치의 수분이 날아가야 볶음밥이 눅눅해지지 않습니다.' },
      { order: 4, text: '밥을 넣고 강불에서 재빠르게 볶습니다. 김칫국물·간장·설탕을 넣어 색과 맛을 맞추고, 버터를 넣어 고소함을 높입니다.' },
      { order: 5, text: '밥이 고루 볶아지면 한쪽으로 밀어두고, 빈 공간에 달걀을 넣어 스크램블 에그를 만들어 밥과 섞습니다.' },
      { order: 6, text: '대파를 넣고 30초 볶은 후 참기름을 두르고 통깨·김가루를 뿌려 완성합니다.' },
    ],
    tips: [
      '밥은 갓 지은 것보다 조금 식은 밥이나 전날 밥이 볶음밥에 더 좋습니다. 수분이 적어 고슬고슬하게 볶아집니다.',
      '배달용 포장 시 뚜껑을 바로 닫지 말고 30초 정도 식혀서 닫아야 수증기로 눅눅해지는 것을 막을 수 있습니다.',
      '버터를 넣으면 고소한 풍미가 크게 올라갑니다. 원가 대비 효과가 큰 재료입니다.',
      '달걀을 반숙 상태로 위에 올려 서빙하면 비주얼과 맛이 모두 올라갑니다.',
    ],
    tags: ['김치볶음밥', '볶음밥', '배달', '김치', '스팸', '단일창업'],
    chef: '쉐프본가',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82091',
    publishedAt: '2026-04-15',
    featured: false,
    viewCount: 29800,
  },

  // ────────────────────────────────────────────────────────
  // 18. 수육 보쌈 끝판왕
  // 참고: recipekorea.com S81723 (대령숙수 - 인생 수육 종결자)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-018',
    title: '수육 보쌈 끝판왕',
    subtitle: '냄새 없이 부드럽게, 전문점급 수육',
    excerpt: '돼지고기 잡내 없이 부드럽게 삶는 수육의 비법. 된장·된장+청국장 조합과 삶는 물 구성이 핵심입니다. 보쌈 전문점·고깃집·배달 메뉴로 손색없는 레시피입니다.',
    category: 'meat',
    difficulty: 'medium',
    cookingTime: 80,
    servings: 4,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2989/cb2ac419-f747-41b6-be7c-c98df239101d.jpg',
    ingredients: [
      { name: '돼지 삼겹살(또는 앞다리)', amount: '1kg' },
      { name: '된장', amount: '2큰술', note: '삶는 물' },
      { name: '커피(인스턴트)', amount: '1포', note: '삶는 물 - 잡내 제거' },
      { name: '된장국물(또는 청국장)', amount: '1큰술', note: '삶는 물' },
      { name: '대파', amount: '2대', note: '삶는 물' },
      { name: '마늘', amount: '10쪽', note: '삶는 물' },
      { name: '생강', amount: '1톨', note: '삶는 물' },
      { name: '양파', amount: '1개', note: '삶는 물' },
      { name: '통후추', amount: '1큰술', note: '삶는 물' },
      { name: '청주(맛술)', amount: '4큰술', note: '삶는 물' },
      { name: '월계수잎', amount: '3장', note: '삶는 물' },
    ],
    steps: [
      { order: 1, text: '돼지고기를 찬물에 30분 담가 핏물을 뺍니다.' },
      { order: 2, text: '큰 냄비에 물을 충분히 붓고 삶는 물 재료(된장·커피·대파·마늘·생강·양파·통후추·청주·월계수잎)를 넣어 끓입니다.' },
      { order: 3, text: '물이 끓으면 돼지고기를 넣고 강불에서 10분, 이후 중불로 줄여 50~60분 삶습니다. 젓가락으로 가장 두꺼운 부위를 찔러 투명한 국물이 나오면 완성입니다.' },
      { order: 4, text: '삶은 고기를 꺼내 5분간 식힌 후 0.5~0.7cm 두께로 썹니다. 너무 얇으면 부서지고, 너무 두꺼우면 먹기 불편합니다.' },
      { order: 5, text: '배추김치·쌈채소·새우젓·마늘과 함께 플레이팅합니다.' },
    ],
    tips: [
      '커피를 삶는 물에 넣으면 돼지 잡내가 완전히 사라집니다. 인스턴트 커피 1포면 충분합니다.',
      '삶은 후 바로 썰지 말고 5분 정도 식히면 육즙이 안에 머물러 더 촉촉합니다.',
      '남은 삶은 물은 버리지 말고 국물 요리(된장찌개·육수)에 활용하면 경제적입니다.',
      '업소에서는 아침에 대량으로 삶아두고 주문 시 슬라이스해서 바로 서빙하면 됩니다.',
      '냉장 보관 후 다음날 먹으면 육즙이 더 잘 잡혀서 맛있습니다.',
    ],
    tags: ['수육', '보쌈', '돼지고기', '전문점', '한식', '배달'],
    chef: '대령숙수',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=81723',
    publishedAt: '2026-03-18',
    featured: false,
    viewCount: 21400,
  },

  // ────────────────────────────────────────────────────────
  // 19. 코다리찜
  // 참고: recipekorea.com (쉐프본가 - 2천만원 전수교육보다 맛있는)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-019',
    title: '코다리찜',
    subtitle: '2천만원 전수 레시피보다 맛있는 코다리찜',
    excerpt: '쫄깃하고 매콤한 코다리찜. 코다리 특유의 감칠맛을 살리면서 비린내 없이 만드는 것이 핵심입니다. 한정식·백반집·포장마차의 인기 메뉴로 단가 대비 만족도가 높습니다.',
    category: 'korean',
    difficulty: 'medium',
    cookingTime: 45,
    servings: 2,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/3011/f2ac269b-8730-4c30-8694-2b3c6d8324b2.jpg',
    ingredients: [
      { name: '코다리 (반건조 명태)', amount: '2마리 (400g)' },
      { name: '무', amount: '150g' },
      { name: '대파', amount: '1대' },
      { name: '청양고추', amount: '2개' },
      { name: '홍고추', amount: '1개' },
      { name: '고춧가루', amount: '4큰술', note: '양념' },
      { name: '간장', amount: '3큰술', note: '양념' },
      { name: '고추장', amount: '1큰술', note: '양념' },
      { name: '다진 마늘', amount: '2큰술', note: '양념' },
      { name: '다진 생강', amount: '½작은술', note: '양념' },
      { name: '설탕', amount: '1큰술', note: '양념' },
      { name: '물엿', amount: '2큰술', note: '양념' },
      { name: '참기름', amount: '1큰술', note: '양념' },
      { name: '멸치육수(또는 물)', amount: '1컵' },
    ],
    steps: [
      { order: 1, text: '코다리를 찬물에 30분 담가 소금기를 빼고, 3~4토막으로 자릅니다.' },
      { order: 2, text: '무를 1cm 두께 나박썰기하여 냄비 바닥에 깔아둡니다.' },
      { order: 3, text: '양념 재료를 모두 섞어 양념장을 만듭니다.' },
      { order: 4, text: '무 위에 코다리를 올리고 양념장의 절반을 고루 바릅니다. 육수를 붓고 강불에서 끓입니다.' },
      { order: 5, text: '끓어오르면 중불로 줄이고 나머지 양념장을 끼얹어가며 15~20분간 조립니다. 중간에 뒤집어서 양면에 양념이 고루 배도록 합니다.' },
      { order: 6, text: '국물이 자작해지면 대파·청양고추·홍고추를 올리고 참기름을 뿌려 완성합니다.' },
    ],
    tips: [
      '코다리는 너무 짜지 않도록 미리 찬물에 담가 염분을 조절하세요.',
      '무를 먼저 깔면 코다리가 바닥에 눌어붙지 않고 무도 자연스럽게 익습니다.',
      '조리 중 국물을 코다리 위에 계속 끼얹어야 양념이 고루 배고 촉촉하게 완성됩니다.',
      '업소에서는 양념장을 대량으로 만들어두고 주문 시 코다리와 함께 조리하면 됩니다.',
      '코다리 대신 생태·동태를 써도 같은 방법으로 맛있게 만들 수 있습니다.',
    ],
    tags: ['코다리찜', '코다리', '생선찜', '한식', '백반', '포장마차'],
    chef: '쉐프본가',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82078',
    publishedAt: '2026-03-05',
    featured: true,
    viewCount: 38600,
  },

  // ────────────────────────────────────────────────────────
  // 20. 순두부찌개
  // 참고: recipekorea.com (쉐프본가 - 배달 카테고리 1위)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-020',
    title: '업소용 순두부찌개',
    subtitle: '배달 한식 카테고리 1위, 매운 순두부',
    excerpt: '해물·바지락으로 국물을 내고 순두부를 넣어 끓이는 업소용 순두부찌개. 배달 한식 카테고리에서 검증된 1위 메뉴로, 매운맛 조절이 쉬워 다양한 손님층을 공략할 수 있습니다.',
    category: 'soup',
    difficulty: 'easy',
    cookingTime: 20,
    servings: 2,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/3011/f2ac269b-8730-4c30-8694-2b3c6d8324b2.jpg',
    ingredients: [
      { name: '순두부', amount: '1봉 (300g)' },
      { name: '바지락', amount: '150g' },
      { name: '새우(소)', amount: '80g' },
      { name: '달걀', amount: '1개' },
      { name: '대파', amount: '½대' },
      { name: '양파', amount: '¼개' },
      { name: '다진 마늘', amount: '1큰술' },
      { name: '고춧가루', amount: '2큰술', note: '매운맛 조절 가능' },
      { name: '고추기름', amount: '1큰술', note: '색·풍미' },
      { name: '국간장', amount: '1큰술' },
      { name: '새우젓', amount: '1작은술', note: '간 조절' },
      { name: '참기름', amount: '1작은술' },
      { name: '멸치 다시마 육수', amount: '400ml' },
    ],
    steps: [
      { order: 1, text: '바지락은 소금물에 1시간 해감합니다. 새우는 껍질을 제거합니다. 업소에서는 해감된 바지락을 구매하면 편리합니다.' },
      { order: 2, text: '뚝배기에 고추기름을 두르고 다진 마늘·양파를 중불에서 1분 볶습니다.' },
      { order: 3, text: '고춧가루를 넣어 30초 볶아 색을 냅니다. 이 과정이 국물 색을 결정합니다.' },
      { order: 4, text: '멸치 육수를 붓고 바지락·새우를 넣어 강불에서 끓입니다.' },
      { order: 5, text: '바지락이 입을 벌리면 순두부를 숟가락으로 큼직하게 떠 넣습니다. 국간장·새우젓으로 간을 맞춥니다.' },
      { order: 6, text: '달걀을 깨서 가운데 올리고, 대파를 얹어 1분 더 끓인 후 참기름을 두릅니다. 뚝배기째 서빙합니다.' },
    ],
    tips: [
      '고추기름을 먼저 두르면 색이 예쁘게 나고 풍미가 깊어집니다. 고추기름이 없으면 식용유+고춧가루로 대체 가능합니다.',
      '매운맛은 고춧가루 양으로 조절합니다. 안 매운 순두부는 고춧가루를 1큰술로 줄이세요.',
      '바지락 대신 오징어·낙지·굴을 써도 훌륭한 해물 순두부찌개가 됩니다.',
      '업소에서는 뚝배기를 미리 예열해두면 서빙 시까지 보온이 유지됩니다.',
      '배달 시에는 달걀을 완전히 익히는 것보다 반숙 상태로 서빙해야 도착 시 적당한 상태가 됩니다.',
    ],
    tags: ['순두부찌개', '순두부', '해물', '바지락', '배달', '뚝배기'],
    chef: '쉐프본가',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82072',
    publishedAt: '2026-04-28',
    featured: false,
    viewCount: 19200,
  },

  // ────────────────────────────────────────────────────────
  // 21. 업소용 잡채
  // 참고: recipekorea.com (쉐프본가 - 라면 삶는 시간에 완성)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-021',
    title: '업소용 잡채',
    subtitle: '명절·연회·백반집 필수 메뉴',
    excerpt: '당면과 다양한 채소를 간장 양념에 볶아내는 잡채. 미리 각 재료를 준비해두면 주문 즉시 빠르게 완성할 수 있습니다. 잡채 소스 비율만 지키면 항상 일정한 맛이 나는 것이 업소 운영의 핵심입니다.',
    category: 'korean',
    difficulty: 'medium',
    cookingTime: 40,
    servings: 4,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2989/cb2ac419-f747-41b6-be7c-c98df239101d.jpg',
    ingredients: [
      { name: '당면', amount: '200g' },
      { name: '소고기 (우둔살)', amount: '150g' },
      { name: '시금치', amount: '100g' },
      { name: '당근', amount: '½개' },
      { name: '양파', amount: '1개' },
      { name: '표고버섯', amount: '3개' },
      { name: '목이버섯', amount: '30g', note: '불려서' },
      { name: '달걀', amount: '2개', note: '지단용' },
      { name: '식용유', amount: '3큰술' },
      { name: '참기름', amount: '2큰술' },
      { name: '통깨', amount: '1큰술' },
      { name: '간장', amount: '5큰술', note: '잡채 소스' },
      { name: '설탕', amount: '2큰술', note: '잡채 소스' },
      { name: '물엿', amount: '1큰술', note: '잡채 소스' },
      { name: '다진 마늘', amount: '1큰술', note: '잡채 소스' },
      { name: '후추', amount: '약간', note: '잡채 소스' },
    ],
    steps: [
      { order: 1, text: '당면을 끓는 물에 7~8분 삶아 찬물에 헹군 후 먹기 좋게 자릅니다. 너무 길면 먹기 불편합니다.' },
      { order: 2, text: '잡채 소스(간장·설탕·물엿·다진 마늘·후추)를 섞어둡니다.' },
      { order: 3, text: '소고기는 가늘게 채 썰어 소스 1큰술을 넣어 밑간합니다. 표고버섯·당근·양파도 가늘게 채 썹니다.' },
      { order: 4, text: '각 재료를 종류별로 따로 볶습니다. 당근·양파·표고버섯 순서로 볶고, 소고기는 마지막에 따로 볶습니다. 시금치는 데쳐서 물기를 제거합니다.' },
      { order: 5, text: '큰 볼에 당면을 넣고 나머지 잡채 소스를 버무린 후, 볶은 모든 재료를 넣어 함께 버무립니다.' },
      { order: 6, text: '참기름·통깨를 뿌리고, 달걀 지단(채 썬 것)을 올려 플레이팅합니다.' },
    ],
    tips: [
      '잡채 소스 비율(간장:설탕 = 5:2)을 대량으로 만들어 냉장 보관하면 매번 계량하는 수고를 덜 수 있습니다.',
      '각 재료를 따로 볶는 것이 번거롭지만, 한꺼번에 볶으면 수분이 나와 볶음 잡채가 아닌 찜 잡채가 됩니다.',
      '당면은 참기름에 버무려두면 서로 달라붙지 않아 나중에 섞기 편합니다.',
      '업소에서는 재료를 미리 볶아두고 주문 시 당면과 함께 빠르게 버무려 서빙하면 효율적입니다.',
    ],
    tags: ['잡채', '당면', '한식', '명절', '연회', '백반'],
    chef: '쉐프본가',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82081',
    publishedAt: '2026-02-15',
    featured: false,
    viewCount: 16700,
  },

  // ────────────────────────────────────────────────────────
  // 22. LA갈비구이
  // 참고: recipekorea.com S81308 (재야의고수 - 재방문 책임지는)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-022',
    title: 'LA갈비구이',
    subtitle: '재방문을 책임지는 고깃집 시그니처',
    excerpt: '배와 양파를 갈아 만드는 달콤한 LA갈비 양념. 고기 섬유질을 부드럽게 만드는 과일 효소가 핵심으로, 굽자마자 입에서 녹는 식감을 만듭니다. 고깃집·뷔페·도시락 업체의 필수 메뉴입니다.',
    category: 'meat',
    difficulty: 'medium',
    cookingTime: 30,
    servings: 3,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2992/8014c964-a9e9-41aa-b14f-1c5dd981f717.jpg',
    ingredients: [
      { name: 'LA 갈비', amount: '1kg' },
      { name: '배', amount: '½개', note: '갈기' },
      { name: '양파', amount: '½개', note: '갈기' },
      { name: '키위', amount: '½개', note: '갈기 - 연육 효과' },
      { name: '마늘', amount: '6쪽', note: '다지기' },
      { name: '생강', amount: '½톨', note: '다지기' },
      { name: '간장', amount: '6큰술', note: '양념' },
      { name: '설탕', amount: '2큰술', note: '양념' },
      { name: '물엿', amount: '2큰술', note: '양념' },
      { name: '참기름', amount: '1큰술', note: '양념' },
      { name: '후추', amount: '1작은술', note: '양념' },
      { name: '맛술', amount: '2큰술', note: '양념 (잡내 제거)' },
    ],
    steps: [
      { order: 1, text: 'LA갈비를 찬물에 1시간 이상 담가 핏물을 완전히 제거합니다. 핏물 제거가 불충분하면 잡내가 납니다.' },
      { order: 2, text: '배·양파·키위를 강판이나 믹서기에 갈아 과일 양념을 만듭니다.' },
      { order: 3, text: '간장·설탕·물엿·참기름·후추·맛술·다진 마늘·다진 생강을 섞어 양념장을 만들고, 과일 양념과 합칩니다.' },
      { order: 4, text: '핏물 제거한 갈비에 양념장을 골고루 바르고 냉장에서 최소 4시간, 가능하면 하룻밤 숙성합니다.' },
      { order: 5, text: '숯불 또는 강불 그릴에서 굽습니다. 처음에 강불로 양면을 1분씩 구워 마이야르 반응을 만든 후, 중불로 줄여 속까지 익힙니다.' },
      { order: 6, text: '뼈 부분은 불에 직접 닿지 않도록 하고, 고기 부분만 불에 닿게 구워야 뼈가 타지 않습니다.' },
    ],
    tips: [
      '키위를 양념에 넣으면 단백질 분해 효소가 고기를 부드럽게 만듭니다. 단, 너무 오래 재우면 고기가 물러질 수 있으니 24시간을 넘기지 마세요.',
      '업소에서는 전날 미리 양념해 냉장 보관하면 다음날 점심·저녁 서빙이 가능합니다.',
      '숯불 사용 시 맛이 훨씬 좋아집니다. 가스 그릴보다 숯불이 LA갈비에는 최고입니다.',
      '남은 양념에 밥을 볶으면 맛있는 갈비볶음밥이 됩니다. 원가 절감 팁입니다.',
    ],
    tags: ['LA갈비', '갈비', '고깃집', '바비큐', '한식', '뷔페'],
    chef: '재야의고수',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=81308',
    publishedAt: '2026-02-20',
    featured: true,
    viewCount: 33200,
  },

  // ────────────────────────────────────────────────────────
  // 23. 잔치국수
  // 참고: recipekorea.com (쉐프본가 - 언제 먹어도 맛있는 잔치국수)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-023',
    title: '잔치국수 육수 황금 비율',
    subtitle: '칼국수집·분식집 기본 중의 기본',
    excerpt: '멸치·다시마·무로 우려낸 맑고 시원한 잔치국수 육수. 시원하고 깔끔한 국물이 면과 완벽하게 어우러집니다. 원가가 낮고 조리가 빠른 이 메뉴는 칼국수집·분식집의 기본 메뉴입니다.',
    category: 'korean',
    difficulty: 'easy',
    cookingTime: 30,
    servings: 4,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2989/c9ed5148-b5d0-49d3-ba76-6460a77ea73e.jpg',
    ingredients: [
      { name: '소면', amount: '320g (4인분)' },
      { name: '달걀', amount: '2개', note: '지단용' },
      { name: '김', amount: '2장', note: '고명' },
      { name: '대파', amount: '1대', note: '고명' },
      { name: '국물용 멸치', amount: '30마리', note: '육수' },
      { name: '다시마', amount: '10cm × 10cm 2장', note: '육수' },
      { name: '무', amount: '200g', note: '육수' },
      { name: '대파 (육수용)', amount: '1대', note: '육수' },
      { name: '물', amount: '2L', note: '육수' },
      { name: '국간장', amount: '2큰술', note: '간 조절' },
      { name: '소금', amount: '1작은술', note: '간 조절' },
      { name: '다진 마늘', amount: '1큰술' },
    ],
    steps: [
      { order: 1, text: '멸치는 머리와 내장을 제거하고 팬에서 살짝 볶아 비린내를 잡습니다. 찬물 2L에 멸치·다시마·무·대파를 넣고 강불에서 끓입니다.' },
      { order: 2, text: '끓어오르면 다시마를 건지고(5분), 10분 더 끓인 후 멸치와 무도 건집니다. 육수는 체에 받쳐 맑게 거릅니다.' },
      { order: 3, text: '국간장·소금·다진 마늘로 육수 간을 맞춥니다. 육수는 약간 짜게 맞춰야 면과 먹었을 때 적당한 간이 됩니다.' },
      { order: 4, text: '달걀로 얇은 지단을 부쳐 채 썰고, 김은 구워 잘게 부숩니다. 대파는 잘게 송송 썹니다.' },
      { order: 5, text: '소면을 끓는 물에 3~4분 삶아 찬물에 헹궈 물기를 빼고 그릇에 담습니다.' },
      { order: 6, text: '뜨거운 육수를 붓고 지단·김·대파를 올려 서빙합니다.' },
    ],
    tips: [
      '육수용 멸치는 반드시 머리와 내장을 제거해야 쓴맛이 나지 않습니다.',
      '다시마는 너무 오래 끓이면 국물이 탁해지므로 끓어오르면 바로 건집니다.',
      '업소에서는 아침에 대량으로 육수를 끓여 보관하고, 주문 시 소면을 삶아 육수를 부어 서빙합니다.',
      '멸치육수에 사골 육수를 20% 섞으면 더 진하고 깊은 맛이 납니다.',
      '비빔국수 버전으로도 판매하면 메뉴 다양화가 가능합니다.',
    ],
    tags: ['잔치국수', '소면', '육수', '분식', '칼국수집', '한식'],
    chef: '쉐프본가',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82073',
    publishedAt: '2026-01-25',
    featured: false,
    viewCount: 12900,
  },

  // ────────────────────────────────────────────────────────
  // 24. 마늘 간장 치킨 소스
  // 참고: recipekorea.com P82116 (정셰프 - 치킨계의 원조 단짠)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-024',
    title: '마늘 간장 치킨 소스',
    subtitle: '치킨계 원조 단짠, 안주 매출 올리는 소스',
    excerpt: '달콤하면서도 짭조름한 마늘 간장 소스로 완성한 치킨. 후라이드에 소스를 입혀 반반치킨이나 양념치킨 대신 새로운 메뉴로 활용할 수 있습니다. 호프집·치킨 전문점에서 단짠 소스 하나로 매출을 올릴 수 있습니다.',
    category: 'western',
    difficulty: 'easy',
    cookingTime: 15,
    servings: 2,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/2975/278971c9-423c-4c68-8076-373f22531044.jpg',
    ingredients: [
      { name: '후라이드 치킨 (완제품)', amount: '½마리' },
      { name: '다진 마늘', amount: '3큰술', note: '소스 핵심' },
      { name: '버터', amount: '1큰술' },
      { name: '식용유', amount: '1큰술' },
      { name: '간장', amount: '3큰술', note: '소스' },
      { name: '물엿', amount: '3큰술', note: '소스' },
      { name: '설탕', amount: '1큰술', note: '소스' },
      { name: '굴소스', amount: '1큰술', note: '소스' },
      { name: '맛술', amount: '1큰술', note: '소스' },
      { name: '후추', amount: '약간', note: '소스' },
      { name: '통깨', amount: '1큰술', note: '마무리' },
      { name: '쪽파', amount: '2줄기', note: '마무리' },
    ],
    steps: [
      { order: 1, text: '팬에 식용유와 버터를 두르고 다진 마늘을 약불에서 노릇하게 볶습니다. 마늘이 타지 않도록 불 조절이 중요합니다.' },
      { order: 2, text: '마늘이 노릇해지면 소스 재료(간장·물엿·설탕·굴소스·맛술·후추)를 넣고 중불에서 끓입니다.' },
      { order: 3, text: '소스가 끓어 걸쭉해지면 (거품이 생기고 소스가 뭉글해질 때까지) 약불로 줄입니다.' },
      { order: 4, text: '후라이드 치킨을 넣고 소스가 고루 코팅되도록 굴립니다.' },
      { order: 5, text: '통깨와 쪽파를 뿌려 완성합니다. 바삭함이 중요하므로 소스를 입힌 후 바로 서빙합니다.' },
    ],
    tips: [
      '소스는 미리 대량으로 만들어 냉장 보관할 수 있습니다. 주문 시 소스를 데우고 치킨을 버무려 서빙하면 빠릅니다.',
      '마늘을 약불에서 천천히 볶아야 쓴맛 없이 고소한 향이 납니다.',
      '소스가 너무 묽으면 끈적거리지 않아 코팅이 안 됩니다. 조금 걸쭉하게 줄여야 치킨에 잘 붙습니다.',
      '닭윙봉에 이 소스를 입히면 인기 있는 안주 메뉴가 됩니다.',
    ],
    tags: ['치킨소스', '마늘간장', '단짠', '치킨', '안주', '호프집'],
    chef: '정셰프',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82116',
    publishedAt: '2026-04-30',
    featured: false,
    viewCount: 11600,
  },

  // ────────────────────────────────────────────────────────
  // 25. 판 떡볶이
  // 참고: recipekorea.com (정셰프 떡볶이 3탄 - 판떡볶이)
  // ────────────────────────────────────────────────────────
  {
    id: 'recipe-025',
    title: '업소용 판 떡볶이',
    subtitle: '분식집·포장마차의 불패 메뉴',
    excerpt: '넓적한 철판에 끓이는 판 떡볶이. 고추장 베이스의 칼칼한 소스와 쫄깃한 떡이 어우러져 남녀노소 모두 좋아하는 국민 분식입니다. 소스 비율만 익히면 누구나 일정한 맛을 낼 수 있습니다.',
    category: 'korean',
    difficulty: 'easy',
    cookingTime: 20,
    servings: 3,
    heroImage: 'https://static.wtable.co.kr/image/production/service/recipe/289/591e4038-5ba3-4aac-93ec-a9ba1f3660a0.jpg',
    ingredients: [
      { name: '떡볶이 떡', amount: '500g' },
      { name: '어묵 (사각)', amount: '200g' },
      { name: '대파', amount: '1대' },
      { name: '달걀', amount: '2개', note: '삶아서' },
      { name: '물(멸치육수)', amount: '600ml' },
      { name: '고추장', amount: '3큰술', note: '소스' },
      { name: '고춧가루', amount: '1큰술', note: '소스' },
      { name: '간장', amount: '1큰술', note: '소스' },
      { name: '설탕', amount: '2큰술', note: '소스' },
      { name: '물엿', amount: '1큰술', note: '소스' },
      { name: '다진 마늘', amount: '1큰술', note: '소스' },
      { name: '참기름', amount: '1작은술', note: '마무리' },
    ],
    steps: [
      { order: 1, text: '멸치 육수를 끓입니다. 육수가 없으면 물에 다시다 1작은술을 대신 사용해도 됩니다.' },
      { order: 2, text: '소스 재료(고추장·고춧가루·간장·설탕·물엿·다진 마늘)를 섞어 소스를 만듭니다.' },
      { order: 3, text: '육수에 소스를 넣고 잘 풀어 끓입니다.' },
      { order: 4, text: '떡볶이 떡과 어묵을 넣고 강불에서 끓입니다. 떡이 퍼지지 않도록 너무 오래 끓이지 않습니다.' },
      { order: 5, text: '소스가 떡에 배어 국물이 걸쭉해지면 대파·삶은 달걀을 넣습니다.' },
      { order: 6, text: '참기름을 두르고 마무리합니다. 철판에 담아 보온 유지하며 서빙합니다.' },
    ],
    tips: [
      '멸치 육수를 써야 국물 맛이 깊어집니다. 물로만 끓이면 맛이 밋밋합니다.',
      '떡은 찬물에 미리 담가두면 좀 더 부드러워지고 조리 시간이 단축됩니다.',
      '소스 배합(고추장:설탕 = 3:2)을 지키면 달지도 맵지도 않은 황금 비율이 됩니다.',
      '업소에서는 소스를 대량으로 만들어 냉장 보관하면 매일 계량하는 수고를 덜 수 있습니다.',
      '라볶이(라면+떡볶이) 버전도 함께 판매하면 메뉴 다양화에 도움이 됩니다.',
    ],
    tags: ['떡볶이', '판떡볶이', '분식', '포장마차', '어묵', '국민간식'],
    chef: '정셰프',
    source: 'recipekorea.com 참고',
    sourceUrl: 'https://recipekorea.com/bbs/board.php?bo_table=ld_0502&wr_id=82077',
    publishedAt: '2026-04-03',
    featured: false,
    viewCount: 14100,
  },
]

// ── helpers ─────────────────────────────────────────────

export function recipeById(id: string): MockRecipe | undefined {
  return RECIPES.find((r) => r.id === id)
}

export function recipesByCategory(category: RecipeCategory): MockRecipe[] {
  return RECIPES.filter((r) => r.category === category)
}

export const FEATURED_RECIPES = RECIPES.filter((r) => r.featured)
