import Phaser from 'phaser';
import { NUM, COLORS, FONTS } from '../shared/theme.js';

// 절차적 캐릭터 초상 (아트 교체 전). EDDIE=청록 눈, AURORA=정거장 관제 AI.
export function makePortrait(scene, who) {
  const c = scene.add.container(0, 0);
  const color = who === 'AURORA' ? NUM.info : NUM.eddie;
  const ring = scene.add.circle(0, 0, 30, NUM.bg2).setStrokeStyle(2, color, 0.6);
  c.add(ring);
  if (who === 'AURORA') {
    // 동심원 코어
    const a = scene.add.circle(0, 0, 8, color).setBlendMode(1);
    const b = scene.add.circle(0, 0, 16, color).setStrokeStyle(1.5, color, 0.5);
    c.add([b, a]);
  } else {
    const l = scene.add.circle(-10, -2, 6, color).setBlendMode(1);
    const r = scene.add.circle(10, -2, 6, color).setBlendMode(1);
    c.add([l, r]);
  }
  return c;
}

export function speakerColor(who) {
  return who === 'AURORA' ? COLORS.info : COLORS.eddie;
}
export const SPEAKER_FONT = FONTS.display;
