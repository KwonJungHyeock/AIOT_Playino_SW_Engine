import Phaser from 'phaser';
import config from './game/config.js';

// Phaser 캔버스는 1회 렌더 → 부팅 전 폰트 로드 보장 (스펙 §4)
async function loadFonts() {
  if (!document.fonts) return;
  const specs = [
    '900 48px Orbitron', '700 24px Orbitron',
    '700 24px "Space Grotesk"', '400 18px "Space Grotesk"',
    '700 24px Pretendard', '400 18px Pretendard',
  ];
  try {
    await Promise.all(specs.map((s) => document.fonts.load(s)));
    await document.fonts.ready;
  } catch (e) {
    console.warn('[fonts] fallback:', e);
  }
}

loadFonts().then(() => new Phaser.Game(config));
