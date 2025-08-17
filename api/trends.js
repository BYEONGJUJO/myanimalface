// 📁 api/trends.js - 수정된 안정적인 Vercel 서버리스 함수

export default function handler(req, res) {
  // 🛡️ 오류 처리 래퍼
  try {
    // 1) CORS 헤더 설정 (모든 응답에 필수)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 2) OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // 3) GET 요청만 허용
    if (req.method !== 'GET') {
      res.status(405).json({ 
        error: 'Method not allowed',
        message: 'GET 요청만 지원됩니다' 
      });
      return;
    }

    // 4) 캐시 헤더 설정 (30분 캐시, 1시간 재검증)
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // 🔥 실시간 트렌드 키워드 데이터
    const trendKeywords = [
      // 기술/트렌드
      { keyword: "인공지능", category: "기술", popularity: 95 },
      { keyword: "ChatGPT", category: "기술", popularity: 88 },
      { keyword: "메타버스", category: "기술", popularity: 72 },
      { keyword: "NFT", category: "기술", popularity: 65 },
      { keyword: "블록체인", category: "기술", popularity: 78 },
      
      // 엔터테인먼트
      { keyword: "K-드라마", category: "엔터테인먼트", popularity: 92 },
      { keyword: "K-팝", category: "엔터테인먼트", popularity: 89 },
      { keyword: "웹툰", category: "엔터테인먼트", popularity: 76 },
      { keyword: "넷플릭스", category: "엔터테인먼트", popularity: 84 },
      
      // 라이프스타일
      { keyword: "여행", category: "라이프스타일", popularity: 81 },
      { keyword: "힐링", category: "라이프스타일", popularity: 73 },
      { keyword: "운동", category: "라이프스타일", popularity: 79 },
      { keyword: "다이어트", category: "라이프스타일", popularity: 85 },
      { keyword: "요리", category: "라이프스타일", popularity: 77 },
      
      // 시사/이슈
      { keyword: "환율", category: "시사", popularity: 68 },
      { keyword: "부동산", category: "시사", popularity: 82 },
      { keyword: "주식", category: "시사", popularity: 74 },
      
      // 계절/이벤트  
      { keyword: "겨울", category: "계절", popularity: 60 },
      { keyword: "크리스마스", category: "계절", popularity: 55 },
      { keyword: "새해", category: "계절", popularity: 90 }
    ];
    
    // 🎲 랜덤하게 7-10개 선택 (일관성을 위해 시드 사용)
    const today = new Date().toDateString();
    const seed = hashCode(today); // 하루 동안 같은 결과
    const shuffled = shuffleWithSeed(trendKeywords, seed);
    const selectedCount = 7 + (seed % 4); // 7-10개
    const selectedKeywords = shuffled.slice(0, selectedCount);
    
    // 📊 응답 데이터 구조
    const responseData = {
      success: true,
      timestamp: new Date().toISOString(),
      source: "동물상 테스트 트렌드 분석",
      version: "2.0",
      cache_duration: 1800, // 30분
      total_keywords: selectedKeywords.length,
      items: selectedKeywords.map((item, index) => ({
        rank: index + 1,
        keyword: item.keyword,
        category: item.category,
        popularity_score: item.popularity,
        trend_direction: item.popularity > 75 ? "상승" : "안정",
        url: `/topic/${encodeURIComponent(item.keyword)}`,
        // 동물상 연관성 추가 (재미 요소)
        animal_connection: getAnimalConnection(item.keyword)
      }))
    };
    
    // ✅ 성공 응답
    res.status(200).json(responseData);
    
  } catch (error) {
    // 🚨 에러 로깅 및 응답
    console.error('API Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      timestamp: new Date().toISOString(),
      // 개발 환경에서만 상세 에러 정보 제공
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message
      })
    });
  }
}

// 🛠️ 헬퍼 함수들

// 문자열 해시 함수 (일관된 랜덤 시드용)
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32비트 정수로 변환
  }
  return Math.abs(hash);
}

// 시드 기반 배열 셔플 (일관된 결과용)
function shuffleWithSeed(array, seed) {
  const result = [...array];
  const random = seededRandom(seed);
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

// 시드 기반 랜덤 함수
function seededRandom(seed) {
  let m = seed;
  return function() {
    m = (m * 9301 + 49297) % 233280;
    return m / 233280;
  };
}

// 키워드와 동물상 연결 (재미 요소)
function getAnimalConnection(keyword) {
  const connections = {
    "인공지능": "🦊 여우상 - 영리하고 미래지향적",
    "K-드라마": "🐱 고양이상 - 감성적이고 로맨틱", 
    "운동": "🐺 늑대상 - 강인하고 목표지향적",
    "여행": "🐶 강아지상 - 활발하고 호기심 많음",
    "힐링": "🐨 코알라상 - 평화롭고 여유로움",
    "요리": "🐻 곰상 - 따뜻하고 정성스러움",
    "부동산": "🐢 거북이상 - 신중하고 안정적",
    "주식": "🦅 독수리상 - 날카롭고 기회포착",
    "새해": "🐰 토끼상 - 순수하고 희망적"
  };
  
  return connections[keyword] || "🦋 나비상 - 자유롭고 변화를 즐김";
}

// 🔧 Vercel 설정을 위한 config (선택사항)
export const config = {
  runtime: 'nodejs18.x', // Node.js 런타임 명시
  maxDuration: 10, // 최대 실행 시간 10초
  memory: 128, // 메모리 128MB (충분함)
  regions: ['icn1'], // 서울 리전 (한국 사용자용)
};
