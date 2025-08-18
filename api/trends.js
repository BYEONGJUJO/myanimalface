// 📁 api/trends.js - Vercel Serverless Function
// GET /api/trends 또는 /api/trends.json

export default function handler(req, res) {
  // 1) CDN 캐시 (edge), 2) 브라우저 캐시 관리
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600'); // 30분 캐시, 1시간 재검증
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*'); // CORS 허용

  // 🔥 실시간 트렌드 키워드 (실제로는 외부 API나 DB 연동 가능)
  const trendKeywords = [
    // 기술/트렌드
    "인공지능", "ChatGPT", "메타버스", "NFT", "블록체인", "가상현실",
    
    // 엔터테인먼트
    "K-드라마", "K-팝", "아이돌", "예능", "웹툰", "넷플릭스",
    
    // 라이프스타일
    "여행", "힐링", "운동", "다이어트", "요리", "패션",
    
    // 시사/이슈
    "환율", "부동산", "주식", "경제", "정치", "환경",
    
    // 계절/이벤트
    "겨울", "연말", "새해", "크리스마스", "발렌타인", "휴가",
    
    // 기타 관심사
    "반려동물", "독서", "게임", "영화", "음식", "카페"
  ];

  // 🎲 랜덤하게 7-10개 선택 (매번 다른 조합)
  const shuffled = trendKeywords.sort(() => 0.5 - Math.random());
  const selectedKeywords = shuffled.slice(0, 7 + Math.floor(Math.random() * 4)); // 7-10개

  // 📊 응답 데이터 구조
  const data = {
    updated: new Date().toISOString(),
    source: "동물상 테스트 트렌드 분석",
    version: "1.0",
    cache_duration: 1800, // 30분
    items: selectedKeywords.map((keyword, index) => ({
      keyword: keyword,
      rank: index + 1,
      category: getCategoryByKeyword(keyword),
      url: `/topic/${encodeURIComponent(keyword)}`,
      popularity_score: Math.floor(Math.random() * 50) + 50 // 50-100 사이
    }))
  };

  res.status(200).json(data);
}

// 🏷️ 키워드별 카테고리 분류
function getCategoryByKeyword(keyword) {
  const categories = {
    "기술": ["인공지능", "ChatGPT", "메타버스", "NFT", "블록체인", "가상현실"],
    "엔터테인먼트": ["K-드라마", "K-팝", "아이돌", "예능", "웹툰", "넷플릭스"],
    "라이프스타일": ["여행", "힐링", "운동", "다이어트", "요리", "패션"],
    "시사": ["환율", "부동산", "주식", "경제", "정치", "환경"],
    "계절": ["겨울", "연말", "새해", "크리스마스", "발렌타인", "휴가"],
    "취미": ["반려동물", "독서", "게임", "영화", "음식", "카페"]
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.includes(keyword)) {
      return category;
    }
  }
  return "기타";
}
