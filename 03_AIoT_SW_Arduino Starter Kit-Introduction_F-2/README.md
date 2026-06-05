# Playino : Escape Room

Arduino Uno + 실물 센서로 푸는 피지컬 컴퓨팅 탈출 게임. (Eduino)
실물 장치 조작이 곧 게임 메카닉 → 학습목표(IoT 개념·피지컬 코딩)를 체험으로 흡수.

## 스택
- Phaser 3 (v3.90) · Vite 6 · 바닐라 JS (ES Modules)
- 해상도 1280×720 (FIT + CENTER_BOTH), 배경 2560×1440 PNG 16:9
- 하드웨어 연결: **Web Serial** (Chrome/Edge 데스크톱), Baud 115200
- 배포: Vercel 정적, 상태 저장: localStorage (백엔드 없음)

## 실행
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ → Vercel
```

## 현재 상태 (플레이 가능한 프로토타입)
**에피소드 1 — 우주 정거장 SOS** 전체 흐름이 돌아갑니다.
흐름: Boot → Splash(EDDIE) → Title → Login(8자리 코드) → **Episode**
(콜드오픈 → EDDIE 출동 → 미션1~5 → 코어 재가동 → 기억 조각 → 예고)

### 조작 (키트 없이 키보드로 플레이 — 시뮬레이션 모드)
- 시네마틱/대사 진행: **클릭 또는 Space**
- 미션1 도킹: **↑ 가까이 / ↓ 멀리**
- 미션2 자세: **← →**
- 미션3 생명유지: **W/S 온도, A/D 습도**
- 미션4 전력: **Q/E 각도**
- 미션5 코어(보스): **← → + Q/E 동시** (드리프트 발생, 양손 교정)
- 우상단 **[기기 연결]**: 실물 Arduino + Chrome이면 Web Serial로 전환

아트는 절차적 플레이스홀더 → Gemini PNG를 `public/assets/<장면>/`에 넣으면 교체됨.

### 서사 엔진 (재사용 핵심)
스토리는 데이터: `src/game/episodes/space-station/script.js`의 `SCRIPT` 배열만 교체하면 새 에피소드. 엔진(`src/story/`)은 그대로 재사용.

