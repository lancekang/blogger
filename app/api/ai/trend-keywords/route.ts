import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const currentYear = new Date().getFullYear();

// 피셔-예이츠 셔플 알고리즘 구현
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function GET() {
  // 현재 연도 기반 풍부한 키워드 풀 (카테고리별 10개)
  const tabletMobilePool = [
    `${currentYear}년 가성비 8인치 안드로이드 태블릿 비교 추천`,
    "아이패드 에어 8세대 M4 탑재 모델 성능 분석",
    "레노버 리전 Y700 5세대 직구 vs 국내 정발 스펙 차이",
    "대학생 공부용 30만원대 필기 태블릿 라인업 정리",
    "샤오미 패드 8 프로 가성비 게이밍 실측 테스트",
    "갤럭시 탭 S10 플러스와 울트라 모델 스펙 비교",
    `${currentYear}년 스마트폰 트렌드: 온디바이스 AI 기능 순위`,
    "가성비 서브폰 추천: 30만원 이하 안드로이드 스마트폰",
    "아이패드 미니 8세대 루머 스펙 및 출시일 정보",
    "샤오미 레드미 패드 프로2 가성비 태블릿 분석"
  ];

  const laptopPcPool = [
    `${currentYear}년 인텔 루나 레이크 탑재 초경량 비즈니스 노트북 추천`,
    "맥북 에어 M3 15인치 대학생 가성비 모델 실사용기",
    `LG 그램 16인치 ${currentYear}년형 무게 대비 배터리 타임 검증`,
    "100~150만원대 그래픽 작업용 디자이너 노트북 비교",
    "삼성 갤럭시북5 Pro 3K AMOLED 터치 스크린 장단점",
    `${currentYear}년 AMD 라이젠 9000 시리즈 탑재 게이밍 노트북 추천`,
    "가성비 미니 PC 추천: 사무용 및 홈서버용 탑5",
    "맥북 프로 M4 Pro 16인치 개발자 성능 실측 후기",
    `${currentYear}년형 레노버 씽크패드 X1 카본 12세대 스펙 리뷰`,
    "윈도우 11 Copilot+ PC 가성비 노트북 구매 가이드"
  ];

  const gamingUmpcPool = [
    `${currentYear}년 최신 윈도우 11 휴대용 UMPC 게임기 추천`,
    "스냅드래곤 8 Elite 게이밍 태블릿 성능 한계 측정",
    "스팀덱 OLED vs 스팀덱2 루머 스펙 비교 분석",
    "모바일 배틀그라운드 120프레임 완벽 지원 기기 정리",
    "가성비 가정용 레트로 에뮬레이터 게임기 총정리",
    "ASUS ROG Ally X 2세대 UMPC 배터리 실측 비교",
    "AYN Odin 3 안드로이드 게임기 에뮬레이터 성능",
    "닌텐도 스위치 2 출시일 및 스펙 루머 총정리",
    "아야네오 Pocket DMG 레트로 게임기 구매 메리트 분석",
    "UMPC 입문 가이드: 스팀덱과 로얄라이 중 나에게 맞는 기기는?"
  ];

  const wearableTechPool = [
    `${currentYear}년 건강 측정용 스마트 링(Smart Ring) 브랜드 비교`,
    "10만원 이하 가성비 스마트워치 핵심 기능 비교",
    "갤럭시 워치 9세대 실시간 혈당 측정 기능 팩트 체크",
    `애플워치 SE 3세대 ${currentYear}년 가성비 입문 추천`,
    "디지털 디톡스를 위한 E-Ink 전자잉크 태블릿 활용법",
    "샤오미 미밴드 10세대 스포츠용 피트니스 트래커 리뷰",
    "가성비 노이즈 캔슬링 무선 이어폰 추천 TOP 5",
    "골전도 이어폰 vs 오픈형 이어폰 러닝용 음질 비교",
    "애플 비전 프로 2세대 경량화 모델 출시 정보",
    "갤럭시 링 2세대 배터리 수명 및 수면 분석 성능"
  ];

  const trends = {
    tabletMobile: {
      category: "📱 태블릿 & 모바일",
      keywords: shuffleArray(tabletMobilePool).slice(0, 5)
    },
    laptopPc: {
      category: "💻 노트북 & PC",
      keywords: shuffleArray(laptopPcPool).slice(0, 5)
    },
    gamingUmpc: {
      category: "🎮 게이밍 & UMPC",
      keywords: shuffleArray(gamingUmpcPool).slice(0, 5)
    },
    wearableTech: {
      category: "⌚ 웨어러블 & 스마트헬스",
      keywords: shuffleArray(wearableTechPool).slice(0, 5)
    }
  };

  return NextResponse.json(trends);
}

