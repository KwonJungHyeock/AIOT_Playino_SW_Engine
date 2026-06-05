# Claude Code 작업 핸드오프

## 이미 만들어진 것 (수정 최소화)
- 빌드/설정: `package.json`, `vite.config.js`, `index.html`
- 공통: `src/shared/theme.js` (해상도·팔레트·폰트·씬키)
- 전환/폴백: `src/game/fx/transition.js`(goTo/fadeIn), `src/game/fx/textures.js`(글로우·비네트)
- 에셋: `src/game/assets.js` (queueSceneBg / placeBg, cover + 절차적 폴백)
- 객체: `Button`, `Eddie`(마스코트), `CodeInput`
- 씬: Boot→Preload→Splash→Title→Login→ComingSoon (동작 셸)
- 하드웨어: `src/hw/SerialManager.js`(Web Serial) + `src/hw/protocol.js`(S:/C: 규약)
  - 아두이노→웹: `S:dist=42,tilt=15,btn=1\n`
  - 웹→아두이노: `C:SERVO:90\n`

## TODO (컨셉 확정 후)
1. ComingSoon → `HubScene`(방 선택) + `RoomScene`(센서 퍼즐) 로 교체
2. 각 Room에서 SerialManager 구독:
   ```js
   const serial = new SerialManager({ baudRate: 115200 });
   serial.on('data', (d) => { /* d.dist, d.tilt ... 로 퍼즐 갱신 */ });
   serial.on('error', (e) => { /* 드라이버 안내 / Wokwi 우회 */ });
   // '기기 연결' 버튼 클릭 핸들러 안에서:
   await serial.connect();
   ```
3. ConnectScene 추가: 드라이버(CH340) 안내 + 연결 실패 시 Wokwi 폴백
4. 각 장면 배경: Gemini 생성 PNG(2560×1440)를 `public/assets/<장면>/bg.png`로 저장 → 자동 인식

## 절대 규칙
- 좌표는 전부 1280×720 기준. 배경 위 작동영역은 같은 좌표계 투명 zone으로.
- 씬 shutdown/destroy에서 타이머·리스너·시리얼 해제 (누수 금지).
- 유료 엔진/유료 라이브러리 금지.
