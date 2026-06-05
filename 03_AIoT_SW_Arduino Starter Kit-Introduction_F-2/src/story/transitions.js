import { BASE, NUM } from '../shared/theme.js';

const tween = (scene, cfg) => new Promise((res) => scene.tweens.add({ ...cfg, onComplete: res }));

// 비트 시작 시 검정에서 페이드 인 (구두점)
export function coverIn(scene, dur = 320) {
  const r = scene.add.rectangle(0, 0, BASE.w, BASE.h, NUM.bg).setOrigin(0).setDepth(94000);
  return tween(scene, { targets: r, alpha: 0, duration: dur, onComplete: () => r.destroy() })
    .then(() => r.destroy());
}

// 미션 성공: 앰버→청록 가로 스윕
export function systemOnline(scene) {
  const s = scene.add.rectangle(0, BASE.h / 2, BASE.w, 4, NUM.eddie).setOrigin(0, 0.5).setDepth(95000).setAlpha(0.9).setBlendMode(1);
  return tween(scene, { targets: s, scaleY: 200, alpha: 0, duration: 640, ease: 'Quad.out' }).then(() => s.destroy());
}

// 기억 조각: 파편적 청록 플리커 (시리즈 시그니처)
export function memoryFlicker(scene) {
  const ov = scene.add.rectangle(0, 0, BASE.w, BASE.h, NUM.eddie).setOrigin(0).setDepth(96000).setAlpha(0).setBlendMode(1);
  return tween(scene, { targets: ov, alpha: 0.35, duration: 90, yoyo: true, repeat: 5, ease: 'Steps' }).then(() => ov.destroy());
}
