# 기술 사양 요약 (정본)

원본 기술사양(Playino : Escape Room Tech Spec) 기준. 핵심만 발췌.

- 언어: 바닐라 JS (ES Modules), TypeScript 아님
- 엔진/빌드: Phaser 3.90 (Phaser.AUTO) · Vite 6 (base './')
- 해상도: 1280×720 논리좌표 · Scale.FIT + CENTER_BOTH
- 에셋: 배경 2560×1440 PNG (정확히 16:9), 캐릭터 PNG 투명 / `public/assets/<장면>/`
- 폰트: Orbitron(제목) · Space Grotesk(영문본문) · Pretendard(한글), 부팅 전 로드 보장
- 팔레트: 다크 네이비~블랙, EDDIE 눈빛 #6fffd6 / 비상 앰버·레드
- 톤: 으스스한 미스터리(폐연구소·비상등), 고어/폭력/위협 연출 금지 (K-12 안전)
- 규칙: 화면 1개=씬 1개, 트윈 페이드 goTo(), 발광은 BlendModes.ADD, shutdown에서 리스너 해제
- 하드웨어: Chrome 계열 + Web Serial(데스크톱), 권한은 사용자 클릭에서 요청
