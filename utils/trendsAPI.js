// utils/trendsAPI.js
export const fetchTrends = async () => {
  try {
    const response = await fetch('/api/trends', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-cache' // 항상 최신 데이터
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success && data.error) {
      console.warn('API returned error, using fallback data:', data.error);
    }
    
    return data;
    
  } catch (error) {
    console.error('트렌드 데이터 로드 실패:', error);
    
    // 네트워크 오류 시 완전 폴백
    return {
      success: false,
      error: "네트워크 오류",
      items: [
        { keyword: "인공지능", animal: "🦊 여우상", trait: "영리하고 미래지향적인", emoji: "🤖" },
        { keyword: "K-드라마", animal: "🐱 고양이상", trait: "감성적이고 로맨틱한", emoji: "📺" },
        { keyword: "운동", animal: "🐺 늑대상", trait: "강인하고 목표지향적인", emoji: "💪" },
        { keyword: "여행", animal: "🐶 강아지상", trait: "활발하고 호기심 많은", emoji: "✈️" },
        { keyword: "힐링", animal: "🐨 코알라상", trait: "평화롭고 여유로운", emoji: "🌿" }
      ]
    };
  }
};
