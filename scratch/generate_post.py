# -*- coding: utf-8 -*-
import json
import os

# 디렉토리 생성 확인
os.makedirs("D:/work/blogger/pending-posts", exist_ok=True)
os.makedirs("D:/work/blogger/scratch", exist_ok=True)

title = "가성비 서브폰 추천 TOP 3 | 30만 원 이하로 종결하는 안드로이드 스마트폰 비교 분석"

# 매거진 스타일의 고급스러운 HTML 본문 작성 (3,000자 이상)
content = """
<div style="font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.8; color: #333333; max-width: 800px; margin: 0 auto; padding: 24px; background-color: #ffffff;">
  
  <!-- 상단 매거진 커버 헤더 -->
  <header style="text-align: center; padding: 40px 0 30px 0; border-bottom: 2px solid #111111; margin-bottom: 40px;">
    <p style="font-size: 13px; letter-spacing: 2px; color: #888888; text-transform: uppercase; margin: 0 0 12px 0; font-weight: 700;">2026 Tech Magazine & Buying Guide</p>
    <h1 style="font-size: 32px; font-weight: 800; color: #111111; line-height: 1.4; margin: 0 0 20px 0; letter-spacing: -1.5px; word-break: keep-all;">
      가성비 서브폰 추천 TOP 3<br>
      <span style="color: #1a73e8; background: linear-gradient(to right, #1a73e8, #0d47a1); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">30만 원 이하</span>로 종결하는 안드로이드 스마트폰 비교 분석
    </h1>
    <p style="font-size: 16px; color: #666666; margin: 0 auto; max-width: 620px; line-height: 1.6; word-break: keep-all;">
      업무와 일상의 완벽한 분리부터 내비게이션, 금융 거래, 미디어 감상까지. 2026년 현재 가장 현명하게 선택할 수 있는 자급제 서브폰 세 가지를 철저히 파헤쳐 봅니다.
    </p>
  </header>

  <!-- 서론 -->
  <section style="margin-bottom: 40px;">
    <p style="font-size: 16px; margin-bottom: 20px; text-align: justify; text-indent: 8px;">
      스마트폰 하나로 모든 일상을 소화하는 시대이지만, 오히려 그렇기 때문에 <strong>'서브폰'</strong>의 수요는 날이 갈수록 늘어나고 있습니다. 업무용 연락처와 카카오톡을 완전히 분리하여 퇴근 후 일상의 평화를 지키려는 직장인, 차량 내비게이션 전용 디바이스가 필요한 운전자, 주식 거래나 금융 업무 전용 단말기를 따로 두어 보안을 극대화하려는 금융 테크족, 혹은 자녀에게 줄 첫 스마트폰을 고민하는 학부모님들까지 저마다의 이유로 서브폰을 찾고 있습니다.
    </p>
    <p style="font-size: 16px; margin-bottom: 20px; text-align: justify; text-indent: 8px;">
      과거에는 '서브폰'이라고 하면 화면이 버벅이고 액정이 칙칙한 저가형 제품을 떠올리기 일쑤였습니다. 하지만 2026년 현재 스마트폰의 상향 평준화는 보급형 라인업에서 가장 드라마틱하게 일어났습니다. 이제 20만 원대 예산으로도 선명한 아몰레드(AMOLED) 디스플레이, 90Hz 이상의 고주사율, 그리고 일상 작업에서 버벅임이 없는 옥타코어 프로세서를 탑재한 기기를 충분히 손에 넣을 수 있습니다.
    </p>
    <p style="font-size: 16px; margin-bottom: 20px; text-align: justify; text-indent: 8px;">
      본 가이드에서는 <strong>30만 원 이하의 예산 범위</strong>를 엄격하게 준수하면서도, 용도별로 가장 뛰어난 만족도를 자랑하는 안드로이드 스마트폰 3종을 선정했습니다. 단순 스펙 나열을 넘어 제조사 공식 발표 사양과 실구매가를 바탕으로 한 실질적인 비교 분석을 지금 시작합니다.
    </p>
  </section>

  <!-- 핵심 체크포인트 -->
  <section style="background-color: #f8f9fa; border-radius: 16px; padding: 28px; margin-bottom: 45px; border: 1px solid #e9ecef;">
    <h3 style="font-size: 18px; font-weight: 700; color: #111111; margin-top: 0; margin-bottom: 16px; display: flex; align-items: center;">
      <span style="background-color: #1a73e8; color: #ffffff; width: 6px; height: 18px; display: inline-block; margin-right: 10px; border-radius: 2px;"></span>
      서브폰 구매 전 반드시 확인해야 할 3가지 체크포인트
    </h3>
    <ul style="margin: 0; padding-left: 20px; font-size: 15px; color: #495057; line-height: 1.8;">
      <li style="margin-bottom: 10px;">
        <strong>디스플레이 패널과 주사율:</strong> 저가형 LCD 패널은 시야각이 좁고 야외 시인성이 떨어집니다. 야외 내비게이션이나 영상 시청이 주 목적이라면 반드시 <strong>AMOLED(아몰레드) 패널</strong>과 화면이 부드러운 <strong>90Hz 이상 고주사율</strong> 지원 여부를 확인하세요.
      </li>
      <li style="margin-bottom: 10px;">
        <strong>배터리 용량 및 충전 속도:</strong> 서브폰은 메인폰에 비해 충전을 잊기 쉽습니다. 최소 <strong>5,000mAh</strong>급 대용량 배터리를 탑재했는지, 그리고 방전 시 빠르게 수혈할 수 있는 고속 충전 스펙을 갖추었는지 확인해야 합니다.
      </li>
      <li style="margin-bottom: 0;">
        <strong>부가 기능 (삼성페이 & 사후 지원):</strong> 국내 사용 환경에서 지갑 없는 외출을 가능케 하는 <strong>삼성페이(교통카드 포함)</strong> 지원 여부는 매우 큽니다. 또한, 오랫동안 보안 위협 없이 사용하기 위한 제조사의 <strong>OS 업데이트 보장 기간</strong>도 중요한 척도입니다.
      </li>
    </ul>
  </section>

  <!-- 추천 제품 1: 삼성 갤럭시 A16 5G -->
  <section style="margin-bottom: 50px;">
    <div style="border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <div style="background-color: #e3f2fd; padding: 20px 24px; border-bottom: 1px solid #e0e0e0;">
        <span style="background-color: #0d47a1; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; vertical-align: middle; margin-right: 8px;">No. 1 BALANCE</span>
        <h2 style="font-size: 22px; font-weight: 700; color: #0d47a1; margin: 8px 0 0 0; display: inline-block; vertical-align: middle;">삼성 갤럭시 A16 5G</h2>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #555555;">"보급형의 선을 넘다, 독보적인 6년 사후 지원과 편리한 삼성페이"</p>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 15px; margin-top: 0; margin-bottom: 18px; text-align: justify;">
          삼성전자의 <strong>갤럭시 A16 5G</strong>는 국내 스마트폰 생태계에서 가장 안심하고 선택할 수 있는 표준형 보급기입니다. 전작인 A15의 메가 히트에 힘입어 한 단계 더 진화하여 출시된 이 모델은 보급형 기종임에도 불구하고 무려 <strong>6회의 OS 업그레이드 및 6년간의 보안 패치</strong>를 공식 보장합니다. 이는 한 번 구매하면 2030년이 넘어가는 시점까지 최신 안드로이드 보안 환경을 유지할 수 있음을 의미하여, 보안이 극히 중요한 금융 전용 서브폰으로 강력 추천됩니다.
        </p>
        
        <!-- 스펙 테이블 -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; text-align: left;">
          <tr style="border-bottom: 1px solid #eeeeee; background-color: #fcfcfc;">
            <th style="padding: 8px 12px; color: #666666; width: 30%;">프로세서 (AP)</th>
            <td style="padding: 8px 12px; font-weight: 500;">삼성 Exynos 1330 (5G 지원)</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <th style="padding: 8px 12px; color: #666666;">디스플레이</th>
            <td style="padding: 8px 12px; font-weight: 500;">6.7인치 FHD+ Super AMOLED (90Hz 주사율)</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee; background-color: #fcfcfc;">
            <th style="padding: 8px 12px; color: #666666;">메모리 / 저장공간</th>
            <td style="padding: 8px 12px; font-weight: 500;">4GB RAM / 128GB ROM (MicroSD 최대 1.5TB 지원)</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <th style="padding: 8px 12px; color: #666666;">배터리 / 충전</th>
            <td style="padding: 8px 12px; font-weight: 500;">5,000 mAh / 25W 유선 고속 충전</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee; background-color: #fcfcfc;">
            <th style="padding: 8px 12px; color: #666666;">카메라</th>
            <td style="padding: 8px 12px; font-weight: 500;">후면 5,000만 화소 메인 + 500만 초광각 + 200만 접사</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <th style="padding: 8px 12px; color: #666666;">주요 특징</th>
            <td style="padding: 8px 12px; font-weight: 500; color: #2b6cb0;">삼성페이 완벽 지원, IP54 방수방진, 6회 OS 업그레이드</td>
          </tr>
        </table>

        <h4 style="font-size: 15px; font-weight: 700; color: #333333; margin-bottom: 8px;">실실적인 강점과 아쉬운 점</h4>
        <p style="font-size: 15px; margin-top: 0; margin-bottom: 15px; text-align: justify;">
          갤럭시 A16 5G의 가장 큰 무기는 역시 <strong>삼성페이</strong>입니다. 서브폰만 들고 가볍게 산책을 나가거나 운동을 갈 때도 카드 결제와 버스/지하철 교통카드 기능을 완벽히 사용할 수 있어 라이프스타일의 편의성을 높여줍니다. 화면 크기 또한 6.7인치로 넓어졌으며, 삼성의 Super AMOLED 패널을 탑재해 쨍하고 선명한 화질을 보여줍니다. 
        </p>
        <p style="font-size: 15px; margin-top: 0; margin-bottom: 20px; text-align: justify;">
          다만, 국내 출시 사양 기준 <strong>4GB RAM</strong> 탑재는 다소 아쉬운 대목입니다. 카카오톡, 웹서핑, 내비게이션 등 단일 작업을 실행하는 데는 아무런 지장이 없지만, 여러 개의 무거운 앱을 동시에 띄워두고 전환할 때는 리프레시(앱이 초기화되는 현상)가 발생할 수 있습니다. 가벼운 일상 및 업무용 서브폰 목적에 가장 최적화된 선택입니다.
        </p>

        <!-- 구매 링크 버튼 -->
        <div style="text-align: center; margin: 25px 0 10px 0;">
          <a href="https://search.danawa.com/dsearch.php?query=삼성+갤럭시+A16+5G+자급제" target="_blank" style="display: inline-block; background-color: #0d47a1; color: #ffffff; padding: 12px 28px; border-radius: 30px; font-weight: 700; font-size: 15px; text-decoration: none; box-shadow: 0 4px 10px rgba(13, 71, 161, 0.25); transition: all 0.2s;">
            갤럭시 A16 5G 다나와 최저가 비교하러 가기 →
          </a>
          <p style="font-size: 11px; font-style: italic; color: #888888; margin-top: 8px; margin-bottom: 0;">
            ※ 실시간 가격 비교 링크는 시장 상황 및 조회 시점에 따라 실제 판매 가격과 재고가 상이할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- 추천 제품 2: 샤오미 홍미노트 13 4G -->
  <section style="margin-bottom: 50px;">
    <div style="border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <div style="background-color: #fff8f5; padding: 20px 24px; border-bottom: 1px solid #e0e0e0;">
        <span style="background-color: #ff6f00; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; vertical-align: middle; margin-right: 8px;">No. 2 DISPLAY & CAMERA</span>
        <h2 style="font-size: 22px; font-weight: 700; color: #ff6f00; margin: 8px 0 0 0; display: inline-block; vertical-align: middle;">샤오미 홍미노트 13 4G</h2>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #555555;">"시각적 쾌감의 극대화, 120Hz 아몰레드와 1억 800만 화소 카메라"</p>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 15px; margin-top: 0; margin-bottom: 18px; text-align: justify;">
          샤오미의 대표 가성비 라인업인 <strong>홍미노트 13 4G (Redmi Note 13)</strong>는 20만 원대 초반이라는 믿기 힘든 가격에 최상급 디스플레이와 카메라 스펙을 꾹꾹 눌러 담은 제품입니다. 국내 공식 정발되어 사후 AS 걱정을 덜었으며, 서브폰으로 유튜브나 넷플릭스 등 동영상 콘텐츠를 주로 시청하거나 서브 카메라로 풍경/제품 사진을 촬영하려는 사용자에게 압도적인 가성비를 선사합니다.
        </p>
        
        <!-- 스펙 테이블 -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; text-align: left;">
          <tr style="border-bottom: 1px solid #eeeeee; background-color: #fcfcfc;">
            <th style="padding: 8px 12px; color: #666666; width: 30%;">프로세서 (AP)</th>
            <td style="padding: 8px 12px; font-weight: 500;">퀄컴 Snapdragon 685 (4G)</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <th style="padding: 8px 12px; color: #666666;">디스플레이</th>
            <td style="padding: 8px 12px; font-weight: 500;">6.67인치 FHD+ AMOLED (120Hz 주사율, 최대 1,800nits 밝기)</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee; background-color: #fcfcfc;">
            <th style="padding: 8px 12px; color: #666666;">메모리 / 저장공간</th>
            <td style="padding: 8px 12px; font-weight: 500;">6GB 또는 8GB RAM / 128GB 또는 256GB ROM</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <th style="padding: 8px 12px; color: #666666;">배터리 / 충전</th>
            <td style="padding: 8px 12px; font-weight: 500;">5,000 mAh / 33W 유선 고속 충전 (어댑터 기본 제공)</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee; background-color: #fcfcfc;">
            <th style="padding: 8px 12px; color: #666666;">카메라</th>
            <td style="padding: 8px 12px; font-weight: 500; color: #d84315;">후면 1억 800만 화소 메인 + 800만 초광각 + 200만 접사</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <th style="padding: 8px 12px; color: #666666;">주요 특징</th>
            <td style="padding: 8px 12px; font-weight: 500;">120Hz 주사율, 초슬림 베젤, IP54 방수방진, 듀얼 돌비 스피커</td>
          </tr>
        </table>

        <h4 style="font-size: 15px; font-weight: 700; color: #333333; margin-bottom: 8px;">실질적인 강점과 아쉬운 점</h4>
        <p style="font-size: 15px; margin-top: 0; margin-bottom: 15px; text-align: justify;">
          홍미노트 13의 화면을 켜는 순간 가장 먼저 감탄하게 되는 것은 바로 <strong>베젤(테두리)의 두께</strong>입니다. 보급형 특유의 두꺼운 구라베젤이나 하단 턱이 거의 없어 50~60만 원대 중상급기 스마트폰과 비교해도 밀리지 않는 시각적 몰입감을 줍니다. 게다가 <strong>120Hz의 고주사율</strong> 아몰레드 패널은 화면을 쓸어내릴 때 매우 매끄러운 스크롤을 선사합니다. 카메라는 무려 <strong>1억 800만 화소</strong>로, 밝은 주간 야외 촬영 시 플래그십 못지않은 극상의 디테일을 묘사해 냅니다.
        </p>
        <p style="font-size: 15px; margin-top: 0; margin-bottom: 20px; text-align: justify;">
          아쉬운 부분은 탑재된 <strong>스냅드래곤 685 AP</strong>의 그래픽 성능입니다. 웹서핑이나 4K 영상 스트리밍은 쾌적하게 구동하지만, 사양이 높은 3D 게임을 부드럽게 구동하기에는 무리가 있습니다. 또한 국내 정발판 기준으로도 당연히 삼성페이와 같은 국내 특화 페이 서비스는 사용할 수 없습니다. 따라서 게임 비중이 낮고, 넓고 시원한 고화질 화면으로 미디어를 감상하거나 서브 카메라가 필요한 분들에게 최고의 가성비 픽입니다.
        </p>

        <!-- 구매 링크 버튼 -->
        <div style="text-align: center; margin: 25px 0 10px 0;">
          <a href="https://search.danawa.com/dsearch.php?query=샤오미+홍미노트+13+자급제" target="_blank" style="display: inline-block; background-color: #ff6f00; color: #ffffff; padding: 12px 28px; border-radius: 30px; font-weight: 700; font-size: 15px; text-decoration: none; box-shadow: 0 4px 10px rgba(255, 111, 0, 0.25); transition: all 0.2s;">
            홍미노트 13 다나와 최저가 비교하러 가기 →
          </a>
          <p style="font-size: 11px; font-style: italic; color: #888888; margin-top: 8px; margin-bottom: 0;">
            ※ 실시간 가격 비교 링크는 시장 상황 및 조회 시점에 따라 실제 판매 가격과 재고가 상이할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- 추천 제품 3: 샤오미 포코 M6 프로 -->
  <section style="margin-bottom: 50px;">
    <div style="border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <div style="background-color: #fffde7; padding: 20px 24px; border-bottom: 1px solid #e0e0e0;">
        <span style="background-color: #fbc02d; color: #111111; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; vertical-align: middle; margin-right: 8px;">No. 3 PERFORMANCE & CHARGING</span>
        <h2 style="font-size: 22px; font-weight: 700; color: #f57f17; margin: 8px 0 0 0; display: inline-block; vertical-align: middle;">샤오미 포코 M6 프로 (POCO M6 Pro)</h2>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #555555;">"스펙 종결자, 67W 초고속 충전과 OIS(손떨림 보정) 카메라 탑재"</p>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 15px; margin-top: 0; margin-bottom: 18px; text-align: justify;">
          샤오미의 성능 특화 서브 브랜드인 포코(POCO)의 <strong>포코 M6 프로</strong>는 보급형 스마트폰의 물리적 한계를 완전히 부숴버린 사기적인 스펙 시트를 자랑합니다. 해외 직구나 일부 국내 수입처를 통해 20만 원대 중반에 구매할 수 있는 이 제품은, 동급 보급기에서는 절대 찾아볼 수 없는 <strong>67W 초고속 충전</strong>과 메인 카메라의 <strong>OIS(광학식 손떨림 방지)</strong> 기능을 탑재했습니다.
        </p>
        
        <!-- 스펙 테이블 -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; text-align: left;">
          <tr style="border-bottom: 1px solid #eeeeee; background-color: #fcfcfc;">
            <th style="padding: 8px 12px; color: #666666; width: 30%;">프로세서 (AP)</th>
            <td style="padding: 8px 12px; font-weight: 500;">미디어텍 Helio G99-Ultra (보급형 중 최상급 성능)</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <th style="padding: 8px 12px; color: #666666;">디스플레이</th>
            <td style="padding: 8px 12px; font-weight: 500;">6.67인치 FHD+ Flow AMOLED (120Hz 주사율, 고릴라 글래스 5)</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee; background-color: #fcfcfc;">
            <th style="padding: 8px 12px; color: #666666;">메모리 / 저장공간</th>
            <td style="padding: 8px 12px; font-weight: 500; color: #2e7d32;">8GB RAM / 256GB ROM (기본 사양이 넉넉함)</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <th style="padding: 8px 12px; color: #666666;">배터리 / 충전</th>
            <td style="padding: 8px 12px; font-weight: 500; color: #c62828;">5,000 mAh / 67W 초고속 충전 (44분 만에 100% 완충)</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee; background-color: #fcfcfc;">
            <th style="padding: 8px 12px; color: #666666;">카메라</th>
            <td style="padding: 8px 12px; font-weight: 500;">후면 6,400만 화소 메인 (OIS 지원) + 800만 초광각 + 200만 접사</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <th style="padding: 8px 12px; color: #666666;">주요 특징</th>
            <td style="padding: 8px 12px; font-weight: 500;">OIS 카메라, 67W 충전기 기본 제공, 넉넉한 8GB RAM, 듀얼 스피커</td>
          </tr>
        </table>

        <h4 style="font-size: 15px; font-weight: 700; color: #333333; margin-bottom: 8px;">실질적인 강점과 아쉬운 점</h4>
        <p style="font-size: 15px; margin-top: 0; margin-bottom: 15px; text-align: justify;">
          포코 M6 프로의 가장 강력한 메리트는 <strong>8GB RAM과 256GB 저장공간</strong>이 기본 사양이라는 점입니다. 갤럭시 A16 5G의 4GB RAM 대비 두 배 용량으로, 메인폰과 다름없는 쾌적한 멀티태스킹이 가능하며 용량이 큰 앱을 여러 개 실행해도 리프레시가 거의 없습니다. 또한, <strong>67W 초고속 충전</strong>은 단 20분만 꽂아두어도 배터리를 70% 이상 채울 수 있어 충전 관리가 번거로운 서브폰에 매우 유용합니다. 게다가 이 가격대에 드물게 <strong>OIS(광학식 손떨림 방지)</strong>가 적용되어 어두운 실내나 흔들리는 차 안에서도 선명한 사진 촬영이 가능합니다.
        </p>
        <p style="font-size: 15px; margin-top: 0; margin-bottom: 20px; text-align: justify;">
          단점은 <strong>4G LTE 전용 모델</strong>이라는 점과 직구를 통할 경우 초기 세팅(한글화 및 일부 로컬 라이징)이 다소 필요할 수 있다는 점입니다. 5G 요금제를 서브폰에 굳이 쓸 필요가 없다면 LTE가 단점이 되진 않지만, 해외 직구 제품 특성상 국내 공식 서비스센터를 통한 즉각적인 사후 지원이 삼성에 비해 어렵다는 점은 감안해야 합니다. 기기 자체의 순수 성능과 스펙을 가장 중요시하는 합리적인 테크 매니아들에게 최고의 선택입니다.
        </p>

        <!-- 구매 링크 버튼 -->
        <div style="text-align: center; margin: 25px 0 10px 0;">
          <a href="https://search.danawa.com/dsearch.php?query=포코+M6+프로+자급제" target="_blank" style="display: inline-block; background-color: #f57f17; color: #ffffff; padding: 12px 28px; border-radius: 30px; font-weight: 700; font-size: 15px; text-decoration: none; box-shadow: 0 4px 10px rgba(245, 127, 23, 0.25); transition: all 0.2s;">
            포코 M6 프로 다나와 최저가 비교하러 가기 →
          </a>
          <p style="font-size: 11px; font-style: italic; color: #888888; margin-top: 8px; margin-bottom: 0;">
            ※ 실시간 가격 비교 링크는 시장 상황 및 조회 시점에 따라 실제 판매 가격과 재고가 상이할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- 용도별 비교 분석 카드 (종합 비교 표) -->
  <section style="margin-bottom: 50px;">
    <h3 style="font-size: 20px; font-weight: 700; color: #111111; margin-bottom: 20px; border-bottom: 1px solid #dddddd; padding-bottom: 8px;">
      한눈에 비교하는 용도별 추천 가이드
    </h3>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 30px;">
      
      <!-- 카드 1 -->
      <div style="background-color: #f1f8ff; border: 1px solid #c8e1ff; border-radius: 12px; padding: 20px; text-align: center;">
        <span style="font-size: 24px;">💼</span>
        <h4 style="margin: 10px 0 6px 0; font-size: 16px; font-weight: 700; color: #0366d6;">업무 & 대중교통용</h4>
        <p style="margin: 0; font-size: 13px; color: #586069; line-height: 1.5;">
          삼성페이 결제, 지하철/버스 교통카드 사용이 잦고 오랫동안 업데이트를 받으며 쓸 업무용 투폰이 필요한 분.
        </p>
        <span style="display: inline-block; margin-top: 12px; font-size: 12px; font-weight: 700; color: #052c5c; background-color: #dbedff; padding: 3px 8px; border-radius: 4px;">
          추천: 갤럭시 A16 5G
        </span>
      </div>

      <!-- 카드 2 -->
      <div style="background-color: #fffaf0; border: 1px solid #ffd8a8; border-radius: 12px; padding: 20px; text-align: center;">
        <span style="font-size: 24px;">🎬</span>
        <h4 style="margin: 10px 0 6px 0; font-size: 16px; font-weight: 700; color: #d9480f;">유튜브 & 영상 시청용</h4>
        <p style="margin: 0; font-size: 13px; color: #6d4c41; line-height: 1.5;">
          탁 트인 초슬림 베젤 화면, 선명한 120Hz 아몰레드 디스플레이로 침대 위나 대중교통에서 영상 감상을 주로 하실 분.
        </p>
        <span style="display: inline-block; margin-top: 12px; font-size: 12px; font-weight: 700; color: #862e09; background-color: #ffe8cc; padding: 3px 8px; border-radius: 4px;">
          추천: 홍미노트 13 4G
        </span>
      </div>

      <!-- 카드 3 -->
      <div style="background-color: #fcfcf0; border: 1px solid #e9ecef; border-radius: 12px; padding: 20px; text-align: center;">
        <span style="font-size: 24px;">🎮</span>
        <h4 style="margin: 10px 0 6px 0; font-size: 16px; font-weight: 700; color: #f57f17;">서브게임 & 내비 배달용</h4>
        <p style="margin: 0; font-size: 13px; color: #495057; line-height: 1.5;">
          배달 라이더용 내비게이션, 모바일 게임 방치형 구동, 잦은 화면 켬으로 빠른 충전 및 넉넉한 램이 필요하신 분.
        </p>
        <span style="display: inline-block; margin-top: 12px; font-size: 12px; font-weight: 700; color: #e65100; background-color: #fff9db; padding: 3px 8px; border-radius: 4px;">
          추천: 포코 M6 프로
        </span>
      </div>
      
    </div>
  </section>

  <!-- 서브폰 세팅 꿀팁 -->
  <section style="background-color: #f8f9fa; border-radius: 16px; padding: 28px; margin-bottom: 40px; border: 1px solid #e9ecef;">
    <h3 style="font-size: 18px; font-weight: 700; color: #111111; margin-top: 0; margin-bottom: 18px;">
      💡 스마트하게 서브폰 세팅하고 유지비 아끼는 방법
    </h3>
    
    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 15px; font-weight: 700; color: #333333; margin: 0 0 8px 0;">1. 기존 스마트폰에서 간편하게 데이터 이전하기</h4>
      <p style="font-size: 14px; color: #555555; margin: 0 0 12px 0; text-align: justify;">
        새로운 서브폰을 구매했다면 연락처, 사진, 기존 앱들을 일일이 설치할 필요 없이 각 제조사가 제공하는 공식 마이그레이션 앱을 이용하세요. 무선 와이파이 연결을 통해 단 몇 분 만에 기존 폰의 데이터를 그대로 복사할 수 있습니다.
      </p>
      
      <!-- 마이그레이션 다운로드 버튼 링크들 -->
      <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 15px;">
        <a href="https://play.google.com/store/apps/details?id=com.sec.android.easyMover" target="_blank" style="display: inline-block; background-color: #1e88e5; color: white; padding: 8px 16px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          구글 플레이스토어: Smart Switch (삼성)
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.miui.miuploader" target="_blank" style="display: inline-block; background-color: #ff6f00; color: white; padding: 8px 16px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          구글 플레이스토어: Mi Mover (샤오미/포코)
        </a>
      </div>
    </div>

    <div>
      <h4 style="font-size: 15px; font-weight: 700; color: #333333; margin: 0 0 8px 0;">2. 알뜰폰(MVNO) 꿀조합으로 통신 요금 극초가성비 달성</h4>
      <p style="font-size: 14px; color: #555555; margin: 0; text-align: justify;">
        서브폰에 값비싼 이통 3사 요금제를 가입하는 것은 낭비입니다. 알뜰폰 통신사의 <strong>'0원 요금제(특정 개월 프로모션)'</strong>나 월 5,000원~9,900원대의 <strong>데이터/통화 무제한(QoS 적용) 요금제</strong>를 선택하면 한 달 커피 한 잔 값으로 완벽한 세컨드 라인을 유지할 수 있습니다. 특히 물리 SIM 카드 외에 디지털 eSIM 가입을 지원하는 모델의 경우 대리점 방문 없이 온라인으로 10분 만에 개통할 수 있어 편리합니다.
      </p>
    </div>
  </section>

  <!-- 결론 및 아웃트로 -->
  <section style="border-top: 1px solid #eeeeee; padding-top: 30px; margin-bottom: 20px;">
    <h3 style="font-size: 20px; font-weight: 700; color: #111111; margin-top: 0; margin-bottom: 15px;">결론: 나에게 맞는 최선의 선택은?</h3>
    <p style="font-size: 15px; margin-bottom: 15px; text-align: justify;">
      2026년 현재 30만 원 이하 보급형 안드로이드 스마트폰 시장은 단순한 '저가폰'을 넘어 각자의 뚜렷한 개성과 강점을 가진 훌륭한 디바이스들이 채우고 있습니다.
    </p>
    <p style="font-size: 15px; margin-bottom: 15px; text-align: justify;">
      탄탄한 기본기와 대기업의 A/S, 국내 금융 결제(삼성페이) 생태계 및 6년이라는 긴 보안 수명을 누리고 싶다면 단연 <strong>삼성 갤럭시 A16 5G</strong>가 정답입니다. 반면, 영상 시청 및 동영상 미디어 소비가 주 목적이며 시각적 시원함을 원한다면 얇은 베젤의 120Hz 화면을 가진 <strong>샤오미 홍미노트 13 4G</strong>가 최선의 선택입니다. 마지막으로, 고용량 멀티태스킹 램 성능과 눈 깜짝할 새 완충되는 67W 초고속 충전, 흔들림 없는 촬영을 지원하는 OIS 카메라 등의 고스펙을 원하신다면 <strong>샤오미 포코 M6 프로</strong>를 따라올 대안이 없습니다.
    </p>
    <p style="font-size: 15px; margin-bottom: 0; text-align: justify;">
      자신이 서브폰을 도입하려는 명확한 목적과 우선순위를 대조해 본다면, 30만 원이라는 합리적인 예산 안에서도 삶의 질을 극적으로 향상시켜 줄 최고의 파트너를 만날 수 있을 것입니다.
    </p>
  </section>
  
  <footer style="margin-top: 50px; border-top: 1px solid #111111; padding-top: 20px; text-align: center; color: #888888; font-size: 12px;">
    <p style="margin: 0;">© 2026 Tech Editorial Team. All rights reserved.</p>
  </footer>

</div>
"""

# JSON 포맷 구성
post_data = {
    "title": title,
    "content": content.strip(),
    "labels": ["가성비 스마트폰", "서브폰 추천", "30만원 이하 스마트폰", "갤럭시 A16", "홍미노트 13", "포코 M6 Pro"],
    "images": []
}

# 1. 포스트 파일 쓰기
with open("D:/work/blogger/pending-posts/1782622398219.json", "w", encoding="utf-8") as f:
    json.dump(post_data, f, ensure_ascii=False, indent=2)

print("포스트 데이터 저장 완료: D:/work/blogger/pending-posts/1782622398219.json")

# 2. 요청 키워드 파일 읽기 및 status 업데이트
req_file_path = "D:/work/blogger/requested-keywords/1782622398219.json"
if os.path.exists(req_file_path):
    with open(req_file_path, "r", encoding="utf-8") as f:
        req_data = json.load(f)
    
    req_data["status"] = "completed"
    
    with open(req_file_path, "w", encoding="utf-8") as f:
        json.dump(req_data, f, ensure_ascii=False, indent=2)
    print("요청 상태 업데이트 완료 (completed): D:/work/blogger/requested-keywords/1782622398219.json")
else:
    print("요청 키워드 파일을 찾을 수 없습니다.")
