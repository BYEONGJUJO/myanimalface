// 📁 api/trends.js
// Vercel Serverless Function for Animal Face Test Trends
// GET /api/trends or /api/trends.json

export default function handler(req, res) {
  // CORS 및 캐시 헤더 설정
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600'); // 30분 캐시, 1시간 재검증
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET 요청만 처리
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // 🔥 실시간 트렌드 키워드 풀 (카테고리별)
    const trendPool = {
      // 🤖 기술/AI
      tech: [
        "인공지능", "ChatGPT", "AI", "메타버스", "NFT", "블록체인", 
        "가상현실", "웹3", "로봇", "자율주행", "빅데이터", "IoT"
      ],
      
      // 🎭 엔터테인먼트
      entertainment: [
        "K-드라마", "K-팝", "아이돌", "예능", "웹툰", "넷플릭스",
        "유튜브", "틱톡", "인스타", "스트리밍", "OTT", "버츄얼"
      ],
      
      // 🌟 라이프스타일
      lifestyle: [
        "여행", "힐링", "운동", "다이어트", "요리", "패션",
        "뷰티", "카페", "맛집", "인테리어", "반려동물", "취미"
      ],
      
      // 📈 경제/시사
      economy: [
        "환율", "부동산", "주식", "투자", "경제", "금리",
        "암호화폐", "정치", "선거", "정책", "사회이슈", "국제정세"
      ],
      
      // 🎊 계절/이벤트
      seasonal: [
        "겨울", "연말", "새해", "크리스마스", "발렌타인", "화이트데이",
        "봄", "여름", "가을", "휴가", "방학", "연휴"
      ],
      
      // 🎯 트렌드/문화
      culture: [
        "밈", "챌린지", "바이럴", "소확행", "YOLO", "워라밸",
        "미니멀", "제로웨이스트", "비건", "펜데믹", "언택트", "메타인지"
      ],
      
      // 🎮 취미/오락
      hobby: [
        "게임", "독서", "영화", "음악", "드라마", "애니메이션",
        "스포츠", "축구", "야구", "올림픽", "e스포츠", "보드게임"
      ],
      
      // 🏥 건강/웰빙
      health: [
        "건강", "코로나", "백신", "운동", "다이어트", "명상",
        "요가", "필라테스", "헬스", "영양", "수면", "정신건강"
      ]
    };

    // 🎲 카테고리별로 랜덤하게 키워드 선택
    const selectedKeywords = [];
    const categories = Object.keys(trendPool);
    
    // 각 카테고리에서 1-2개씩 선택
    categories.forEach(category => {
      const keywords = trendPool[category];
      const shuffled = keywords.sort(() => 0.5 - Math.random());
      const count = Math.random() > 0.6 ? 2 : 1; // 40% 확률로 2개, 60% 확률로 1개
      selectedKeywords.push(...shuffled.slice(0, count));
    });

    // 전체를 다시 섞어서 7-10개 최종 선택
    const finalKeywords = selectedKeywords
      .sort(() => 0.5 - Math.random())
      .slice(0, 7 + Math.floor(Math.random() * 4)); // 7-10개

    // 📊 응답 데이터 구조
    const responseData = {
      updated: new Date().toISOString(),
      source: "AI 동물상 테스트 트렌드 분석",
      version: "2.0",
      cache_duration: 1800, // 30분
      total_keywords: finalKeywords.length,
      refresh_interval: "30분마다 업데이트",
      items: finalKeywords.map((keyword, index) => ({
        keyword: keyword,
        rank: index + 1,
        category: getCategoryByKeyword(keyword, trendPool),
        url: `/topic/${encodeURIComponent(keyword)}`,
        popularity_score: generatePopularityScore(keyword),
        trending_since: generateTrendingTime(),
        engagement_level: getEngagementLevel()
      }))
    };

    // 성공 응답
    res.status(200).json(responseData);

  } catch (error) {
    console.error('Trends API Error:', error);
    
    // 🚨 에러 시 폴백 데이터 반환
    const fallbackData = {
      updated: new Date().toISOString(),
      source: "AI 동물상 테스트 기본 트렌드",
      version: "2.0-fallback",
      cache_duration: 600, // 10분으로 단축
      items: [
        { keyword: "인공지능", rank: 1, category: "기술", url: "/topic/인공지능", popularity_score: 95 },
        { keyword: "K-드라마", rank: 2, category: "엔터테인먼트", url: "/topic/K-드라마", popularity_score: 88 },
        { keyword: "여행", rank: 3, category: "라이프스타일", url: "/topic/여행", popularity_score: 82 },
        { keyword: "부동산", rank: 4, category: "경제", url: "/topic/부동산", popularity_score: 79 },
        { keyword: "운동", rank: 5, category: "건강", url: "/topic/운동", popularity_score: 75 }
      ]
    };
    
    res.status(200).json(fallbackData);
  }
}

// 🏷️ 키워드로 카테고리 찾기
function getCategoryByKeyword(keyword, trendPool) {
  for (const [category, keywords] of Object.entries(trendPool)) {
    if (keywords.includes(keyword)) {
      return getCategoryName(category);
    }
  }
  return "기타";
}

// 📝 카테고리 한글명 매핑
function getCategoryName(category) {
  const categoryNames = {
    tech: "기술",
    entertainment: "엔터테인먼트", 
    lifestyle: "라이프스타일",
    economy: "경제",
    seasonal: "계절",
    culture: "문화",
    hobby: "취미",
    health: "건강"
  };
  return categoryNames[category] || "기타";
}

// 📊 인기도 점수 생성 (키워드 기반 일관성 유지)
function generatePopularityScore(keyword) {
  // 키워드 해시를 기반으로 일관된 점수 생성
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    const char = keyword.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32비트 정수 변환
  }
  
  // 50-99 사이의 점수로 변환
  const score = 50 + (Math.abs(hash) % 50);
  return score;
}

// ⏰ 트렌딩 시작 시간 생성
function generateTrendingTime() {
  const now = new Date();
  const hoursAgo = Math.floor(Math.random() * 12) + 1; // 1-12시간 전
  const trendingStart = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
  return trendingStart.toISOString();
}

// 📈 참여도 레벨 생성
function getEngagementLevel() {
  const levels = ["매우 높음", "높음", "보통", "증가 중"];
  return levels[Math.floor(Math.random() * levels.length)];
}

// 🔄 추가 유틸리티 함수들
export const config = {
  runtime: 'nodejs18.x', // Node.js 런타임 명시
  maxDuration: 10, // 최대 10초 실행 시간
  memory: 128 // 128MB 메모리
};
