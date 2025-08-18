export default function handler(req, res) {
  try {
    // CORS 및 캐시 헤더 설정
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // GET 요청만 허용
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    // 🐾 동물상 테스트 특화 트렌드 키워드
    const animalTrendKeywords = [
      // 기술/AI 트렌드
      { keyword: "인공지능", animal: "🦊 여우상", trait: "영리하고 미래지향적인", category: "기술" },
      { keyword: "ChatGPT", animal: "🦊 여우상", trait: "똑똑하고 호기심 많은", category: "기술" },
      { keyword: "메타버스", animal: "🐱 고양이상", trait: "신비롭고 독립적인", category: "기술" },
      
      // 엔터테인먼트
      { keyword: "K-드라마", animal: "🐱 고양이상", trait: "감성적이고 로맨틱한", category: "엔터테인먼트" },
      { keyword: "K-팝", animal: "🐶 강아지상", trait: "활발하고 매력적인", category: "엔터테인먼트" },
      { keyword: "아이돌", animal: "🦌 사슴상", trait: "우아하고 청순한", category: "엔터테인먼트" },
      { keyword: "웹툰", animal: "🐰 토끼상", trait: "귀엽고 상상력 풍부한", category: "엔터테인먼트" },
      { keyword: "넷플릭스", animal: "🐨 코알라상", trait: "여유롭고 힐링을 좋아하는", category: "엔터테인먼트" },
      
      // 라이프스타일
      { keyword: "여행", animal: "🐶 강아지상", trait: "활발하고 호기심 많은", category: "라이프스타일" },
      { keyword: "힐링", animal: "🐨 코알라상", trait: "평화롭고 여유로운", category: "라이프스타일" },
      { keyword: "운동", animal: "🐺 늑대상", trait: "강인하고 목표지향적인", category: "라이프스타일" },
      { keyword: "다이어트", animal: "🦌 사슴상", trait: "절제력 있고 우아한", category: "라이프스타일" },
      { keyword: "요리", animal: "🐼 팬더상", trait: "정성스럽고 따뜻한", category: "라이프스타일" },
      { keyword: "패션", animal: "🐱 고양이상", trait: "세련되고 스타일리시한", category: "라이프스타일" },
      
      // 시사/경제
      { keyword: "부동산", animal: "🐢 거북이상", trait: "신중하고 안정적인", category: "시사" },
      { keyword: "주식", animal: "🦅 독수리상", trait: "날카롭고 분석적인", category: "시사" },
      { keyword: "환율", animal: "🦊 여우상", trait: "예민하고 계산적인", category: "시사" },
      { keyword: "경제", animal: "🐺 늑대상", trait: "리더십 있고 현실적인", category: "시사" },
      
      // 계절/이벤트
      { keyword: "겨울", animal: "🐼 팬더상", trait: "포근하고 따뜻한", category: "계절" },
      { keyword: "크리스마스", animal: "🐰 토끼상", trait: "순수하고 사랑스러운", category: "계절" },
      { keyword: "새해", animal: "🐯 호랑이상", trait: "당당하고 새로운 시작을 좋아하는", category: "계절" },
      { keyword: "발렌타인", animal: "🐱 고양이상", trait: "로맨틱하고 감성적인", category: "계절" },
      
      // 취미/관심사
      { keyword: "반려동물", animal: "🐶 강아지상", trait: "사랑스럽고 충성스러운", category: "취미" },
      { keyword: "독서", animal: "🦌 사슴상", trait: "지적이고 사색적인", category: "취미" },
      { keyword: "게임", animal: "🐱 고양이상", trait: "집중력 있고 예민한", category: "취미" },
      { keyword: "영화", animal: "🐨 코알라상", trait: "감상적이고 여유로운", category: "취미" },
      { keyword: "음식", animal: "🐷 돼지상", trait: "사교적이고 즐거운", category: "취미" },
      { keyword: "카페", animal: "🐱 고양이상", trait: "세련되고 분위기를 중시하는", category: "취미" },
      
      // 뷰티/패션
      { keyword: "뷰티", animal: "🐱 고양이상", trait: "아름다움을 추구하는", category: "뷰티" },
      { keyword: "스킨케어", animal: "🦌 사슴상", trait: "세심하고 관리를 잘하는", category: "뷰티" },
      { keyword: "메이크업", animal: "🦊 여우상", trait: "변신을 즐기는 매력적인", category: "뷰티" }
    ];

    // 🎲 날짜와 시간 기반 시드 (하루에 몇 번씩 바뀜)
    const now = new Date();
    const today = now.toDateString();
    const hour = now.getHours();
    const timeSlot = Math.floor(hour / 6); // 0, 1, 2, 3 (6시간마다)
    
    // 시드 생성
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + timeSlot;
    
    // 시드 기반 랜덤 함수
    function seededRandom(seedValue) {
      const x = Math.sin(seedValue) * 10000;
      return x - Math.floor(x);
    }
    
    // 시드를 사용한 배열 셔플
    const shuffled = [...animalTrendKeywords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(seededRandom(seed + i) * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
    
    // 5-7개 선택 (시간대별로 다름)
    const count = 5 + (timeSlot % 3); // 5, 6, 7개 순환
    const selectedKeywords = shuffled.slice(0, count);

    // 키워드별 이모지 매핑
    const getKeywordEmoji = (keyword) => {
      const emojiMap = {
        "인공지능": "🤖", "ChatGPT": "💬", "메타버스": "🥽",
        "K-드라마": "📺", "K-팝": "🎵", "아이돌": "⭐",
        "여행": "✈️", "힐링": "🌿", "운동": "💪",
        "부동산": "🏠", "주식": "📈", "환율": "💱",
        "겨울": "❄️", "크리스마스": "🎄", "새해": "🎊",
        "반려동물": "🐕", "독서": "📚", "게임": "🎮",
        "뷰티": "💄", "패션": "👗", "카페": "☕"
      };
      return emojiMap[keyword] || "🔥";
    };

    // 공유 텍스트 생성
    const generateShareText = (item) => {
      return `🔥 오늘의 트렌드: ${item.keyword}\n내가 ${item.keyword}에 관심 있다면?\n${item.animal} 기질! ${item.trait} 성향이래요 ✨\n\n나도 동물상 테스트해보기 👇`;
    };

    // 다음 업데이트 시간 계산 (6시간 후)
    const getNextRefreshTime = () => {
      const next = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6시간 후
      return next.toISOString();
    };

    // 📊 응답 데이터 구조
    const data = {
      success: true,
      updated: now.toISOString(),
      source: "동물상 궁합 테스트 트렌드 분석",
      version: "2.1",
      cache_duration: 1800, // 30분 캐시
      total_keywords: animalTrendKeywords.length,
      selected_count: selectedKeywords.length,
      time_slot: timeSlot,
      next_refresh: getNextRefreshTime(),
      items: selectedKeywords.map((item, index) => ({
        rank: index + 1,
        keyword: item.keyword,
        animal: item.animal,
        trait: item.trait,
        category: item.category,
        url: `/topic/${encodeURIComponent(item.keyword)}`,
        emoji: getKeywordEmoji(item.keyword),
        popularity_score: Math.floor(seededRandom(seed + index * 100) * 50) + 50, // 50-100
        share_text: generateShareText(item),
        description: `${item.keyword}에 관심 있다면 ${item.animal} 기질 - ${item.trait} 성향!`
      }))
    };

    // 성공 응답
    res.status(200).json(data);

  } catch (error) {
    // 에러 핸들링
    console.error('Trends API Error:', error);
    
    // 에러 시 폴백 데이터 반환
    const fallbackData = {
      success: false,
      error: "API 일시적 오류",
      updated: new Date().toISOString(),
      source: "폴백 데이터",
      version: "2.1-fallback",
      items: [
        { 
          rank: 1, 
          keyword: "인공지능", 
          animal: "🦊 여우상", 
          trait: "영리하고 미래지향적인",
          emoji: "🤖",
          description: "인공지능에 관심 있다면 🦊 여우상 기질 - 영리하고 미래지향적인 성향!"
        },
        { 
          rank: 2, 
          keyword: "K-드라마", 
          animal: "🐱 고양이상", 
          trait: "감성적이고 로맨틱한",
          emoji: "📺",
          description: "K-드라마에 관심 있다면 🐱 고양이상 기질 - 감성적이고 로맨틱한 성향!"
        },
        { 
          rank: 3, 
          keyword: "운동", 
          animal: "🐺 늑대상", 
          trait: "강인하고 목표지향적인",
          emoji: "💪",
          description: "운동에 관심 있다면 🐺 늑대상 기질 - 강인하고 목표지향적인 성향!"
        },
        { 
          rank: 4, 
          keyword: "여행", 
          animal: "🐶 강아지상", 
          trait: "활발하고 호기심 많은",
          emoji: "✈️",
          description: "여행에 관심 있다면 🐶 강아지상 기질 - 활발하고 호기심 많은 성향!"
        },
        { 
          rank: 5, 
          keyword: "힐링", 
          animal: "🐨 코알라상", 
          trait: "평화롭고 여유로운",
          emoji: "🌿",
          description: "힐링에 관심 있다면 🐨 코알라상 기질 - 평화롭고 여유로운 성향!"
        }
      ]
    };

    res.status(200).json(fallbackData);
  }
}
