import Docking from './missions/Docking.js';
import Attitude from './missions/Attitude.js';
import LifeSupport from './missions/LifeSupport.js';
import Power from './missions/Power.js';
import CoreBoss from './missions/CoreBoss.js';

// 미션 이름 → 컨트롤러
export const MISSIONS = { docking: Docking, attitude: Attitude, lifesupport: LifeSupport, power: Power, core: CoreBoss };

// 에피소드 1 대본. 새 에피소드는 이 배열 + 에셋만 교체.
export const SCRIPT = [
  { type: 'cinematic', speaker: 'AURORA',
    lines: ['…구조… 요청…', '정거장 오로라… 시스템… 전부… 정지…', '운석… 충돌… 누구든… 응답…'] },

  { type: 'cinematic', speaker: 'EDDIE',
    lines: ['SOS 수신. IoT 구조대 EDDIE, 출동한다.', '네 손에 있는 모듈이 곧 내 감각이야.', '그걸로 정거장을 하나씩 되살리자.'] },

  { type: 'cinematic', speaker: 'EDDIE', lines: ['정거장에 접근 중… 먼저 도킹부터.'] },

  { type: 'mission', mission: 'docking',
    briefing: { objective: '도킹 포트까지 거리를 맞춰 천천히 붙여라.', eddie: '초음파로 거리를 잴게. 구간 안에서 멈춰.' },
    interjections: [
      { at: 'start', speaker: 'EDDIE', line: '거리 측정 시작. 천천히.' },
      { at: 'half', speaker: 'EDDIE', line: '좋아, 거의 다 왔어…' },
      { at: 'success', speaker: 'AURORA', line: '…진입… 감지…' }],
    debrief: [{ speaker: 'EDDIE', line: '도킹 완료. 해치가 열린다.' }] },

  { type: 'mission', mission: 'attitude',
    briefing: { objective: '충돌로 정거장이 기울었다. 자세를 수평으로.', eddie: '자이로에 접속했어. 기울기 센서로 맞춰.' },
    interjections: [
      { at: 'start', speaker: 'EDDIE', line: '중심축이 흔들려. 침착하게.' },
      { at: 'half', speaker: 'EDDIE', line: '거의 수평이야!' },
      { at: 'success', speaker: 'AURORA', line: '인공중력… 복귀…' }],
    debrief: [{ speaker: 'EDDIE', line: '자세 안정. 다음은 거주 모듈이야.' }] },

  { type: 'mission', mission: 'lifesupport',
    briefing: { objective: '거주 모듈의 온도·습도가 위험하다. 안전 범위로.', eddie: '온습도 센서로 환경을 읽을게. 차분히 맞춰.' },
    interjections: [
      { at: 'start', speaker: 'EDDIE', line: '공기가 차고 습해. 조정하자.' },
      { at: 'half', speaker: 'AURORA', line: '공기가… 돌아온다…' },
      { at: 'success', speaker: 'AURORA', line: '…내 기록이… 어딘가에…' }],
    debrief: [{ speaker: 'EDDIE', line: '생명유지 정상. 방금… AURORA가 뭔가 기억하려는 것 같았어.' }] },

  { type: 'mission', mission: 'power',
    briefing: { objective: '전력이 끊겼다. 태양전지판을 펼쳐 충전하라.', eddie: '서보로 패널 각도를 태양에 맞춰. 실물 키트라면 모터가 진짜로 돈다.' },
    interjections: [
      { at: 'start', speaker: 'EDDIE', line: '패널 전개. 태양을 찾아.' },
      { at: 'half', speaker: 'EDDIE', line: '전력이 차오른다!' },
      { at: 'success', speaker: 'AURORA', line: '메인 버스… 재충전…' }],
    debrief: [{ speaker: 'EDDIE', line: '전력 복구. 이제… 마지막, 메인 코어다.' }] },

  { type: 'cinematic', speaker: 'AURORA',
    lines: ['경고… 코어… 불안정…', 'EDDIE… 함께… 재시작…'] },

  { type: 'mission', mission: 'core',
    briefing: { objective: '자세와 전력을 동시에 유지해 코어를 재시작하라.', eddie: '둘 다 손에서 놓치면 안 돼. 집중하자.' },
    interjections: [
      { at: 'start', speaker: 'EDDIE', line: '시스템이 자꾸 어긋나! 양쪽 다 잡아!' },
      { at: 'half', speaker: 'EDDIE', line: '절반 넘었어, 조금만 더!' },
      { at: 'success', speaker: 'AURORA', line: '코어… 온라인.' }],
    debrief: [{ speaker: 'EDDIE', line: '재가동 성공! 정거장이… 살아난다.' }] },

  { type: 'cinematic', speaker: 'AURORA',
    lines: ['…고마워, EDDIE.', '나는 정거장 관제 AI, AURORA.', '데이터뱅크에… 너에 대한 기록이 남아 있어.'] },

  { type: 'memory', lines: ['기억 조각 #1 복원 —', '낯선 격납고… 청록빛 불빛…', '이건… 나? 내가 여길 와본 적이… 있어?'] },

  { type: 'cinematic', speaker: 'EDDIE',
    lines: ['새 좌표에서 또 다른 SOS가 잡힌다.', '다음 출동에서 보자.', '— 오늘 배운 것: 초음파(거리) · 기울기 · 온습도 · 서보(출력) · 통합 제어'] },
];
